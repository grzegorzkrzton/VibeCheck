import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import express from 'express'
import { Pool } from 'pg'
import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify } from 'jose'

const PORT = readPort(process.env.PORT)
const APP_VERSION = '0.2.0'
const STORE_VERSION = 2
const MAX_STORE_ITEMS = 1000
const MAX_TEXT_LENGTH = 20000
const MAX_NAME_LENGTH = 80
const JWKS_URL = 'https://authenticate.idp.zenai-apps.com/.well-known/pomerium/jwks.json'
const jwks = createRemoteJWKSet(new URL(JWKS_URL))

const MIGRATIONS = [
  {
    version: 1,
    statements: [
      `CREATE TABLE IF NOT EXISTS profiles (
        id text PRIMARY KEY,
        auth_subject text NOT NULL UNIQUE,
        email text NOT NULL UNIQUE,
        first_name text NOT NULL DEFAULT '',
        last_name text NOT NULL DEFAULT '',
        display_name text NOT NULL DEFAULT '',
        avatar_url text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`,
      `CREATE TABLE IF NOT EXISTS prototypes (
        id text PRIMARY KEY,
        normalized_url text NOT NULL UNIQUE,
        title text NOT NULL DEFAULT '',
        created_by text REFERENCES profiles(id) ON DELETE SET NULL,
        revision integer NOT NULL DEFAULT 0 CHECK (revision >= 0),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`,
      `CREATE TABLE IF NOT EXISTS comments (
        id text PRIMARY KEY,
        prototype_id text NOT NULL REFERENCES prototypes(id) ON DELETE CASCADE,
        author_id text NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
        author_name text NOT NULL DEFAULT '',
        body text NOT NULL DEFAULT '',
        type text NOT NULL DEFAULT 'note' CHECK (type IN ('note', 'annotation')),
        kind text,
        resolved boolean NOT NULL DEFAULT false,
        read_at timestamptz,
        parent_id text,
        parent_suggestion_id text,
        anchor jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`,
      `CREATE TABLE IF NOT EXISTS content_suggestions (
        id text PRIMARY KEY,
        prototype_id text NOT NULL REFERENCES prototypes(id) ON DELETE CASCADE,
        author_id text NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
        author_name text NOT NULL DEFAULT '',
        original_text text NOT NULL DEFAULT '',
        suggested_text text NOT NULL DEFAULT '',
        rationale text NOT NULL DEFAULT '',
        status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'applied')),
        resolved boolean NOT NULL DEFAULT false,
        read_at timestamptz,
        anchor jsonb NOT NULL DEFAULT '{}'::jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )`,
      'CREATE INDEX IF NOT EXISTS comments_prototype_id_idx ON comments (prototype_id, created_at)',
      'CREATE INDEX IF NOT EXISTS suggestions_prototype_id_idx ON content_suggestions (prototype_id, created_at)',
      'CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (lower(email))',
    ],
  },
]

let pool

const app = express()

app.disable('x-powered-by')
app.use(express.json({ limit: '256kb' }))
app.use(requestId)
app.use(cors)

app.get('/healthz', (_req, res) => {
  res.json({
    ok: true,
    service: 'vibecheck-app-foundry-api',
    version: APP_VERSION,
  })
})

// Protected smoke-test endpoint for validating App Foundry identity.
app.get('/api/v1/auth/context', requireAppFoundryIdentity, (req, res) => {
  const { payload } = req.appFoundryIdentity

  res.json({
    authenticated: true,
    subject: payload.sub || null,
    email: payload.email || null,
    name: payload.name || null,
    issuer: payload.iss || null,
    audience: payload.aud || null,
    expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null,
  })
})

