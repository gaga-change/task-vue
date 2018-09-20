import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/components/HomePage'
import LoginPage from '@/components/LoginPage'
import ListPage from '@/components/ListPage'
import TaskPage from '@/components/TaskPage'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'HomePage',
    component: HomePage,
    children: [{
      path: '/list/:listId',
      name: 'ListPage',
      component: ListPage,
      children: [{
        path: ':taskId',
        name: 'TaskPage',
        component: TaskPage
      }]
    }]
  }, {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  }]
})
