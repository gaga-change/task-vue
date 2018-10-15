import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const socket = io({path: '/api/socket'})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
