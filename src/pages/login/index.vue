<template>
    <div class="relative w-screen h-screen login-container bg-no-repeat bg-cover bg-center">
        <div class="absolute top-1/3 left-1/3 w-1/3 rounded-md text-gray-200 opacity-80 bg-login-bg">
            <div class="text-2xl text-center py-8">管理员登录</div>
            <div class="flex flex-col items-center">
                <div class="mt-4">
                    <span class="text-xl pr-8">账号</span>
                    <input v-model="userForm.username" class="h-10 w-52 outline-none bg-login-bg border-b-2 border-gray-200"
                        type="text">
                </div>
                <div class="mt-12">
                    <span class="text-xl pr-8">密码</span>
                    <input v-model="userForm.password" class="h-10 w-52 outline-none bg-login-bg border-b-2 border-gray-200"
                        type="password" @keydown="handleKeyDown">
                </div>
            </div>
            <div class="flex justify-center items-center w-full my-12 text-xl">
                <span class="w-48 py-2 rounded bg-gray-400 text-center cursor-pointer hover:bg-gray-300 hover:text-gray-600"
                    @click="submitLogin">登录</span>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { toast } from '@apathia/apathia'
import { loginIn } from '@/apis/user'
import { useUserStore } from '@/store/user'
import { useHomeStore } from '@/store/home'

const router = useRouter()
const user = useUserStore()
const home = useHomeStore()

const userForm = ref({
    username: '',
    password: ''
})

const submitLogin = async () => {
    if (userForm.value.username === '' || userForm.value.password === '') {
        toast.danger('账号或密码不能为空')
        return
    }
    try {
        const res: any = await loginIn(userForm.value)
        if (res.flag) {
            user.userInfo = res.data
            router.push('/')
            toast.success('登录成功')
        } else {
            toast.danger(res.message)
        }
        await home.initHomeStore()
    } catch (e) {
        toast.danger(e)
    }
}

const handleKeyDown = async(e: KeyboardEvent) => {
    if (e.code === 'Enter') {
        await submitLogin()
    }
}
</script>
<style lang='scss' scoped>
.login-container {
    background-image: url('@/assets/wallpaper.jpg');
}
</style>