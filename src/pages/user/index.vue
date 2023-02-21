<template>
    <div class="flex flex-col h-full px-2 pb-4 bg-gray-200">
        <h1 class="border-b-4 text-2xl p-4 w-48">用户列表</h1>
        <div class="mt-4 h-full">
            <div class="flex justify-end">
                <div class="flex">
                    <Input v-model="userForm.keywords" placeholder="请输入昵称" />
                    <BaseButton class="ml-4" @click="getUsers">搜索</BaseButton>
                </div>
            </div>
            <Table class="mt-4" v-bind="tableOps" row-key="id" />
            <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
        </div>
    </div>
</template>

<script lang='tsx' setup>
import { getUserList, getRoleList, updateUserDisable, UpdateUserRequest, updateUserRole, UserListRequest, UserListItem, RoleItem, RoleListResponse, UserListResponse } from '@/apis/user'
import { createTable, toast, BaseButton, Checkbox, Input, Form, FormItem, Tag, Switch, useModal } from '@apathia/apathia'
import { AlarmClock } from '@apathia/apathia.icon-svg'

const userForm = ref<UserListRequest>({
    current: 1,
    size: 10
})

const roleList = ref<RoleItem[]>([])
const getRoles = async () => {
    try {
        const res: RoleListResponse = await getRoleList() as RoleListResponse
        roleList.value = res.data
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const [tableOps, tableUtil] = createTable([
    {
        title: '头像',
        render: ({ row }: any) =>
            row.avatar === null
                ? '暂无头像'
                : <div class="flex justify-center">
                    <img class="h-14 w-14" src={row.avatar} />
                </div>
    },
    {
        title: '昵称',
        field: 'nickname',
    },
    {
        title: '用户角色',
        render: ({ row }: any) => (
            row.roles.map((role: RoleItem) => <Tag primary>{role.roleName}</Tag>)
        )
    },
    {
        title: '禁用',
        render: ({ row }: any) => <Switch v-model={row.isDisable} trueValue={1} falseValue={0} onChange={() => disableUser(row)} />
    },
    {
        title: '登录IP',
        field: 'ipAddress'
    },
    {
        title: '登录地址',
        field: 'ipSource'
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
        title: '上次登录时间',
        render: ({ row }: any) => (
            <div class="flex items-center justify-center">
                <AlarmClock class="h-4 w-4" />
                <span class="ml-2 text-sm">{row.lastLoginTime.split('T')[0]}</span>
            </div>)
    },
    {
        title: '操作',
        render: ({ row }: any) => (
            <BaseButton priamry onClick={() => openUserModal(row)}>编辑</BaseButton>
        )
    }
])


const getUsers = async () => {
    try {
        const res: UserListResponse = await getUserList(userForm.value) as UserListResponse
        tableUtil.setData(res.data.records)
        tableUtil.setPagination({
            total: res.data.count,
            size: userForm.value.size,
            num: userForm.value.current
        })
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const changePage = async (pn: number) => {
    const tempPn = userForm.value.current
    userForm.value.current = pn
    try {
        await getUsers()
    } catch (e: any) {
        toast.danger(e.message)
        userForm.value.current = tempPn
    }
}

const disableUser = async (row: UserListItem) => {
    const param = {
        id: row.userInfoId,
        isDisable: row.isDisable
    }
    try {
        await updateUserDisable(param)
        toast.success('切换禁用状态成功')
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const { modal, remove } = useModal()
const updateUser = async (row: UserListItem, selectedRoles: number[]) => {
    if (selectedRoles.length === 0) {
        toast.danger('请选择用户角色')
        return
    }
    if (row.nickname?.trim() === '') {
        toast.danger('昵称不能为空')
        return
    }
    const param: UpdateUserRequest = {
        id: row.id,
        nickname: row.nickname || '',
        roleIds: selectedRoles,
        userInfoId: row.userInfoId
    }
    try {
        await updateUserRole(param)
        await getUsers()
        remove()
        toast.success('更新角色成功')
    } catch (e: any) {
        toast.danger(e.message)
    }
}
const openUserModal = (row: UserListItem) => {
    let selectedRoles = ref(row.roles.map((role: RoleItem) => role.id))
    modal({
        title: '编辑用户',
        render: () => (
            <div>
                <Form labelAlign="center">
                    <FormItem label="昵称" labelAlign="center">
                        <Input v-model={row.nickname} />
                    </FormItem>
                    <FormItem class="mt-4" label="角色" labelAlign="center">
                        {
                            roleList.value.map((role: RoleItem) =>
                                <Checkbox v-model={selectedRoles.value} value={role.id}>
                                    {role.roleName}
                                </Checkbox>)
                        }
                    </FormItem>
                    <FormItem>
                        <div class="flex justify-center mt-4">
                            <BaseButton info large onClick={remove}>取消</BaseButton>
                            <BaseButton large onClick={() => updateUser(row, selectedRoles.value)}>确认</BaseButton>
                        </div>
                    </FormItem>
                </Form>
            </div>
        )
    })
}

onBeforeMount(() => {
    getRoles()
    getUsers()
})
</script>
<style lang='scss' scoped></style>