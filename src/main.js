import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import elementUI from 'element-ui'
import elementUIVerify from 'element-ui-verify'
import ghTable from '@/components/gh-table'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets;
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/styles/index.scss' // global css;
import '@/assets/styles/customMain.scss'
import Axios from './utils/Axios'
import * as utils from '@/utils/utils'
Vue.config.devtools = (process.env.NODE_ENV == 'development')
Vue.config.productionTip = false
Vue.prototype.$ajax = Axios
Vue.prototype.$util = utils
Vue.use(elementUI)
Vue.use(elementUIVerify)
Vue.component('ghTable', ghTable)
window.$vue = new Vue({
  name: 'App',
  el: '#app',
  router,
  store,
  render: h => h(App),
})

