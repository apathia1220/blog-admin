<template>
    <div>
        <div class="flex justify-between">
            <div class="flex">
                <img class="h-24 w-24 rounded-md" :src="albumInfo.albumCover">
                <div class="flex flex-col ml-4 justify-end">
                    <span>{{ albumInfo.albumName }}</span>
                    <span class="mb-2">共{{ albumInfo.photoCount }}张图片</span>
                    <BaseButton @click="openUploadModal">上传图片</BaseButton>
                </div>
            </div>
            <div class="flex flex-col items-end justify-between">
                <BaseButton @click="router.push('/albums/list')">返回</BaseButton>
                <div class="flex items-end">
                    <Checkbox :modelValue="isSelectedAll" @click="handleSelectAll">全选</Checkbox>
                    <span class="text-sm mr-2">已选择{{ selectedPhotos.length }}张</span>
                    <BaseButton :disabled="selectedPhotos.length === 0" @click="handleMove">移动到</BaseButton>
                    <BaseButton danger :disabled="selectedPhotos.length === 0" @click="handleDelete(null)">批量删除</BaseButton>
                </div>
            </div>
        </div>
        <div v-if="photoList.length === 0" class="mt-4 text-center">暂无照片</div>
        <div v-else class="grid grid-cols-6 auto-rows-fr gap-4 mt-4">
            <div class="relative" v-for="(photo, index) in photoList" :key="photo.photoSrc"
                @click="handleSelect(photo.id as number)">
                <Checkbox :modelValue="isSelected(photo.id as number)" class="absolute left-2 top-2" />
                <img class="object-cover h-full" :key="photo.photoSrc" :src="photo.photoSrc">
                <div class="absolute right-4 top-0 cursor-pointer">
                    <Dropdown trigger="hover">
                        <span class="text-2xl">...</span>
                        <template #dropdown>
                            <div class="flex flex-col cursor-pointer">
                                <span class="mb-4 hover:text-blue-300" @click="handleEdit(photo)">编辑</span>
                                <span class="hover:text-blue-300" @click="handleDelete(photo.id)">删除</span>
                            </div>
                        </template>
                    </Dropdown>
                </div>
            </div>
        </div>
        <div v-if="(albumInfo.photoCount && photoList.length < albumInfo.photoCount)" class="mt-8 flex justify-center">
            <BaseButton @click="getMore">加载更多</BaseButton>
        </div>
    </div>
</template>

<script lang='tsx' setup>
import {
    getAlbumsInfo,
    getPhotos,
    getAlbumDetail,
    deletePhotoFromAlbum,
    AlbumItem,
    AlbumDetailResponse,
    PhotoRequest,
    PhotoItem,
    PhotoResponse,
    AlbumResponse,
    PhotoDeleteRequest
} from '@/apis/albums'
import { toast, useModal, useConfirm } from '@apathia/apathia'
import UploadPhoto from './_components/UploadPhoto.vue'
import PhotoMove from './_components/PhotoMove.vue'
import PhotoEdit from './_components/PhotoEdit.vue'

const router = useRouter()

const albumsList = ref<AlbumItem[]>([])
const getAlbums = async () => {
    try {
        const res: AlbumResponse = await getAlbumsInfo() as AlbumResponse
        albumsList.value = res.data.records
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const route = useRoute()
const albumInfo = ref<AlbumItem>({
    id: null,
    albumName: '',
    albumDesc: '',
    albumCover: '',
    photoCount: 0
})
const getAlbumInfo = async () => {
    const id = route.params.id
    if (!id) return
    try {
        const res: AlbumDetailResponse = await getAlbumDetail(+id) as AlbumDetailResponse
        albumInfo.value = res.data
        queryParam.value.albumId = res.data.id
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const queryParam = ref<PhotoRequest>({
    current: 1,
    size: 12,
    albumId: albumInfo.value.id,
    isDelete: 0
})
const photoList = ref<PhotoItem[]>([])
const getPhotosByAlbum = async () => {
    try {
        const res: PhotoResponse = await getPhotos(queryParam.value) as PhotoResponse
        if (queryParam.value.current > 1) {
            photoList.value.push(...res.data.records)
        } else {
            photoList.value = res.data.records
        }
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const { modal, remove } = useModal()
const closeModal = () => {
    queryParam.value.current = 1
    remove()
    getPhotosByAlbum()
    getAlbumInfo()
    selectedPhotos.value = []
}
const openUploadModal = () => {
    modal({
        title: '上传图片',
        render: () => <UploadPhoto close={closeModal} albumId={albumInfo.value.id} />
    })
}

const selectedPhotos = ref<number[]>([])
const isSelected = (id: number) => selectedPhotos.value.includes(id)

const handleSelect = (id: number) => {
    const index = selectedPhotos.value.indexOf(id)
    if (index > -1) {
        selectedPhotos.value.splice(index, 1)
    } else {
        selectedPhotos.value.push(id)
    }
}

const isSelectedAll = computed(() => albumInfo.value.photoCount !== 0 && selectedPhotos.value.length === albumInfo.value.photoCount)
const handleSelectAll = () => {
    if (isSelectedAll.value) {
        selectedPhotos.value = []
    } else {
        selectedPhotos.value = photoList.value.map(item => item.id as number)
    }
}

const { confirm } = useConfirm()
const handleDelete = async (id: number | null) => {
    const param: PhotoDeleteRequest = {
        isDelete: 1
    }
    if (id === null) {
        param.ids = selectedPhotos.value.map(item => item)
    } else {
        param.ids = [id]
    }
    try {
        await confirm({
            title: '删除',
            render: '确认删除选中的图片？'
        })
        await deletePhotoFromAlbum(param)
        // const index = photoList.value.findIndex(item => item.id === id)
        // photoList.value.splice(index, 1)
        await getPhotosByAlbum()
        await getAlbumInfo()
        toast.success('删除成功')
    } catch (e: any) {
        if (e?.message) {
            toast.danger(e.message)
        }
    }
}

const handleMove = () => {
    if (selectedPhotos.value.length === 0) {
        toast.warning('请选择要移动的图片')
        return
    }
    modal({
        title: '移动图片',
        render: () => <PhotoMove close={closeModal} selectedIds={selectedPhotos.value} albumId={albumInfo.value.id} />
    })
}

const handleEdit = (photoItem: PhotoItem) => {
    modal({
        title: '编辑照片',
        render: () => <PhotoEdit photo={photoItem} close={closeModal} />
    })
}

const getMore = () => {
    queryParam.value.current++
    getPhotosByAlbum()
}

onBeforeMount(async () => {
    await getAlbums()
    await getAlbumInfo()
    await getPhotosByAlbum()
})
</script>