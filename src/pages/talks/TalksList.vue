<template>
    <div>
        <div class="my-2 text-gray-400 text-sm">
            <span class="mr-4 text-gray-700 font-bold cursor-pointer">状态</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('all')" :class="isActive('all')">全部</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('public')" :class="isActive('public')">公开</span>
            <span class="cursor-pointer" @click="changeStatus('private')" :class="isActive('private')">私密</span>
        </div>
        <div class="py-4">
            <BaseButton danger @click="deleteTalks(null)">批量删除</BaseButton>
        </div>
        <Table v-model:selected="selectedTalk" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
    </div>
</template>

<script lang='tsx' setup>
import { BaseButton, createTable, Switch, toast, useConfirm } from '@apathia/apathia'
import { getTalkList, deleteTalk } from '@/apis/talks'
import { TalkRequest, EditListResponse } from './types'

const router = useRouter()

const queryParam = ref<TalkRequest>({
    size: 10,
    current: 1
})

const getTalks = async () => {
    try {
        const { data }: any = await getTalkList(queryParam.value)
        tableUtil.setData(data?.records || [])
        tableUtil.setPagination({
            total: data?.count,
            size: queryParam.value.size,
            num: queryParam.value.current
        })
    } catch (e) {
        toast.danger(e)
    }
}

const [tableOps, tableUtil] = createTable([
    {
        title: '全选',
        type: 'selection'
    },
    {
        title: '头像',
        width: 80,
        render: ({ row }: any) => {
            return <img class="h-12 w-12 rounded-full" src={row.avatar}></img>
        }
    },
    {
        title: '用户昵称',
        field: 'nickname'
    },
    {
        title: '内容',
        render: ({ row }: any) => {
            return <span>{row.content}</span>
        }
    },
    {
        title: '图片',
        render: ({ row }: any) => {
            return <div class="flex justify-center">
                <img class="h-24 w-36 rounded-md bg-cover bg-no-repeat object-cover" src={row.imgs[0]} />
            </div>
        }
    },
    {
        title: '置顶',
        render: ({ row }: any) => (<Switch v-model={row.isTop} trueValue={1} falseValue={0} />)
    },
    {
        title: '操作',
        render: ({ row }: any) => (
            <div class="flex">
                <BaseButton primary onClick={() => { router.push('/talks/edit/' + row.id) }}>编辑</BaseButton>
                <BaseButton danger onClick={() => deleteTalks(row.id)}>删除</BaseButton>
            </div>
        )
    }
])

const selectedTalk = ref<EditListResponse[]>([])
const talkIds = computed(() => selectedTalk.value.map(item => item.id) as number[])

const activeSatus = ref('all')
const changeStatus = async (status: string) => {
    switch (status) {
        case 'all':
            queryParam.value.status = ''
            break
        case 'public':
            queryParam.value.status = 1
            break
        case 'private':
            queryParam.value.status = 2
            break
    }
    queryParam.value.current = 1
    activeSatus.value = status
    try {
        await getTalks()
    } catch (e) {
        toast.danger(e)
    }
}

const isActive = (status: string) => {
    return status === activeSatus.value ? 'text-gray-700 font-bold' : ''
}

const { confirm } = useConfirm()
const deleteTalks = async (id: number | null) => {
    let param: number[] = []
    if (id === null) {
        param = talkIds.value
    } else {
        param = [id]
    }
    try {
        await confirm({
            title: '删除',
            render: '确定删除这些说说吗'
        })
        await deleteTalk(param)
        toast.success('删除成功')
        await getTalks()
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
        await getTalks()
    } catch (e) {
        toast.danger(e)
        queryParam.value.current = tempPn
    }
}

onBeforeMount(async () => {
    await getTalks()
})
</script>