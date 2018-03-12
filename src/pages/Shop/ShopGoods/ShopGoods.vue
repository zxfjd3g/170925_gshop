<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper">
        <ul>
          <!--current-->
          <li class="menu-item" v-for="(good, index) in goods"
              :key="index" :class="{current:index===currentIndex}" @click="selectCurrent(index)">
          <span class="text bottom-border-1px"><!---->
            <span class="icon" v-if="good.type>=0" :class="supportClasses[good.type]"></span>
            {{good.name}}
          </span>
          </li>
        </ul>
      </div>

      <div class="foods-wrapper">
        <ul ref="foodsWarpperUl">
          <li class="food-list food-list-hook" v-for="(good, index) in goods" :key="index">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods"
                  :key="index" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>

                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <CartControl :food="food"/>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>

      <ShopCart/>
    </div>

    <Food :food="selectedFood" ref="food"></Food>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import { mapState } from 'vuex'
  import CartControl from '../../../components/CartControl/CartControl.vue'
  import ShopCart from '../../../components/ShopCart/ShopCart.vue'
  import Food from '../../../components/Food/Food.vue'

  export default {

    data () {
      return {
        supportClasses: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
        scrollY: 0, //右侧Y轴滑动的坐标
        tops: [], // 包含右侧所有分类小列表的top值
        selectedFood: {}, //选择要显示的food
      }
    },

    mounted () {
      this.$store.dispatch('getShopGoods', () => {// goods更新了, 界面还没有更新
        this.$nextTick(() => {
          // 初始化滚动
          this._initScroll()
          // 初始化tops
          this._initTops()
        })
      })
    },

    computed: {
      ...mapState(['goods']),

      // 当前分类的下标
      currentIndex () { // findIndex(): 返回值是第个返回true所对应的index
        const {scrollY, tops} = this
        // scrollY要>=当前的top && 小于下一个top
        return tops.findIndex((top, index) => scrollY>=top && scrollY<tops[index+1])
      }
    },

    methods: {
      _initScroll () {
        // 左侧分类列表的BScroll
        new BScroll('.menu-wrapper',{
            click: true //响应点击
        })
        // 右侧food列表的BScroll
        this.foodsScroll = new BScroll('.foods-wrapper',{
          probeType: 2, // 手指滑动(惯性滑动和编码滑动不监视)
          click: true //响应点击
        })

        // 监视滑动过程
        this.foodsScroll.on('scroll', (pos) => {
          console.log(pos.y)
          // 保存y
          this.scrollY = Math.abs(pos.y)
        })
        // 监视滑动结束
        this.foodsScroll.on('scrollEnd',(pos) => {
          console.log('滑动结束', pos.y)
          this.scrollY = Math.abs(pos.y)  // 解决惯性滑动更新
        })
      },

      _initTops () {
        const tops = []
        let top = 0
        // 计算各个 top, 并保存到tops
        tops.push(top)
        
        // 得到ul下所有的子li
        const lis = this.$refs.foodsWarpperUl.getElementsByClassName('food-list-hook')
        Array.prototype.slice.call(lis).forEach((li, index) => {
          top += li.clientHeight
          tops.push(top)
        })
        // 保存tops
        this.tops = tops
        console.log(this.tops)
      },

      // 选择当前分类
      selectCurrent (index) {
        console.log('selectCurrent()')
        // 得到滚动目标坐标
        const top = this.tops[index]
        // 更新目标scrollY值
        this.scrollY = top
        // 平滑滚动到指定位置
        this.foodsScroll.scrollTo(0, -top, 300)
      },

      // 显示指定food
      showFood (food) {
        // 保存food
        this.selectedFood = food
        // 显示food
        this.$refs.food.showOrHide(true)  // 父组件中调用子组件的方法
      }
    },

    components: {
      CartControl,
      ShopCart,
      Food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 66px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        margin-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
