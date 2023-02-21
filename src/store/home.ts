import { AdminInfoResponse, AreaInfoResponse, getAdminInfo, getAreaInfo } from '@/apis/home'
import { defineStore } from 'pinia'
import { toast } from '@apathia/apathia'

export interface articleRank {
  articleTitle: string
  viewsCount: number
}

export interface articleStatistics {
  date: string
  count: number
}

export interface categoryInfo {
  id: number
  categoryName: string
  articleCount: number | null
}

export interface tagInfo {
  id: number
  tagName: string
  articleCount: number | null
}

export interface uniqueView {
  day: string
  viewsCount: number | null
}

export interface AdminInfo {
  articleCount: number
  messageCount: number
  userCount: number
  viewsCount: number
  articleRankDTOs: articleRank[]
  articleStatisticsDTOs: articleStatistics[]
  categoryDTOs: categoryInfo[]
  tagDTOs: tagInfo[]
  uniqueViewDTOs: uniqueView[]
}

export interface AreaItemInfo {
  name: string
  value: number | null
}

export const useHomeStore = defineStore('home', {
  state: (): {
    homeInfo: Partial<AdminInfo>
    areaInfo: AreaItemInfo[]
  } => {
    return {
      homeInfo: {},
      areaInfo: []
    }
  },
  actions: {
    async initHomeStore() {
      try {
        const adminRes: AdminInfoResponse = (await getAdminInfo()) as AdminInfoResponse
        this.homeInfo = adminRes.data
        const areaRes: AreaInfoResponse = (await getAreaInfo({ type: 1 })) as AreaInfoResponse
        this.areaInfo = areaRes.data
      } catch (e: any) {
        toast.danger(e.message)
      }
    }
  }
})
