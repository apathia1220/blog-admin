import { useUserStore } from '@/store/user'
import { http } from '@/utils'
import { CommentListRequest } from '@/pages/comments/types'

const URLS = {
  COMMENT_BASE: '/api/admin/comments',
  UPDATE_COMMENT: '/api/admin/comments/review'
}

export interface ReviewRequest {
  ids: number[]
  isReview: number
}

export const getCommentList = (param: CommentListRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.COMMENT_BASE, { query: param, ...Header })
}

export const deleteComments = (ids: number[]) => {
  const Header = useUserStore().headerAuth
  return http.delete(URLS.COMMENT_BASE, { json: ids, ...Header })
}

export const updateReview = (params: ReviewRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.UPDATE_COMMENT, { json: params, ...Header })
}
