export interface AddTalksRequest {
  content: string
  images: string[]
  imgs?: string[]
  isTop: number
  status: number
  id: null
}

export type editReq = Exclude<AddTalksRequest, 'images'> | { images: string }

export interface EditListResponse {
  id: number | null
  avatar: string | null
  content: string
  createTime?: string
  images: string
  imgs: string[]
  isTop: number
  nickname: string
  status: number
}

export interface TalkRequest {
  current: number
  size: number
  status?: number | undefined | null | string
}
