import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// const socket = io({path: '/api/socket'})

/**
 * 自定义排序。 cb 返回 true 或 false 。 t
 */
Array.prototype.mySort = function (cb) {
  let arr = this
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (cb(arr[j], arr[j + 1])) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }

    }
  }
  return arr
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
