<template>
  <div class="shop-info" ref="info">
    <div class="info-content">
      <div class="overview">
        <h1 class="title">{{info.name}}</h1>
        <div class="desc">
          <Star :score="info.score" :size="36"/>
          <span class="text">({{info.sellCount}})</span>
          <span class="text">月售单</span>
        </div>
        <ul class="remark">
          <li class="block"><h2>起送价</h2>
            <div class="content">
              <span class="stress">{{info.minPrice}}</span>元
            </div>
          </li>
          <li class="block"><h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{info.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block"><h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{info.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="iconfont icon-favorite" :class="{active: favorite}"></span>
          <span class="text">收藏</span>
        </div>
      </div>

      <Split></Split>

      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{info.bulletin}}</p>
        </div>
        <ul class="supports">
          <li class="support-item" v-for="support in info.supports">
            <span class="icon" :class="supportClasses[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>

      <Split></Split>

      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="pics">
          <ul class="pic-list" ref="ul">
            <li class="pic-item" v-for="pic in info.pics">
              <img width="120" height="90" :src="pic">
            </li>
          </ul>
        </div>
      </div>

      <Split></Split>

      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in info.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
  import BScroll from 'better-scroll'
  import { mapState } from 'vuex'
  import Star from '../../../components/Star/Star.vue'

  export default {
    data () {
      return {
        favorite: localStorage.getItem('favorite')==='true',
        supportClasses: ['decrease', 'discount', 'special', 'invoice', 'guarantee']
      }
    },

    // 此时info可能是一个空对象, 也可能是一个带数据的对象
    mounted () {
      this.$nextTick(() => {
        this.ratingsSroll = new BScroll(this.$refs.info, {click: true})
        this.picsScroll = new BScroll(this.$refs.pics, {click: true, scrollX: true})
        // 指定图片ul的样式宽度(前提是有数据)
        this.info.pics && this.setUlWidth()  // 从别的路由切换过来可以, 但在当前路由刷新不可以
      })
    },

    watch: {
      info () { // info状态数据更新了, 但界面还没有真正更新
        this.$nextTick(() => {
          this.ratingsSroll.refresh()
          this.setUlWidth()
          this.picsScroll.refresh()
        })
      }
    },

    computed: {
      ...mapState(['info'])
    },

    methods: {
      toggleFavorite () {
        this.favorite = !this.favorite
        // 保存状态
        localStorage.setItem('favorite', this.favorite)
      },

      /*
      设置包含多张图片的ul标签的宽度
       */
      setUlWidth () {
        const ul = this.$refs.ul
        const liWidth = 120
        const space = 6
        const size = this.info.pics.length
        ul.style.width = (liWidth + space) * size - space + 'px'
      }
    },

    components: {
      Star
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"

  .shop-info
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        font-size: 0
        .star
          display: inline-block
          margin-right: 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right: 12px
          line-height: 18px
          vertical-align: top
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        padding-top: 18px
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .favorite
        position: absolute
        width: 50px
        right: 11px
        top: 18px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          line-height: 24px
          font-size: 24px
          color: #d4d6d9
          &.active
            color: $green
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: $yellow
      .supports
        .support-item
          padding: 16px 12px
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 0
          &:last-child
            border-none()
        .icon
          display: inline-block
          width: 16px
          height: 16px
          vertical-align: top
          margin-right: 6px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.guarantee
            bg-image('guarantee_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
        .text
          line-height: 16px
          font-size: 12px
          color: rgb(7, 17, 27)
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        font-size: 14px
      .info-item
        padding: 16px 12px
        line-height: 16px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        font-size: 12px
        &:last-child
          border-none()
</style>
