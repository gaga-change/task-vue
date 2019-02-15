<template>
  <div
    class="login-page"
    @keyup.enter="keyupEnter"
  >
    <div class="bg"></div>
    <div class="container">
      <!-- 头部 -->
      <h1 class="text-center title">我的清单</h1>
      <!-- 主内容 -->
      <div class="row">
        <div class="col">
          <div class="main">
            <!-- 昵称 -->
            <div
              class="ipt-group"
              v-if="state === REGISTER"
            >
              <input
                name="username"
                type="text"
                placeholder="昵称 ( 可选 )"
                v-model="name"
              >
            </div>
            <!-- 邮箱 -->
            <div class="ipt-group">
              <input
                name="username"
                type="email"
                placeholder="邮箱"
                v-model="username"
              >
            </div>
            <!-- 密码 -->
            <div class="ipt-group">
              <input
                name="password"
                type="password"
                placeholder="密码"
                v-model="password"
              >
            </div>
            <div>
              <!-- 登入 -->
              <div
                class="btn-group"
                v-if="state === LOGIN"
              >
                <button
                  class="btn"
                  type="button"
                  @click="login"
                >登入</button>
              </div>
              <!-- 注册 -->
              <div
                class="btn-group"
                v-else
              >
                <button
                  class="btn"
                  type="button"
                  @click="register"
                >创建免费账户</button>
              </div>
            </div>
            <div>
              <!-- other -->
              <div
                class="other text-center"
                v-if="state === LOGIN"
              >
                <button
                  class="btn btn-link"
                  type="button"
                  @click="state=REGISTER"
                >创建免费账户</button>
              </div>
              <!-- other -->
              <div
                class="other text-center"
                v-else
              >
                已有账户?
                <button
                  class="btn btn-link"
                  type="button"
                  @click="state=LOGIN"
                >登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import api from '../api'
export default {
  data () {
    return {
      LOGIN: 1,
      REGISTER: 2,
      state: null,
      username: '',
      password: '',
      name: ''
    }
  },
  created () {
    this.state = this.LOGIN
  },
  methods: {
    // 回车键 自动触发登录或注册
    keyupEnter () {
      if (this.state === this.REGISTER) {
        this.register()
      } else {
        this.login()
      }
    },
    // 校验输入内容长度
    checkText (keys) {
      let opt = {
        username: { min: 1, max: 50, name: '邮箱' },
        password: { min: 4, max: 50, name: '密码' },
      }
      let message = ''
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        let val = this[key]
        if (val.length === 0) {
          message = '请输入' + opt[key].name
          break
        } else if (val.length < opt[key].min) {
          message = `${opt[key].name}长度至少${opt[key].min}位`
          break
        } else if (val.length > opt[key].max) {
          message = `${opt[key].name}长度至多${opt[key].max}位`
          break
        }
      }
      if (message) {
        this.$message({
          type: 'warning',
          showClose: true,
          message
        })
        return message
      }
    },
    // 登入
    login () {
      if (this.checkText(['username', 'password'])) {
        return
      }
      api.login({
        username: this.username,
        password: this.password
      }).then(res => {
        this.$router.push({ name: 'HomePage' })
      })
    },
    // 注册
    register () {
      if (this.checkText(['username', 'password'])) {
        return
      }
      api.register({
        username: this.username,
        name: this.name,
        password: this.password
      }).then(res => {
        this.state = this.LOGIN
        this.$message({
          type: 'success',
          message: '注册成功'
        })
      })
    }
  }
}
</script>

<style lang="less">
.login-page {
  .bg {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background-color: #fdfdfd;
    z-index: -1;
  }
  input,
  button {
    &:focus {
      outline: none;
      // box-shadow: none;
    }
  }
  .title {
    margin: 30px auto 50px;
  }
  .main {
    max-width: 400px;
    margin: auto;
    padding: 40px 50px;
    background-color: #fff;
    border: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 2px;
  }
  .ipt-group {
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 1px;
    transition: border-color ease-in-out 0.15s;
    margin-bottom: 28px;
    &:focus {
      transition: border-color ease-in-out 0.15s;
    }
    input {
      width: 100%;
      padding: 10px 10px 8px 8px;
      border: 0;
      font-size: 16px;
      &:focus {
        outline: none;
      }
    }
  }
  .btn-group {
    width: 100%;
    button {
      width: inherit;
      padding-top: 11px;
      padding-bottom: 11px;
      font-size: 14px;
      line-height: 1;
      color: #fff;
      border-radius: 2px;
      background-color: #617fde;
      &:hover {
        background-color: #476ad8;
      }
    }
  }
  .other {
    padding-top: 35px;
    font-size: 14px;
    button.btn-link {
      font-size: inherit;
      color: #617fde;
      text-decoration: none;
      vertical-align: inherit;
      &:hover {
        color: #617fde;
      }
    }
  }
}
</style>

