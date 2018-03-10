import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 引入加载mockServer
import './mock/MockServer' // 后面就可以访问内部定义好的接口

new Vue({
  el: '#app',
  render: h => h(App),
  router, // 结果所有组件多了2个属性: $route/$router
  store  // 所有的组件都多了一个属性: $store
})
