import http from 'node:http';
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicDemoFiles } from './sync-demo.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const options = { host: 'localhost', port: 4173, strictPort: false, preview: false, base: '/' };
const args = process.argv.slice(2);
for (let index = 0; index < args.length; index += 1) {
  const argument = args[index];
  if (argument === '--preview') options.preview = true;
  else if (argument === '--strictPort') options.strictPort = true;
  else if (argument === '--host' || argument === '--port' || argument === '--base') {
    const value = args[++index];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${argument}`);
    options[argument.slice(2)] = value;
  } else if (argument.startsWith('--host=')) options.host = argument.slice(7);
  else if (argument.startsWith('--port=')) options.port = argument.slice(7);
  else if (argument.startsWith('--base=')) options.base = argument.slice(7);
  else throw new Error(`Unknown option: ${argument}`);
}
options.port = Number(options.port);
if (!Number.isInteger(options.port) || options.port < 1 || options.port > 65535) {
  throw new Error('--port must be an integer between 1 and 65535');
}
if (!options.host || /[\s/\\]/.test(options.host)) throw new Error('Invalid --host value');
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(options.base)) {
  throw new Error('--base must be an absolute directory path with a trailing slash');
}

const publicRoot = path.join(projectRoot, options.preview ? 'dist' : '');
const fixedRoutes = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/styles.css', 'styles.css'],
  ['/app.js', 'app.js'],
  ['/src/exercise-state.mjs', 'src/exercise-state.mjs'],
  ['/src/ui-icons.mjs', 'src/ui-icons.mjs'],
  ['/assets/fonts/OFL.txt', 'assets/fonts/OFL.txt'],
  ['/assets/ASSET-LICENSES.txt', 'assets/ASSET-LICENSES.txt'],
  ['/favicon.svg', 'assets/favicon.svg'],
  ['/favicon.ico', 'assets/favicon.svg'],
  ...publicDemoFiles.map(file => [`/${file}`, file]),
]);
const assetExtensions = new Set([
  '.svg', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.avif',
  '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.mp3', '.ogg', '.wav',
]);
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.avif': 'image/avif',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
  '.mp4': 'video/mp4', '.webm': 'video/webm', '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg', '.wav': 'audio/wav',
};
function withinRoot(filePath) {
  const relative = path.relative(publicRoot, filePath);
  return relative && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}
function reply(response, code, message) {
  response.writeHead(code, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  response.end(message);
}

const server = http.createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    reply(response, 405, 'Method not allowed');
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    reply(response, 400, 'Invalid request path');
    return;
  }
  if (pathname.includes('\0') || pathname.includes('\\')) {
    reply(response, 400, 'Invalid request path');
    return;
  }
  // Emulate a GitHub Pages project site without also serving root-level assets.
  if (!pathname.startsWith(options.base)) {
    reply(response, 404, 'Not found');
    return;
  }
  pathname = `/${pathname.slice(options.base.length)}`;
  let relativePath = fixedRoutes.get(pathname);
  if (!relativePath && pathname.startsWith('/assets/')) {
    const segments = pathname.slice(1).split('/');
    if (segments.some(segment => !segment || segment.startsWith('.')) || !assetExtensions.has(path.extname(pathname).toLowerCase())) {
      reply(response, 404, 'Not found');
      return;
    }
    relativePath = segments.join('/');
  }
  if (!relativePath) {
    reply(response, 404, 'Not found');
    return;
  }
  const filePath = path.resolve(publicRoot, relativePath);
  if (!withinRoot(filePath)) {
    reply(response, 404, 'Not found');
    return;
  }
  try {
    // Reject symlinks, including parent directory symlinks, so public routes cannot expose private files.
    if (await realpath(filePath) !== filePath) {
      reply(response, 404, 'Not found');
      return;
    }
    const file = await stat(filePath);
    if (!file.isFile()) {
      reply(response, 404, 'Not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Content-Length': file.size,
      'Cache-Control': options.preview ? 'no-cache' : 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(filePath).on('error', () => response.destroy()).pipe(response);
  } catch {
    reply(response, 404, 'Not found');
  }
});

let attempts = 0;
server.on('error', error => {
  if (error.code === 'EADDRINUSE' && !options.strictPort && attempts < 10 && options.port < 65535) {
    attempts += 1;
    options.port += 1;
    server.listen(options.port, options.host);
    return;
  }
  console.error(`Unable to start VibeCheck: ${error.message}`);
  process.exitCode = 1;
});
server.on('listening', () => {
  const hostLabel = options.host.includes(':') ? `[${options.host}]` : options.host;
  console.log(`VibeCheck ${options.preview ? 'preview' : 'development'} server: http://${hostLabel}:${options.port}${options.base}`);
});
server.listen(options.port, options.host);
for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
