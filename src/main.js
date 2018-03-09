import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

new Vue({
  el: '#app',
  render: h => h(App),
  router, // 结果所有组件多了2个属性: $route/$router
  store  // 所有的组件都多了一个属性: $store
})
