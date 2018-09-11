<template>
    <div>
        <h2>{{state === LOGIN ? '登入':'注册'}}</h2>
        <label>
            <span>用户名</span>
            <input type="text" v-model="username">
        </label>
        <label v-if="state === REGISTER">
            <span>昵称</span>
            <input type="text" v-model="name">
        </label>
        <label>
            <span>密码</span>
            <input type="text" v-model="password">
        </label>
        <div>
            <button v-if="state === LOGIN" @click="login">登入</button>
            <button v-else @click="register">注册</button>
        </div>
        <div>
        <a v-if="state === LOGIN" href="JavaScript:void(0)" @click="state=REGISTER">去注册</a>
        <a v-else href="JavaScript:void(0)" @click="state=LOGIN">去登入</a>
        </div>
    </div>
</template>

<script>
import api from '../api'
export default {
    data() {
        return {
            LOGIN: 1,
            REGISTER: 2,
            state: null,
            username: '',
            password: '',
            name: ''
        }
    },
    created() {
        this.state = this.LOGIN
    },
    methods: {
        // 登入
        login() {
            api.apiLogin({
                username: this.username,
                password: this.password
            }).then(res => {
                this.$router.push({name: 'HomePage'})
            }).catch(() => {
                alert('用户名或密码错误')
            })
        },
        // 注册
        register() {
            api.apiRegister({
                username: this.username,
                name: this.name,
                password: this.password
            }).then(res => {
                this.state = this.LOGIN
                alert('注册成功')
            }).catch(() => {
                alert('用户名已存在')
            })
        }
    }
}
</script>

