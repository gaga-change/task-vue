<template>
  <div class="task-page">
    <div class="title-area">
      <i
        class="el-icon-back"
        @click="$router.go(-1)"
      ></i>
      <h2 class="task-name">
        <input
          type="text"
          v-model="task.name"
          @change="taskContentChange(task)"
          @input="taskNameInput(task)"
        >
      </h2>
    </div>
    <div class="content-area">
      <textarea
        v-model="task.content"
        placeholder="描述"
        @change="taskContentChange(task)"
      ></textarea>
    </div>
  </div>
</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      taskId: null,
      listId: null,
      task: {
        content: '',
        name: ''
      }
    }
  },
  computed: {
    newTaskName () {
      return this.$store.state.inputTaskName
    },
    taskCache () {
      return this.$store.state.taskCache
    }
  },
  watch: {
    newTaskName (val, oldVal) {
      this.task.name = val
    }
  },
  created () {
    this.update(this.$route.params)
  },
  // 路由更新钩子
  beforeRouteUpdate (to, from, next) {
    this.update(to.params)
    next()
  },
  methods: {
    /** 路由更新 */
    update (params) {
      this.taskId = params.taskId
      this.listId = params.listId
      this.initData()
    },
    /** 数据初始化 */
    initData () {
      if (!this.taskId || !this.listId) return
      let taskCache = this.taskCache[this.taskId]
      if (taskCache) {
        this.task = JSON.parse(JSON.stringify(taskCache))
        this.$store.commit('updateTaskCache', this.taskId)
      } else {
        api.findOneTask({}, this.listId, this.taskId).then(res => {
          this.task = res.data
        })
      }

    },
    /** 任务名称修改事件 */
    taskNameInput (item) {
      this.$store.commit('changeInputTaskName', item.name)
    },
    /** 任务名称修改 */
    taskContentChange (item) {
      api.modifyTask(item, this.listId, this.taskId).then(res => {
      })
    }
  }
}
</script>

<style lang="less">
.task-page {
  height: 100%;
  .title-area {
    display: flex;
    align-items: center;
    padding: 16px 14px 12px 20px;
    .el-icon-back {
      display: none;
      @media (max-width: 920px) {
        display: block;
        font-size: 20px;
        margin-right: 20px;
      }
    }
    .task-name {
      flex: 1;
      min-height: 25px;
      line-height: 25px;
      margin: 0;
      overflow: hidden;
      word-wrap: break-word;
      font-size: 16px;
      font-weight: 700;
      input {
        font-size: inherit;
        font-weight: inherit;
        outline: none;
        border: none;
        background-color: inherit;
      }
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
