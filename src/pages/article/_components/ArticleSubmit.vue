<template>
    <Form>
        <FormItem class="pb-4" label="文章分类" labelAlign="center">
            <Tag class="h-8 text-base" v-if="!!articleData.categoryName" success @click="openCate">
                <div class="text-sm px-2 py-1">
                    <span>{{ articleData.categoryName }}</span>
                    <span class="pl-2 cursor-pointer" @click.stop="deleteCateAndTag('cate')">×</span>
                </div>
            </Tag>
            <Popper placement="bottom" v-model="showCate" trigger="manual">
                <BaseButton v-if="!articleData.categoryName" success hollow @click="openCate">添加分类</BaseButton>
                <template #content>
                    <div class="w-96" ref="cateRef">
                        <Input v-model="customCate" placeholder="请输入分类名进行搜索，按回车键可添加自定义分类"
                            @keyup.enter.native="handleKeyup('cate')" />
                        <ul class="h-60 mt-4">
                            <li class="p-2 hover:bg-green-100 rounded-md" v-for="cate in cateList" :key="cate.id"
                                @click="addCate(cate.categoryName)">
                                {{ cate.categoryName }}
                            </li>
                        </ul>
                    </div>
                </template>
            </Popper>
        </FormItem>
        <FormItem class="pb-4" label="文章标签" labelAlign="center">
            <Tag primary v-for="(tag, index) in articleData.tagNames" :key="tag">
                <div class="text-sm px-2 py-1">
                    <span>{{ tag }}</span>
                    <span class="pl-2 cursor-pointer" @click="deleteCateAndTag('tag', index)">×</span>
                </div>
            </Tag>
            <Popper v-if="articleData.tagNames.length < 3" placement="bottom" v-model="showTag" trigger="manual">
                <BaseButton v-if="articleData.tagNames.length < 3" primary hollow @click="openTag">添加标签</BaseButton>
                <template #content>
                    <div class="w-96" ref="tagRef">
                        <Input v-model="customTag" placeholder="请输入标签名进行搜索，按回车键可添加自定义标签"
                            @keyup.enter.native="handleKeyup('tag')" />
                        <div class="h-60 mt-4">
                            <div class="my-4 text-lg">添加标签</div>
                            <Tag class="h-8 text-base" v-for="tag in tagList" :key="tag.id" primary
                                @click="addTag(tag.tagName)">
                                {{ tag.tagName }}
                            </Tag>
                        </div>
                    </div>
                </template>
            </Popper>
        </FormItem>
        <FormItem class="pb-4" label="文章类型" labelAlign="center">
            <Select v-model="articleData.type">
                <Option v-for="type in articleTypeList" :key="type" :value="type">{{ articleType[type] }}</Option>
            </Select>
        </FormItem>
        <FormItem class="pb-4" label="原文地址" v-if="articleData.type != 1" labelAlign="center">
            <Input v-model="articleData.originalUrl" placeholder="请填写原文链接" />
        </FormItem>
        <FormItem class="pb-4" label="上传封面" labelAlign="center">
            <div class="flex">
                <Image class="article-cover" v-if="articleData.articleCover" :preview="false"
                    :src="articleData.articleCover" />
                <Upload class="w-24 cursor-pointer ml-4" v-model="articleData.articleCover"
                    action="/api/admin/articles/images" :resolve-url="resolveLocation" :headers="headers" draggable>
                    <template #drag>
                        <div
                            class="h-24 w-24 rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                            <Plus />
                        </div>
                    </template>
                </Upload>
            </div>
        </FormItem>
        <FormItem class="pb-4" label="置顶" labelAlign="center">
            <Switch v-model="articleData.isTop" :trueValue="1" :falseValue="0" />
        </FormItem>
        <FormItem class="pb-4" label="推荐" labelAlign="center">
            <Switch v-model="articleData.isFeatured" :trueValue="1" :falseValue="0" />
        </FormItem>
        <FormItem class="pb-4" label="发布形式" labelAlign="center">
            <RadioGroup v-model="articleData.status">
                <Radio :value="1">公开</Radio>
                <Radio :value="2">密码</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem class="pb-4" label="访问密码" v-if="articleData.status == 2" labelAlign="center">
            <Input v-model="articleData.password" placeholder="请填写文章访问密码" />
        </FormItem>
        <FormItem contentClass="flex justify-end">
            <BaseButton hollow @click="close">取消</BaseButton>
            <BaseButton danger @click="submit">发表</BaseButton>
        </FormItem>
    </Form>
