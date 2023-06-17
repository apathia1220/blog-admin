<template>
    <div class="flex flex-col h-full px-2 pb-4 bg-gray-200">
        <h1 class="border-b-4 text-2xl p-4 w-48">{{ title }}</h1>
        <div class="mt-4 h-full">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { MENU_MAP } from './constant'

const title = ref('相册管理')
const route = useRoute()

watch(() => route.path, () => {
    const path = route.path.split('/')[2]
    const name = MENU_MAP[path]
    if (name) {
        title.value = name
    } else {
        title.value = '相册管理'
    }
})
</script>
<style lang='scss' scoped></style>