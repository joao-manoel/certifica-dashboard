export interface MediaItem {
  id: string
  url: string
  source: 'EXTERNAL' | 'S3'
  storageKey: string | null
  title: string | null
  alt: string | null
  caption: string | null
  credit: string | null
  originalFilename: string | null
  fileSizeBytes: number | null
  mimeType: string | null
  width: number | null
  height: number | null
  dominantClr: string | null
  createdAt: string
  updatedAt: string
  usageCount?: number
}

export interface MediaUsage {
  id: string
  title: string
  slug: string
  kind: 'cover' | 'body'
}

export interface MediaVersion {
  id: string
  url: string
  mimeType: string
  width: number
  height: number
  fileSizeBytes: number
  isCurrent: boolean
  createdAt: string
}

export interface MediaDetails extends MediaItem {
  usageCount: number
  coverUsageCount: number
  bodyUsageCount: number
  canEditImage: boolean
  canDelete: boolean
  usages: MediaUsage[]
  versions: MediaVersion[]
}
