<template>
    <div>
        <RadioGroup v-model="targetAlbum">
            <Radio v-for="album in albumsList" :value="album.id">
                <div class="flex mr-4">
                    <img class="h-14" :src="album.albumCover" alt="">
                    <span class="ml-2">{{ album.albumName }}</span>
                </div>
            </Radio>
        </RadioGroup>
        <div class="flex justify-center mt-6">
            <BaseButton info large @click="close">取消</BaseButton>
            <BaseButton large @click="submitMove">提交</BaseButton>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { AlbumItem, getAlbumsInfo, movePhoto } from '@/apis/albums'
import { toast } from '@apathia/apathia'

const props = defineProps<{
    albumId: number | null
    close: () => void
    selectedIds: number[]
}>()

const albumsList = ref<AlbumItem[]>([])
const getAlbums = async () => {
    try {
        const res = await getAlbumsInfo()
        albumsList.value = res.data as AlbumItem[]
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const targetAlbum = ref<number | null>(props.albumId)
const submitMove = async () => {
    const param = {
        albumId: targetAlbum.value,
        photoIds: props.selectedIds
    }
    try {
        await movePhoto(param)
        toast.success('移动成功')
        props.close()
    } catch (e: any) {
        toast.danger(e.message)
    }
}

onBeforeMount(() => {
    getAlbums()
})
</script>
<style lang='scss' scoped>

</style>