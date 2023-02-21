<template>
    <div class="flex flex-col h-full px-2 pb-4 rounded-md bg-gray-200">
        <h1 class="border-b-4 text-2xl p-4 w-36">关于我</h1>
        <mavon-editor ref="md" class="article-editor h-4/5 mt-4" v-model="aboutContent" @imgAdd="uploadImg" />
        <div class="mt-4 w-full flex justify-end">
            <BaseButton primary large @click="submitAbout">提交</BaseButton>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { toast } from '@apathia/apathia'
import { getAbout, uploadAboutImg, updateAbout, AboutResponse } from '@/apis/website'

const aboutContent = ref('')

const getAboutContent = async () => {
    try {
        const res: AboutResponse = await getAbout() as AboutResponse
        aboutContent.value = res.data.content !== null ? res.data.content : ''
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const md = ref<any>(null)
const uploadImg = async (pos: string, file: File) => {
    let formData = new FormData()
    formData.append('file', file)
    try {
        const { data } = await uploadAboutImg(formData)
        md.value?.$img2Url(pos, data)
    } catch (e) {
        toast.danger(e)
    }
}

const submitAbout = async () => {
    if (aboutContent.value.trim() === '') {
        toast.danger('内容不能为空')
        return
    }
    try {
        await updateAbout(aboutContent.value)
        toast.success('提交成功')
    } catch (e: any) {
        toast.danger(e.message)
    }
}

onBeforeMount(() => {
    getAboutContent()
})
</script>
<style lang='scss' scoped>

</style>