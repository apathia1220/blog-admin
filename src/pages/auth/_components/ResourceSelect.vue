<template>
    <div>
        <Form>
            <FormItem label="角色名">
                <Input v-model="name" />
            </FormItem>
            <FormItem label="资源权限">
                <Collapse v-for="resource in resourceList" :key="resource.label" :expand="false">
                    <template #toggleHeader="{ show, toggleShow }">
                        <div class="flex items-center text-sm cursor-pointer">
                            <Checkbox v-model="selectedResource" :value="resource.id"
                                :indeterminate="resource.indeterminate"
                                @change="(ids: number[]) => handleAllChange(ids, resource)" />
                            <span @click="toggleShow">{{ resource.label }}</span>
                        </div>
                    </template>
                    <div class="flex flex-col ml-4" v-if="resource.children !== null">
                        <Checkbox v-model="selectedResource" v-for="res in resource.children" :key="res.label"
                            :value="res.id" @change="() => handleChange(res.id, resource)">
                            {{ res.label }}
                        </Checkbox>
                    </div>
                </Collapse>
            </FormItem>
        </Form>
        <div class="flex justify-center mt-4">
            <BaseButton info @click="close">取消</BaseButton>
            <BaseButton @click="submitResource">确定</BaseButton>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { useResource, ResourceDataItem } from '../_compasables'
import { updateRoleResource, RoleUpdateRequest, RoleItem } from '@/apis/auth'
import { toast } from '@apathia/apathia'

const props = defineProps<{
    close: () => void
    role: RoleItem
}>()

const selectedResource = ref<number[]>(props.role.resourceIds || [])
const { selectedMap, resourceList, fetchResource } = useResource(selectedResource)
const name = ref<string>(props.role.roleName || '')

const handleAllChange = (id: number[], res: ResourceDataItem) => {
    if (res.checked) {
        selectedResource.value = selectedResource.value.filter(item => {
            const index = res.children?.findIndex(child => child.id === item)
            if (index !== -1 || item === res.id) {
                return false
            } else {
                return true
            }
        })
    } else {
        const childrenIds = res.children?.map(child => child.id) || []
        selectedResource.value.push(...childrenIds)
    }
}
const handleChange = (id: number, parent: ResourceDataItem) => {
    if (selectedMap.value.has(parent.id)) {
        selectedResource.value = selectedResource.value.filter(item => item !== parent.id)
    }
    const isAllChecked = parent.children?.every(child => selectedMap.value.has(child.id))
    if (isAllChecked) {
        selectedResource.value.push(parent.id)
    }
}

const submitResource = async () => {
    if (name.value.trim() == "") {
        toast.danger("角色名不能为空")
        return
    }
    const params: RoleUpdateRequest = {
        id: props.role.id as number,
        resourceIds: selectedResource.value,
        roleName: name.value
    }
    try {
        await updateRoleResource(params)
        toast.success("更新成功")
        props.close()
    } catch (e: any) {
        toast.danger(e.message)
    }
}

onBeforeMount(async () => {
    await fetchResource()
})
</script>