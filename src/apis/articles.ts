import { http } from '@/utils'
import { AtricleData, UpdateDelete, UpdateTopAndFeatured } from '@/pages/article/types'
import { useUserStore } from '@/store/user'

const URLS = {
  BASE_ARTICLES: '/api/admin/articles',
  DELETE_ARTICLES: '/api/admin/articles/delete',
  EXPORT_ARTICLES: '/api/admin/articles/export',
  TOPANDFEATURE_ARTICLES: '/api/admin/articles/topAndFeatured',
  SEARCH_ARTICLES: '/api/admin/tags/search',
  UPLOAD_ARTICLE_IMG: '/api/admin/articles/images'
}

export const addArticle = (param: AtricleData) => {
  const Header = useUserStore().headerAuth
  return http.post(URLS.BASE_ARTICLES, { json: param, ...Header })
}

export const getArticleById = (id: number) => {
  const Header = useUserStore().headerAuth
  return http.get(`${URLS.BASE_ARTICLES}/${id}`, Header)
}

export const getArticleList = (query: Record<string, any>) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.BASE_ARTICLES, { query, ...Header })
}

export const editArticleStatus = (param: UpdateDelete) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.BASE_ARTICLES, { json: param, ...Header })
}

export const deleteArticle = (ids: number[]) => {
  const Header = useUserStore().headerAuth
  return http.delete(URLS.DELETE_ARTICLES, { json: ids, ...Header })
}

export const exportArticle = (ids: number[]) => {
  return http.post(URLS.EXPORT_ARTICLES, { json: ids, ...useUserStore().headerAuth })
}

export const editArticleIsTop = (param: UpdateTopAndFeatured) => {
  return http.put(URLS.TOPANDFEATURE_ARTICLES, { json: param, ...useUserStore().headerAuth })
}

export const getArticleByTagName = (query: Record<string, any>) => {
  return http.get(URLS.SEARCH_ARTICLES, { query, ...useUserStore().headerAuth })
}

export const uploadArticleImg = (file: FormData) => {
  return http.post(URLS.UPLOAD_ARTICLE_IMG, { file, ...useUserStore().headerAuth })
}
