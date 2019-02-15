<template>
  <div class="content-main">
    <div class="content-left">
      <!-- 顶部 -->
      <div class="d-none">
        主页
        <button @click="logout">退出</button>
      </div>
      <!-- 清单列表 -->
      <div>
        <ul class="tab-list list-inline">
          <li>
            <a href="JavaScript:void(0)">清单</a>
          </li>
        </ul>
        <ul
          class="dir-list list-inline"
          id="dragula"
        >
          <li
            v-for="(item, index) in listArr"
            :key="item._id"
            :class="{'active': checkItem && item._id === checkItem._id}"
            @click="checkoutList(item)"
            :data-order="item.order"
            :data-index="index"
          >
            <a
              class="item-a"
              href="JavaScript:void(0)"
            >
              <span v-text="item.name"></span>
              <i
                class="list-control-btn"
                @click.stop="showControl($event)"
              >操作</i>
            </a>
            <div class="list-control d-none">
              <button
                class="btn btn-sm btn-outline-warning"
                @click.stop="deleteList(item, index)"
              >删除</button>
              <button
                class="btn btn-sm btn-outline-light"
                @click.stop="modifyList(item, index)"
              >修改</button>
            </div>
          </li>
        </ul>
        <ul
          class="dir-list list-inline"
          style="margin-top: -16px"
        >
          <li>
            <a
              class="item-a"
              href="JavaScript:void(0)"
              @click="dialogVisible = true"
            >+ 添加清单</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="content-right">
      <!-- 任务列表 -->
      <router-view></router-view>
    </div>
    <div
      class="dialog-area"
      @keyup.enter="addList();dialogVisible=false"
    >
      <el-dialog
        title="添加清单"
        :visible.sync="dialogVisible"
      >
        <el-form
          :model="newList"
          @submit.native.prevent
        >
          <el-form-item
            label="清单名称"
            :label-width="formLabelWidth"
          >
            <el-input
              v-model="newList.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form> <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogVisible = false;addList()"
          >确 定</el-button>
        </span>
      </el-dialog>
    </div>  
  </div>
</template>

<script>
import api from "../api"
import dragula from 'dragula'

