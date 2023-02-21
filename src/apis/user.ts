import { useUserStore } from '@/store/user'
import { http } from '@/utils'

const URLS = {
  LOGIN: '/api/users/login',
  LOGOUT: '/api/users/logout',
  USER_INFO: '/api/users/info',
  UPDATE_PASSWORD: '/api/admin/users/password',
  USER_LIST: '/api/admin/users',
  ROLE_LIST: '/api/admin/users/role',
  DISABLE_USER: '/api/admin/users/disable'
}

export interface UpdateUserInfoRequest {
  nickname: string
  intro: string | null
  website: string | null
}

export interface PassWordRequest {
  confirmPassword: string
  newPassword: string
  oldPassword: string
}

export interface UserListRequest {
  current: number
  size: number
  keywords?: string
}

export interface RoleItem {
  id: number
  roleName: string
}

export interface RoleListResponse {
  code: number
  data: RoleItem[]
  flag?: boolean
  message: string
}

export interface UserListResponse {
  code: number
  data: {
    count: number
    records: UserListItem[]
  }
  flag?: boolean
  message: string
}

export interface UserListItem {
  avatar: string | null | undefined
  createTime: string | null
  id: number
  ipAddress: string | null
  ipSource: string | null
  isDisable: number
  lastLoginTime: string | null
  loginType: number
  nickname: string | null
  userInfoId: number
  status: number | null
  roles: RoleItem[]
}

export interface DisableUserRequest {
  id: number
  isDisable: number
}

export interface UpdateUserRequest {
  id: number
  userInfoId: number
  roleIds: number[]
  nickname: string
}

export const loginIn = (params: Record<'password' | 'username', string>) => {
  return http.post(URLS.LOGIN, { form: params })
}

export const logOut = () => {
  const Header = useUserStore().headerAuth
  return http.post(URLS.LOGOUT, Header)
}

export const updateUserInfo = (params: UpdateUserInfoRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.USER_INFO, { json: params, ...Header })
}

export const updatePassword = (params: PassWordRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.UPDATE_PASSWORD, { json: params, ...Header })
}

export const getUserList = (params: UserListRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.USER_LIST, { query: params, ...Header })
}

export const getRoleList = () => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.ROLE_LIST, Header)
}

export const updateUserDisable = (params: DisableUserRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.DISABLE_USER, { json: params, ...Header })
}

export const updateUserRole = (params: UpdateUserRequest) => {
  const Header = useUserStore().headerAuth
  return http.put(URLS.ROLE_LIST, { json: params, ...Header })
}
