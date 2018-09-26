<template>
  <div class="content-main">
    <div class="content-left">
      <!-- 顶部 -->
      <div hidden>
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
        <ul class="dir-list list-inline">
          <li v-for="(item, index) in listArr" :key="item._id" :class="{'active': item._id === checkItem._id}" @click="checkoutList(item)">
            <a href="JavaScript:void(0)">
              <span v-text="item.name"></span>
            </a>
            <button @click="deleteList(item, index)" hidden>删除</button>
            <button @click="modifyList(item, index)" hidden>修改</button>
          </li>
        </ul>
        <div hidden>
          <label>清单名 <input type="text" v-model="newList.name"></label>
            <button class="btn btn-default" @click="addList">添加</button>
        </div>
      </div>
    </div>
    <div class="content-right">
      <!-- 任务列表 -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import api from "../api"

export default {
  data() {
    return {
      newList: {
        name: ''
      },
      checkItem: null, // 当前显示的清单
      listArr: []
    };
  },
  created() {
    // 判断有无登陆
    api.currentUser().then(res => {
      if (!res.data) {
        this.$router.push({ name: "LoginPage" })
      } else {
        this.initData()
      }
    })
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
      if (!item) return
      // if (!item.tasks) this.$set(item, 'tasks', [])
      this.checkItem = item
      this.$router.push({ name: 'ListPage', params: { listId: this.checkItem._id } })
    },
    /** 添加清单 */
    addList() {
      api.createList(this.newList).then(res => {
        this.newList.name = ''
        this.listArr.push(res.data)
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
}
</script>

<style lang="less">
// 主体结构
.content-main {
  position: relative;
  height: 100%;
  // 主体左侧：清单列表
  .content-left {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 260px;
    background-color: #5069c4;
    color: #fff;
  }
  // 主题右侧：任务列表&详情
  .content-right {
    padding-left: 260px;
  }
}

.content-left {
  ul {
    li {
      a {
        color: #fff;
        opacity: 0.8;
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
        background-color: rgba(0, 0, 0, .05);
      }
      &.active {
        background-color: rgba(0,0,0,.14);
      }
    }
    a {
      display: block;
      line-height: 36px;
      padding: 0 20px;
      &:hover {
        text-decoration: none;
      }
    }
  }
}
</style>
