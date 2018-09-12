<template>
	<div>
		主页
		<button @click="logout">退出</button>
	</div>
</template>
<script>
import api from '../api'
export default {
	data() {
		return {
			a: 123
		}
	},
	created() {
		api.currentUser().then(res => {
			console.log(res)
			if (!res.data) this.$router.push({ name: 'LoginPage' })
		})
	},
	methods: {
		// 退出
		logout() {
			api.logout()
			this.$router.push({ name: 'LoginPage' })
		}
	}
}
</script>

