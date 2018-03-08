import Vue from 'vue'
import App from './App'
import router from './router'

new Vue({
  el: '#app',
  render: h => h(App),
  router // 结果所有路由组件多了2个属性: $route/$router
})
