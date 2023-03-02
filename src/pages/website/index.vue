<template>
    <div class="flex flex-col h-full px-2 pb-4 bg-gray-200">
        <h1 class="border-b-4 text-2xl p-4 w-36">系统配置</h1>
        <div class="flex mt-8 ml-4">
            <div class="flex flex-col mr-8 text-s cursor-pointer" :class="activeMenu === menu ? 'text-blue-300' : ''"
                v-for="menu in CONFIG_LIST" :key="menu" @click="toggleMenu(menu)">
                <span>{{ CONFIG_MAP[menu] }}</span>
                <span class="mt-2 border-b-4 w-full rounded-full"
                    :class="activeMenu === menu ? 'border-blue-300' : 'opacity-0'"></span>
            </div>
        </div>
        <div class="mt-8 ml-4">
            <Form v-if="activeMenu === 1">
                <FormItem class="pb-4" label="作者头像">
                    <div class="ml-2 h-28 w-28">
                        <Upload v-model="configForm.authorAvatar" class="cursor-pointer" action="/api/admin/config/images"
                            :resolve-url="resolveLocation" :headers="Header" draggable>
                            <template #drag>
                                <div
                                    class="h-28 w-28 rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                                    <Plus v-if="!configForm.authorAvatar" />
                                    <img class="h-28 w-28 rounded-md bg-cover bg-no-repeat object-cover" v-else
                                        :src="configForm.authorAvatar">
                                </div>
                            </template>
                        </Upload>
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="网站背景">
                    <div class="ml-2 w-36">
                        <Upload v-model="configForm.logo" class="cursor-pointer" action="/api/admin/config/images"
                            :resolve-url="resolveLocation" :headers="Header" draggable>
                            <template #drag>
                                <div
                                    class="h-28 w-36 flex justify-center rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                                    <Plus v-if="!configForm.logo" />
                                    <img class="h-28 w-auto rounded-md bg-cover bg-no-repeat object-cover" v-else
                                        :src="configForm.logo">
                                </div>
                            </template>
                        </Upload>
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="网站名称">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.name" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="网站英文名">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.englishName" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="网站作者">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.author" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="作者介绍">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.authorIntro" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="网站创建日期">
                    <div class="w-96 ml-2">
                        <Datepicker v-model="configForm.websiteCreateTime" date-format="Y-m-d"></Datepicker>
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="网站公告">
                    <div class="w-96 ml-2">
                        <Textarea v-model="configForm.notice" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="备案号">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.beianNumber" />
                    </div>
                </FormItem>
            </Form>
            <Form v-else-if="activeMenu === 2">
                <FormItem class="pb-4" label="Github">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.github" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="Gitee">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.gitee" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="QQ">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.qq" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="WeChat">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.weChat" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="微博">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.weibo" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="CSDN">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.csdn" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="知乎">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.zhihu" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="掘金">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.juejin" />
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="stackoverflow">
                    <div class="w-96 ml-2">
                        <Input v-model="configForm.stackoverflow" />
                    </div>
                </FormItem>
            </Form>
            <Form v-else-if="activeMenu === 3">
                <FormItem class="pb-4" label="用户默认头像">
                    <div class="ml-2 h-28 w-28">
                        <Upload v-model="(configForm.userAvatar)" class="cursor-pointer" action="/api/admin/config/images"
                            :resolve-url="resolveLocation" :headers="Header" draggable>
                            <template #drag>
                                <div
                                    class="h-28 w-28 rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                                    <Plus v-if="!configForm.userAvatar" />
                                    <img class="h-28 w-28 rounded-md bg-cover bg-no-repeat object-cover" v-else
                                        :src="configForm.userAvatar">
                                </div>
                            </template>
                        </Upload>
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="游客头像">
                    <div class="ml-2 h-28 w-28">
                        <Upload v-model="(configForm.touristAvatar)" class="cursor-pointer"
                            action="/api/admin/config/images" :resolve-url="resolveLocation" :headers="Header" draggable>
                            <template #drag>
                                <div
                                    class="h-28 w-28 rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                                    <Plus v-if="!configForm.touristAvatar" />
                                    <img class="h-28 w-28 rounded-md bg-cover bg-no-repeat object-cover" v-else
                                        :src="configForm.touristAvatar">
                                </div>
                            </template>
                        </Upload>
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="邮箱通知">
                    <div>
                        <RadioGroup v-model="configForm.isEmailNotice">
                            <Radio :value="1">是</Radio>
                            <Radio :value="0">否</Radio>
                        </RadioGroup>
                    </div>
                </FormItem>
                <FormItem class="pb-4" label="评论审核">
                    <div>
                        <RadioGroup v-model="configForm.isCommentReview">
                            <Radio :value="1">是</Radio>
                            <Radio :value="0">否</Radio>
                        </RadioGroup>
                    </div>
                </FormItem>
            </Form>
            <Form class="mt-4">
                <BaseButton primary large @click="submitConfig">修改</BaseButton>
            </Form>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { CONFIG_LIST, CONFIG_MAP } from './constant'
import { toast } from '@apathia/apathia'
import { Plus } from '@apathia/apathia.icon-svg'
import { getWebsiteConfig, updateWebsiteConfig, WebsiteConfigItem, WebsiteConfigResponse } from '@/apis/website'
import { useUserStore } from '@/store/user';

const activeMenu = ref(1)
const configForm = ref<Partial<WebsiteConfigItem>>({
    authorAvatar: '',
    logo: ''
})
const Header = useUserStore().headerAuth

const getConfig = async () => {
    try {
        const res: WebsiteConfigResponse = await getWebsiteConfig() as WebsiteConfigResponse
        configForm.value = res.data
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const toggleMenu = (menu: number) => {
    activeMenu.value = menu
}

const resolveLocation = (resp: any) => {
    return resp.data || ''
}

const submitConfig = async () => {
    if (configForm.value.author?.trim() === '') {
        toast.warning('作者不能为空')
    }
    if (configForm.value.authorAvatar?.trim() === '') {
        toast.warning('作者头像不能为空')
    }
    if (configForm.value.name?.trim() === '') {
        toast.warning('网站名称不能为空')
    }
    try {
        await updateWebsiteConfig(configForm.value)
        toast.success('修改网站配置成功')
    } catch (e: any) {
        toast.danger(e.message)
    }
}

onBeforeMount(() => {
    getConfig()
})
</script>