<script setup lang="ts">
import { routerMenu as menuList } from "@/router/menu"
import { toast } from '@apathia/apathia'
import { Expand, Fold, HomeFilled } from '@apathia/apathia.icon-svg'
import { useUserStore } from '@/store/user'
import { useHomeStore } from '@/store/home'
import { logOut } from '@/apis/user'
import { getUserInfo, UserInfoResponse } from '@/apis/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const home = useHomeStore()

const activeKey = ref('')

const menuTitle = ref('')
const handleSelect = (node: Record<string, any>) => {
    menuTitle.value = menuList.find(item => item.tag === node.path.split('/')[1])?.text || '主页'
    activeKey.value = node.path
    router.push(node.path)
}
const initTitle = () => {
    menuTitle.value = menuList.find(item => item.tag === route.path.split('/')[1])?.text || ''
}

const miniSide = ref(false)
const toggleSide = () => {
    miniSide.value = !miniSide.value
}

const sideShow = ref(!miniSide.value)
const handleSideMini = (minState: boolean) => {
    sideShow.value = !minState
}

const goToHome = () => {
    menuTitle.value = '主页'
    router.push('/')
}

const logout = async () => {
    try {
        await logOut()
        router.push('/login')
        user.userInfo = {}
        toast.success('退出成功')
    } catch (e: any) {
        toast.danger(e.message)
    }
}

onMounted(async () => {
    activeKey.value = window.location.pathname
    initTitle()
    if (user.userInfo.token) {
        await home.initHomeStore()
        const res: UserInfoResponse = await getUserInfo(user.userInfo.userInfoId as number) as UserInfoResponse
        user.userInfo.avatar = res.data.avatar
    }
})
</script>

<template>
    <div class="flex h-screen w-full">
        <Transition name="sidenav">
            <SideNav v-show="user.isLogin" :mini="miniSide" :menu-list="menuList" :active-key="activeKey" key-field="path"
                search @select="handleSelect" @minChange="handleSideMini">
                <template #menuTop>
                    <div class="flex items-center justify-center font-bold pb-4 cursor-pointer" @click="goToHome">
                        <span v-if="sideShow">Apathia</span>
                        <HomeFilled class="h-8 w-8" v-else />
                    </div>
                </template>
            </SideNav>
        </Transition>
        <div class="flex flex-col w-full min-h-home">
            <div class="flex relative items-center py-4 pl-2">
                <div class="flex">
                    <Fold v-if="!miniSide" class="h-6 w-6" @click="toggleSide" />
                    <Expand v-else class="h-6 w-6" @click="toggleSide" />
                    <span class="ml-4">{{ menuTitle }}</span>
                </div>
                <div class="flex absolute right-4">
                    <Popper placement="bottom" trigger="hover">
                        <img class="h-10 w-10 rounded-full mr-4 cursor-pointer" :src="(user.userInfo?.avatar as string)"
                            alt="">
                        <template #content>
                            <div class="cursor-pointer" @click="logout">退出登录</div>
                        </template>
                    </Popper>
                </div>
            </div>
            <div class="relative overflow-scroll min-h-home bg-gray-200">
                <router-view v-slot="{ Component }">
                    <transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </div>
        </div>
    </div>
</template>
