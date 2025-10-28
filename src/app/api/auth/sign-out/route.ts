import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const redirectUrl = request.nextUrl.clone()
  const cookieStore = await cookies()

  redirectUrl.pathname = '/'

  cookieStore.set('token', '', {
    path: '/',
    maxAge: 0,
    sameSite: 'lax',
    domain:
      process.env.NODE_ENV === 'production' ? '.certifica.eng.br' : undefined
  })

  return NextResponse.redirect(redirectUrl)
}
