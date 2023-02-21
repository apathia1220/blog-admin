<template>
    <div>
        <div class="flex">
            <div class="flex w-1/2">
                <BaseButton primary @click="addAndEditCates(null)">新增</BaseButton>
                <BaseButton danger :disabled="selectedCates.length === 0" @click="deleteCates(null)">批量删除</BaseButton>
            </div>
            <div class="flex w-1/2 justify-end">
                <div class="w-48">
                    <Input v-model="queryParam.keywords" placeholder="请输入分类名" />
                </div>
                <BaseButton class="ml-4" primary @click="getCates">搜索</BaseButton>
            </div>
        </div>
        <Table class="mt-4" v-model:selected="selectedCates" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
    </div>
</template>

<script lang='tsx' setup>
import { BaseButton, createTable, useConfirm, Input, toast, useModal } from '@apathia/apathia'
import { searchCategories, editCategories, deleteCategories } from '@/apis/categories'
import { AlarmClock } from '@apathia/apathia.icon-svg';
import { CategoryItem } from './types'

const queryParam = ref({
    current: 1,
    size: 10,
    keywords: ''
})

const getCates = async () => {
    try {
        const { data }: any = await searchCategories(queryParam.value)
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
        title: '分类名',
        field: 'categoryName'
    },
    {
        title: '文章量',
        field: 'articleCount'
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
                <BaseButton danger onClick={() => { deleteCates(row.id) }}>删除</BaseButton>
            </div>
        )
    }
])

const selectedCates = ref([])
const cateIds = computed(() => selectedCates.value.map((item: CategoryItem) => item.id) as number[])

const { modal, remove } = useModal()

const submitCates = async (val: string, closeFn: () => void, cates: CategoryItem | null) => {
    let id = null
    if (cates !== null) {
        id = cates.id
    }
    try {
        await editCategories({ categoryName: val, id: id })
        closeFn()
        await getCates()
    } catch (e) {
        toast.danger(e)
    }
}

const addAndEditCates = (cate: CategoryItem | null = null) => {
    let newCateName = cate?.categoryName ? cate?.categoryName : ''
    modal({
        title: '新增分类',
        top: 120,
        width: 360,
        render: () => (
            <div>
                <Input v-model={newCateName} placeholder="请输入分类名" />
                <div class="flex items-center justify-center mt-6">
                    <BaseButton info onClick={remove}>取消</BaseButton>
                    <BaseButton primary onClick={() => submitCates(newCateName, remove, cate)}>确定</BaseButton>
                </div>
            </div>
        )
    })
}

const { confirm } = useConfirm()
const deleteCates = async (id: number | null) => {
    let param: number[] = []
    if (id === null) {
        param = cateIds.value
    } else {
        param = [id]
    }
    try {
        await confirm({
            title: '删除',
            render: '确定彻底删除这些分类吗'
        })
        await deleteCategories(param)
        await getCates()
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
        await getCates()
    } catch (e) {
        toast.danger(e)
        queryParam.value.current = tempPn
    }
}

onBeforeMount(async () => {
    await getCates()
})
</script>