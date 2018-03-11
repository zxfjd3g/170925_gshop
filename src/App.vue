<template>
  <div id="app">
    <!--显示当前路由组件-->
    <router-view></router-view>
    <FooterGuide v-show="$route.meta.showFooter"/>
  </div>
</template>

<script>
  import FooterGuide from './components/FooterGuide/FooterGuide.vue'

  export default {
    components: {
      FooterGuide
    },

    mounted () {
      /*console.log(this) // 组件对象
      console.log(this.$router)  // 路由器对象
      console.log(this.$route)  // 当前路由对象*/
      // 通知action获取地址信息
      this.$store.dispatch('getAddress')
      // 通知action获取用户信息
      this.$store.dispatch('getUserInfo')
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  #app
    width 100%
    height 100%
    position relative
</style>