// Browser handoff endpoint for the extension. It deliberately returns a
// small human-readable page instead of exposing an API response in a tab.
app.get('/auth/complete', requireAppFoundryIdentity, (_req, res) => {
  res.set('Content-Security-Policy', "default-src 'none'; style-src 'unsafe-inline'")
  res.type('html').send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VibeCheck sign-in complete</title>
  <style>
    :root { color-scheme: dark; font-family: system-ui, sans-serif; }
    body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #17191c; color: #f9fafa; }
    main { width: min(420px, calc(100% - 32px)); padding: 32px; box-sizing: border-box; border-radius: 16px; background: #2e3138; text-align: center; }
    h1 { margin: 0 0 12px; font-size: 24px; }
    p { margin: 0; color: #abb0ba; line-height: 1.5; }
  </style>
</head>
<body>
  <main>
    <h1>You’re signed in</h1>
    <p>Return to the VibeCheck account settings tab to continue.</p>
  </main>
</body>
</html>`)
})

app.get('/api/v1/me', requireAppFoundryIdentity, async (req, res) => {
  const identity = getIdentity(req)
  const profile = await withTransaction(client => ensureProfile(client, identity))

  res.json({
    profile: serializeProfile(profile),
    onboardingComplete: Boolean(profile.first_name && profile.last_name),
  })
})

app.put('/api/v1/me', requireAppFoundryIdentity, async (req, res) => {
  const identity = getIdentity(req)
  const firstName = readRequiredName(req.body?.firstName, 'firstName')
  const lastName = readRequiredName(req.body?.lastName, 'lastName')

  const profile = await withTransaction(async client => {
    const current = await ensureProfile(client, identity)
    const displayName = `${firstName} ${lastName}`.trim()
    const result = await client.query(
      `UPDATE profiles
       SET first_name = $1,
           last_name = $2,
           display_name = $3,
           updated_at = now()
       WHERE id = $4
       RETURNING *`,
      [firstName, lastName, displayName, current.id],
    )
    return result.rows[0]
  })

  res.json({
    profile: serializeProfile(profile),
    onboardingComplete: true,
  })
})

app.get('/api/v1/store', requireAppFoundryIdentity, async (req, res) => {
  const url = normalizePrototypeUrl(readQueryString(req.query.url, 'url'))
  const database = getPool()
  const prototypeResult = await database.query(
    'SELECT * FROM prototypes WHERE normalized_url = $1',
    [url],
  )

  if (!prototypeResult.rows[0]) return res.json(emptyStore(url))

  res.json(await readStore(database, prototypeResult.rows[0]))
})

app.put('/api/v1/store', requireAppFoundryIdentity, async (req, res) => {
  const identity = getIdentity(req)
  const url = normalizePrototypeUrl(req.body?.url)
  const state = readStoreInput(req.body?.state)
  const revision = readOptionalRevision(req.body?.revision)
  const title = readOptionalTrimmedText(req.body?.title, 'title', 200)

  const store = await withTransaction(async client => {
    const profile = await ensureProfile(client, identity)
    let prototypeResult = await client.query(
      'SELECT * FROM prototypes WHERE normalized_url = $1 FOR UPDATE',
      [url],
    )

    if (!prototypeResult.rows[0]) {
      prototypeResult = await client.query(
        `INSERT INTO prototypes (id, normalized_url, title, created_by)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [crypto.randomUUID(), url, title || url, profile.id],
      )
    }

    let prototype = prototypeResult.rows[0]
    if (revision !== undefined && revision !== prototype.revision) {
      throw httpError(
        409,
        'STORE_CONFLICT',
        'The store changed since it was loaded. Reload it before saving again.',
      )
    }

    if (title && title !== prototype.title) {
      const updatedPrototype = await client.query(
        `UPDATE prototypes
         SET title = $1, updated_at = now()
         WHERE id = $2
         RETURNING *`,
        [title, prototype.id],
      )
      prototype = updatedPrototype.rows[0]
    }

    const comments = state.comments.map((item, index) => readCommentInput(item, index))
    const suggestions = state.suggestions.map((item, index) => readSuggestionInput(item, index))
    assertUniqueIds(comments, 'comments')
    assertUniqueIds(suggestions, 'suggestions')

    await upsertComments(client, prototype.id, profile, comments)
    await upsertSuggestions(client, prototype.id, profile, suggestions)
    await deleteMissingOwnedRows(client, 'comments', prototype.id, profile.id, comments.map(item => item.id))
    await deleteMissingOwnedRows(client, 'content_suggestions', prototype.id, profile.id, suggestions.map(item => item.id))

    const revisionResult = await client.query(
      `UPDATE prototypes
       SET revision = revision + 1, updated_at = now()
       WHERE id = $1
       RETURNING *`,
      [prototype.id],
    )

    return readStore(client, revisionResult.rows[0])
  })

  res.json(store)
})

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `No route for ${req.method} ${req.path}`,
      requestId: req.id,
    },
  })
})

