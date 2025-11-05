'use server'

import { z } from 'zod'
import { createPost } from '@/http/create-post'

const PostStatus = z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED'])
const Visibility = z.enum(['PUBLIC', 'UNLISTED', 'PRIVATE'])

const schema = z
  .object({
    title: z.string().min(3).max(160),
    excerpt: z.string().max(300),
    content: z.string().transform((s) => {
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
    // vem do hidden em ISO UTC quando status = SCHEDULED
    scheduledFor: z.string().datetime().optional(),
    categoryNames: z.array(z.string()).optional(),
    tagNames: z.array(z.string()).optional()
  })
  .superRefine((data, ctx) => {
    const { status, scheduledFor } = data

    if (status === 'SCHEDULED') {
      if (!scheduledFor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scheduledFor'],
          message: "Posts agendados requerem 'scheduledFor'."
        })
        return
      }
      const when = new Date(scheduledFor)
      if (Number.isNaN(when.getTime())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scheduledFor'],
          message: "'scheduledFor' inválido."
        })
        return
      }
      if (when <= new Date()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scheduledFor'],
          message: "'scheduledFor' deve ser no futuro."
        })
      }
    } else {
      // DRAFT / PUBLISHED: não aceitar scheduledFor
      if (scheduledFor) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['scheduledFor'],
          message: "Não envie 'scheduledFor' quando o status não for SCHEDULED."
        })
      }
    }
  })

export async function createPostAction(formData: FormData) {
  const raw = {
    title: formData.get('title'),
    excerpt: formData.get('excerpt'),
    content: formData.get('content'),
    coverId: formData.get('coverId'),
    status: formData.get('status'),
    visibility: formData.get('visibility'),
    scheduledFor: formData.get('scheduledFor') ?? undefined,
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
    const result = await createPost(payload) // já contém scheduledFor quando SCHEDULED

    return {
      success: true,
      message: 'Post criado com sucesso!',
      errors: null,
      object: result
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
