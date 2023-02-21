export interface AtricleData {
  articleContent: string
  articleCover: string
  articleTitle: string
  categoryName: string | null
  id: number | null
  isTop: number
  isFeatured: number
  status: number
  tagNames: string[]
  type: number
  originalUrl?: string
  password?: string
}

export interface ListQuery {
  isDelete: number
  status: null | number
  categoryId: null | number
  tagId: null | number
  type: null | number
  keywords: null | number
  current: number
  size: number
  [x: string]: any
}

type TagType = {
  id: number | null
  count: number | null
  tagName: string
}

export interface ListResponse {
  id: number | null
  articleCover: string
  articleTitle: string
  categoryName: string
  tagDTOs: TagType[]
  createTime: string
  isDelete: number
  isFeatured: number
  isTop: number
  status: number
  type: number
  viewsCount: number | null
}

export interface UpdateDelete {
  ids?: Array<number | null>
  isDelete?: number
}

export interface UpdateTopAndFeatured {
  id?: number
  isTop?: number
  isFeatured?: number
}

export interface TagItem {
  id: number
  tagName: string
  articleCount: number | null
  createTime: string
}

export interface CategoryItem {
  id: number | null
  categoryName: string
  articleCount?: number | null
  createTime?: string
}

export type FilterQuery = Record<keyof ListQuery, any>
