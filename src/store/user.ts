import { defineStore } from 'pinia'

export interface UserInfo {
  avatar: string | null | undefined
  email: string
  id: number
  ipAddress: string | null
  ipSource: string | null
  intro: string | null
  website: string | null
  lastLoginTime: string | null
  loginType: number
  nickname: string | null
  token: string
  userInfoId: number
  username: string
}

export const useUserStore = defineStore('user', {
  state: (): { userInfo: Partial<UserInfo> } => {
    return {
      userInfo: {}
    }
  },
  getters: {
    isLogin(state) {
      return !!state.userInfo && state.userInfo.token
    },
    headerAuth(state) {
      return {
        headers: {
          Authorization: 'Bearer ' + state.userInfo?.token
        }
      }
    }
  },
  persist: {
    storage: window.sessionStorage
  }
})
