'use server'

import { z } from 'zod'
import { createPost } from '@/http/create-post'

const PostStatus = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED'])
const Visibility = z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE'])

const schema = z.object({
  title: z.string().min(3).max(160),
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
  categoryNames: z.array(z.string()).optional(),
  tagNames: z.array(z.string()).optional()
})

export async function createPostAction(formData: FormData) {
  const raw = {
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    coverId: formData.get('coverId'),
    status: formData.get('status'),
    visibility: formData.get('visibility'),
    categoryNames: formData.getAll('categoryNames'),
    tagNames: formData.getAll('tagNames')
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const payload = parsed.data

  try {
    const result = await createPost(payload)

    return {
      success: true,
      message: 'Post criado com sucesso!',
      errors: null,
      object: result // aqui você pode acessar id, slug, etc.
    }
  } catch (err: any) {
    console.error('Erro ao criar post', err)

    return {
      success: false,
      message: err?.message ?? 'Erro inesperado ao criar post.',
      errors: null
    }
  }
}
