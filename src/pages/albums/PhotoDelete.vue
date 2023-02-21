<template>
    <div>
        <div class="flex items-end justify-between">
            <BaseButton @click="router.push('/albums/list')">返回</BaseButton>
            <div class="flex items-center">
                <Checkbox :modelValue="isSelectedAll" @click="handleSelectAll">全选</Checkbox>
                <span class="text-sm mr-2">已选择{{ selectedPhotos.length }}张</span>
                <BaseButton @click="handleRecovery(null)">批量恢复</BaseButton>
                <BaseButton danger @click="handleDelete">批量删除</BaseButton>
            </div>
        </div>
        <div v-if="photoList.length === 0" class="mt-4 text-center">暂无照片</div>
        <div v-else class="grid grid-cols-3 gap-4 mt-4">
            <div class="relative" v-for="photo in photoList" @click="handleSelect(photo.id as number)">
                <Checkbox :modelValue="isSelected(photo.id as number)" class="absolute left-2 top-2" />
                <img :key="photo.photoSrc" :src="photo.photoSrc">
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { getPhotos, PhotoRequest, deletePhotos, PhotoItem, PhotoResponse, PhotoDeleteRequest, deletePhotoFromAlbum } from '@/apis/albums'
import { toast, useConfirm } from '@apathia/apathia'

const router = useRouter()

const photoForm = ref<PhotoRequest>({
    size: 10,
    current: 1,
    isDelete: 1
})

const photoList = ref<PhotoItem[]>([])
const photoCount = ref(0)
const getDeletePhotos = async () => {
    try {
        const res: PhotoResponse = await getPhotos(photoForm.value) as PhotoResponse
        photoList.value = res.data.records
        photoCount.value = res.data.count
    } catch (e: any) {
        toast.danger(e.message)
    }
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

const isSelectedAll = computed(() => photoCount.value !== 0 && selectedPhotos.value.length === photoCount.value)
const handleSelectAll = () => {
    if (isSelectedAll.value) {
        selectedPhotos.value = []
    } else {
        selectedPhotos.value = photoList.value.map(item => item.id as number)
    }
}

const { confirm } = useConfirm()
const handleRecovery = async (id: number | null) => {
    const param: PhotoDeleteRequest = {
        isDelete: 0
    }
    if (id === null) {
        param.ids = selectedPhotos.value
    } else {
        param.ids = [id]
    }
    try {
        await confirm({
            title: '恢复',
            render: '确认恢复选中的图片？'
        })
        await deletePhotoFromAlbum(param)
        toast.success('恢复成功')
        await getDeletePhotos()
        selectedPhotos.value = []
    } catch (e: any) {
        if (e?.message) {
            toast.danger(e.message)
        }
    }
}

const handleDelete = async () => {
    if (selectedPhotos.value.length === 0) {
        toast.info('请选择要删除的图片')
        return
    }
    try {
        await confirm({
            title: '删除',
            render: '确认彻底删除选中的图片？'
        })
        await deletePhotos(selectedPhotos.value)
        toast.success('删除成功')
        await getDeletePhotos()
        selectedPhotos.value = []
    } catch (e: any) {
        toast.danger(e.message)
    }
}

onBeforeMount(() => {
    getDeletePhotos()
})
</script>