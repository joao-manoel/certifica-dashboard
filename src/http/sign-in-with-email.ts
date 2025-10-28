import { api } from './api-client'

interface SignInWithUsernameRequest {
  username: string
  password: string
}

interface SignInWithUsernameResponse {
  token: string
}

export async function signInWithUsername({
  username,
  password
}: SignInWithUsernameRequest) {
  const result = await api
    .post('auth/sign-in', {
      json: {
        username,
        password
      }
    })
    .json<SignInWithUsernameResponse>()
  return result
}
