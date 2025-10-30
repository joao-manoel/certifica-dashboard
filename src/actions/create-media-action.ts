// actions/create-media-action.ts
'use server'

import { z } from 'zod'
import probe from 'probe-image-size'
import sharp from 'sharp'
import { createMedia } from '@/http/create-media'
import { rgbToHex } from '@/utils/utils'

const schema = z.object({
  url: z.string().url().max(4096),
  alt: z
    .string()
    .max(200)
    .optional()
    .transform((v) => (v?.trim() ? v : undefined))
})

export type CreateMediaActionResult = {
  success: boolean
  message: string | null
  errors: Record<string, string[] | undefined> | null
  /**
   * payload genérico: use "object" em vez de "media"
   */
  object?: {
    id: string
    url: string
    alt: string | null
    mimeType: string | null
    width: number | null
    height: number | null
    dominantClr: string | null
    createdAt: string
    updatedAt: string
  }
}

export async function createMediaFromUrlAction(
  formData: FormData
): Promise<CreateMediaActionResult> {
  const raw = {
    url: formData.get('url'),
    alt: formData.get('alt')
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const { url, alt } = parsed.data

  try {
    // 1) Baixar imagem (precisamos do buffer para stats e fallbacks)
    const res = await fetch(url, { method: 'GET', cache: 'no-store' })
    if (!res.ok) {
      return {
        success: false,
        message: `Falha ao baixar imagem (${res.status})`,
        errors: null
      }
    }

    const contentType = res.headers.get('content-type') || undefined

    const arrayBuf = await res.arrayBuffer()
    const buf = Buffer.from(arrayBuf)

    // 2) Dimensões (probe -> fallback sharp)
    let width: number | null = null
    let height: number | null = null
    try {
      const p = probe.sync(buf)
      width = p?.width ?? null
      height = p?.height ?? null
    } catch {
      const meta = await sharp(buf).metadata()
      width = meta.width ?? null
      height = meta.height ?? null
    }

    // 3) Cor dominante
    let dominantClr: string | null = null
    try {
      const stats = await sharp(buf).stats()
      if (stats?.dominant) {
        dominantClr = rgbToHex(
          stats.dominant.r,
          stats.dominant.g,
          stats.dominant.b
        )
      }
    } catch {
      dominantClr = null
    }

    // 4) Persistir via sua API
    const created = await createMedia({
      url,
      alt, // pode ser undefined -> normalizamos abaixo
      mimeType: contentType,
      width: width ?? undefined,
      height: height ?? undefined,
      dominantClr: dominantClr ?? undefined
    })

    // 5) Normalizar tipos: undefined -> null, datas -> ISO string
    const normalized = {
      id: created.id,
      url: created.url,
      alt: (created as any).alt ?? null,
      mimeType: (created as any).mimeType ?? null,
      width: (created as any).width ?? null,
      height: (created as any).height ?? null,
      dominantClr: (created as any).dominantClr ?? null,
      createdAt:
        typeof (created as any).createdAt === 'string'
          ? (created as any).createdAt
          : (created as any).createdAt?.toISOString?.() ??
            new Date().toISOString(),
      updatedAt:
        typeof (created as any).updatedAt === 'string'
          ? (created as any).updatedAt
          : (created as any).updatedAt?.toISOString?.() ??
            new Date().toISOString()
    }

    return {
      success: true,
      message: 'Imagem cadastrada com sucesso.',
      errors: null,
      object: normalized
    }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      message: 'Erro inesperado ao criar mídia.',
      errors: null
    }
  }
}
