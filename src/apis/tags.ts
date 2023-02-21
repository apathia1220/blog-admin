import { http } from '@/utils'
import { useUserStore } from '@/store/user'

const URLS = {
  BASE_TAGS: '/api/admin/tags/search',
  SEARCH_TAGS: '/api/admin/tags',
  DELETE_TAGS: '/api/admin/tags'
}

const Header = useUserStore().headerAuth

export const getTagList = () => {
  return http.get(URLS.BASE_TAGS, Header)
}

export const searchTag = (query: Record<string, any>) => {
  return http.get(URLS.SEARCH_TAGS, { query: query, ...Header })
}

export const editTags = (param: Record<'id' | 'tagName', any>) => {
  return http.post(URLS.SEARCH_TAGS, { json: param, ...Header })
}

export const deleteTags = (ids: number[]) => {
  return http.delete(URLS.DELETE_TAGS, { json: ids, ...Header })
}
