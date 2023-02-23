<template>
    <div>
        <div class="flex justify-between">
            <BaseButton danger @click="handleDelete(null)">批量删除</BaseButton>
            <div class="flex">
                <Input v-model="operationForm.keywords" placeholder="请输入操作描述" />
                <BaseButton class="ml-4" @click="getOperations">搜索</BaseButton>
            </div>
        </div>
        <Table class="mt-4" loading v-model:selected="selectedLogs" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
    </div>
</template>

<script lang='tsx' setup>
import { createTable, useConfirm, useModal, toast, Tag, BaseButton } from '@apathia/apathia'
import { AlarmClock } from '@apathia/apathia.icon-svg'
import { getOperationLogList, deleteOperationLog, OperationItem, BaseRequest, OperationResponse } from '@/apis/log'

const operationForm = ref<BaseRequest>({
    current: 1,
    size: 12
})
const selectedLogs = ref<OperationItem[]>([])
const getOperations = async () => {
    try {
        const res: OperationResponse = await getOperationLogList(operationForm.value) as OperationResponse
        tableUtil.setData(res.data.records || [])
        tableUtil.setPagination({
            total: res.data.count,
            size: operationForm.value.size,
            num: operationForm.value.current
        })
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const [tableOps, tableUtil] = createTable([
    {
        title: '全选',
        width: 40,
        type: 'selection'
    },
    {
        title: '系统模块',
        field: 'optModule'
    },
    {
        title: '操作类型',
        field: 'optType'
    },
    {
        title: '操作描述',
        field: 'optDesc'
    },
    {
        title: '请求方式',
        render: ({ row }: any) => <Tag
            danger={row.requestMethod === 'DELETE'}
            primary={row.requestMethod === 'GET'}
            success={row.requestMethod === 'POST'}
            warning={row.requestMethod === 'PUT'}
        >
            {row.requestMethod}
        </Tag>
    },
    {
        title: '操作人员',
        field: 'nickname'
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
        title: '操作时间',
        width: 200,
        render: ({ row }: any) => (
            <div class="flex items-center justify-center">
                <AlarmClock class="h-4 w-4" />
                <span class="ml-2 text-sm">{row.createTime.split('T').join('-')}</span>
            </div>)
    },
    {
        title: '操作',
        render: ({ row }: any) => (
            <div class="flex justify-center">
                <BaseButton priamry onClick={() => openLogDetail(row)}>查看</BaseButton>
                <BaseButton danger onClick={() => handleDelete(row.id)}>删除</BaseButton>
            </div>
        )
    }
])

const changePage = async (pn: number) => {
    const tempPn = operationForm.value.current
    operationForm.value.current = pn
    try {
        await getOperations()
    } catch (e) {
        toast.danger(e)
        operationForm.value.current = tempPn
    }
}

const { confirm } = useConfirm()
const handleDelete = async (id: number | null) => {
    let param: number[] = []
    if (id === null) {
        param = selectedLogs.value.map(row => row.id) as number[]
    } else {
        param = [id]
    }
    try {
        await confirm({
            title: '确认删除',
            render: '确认删除该操作日志吗'
        })
        await deleteOperationLog(param)
        await toast.success('删除成功')
    } catch (e: any) {
        if (e.message) {
            toast.danger(e.message)
        }
    }
}

const { modal } = useModal()
const openLogDetail = (log: OperationItem) => {
    modal({
        title: '详细信息',
        render: () => (
            <div class="px-8">
                <ul class="text-sm">
                    <li class="mb-4">操作模块:<span class="ml-4">{log.optModule}</span></li>
                    <li class="mb-4">操作地址:<span class="ml-4">{log.optUri}</span></li>
                    <li class="mb-4">请求方法:<span class="ml-4">{log.requestMethod}</span></li>
                    <li class="mb-4">操作方法:<span class="ml-4">{log.optMethod}</span></li>
                    <li class="mb-4">请求参数:<span class="ml-4">{log.requestParam}</span></li>
                    <li class="mb-4">返回数据:<span class="ml-4">{log.responseData}</span></li>
                    <li class="mb-4">操作人员:<span class="ml-4">{log.nickname}</span></li>
                </ul>
            </div>
        )
    })
}

onBeforeMount(() => {
    getOperations()
})
</script>