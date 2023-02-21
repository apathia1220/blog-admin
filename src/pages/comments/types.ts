export interface CommentListRequest {
  current: number
  size: number
  keywords?: string
  type?: number
  isReview?: number | null
  [x: string]: any
}

export interface CommentItem {
  articleTitle: string
  avatar: string
  commentContent: string
  createTime: string
  id: number
  isReview: number
  nickname: string
  replyNickname: null | string
  type: number
}

export interface CommentResponse {
  code: number
  data: {
    count: number
    records: CommentItem[]
  }
  flag?: boolean
  message: string
}

export type FilterQuery = Record<keyof CommentListRequest, any>
