import { useUserStore } from '@/store/user'
import { http } from '@/utils'
import { editReq } from '../pages/talks/types'

const URLS = {
  BASE_TALKS: '/api/admin/talks'
}

const Header = useUserStore().headerAuth

export const editTalks = (param: editReq) => {
  return http.post(URLS.BASE_TALKS, { json: param, ...Header })
}

export const getTalksById = (id: number) => {
  return http.get(`${URLS.BASE_TALKS}/${id}`, Header)
}

export const getTalkList = (query: Record<string, any>) => {
  return http.get(URLS.BASE_TALKS, { query, ...Header })
}

export const deleteTalk = (ids: number[]) => {
  return http.delete(URLS.BASE_TALKS, { json: ids, ...Header })
}
