'use server'

import { z } from 'zod'

const PostStatus = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED'])
const Visibility = z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE'])

const schema = z.object({
  title: z.string().min(3).max(160),
  slug: z
    .string()
    .max(140)
    .optional()
    .transform((v) => (v?.trim() ? v : undefined)),
  excerpt: z.string().max(300),
  content: z.string().transform((s) => {
    // vem como string do input hidden
    try {
      return JSON.parse(s)
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
    .optional()
    .transform((v) => (v ? new Date(v).toISOString() : undefined)),
  categoryNames: z.array(z.string()).optional(),
  tagNames: z.array(z.string()).optional()
})

export async function createPostAction(formData: FormData) {
  // FormData.getAll converte multi-campos (chips)
  const raw = {
    title: formData.get('title'),
    slug: formData.get('slug'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    coverId: formData.get('coverId'),
    status: formData.get('status'),
    visibility: formData.get('visibility'),
    scheduledFor: formData.get('scheduledFor'),
    categoryNames: formData.getAll('categoryNames'),
    tagNames: formData.getAll('tagNames')
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const payload = parsed.data

  // >>> AQUI você chama sua API (ky/axios) quando quiser:
  // const result = await api.post('posts', { json: payload }).json()
  // if erro -> retorne { success: false, message: '...', errors: null }

  // Por enquanto, só ecoa:
  console.log('Payload pronto p/ backend:', payload)

  return { success: true, message: 'OK', errors: null }
}
