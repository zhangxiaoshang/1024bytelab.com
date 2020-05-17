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
      console.log(event)
      const image = event.currentTarget.dataset.image
      this.triggerEvent('onclick', image, null)
    }
  }
})