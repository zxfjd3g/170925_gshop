/*
直接操作state的对象
 */
import {
  RECEIVE_ADDRESS,
  RECEIVE_TYPES,
  RECEIVE_SHOPS
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
  }
}