</template>

<script lang='ts' setup>
import { onClickOutside, toast } from '@apathia/apathia'
import { Plus } from '@apathia/apathia.icon-svg'
import { articleType } from '../constant'
import { AtricleData } from '../types'
import { baseMerge } from '@/utils'
import { searchTag } from '@/apis/tags'
import { searchCategories } from '@/apis/categories'
import { addArticle } from '@/apis/articles'
import { useUserStore } from '@/store/user'

interface SubmitProps {
    close: () => void
    modelValue?: AtricleData
}

const articleTypeList = [1, 2, 3]
const headers = useUserStore().headerAuth

const props = withDefaults(defineProps<SubmitProps>(), {})
const emit = defineEmits(['update:modelValue'])

const router = useRouter()

const articleData = reactive<AtricleData>(baseMerge(props.modelValue, {}))

const showCate = ref(false)
const openCate = async () => {
    await searchCate('')
    showCate.value = true
}
const showTag = ref(false)
const openTag = async () => {
    await searchTags('')
    showTag.value = true
}

const cateRef = ref<HTMLElement | null>(null)
const stopCate = onClickOutside(cateRef, () => {
    showCate.value = false
})
const tagRef = ref<HTMLElement | null>(null)
const stopTag = onClickOutside(tagRef, () => {
    showTag.value = false
})

const customCate = ref('')
const customTag = ref('')

const handleKeyup = (type: 'cate' | 'tag') => {
    if (type === 'cate') {
        addCate(customCate.value)
        customCate.value = ''
    } else {
        addTag(customTag.value)
        customTag.value = ''
    }
}

const addCate = (val: string) => {
    articleData.categoryName = val
    showCate.value = false
}

const addTag = (val: string) => {
    if (articleData.tagNames.length >= 3)
        return
    if (articleData.tagNames.indexOf(val) !== -1)
        return
    articleData.tagNames.push(val)
    showTag.value = false
}

let cateList: Array<Record<'categoryName' | 'id', any>> = []
const searchCate = async (keywords: string) => {
    const query: Record<string, any> = {
        keywords,
        current: 1,
        size: 10
    }
    try {
        const { data }: Record<string, any> = await searchCategories(query)
        cateList = (data.records || []).map((cate: Record<string, any>) => ({
            categoryName: cate.categoryName,
            id: cate.id
        }))
    } catch (e) {
        toast.danger(e)
    }
}

let tagList: Array<Record<'tagName' | 'id', any>> = []
const searchTags = async (keywords: string) => {
    const query: Record<string, any> = {
        keywords,
        current: 1,
        size: 10
    }
    try {
        const { data }: Record<string, any> = await searchTag(query)
        tagList = (data?.records || []).map((tag: Record<string, any>) => ({ tagName: tag.tagName, id: tag.id }))
    } catch (e) {
        toast.danger(e)
    }
}

const deleteCateAndTag = (type: 'cate' | 'tag', index = 0) => {
    if (type === 'cate') {
        articleData.categoryName = ''
        return
    }
    articleData.tagNames.splice(index, 1)
}

const resolveLocation = (resp: any) => {
    return resp.data || ''
}

const submit = async () => {
    if (articleData.articleTitle.trim() === '') {
        toast.danger('文章标题不能为空')
        return
    }
    if (articleData.articleContent.trim() === '') {
        toast.danger('文章内容不能为空')
        return
    }
    if (!articleData.categoryName) {
        toast.danger('文章分类不能为空')
        return
    }
    if (articleData.tagNames.length === 0) {
        toast.danger('文章标签不能为空')
        return
    }
    if (articleData.articleCover.trim() === '') {
        toast.danger('文章封面不能为空')
        return
    }
    if (articleData.type !== 1 && articleData.originalUrl?.trim() === '') {
        toast.danger('非原创文章，原文链接不能为空')
        return
    }
    if (articleData.status === 2 && articleData.password?.trim() === '') {
        toast.danger('加密文章，文章密码不能为空')
        return
    }
    try {
        await addArticle(articleData)
        toast.success('文章发布成功')
        props.close()
        if (articleData.id !== null) {
            router.push('/article/list')
        }
    } catch (e) {
        toast.danger(e)
    }
}

onBeforeUnmount(() => {
    emit('update:modelValue', articleData)
    stopCate()
    stopTag()
})
</script>
