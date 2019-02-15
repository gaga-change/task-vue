import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import api from './api'
import 'dragula/dist/dragula.css'
import {
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Dialog,
  Form,
  FormItem,
  Message,
  Checkbox,
  Input,
  Scrollbar
} from 'element-ui'

Vue.use(Button)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Checkbox)
Vue.use(Input)
Vue.use(Scrollbar)

Vue.prototype.$message = Message;
window.$message = Message

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

function uuid() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 24; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  var uuid = s.join("");
  return uuid;
}

window.uuid = uuid

// 获取当前用户，以及系统时间。并绑定到 window.sysDate 和  window.user 上
api.currentUser().then(res => {
  timerRun(res.headers.date)
  /** 计时器 */
  function timerRun(sysDate) {
    window.sysDate = new Date(sysDate)
    setInterval(() => {
      setTimeout(() => {
        window.sysDate = new Date(window.sysDate.getTime() + 1000)
        // console.log(window.sysDate)
      }, 0)
    }, 1000)
  }
  window.user = res.data
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
