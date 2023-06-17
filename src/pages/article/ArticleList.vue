<template>
    <div>
        <div class="my-2 text-gray-400 text-sm">
            <span class="mr-4 text-gray-700 font-bold cursor-pointer">状态</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('all')" :class="isActive('all')">全部</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('public')" :class="isActive('public')">公开</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('private')" :class="isActive('private')">私密</span>
            <span class="mr-4 cursor-pointer" @click="changeStatus('draft')" :class="isActive('draft')">草稿箱</span>
            <span class="cursor-pointer" @click="changeStatus('delete')" :class="isActive('delete')">回收箱</span>
        </div>
        <div class="flex my-4">
            <div class="flex w-1/2">
                <BaseButton danger :disabled="selectedArticle.length === 0" @click="batchDelete">批量删除</BaseButton>
                <BaseButton success :disabled="selectedArticle.length === 0" @click="batchExport">批量导出</BaseButton>
                <Upload v-model="articleUpload" action="/api/admin/articles/import" :headers="headers"
                    :onAfterEachUpload="successHandler" :onError="errorHandler"
                    :resolve-url="(resp: any) => resp.data || ''" draggable>
                    <template #drag>
                        <BaseButton primary>批量导入</BaseButton>
                    </template>
                </Upload>
            </div>
            <div class="flex w-1/2 justify-end">
                <Select v-model="queryParam.type" class="ml-2" placeholder="请选择文章类型" @change="getAricles">
                    <Option :value="null">全部</Option>
                    <Option v-for="type in articleList" :key="type" :value="type">{{ articleType[type] }}</Option>
                </Select>
                <Select v-model="queryParam.categoryId" class="ml-2" placeholder="请选择分类" @change="getAricles">
                    <Option :value="null">全部</Option>
                    <Option v-for="cate in cateList" :key="cate.id" :value="cate.id">{{ cate.categoryName }}</Option>
                </Select>
                <Select v-model="queryParam.tagId" class="ml-2" placeholder="请选择标签" @change="getAricles">
                    <Option :value="null">全部</Option>
                    <Option v-for="tag in tagList" :key="tag.id" :value="tag.id">{{ tag.tagName }}</Option>
                </Select>
                <div class="ml-2 w-48">
                    <Input v-model="queryParam.keywords" placeholder="请输入文章名" />
                </div>
                <BaseButton class="ml-4" primary @click="getAricles">搜索</BaseButton>
            </div>
        </div>
        <Table v-model:selected="selectedArticle" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
        <Loading v-if="isLoading" context="" />
    </div>
</template>

<script lang='tsx' setup>
import { BaseButton, createTable, Switch, toast, Tag, useConfirm } from '@apathia/apathia'
import { AlarmClock } from '@apathia/apathia.icon-svg'
import { editArticleStatus, editArticleIsTop, deleteArticle, getArticleList, exportArticle } from '@/apis/articles'
import { getTagList } from '@/apis/tags'
import { getCateList } from '@/apis/categories'
import { ListQuery, FilterQuery, ListResponse, UpdateDelete, UpdateTopAndFeatured, TagItem, CategoryItem } from './types'
import { articleType, articleList } from './constant'
import { useUserStore } from '@/store/user'
import Loading from '@/components/Loading.vue'

const headers = useUserStore().headerAuth

const router = useRouter()

const queryParam = ref<ListQuery>({
    isDelete: 0,
    status: null,
    categoryId: null,
    tagId: null,
    type: null,
    keywords: null,
    current: 1,
    size: 10
})
const activeSatus = ref('all')
let tagList: TagItem[] = ([])
let cateList: CategoryItem[] = ([])
const articleUpload = ref('')
const isLoading = ref(false)

const filterQuery = (query: ListQuery) => {
    return Object.keys(query).reduce((acc: FilterQuery, key): FilterQuery => {
        if (query[key] !== null) {
            acc[key] = query[key]
        }
        return acc
    }, {})
}

const getAricles = async () => {
    try {
        isLoading.value = true
        const query = filterQuery(queryParam.value)
        const { data }: any = await getArticleList(query)
        tableUtil.setData(data?.records || [])
        tableUtil.setPagination({
            total: data?.count,
            size: queryParam.value.size,
            num: queryParam.value.current
        })
    } catch (e) {
        toast.danger(e)
    } finally {
        isLoading.value = false
    }
}

const getCates = async () => {
    try {
        const { data } = await getTagList()
        tagList = data as TagItem[]
    } catch (e) {
        toast.danger(e)
    }
}

