import Vue from 'vue'
import Router from 'vue-router'
import Layout from './layout/Layout.vue'
import Home from './views/home/index.vue'
// import { isEmpty } from '@/utils/utils'

const openPages = importViews(require.context(`@/openViews`, false, /\.vue$/), '/')
const innerPages = importViews(require.context(`@/views`, true, /\.vue$/, 'lazy'), '/', true)
// 批量引入
function importViews (views, routerFrontPath = '', isLazy = false) {
  if (!views) return
  let routeParams
  routeParams = views.keys().map((key, i) => {
    // viewName : "./InstallPkg.vue"
    const viewName = key.replace(/^\.\/(.+).vue/, '$1')
    // console.log(viewName)
    return ({
      path: `${routerFrontPath}${viewName}`,
      name: `${routerFrontPath}${viewName}`,
      component: (isLazy ? () => { return views(key) } : views(key).default)
    })
  })
  return routeParams
}
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/',
          redirect: '/index'
        },
        {
          path: '/index',
          component: Home,
          name: 'HomeIndex',
        }
      ].concat(innerPages)
    }
  ].concat(openPages)
})

export default router
