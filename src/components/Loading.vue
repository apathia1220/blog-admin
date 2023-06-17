<template>
    <Teleport to="body">
        <div
            class="absolute top-0 h-full w-full flex flex-col items-center justify-center opacity-80 bg-gray-300 loading-container">
            <slot></slot>
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="text-xl">{{ context || '加载中' }}</div>
        </div>
    </Teleport>
</template>

<script lang='ts' setup>
defineProps<{
    context?: string
}>()
</script>
<style lang='scss' scoped>
.loading-container {
    z-index: 100000;
}

.loading {
    --speed-of-animation: 0.9s;
    --gap: 6px;
    --first-color: #4c86f9;
    --second-color: #49a84c;
    --third-color: #f6bb02;
    --fourth-color: #f6bb02;
    --fifth-color: #2196f3;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 200px;
    gap: 12px;
    height: 200px;
}

.loading span {
    width: 8px;
    height: 100px;
    background: var(--first-color);
    animation: scale var(--speed-of-animation) ease-in-out infinite;
}

.loading span:nth-child(2) {
    background: var(--second-color);
    animation-delay: -0.8s;
}

.loading span:nth-child(3) {
    background: var(--third-color);
    animation-delay: -0.7s;
}

.loading span:nth-child(4) {
    background: var(--fourth-color);
    animation-delay: -0.6s;
}

.loading span:nth-child(5) {
    background: var(--fifth-color);
    animation-delay: -0.5s;
}

@keyframes scale {

    0%,
    40%,
    100% {
        transform: scaleY(0.05);
    }

    20% {
        transform: scaleY(1);
    }
}
</style>