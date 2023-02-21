<template>
    <div class=" bg-gray-100 px-2 py-4 rounded-md">
        <Textarea v-model="talkForm.content" placeholder="说点什么吧" rows="8" />
        <div class="flex mt-2 justify-start">
            <div class="mr-4 relative" v-for="(img, index) in talkForm.id ? talkForm.imgs : talkForm.images"
                :key="index">
                <Image :src="img" :preview="false" />
                <span class="absolute top-0 right-1 text-xl z-50 hover:text-gray-600 cursor-pointer"
                    @click="removeImg(img)">×</span>
            </div>
            <Upload v-model="pictureUrl" class="cursor-pointer" action="/api/admin/talks/images" :headers="headers"
                :resolve-url="resolveLocation" draggable>
                <template #drag>
                    <div
                        class="h-24 w-24 rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                        <Plus />
                    </div>
                </template>
            </Upload>
        </div>
        <div class="flex justify-end items-center">
            <span class="mr-4 text-blue-400 text-sm">置顶</span>
            <Switch v-model="talkForm.isTop" :trueValue="1" :falseValue="0" />
            <Select class="mx-4" v-model="talkForm.status">
                <Option :value="1">公开</Option>
                <Option :value="2">私密</Option>
            </Select>
            <BaseButton primary @click="submit">发布</BaseButton>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { toast } from '@apathia/apathia'
import { Plus } from '@apathia/apathia.icon-svg'
import { AddTalksRequest } from './types'
import { getTalksById, editTalks } from '@/apis/talks'
import { useUserStore } from '@/store/user';

const headers = useUserStore().headerAuth

const route = useRoute()
const router = useRouter()

const talkForm = ref<AddTalksRequest>({
    content: '',
    id: null,
    images: [],
    imgs: [],
    isTop: 0,
    status: 1
})

const pictureUrl = ref<string>('')

watch(() => pictureUrl.value, val => {
    if (talkForm.value.images.indexOf(pictureUrl.value) >= 0) {
        return
    }
    talkForm.value.images.push(val)
})

const resolveLocation = (resp: any) => {
    return resp.data || ''
}

const removeImg = (img: string) => {
    const index = talkForm.value.images.indexOf(img)
    if (index < 0) {
        return
    }
    talkForm.value.images.splice(index, 1)
}

const submit = async () => {
    if (talkForm.value.content.trim() === '') {
        toast.danger('说说内容不能为空')
    }
    try {
        await editTalks({ ...talkForm.value, images: JSON.stringify(talkForm.value.images) })
        toast.success('发布成功')
        router.push('/talks/list')
    } catch (e) {
        toast.danger(e)
    }
}

const getTalksByIdItem = async (id: number) => {
    try {
        const { data } = await getTalksById(id)
        talkForm.value = data as AddTalksRequest
    } catch (e) {
        toast.danger(e)
    }
}
watch(() => route.path, async (val) => {
    const talkId = val.split('/')[3]
    if (talkId) {
        await getTalksByIdItem(+talkId)
    } else {
        talkForm.value = {
            content: '',
            id: null,
            images: [],
            imgs: [],
            isTop: 0,
            status: 1
        }
    }
})

onBeforeMount(async () => {
    const talkId = route.path.split('/')[3]
    if (talkId) {
        await getTalksByIdItem(+talkId)
    }
})
</script>