import axios from 'axios'
const base = '/api'

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  alert(error.response.data)
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default {
  /** 登入 */
  login: params => axios.post(`${base}/user/login`, params),
  /** 注册 */
  register: params => axios.post(`${base}/user`, params),
  /** 获取当前登入用户 */
  currentUser: params => axios.get(`${base}/user/current`, params),
  /** 退出登入 */
  logout: params => axios.get(`${base}/user/logout`, params),
  /** 创建清单 */
  createList: params => axios.post(`${base}/list`, params),
  /** 删除清单 */
  deleteList: (params, listId) => axios.delete(`${base}/list/${listId}`),
  /** 修改清单 */
  modifyList: (params, listId) => axios.put(`${base}/list/${listId}`, params),
  /** 查询清单（单个） */
  findOneList: (params, listId) => axios.get(`${base}/list/${listId}`, {params}),
  /** 查询清单（多个） */
  findList: (params) => axios.get(`${base}/list`, {params}),
  /** 添加任务 */
  createTask: (params, listId) => axios.post(`${base}/task/${listId}`, params),
  /** 查询任务（指定清单） */
  findTask: (params, listId) => axios.get(`${base}/task/${listId}`, {params})
}
