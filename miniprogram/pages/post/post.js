// miniprogram/pages/post/post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: '',
    brokerage: '0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      image: options.image,
      brokerage: options.brokerage
    })
    console.log(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: '买课返现',
      path: 'pages/post/post'
    }
  },

  /**
   * 保存到手机
   */
  ontapDownload: function() {
    wx.cloud.downloadFile({
      fileID: this.data.image, // 文件 ID
      success: res => {
        // 返回临时文件路径
        console.log(res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '图片已保存到相册',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: console.error
    })
  }
})