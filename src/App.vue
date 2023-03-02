<script setup lang="ts">
import { routerMenu } from "./router/menu"
import { toast } from '@apathia/apathia'
import { Expand, Fold } from '@apathia/apathia.icon-svg'
import { useUserStore } from '@/store/user'
import { useHomeStore } from '@/store/home'
import { logOut } from '@/apis/user'
import { getUserInfo, UserInfoResponse } from '@/apis/user'

const router = useRouter()
const route = useRoute()
const user = useUserStore()
const home = useHomeStore()

const menuList = ref(routerMenu)
const activeKey = ref('')

const menuTitle = ref('')
const handleSelect = (node: Record<string, any>) => {
  menuTitle.value = menuList.value.find(item => item.tag === node.path.split('/')[1])?.text || '主页'
  activeKey.value = node.path
  router.push(node.path)
}
const initTitle = () => {
  menuTitle.value = menuList.value.find(item => item.tag === route.path.split('/')[1])?.text || ''
}

const miniSide = ref(false)
const toggleSide = () => {
  miniSide.value = !miniSide.value
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
  <div class="flex h-screen">
    <SideNav v-show="!miniSide && user.isLogin" :menu-list="menuList" :active-key="activeKey" key-field="path" search
      @select="handleSelect">
      <template #menuTop>
        <div class="text-center font-bold pb-4 cursor-pointer" @click="goToHome">Apathia</div>
      </template>
    </SideNav>
    <div class="flex flex-col ml-4 w-full overflow-scroll min-h-home">
      <div v-if="user.isLogin" class="flex relative items-center py-4 pl-2">
        <div class="flex">
          <Fold v-if="!miniSide" class="h-6 w-6" @click="toggleSide" />
          <Expand v-else class="h-6 w-6" @click="toggleSide" />
          <span class="ml-4">{{ menuTitle }}</span>
        </div>
        <div class="flex absolute right-4">
          <Popper placement="bottom" trigger="hover">
            <img class="h-10 w-10 rounded-full mr-4 cursor-pointer" :src="(user.userInfo?.avatar as string)" alt="">
            <template #content>
              <div class="cursor-pointer" @click="logout">退出登录</div>
            </template>
          </Popper>
        </div>
      </div>
      <div class="relative min-h-home">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
