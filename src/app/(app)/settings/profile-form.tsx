'use client'

import { updateProfileAction } from '@/actions/update-profile-action'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormState } from '@/hooks/use-form-state'
import type { GetProfileResponse } from '@/http/get-profile'
import { CheckCircle2Icon, Loader2, OctagonAlert } from 'lucide-react'

export default function ProfileForm({ user }: GetProfileResponse) {
  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(updateProfileAction)

  return (
    <form className="p-5 space-y-6" onSubmit={handleSubmit}>
      {!success && message && (
        <Alert className="bg-red-200">
          <OctagonAlert />
          <AlertTitle>Ops!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {success && message && (
        <Alert className="bg-green-200">
          <CheckCircle2Icon />
          <AlertTitle>Sucesso!</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <input defaultValue={user?.id} name="id" hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="usuario"
            defaultValue={user?.username}
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors?.username && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 absolute">
              {errors.username[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user?.name}
            placeholder="Seu nome"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />

          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 absolute">
              {errors.name[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="voce@exemplo.com"
          defaultValue={user?.email || ''}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors?.email ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400 absolute">
            {errors.email[0]}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Usado para notificações e recuperação de conta.
          </p>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 flex gap-2"
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          Salvar alterações
        </button>
      </div>
    </form>
  )
}
