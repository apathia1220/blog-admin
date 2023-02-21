import { useUserStore } from '@/store/user'
import { http } from '@/utils'

const URLS = {
  RESOURCE_BASE: '/api/admin/role/resources',
  ROLE_BASE: '/api/admin/roles',
  UPDATE_ROLE: '/api/admin/role'
}

interface BaseResponse {
  code: number
  flag?: boolean
  message: string
}

interface BaseRequest {
  current: number
  size: number
}

export interface ResourceItem {
  id: number
  label: string
  children: ResourceItem[] | null
}

export interface ResourceListResponse extends BaseResponse {
  data: ResourceItem[]
}

export interface RoleRequest extends BaseRequest {
  keywords?: string
}

export interface RoleItem {
  id: number | null
  createTime: string
  idDisable: number | null
  resourceIds: number[]
  roleName: string
}

export interface RoleListResponse extends BaseResponse {
  data: {
    count: number
    records: RoleItem[]
  }
}

export interface RoleUpdateRequest {
  id: number
  resourceIds: number[]
  roleName: string
}

export const getResourceList = () => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.RESOURCE_BASE, Header)
}

export const getRoleList = (params: RoleRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.ROLE_BASE, { query: params, ...Header })
}

export const updateRoleResource = (params: RoleUpdateRequest) => {
  const Header = useUserStore().headerAuth
  return http.post(URLS.UPDATE_ROLE, { json: params, ...Header })
}

export const deleteRole = (params: number[]) => {
  const Header = useUserStore().headerAuth
  return http.delete(URLS.ROLE_BASE, { json: params, ...Header })
}

export const addRoleItem = (params: any) => {
  const Header = useUserStore().headerAuth
  return http.post(URLS.UPDATE_ROLE, { json: params, ...Header })
}
