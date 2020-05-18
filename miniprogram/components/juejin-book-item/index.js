// components/juejin-book-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    book: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickBuy: function(event) {
      const title = event.currentTarget.dataset.title
      const image = event.currentTarget.dataset.image
      const brokerage = event.currentTarget.dataset.brokerage


      this.triggerEvent('onclickBuy', {
        title,
        image,
        brokerage
      }, null)
    }
  }
})