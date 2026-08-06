'use server'

import { HTTPError } from 'ky'
import type { PortfolioPayload } from '@/http/portfolio'
import { createPortfolioCategory, createPortfolioProject, deletePortfolioCategory, deletePortfolioProject, updatePortfolioCategory, updatePortfolioProject } from '@/http/portfolio'

async function run<T>(operation: () => Promise<T>) { try { return { success: true as const, data: await operation() } } catch (error) { if (error instanceof HTTPError) { const body = await error.response.json<{ message?: string }>().catch(() => null); return { success: false as const, message: body?.message || 'Não foi possível concluir a operação.' } } return { success: false as const, message: 'Erro inesperado. Tente novamente.' } } }
export async function savePortfolioProjectAction(id: string | null, data: PortfolioPayload) { return run(() => id ? updatePortfolioProject(id, data) : createPortfolioProject(data)) }
export async function deletePortfolioProjectAction(id: string) { return run(() => deletePortfolioProject(id)) }
export async function createPortfolioCategoryAction(data: { name: string; description?: string; displayOrder?: number }) { return run(() => createPortfolioCategory(data)) }
export async function updatePortfolioCategoryAction(id: string, data: { name?: string; description?: string | null; displayOrder?: number }) { return run(() => updatePortfolioCategory(id, data)) }
export async function deletePortfolioCategoryAction(id: string) { return run(() => deletePortfolioCategory(id)) }
