<template>
    <div class="flex flex-col h-full px-2 pb-4 bg-gray-200">
        <h1 class="border-b-4 text-2xl p-4 w-36">{{ title }}</h1>
        <div class="mt-4 h-full">
            <router-view v-slot="{ Component }">
                <transition name="fade">
                    <component :is="Component" />
                </transition>
            </router-view>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { titleMap } from './constant'

const title = ref('文章管理')
const route = useRoute()

watch(() => route.fullPath, () => {
    const pathName = route.fullPath
    console.log(pathName.split('/')[1])
    title.value = titleMap[pathName.split('/')[2]]
})

</script>
<style lang='scss' scoped></style>