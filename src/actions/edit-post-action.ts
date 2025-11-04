'use server'

import { z } from 'zod'
import { editPost } from '@/http/edit-post'

// reutilizando enums alinhados com o backend
const PostStatus = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED'])
const Visibility = z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE'])

// Para edição, mantive o schema semelhante ao de criação;
// se preferir parcial, torne campos opcionais. Aqui enviamos tudo do form.
const schema = z.object({
  title: z.string().min(3).max(160),
  excerpt: z.string().max(300),
  content: z.string().transform((s) => {
    try {
      return JSON.parse(s) // vem como string do input hidden
    } catch {
      return {}
    }
  }),
  coverId: z
    .string()
    .uuid()
    .optional()
    .transform((v) => (v?.trim() ? v : undefined)),
  status: PostStatus,
  visibility: Visibility,
  scheduledFor: z
    .string()
    .datetime()
    .optional()
    .transform((v) => (v?.trim() ? v : undefined)),
  categoryNames: z.array(z.string()).optional(),
  tagNames: z.array(z.string()).optional()
})

/**
 * Server Action para editar post existente.
 * Use no client: const [state, handleSubmit] = useFormState(editPostAction.bind(null, postId))
 */
export async function editPostAction(id: string, formData: FormData) {
  const raw = {
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    coverId: formData.get('coverId'),
    status: formData.get('status'),
    visibility: formData.get('visibility'),
    scheduledFor: formData.get('scheduledFor') || undefined,
    categoryNames: formData.getAll('categoryNames'),
    tagNames: formData.getAll('tagNames')
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const payload = parsed.data

  // Regra de coerência: se status = SCHEDULED, scheduledFor deve existir
  if (payload.status === 'SCHEDULED' && !payload.scheduledFor) {
    return {
      success: false,
      message: "Posts agendados requerem 'scheduledFor'.",
      errors: { scheduledFor: ['Data/hora obrigatória para agendamento'] }
    }
  }

  try {
    const result = await editPost(id, payload)
    return {
      success: true,
      message: 'Post atualizado com sucesso!',
      errors: null,
      object: result
    }
  } catch (err: any) {
    console.error('Erro ao editar post', err)
    return {
      success: false,
      message: err?.message ?? 'Erro inesperado ao atualizar post.',
      errors: null
    }
  }
}
