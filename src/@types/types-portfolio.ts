import type { MediaItem } from './types-media'

export type PortfolioStatus = 'DRAFT' | 'PUBLISHED'
export type PortfolioCategory = { id: string; name: string; slug: string; description?: string | null; displayOrder?: number; _count?: { projects: number } }
export type PortfolioProject = {
  id: string; title: string; slug: string; summary: string
  content?: { format: 'html'; version: 1; html: string }
  status: PortfolioStatus; publishedAt: string | null; featured: boolean; displayOrder: number
  location: string | null; architects: string[]; areaSquareMeters: number | null
  completionYear: number | null; clientName: string | null; servicesProvided: string[]
  seoTitle: string | null; metaDescription: string | null; version: number
  createdAt: string; updatedAt: string; categories: PortfolioCategory[]
  galleryCount: number; gallery: Array<Pick<MediaItem, 'id' | 'url' | 'alt' | 'caption' | 'credit' | 'width' | 'height' | 'dominantClr'>>
}
export type PortfolioListResponse = { items: PortfolioProject[]; meta: { page: number; perPage: number; total: number; totalPages: number }; stats?: { total: number; published: number; drafts: number } }
