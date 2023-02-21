<template>
    <div>
        <div class="flex justify-between">
            <BaseButton primary @click="openAlbumModal">新建相册</BaseButton>
            <div class="flex">
                <BaseButton danger @click="router.push('/albums/delete')">回收站</BaseButton>
                <div class="mr-2">
                    <Input v-model="queryParam.keywords" placeholder="请输入相册名" />
                </div>
                <BaseButton primary @click="getAlbums">搜索</BaseButton>
            </div>
        </div>
        <Table class="mt-4" v-bind="tableOps" row-key="id" />
        <Pagination :options="tableOps.pagination" @page-change="(pn: number) => changePage(pn)" />
    </div>
</template>

<script lang='tsx' setup>
import { createTable, BaseButton, toast, useConfirm, useModal, Tag } from '@apathia/apathia'
import { getAlbumsList, deleteAlbum, AlbumRequest, AlbumResponse, AlbumItem } from '@/apis/albums'
import AlbumSubmit from './_components/AlbumSubmit.vue'

const router = useRouter()

const queryParam = ref<AlbumRequest>({
    size: 10,
    current: 1
})
const getAlbums = async () => {
    try {
        const res: AlbumResponse = await getAlbumsList(queryParam.value) as AlbumResponse
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

const [tableOps, tableUtil] = createTable([
    {
        title: '相册封面',
        render: ({ row }: any) =>
            row.albumCover === null
                ? '暂无封面'
                : <img src={row.albumCover} onClick={() => router.push('/albums/photos/' + row.id)} />
    },
    {
        title: '相册名',
        field: 'albumName'
    },
    {
        title: '相册描述',
        field: 'albumDesc'
    },
    {
        title: '照片数',
        field: 'photoCount'
    },
    {
        title: '状态',
        render: ({ row }: any) => (row.status === 1 ? <Tag success>正常</Tag> : <Tag danger>私密</Tag>)
    },
    {
        title: '操作',
        render: ({ row }: any) => (
            <div class="flex">
                <BaseButton priamry onClick={() => openAlbumModal(row)}>编辑</BaseButton>
                <BaseButton danger onClick={() => handleDelete(row.id)}>删除</BaseButton>
            </div>
        )
    }
])

const { modal, remove } = useModal()

const closeModal = async () => {
    remove()
    await getAlbums()
}
const openAlbumModal = (album: AlbumItem) => {
    const albumData = album.id ? album : {
        id: null,
        albumName: '',
        albumDesc: '',
        albumCover: '',
        status: 1
    }
    modal({
        title: album.id ? '编辑相册' : '新建相册',
        width: 500,
        render: () => (<AlbumSubmit close={closeModal} album={albumData} />)
    })
}

const changePage = async (pn: number) => {
    const tempPn = queryParam.value.current
    queryParam.value.current = pn
    try {
        await getAlbums()
    } catch (e) {
        toast.danger(e)
        queryParam.value.current = tempPn
    }
}

const { confirm } = useConfirm()
const handleDelete = async (id: number) => {
    if (id === null) return
    try {
        await confirm({
            title: '删除',
            render: '确定删除此相册吗'
        })
        await deleteAlbum(id)
        toast.success('删除成功')
        await getAlbums()
    } catch (e: any) {
        toast.danger(e.message)
    }
}

onBeforeMount(() => {
    getAlbums()
})
</script>