<template>
    <Form>
        <FormItem label="相册名称">
            <Input v-model="albumForm.albumName" />
        </FormItem>
        <FormItem label="相册描述">
            <Input v-model="albumForm.albumDesc" />
        </FormItem>
        <FormItem label="相册封面">
            <div class="flex">
                <Upload class="w-24 cursor-pointer" v-model="albumForm.albumCover" action="/api/admin/photos/albums/upload"
                    :resolve-url="resolveLocation" :headers="headers" draggable>
                    <template #drag>
                        <div
                            class="h-24 w-24 rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                            <Plus v-if="!albumForm.albumCover" />
                            <img class="h-24 w-24 rounded-md bg-cover bg-no-repeat object-cover" v-else
                                :src="albumForm.albumCover">
                        </div>
                    </template>
                </Upload>
            </div>
        </FormItem>
        <FormItem label="发布形式">
            <RadioGroup v-model="albumForm.status">
                <Radio :value="1">公开</Radio>
                <Radio :value="2">私密</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <div class="flex justify-center mt-4">
                <BaseButton info large @click="close">取消</BaseButton>
                <BaseButton large @click="addOrEditAlbum">提交</BaseButton>
            </div>
        </FormItem>
    </Form>
</template>

<script lang='ts' setup>
import { editAlbum, AlbumItem } from '@/apis/albums'
import { useUserStore } from '@/store/user';
import { toast } from '@apathia/apathia'
import { Plus } from '@apathia/apathia.icon-svg'

interface AlbumModalProps {
    album: AlbumItem
    close: () => void
}

const props = withDefaults(defineProps<AlbumModalProps>(), {
    album: () => ({
        id: null,
        albumName: '',
        albumDesc: '',
        albumCover: '',
        status: 1
    })
})

const headers = useUserStore().headerAuth
const albumForm = ref<AlbumItem>(props.album)

const addOrEditAlbum = async () => {
    if (albumForm.value.albumName.trim() === '') {
        toast.danger('相册名不能为空')
        return
    }
    if (albumForm.value.albumDesc.trim() === '') {
        toast.danger('相册描述不能为空')
        return
    }
    if (albumForm.value.albumCover.trim() === '') {
        toast.danger('相册封面不能为空')
        return
    }
    try {
        await editAlbum(albumForm.value)
        props.close()
        toast.success(albumForm.value.id ? '编辑相册成功' : '添加相册成功')
    } catch (e: any) {
        toast.danger(e.message)
    }
}
const resolveLocation = (resp: any) => {
    return resp.data || ''
}
</script>
<style lang='scss' scoped></style>