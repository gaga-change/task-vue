<template>
  <div class="list-page">
    <!-- 任务列表 -->
    <div class="list-area">
      <div class="list-header">
        <h2 class="header-name">任务列表</h2>
      </div>
      <div class="new-task-area">
        <input
          class="new-task-ipt"
          type="text"
          placeholder='添加任务至"任务列表"，回车即可保存'
          v-model="newTask.name"
          @keyup.enter="addTask"
        >
      </div>
      <transition-group
        name="flip-list"
        tag="ul"
        class="task-list-ul"
        v-if="taskArr"
      >
        <!-- <ul class="task-list-ul" v-if="taskArr"> -->
        <li
          v-for="(item, index) in taskArr"
          :key="item._id"
          :data-index="index"
          :class="{
          'active': checkTask && checkTask._id === item._id,
          'closed': item.close 
          }"
        >
          <a
            href="JavaScript:void(0)"
            @click="checkouTask(item)"
          >
            <div class="task-line"></div>
            <span @click.stop="closeTask($event, item)">
              <el-checkbox
                class="task-checkbox"
                v-model="item.close"
              ></el-checkbox>
            </span>
            <input
              class="task-name-ipt"
              type="text"
              v-model="item.name"
              @change="taskNameChange(item)"
              @input="taskNameInput(item)"
              @keyup.enter="blur($event)"
            >
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link ">
                <i class="el-icon-more el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{type: 'del', item, index}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </a>
        </li>
        <!-- </ul> -->
      </transition-group>
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
  data () {
    return {
      listId: null,
      checkTask: null,
      newTask: {
        name: ''
      },
      date: null, // 时间，系统时间
      taskArr: null
    }
  },
  computed: {
    newTaskName () {
      return this.$store.state.inputTaskName
    }
  },
  watch: {
    newTaskName (val, oldVal) {
      this.checkTask.name = val
    }
  },
  created () {
    // 获取链接中的清单ID
    this.listId = this.$route.params.listId
    this.initData()
    // 全局点击时，自动关闭 操作菜单
    this.documentClickFn = e => {
      if (this.lastControlEle)
        this.lastControlEle.addClass('d-none')
    }
    $(document).on('click', this.documentClickFn)
  },
  destroyed () {
    $(document).off('click', this.documentClickFn)
  },
  beforeRouteUpdate (to, from, next) {
    // 子页面路由更新 不监听
    if (to.name === 'TaskPage') return next()
    this.listId = to.params.listId
    this.initData()
    next()
  },
  methods: {
    /** 数据初始化 */
    initData () {
      if (!this.listId) return
      api.findTask({}, this.listId).then(res => {
        this.timerRun(res.headers.date)
        this.taskArr = res.data
      })
    },
    handleCommand (command) {
      console.log(command)
      if (command.type === 'del') {
        this.deleteTask(command.item, command.index)
      }
      // this.$message('click on item ' + command);
    },
    /** 计时器 */
    timerRun (sysDate) {
      let sysTime = new Date(sysDate).getTime()
      this.date = new Date(sysDate)
      setInterval(() => {
        setTimeout(() => {
          this.date = new Date(this.date.getTime() + 1000)
        }, 0)
      }, 1000)
    },
    /** 任务排序 */
    sortTaskArr () {
      this.taskArr.mySort((a, b) => {
        let res = null
        a.closeAt = _(a.closeAt)
        b.closeAt = _(b.closeAt)
        a.createAt = _(a.createAt)
        b.createAt = _(b.createAt)

        if (a.close != b.close) {
          res = a.close - b.close > -1
        } else if (a.closeAt != b.closeAt) {
          res = b.closeAt - a.closeAt > 0
        } else {
          res = b.createAt - a.createAt > 0
        }
        return res
      })
      function _ (date) {
        if (date) {
          return new Date(date).getTime()
        }
        return date
      }
    },
    /** 使当前元素失去焦点 */
    blur (e) {
      e.target.blur()
    },
    /** 关闭或开启任务 */
    closeTask (e, item) {
      var close = e.target.checked
      var closeAt = close ? new Date(this.date) : null
      item.closeAt = closeAt
      item.close = close

      this.sortTaskArr()
      api.modifyTask({ close, closeAt }, this.listId, item._id)
    },
    /** 切换任务 */
    checkouTask (item) {
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
    /** 任务名称修改事件 */
    taskNameInput (item) {
      this.$store.commit('changeInputTaskName', item.name)
    },
    /** 任务名称修改 */
    taskNameChange (item) {
      api.modifyTask({ name: item.name }, this.listId, item._id)
    },
    /** 添加任务 */
    addTask () {
      let task = {
        _id: window.uuid(),
        name: this.newTask.name,
        close: false,
        closeAt: null,
        createAt: this.date,
        content: ''
      }
      this.newTask.name = ''
      this.taskArr.unshift(task)
      api.createTask(task, this.listId).then(res => {
      })
    },
    /** 删除清单 */
    deleteTask (item, index) {
      api.deleteTask({}, this.listId, item._id).then(res => {
        this.taskArr.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除任务成功'
        })
      })
    },
  }
}
</script>

<style lang="less">
.el-dropdown-link {
  display: block;
  cursor: pointer;
  // color: #409eff;
  color: rgba(0, 0, 0, 0.24);
}
.el-icon-arrow-down {
  font-size: 12px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.dir-list {
  font-size: 14px;
}
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
      color: rgba(0, 0, 0, 0.85);
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
      border: 1px solid rgba(0, 0, 0, 0.14);
      outline: 0;
      border-radius: 2px;
      color: #C0C4CC;
      &:focus {
        border-color: #617fde;
      }
    }
  }
  .task-list-ul {
    list-style: none;
    padding: 0;
    // 任务列表 输入框
    .task-name-ipt {
      flex: 1;
      border: none;
      background: none;
      outline: none;
      font-size: 14px;
      cursor: pointer;
    }
    // 多选框
    .task-checkbox {
      position: relative;
      top: -1px;
      height: 36px;
      margin: 0 5px 0 0;
      .el-checkbox__inner:hover {
        // border-color: #dcdfe6;
      }
    }
    // 任务分割线
    .task-line {
      position: absolute;
      left: 23px;
      right: 23px;
      bottom: 0;
      height: 1px;
      background-color: rgba(0, 0, 0, 0.08);
    }
    & > li {
      cursor: pointer;
      &.active {
        background-color: #f3f3f3;
      }
      &.closed {
        color: rgba(0, 0, 0, 0.24);
        a,
        input {
          color: inherit;
        }
        .task-checkbox {
          .el-checkbox__inner {
            background-color: #fff;
            border-color: #dcdfe6;
            &::after {
              border-color: #dcdfe6;
            }
          }
        }
      }
      &:hover {
        background-color: rgba(243, 243, 243, 0.5);
        .el-dropdown-link {
          // display: block;
        }
      }
      & > a {
        position: relative;
        display: flex;
        height: 36px;
        line-height: 36px;
        padding: 0 23px;
        text-decoration: none;
      }
    }
  }
}
</style>

