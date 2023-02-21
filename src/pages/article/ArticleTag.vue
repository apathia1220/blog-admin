<template>
    <div>
        <div class="flex">
            <div class="flex w-1/2">
                <BaseButton primary @click="addAndEditCates(null)">新增</BaseButton>
                <BaseButton danger @click="deleteTag(null)">批量删除</BaseButton>
            </div>
            <div class="flex w-1/2 justify-end">
                <div class="w-48">
                    <Input v-model="queryParam.keywords" placeholder="请输入标签名" />
                </div>
                <BaseButton class="ml-4" primary @click="getTags">搜索</BaseButton>
            </div>
        </div>
        <Table class="mt-4" v-model:selected="selectedTags" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
    </div>
</template>

<script lang='tsx' setup>
import { BaseButton, createTable, Input, toast, Tag, useConfirm, useModal } from '@apathia/apathia'
import { AlarmClock } from '@apathia/apathia.icon-svg';
import { deleteTags, editTags, searchTag } from '@/apis/tags'
import { TagItem } from './types';

const queryParam = ref({
    current: 1,
    size: 10,
    keywords: ''
})

const getTags = async () => {
    try {
        const { data }: any = await searchTag(queryParam.value)
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
        title: '标签名',
        render: ({ row }: any) => (<Tag primary>{row.tagName}</Tag>)
    },
    {
        title: '文章量',
        render: ({ row }: any) => (<span>{row.articleCount}</span>)
    },
    {
        title: '创建时间',
        render: ({ row }: any) => (
            <div class="flex items-center justify-center">
                <AlarmClock class="h-4 w-4" />
                <span class="ml-2 text-sm">{row.createTime.split('T')[0]}</span>
            </div>
        )
    },
    {
        title: '操作',
        render: ({ row }: any) => (
            <div>
                <BaseButton primary onClick={() => addAndEditCates(row)}>编辑</BaseButton>
                <BaseButton danger onClick={() => deleteTag(row.id)}>删除</BaseButton>
            </div>
        )
    }
])

const selectedTags = ref([])
const tagIds = computed(() => selectedTags.value.map((tag: TagItem) => tag.id))

const { modal, remove } = useModal()

const submitTags = async (val: string, closeFn: () => void, tags: TagItem | null) => {
    let id = null
    if (tags !== null) {
        id = tags.id
    }
    try {
        await editTags({ tagName: val, id: id })
        closeFn()
        await getTags()
        toast.success('保存成功')
    } catch (e) {
        toast.danger(e)
    }
}

const addAndEditCates = (tag: TagItem | null = null) => {
    let newTagName = tag?.tagName ? tag?.tagName : ''
    modal({
        title: '新增分类',
        top: 120,
        width: 360,
        render: () => (
            <div>
                <Input v-model={newTagName} placeholder="请输入分类名" />
                <div class="flex items-center justify-center mt-6">
                    <BaseButton info onClick={remove}>取消</BaseButton>
                    <BaseButton primary onClick={() => submitTags(newTagName, remove, tag)}>确定</BaseButton>
                </div>
            </div>
        )
    })
}

const { confirm } = useConfirm()
const deleteTag = async (id: number | null) => {
    let param: number[] = []
    if (id === null) {
        param = tagIds.value
    } else {
        param = [id]
    }
    try {
        await confirm({
            title: '删除',
            render: '确定彻底删除这些分类吗'
        })
        await deleteTags(param)
        await getTags()
        toast.success('删除成功')
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
        await getTags()
    } catch (e) {
        toast.danger(e)
        queryParam.value.current = tempPn
    }
}

onBeforeMount(async () => {
    await getTags()
})
</script>