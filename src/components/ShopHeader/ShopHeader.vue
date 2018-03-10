<template>
  <div class="shop-header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="info.avatar">
        <div class="back" @click="$router.back()">
          <i class="iconfont icon-arrow_left"></i>
        </div>
      </div>

      <div class="content">
        <div class="title"><span class="brand"></span> <span
          class="name">{{info.name}}</span>
        </div>
        <div class="description">{{info.description}}/{{info.deliveryTime}}分钟送达</div>
        <div class="supports" v-if="info.supports">
          <span class="icon" :class="supportclasses[info.supports[0].type]"></span>
          <span class="text">{{info.supports[0].description}}</span>
        </div>
        <div class="supports-count" v-if="info.supports" @click="toggleShow">
          <span class="count">{{info.supports.length}}个</span>
          <span class="iconfont icon-keyboard_arrow_right"></span>
        </div>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="toggleShow">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{info.bulletin}}</span>
      <span class="iconfont icon-keyboard_arrow_right"></span>
    </div>
    <div class="bg">
      <img :src="info.avatar">
    </div>
    <transition name="fade">
      <div class="mask" v-show="isShow">
        <div class="mask-wrapper">
          <div class="mask-main"><h1>{{info.name}}</h1>
            <div class="stars-wrapper">
              <Star :score="info.score" :size="48"/>
            </div>
            <div class="info">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <ul class="list">
              <li v-for="(support, index) in info.supports" :key="index">
                <span class="iocn" :class="supportclasses[support.type]"></span>
                <span>{{support.description}}</span>
              </li>
            </ul>
            <div class="info">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="context">
              <p class="text">{{info.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="mask-footer" @click="toggleShow">
          <span class="iconfont icon-close"></span>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Star from '../Star/Star.vue'

  export default {

    data () {
      return {
        supportclasses: ['decrease', 'discount', 'guarantee', 'invoice', 'special'],
        isShow: false // 是否显示活动详情
      }
    },
    computed: {
      ...mapState(['info'])
    },

    methods: {
      toggleShow () {
        this.isShow = !this.isShow
      }
    },

    components: {
      Star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .shop-header
    height 100%
    position relative
    background-color rgba(7, 17, 27, 0.5)
    color #fff
    overflow hidden
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      overflow hidden
      .avatar
        float left
        width 64px
        height 64px
        img
          width 100%
          height 100%
          border-radius 2px
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_left
            display: block
            padding: 5px
            font-size: 20px
            color: #fff
      .content
        float left
        margin-left 16px
        .title
          margin-top 2px
          margin-bottom 8px
          .brand
            display inline-block
            vertical-align middle
            width 30px
            height 18px
            background-size 30px 18px
            background-repeat no-repeat
            bg-image(brand)

          .name
            margin-left 6px
            font-size 16px
            line-height 18px
            font-weight bold
        .description
          font-size 12px
          line-height 12px
          font-weight 200
        .supports
          margin-top 10px
          margin-bottom 2px
          .icon
            display inline-block
            vertical-align middle
            width 12px
            height 12px
            background-repeat no-repeat
            background-size 12px 12px
            &.decrease
              bg-image(decrease_1)
            &.discount
              bg-image(discount_1)
            &.guarantee
              bg-image(guarantee_1)
            &.invoice
              bg-image(invoice_1)
            &.special
              bg-image(special_1)

          .text
            font-size 10px
            line-height 12px
            font-weight 200
        .supports-count
          position absolute
          right 12px
          bottom 18px
          background: rgba(0, 0, 0, 0.2);
          border-radius 8px
          padding 7px 8px
          height 24px
          box-sizing border-box
          line-height 10px
          font-size 10px
          font-weight 200
          .count
            margin-right 2px

    .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      background-color rgba(7, 17, 27, 0.2)
      padding 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      .bulletin-title
        display inline-block
        vertical-align middle
        width 22px
        height 12px
        background-repeat no-repeat
        background-size 100% 100%
        bg-image(bulletin)

      .bulletin-text
        margin 0 4px
        font-size 10px
        font-weight 200
      .icon-keyboard_arrow_right
        position absolute
        right 7px
    .bg
      position absolute
      top: 0
      left 0
      width 100%
      height 100%
      z-index -1
      img
        width 100%
        height 100%
        filter blur(10px)

    .mask
      z-index 100
      position fixed
      top: 0
      left 0
      width 100%
      height 100%
      background-color rgba(7, 17, 27, 0.8)
      &.fade-enter-active, &.fade-leave-active
        transition opacity .5s
      &.fade-enter, &.fade-leave-to
        opacity 0
      .mask-wrapper
        min-height 100%
        .mask-main
          padding 64px 36px 32px
          & > h1
            font-size 16px
            line-height 16px
            font-weight 700
            text-align center
            margin-bottom 16px
          .stars-wrapper
            height 24px

          .info
            margin-top 28px
            margin-bottom 24px
            overflow hidden
            .line
              float left
              width 112px
              height 2px
              background: rgba(255, 255, 255, 0.2);
              margin-top 6px
            .text
              float left
              font-size 14px
              font-weight 700
              line-height 14px
              margin 0 11px

          .list
            padding 0 12px
            & > li
              height 16px
              margin-bottom 12px
              .iocn
                display inline-block
                vertical-align middle
                width 16px
                height 16px
                background-repeat no-repeat
                background-size 100% 100%
                &.decrease
                  bg-image(decrease_2)
                &.discount
                  bg-image(discount_2)
                &.guarantee
                  bg-image(guarantee_2)
                &.invoice
                  bg-image(invoice_2)
                &.special
                  bg-image(special_2)
              & > span
                margin-left 6px
                font-size 12px
                line-height 12px
                font-weight 200
          .context
            padding 0 12px
            .text
              font-size 12px
              line-height 24px
              font-weight 200

      .mask-footer
        margin-top -64px
        text-align center
        span
          font-size 32px
          color rgba(255, 255, 255, 0.5)

</style>
