<template>
  <div>
    任务内容
    <textarea v-model="task.content" cols="30" rows="10"></textarea>
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
    }
  }
}
</script>
