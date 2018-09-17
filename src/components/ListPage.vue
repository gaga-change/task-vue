<template>
  <div>
    <h2>任务列表</h2>
    <ul v-if="taskArr">
      <li v-for="(item, index) in taskArr" :key="item._id">
        <a href="JavaScript:void(0)">
          <span v-text="item.name"></span>
        </a>
        <button @click="deleteTask(item, index)">删除</button>
        <!-- <button @click="modifyList(item, index)">修改</button> -->
      </li>
    </ul>
    <div>
      <label>任务名 <input type="text" v-model="newTask.name"></label>
      <button class="btn btn-default" @click="addTask">添加</button>
    </div>
  </div>
</template>
<script>
import api from '../api'
export default {
  data() {
    return {
      listId: null,
      newTask: {
        name: ''
      },
      taskArr: null
    }
  },
  created() {
    // 获取链接中的清单ID
    this.listId = this.$route.params.listId || ''
    this.initData()
  },
  beforeRouteUpdate(to, from, next) {
    this.listId = to.params.listId
    this.initData()
    next()
  },
  methods: {
    /** 数据初始化 */
    initData() {
      api.findTask({}, this.listId).then(res => {
        this.taskArr = res.data
      })
    },
    /** 添加任务 */
    addTask() {
      api.createTask(this.newTask, this.listId).then(res => {
        this.newTask.name = ''
        this.taskArr.push(res.data)
      })
    },
    /** 删除清单 */
    deleteTask(item, index) {
      api.deleteTask({}, this.listId, item._id).then(res => {
        this.taskArr.splice(index, 1)
      })
    },
  }
}
</script>