app.use((error, req, res, _next) => {
  if (res.headersSent) return

  const status = Number.isInteger(error.status) ? error.status : 500
  const code = error.code || (status >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR')
  const message = status >= 500 ? 'The server could not complete the request.' : error.message

  if (status >= 500) console.error(`[${req.id}] ${error.stack || error.message}`)

  res.status(status).json({
    error: {
      code,
      message,
      requestId: req.id,
    },
  })
})

function readPort(value) {
  const port = Number(value || 8080)
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('PORT must be an integer between 1 and 65535.')
  return port
}

function requestId(req, res, next) {
  req.id = req.get('X-Request-Id') || crypto.randomUUID()
  res.set('X-Request-Id', req.id)
  next()
}

function cors(req, res, next) {
  const origin = req.get('Origin')
  const allowedOrigins = parseList(process.env.ALLOWED_ORIGINS)

  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin)
    res.set('Access-Control-Allow-Credentials', 'true')
    res.set('Vary', 'Origin')
    res.set('Access-Control-Allow-Headers', 'Content-Type, X-Pomerium-Jwt-Assertion, X-Pomerium-Jwt, X-Request-Id')
    res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS')
  }

  if (req.method === 'OPTIONS') {
    if (!origin || allowedOrigins.includes(origin)) return res.sendStatus(204)
    return res.status(403).json({
      error: {
        code: 'CORS_ORIGIN_DENIED',
        message: 'The request origin is not configured for this application.',
        requestId: req.id,
      },
    })
  }

  next()
}

function parseList(value = '') {
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

async function requireAppFoundryIdentity(req, _res, next) {
  const token = req.get('X-Pomerium-Jwt-Assertion') || req.get('X-Pomerium-Jwt')

  if (!token) return next(httpError(401, 'AUTH_REQUIRED', 'App Foundry identity is required.'))

  const normalizedToken = token.replace(/^Bearer\s+/i, '')
  const metadata = readJwtMetadata(normalizedToken)

  try {
    const { payload, protectedHeader } = await jwtVerify(normalizedToken, jwks, {
      // Pomerium may publish RSA or P-256 signing keys. Keep this allowlist
      // explicit; never accept symmetric or unsigned JWT algorithms.
      algorithms: ['RS256', 'ES256'],
      requiredClaims: ['exp', 'email'],
      ...optionalJwtConstraints(),
    })

    req.appFoundryIdentity = { payload, protectedHeader }
    next()
  }
  catch (error) {
    console.warn(`[${req.id}] Pomerium JWT verification failed`, {
      algorithm: metadata.algorithm,
      keyId: metadata.keyId,
      error: error.code || error.name || 'UNKNOWN_JWT_ERROR',
    })
    next(httpError(401, 'AUTH_INVALID', 'The App Foundry identity could not be verified.', error))
  }
}

function readJwtMetadata(token) {
  try {
    const header = decodeProtectedHeader(token)
    return {
      algorithm: header.alg || null,
      keyId: header.kid || null,
    }
  }
  catch {
    return {
      algorithm: null,
      keyId: null,
    }
  }
}

function optionalJwtConstraints() {
  const constraints = {}
  if (process.env.POMERIUM_ISSUER) constraints.issuer = process.env.POMERIUM_ISSUER
  if (process.env.POMERIUM_AUDIENCE) constraints.audience = process.env.POMERIUM_AUDIENCE
  return constraints
}

function getIdentity(req) {
  const payload = req.appFoundryIdentity?.payload || {}
  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  if (!email) throw httpError(401, 'AUTH_INVALID', 'The App Foundry identity has no email address.')

  return {
    subject: typeof payload.sub === 'string' && payload.sub.trim() ? payload.sub.trim() : email,
    email,
    name: readIdentityText(payload.name) || email,
    avatarUrl: readIdentityText(payload.picture) || readIdentityText(payload.avatar_url),
  }
}

function getPool() {
  if (pool) return pool

  const required = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD']
  const missing = required.filter(name => !process.env[name])
  if (missing.length) {
    throw httpError(500, 'DB_CONFIG_MISSING', `Missing database configuration: ${missing.join(', ')}`)
  }

  pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 5,
    idleTimeoutMillis: 30000,
  })
  return pool
}

