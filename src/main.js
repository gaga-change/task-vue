import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import { 
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message
} from 'element-ui';

Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);

Vue.prototype.$message = Message;

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
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    var uuid = s.join("");
    return uuid;
}

window.uuid = uuid

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
