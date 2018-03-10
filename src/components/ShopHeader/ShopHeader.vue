<template>
  <div>
    {{info}}
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    computed: {
      ...mapState(['info'])
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>