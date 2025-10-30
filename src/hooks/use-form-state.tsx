import { FormEvent, useState, useTransition } from 'react'

interface BaseFormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState<T extends BaseFormState = BaseFormState>(
  action: (data: FormData) => Promise<T>,
  onSuccess?: (state: T) => Promise<void> | void,
  initialState?: T
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState<T>(
    initialState ??
      ({
        success: false,
        message: null,
        errors: null
      } as T)
  )

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)

      if (state.success && onSuccess) {
        await onSuccess(state)
      }

      setFormState(state)
    })
  }

  return [formState, handleSubmit, isPending] as const
}
