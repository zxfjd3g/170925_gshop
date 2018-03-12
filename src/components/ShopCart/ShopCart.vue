<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount>0}">
              <i class="iconfont icon-shopping_cart" :class="{highlight: totalCount>0}"></i></div>
            <div class="num" v-if="totalCount">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight: totalCount>0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{info.deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div class="pay" :class="payClass">
            {{payText}}
          </div>
        </div>
      </div>

      <div class="ball-container">
        <transition @before-enter="beforeDrop"
                    @enter="dropping"
                    @after-enter="afterDrop"
                    :css="false"
                    v-for="(ball,index) in balls"
                    :key="index">
          <div class="ball"  v-show="ball.isShow">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>

      <transition name="move">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <!--<span class="empty" @click="clearCart">清空</span>-->
            <mt-button class="empty" @click.native="clearCart">清空</mt-button>
          </div>
          <div class="list-content" id="listContent">
            <ul >
              <li class="food" v-for="(food, index) in shopCart" :key="index">
                <span class="name">{{food.name}}</span>
                <div class="price"><span >￥{{food.price}}</span></div>
                <div class="cartcontrol-wrapper">
                  <CartControl :food="food"/>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>

    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleShow"></div>
    </transition>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js'
  import { MessageBox, Toast } from 'mint-ui';
  import BScroll from 'better-scroll'
  import { mapState, mapGetters } from 'vuex'
  import CartControl from '../CartControl/CartControl.vue'

  export default {

    data () {
      return {
        isShow: false,
        balls: [
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false}
        ],
        droppingBalls: [] // 保存多个待执行动画的ball
      }
    },

    computed: {
      ...mapState(['info', 'shopCart']),
      ...mapGetters(['totalCount', 'totalPrice']),

      payClass () {
        const {totalPrice} = this
        const {minPrice} = this.info
        return totalPrice>=minPrice ? 'enough' : 'not-enough'
      },

      payText () {
        const {totalPrice} = this
        const {minPrice} = this.info
        if(totalPrice===0) {
          return `￥${minPrice}元起送`
        } else if(totalPrice<minPrice) {
          return `还差￥${minPrice-totalPrice}元起送`
        } else {
          return '去结算'
        }
      },

      // 购物车列表是否显示
      listShow () {
        // 如果没有数量, 直接不显示
        if(this.totalCount===0) {
          // 将isShow改为false
          this.isShow = false
          return false
        }

        if(this.isShow) { // 变为打开
          this.$nextTick(() => {
            // 在界面更新后创建BScroll(只能创建一个)

            /*
            单例:
              1. 在创建前, 判断是否存在,只有不存在, 才去创建
              2. 创建后, 保存它
             */
            if(!this.scroll) { // 第一次打开
              this.scroll = new BScroll('#listContent', {
                click: true
              })
            } else {// 后面打开
              // 通知scroll对象
              this.scroll.refresh()
            }
          })
        }

        // 只需要看isShow
        return this.isShow
      }
    },

    mounted () {
      // 订阅显示小球的消息
      PubSub.subscribe('showBall', (message, startEl) => {
        // 显示小球
        this.showBall(startEl)
      })
    },

    methods: {
      toggleShow () {
        if(this.totalCount) { // 只有有数量时切换
          this.isShow = !this.isShow
        }
      },

      // 清空购物车
      clearCart () {
        /*if(window.confirm('确定清空购物车吗?')) {
          this.$store.dispatch('clearCart')
        }*/

        MessageBox.confirm('确定清空购物车吗?').then(
          (action) => {
            console.log('确定', action)
            this.$store.dispatch('clearCart')
            Toast({
              message: '清空购物车成功',
              position: 'bottom',
              duration: 1000
            });
          },
          (action) => {
            console.log('取消', action)
          }
        )
      },

      //启动一个小球动画
      showBall(startEl) {
        // 找到一个隐藏的小球元素, 让它显示出来, 并动画
        // 从balls中找出isshow为falSE的ball
        const ball = this.balls.find(ball =>!ball.isShow)
        // 只有找到, 才做动画
        if(ball) {
          ball.isShow = true
          ball.startEl = startEl // 保存对应的起始位置的元素
          this.droppingBalls.push(ball) // 把启动动画的ball保存起来
        }
      },

      // 动画开始之前: 将小球瞬间移动到动画的起始位置(点击位置)
      beforeDrop(el) {
        console.log('beforeDrop()')
        var offsetX = 0
        var offsetY = 0

        // 取出第一个待启动动画的ball
        const ball = this.droppingBalls.shift()
        // 找到点击的startEl
        var startEl = ball.startEl
        // 得到起始位置的坐标
        const {left, top} = startEl.getBoundingClientRect()
        // 得劲原始位置的坐标
        const elLeft = 32
        const elBottom = 22
        // 算出偏移量
        offsetX = left-elLeft
        offsetY = -(window.innerHeight-top-elBottom)

        // 瞬间移动动画起始的位置
        el.style.transform = `translate3d(0, ${offsetY}px, 0)`
        const innerEl = el.children[0]
        innerEl.style.transform = `translate3d(${offsetX}px, 0, 0)`

        // 保存ball
        el.ball = ball
      },

      // 动画开始时: 指定动画结束的位置
      dropping(el) {
        console.log('dropping()')
        //强制页面重排/重绘(否则动画瞬间完成, 没有效果)
        const rf = el.offsetHeight

        this.$nextTick(() => {
          el.style.transform = `translate3d(0, 0, 0)`
          const innerEl = el.children[0]
          innerEl.style.transform = `translate3d(0, 0, 0)`
        })
      },

      // 动画完成之后: 做一些收尾的工作
      // 问题: 在动画生命周期回调函数中更新状态, 页面不变化   2.0没有
      afterDrop(el) {
        console.log('afterDrop()')
        // 找到对应的ball
        const ball = el.ball
        // 延迟到动画结束时才去隐藏ball
        setTimeout(() => {
          ball.isShow = false  // 立即起效
        }, 400)
      }
    },

    components: {
      CartControl
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: $green
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #ffffff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $green
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform translateY(-100%)
      &.move-enter-active, &.move-leave-active
        transition transform .5s
      &.move-enter, &.move-leave-to
        transform translateY(0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
</style>
