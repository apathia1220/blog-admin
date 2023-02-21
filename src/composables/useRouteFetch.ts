import { reactive, toRaw, watch } from 'vue'
import { LocationQuery, RouteLocationNormalizedLoaded, onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { baseMerge } from '@/utils'

/**
 * @name useRouteFetch 页面filter保存机制
 * @param {*} query 页面搜索栏的表单
 * @param {*} fetchData 取数据函数 fetchData(route): any
 * @param {*} reduceFilter 处理特殊字段 reduceFilter(key: string, value: typeof query[key]): typeof query[key]
 * @returns {reactiveFilter, setQuery, route, resetFilter }
 * filter为响应式的filter
 * setQuery为设置query的函数
 * route是当前的vue-router 路由
 * refetch用于重新按当前query发请求
 * resetFilter用来将filter设置为初始状态
 */
export function useRouteFetch(
  filter: Record<string, any>,
  fetchData: (r: RouteLocationNormalizedLoaded) => any,
  reduceFilter: (key: string, val: any) => any
) {
  const router = useRouter()
  const route = useRoute()

  const reactiveFilter = reactive(baseMerge(filter, route.query))

  const stopWatch = watch(
    () => [route.query, route.params],
    ([query]) => {
      updateFilter(query, reactiveFilter, reduceFilter)
      fetchData(route)
    },
    { immediate: true }
  )

  onBeforeRouteLeave(() => {
    stopWatch()
  })

  function setQuery(query = {}) {
    const pushRoute = {
      path: route.path,
      query: {
        ...query,
        r: new Date().valueOf()
      }
    }
    router.push(pushRoute)
  }

  function refetch() {
    fetchData(route)
  }

  function resetFilter() {
    Object.keys(filter).forEach((key) => {
      reactiveFilter[key] = filter[key]
    })
  }

  return {
    filter: reactiveFilter,
    setQuery,
    route,
    refetch,
    resetFilter,
    stopWatch
  }
}

function updateFilter(query: LocationQuery, filter: Record<string, any>, reduceFilter: (key: string, val: any) => any) {
  if (query == null) {
    return
  }
  Object.keys(toRaw(filter)).forEach((key) => {
    const val = query[key] == null ? filter[key] : query[key]
    if (reduceFilter) {
      filter[key] = reduceFilter(key, val)
    } else {
      filter[key] = val
    }
  })
}
