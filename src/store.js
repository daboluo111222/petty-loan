import Vue from 'vue'
import Vuex from 'vuex'
// import VuexPersist from 'vuex-persist'
// import api from '@/utils/api'
// import { isEmpty } from '@/utils/utils'
// const vuexLocal = new VuexPersist({ storage: window.localStorage })
Vue.use(Vuex)
export default new Vuex.Store({
  // plugins: [vuexLocal.plugin],
  state: {
    userInfo: {},
    sidebar: [{ path: '/index', name: 'constructionCompany', nameZh: '首页', uuid: '1' },
      { path: '/memberList', name: 'constructionSubCompany', nameZh: '用户列表', uuid: '5' },
      { path: '/loanList', name: 'project', nameZh: '借贷列表', uuid: '9' },
      { path: '/applyList', name: 'sysFunction', nameZh: '申请列表', uuid: '17' },
      { path: '/powerList', name: 'permission', nameZh: '权限管理', uuid: '18' }]
  },
  getters: {},
  mutations: {},
  actions: {}
})
