// components/lagou-course-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
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
    handleCopy(event) {
      const {
        currentTarget: {
          dataset: {
            text,
            brokerage
          }
        }
      } = event
      wx.setClipboardData({
        data: text,
        success: (res)=> {
          this.triggerEvent('onCopyLink', brokerage, null)
          // setTimeout(() => {
          //   wx.showModal({
          //     showCancel: false,
          //     content: `使用浏览器粘贴并打开链接,完成购买后联系微信：bolingboling 获取返现红包${brokerage}元`,
          //     success(res) {
          //       if (res.confirm) {
          //         console.log('用户点击确定')
          //       } else if (res.cancel) {
          //         console.log('用户点击取消')
          //       }
          //     }
          //   })
          // }, 1500)

        }
      })
    }
  }
})