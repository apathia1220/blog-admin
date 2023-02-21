<template>
    <div class="flex flex-col h-full px-2 pb-4 rounded-md bg-gray-200">
        <h1 class="border-b-4 text-2xl p-4 w-36">个人中心</h1>
        <div class="flex mt-8 ml-4">
            <div class="flex flex-col mr-8 text-s cursor-pointer" :class="activeMenu === menu ? 'text-blue-300' : ''"
                v-for="menu in MENU_LIST" :key="menu" @click="toggleMenu(menu)">
                <span>{{ MENU_MAP[menu] }}</span>
                <span class="mt-2 border-b-4 w-full rounded-full"
                    :class="activeMenu === menu ? 'border-blue-300' : 'opacity-0'"></span>
            </div>
        </div>
        <div class="flex flex-col mt-8 ml-2 justify-center">
            <div class="flex justify-center ml-2">
                <Upload v-model="(userStore.userInfo.avatar)" class="cursor-pointer" action="/api/users/avatar"
                    :headers="Header" draggable>
                    <template #drag>
                        <div
                            class="h-28 w-28 rounded border border-dashed hover:border-blue-300 border-gray-300 text-gray-300">
                            <Plus v-if="!userStore.userInfo.avatar" />
                            <img class="h-28 w-28 rounded-md bg-cover bg-no-repeat object-cover" v-else
                                :src="userStore.userInfo.avatar">
                        </div>
                    </template>
                </Upload>
            </div>
            <div class="flex justify-center mt-4">
                <Form v-if="activeMenu === 1" class="w-1/3">
                    <FormItem label="昵称">
                        <div class="mb-4">
                            <Input v-model="userForm.nickname" />
                        </div>
                    </FormItem>
                    <FormItem label="个人简介">
                        <div class="mb-4">
                            <Textarea v-model="userForm.intro" />
                        </div>
                    </FormItem>
                    <FormItem label="个人网站">
                        <div class="mb-4">
                            <Input v-model="userForm.website" />
                        </div>
                    </FormItem>
                    <FormItem>
                        <div class="flex justify-end">
                            <BaseButton primary large @click="submitUserInfo">提交</BaseButton>
                        </div>
                    </FormItem>
                </Form>
                <Form v-if="activeMenu === 2" class="w-1/3">
                    <FormItem label="旧密码">
                        <div class="mb-4">
                            <Input v-model="passwordForm.oldPassword" type="password" />
                        </div>
                    </FormItem>
                    <FormItem label="新密码">
                        <div class="mb-4">
                            <Input v-model="passwordForm.newPassword" type="password" />
                        </div>
                    </FormItem>
                    <FormItem label="确认密码">
                        <div class="mb-4">
                            <Input v-model="passwordForm.confirmPassword" type="password" />
                        </div>
                    </FormItem>
                    <FormItem>
                        <div class="flex justify-end">
                            <BaseButton primary large @click="submitPassWord">提交</BaseButton>
                        </div>
                    </FormItem>
                </Form>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { useUserStore } from '@/store/user'
import { toast } from '@apathia/apathia'
import { updateUserInfo, updatePassword, logOut, UpdateUserInfoRequest, PassWordRequest } from '@/apis/user'

const MENU_MAP: Record<number, string> = {
    1: '修改头像',
    2: '修改密码',
}
const MENU_LIST = [1, 2]

const router = useRouter()

const activeMenu = ref(1)

const toggleMenu = (menu: number) => {
    activeMenu.value = menu
}

const userStore = useUserStore()
const Header = userStore.headerAuth

const userForm = ref({
    nickname: userStore.userInfo?.nickname || '',
    intro: userStore.userInfo?.intro || '',
    website: userStore.userInfo?.website || ''
})

const passwordForm = ref<Partial<PassWordRequest>>({})

const submitUserInfo = async () => {
    try {
        await updateUserInfo(userForm.value as UpdateUserInfoRequest)
        toast.success('修改成功')
    } catch (e: any) {
        toast.danger(e.message)
    }
}

const submitPassWord = async () => {
    if (passwordForm.value.oldPassword?.trim() === ''
        || passwordForm.value.newPassword?.trim() === ''
        || passwordForm.value.confirmPassword?.trim() === ''
    ) {
        toast.danger('密码不能为空')
        return
    }
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        toast.danger('两次输入的密码不一致')
        return
    }
    try {
        await updatePassword(passwordForm.value as PassWordRequest)
        toast.success('修改成功')
        await logOut()
        userStore.userInfo = {}
        router.push('/login')
        toast.info('密码已经修改，请重新登录')
    } catch (e: any) {
        toast.danger(e.message)
    }
}
</script>
<style lang='scss' scoped>

</style>