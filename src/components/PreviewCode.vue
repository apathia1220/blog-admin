<template>
    <pre class="relative bg-gray-900 overflow-scroll h-code z-50">
        <code class="z-50" :class="'language-' + type" v-html="Prism.highlight(code, Prism.languages[type], type)"></code>
    </pre>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
const props = defineProps({
    code: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'html'
    }
})
const { code, type } = props
</script>