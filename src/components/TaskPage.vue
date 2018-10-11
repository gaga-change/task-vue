<template>
  <div class="task-page">
    <div class="title-area">
      <h2 class="task-name" v-text="task.name"></h2>
    </div>
    <div class="content-area">
      <textarea v-model="task.content" placeholder="描述" @change="taskContentChange(task)"></textarea>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  data() {
    return {
      taskId: null,
      listId: null,
      task: {
        content: ''
      }
    }
  },
  created() {
    this.update(this.$route.params)
  },
  // 路由更新钩子
  beforeRouteUpdate(to, from, next) {
    this.update(to.params)
    next()
  },
  methods: {
    /** 路由更新 */
    update(params) {
      this.taskId = params.taskId
      this.listId = params.listId
      this.initData()
    },
    /** 数据初始化 */
    initData() {
      if (!this.taskId || !this.listId) return
      api.findOneTask({}, this.listId, this.taskId).then(res => {
        this.task = res.data
      })
    },
    /** 任务名称修改 */
    taskContentChange(item) {
      console.log(item)
      api.modifyTask({ content: item.content }, this.listId, this.taskId).then(res => {
        console.log('res: ', res)
      })
    }
  }
}
</script>

<style lang="less">
.task-page {
  height: 100%;
  .title-area {
    padding: 16px 14px 12px 20px;
    .task-name {
      min-height: 25px;
      line-height: 25px;
      margin: 0;
      overflow: hidden;
      word-wrap: break-word;
      font-size: 16px;
      font-weight: 700;
    }
  }
  .content-area {
    position: absolute;
    top: 53px;
    bottom: 0;
    width: 100%;
    padding: 14px 20px;
    textarea {
      height: 100%;
      width: 100%;
      font-size: 14px;
      background-color: #fafafa;
      border: none;
      outline: none;
      resize: none;
    }
  }
}
</style>
