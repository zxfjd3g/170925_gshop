/*
使用mockjs提供mock接口
 */
import Mock from 'mockjs'

import data from './data.json'  // js对象

// 向外提供goods数据
Mock.mock('/goods', {code: 0, data: data.goods})  // {code: 0, data: goods数据}
// 向外提供ratings数据
Mock.mock('/ratings', {code: 0, data: data.ratings})  // {code: 0, data: ratings数据}
// 向外提供info数据
Mock.mock('/info', {code: 0, data: data.info})  // {code: 0, data: info数据}

// export default ???  没有需要暴露的东西
