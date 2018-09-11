<template>
    <div>
        主页
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
        api.apiCurrent().then(res => {
            console.log(res)
            if (!res.data) this.$router.push({name: 'LoginPage'})
        })
    }
}
</script>

