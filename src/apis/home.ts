import { AdminInfo, AreaItemInfo } from '@/store/home'
import { useUserStore } from '@/store/user'
import { http } from '@/utils'

const URLS = {
  ADMIN_INFO: '/api/admin',
  AREA_INFO: '/api/admin/users/area'
}

interface BaseResponse {
  code: number
  flag?: boolean
  message: string
}

export interface AdminInfoResponse extends BaseResponse {
  data: AdminInfo
}

export interface AreaInfoRequest {
  type: number
}

export interface AreaInfoResponse extends BaseResponse {
  data: AreaItemInfo[]
}

export const getAdminInfo = () => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.ADMIN_INFO, Header)
}

export const getAreaInfo = (param: AreaInfoRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.AREA_INFO, { query: param, ...Header })
}
