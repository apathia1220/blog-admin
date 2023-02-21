<template>
    <div>
        <Form>
            <FormItem label="照片名称">
                <Input v-model="photoForm.photoName" />
            </FormItem>
            <FormItem label="照片描述">
                <Input v-model="photoForm.photoDesc" />
            </FormItem>
            <FormItem>
                <div class="flex justify-center mt-4">
                    <BaseButton info @click="close" large>取消</BaseButton>
                    <BaseButton large @click="updatePhotoDetail">提交</BaseButton>
                </div>
            </FormItem>
        </Form>
    </div>
</template>

<script lang='ts' setup>
import { updatePhoto, PhotoEditRequest, PhotoItem } from '@/apis/albums'
import { toast } from '@apathia/apathia'

interface EditPhotoProps {
    photo: PhotoItem
    close: () => void
}
const props = defineProps<EditPhotoProps>()

const photoForm = ref<PhotoEditRequest>({
    id: props.photo.id,
    photoName: props.photo.photoName,
    photoDesc: props.photo.photoDesc
})

const updatePhotoDetail = async () => {
    if (photoForm.value.id === null) {
        toast.danger('请先选择照片')
        return
    }
    if (photoForm.value.photoName.trim() === '') {
        toast.danger('照片名称不能为空')
        return
    }
    try {
        await updatePhoto(photoForm.value)
        toast.success('修改成功')
        props.close()
    } catch (e: any) {
        toast.danger(e.message)
    }
}
</script>
<style lang='scss' scoped>

</style>