async function ensureSchema(database = getPool()) {
  const client = await database.connect()
  try {
    await client.query('BEGIN')
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version integer PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `)

    const applied = await client.query('SELECT version FROM schema_migrations ORDER BY version')
    const appliedVersions = new Set(applied.rows.map(row => row.version))

    for (const migration of MIGRATIONS) {
      if (appliedVersions.has(migration.version)) continue
      for (const statement of migration.statements) await client.query(statement)
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [migration.version])
    }

    await client.query('COMMIT')
  }
  catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  }
  finally {
    client.release()
  }
}

async function withTransaction(work) {
  const client = await getPool().connect()
  try {
    await client.query('BEGIN')
    const result = await work(client)
    await client.query('COMMIT')
    return result
  }
  catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    throw error
  }
  finally {
    client.release()
  }
}

async function ensureProfile(client, identity) {
  const existing = await client.query(
    `SELECT * FROM profiles
     WHERE auth_subject = $1 OR lower(email) = $2
     ORDER BY CASE WHEN auth_subject = $1 THEN 0 ELSE 1 END
     LIMIT 1
     FOR UPDATE`,
    [identity.subject, identity.email],
  )

  if (existing.rows[0]) {
    const result = await client.query(
      `UPDATE profiles
       SET auth_subject = $1,
           email = $2,
           display_name = CASE WHEN display_name = '' THEN $3 ELSE display_name END,
           avatar_url = COALESCE($4, avatar_url),
           updated_at = now()
       WHERE id = $5
       RETURNING *`,
      [identity.subject, identity.email, identity.name, identity.avatarUrl || null, existing.rows[0].id],
    )
    return result.rows[0]
  }

  const result = await client.query(
    `INSERT INTO profiles (id, auth_subject, email, display_name, avatar_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [crypto.randomUUID(), identity.subject, identity.email, identity.name, identity.avatarUrl || null],
  )
  return result.rows[0]
}

function serializeProfile(profile) {
  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }
}

function emptyStore(url) {
  return {
    version: STORE_VERSION,
    source: 'remote',
    url,
    prototypeId: null,
    revision: 0,
    comments: [],
    suggestions: [],
    notifications: [],
  }
}

async function readStore(databaseOrClient, prototype) {
  const commentsResult = await databaseOrClient.query(
    `SELECT id, type, kind, body, resolved, parent_id, parent_suggestion_id,
            read_at, anchor, created_at, updated_at, author_name
     FROM comments
     WHERE prototype_id = $1
     ORDER BY created_at ASC, id ASC`,
    [prototype.id],
  )
  const suggestionsResult = await databaseOrClient.query(
    `SELECT id, original_text, suggested_text, rationale, status, resolved,
            read_at, anchor, created_at, updated_at, author_name
     FROM content_suggestions
     WHERE prototype_id = $1
     ORDER BY created_at ASC, id ASC`,
    [prototype.id],
  )

  return {
    version: STORE_VERSION,
    source: 'remote',
    url: prototype.normalized_url,
    prototypeId: prototype.id,
    revision: prototype.revision,
    comments: commentsResult.rows.map(serializeComment),
    suggestions: suggestionsResult.rows.map(serializeSuggestion),
    notifications: [],
  }
}

async function upsertComments(client, prototypeId, profile, comments) {
  for (const comment of comments) {
    await client.query(
      `INSERT INTO comments (
         id, prototype_id, author_id, author_name, body, type, kind, resolved,
         read_at, parent_id, parent_suggestion_id, anchor, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::timestamptz, $10, $11, $12, $13::timestamptz)
       ON CONFLICT (id) DO UPDATE SET
         author_name = EXCLUDED.author_name,
         body = EXCLUDED.body,
         type = EXCLUDED.type,
         kind = EXCLUDED.kind,
         resolved = EXCLUDED.resolved,
         read_at = EXCLUDED.read_at,
         parent_id = EXCLUDED.parent_id,
         parent_suggestion_id = EXCLUDED.parent_suggestion_id,
         anchor = EXCLUDED.anchor,
         updated_at = now()
       WHERE comments.author_id = EXCLUDED.author_id
         AND comments.prototype_id = EXCLUDED.prototype_id`,
      [
        comment.id,
        prototypeId,
        profile.id,
        profile.display_name,
        comment.body,
        comment.type,
        comment.kind,
        comment.resolved,
        comment.readAt,
        comment.parentId,
        comment.parentSuggestionId,
        comment.anchor,
        comment.createdAt,
      ],
    )
  }
}

