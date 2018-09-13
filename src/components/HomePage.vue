<template>
  <div>
    主页
    <button @click="logout">退出</button>
    <div>
      <h1>清单列表</h1>
      <ul>
        <li v-for="item in listArr" :key="item._id" @click="checkoutList(item)">
          <a href="JavaScript:void(0)">
            <span v-text="item.name"></span>
          </a>
        </li>
      </ul>
      <div>
        <label>清单名 <input type="text" v-model="newList.name"></label>
        <button class="btn btn-default" @click="addList">添加</button>
      </div>
    </div>
    <div>
      <h2>任务列表</h2>
      <ul>
        <li>

        </li>
      </ul>
      <div>
        <label>任务名 <input type="text" v-model="newTask.name"></label>
        <button class="btn btn-default" @click="addTask">添加</button>
      </div>
    </div>
  </div>
</template>
<script>
import api from "../api";
export default {
  data() {
    return {
      newList: {
        name: ''
      },
      newTask: {
        name: ''
      },
      listArr: []
    };
  },
  created() {
    // 判断有无登陆
    api.currentUser().then(res => {
      if (!res.data) this.$router.push({ name: "LoginPage" })
    })
    this.initData()
  },
  methods: {
    /** 切换清单 */
    checkoutList(item) {
      
    },
    /** 添加清单 */
    addList() {
      api.createList(this.newList).then(res => {
        this.newList.name = ''
        this.listArr.push(res.data)
      })
    },
    /** 添加任务 */
    addTask() {
      
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
};
</script>

