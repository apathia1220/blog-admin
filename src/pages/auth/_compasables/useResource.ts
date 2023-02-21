import { getResourceList, ResourceItem, ResourceListResponse } from '@/apis/auth'
import { toast } from '@apathia/apathia'

export const useResource = () => {
  const resourceList = ref<ResourceItem[]>([])

  const fetchResource = async () => {
    try {
      const res: ResourceListResponse = (await getResourceList()) as ResourceListResponse
      resourceList.value = res.data
    } catch (e: any) {
      toast.danger(e.message)
    }
  }

  return {
    resourceList,
    fetchResource
  }
}
