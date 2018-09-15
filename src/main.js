import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

const socket = io({path: '/api/socket'})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
