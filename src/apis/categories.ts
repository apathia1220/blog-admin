import { useUserStore } from '@/store/user'
import { http } from '@/utils'

const URLS = {
  BASE_CATEGORIES: '/api/admin/categories/search',
  SEARCH_CATEGORIES: '/api/admin/categories',
  DELETE_CATEGORIES: '/api/admin/categories',
  ADD_CATEGORIES: '/api/admin/categories'
}

const Header = useUserStore().headerAuth

export const getCateList = () => {
  return http.get(URLS.BASE_CATEGORIES, Header)
}

export const searchCategories = (query?: Record<string, any>) => {
  return http.get(URLS.SEARCH_CATEGORIES, { query, ...Header })
}

export const editCategories = (param: Record<'id' | 'categoryName', any>) => {
  return http.post(URLS.ADD_CATEGORIES, { json: param, ...Header })
}

export const deleteCategories = (ids: number[]) => {
  return http.delete(URLS.DELETE_CATEGORIES, { json: ids, ...Header })
}