async function upsertSuggestions(client, prototypeId, profile, suggestions) {
  for (const suggestion of suggestions) {
    await client.query(
      `INSERT INTO content_suggestions (
         id, prototype_id, author_id, author_name, original_text, suggested_text,
         rationale, status, resolved, read_at, anchor, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::timestamptz, $11, $12::timestamptz)
       ON CONFLICT (id) DO UPDATE SET
         author_name = EXCLUDED.author_name,
         suggested_text = EXCLUDED.suggested_text,
         rationale = EXCLUDED.rationale,
         status = EXCLUDED.status,
         resolved = EXCLUDED.resolved,
         read_at = EXCLUDED.read_at,
         anchor = EXCLUDED.anchor,
         updated_at = now()
       WHERE content_suggestions.author_id = EXCLUDED.author_id
         AND content_suggestions.prototype_id = EXCLUDED.prototype_id`,
      [
        suggestion.id,
        prototypeId,
        profile.id,
        profile.display_name,
        suggestion.originalText,
        suggestion.suggestedText,
        suggestion.rationale,
        suggestion.status,
        suggestion.resolved,
        suggestion.readAt,
        suggestion.anchor,
        suggestion.createdAt,
      ],
    )
  }
}

async function deleteMissingOwnedRows(client, table, prototypeId, authorId, ids) {
  if (table !== 'comments' && table !== 'content_suggestions') throw new Error('Invalid store table.')
  await client.query(
    `DELETE FROM ${table}
     WHERE prototype_id = $1
       AND author_id = $2
       AND NOT (id = ANY($3::text[]))`,
    [prototypeId, authorId, ids],
  )
}

function serializeComment(row) {
  return {
    id: row.id,
    type: row.type,
    kind: row.kind,
    body: row.body,
    resolved: row.resolved,
    parentId: row.parent_id,
    parentSuggestionId: row.parent_suggestion_id,
    readAt: row.read_at,
    anchor: row.anchor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author_name,
  }
}

function serializeSuggestion(row) {
  return {
    id: row.id,
    originalText: row.original_text,
    suggestedText: row.suggested_text,
    rationale: row.rationale,
    status: row.status,
    resolved: row.resolved,
    readAt: row.read_at,
    anchor: row.anchor,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.author_name,
  }
}

function readStoreInput(value) {
  if (value === undefined) return { comments: [], suggestions: [] }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw httpError(400, 'INVALID_STORE', 'state must be an object.')
  }
  return {
    comments: readArray(value.comments, 'comments'),
    suggestions: readArray(value.suggestions, 'suggestions'),
  }
}

function readArray(value, field) {
  if (value === undefined) return []
  if (!Array.isArray(value)) throw httpError(400, 'INVALID_STORE', `${field} must be an array.`)
  if (value.length > MAX_STORE_ITEMS) {
    throw httpError(413, 'STORE_TOO_LARGE', `${field} cannot contain more than ${MAX_STORE_ITEMS} items.`)
  }
  return value
}

function readCommentInput(item, index) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw httpError(400, 'INVALID_COMMENT', `comments[${index}] must be an object.`)
  }
  const type = item.type || 'note'
  if (!['note', 'annotation'].includes(type)) {
    throw httpError(400, 'INVALID_COMMENT', `comments[${index}].type is invalid.`)
  }
  return {
    id: readId(item.id, `comments[${index}].id`),
    type,
    kind: readOptionalTrimmedText(item.kind, `comments[${index}].kind`, 80),
    body: readOptionalText(item.body, `comments[${index}].body`, MAX_TEXT_LENGTH) || '',
    resolved: Boolean(item.resolved),
    parentId: readOptionalId(item.parentId, `comments[${index}].parentId`),
    parentSuggestionId: readOptionalId(item.parentSuggestionId, `comments[${index}].parentSuggestionId`),
    readAt: readTimestamp(item.readAt, `comments[${index}].readAt`),
    anchor: readAnchor(item.anchor, `comments[${index}].anchor`),
    createdAt: readTimestamp(item.createdAt, `comments[${index}].createdAt`),
  }
}

