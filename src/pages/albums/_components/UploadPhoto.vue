<template>
    <div>
        <Upload v-model="photoUrls" action="/api/admin/photos/upload" :disabled="isUpload" draggable multiple
            :headers="headers" :resolve-url="resolveLocation" :onBeforeEachUpload="toggleUploadState"
            :onAfterEachUpload="toggleUploadState" />
        <div v-if="isUpload">
            <Loading context="图片上传中" />
        </div>
        <div class="grid grid-cols-3 gap-4 mt-4">
            <div class="relative" v-for="(photo, index) in photoUrls" :key="photo">
                <span class="absolute right-2 cursor-pointer text-xl text-gray-50" @click="deletePhoto(index)">×</span>
                <img :src="photo" alt="">
            </div>
        </div>
        <div class="mt-4">
            <div class="flex justify-end">共上传了{{ photoUrls.length }}张图片</div>
            <div class="flex justify-center mt-2">
                <BaseButton info large @click="close">取消</BaseButton>
                <BaseButton large @click="submitPhoto" :disabled="isUpload">提交</BaseButton>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { useUserStore } from '@/store/user'
import { toast } from '@apathia/apathia'
import { savePhotoForAlbum } from '@/apis/albums'
import Loading from '@/components/Loading.vue'

const props = defineProps<{
    close: () => void
    albumId: number | null
}>()

const headers = useUserStore().headerAuth
const isUpload = ref(false)

const photoUrls = ref<string[]>([])

const resolveLocation = (resp: any) => {
    return resp.data || ''
}

const deletePhoto = (index: number) => {
    photoUrls.value.splice(index, 1)
}

const submitPhoto = async () => {
    if (isUpload.value) {
        toast.warning('图片上传中')
        return
    }
    if (props.albumId === null) {
        toast.danger('相册不存在')
        return
    }
    const param = {
        albumId: props.albumId,
        photoUrls: photoUrls.value
    }
    try {
        await savePhotoForAlbum(param)
        props.close()
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const toggleUploadState = (file: File) => {
    isUpload.value = !isUpload.value
    return file
}
</script>
<style lang='scss' scoped></style>