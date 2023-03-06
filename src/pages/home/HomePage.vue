<template>
    <div class="flex flex-col h-full px-2 pb-4 bg-gray-200">
        <ul class="grid grid-cols-4 gap-4 mx-4 mt-4">
            <li class="flex justify-between bg-gray-50 rounded-md p-4">
                <House class="h-16 text-green-700" />
                <div class="flex flex-col justify-center items-center">
                    <span class="text-gray-500 font-medium">访问量</span>
                    <span class="mt-2 font-semibold text-gray-900">{{ homeStore.homeInfo.viewsCount }}</span>
                </div>
            </li>
            <li class="flex justify-between bg-gray-50 rounded-md p-4">
                <User class="h-16 text-blue-600" />
                <div class="flex flex-col justify-center items-center">
                    <span class="text-gray-500 font-medium">用户量</span>
                    <span class="mt-2 font-semibold text-gray-900">{{ homeStore.homeInfo.userCount }}</span>
                </div>
            </li>
            <li class="flex justify-between bg-gray-50 rounded-md p-4">
                <Document class="h-16 text-red-500" />
                <div class="flex flex-col justify-center items-center">
                    <span class="text-gray-500 font-medium">文章量</span>
                    <span class="mt-2 font-semibold text-gray-900">{{ homeStore.homeInfo.articleCount }}</span>
                </div>
            </li>
            <li class="flex justify-between bg-gray-50 rounded-md p-4">
                <ChatLineSquare class="h-16 text-violet-800" />
                <div class="flex flex-col justify-center items-center">
                    <span class="text-gray-500 font-medium">留言量</span>
                    <span class="mt-2 font-semibold text-gray-900">{{ homeStore.homeInfo.messageCount }}</span>
                </div>
            </li>
        </ul>
        <div class="mx-4 mt-4 p-4 rounded-md bg-gray-50">
            <div>一周访问量</div>
            <div ref="viewCountCharts" class="mt-4 h-96 bg-transparent"></div>
        </div>
        <div class="mx-4 mt-4 p-4 rounded-md bg-gray-50">
            <div>文章浏览量排行</div>
            <div ref="articleRankCharts" class="mt-4 h-96 bg-transparent"></div>
        </div>
        <div class="grid grid-cols-2 gap-4 mx-4 mt-4">
            <div class="rounded-md p-4 bg-gray-50">
                <div>文章标签统计</div>
                <div ref="categoryCharts" class="mt-4 h-96 bg-transparent"></div>
            </div>
            <div class="rounded-md p-4 bg-gray-50">
                <div>文章分类统计</div>
                <div ref="tagCharts" class="mt-4 h-96 bg-transparent"></div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { House, User, Document, ChatLineSquare } from '@apathia/apathia.icon-svg'
import { useHomeStore } from '@/store/home'
import * as echarts from 'echarts/core'
import { BarChart, BarSeriesOption, PieChart, PieSeriesOption, LineChart, LineSeriesOption } from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    TitleComponentOption,
    TooltipComponentOption,
    GridComponentOption,
    DatasetComponentOption,
    LegendComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { Ref } from 'vue'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    BarChart,
    LineChart,
    PieChart,
    LabelLayout,
    UniversalTransition,
    CanvasRenderer
])

type ECOption = echarts.ComposeOption<
    | BarSeriesOption
    | LineSeriesOption
    | TitleComponentOption
    | TooltipComponentOption
    | GridComponentOption
    | DatasetComponentOption
    | PieSeriesOption
>

const homeStore = useHomeStore()

const viewCountCharts = ref<HTMLElement | null>(null)
const articleRankCharts = ref<HTMLElement | null>(null)
const categoryCharts = ref<HTMLElement | null>(null)
const tagCharts = ref<HTMLElement | null>(null)

const viewCountChartsOption: ECOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    legend: {
        data: ['访问量']
    },
    grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '10%',
        containLabel: true
    },
    xAxis: {
        data: homeStore.homeInfo.uniqueViewDTOs?.map(item => item.day) || [],
        axisLine: {
            lineStyle: {
                color: '#666'
            }
        }
    },
    yAxis: {
        axisLine: {
            lineStyle: {
                color: '#048CCE'
            }
        }
    },
    series: [
        {
            name: '访问量',
            type: 'line',
            smooth: true,
            data: homeStore.homeInfo.uniqueViewDTOs?.map(item => item.viewsCount as number) || []
        }
    ]
}

const articleRankOption: ECOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross'
        }
    },
    color: ['#58AFFF'],
    grid: {
        left: '0%',
        right: '0%',
        bottom: '0%',
        top: '10%',
        containLabel: true
    },
    xAxis: {
        data: homeStore.homeInfo.articleRankDTOs?.map(item => item.articleTitle) || [],
    },
    yAxis: {},
    series: [
        {
            name: '浏览量',
            type: 'bar',
            data: homeStore.homeInfo.articleRankDTOs?.map(item => item.viewsCount) || []
        }
    ]
}

const categoryOption: ECOption = {
    color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
    legend: {
        data: homeStore.homeInfo.categoryDTOs?.map(item => item.categoryName),
        bottom: 'bottom'
    },
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            name: '文章分类',
            type: 'pie',
            roseType: 'radius',
            data: homeStore.homeInfo.categoryDTOs?.map(item => ({
                value: item.articleCount as number || 0,
                name: item.categoryName
            }))
        }
    ]
}

const tagOption: ECOption = {
    color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
    legend: {
        data: homeStore.homeInfo.tagDTOs?.map(item => item.tagName),
        bottom: 'bottom'
    },
    tooltip: {
        trigger: 'item'
    },
    series: [
        {
            name: '文章标签',
            type: 'pie',
            roseType: 'radius',
            data: homeStore.homeInfo.tagDTOs?.map(item => ({
                value: item.articleCount as number || 0,
                name: item.tagName
            }))
        }
    ]
}

const setChartOption = (myChart: echarts.ECharts, opt: ECOption) => {
    myChart.setOption(opt)
}
onBeforeMount(async () => {
    await homeStore.initHomeStore()
})

onMounted(() => {
    setChartOption(echarts.init(viewCountCharts.value as HTMLElement), viewCountChartsOption)
    setChartOption(echarts.init(articleRankCharts.value as HTMLElement), articleRankOption)
    setChartOption(echarts.init(categoryCharts.value as HTMLElement), categoryOption)
    setChartOption(echarts.init(tagCharts.value as HTMLElement), tagOption)
})
</script>