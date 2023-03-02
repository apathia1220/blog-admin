import { getResourceList, ResourceItem, ResourceListResponse } from '@/apis/auth'
import { toast } from '@apathia/apathia'
import { Ref } from 'vue'

export interface ResourceDataItem extends ResourceItem{
  checked?: boolean
  indeterminate?: boolean
}

export const useResource = (selected: Ref<number[]>) => {
  const resourceList = ref<ResourceDataItem[]>([])

  const selectedMap = computed(() => {
    const temp = new Map<number, number>()
    for (const id of selected.value) {
      temp.set(id, id)
    }
    return temp
  })
  

  const isIndeterminate = (resource: ResourceItem) => {
    return !selectedMap.value.has(resource.id) && resource?.children?.some(child => selectedMap.value.has(child.id))
  }

  const fetchResource = async () => {
    try {
      const res: ResourceListResponse = (await getResourceList()) as ResourceListResponse
      // 对所有的一级菜单进行选中和中间态的设置
      resourceList.value = res.data.map(item => ({
        ...item,
        checked: selectedMap.value.has(item.id) || item.children?.every(child => selectedMap.value.has(child.id)),
        indeterminate: isIndeterminate(item)
      }))
    } catch (e: any) {
      toast.danger(e.message)
    }
  }

  watch(() => selected.value, () => {
    resourceList.value = resourceList.value.map(item => ({
        ...item,
        checked: selectedMap.value.has(item.id) || item.children?.every(child => selectedMap.value.has(child.id)),
        indeterminate: isIndeterminate(item)
    }))
  })

  return {
    selectedMap,
    resourceList,
    fetchResource
  }
}