const getTags = async () => {
    try {
        const { data } = await getCateList()
        cateList = data as CategoryItem[]
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
        title: '文章封面',
        render: ({ row }: any) => {
            return (row.articleCover === null ? '暂无封面' : <div class="flex justify-center">
                <img class="h-24 w-36 rounded-md bg-cover bg-no-repeat object-cover" src={row.articleCover} />
            </div>)
        }
    },
    {
        title: '标题',
        field: 'articleTitle'
    },
    {
        title: '分类',
        render: ({ row }: any) => {
            return row.categoryName === null ? '-' : row.categoryName
        }
    },
    {
        title: '标签',
        render: ({ row }: any) => {
            return row.tagDTOs.map((tag: Record<string, any>) => (<Tag primary>{tag.tagName}</Tag>))
        }
    },
    {
        title: '浏览量',
        render: ({ row }: any) => {
            if (row.viewsCount === null) {
                return '-'
            } else {
                return <span>{row.viewsCount}</span>
            }
        }
    },
    {
        title: '类型',
        render: ({ row }: any) => (<Tag danger>{articleType[row.type]}</Tag>)
    },
    {
        title: '发表时间',
        render: ({ row }: any) => (
            <div class="flex items-center justify-center">
                <AlarmClock class="h-4 w-4" />
                <span class="ml-2 text-sm">{row.createTime.split('T')[0]}</span>
            </div>
        )
    },
    {
        title: '置顶',
        render: ({ row }: any) => (<Switch v-model={row.isTop} trueValue={1} falseValue={0} onChange={(val: number) => handleChange(row, val, 'top')} />)
    },
    {
        title: '推荐',
        render: ({ row }: any) => (<Switch v-model={row.isFeatured} trueValue={1} falseValue={0} onChange={(val: number) => handleChange(row, val, 'feature')} />)
    },
    {
        title: '操作',
        render: ({ row }: any) => {
            return row.isDelete === 0
                ? (
                    <div class="flex">
                        <BaseButton primary onClick={() => editArticle(row.id)}>编辑</BaseButton>
                        <BaseButton danger onClick={() => updateArticleDelete(row.id)}>删除</BaseButton>

                    </div >
                )
                : (
                    <div class="flex">
                        <BaseButton success onClick={() => updateArticleDelete(row.id)}>恢复</BaseButton>
                        <BaseButton danger onClick={() => deleteArticles(row.id)}>删除</BaseButton>
                    </div >
                )
        }
    }
])

const selectedArticle = ref<ListResponse[]>([])
const articleIds = computed(() => selectedArticle.value.map((item: ListResponse) => item.id) as number[])

const changeStatus = async (status: string) => {
    switch (status) {
        case 'all':
            queryParam.value.isDelete = 0
            queryParam.value.status = null
            break
        case 'public':
            queryParam.value.isDelete = 0
            queryParam.value.status = 1
            break
        case 'private':
            queryParam.value.isDelete = 0
            queryParam.value.status = 2
            break
        case 'draft':
            queryParam.value.isDelete = 0
            queryParam.value.status = 3
            break
        case 'delete':
            queryParam.value.isDelete = 1
            queryParam.value.status = null
            break
    }
    queryParam.value.current = 1
    activeSatus.value = status
    try {
        await getAricles()
    } catch (e) {
        toast.danger(e)
    }
}

const isActive = (status: string) => {
    return status === activeSatus.value ? 'text-gray-700 font-bold' : ''
}

const editArticle = (id: number) => {
    router.push('/article/edit/' + id)
}

const updateArticleDelete = async (id: number | null) => {
    const param: UpdateDelete = {}
    if (id !== null) {
        param.ids = [id]
    } else {
        param.ids = articleIds.value
    }
    param.isDelete = queryParam.value.isDelete === 0 ? 1 : 0
    try {
        await editArticleStatus(param)
        toast.success('更行删除状态成功')
        await getAricles()
    } catch (e) {
        toast.danger(e)
    }
}

const { confirm } = useConfirm()
const deleteArticles = async (id: number | null) => {
    let param: number[] = []
    if (id === null) {
        param = articleIds.value
    } else {
        param = [id]
    }
    try {
        await confirm({
            title: '删除',
            render: '确定彻底删除这些文章吗'
        })
        await deleteArticle(param)
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
        await getAricles()
    } catch (e) {
        toast.danger(e)
        queryParam.value.current = tempPn
    }
}

const batchDelete = async () => {
    try {
        if (queryParam.value.isDelete === 1) {
            await deleteArticles(null)
        } else {
            await updateArticleDelete(null)
        }
    } catch (e) {
        toast.danger(e)
    }
}

const downloadFile = (url: string) => {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.style.height = '0px'
    iframe.src = url
    document.body.appendChild(iframe)
    setTimeout(() => {
        iframe.remove()
    }, 5 * 60 * 1000)
}

const batchExport = async () => {
    try {
        await confirm({
            title: '导出',
            render: '确定导出这些文章?'
        })
        const { data }: any = await exportArticle(articleIds.value)
        data.forEach((item: any) => {
            downloadFile(item)
        })
        toast.success('导出成功')
    } catch (e) {
        toast.danger(e)
    }
}

const successHandler = async () => {
    toast.success('文件上传成功')
    try {
        await getAricles()
    } catch (e) {
        toast.danger(e)
    }
}

const errorHandler = () => {
    toast.danger('文件上传失败')
}

const handleChange = async (row: ListResponse, val: number, type: string) => {
    const param: UpdateTopAndFeatured = {
        id: row.id as number,
    }
    if (type === 'top') {
        param.isFeatured = row.isFeatured
        param.isTop = val
    } else {
        param.isFeatured = val
        param.isTop = row.isTop
    }
    try {
        await editArticleIsTop(param)
        toast.success(`更行${type === 'top' ? '置顶' : '推荐'}状态成功`)
    } catch (e) {
        toast.danger(e)
    }
}

onBeforeMount(async () => {
    await getAricles()
    await getCates()
    await getTags()
})
</script>