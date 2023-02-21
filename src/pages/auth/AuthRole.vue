<template>
    <div>
        <div class="flex justify-between">
            <div>
                <BaseButton @click="addRole">新增</BaseButton>
                <BaseButton danger @click="handleDelete(null)">批量删除</BaseButton>
            </div>
            <div class="flex">
                <Input v-model="roleForm.keywords" placeholder="请输入角色名" />
                <BaseButton class="ml-4" @click="getRoles">搜索</BaseButton>
            </div>
        </div>
        <Table class="mt-4" v-model:selected="selectedRoles" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
    </div>
</template>

<script lang='tsx' setup>
import { getRoleList, RoleRequest, deleteRole, addRoleItem, RoleListResponse, RoleItem } from '@/apis/auth'
import { createTable, toast, useConfirm, useModal, Tag, BaseButton, Input, Form, FormItem } from '@apathia/apathia'
import { AlarmClock } from '@apathia/apathia.icon-svg';
import ResourceSeletc from './_components/ResourceSelect.vue'

const roleForm = ref<RoleRequest>({
    current: 1,
    size: 10
})
const selectedRoles = ref<RoleItem[]>([])
const getRoles = async () => {
    try {
        const res: RoleListResponse = await getRoleList(roleForm.value) as RoleListResponse
        tableUtil.setData(res.data.records || [])
        tableUtil.setPagination({
            total: res.data.count,
            size: roleForm.value.size,
            num: roleForm.value.current
        })
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const [tableOps, tableUtil] = createTable([
    {
        title: '全选',
        type: 'selection'
    },
    {
        title: '角色名',
        field: 'roleName'
    },
    {
        title: '权限标签',
        render: ({ row }: any) => <Tag primary>{row.roleName}</Tag>
    },
    {
        title: '创建时间',
        render: ({ row }: any) => (
            <div class="flex items-center justify-center">
                <AlarmClock class="h-4 w-4" />
                <span class="ml-2 text-sm">{row.createTime.split('T')[0]}</span>
            </div>)
    },
    {
        title: '操作',
        render: ({ row }: any) => (
            <div class="flex justify-center">
                <BaseButton priamry onClick={() => openResourceModal(row)}>资源权限</BaseButton>
                <BaseButton danger onClick={() => handleDelete(row.id)}>删除</BaseButton>
            </div>
        )
    }
])

const { modal, remove } = useModal()
const closeModal = () => {
    remove()
    getRoles()
}
const openResourceModal = (role: RoleItem) => {
    modal({
        title: '修改资源权限',
        render: () => (<ResourceSeletc close={closeModal} role={role} />)
    })
}

const changePage = async (pn: number) => {
    const tempPn = roleForm.value.current
    roleForm.value.current = pn
    try {
        await getRoles()
    } catch (e) {
        toast.danger(e)
        roleForm.value.current = tempPn
    }
}

const { confirm } = useConfirm()
const handleDelete = async (id: number | null) => {
    let param: number[] = []
    if (id === null) {
        param = selectedRoles.value.map(row => row.id) as number[]
    } else {
        param = [id]
    }
    try {
        await confirm({
            title: '确认删除',
            render: '确认删除该角色吗'
        })
        await deleteRole(param)
        await getRoles()
        toast.success('删除成功')
    } catch (e: any) {
        if (e.message) {
            toast.danger(e.message)
        }
    }
}

const submitRole = async (name: string) => {
    if (name.trim() === '') {
        toast.danger('角色名不能为空')
        return
    }
    const param = {
        menuIds: [],
        roleName: name,
    }
    try {
        await addRoleItem(param)
        toast.success('添加成功')
        closeModal()
    } catch (e: any) {
        toast.danger(e.message)
    }
}
const addRole = () => {
    const name = ref('')
    modal({
        title: '新增角色',
        render: () => (
            <Form>
                <FormItem label="角色名">
                    <Input v-model={name.value} />
                </FormItem>
                <div class="flex justify-center mt-4">
                    <BaseButton info onClick={closeModal}>取消</BaseButton>
                    <BaseButton onClick={() => submitRole(name.value)}>确认</BaseButton>
                </div>
            </Form>
        )
    })
}

onBeforeMount(() => {
    getRoles()
})
</script>