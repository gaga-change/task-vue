<template>
  <div class="list-page">
    <div class="list-area">
      列表区域
    </div>
    <div class="detail-area">
      详情区域
    </div>
    <ul class="d-none" v-if="taskArr">
      <li v-for="(item, index) in taskArr" :key="item._id">
        <a href="JavaScript:void(0)" @click="checkouTask(item)">
          <span v-text="item.name"></span>
        </a>
        <button @click="deleteTask(item, index)">删除</button>
        <!-- <button @click="modifyList(item, index)">修改</button> -->
      </li>
    </ul>
    <div class="d-none">
      <label>任务名 <input type="text" v-model="newTask.name"></label>
        <button class="btn btn-default" @click="addTask">添加</button>
    </div>
    <!-- 任务详情 -->
    <router-view></router-view>
  </div>
</template>

<script>
import api from '../api'
export default {
  data() {
    return {
      listId: null,
      checkTask: null,
      newTask: {
        name: ''
      },
      taskArr: null
    }
  },
  created() {
    // 获取链接中的清单ID
    this.listId = this.$route.params.listId
    this.initData()
  },
  beforeRouteUpdate(to, from, next) {
    // 子页面路由更新 不监听
    if (to.name === 'TaskPage') return next()
    this.listId = to.params.listId
    this.initData()
    next()
  },
  methods: {
    /** 数据初始化 */
    initData() {
      if (!this.listId) return
      api.findTask({}, this.listId).then(res => {
        this.taskArr = res.data
      })
    },
    /** 切换任务 */
    checkouTask(item) {
      if (!item) return
      this.checkTask = item
      this.$router.push({
        name: 'TaskPage',
        params: {
          listId: this.listId,
          taskId: item._id
        }
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

<style lang="less">
.list-page {
  .list-area {
    position: absolute;
    width: 64%;
    right: 36%;
    padding-left: 260px;
    @media (max-width: 1020px) {
      padding-left: 0;
    }
    @media (max-width: 920px) {
      width: 100%;
      right: 0;
    }
  }
  .detail-area {
    position: absolute;
    right: 0;
    height: 100%;
    width: 36%;
    border-left: 1px solid #ededed;
    background-color: #fafafa;
     @media (max-width: 920px) {
      width: 0;
      overflow: hidden;
    }
  }

  .list-area,
  .detail-area {
    transition: all 0.2s ease-in-out;
  }
}
</style>

