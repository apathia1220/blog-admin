<template>
    <div>
        <div class="flex justify-between">
            <BaseButton danger @click="handleDelete(null)">批量删除</BaseButton>
            <div class="flex">
                <Input v-model="exceptionForm.keywords" placeholder="请输入操作描述" />
                <BaseButton class="ml-4" @click="getExceptions">搜索</BaseButton>
            </div>
        </div>
        <Table class="mt-4" v-model:selected="selectedLogs" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
    </div>
</template>

<script lang='tsx' setup>
import { createTable, useConfirm, useModal, toast, Tag, BaseButton } from '@apathia/apathia'
import { AlarmClock } from '@apathia/apathia.icon-svg'
import { getExceptionLogList, deleteExceptionLog, ExceptionItem, BaseRequest, ExceptionResponse } from '@/apis/log'
import PreviewCode from '@/components/PreviewCode.vue'

const exceptionForm = ref<BaseRequest>({
    current: 1,
    size: 12
})
const selectedLogs = ref<ExceptionItem[]>([])
const getExceptions = async () => {
    try {
        const res: ExceptionResponse = await getExceptionLogList(exceptionForm.value) as ExceptionResponse
        tableUtil.setData(res.data.records || [])
        tableUtil.setPagination({
            total: res.data.count,
            size: exceptionForm.value.size,
            num: exceptionForm.value.current
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
        title: '请求接口',
        field: 'optUri'
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
        title: '登录IP',
        field: 'ipAddress'
    },
    {
        title: '登录地址',
        field: 'ipSource'
    },
    {
        title: '操作时间',
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
                <BaseButton priamry onClick={() => openLogDetail(row)}>查看</BaseButton>
                <BaseButton danger onClick={() => handleDelete(row.id)}>删除</BaseButton>
            </div>
        )
    }
])

const changePage = async (pn: number) => {
    const tempPn = exceptionForm.value.current
    exceptionForm.value.current = pn
    try {
        await getExceptions()
    } catch (e) {
        toast.danger(e)
        exceptionForm.value.current = tempPn
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
            render: '确认删除该异常日志吗'
        })
        await deleteExceptionLog(param)
        await getExceptions()
        toast.success('删除成功')
    } catch (e: any) {
        if (e.message) {
            toast.danger(e.message)
        }
    }
}

const { modal, remove } = useModal()
const openLogDetail = (log: ExceptionItem) => {
    modal({
        title: '详细信息',
        render: () => (
            <div>
                <ul>
                    <li class="mb-2">操作接口:<span class="ml-4">{log.optUri}</span></li>
                    <li class="mb-2">操作方法:<span class="ml-4">{log.optMethod}</span></li>
                    <li class="mb-2">请求方式:<span class="ml-4">{log.requestMethod}</span></li>
                    <li class="mb-2">请求参数:<span class="ml-4">{log.requestParam}</span></li>
                </ul>
                <PreviewCode class="mt-4" code={log.exceptionInfo} type="java" />
            </div>
        )
    })
}

onBeforeMount(() => {
    getExceptions()
})
</script>