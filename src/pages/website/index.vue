<template>
    <div class="flex flex-col h-full px-2 pb-4 bg-gray-200">
        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component" />
            </transition>
        </router-view>
    </div>
</template>

<script lang='ts' setup>

</script>
<style lang='scss' scoped></style>