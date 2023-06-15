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
const title = ref('权限管理')
</script>
<style lang='scss' scoped></style>