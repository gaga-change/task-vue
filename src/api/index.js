import axios from 'axios'
const base = '/api'

export default {
  // 登入
  apiLogin: params => axios.post(`${base}/user/login`, params),
  // 注册
  apiRegister: params => axios.post(`${base}/user`, params),
  // 获取当前登入用户
  apiCurrent: params => axios.get(`${base}/user/current`, params),
}
