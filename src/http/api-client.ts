import { getCookie } from 'cookies-next'
import ky from 'ky'

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let token: string | undefined

        if (typeof window === 'undefined') {
          const { cookies: serverCookies } = await import('next/headers')
          const cookieStore = await serverCookies()
          token = cookieStore.get('token')?.value
        } else {
          // No cliente, usamos 'getCookie' diretamente
          token = getCookie('token') as string | undefined
        }

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
        request.headers.set('x-api-key', process.env.NEXT_PUBLIC_API_KEY || '')
      }
    ]
  }
})
