<template>
  <div class="list-page">
    <!-- 任务列表 -->
    <div class="list-area">
      <div class="task-list-area">
        <div class="list-header">
          <i
            class="el-icon-menu"
            id="ShowMenuTarget"
          ></i>
          <h2 class="header-name">任务列表</h2>
        </div>
        <div
          class="new-task-area"
          @keyup.enter="addTask"
        >
          <el-input
            v-model="newTask.name"
            placeholder='添加任务至"任务列表"，回车即可保存'
            maxlength="100"
          ></el-input>
        </div>
        <div class="task-list-content">
          <el-scrollbar style="height: 100%;">
            <transition-group
              name="flip-list"
              tag="ul"
              class="task-list-ul"
              v-if="taskArr"
            >
              <!-- <ul class="task-list-ul" v-if="taskArr"> -->
              <li
                v-for="(item, index) in taskArr"
                :data-id="item._id"
                :key="item._id"
                :data-index="index"
                :class="{
          'active': checkTask && checkTask._id === item._id,
          'closed': item.close 
          }"
              >
                <a @click="checkouTask(item)">
                  <div class="task-line"></div>
                  <span @click.stop="closeTask($event, item, index)">
                    <el-checkbox
                      :class="`task-checkbox priority-${item.priority}`"
                      v-model="item.close"
                    ></el-checkbox>
                  </span>
                  <input
                    class="task-name-ipt"
                    type="text"
                    v-model="item.name"
                    @change="taskNameChange(item)"
                    @input="taskNameInput(item)"
                    @keyup.enter="blur($event);addTask('')"
                  >
                  <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link ">
                      <i class="el-icon-more el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item :command="{type: 'del', item, index}">
                  <div>
                    <span>优先级</span>
                    <ul>
                      <li>!!!</li>
                      <li>!!</li>
                      <li>!</li>
                      <li>!!!</li>
                    </ul>
                  </div>
                </el-dropdown-item> -->
                      <el-dropdown-item :command="{type: 'del', item, index}">删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </a>
              </li>
              <!-- </ul> -->
            </transition-group>

            <div>
              <h6 style="font-size:12px;padding-left:23px;">已完成</h6>
            </div>
            <transition-group
              name="flip-list"
              tag="ul"
              class="task-list-ul"
              v-if="taskCloseArr"
            >
              <!-- <ul class="task-list-ul" v-if="taskArr"> -->
              <li
                v-for="(item, index) in taskCloseArr"
                :key="item._id"
                :data-index="index"
                :class="{
          'active': checkTask && checkTask._id === item._id,
          'closed': item.close 
          }"
              >
                <a @click="checkouTask(item)">
                  <div class="task-line"></div>
                  <span @click.stop="closeTask($event, item, index)">
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
            <a
              class="load-more"
              href="JavaScript:void(0)"
              v-if="havaMore"
              @click="loadMore()"
            >加载更多</a>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- 任务详情 -->
    <div
      class="detail-area"
      :class="{'_show': params.taskId}"
    >
      <router-view></router-view>
    </div>
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
      taskArr: null,
      taskCloseArr: null, // 已关闭任务
      havaMore: false, // 有未载入的已完成任务
    }
  },
  computed: {
    newTaskName () {
      return this.$store.state.inputTaskName
    },
    taskCache () {
      return this.$store.state.taskCache
    },
    listCache () {
      return this.$store.state.listCache
    },
    params () {
      return this.$route.params
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
  mounted () {
    let menuEle = $('.content-left')
    $('#ShowMenuTarget').click(e => {
      console.log('...')
      if (menuEle.hasClass('_show')) {
        menuEle.removeClass('_show')
      } else {
        menuEle.addClass('_show')
      }
      e.stopPropagation()
    })
    menuEle.click(e => {
      e.stopPropagation()
    })
    $(document).click(e => {
      menuEle.removeClass('_show')
    })
  },
  destroyed () {
    $(document).off('click', this.documentClickFn)
  },
  beforeRouteUpdate (to, from, next) {
    // 任务详情切换 或者 当前显示任务被删除，则不更新数据
    if (to.name === 'TaskPage' || to.params.listId === from.params.listId) return next()
    // 清单切换，手动初始化数据
    this.listId = to.params.listId
    this.initData()
    next()
  },
  methods: {
    /** 计算优先级 */
    setPriority(v) {
      return v.name.split(' ')[0].split('#').length
    },
    /** 数据初始化 */
    initData () {
      if (!this.listId) return
      this.taskArr = []
      if (this.listCache[this.listId]) {
        this.$store.commit('updateListCache', this.listId)
        this.taskCloseArr = []
        this.havaMore = false
      } else {
        api.findTask2({ pageSize: 5 }, this.listId).then(res => {
          this.taskArr = res.data.task.map(v => {
            v.priority = this.setPriority(v)
            return v
          })
          this.sortTaskArr()
          this.taskCloseArr = res.data.task2
          if (this.taskCloseArr.length == 5) {
            this.havaMore = true
          } else {
            this.havaMore = false
          }
        })
      }
    },
    /** 加载更多 */
    loadMore () {
      api.findClosedTask({
        skip: this.taskCloseArr.length,
        limit: 40,
      }, this.listId).then(res => {
        this.taskCloseArr.push(...res.data)
        if (res.data.length != 40) {
          this.havaMore = false
        }
      })
    },
    handleCommand (command) {
      if (command.type === 'del') {
        this.deleteTask(command.item, command.index)
      }
    },
    /** 任务排序 */
    sortTaskArr () {
      this.taskArr.mySort((a, b) => {
        let res = null
        a.createAt = _(a.createAt)
        b.createAt = _(b.createAt)
        if (a.priority != b.priority) {
          res = b.priority - a.priority > 0
        } else {
          res = b.createAt - a.createAt > 0
        }
        // if (a.close != b.close) {
        //   res = a.close - b.close > -1
        // } else if (a.closeAt != b.closeAt) {
        //   res = b.closeAt - a.closeAt > 0
        // }
        return res
      })
      this.taskArr = [...this.taskArr]
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
    closeTask (e, item, index) {
      if (e.target.type !== 'checkbox') return
      let close = e.target.checked
      item.closeAt = close ? new Date(window.sysDate) : null
      item.close = close
      api.switchTask(item, this.listId, item._id)
      if (close) {
        // 从未完成中删除， 添加到已完成中
        this.taskArr.splice(index, 1)
        this.taskCloseArr.unshift(item)
      } else {
        // 从未完成中删除， 添加到已完成中
        this.taskCloseArr.splice(index, 1)
        this.taskArr.push(item)
        this.sortTaskArr()
      }
    },
    /** 切换任务 */
    checkouTask (item) {
      if (!item) {
        this.$router.push({
          name: 'ListPage',
          params: {
            listId: this.listId,
          }
        })
      } else {
        this.checkTask = item
        this.$router.push({
          name: 'TaskPage',
          params: {
            listId: this.listId,
            taskId: item._id
          }
        })
      }
    },
    /** 任务名称修改事件 */
    taskNameInput (item) {
      this.$store.commit('changeInputTaskName', item.name)
    },
    /** 任务名称修改 */
    taskNameChange (item) {
      item.priority = this.setPriority(item)
      this.sortTaskArr()
      api.modifyTask({ name: item.name }, this.listId, item._id)
    },
    /** 添加任务 */
    addTask (text) {
      let name = this.newTask.name
      this.newTask.name = ''
      // 判断是否是回车自动创建的空任务
      let newEmpty = typeof text === 'string'
      if (newEmpty) {
        name = ''
      } else if (name.length === 0) {
        return
      }
      let task = {
        _id: window.uuid(),
        name,
        close: false,
        closeAt: null,
        createAt: window.sysDate,
        content: '',
      }
      task.priority = this.setPriority(task)
      this.taskArr.unshift(task)
      this.sortTaskArr()
      // 如果是空任务，自动获取焦点，自动切换路径，存储缓存，防止立即获取任务详情失败
      if (newEmpty) {
        this.$store.commit('updateTaskCache', task)
        this.checkouTask(task)
        this.$nextTick(() => {
          var ipt = $(
            `ul.task-list-ul li[data-id=${task._id}] .task-name-ipt`
          )
          ipt && ipt.focus()
        })
      }
      api.createTask(task, this.listId).then(res => {
      })
    },
    /** 删除清单 */
    deleteTask (item, index) {
      if (item.close) {
        this.taskCloseArr.splice(index, 1)
      } else {
        this.taskArr.splice(index, 1)
      }
      // 路由回到任务列表
      if (item === this.checkTask) {
        this.checkouTask()
      }
      api.deleteTask({}, this.listId, item._id).then(res => {
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
    top: 0;
    bottom: 0;
    padding-left: 260px;
    .task-list-area {
      position: relative;
      height: 100%;
      overflow: hidden;
    }
    .task-list-content {
      position: absolute;
      width: 100%;
      top: 110px;
      bottom: 0;
    }
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
    z-index: 2;
    border-left: 1px solid #ededed;
    background-color: #fafafa;
    @media (max-width: 920px) {
      width: 0;
      overflow: hidden;
      &._show {
        width: 100%;
      }
    }
  }

  .list-area,
  .detail-area {
    transition: all 0.2s ease-in-out;
  }
  .list-header {
    display: flex;
    align-items: center;
    padding: 0 20px;
    margin: 12px 0;
    .el-icon-menu {
      display: none;
      cursor: pointer;
      font-size: 22px;
      margin-right: 20px;
      @media (max-width: 1020px) {
        display: block;
      }
    }
    .header-name {
      flex: 1;
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
  }
  .load-more {
    display: block;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.24);
    text-align: center;
    &:hover {
      text-decoration: none;
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
      // .el-checkbox__inner:hover {
      // border-color: #dcdfe6;
      // }
      &.priority-2 {
        .el-checkbox__inner {
          border-color: #1E9FFF;
        }
      }
      &.priority-3 {
        .el-checkbox__inner {
          border-color: #FFB800;
        }
      }
      &.priority-4 {
        .el-checkbox__inner {
          border-color: #FF5722;
        }
      }
      &.priority-5 {
        .el-checkbox__inner {
          border-color: #2F4056;
        }
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
        // .el-dropdown-link {
        // display: block;
        // }
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

