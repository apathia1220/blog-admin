<template>
    <div class="flex flex-col h-full">
        <div class="flex my-4">
            <Input class="mr-2" v-model="articleData.articleTitle" placeholder="请输入标题" />
            <BaseButton danger hollow @click="saveArticle">保存</BaseButton>
            <BaseButton primary @click="submitArticle">发布</BaseButton>
        </div>
        <mavon-editor ref="md" class="article-editor" v-model="articleData.articleContent" @imgAdd="uploadImg" />
    </div>
</template>

<script lang='tsx' setup>
import { useModal, toast } from '@apathia/apathia'
import ArticleSubmit from './_components/ArticleSubmit.vue';
import { addArticle, getArticleById, uploadArticleImg } from '@/apis/articles'
import { AtricleData } from './types'

const route = useRoute()

const articleData = ref<AtricleData>({
    articleContent: '',
    articleCover: '',
    articleTitle: '',
    categoryName: null,
    id: null,
    tagNames: [],
    isTop: 0,
    isFeatured: 0,
    type: 1,
    status: 1
})

const saveArticle = async () => {
    if (articleData.value.articleTitle.trim() === '') {
        toast.danger('文章标题不能为空')
        return
    }
    if (articleData.value.articleContent.trim() === '') {
        toast.danger('文章内容不能为空')
        return
    }
    articleData.value.status = 3
    try {
        await addArticle(articleData.value)
        toast.success('草稿保存成功')
    } catch (e) {
        toast.danger(e)
    }
}

const { modal, remove } = useModal()

const submitArticle = () => {
    modal({
        title: '发布文章',
        render: () => (<ArticleSubmit close={remove} v-model={articleData.value} />)
    })
}

const md = ref<any>(null)
const uploadImg = async (pos: string, file: File) => {
    let formData = new FormData()
    formData.append('file', file)
    try {
        const { data } = await uploadArticleImg(formData)
        md.value?.$img2Url(pos, data)
    } catch (e) {
        toast.danger(e)
    }
}

onBeforeMount(async () => {
    const articleId = route.path.split('/')[3]
    if (articleId) {
        try {
            const { data } = await getArticleById(+articleId)
            articleData.value = data as AtricleData
        } catch (e) {
            toast.danger(e)
        }
    }
})
</script>
<style scoped>
.article-editor {
    z-index: 50;
}
</style>