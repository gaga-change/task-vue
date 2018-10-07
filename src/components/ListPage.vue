<template>
  <div class="list-page">
    <!-- 任务列表 -->
    <div class="list-area">
      <div class="list-header">
        <h2 class="header-name">任务列表</h2>
      </div>
      <div class="new-task-area">
        <input class="new-task-ipt" type="text" placeholder='添加任务至"任务列表"，回车即可保存' v-model="newTask.name" @keyup.enter="addTask">
      </div>
      <ul class="task-list-ul" v-if="taskArr">
        <li v-for="(item, index) in taskArr" :key="item._id" :data-index="index" :class="{'active': checkTask && checkTask._id === item._id}">
          <a href="JavaScript:void(0)" @click="checkouTask(item)">
            <span v-text="item.name"></span>
          </a>
          <!-- <button @click="deleteTask(item, index)">删除</button> -->
          <!-- <button @click="modifyList(item, index)">修改</button> -->
        </li>
      </ul>
    </div>
    <!-- 任务详情 -->
    <div class="detail-area">
      <router-view></router-view>
    </div>
    <!-- 任务详情 -->
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
  .list-header {
    padding: 0 20px;
    margin: 12px 0;
    .header-name {
      height: 36px;
      margin: 0;
      line-height: 36px;
      font-size: 22px;
      font-weight: 400;
      color: rgba(0,0,0,.85);
    }
  }
  .new-task-area {
    padding: 0 16px;
    margin: 10px 0;
    .new-task-ipt {
      display: block;
      height: 36px;
      width: 100%;
      padding: 0 10px;
      font-size: 14px;
      border: 1px solid rgba(0,0,0,.14);
      outline: 0;
      border-radius: 2px;
      &:focus {
        border-color: #617fde;
      }
    }
  }
  .task-list-ul {
    list-style: none;
    padding: 0;
    & > li {
      cursor: pointer;
      &.active {
        background-color: #f3f3f3;
      }
      &:hover {
        background-color: rgba(243,243,243,.5);
      }
      & > a {
        display: block;
        height: 36px;
        line-height: 36px;
        padding: 0 23px;
        text-decoration: none;
      }
    }
  }
}
</style>

