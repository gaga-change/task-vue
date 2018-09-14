<template>
  <div>
    主页
    <button @click="logout">退出</button>
    <div>
      <h1>清单列表</h1>
      <ul>
        <li v-for="(item, index) in listArr" :key="item._id" @click="checkoutList(item)">
          <a href="JavaScript:void(0)">
            <span v-text="item.name"></span>
          </a>
          <button @click="deleteList(item, index)">删除</button>
          <button @click="modifyList(item, index)">修改</button>
        </li>
      </ul>
      <div>
        <label>清单名 <input type="text" v-model="newList.name"></label>
        <button class="btn btn-default" @click="addList">添加</button>
      </div>
    </div>
    <div v-if="checkItem">
      <h2>任务列表[{{checkItem.name}}]</h2>
      <ul v-if="checkItem.tasks">
        <li v-for="item in checkItem.tasks" :key="item._id">
          <a href="JavaScript:void(0)">
            <span v-text="item.name"></span>
          </a>
          <!-- <button @click="deleteList(item, index)">删除</button> -->
          <!-- <button @click="modifyList(item, index)">修改</button> -->
        </li>
      </ul>
      <div>
        <label>任务名 <input type="text" v-model="newTask.name"></label>
        <button class="btn btn-default" @click="addTask">添加</button>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../api";
export default {
  data() {
    return {
      newList: {
        name: ''
      },
      newTask: {
        name: ''
      },
      checkItem: null, // 当前显示的清单
      listArr: []
    };
  },
  created() {
    // 判断有无登陆
    api.currentUser().then(res => {
      if (!res.data) this.$router.push({ name: "LoginPage" })
    })
    this.initData()
  },
  methods: {
    /** 修改清单 */
    modifyList(item, index) {
      let newName = window.prompt('清单名')
      if (!newName) return
      api.modifyList({ name: newName }, item._id).then(res => {
        item.name = newName
      })
    },
    /** 删除清单 */
    deleteList(item, index) {
      api.deleteList({}, item._id).then(res => {
        this.listArr.splice(index, 1)
      })
    },
    /** 切换清单 */
    checkoutList(item) {
      if (!item.tasks) this.$set(item, 'tasks', [])
      this.checkItem = item
      api.findTask({}, item._id).then(res => {
        item.tasks = res.data
      })
    },
    /** 添加清单 */
    addList() {
      api.createList(this.newList).then(res => {
        this.newList.name = ''
        this.listArr.push(res.data)
      })
    },
    /** 添加任务 */
    addTask() {
      api.createTask(this.newTask, this.checkItem._id).then(res => {
        this.newTask.name = ''
        this.checkItem.tasks.push(res.data)
      })
    },
    /** 初始化数据 */
    initData() {
      this.findList()
    },
    /** 获取清单列表 */
    findList() {
      api.findList().then(res => {
        this.listArr.push(...res.data)
        this.checkoutList(this.listArr[0])
      })
    },
    /** 退出登录状态 */
    logout() {
      api.logout()
      this.$router.push({ name: "LoginPage" })
    }
  }
};
</script>

