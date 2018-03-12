/*
vue组件的mixin模块
 */
// 定义一个混入对象
export const ratingsMixin = {
  data () {
    return {
      selectType: 0,  // 0/1/2
      onlyContent: false  // false/true
    }
  },

  methods: {
    setSelectType (selectType) {
      this.selectType = selectType
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },

    toggleOnlyContent () {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },

  computed: {
    filterRatings () {
      // 取出相关的数据
      const ratings = this.ratings || this.food.ratings
      // 如果还没有数据, 直接返回空数组
      if(!ratings) {
        return []
      }
      const selectType = this.selectType // 0, 1, 2
      const onlyContent = this.onlyContent  // true/false
      // 通过数组的filter方法进行过滤
      return ratings.filter(rating => {
        var {rateType, text} = rating // 解构赋值
        // rateType 0/1
        // text 有值/没值

        // 条件1: selectType与rateType
        // selectType===2
        // selectType===rateType
        // selectType===2 || selectType===rateType


        // 条件2: onlyContent与text
        // !onlyContent
        // text.length>0
        // !onlyContent || text.length>0

        return (selectType===2 || selectType===rateType) && (!onlyContent || text.length>0)
      })
    }
  },
}