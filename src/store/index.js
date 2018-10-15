import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 正在输入的任务名称(为了同步父子路由)
    inputTaskName: ''
  },
  mutations: {
    changeInputTaskName(state, val) {
      state.inputTaskName = val
    }
  }
})

export default store