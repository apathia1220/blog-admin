import { useUserStore } from '@/store/user'
import { http } from '@/utils'

const URLS = {
  EXCEPTION_LOGS: '/api/admin/exception/logs',
  OPERATION_LOGS: '/api/admin/operation/logs'
}

interface BaseResponse {
  code: number
  flag?: boolean
  message: string
}

export interface BaseRequest {
  current: number
  size: number
  keywords?: string
}

export interface BaseLogItem {
  createTime: string
  id: number
  ipAddress: string
  ipSource: string
  optDesc: string
  optMethod: string
  optUri: string
  requestMethod: string
  requestParam: string
}

export interface ExceptionItem extends BaseLogItem {
  exceptionInfo: string
}

export interface OperationItem extends BaseLogItem {
  nickname: string
  optModule: string
  responseData: string
  optType: string
}

export interface ExceptionResponse extends BaseResponse {
  data: {
    count: number
    records: ExceptionItem[]
  }
}

export interface OperationResponse extends BaseResponse {
  data: {
    count: number
    records: ExceptionItem[]
  }
}

export const getExceptionLogList = (params: BaseRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.EXCEPTION_LOGS, { query: params, ...Header })
}

export const deleteExceptionLog = (params: number[]) => {
  const Header = useUserStore().headerAuth
  return http.delete(URLS.EXCEPTION_LOGS, { json: params, ...Header })
}

export const getOperationLogList = (params: BaseRequest) => {
  const Header = useUserStore().headerAuth
  return http.get(URLS.OPERATION_LOGS, { query: params, ...Header })
}

export const deleteOperationLog = (params: number[]) => {
  const Header = useUserStore().headerAuth
  return http.delete(URLS.OPERATION_LOGS, { json: params, ...Header })
}
