import Vue from 'vue'
import VueRouter from 'vue-router'

/*import Msite from '../pages/Msite/Msite.vue'
import Order from '../pages/Order/Order.vue'
import Profile from '../pages/Profile/Profile.vue'
import Search from '../pages/Search/Search.vue'*/
import Login from '../pages/Login/Login.vue'
import Shop from '../pages/Shop/Shop.vue'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings.vue'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods.vue'

const Msite = () => import('../pages/Msite/Msite.vue')
const Profile = () => import('../pages/Profile/Profile.vue')
const Order = () => import('../pages/Order/Order.vue')
const Search = () => import('../pages/Search/Search.vue')

Vue.use(VueRouter)

// 向外暴露vuerouter对象
export default new VueRouter({
  routes: [
    {
      path: '/msite',
      component: Msite,
      meta: {
        showFooter: true // 需要显示底部组件
      }
    },
    {
      path: '/order',
      component: Order,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/search',
      component: Search,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      redirect: '/msite'
    },
    {
      path: '/shop',
      component: Shop,
      children: [
        {
          path: '/shop/goods',
          component: ShopGoods
        },
        {
          path: '/shop/ratings',
          component: ShopRatings
        },
        {
          path: '/shop/info',
          component: ShopInfo
        },
        {
          path: '', // 请求的: /shop
          redirect: '/shop/goods'
        },
      ]
    },
  ]
})