export default {
  data () {
    return {
      newList: {
        _id: null,
        name: ''
      },
      dialogVisible: false, // 添加清单对话框
      checkItem: null, // 当前显示的清单
      params: this.$route.params,
      listArr: [],
      lastControlEle: null, // 上一个显示的操作菜单
      documentClickFn: null,
      formLabelWidth: '120px'
    }
  },
  computed: {
    listCache () {
      return this.$store.state.taskCache
    }
  },
  created () {
    this.initData()
    window.GO_LOGIN = () => {
      this.$router.push({ name: "LoginPage" })
    }
    // 全局点击时，自动关闭 操作菜单
    this.documentClickFn = e => {
      if (this.lastControlEle)
        this.lastControlEle.addClass('d-none')
    }
    $(document).on('click', this.documentClickFn)
  },
  mounted () {
    this.dragulaRun()
  },
  destroyed () {
    $(document).off('click', this.documentClickFn)
  },
  methods: {
    dragulaRun () {
      let oldPrevious = null
      dragula([document.querySelector('#dragula')], {
        moves (el, source, handle, sibling) {
          oldPrevious = el.previousSibling
          return true; // elements are always draggable by default
        },
      }).on('dragend', (el, container) => {
        let previous = el.previousSibling
        let next = el.nextSibling
        let elOrder = el.getAttribute('data-order')
        let elIndex = el.getAttribute('data-index')
        if (oldPrevious == previous) {
          return
        }
        if (previous || next) {
          let previousOrder = previous ? previous.getAttribute('data-order') : -1
          let nextOrder = next ? next.getAttribute('data-order') : -1
          elOrder = Number(elOrder)
          previousOrder = Number(previousOrder)
          nextOrder = Number(nextOrder)
          if (previousOrder == -1 && nextOrder == -1) return
          if (elOrder > nextOrder) {
            this.down(elIndex, nextOrder)
          }
          if (elOrder < nextOrder) {
            this.up(elIndex, nextOrder)
          }
        }
      })
    },
    // 清单向上移动
    up (elIndex, nextOrder) {
      let elOrder = this.listArr[Number(elIndex)].order
      let max = Math.max(elOrder, nextOrder) + 1
      let min = Math.min(elOrder, nextOrder)
      this.listArr.forEach(item => {
        if (item.order > min && item.order < max) {
          item.order--
        }
      })
      let item = this.listArr[Number(elIndex)]
      item.order = nextOrder
      api.changeOrder({
        order: item.order,
        type: '-',
        min,
        max
      }, item._id)
    },
    // 清单向下移动
    down (elIndex, nextOrder) {
      let elOrder = this.listArr[Number(elIndex)].order
      let max = Math.max(elOrder, nextOrder)
      let min = Math.min(elOrder, nextOrder)
      this.listArr.forEach(item => {
        if (item.order > min && item.order < max) {
          item.order++
        }
      })
      let item = this.listArr[Number(elIndex)]
      item.order = nextOrder + 1
      api.changeOrder({
        order: item.order,
        type: '+',
        min,
        max
      }, item._id)
    },
    // 显示清单“操作”菜单
    showControl (e) {
      let target = $(e.target)
      let controlEle = target.closest('a').siblings('.list-control')
      if (controlEle.hasClass('d-none')) {
        if (this.lastControlEle) {
          this.lastControlEle.addClass('d-none')
        }
        controlEle.removeClass('d-none')
        this.lastControlEle = controlEle
      } else {
        controlEle.addClass('d-none')
      }
    },
    /** 修改清单 */
    modifyList (item, index) {
      this.dialogVisible = true
      // this.newList.name = item.name
      // this.newList._id = item._id
      this.newList = item
      this.$nextTick(() => {
        let ele = document.querySelector('.dialog-area input')
        ele && ele.focus()
      })
    },
    /** 删除清单 */
    deleteList (item, index) {
      // if (!confirm(`是否删除清单【${item.name}】`)) return
      this.listArr.splice(index, 1)
      // 如果当前路由id 是被删除的清单，则调整路由
      if (this.checkItem === item) {
        if (this.listArr.length)
          this.checkoutList(this.listArr[0])
        else this.$router.push('/')
      }
      api.deleteList({}, item._id).then(res => {
        this.$message({
          type: 'success',
          message: '删除清单成功'
        })
      })
    },
    /** 切换清单 */
    checkoutList (item) {
      if (!item) return
      this.checkItem = item
      this.$router.push({ name: 'ListPage', params: { listId: this.checkItem._id } })
    },
    /** 添加或修改 清单 */
    addList () {
      if (this.newList._id) {
        // 修改
        api.modifyList({ name: this.newList.name }, this.newList._id).then(res => {
          this.$message({
            type: 'success',
            message: '修改清单成功'
          })
        })
        this.newList = {name: ''} // 初始化
      } else {
        // 创建
        api.createList(this.newList).then(res => {
          this.newList.name = ''
          this.$store.commit('updateListCache', res.data)
          this.listArr.unshift(res.data)
          this.checkoutList(res.data)
        })
      }
    },
    /** 初始化数据 */
    initData () {
      this.findList()
    },
    /** 获取清单列表 */
    findList () {
      api.findList().then(res => {
        this.listArr.push(...res.data)
        // 根据路由还原指定 清单
        if (this.params.listId) {
          let item = this.listArr.filter(item => item._id === this.params.listId)[0]
          this.checkoutList(item || this.listArr[0])
        } else {
          this.checkoutList(this.listArr[0])
        }
      })
    },
    /** 退出登录状态 */
    logout () {
      api.logout()
      this.$router.push({ name: "LoginPage" })
    }
  }
}
</script>

<style lang="less">
.dialog-area {
  .el-input {
    max-width: 300px;
  }
}
// 主体结构
.content-main {
  position: relative;
  height: 100%;
  // 主体左侧：清单列表
  .content-left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    height: 100%;
    width: 260px;
    background-color: #5069c4;
    color: #fff;
    transition: all 0.2s ease-in-out;
    @media (max-width: 1020px) {
      width: 0;
      overflow: hidden;
    }
  }
}
// 拖拽复制体
.gu-mirror {
  background-color: rgba(0, 0, 0, 0.2);
  transition: opacity 0.4s ease-in-out;
  list-style: none;
  a {
    color: #fffc;
    display: block;
    &:hover {
      text-decoration: none;
    }
  }
  .item-a {
    display: block;
    line-height: 36px;
    padding: 0 20px;
    outline: none;
    &:hover {
      text-decoration: none;
    }
  }
  // “操作” 按钮
  .list-control-btn {
    float: right;
    font-size: 12px;
    font-style: normal;
    &:hover {
      color: #fff;
    }
  }
}
// 左侧清单列表
.content-left {
  ul {
    li {
      a {
        color: #fffc;
      }
    }
  }
  .tab-list {
    display: flex;
    li {
      flex: 1;
      text-align: center;
      a {
        display: block;
        &:hover {
          text-decoration: none;
        }
      }
    }
  }

  .dir-list {
    li {
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      &.active {
        background-color: rgba(0, 0, 0, 0.14);
      }
    }
    // “操作” 按钮
    .list-control-btn {
      float: right;
      font-size: 12px;
      font-style: normal;
      &:hover {
        color: #fff;
      }
    }
    // 操作域
    .list-control {
      padding: 0 20px;
      .btn {
        font-size: 12px;
      }
    }
    .item-a {
      display: block;
      line-height: 36px;
      padding: 0 20px;
      outline: none;
      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