function readSuggestionInput(item, index) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw httpError(400, 'INVALID_SUGGESTION', `suggestions[${index}] must be an object.`)
  }
  const status = item.status || 'pending'
  if (!['pending', 'applied'].includes(status)) {
    throw httpError(400, 'INVALID_SUGGESTION', `suggestions[${index}].status is invalid.`)
  }
  return {
    id: readId(item.id, `suggestions[${index}].id`),
    originalText: readOptionalText(item.originalText, `suggestions[${index}].originalText`, MAX_TEXT_LENGTH) || '',
    suggestedText: readOptionalText(item.suggestedText, `suggestions[${index}].suggestedText`, MAX_TEXT_LENGTH) || '',
    rationale: readOptionalText(item.rationale, `suggestions[${index}].rationale`, MAX_TEXT_LENGTH) || '',
    status,
    resolved: Boolean(item.resolved),
    readAt: readTimestamp(item.readAt, `suggestions[${index}].readAt`),
    anchor: readAnchor(item.anchor, `suggestions[${index}].anchor`),
    createdAt: readTimestamp(item.createdAt, `suggestions[${index}].createdAt`),
  }
}

function assertUniqueIds(items, field) {
  const seen = new Set()
  for (const item of items) {
    if (seen.has(item.id)) throw httpError(400, 'DUPLICATE_ID', `${field} contains duplicate id ${item.id}.`)
    seen.add(item.id)
  }
}

function readQueryString(value, field) {
  if (typeof value !== 'string' || !value.trim()) {
    throw httpError(400, 'INVALID_REQUEST', `${field} is required.`)
  }
  return value.trim()
}

function readId(value, field) {
  if (typeof value !== 'string' || !value.trim() || value.length > 128) {
    throw httpError(400, 'INVALID_ID', `${field} must be a non-empty string of at most 128 characters.`)
  }
  return value.trim()
}

function readOptionalId(value, field) {
  if (value === undefined || value === null || value === '') return null
  return readId(value, field)
}

function readRequiredName(value, field) {
  const name = readOptionalTrimmedText(value, field, MAX_NAME_LENGTH)
  if (!name) throw httpError(400, 'INVALID_PROFILE', `${field} is required.`)
  return name
}

function readOptionalText(value, field, maxLength) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') throw httpError(400, 'INVALID_REQUEST', `${field} must be a string.`)
  if (value.length > maxLength) throw httpError(413, 'TEXT_TOO_LARGE', `${field} is too long.`)
  return value
}

function readOptionalTrimmedText(value, field, maxLength) {
  const text = readOptionalText(value, field, maxLength)
  return text === null ? null : text.trim() || null
}

function readIdentityText(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function readAnchor(value, field) {
  if (value === undefined || value === null) return {}
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw httpError(400, 'INVALID_ANCHOR', `${field} must be an object.`)
  }
  if (JSON.stringify(value).length > 32768) throw httpError(413, 'ANCHOR_TOO_LARGE', `${field} is too large.`)
  return value
}

function readTimestamp(value, field) {
  if (value === undefined || value === null || value === '') return null
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw httpError(400, 'INVALID_TIMESTAMP', `${field} must be a valid ISO timestamp.`)
  }
  return new Date(value).toISOString()
}

function readOptionalRevision(value) {
  if (value === undefined || value === null) return undefined
  if (!Number.isInteger(value) || value < 0) {
    throw httpError(400, 'INVALID_REVISION', 'revision must be a non-negative integer.')
  }
  return value
}

function normalizePrototypeUrl(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw httpError(400, 'INVALID_URL', 'url is required.')
  }

  let url
  try {
    url = new URL(raw.trim())
  }
  catch {
    throw httpError(400, 'INVALID_URL', 'url must be a valid absolute URL.')
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw httpError(400, 'INVALID_URL', 'url must use http or https.')
  }

  url.hash = ''
  url.search = ''
  let path = url.pathname || '/'
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1)
  return `${url.origin}${path}`
}

function httpError(status, code, message, cause) {
  const error = new Error(message, { cause })
  error.status = status
  error.code = code
  return error
}

async function start() {
  await ensureSchema()
  const server = app.listen(PORT, () => {
    console.log(`VibeCheck App Foundry API listening on port ${PORT}`)
  })
  return server
}

const isMainModule = process.argv[1]
  && fileURLToPath(import.meta.url) === resolve(process.argv[1])

if (isMainModule) {
  start().catch(error => {
    console.error(error.stack || error.message)
    process.exitCode = 1
  })
}

export { app, ensureSchema, normalizePrototypeUrl, start }
