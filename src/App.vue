<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
#app,
body,
html {
  height: 100%;
}
.el-message {
  top: unset;
  bottom: 20px;
}

.el-scrollbar__wrap {
  overflow-x: hidden;
}

.el-message-fade-enter,
.el-message-fade-leave-active {
  opacity: 0;
  -webkit-transform: translate(-50%, 100%);
  transform: translate(-50%, 100%);
}
</style>

