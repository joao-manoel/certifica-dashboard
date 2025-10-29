'use client'
import { updatePasswordAction } from '@/actions/update-user-password-action'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useFormState } from '@/hooks/use-form-state'
import { CheckCircle2Icon, Loader2, OctagonAlert } from 'lucide-react'

export default function PasswordForm() {
  const [{ errors, success, message }, handleSubmit, isPending] =
    useFormState(updatePasswordAction)

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
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="currentPassword" className="text-sm font-medium">
            Senha atual
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors?.currentPassword && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 absolute">
              {errors.currentPassword[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="newPassword" className="text-sm font-medium">
            Nova senha
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {errors?.newPassword && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400 absolute">
              {errors.newPassword[0]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirmar nova senha
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {errors?.confirmPassword ? (
          <p className="text-xs font-medium text-red-500 dark:text-red-400 absolute">
            {errors.confirmPassword[0]}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Dica: use pelo menos 12 caracteres, misturando letras, números e
            símbolos.
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
          Atualizar senha
        </button>
      </div>
    </form>
  )
}
