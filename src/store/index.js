import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 正在输入的任务名称(为了同步父子路由)
    inputTaskName: '',
    // 任务缓存库
    taskCache: {}
  },
  mutations: {
    changeInputTaskName(state, val) {
      state.inputTaskName = val
    },
    updateTaskCache(state, val) {
      if (typeof val === 'string') {
        delete state.taskCache[val]
      } else {
        state.taskCache[val._id] = val
      }
    }
  }
})

export default store
