/*
触发mutation调用间接更新状态的对象
 */
import {
  reqAddress,
  reqFoodTypes,
  reqShops,
  reqUser
} from '../api'
import {
  RECEIVE_ADDRESS,
  RECEIVE_TYPES,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
} from './mutation-types'
/*
使用async和await的作用:
  1. 使用同步编码的方式实现异步的效果
  2. 包装promise, 简洁化编码
用法
  1. 加await: 在返回promise对象的函数调用的左边
  2. 加async: 在await所在的函数定义的左边
 */
export default {

  // 异步获取地址
  async getAddress ({commit, state}) {
    const geohash = state.latitude + ',' + state.longitude
    // 发ajax请求获取数据
    const result = await reqAddress(geohash)
    // commit mutation接收数据
    commit(RECEIVE_ADDRESS, {address: result.data})
  },

  // 异步获取食物分类列表
  async getFoodTypes ({commit}, callback) {
    // 发ajax请求获取数据
    const result = await reqFoodTypes()
    // commit mutation接收数据
    commit(RECEIVE_TYPES, {foodTypes: result.data})
    callback && callback()
  },

  // 异步获取商家列表
  async getShops ({commit, state}) {
    const {latitude, longitude} = state
    // 发ajax请求获取数据
    const result = await reqShops({latitude, longitude})
    // commit mutation接收数据
    commit(RECEIVE_SHOPS, {shops: result.data})
  },

  // 保存userInfo
  recordUserInfo ({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo})
  },

  // 异步获取用户信息
  async getUserInfo ({commit}) {
    const result = await reqUser()
    if(result.code===0) {
      commit(RECEIVE_USER_INFO, {userInfo: result.data})
    }
  }
}