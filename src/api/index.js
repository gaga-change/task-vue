import axios from 'axios'
const base = '/api'

export default {
  // 登入
  login: params => axios.post(`${base}/user/login`, params),
  // 注册
  register: params => axios.post(`${base}/user`, params),
  // 获取当前登入用户
  currentUser: params => axios.get(`${base}/user/current`, params),
  // 退出登入
  logout: params => axios.get(`${base}/user/logout`, params),
  // 创建清单
  createList: params => axios.post(`${base}/list`, params),
  // 删除清单
  deleteList: (params, listId) => axios.delete(`${base}/list/${listId}`),
  // 修改清单
  modifyList: (params, listId) => axios.put(`${base}/list/${listId}`, params),
  // 查询清单
  findList: (params, listId) => axios.get(`${base}/list/${listId}`, {params})
}
