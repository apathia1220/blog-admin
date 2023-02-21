import { useUserStore } from '@/store/user'
import { http } from '@/utils'

const URLS = {
  WEBSITE_CONFIG: '/api/admin/website/config',
  UPLOAD_IMG: '/api/admin/articles/images',
  UPDATE_ABOUT: '/api/admin/about',
  ABOUT_CONTENT: '/api/about'
}

const Header = useUserStore().headerAuth

export interface WebsiteConfigItem {
  author: string
  authorAvatar: string
  authorIntro: string
  beianNumber: string
  csdn: string
  englishName: string
  gitee: string
  github: string
  isCommentReview: number
  isEmailNotice: number
  isReward: number
  juejin: string
  logo: string
  name: string
  notice: string
  qq: string
  stackoverflow: string
  touristAvatar: string
  userAvatar: string
  weChat: string
  websiteCreateTime: string
  weibo: string
  zhihu: string
}

export interface WebsiteConfigResponse {
  code: number
  data: WebsiteConfigItem
  flag?: string
  message: string
}

export interface AboutResponse {
  code: number
  data: {
    content: string | null
  }
  flag?: string
  message: string
}

export const getWebsiteConfig = () => {
  return http.get(URLS.WEBSITE_CONFIG, Header)
}

export const updateWebsiteConfig = (param: Partial<WebsiteConfigItem>) => {
  return http.put(URLS.WEBSITE_CONFIG, { json: param, ...Header })
}

export const uploadAboutImg = (file: FormData) => {
  return http.post(URLS.UPLOAD_IMG, { file, ...Header })
}

export const updateAbout = (content: string) => {
  return http.put(URLS.UPDATE_ABOUT, { json: content, ...Header })
}

export const getAbout = () => {
  return http.get(URLS.ABOUT_CONTENT, Header)
}
