import type { PortfolioCategory, PortfolioListResponse, PortfolioProject, PortfolioStatus } from '@/@types/types-portfolio'
import { api } from './api-client'

export type PortfolioPayload = {
  title: string; summary: string; content: { format: 'html'; version: 1; html: string }
  status: PortfolioStatus; featured: boolean; displayOrder: number; location?: string | null
  architects: string[]; areaSquareMeters?: number | null; completionYear?: number | null
  clientName?: string | null; servicesProvided: string[]; seoTitle?: string | null
  metaDescription?: string | null; coverId?: string | null; categoryIds: string[]; galleryMediaIds: string[]
  expectedVersion?: number
}

function search(params: Record<string, string | number | undefined>) { const value = new URLSearchParams(); Object.entries(params).forEach(([key, item]) => { if (item !== undefined && item !== '') value.set(key, String(item)) }); return value }
export const listPortfolioProjects = (params: { page?: number; search?: string; status?: string; categoryId?: string } = {}) => api.get('portfolio/admin/projects', { searchParams: search(params) }).json<PortfolioListResponse>()
export const getPortfolioProject = (id: string) => api.get(`portfolio/admin/projects/${id}`).json<{ project: PortfolioProject }>()
export const createPortfolioProject = (data: PortfolioPayload) => api.post('portfolio/admin/projects', { json: data }).json<{ project: PortfolioProject }>()
export const updatePortfolioProject = (id: string, data: Partial<PortfolioPayload>) => api.patch(`portfolio/admin/projects/${id}`, { json: data }).json<{ project: PortfolioProject }>()
export const deletePortfolioProject = (id: string) => api.delete(`portfolio/admin/projects/${id}`).json<{ id: string; deleted: true }>()
export const listPortfolioCategories = () => api.get('portfolio/admin/categories').json<{ items: PortfolioCategory[] }>()
export const createPortfolioCategory = (data: { name: string; description?: string; displayOrder?: number }) => api.post('portfolio/admin/categories', { json: data }).json<{ category: PortfolioCategory }>()
export const updatePortfolioCategory = (id: string, data: { name?: string; description?: string | null; displayOrder?: number }) => api.patch(`portfolio/admin/categories/${id}`, { json: data }).json<{ category: PortfolioCategory }>()
export const deletePortfolioCategory = (id: string) => api.delete(`portfolio/admin/categories/${id}`).json<{ id: string; deleted: true }>()
