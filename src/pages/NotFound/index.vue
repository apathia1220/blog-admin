<template>
    <Loading>
        <div class="text-2xl">你访问的页面不存在!</div>
        <div class="mt-4 text-xl">{{ time }}秒后跳转回主页</div>
    </Loading>
</template>

<script lang='ts' setup>
import Loading from '@/components/Loading.vue'

const router = useRouter()
const time = ref(5)
const timer = setInterval(() => {
    if (time.value <= 0) {
        router.push('/')
        clearInterval(timer)
        return
    }
    time.value--
}, 1000)

onBeforeUnmount(() => {
    clearInterval(timer)
})
</script>