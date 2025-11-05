import { type ProxyConfig, type NextRequest, NextResponse } from 'next/server'
import { env } from './lib/env'

const publicRoutes = [
  { path: '/sign-in', whenAuthenticated: 'redirect' }
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = `${env.NEXT_PUBLIC_BASE_URL}/sign-in`

/**
 * Decodifica a parte Base64URL de um JWT.
 */
function base64UrlDecode(input: string) {
  // Converte base64url -> base64
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  // Padding
  const padded = base64 + '==='.slice((base64.length + 3) % 4)
  // Decodifica
  const decoded =
    typeof atob === 'function'
      ? atob(padded)
      : Buffer.from(padded, 'base64').toString('binary')
  try {
    // Converte string binária para UTF-8 corretamente
    return decodeURIComponent(
      decoded
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
  } catch {
    // Fallback simples
    return decoded
  }
}

/**
 * Extrai o payload do JWT e retorna o epoch em segundos do `exp`.
 * Retorna `null` se o token for inválido ou sem `exp`.
 */
function getJwtExpSeconds(token: string): number | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payloadJson = base64UrlDecode(parts[1])
    const payload = JSON.parse(payloadJson)
    if (
      typeof payload === 'object' &&
      payload !== null &&
      typeof payload.exp === 'number'
    ) {
      return payload.exp
    }
    return null
  } catch {
    return null
  }
}

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const publicRoute = publicRoutes.find((route) => route.path === path)
  const authCookie = request.cookies.get('token')
  const authToken = authCookie?.value

  // Sem token
  if (!authToken) {
    // Pode acessar rotas públicas
    if (publicRoute) return NextResponse.next()
    // Bloqueia rotas privadas
    return NextResponse.redirect(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE)
  }

  // Com token: checar expiração
  const exp = getJwtExpSeconds(authToken)
  const nowSeconds = Math.floor(Date.now() / 1000)
  const isExpired = exp !== null ? exp <= nowSeconds : true // inválido => tratar como expirado

  if (isExpired) {
    // apagar cookie e redirecionar para login
    const res = NextResponse.redirect(REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE)
    // Melhor usar delete (Next 13.4+). Caso seu target não suporte, use set com expiração no passado.
    try {
      res.cookies.delete('token')
    } catch {
      res.cookies.set('token', '', { path: '/', expires: new Date(0) })
    }
    return res
  }

  // Token válido: se rota pública com regra de redirect, manda pra home
  if (publicRoute?.whenAuthenticated === 'redirect') {
    const redirectURL = request.nextUrl.clone()
    redirectURL.pathname = '/'
    return NextResponse.redirect(redirectURL)
  }

  // Token válido em rota privada: segue
  return NextResponse.next()
}

export const config: ProxyConfig = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|_next/data/).*)',
    '/hiscores/:mode/:skill*'
  ]
}
