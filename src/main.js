import Vue from 'vue'
import VueLazyload from 'vue-lazyload'
import {Button} from 'mint-ui'
import loading from './common/images/loading.gif'
import App from './App'
import router from './router'
import store from './store'
// 引入加载mockServer
import './mock/MockServer' // 后面就可以访问内部定义好的接口
// 引入加载filter
import './filters'
import Split from './components/Split/Split.vue'
// 注册全局组件标签
Vue.component('Split', Split)  // 全局可用(所有的组件都可以直接写此标签)
Vue.component(Button.name, Button)   // mt-button

Vue.use(VueLazyload, {  // 内部会定义一个全局指令: lazy
  loading,
})

new Vue({
  el: '#app',
  render: h => h(App),
  router, // 结果所有组件多了2个属性: $route/$router
  store  // 所有的组件都多了一个属性: $store
})
