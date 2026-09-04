const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response('ok', { headers: cors })

  try {
    const { to, subject, text } = await req.json()
    const apiKey = Deno.env.get('RESEND_API_KEY')
    const from = Deno.env.get('NOTIFY_FROM_EMAIL') || 'Design Handoff <noreply@example.com>'

    if (!apiKey || !to) {
      return json({ ok: false, skipped: true, reason: 'Missing RESEND_API_KEY or recipient' })
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, text }),
    })

    const body = await response.json()
    return json({ ok: response.ok, body })
  }
  catch (error) {
    return json({ ok: false, error: String(error) }, 400)
  }
})

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  })
}
