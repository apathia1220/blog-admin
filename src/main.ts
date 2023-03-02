import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'
import { modalInstall, toastInstall, setupApathiaTwindTheme } from '@apathia/apathia'
import * as comp from '@apathia/apathia'
import * as icons from '@apathia/apathia.icon-svg'
import router from './router'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { createPinia } from 'pinia'
import { useUserStore } from '@/store/user'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const componentMap = new Map()
function registerComponents(comp: any) {
  Object.keys(comp).forEach((name: string) => {
    if (typeof comp[name] === 'object') {
      // TODO 修改全局注册的命名冲突
      if (!componentMap.has(name)) {
        app.component(name, comp[name])
        componentMap.set(name, name)
      }
    } else {
      app.config.globalProperties[name] = comp[name]
    }
  })
}

setupApathiaTwindTheme()

registerComponents(comp)
registerComponents(icons)
app.use(router).use(mavonEditor).use(pinia)
const user = useUserStore()

router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else if (user.userInfo.token === undefined) {
    next({ path: '/login' })
  } else {
    next()
  }
})

app.use(toastInstall)
app.use(modalInstall)

app.mount('#app')
