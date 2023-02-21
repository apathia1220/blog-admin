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
                                :indeterminate="isSelectAll(resource) === true"
                                @change="(ids: number[]) => handleAllChange(ids, resource)" />
                            <span @click="toggleShow">{{ resource.label }}</span>
                        </div>
                    </template>
                    <div class="flex flex-col ml-4" v-if="resource.children !== null">
                        <Checkbox v-model="selectedResource" v-for="res in resource.children" :key="res.label"
                            :value="res.id" @change="() => handleChange(res.id, resource.id)">
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
import { useResource } from '../_compasables'
import { updateRoleResource, RoleUpdateRequest, ResourceItem, RoleItem } from '@/apis/auth'
import { isFullContain } from '@/utils'
import { toast } from '@apathia/apathia'

const props = defineProps<{
    close: () => void
    role: RoleItem
}>()

const { resourceList, fetchResource } = useResource()
const selectedResource = ref<number[]>(props.role.resourceIds || [])
const name = ref<string>(props.role.roleName || '')

const isSelectAll = (res: ResourceItem): boolean | number => {
    const total = res.children?.length || 0
    const parentId = res.id
    let count = 0

    const parentItem = resourceList.value.find(item => item.id === parentId)
    selectedResource.value.forEach((id: number) => {
        const res = parentItem?.children?.find(item => item.id === id)
        if (res !== undefined) {
            count++
        }
    })

    if (count > 0 && count < total) {
        return true
    } else if (count === 0) {
        return -1
    }
    else if (count === total) {
        selectedResource.value.push(parentId)
        return false
    } else {
        return false
    }
}

const handleAllChange = (id: number[], res: ResourceItem) => {
    const flag = isSelectAll(res)
    if (!flag && flag !== -1) {
        // 点击前为全选状态
        selectedResource.value = selectedResource.value.filter(item => {
            const index = res.children?.findIndex(child => child.id === item)
            if (index !== -1 || item === res.id) {
                return false
            } else {
                return true
            }
        })
    } else {
        //点击前未全选
        const childrenIds = res.children?.map(child => child.id) || []
        console.log(childrenIds)
        selectedResource.value.push(...childrenIds)
    }
}

const handleChange = (id: number, parentId: number) => {
    const isExist = isFullContain(selectedResource.value, id)
    if (!isExist) {
        selectedResource.value = selectedResource.value.filter(item => item !== parentId)
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