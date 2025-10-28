'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { FloatingLabelInput } from '@/components/floating-label-input'
import { Button } from '@/components/ui/button'

import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'
import { signInWithUsernameAction } from '@/actions/sign-in-action'

export default function SignInForm() {
  const router = useRouter()
  const [{ success, message }, handleSubmit, isPending] = useFormState(
    signInWithUsernameAction
  )

  useEffect(() => {
    if (success) {
      router.push(`/`)
    }
    console.log('message', message)
  }, [success, message, router])

  return (
    <div className={cn('flex flex-col gap-6')}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-xl font-bold">Fazer login</h1>
          </div>
          <div className="flex justify-center text-red-500 min-h-8 items-center">
            {message && message}
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FloatingLabelInput
                id="username"
                type="username"
                name="username"
                label="Username"
              />
            </div>
            <div className="grid gap-2">
              <FloatingLabelInput
                id="password"
                type="password"
                name="password"
                label="Senha"
              />
            </div>
            <Button
              type="submit"
              className="w-full dark:bg-green-800 dark:text-white dark:hover:bg-green-800"
              disabled={isPending}
            >
              Continuar
            </Button>
          </div>
        </div>
      </form>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Ao clicar em continuar, você concorda com nossos{' '}
        <a href="#">Termos de Serviços</a> e{' '}
        <a href="#">Política de Privacidade</a>.
      </div>
    </div>
  )
}
