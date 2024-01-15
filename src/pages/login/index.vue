<template>
    <div class="flex items-center justify-center relative w-screen h-screen login-container">
        <div class="flex items-center w-1/3 min-w-login rounded-3xl text-gray-500 opacity-80 bg-white shadow-2xl">
            <div class="w-1/2">
                <img class="w-full p-0 rounded-tl-3xl rounded-bl-3xl" src="@/assets/logo.png" alt="">
            </div>
            <div class="w-1/2 flex flex-col justify-between items-center">
                <div class="text-3xl text-center py-8 font-bold">管理员登录</div>
                <div class="flex flex-col items-center">
                    <div class="mt-4">
                        <span class="text-xl pr-8">账号</span>
                        <input v-model="userForm.username" class="h-12 w-64 outline-none border-b-2 border-gray-200"
                            type="text">
                    </div>
                    <div class="mt-12">
                        <span class="text-xl pr-8">密码</span>
                        <input v-model="userForm.password" class="h-12 w-64 outline-none border-b-2 border-gray-200"
                            type="password" @keydown="handleKeyDown">
                    </div>
                </div>
                <div class="flex justify-center items-center w-full mt-12 text-xl">
                    <span
                        class="w-1/2 py-4 rounded bg-slate-100 text-center cursor-pointer hover:bg-stone-200 hover:text-gray-600"
                        @click="submitLogin">登录</span>
                </div>
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

const handleKeyDown = async (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
        await submitLogin()
    }
}
</script>
<style lang='scss' scoped>
.login-container {
    background: linear-gradient(135deg, #65ccd8, #f1f5e2, #d9ece9);
}
</style>