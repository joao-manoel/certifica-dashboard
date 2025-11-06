// app/api/users/avatar/[username]/route.ts
import type { NextRequest } from 'next/server'

// Evite usar NEXT_PUBLIC_* aqui. Prefira uma server-only, ex.: BACKEND_BASE_URL
const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? process.env.NEXT_PUBLIC_API_URL!

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ username: string }> } // <-- params é Promise no Next 16
) {
  try {
    const { username } = await ctx.params // <-- aguarda o Promise

    if (!username) {
      return new Response(JSON.stringify({ message: 'username required' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      })
    }

    // Mantém a extensão se vier: "admin.jpg" continua "admin.jpg"
    const usernamePath = encodeURIComponent(username)

    // Preserva query string (?v=...)
    const qs = req.nextUrl.search ?? ''

    const upstreamUrl = `${BACKEND_BASE_URL.replace(
      /\/$/,
      ''
    )}/users/avatar/${usernamePath}${qs}`

    const upstream = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'If-None-Match': req.headers.get('if-none-match') ?? '',
        'If-Modified-Since': req.headers.get('if-modified-since') ?? ''
        // Se precisar, passe auth/cookies (cuidado com segurança):
        // 'Cookie': req.headers.get('cookie') ?? '',
        // 'Authorization': req.headers.get('authorization') ?? '',
      },
      cache: 'no-store'
    })

    // Propaga cabeçalhos relevantes p/ cache condicional
    const h = new Headers()
    for (const k of [
      'content-type',
      'etag',
      'last-modified',
      'cache-control',
      'content-disposition'
    ]) {
      const v = upstream.headers.get(k)
      if (v) h.set(k, v)
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: h
    })
  } catch (err) {
    console.error('[avatar proxy] error:', err)
    return new Response(JSON.stringify({ message: 'Avatar proxy failed' }), {
      status: 502,
      headers: { 'content-type': 'application/json' }
    })
  }
}
