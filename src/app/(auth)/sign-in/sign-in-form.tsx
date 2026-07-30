'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { signInWithUsernameAction } from '@/actions/sign-in-action'
import { FloatingLabelInput } from '@/components/floating-label-input'
import { Button } from '@/components/ui/button'
import { useFormState } from '@/hooks/use-form-state'
import { cn } from '@/lib/utils'

export default function SignInForm() {
  const router = useRouter()
  const [{ success, message }, handleSubmit, isPending] = useFormState(
    signInWithUsernameAction
  )

  useEffect(() => {
    if (success) {
      router.push(`/`)
    }
  }, [success, message, router])

  return (
    <div className={cn('flex flex-col gap-6')}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar o painel
            </h1>
            <p className="text-center text-sm text-muted-foreground">
              Entre com suas credenciais para continuar.
            </p>
          </div>
          <div
            className="flex min-h-8 items-center justify-center text-sm text-destructive"
            role="alert"
            aria-live="polite"
          >
            {message && message}
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FloatingLabelInput
                id="username"
                type="username"
                name="username"
                label="Usuário"
                autoComplete="username"
              />
            </div>
            <div className="grid gap-2">
              <FloatingLabelInput
                id="password"
                type="password"
                name="password"
                label="Senha"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Entrando…' : 'Continuar'}
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
