/*
直接操作state的对象
 */
import Vue from 'vue'
import {
  RECEIVE_ADDRESS,
  RECEIVE_TYPES,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RECEIVE_INFO,
  RECEIVE_GOODS,
  RECEIVE_RATINGS,
  INCREMENT_FOOD_COUNT,
  DECREMENT_FOOD_COUNT,
  CLEAR_CART
} from './mutation-types'

export default {
  [RECEIVE_ADDRESS](state, {address}) {
    state.address = address
  },

  [RECEIVE_TYPES](state, {foodTypes}) {
    state.foodTypes = foodTypes
  },

  [RECEIVE_SHOPS](state, {shops}) {
    state.shops = shops
  },
  [RECEIVE_USER_INFO](state, {userInfo}) {
    state.userInfo = userInfo
  },
  [RECEIVE_INFO](state, {info}) {
    state.info = info
  },

  [RECEIVE_RATINGS](state, {ratings}) {
    state.ratings = ratings
  },

  [RECEIVE_GOODS](state, {goods}) {
    state.goods = goods
  },

  [INCREMENT_FOOD_COUNT](state, {food}) {
    if(!food.count) { // 第一次增加时, 没有count
      // food.count = 1 // 添加count属性, 并指定为1
      // 问题: 新添加的属性没有数据劫持==>数据绑定==>更新了数据但界面不变
      Vue.set(food, 'count', 1) // 给有数据绑定的对象添加指定属性名和值的属性(有绑定)
      state.shopCart.push(food) // 添加到购物车
    } else { // 有count
      food.count++
    }
  },
  [DECREMENT_FOOD_COUNT](state, {food}) {
    if(food.count) { // count有值才减1
      food.count--
      if(food.count===0) {// 如果数量减为0, 从购物车中移除
        state.shopCart.splice(state.shopCart.indexOf(food), 1)
      }
    }
  },
  [CLEAR_CART](state) {
    // 将shopCart中所有food的count置为0
    state.shopCart.forEach(food => food.count = 0)
    // 将shopCart置为空数组
    state.shopCart = []
  }
}