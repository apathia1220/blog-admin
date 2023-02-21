<template>
    <div class="flex flex-col h-full px-2 pb-4 bg-gray-200">
        <h1 class="border-b-4 text-2xl p-4 w-36">评论管理</h1>
        <div class="my-6 text-gray-400 text-sm">
            <span class="mr-4 text-gray-700 font-bold cursor-pointer">状态</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('all')" :class="isActive('all')">全部</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('normal')" :class="isActive('normal')">正常</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('reviewing')" :class="isActive('reviewing')">审核中</span>
        </div>
        <div class="flex justify-between">
            <div>
                <BaseButton danger :disabled="selectedComments.length === 0" @click="handleDelete(null)">
                    批量删除
                </BaseButton>
                <BaseButton success :disabled="selectedComments.length === 0 && queryParam.isReview === 0"
                    @click="handleReview(null)">
                    批量通过
                </BaseButton>
            </div>
            <div class="flex">
                <div class="mr-4">
                    <Select v-model="queryParam.type" placeholder="请选择来源" @change="getComments">
                        <Option :value="null">全部</Option>
                        <Option v-for="type in CommentsSourceList" :key="type" :value="type">
                            {{ CommentsSourceMap[type] }}
                        </Option>
                    </Select>
                </div>
                <div class="mr-4">
                    <Input v-model="queryParam.keywords" placeholder="请输入用户昵称" />
                </div>
                <BaseButton primary @click="getComments">搜索</BaseButton>
            </div>
        </div>
        <div class="mt-4">
            <Table v-model:selected="selectedComments" v-bind="tableOps" row-key="id" />
            <Pagination v-if="dataCount > 0" :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
        </div>
    </div>
</template>

<script lang='tsx' setup>
import { getCommentList, deleteComments, updateReview, ReviewRequest } from '@/apis/comments'
import { CommentsSourceList, CommentsSourceMap } from './constant'
import { toast, createTable, useConfirm, BaseButton, Image, Tag } from '@apathia/apathia'
import { CommentListRequest, CommentItem, FilterQuery, CommentResponse } from './types'
import { AlarmClock } from '@apathia/apathia.icon-svg';

const queryParam = ref<CommentListRequest>({
    current: 1,
    size: 10
})

const activeSatus = ref('all')

const filterQuery = (query: CommentListRequest) => {
    return Object.keys(query).reduce((acc: FilterQuery, key): FilterQuery => {
        if (query[key] !== null) {
            acc[key] = query[key]
        }
        return acc
    }, {})
}

const dataCount = ref(0)
const getComments = async () => {
    const query = filterQuery(queryParam.value) as CommentListRequest
    try {
        const res: CommentResponse = await getCommentList(query) as CommentResponse
        dataCount.value = res.data.records.length
        tableUtil.setData(res.data.records || [])
        tableUtil.setPagination({
            total: res.data?.count,
            size: queryParam.value.size,
            num: queryParam.value.current
        })
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const selectedComments = ref<CommentItem[]>([])
const commentIds = computed(() => selectedComments.value.map(item => item.id))

const [tableOps, tableUtil] = createTable([
    {
        title: '全选',
        type: 'selection'
    },
    {
        title: '头像',
        render: ({ row }: any) =>
            row.articleCover === null
                ? '暂无封面'
                : <div class="w-full flex justify-center">
                    <img class="h-16 w-16 rounded-md bg-cover bg-no-repeat object-cover" src={row.avatar} />
                </div>
    },
    {
        title: '评论人',
        field: 'nickname'
    },
    {
        title: '回复人',
        render: ({ row }: any) => {
            return row.replyNickname === null ? '-' : row.replyNickname
        }
    },
    {
        title: '文章标题',
        render: ({ row }: any) => {
            return row.articleTitle === null ? '-' : row.articleTitle
        }
    },
    {
        title: '评论内容',
        field: 'commentContent'
    },
    {
        title: '评论时间',
        render: ({ row }: any) => (
            <div class="flex items-center justify-center">
                <AlarmClock class="h-4 w-4" />
                <span class="ml-2 text-sm">{row.createTime.split('T')[0]}</span>
            </div>
        )
    },
    {
        title: '状态',
        render: ({ row }: any) => (row.isReview === 1 ? <Tag success>正常</Tag> : <Tag danger>审核中</Tag>)
    },
    {
        title: '来源',
        render: ({ row }: any) => (
            row.type === 1
                ? <Tag success>{CommentsSourceMap[row.type]}</Tag>
                : row.type === 2
                    ? <Tag danger>{CommentsSourceMap[row.type]}</Tag>
                    : <Tag primary>{CommentsSourceMap[row.type]}</Tag>
        )
    },
    {
        title: '操作',
        render: ({ row }: any) => {
            return row.isReview === 1
                ? <BaseButton danger onClick={() => handleDelete(row.id)}>删除</BaseButton>
                : <BaseButton primary onClick={() => handleReview(row.id)}>恢复</BaseButton>
        }
    }
])

const changeStatus = async (status: string) => {
    switch (status) {
        case 'all':
            queryParam.value.isReview = null
            break
        case 'normal':
            queryParam.value.isReview = 1
            break
        case 'reviewing':
            queryParam.value.isReview = 0
            break
    }
    queryParam.value.current = 1
    activeSatus.value = status
    await getComments()
}

const isActive = (status: string) => {
    return status === activeSatus.value ? 'text-gray-700 font-bold' : ''
}

const { confirm } = useConfirm()
const handleDelete = async (id: number | null) => {
    if (id === null && selectedComments.value.length === 0) {
        return
    }
    let param: number[] = []
    if (id === null) {
        param = commentIds.value
    } else {
        param = [id]
    }
    try {
        await confirm({
            title: '删除',
            render: '确定彻底删除这些评论吗'
        })
        await deleteComments(param)
        toast.success('删除成功')
        await getComments()
    } catch (e) {
        if (e) {
            toast.danger(e)
        }
    }
}

const handleReview = async (id: number | null) => {
    if (id === null && selectedComments.value.length === 0) {
        return
    }
    let param: Partial<ReviewRequest> = {}
    if (id === null) {
        param.ids = commentIds.value
    } else {
        param.ids = [id]
    }
    param.isReview = 1
    try {
        await confirm({
            title: '删除',
            render: '确定恢复这些评论吗'
        })
        await updateReview(param as ReviewRequest)
        toast.success('恢复成功')
        await getComments()
    } catch (e) {
        if (e) {
            toast.danger(e)
        }
    }
}

const changePage = async (pn: number) => {
    const tempPn = queryParam.value.current
    queryParam.value.current = pn
    try {
        await getComments()
    } catch (e) {
        toast.danger(e)
        queryParam.value.current = tempPn
    }
}

onBeforeMount(() => {
    getComments()
})
</script>
<style lang='scss' scoped></style>