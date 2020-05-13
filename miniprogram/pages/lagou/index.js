// pages/lagou/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 20,
    total: 0,
    courses: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    await this.getCoursesTotal()
    this.getCourses()
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

  onReachBottom: function() {
    this.getCourses()
  },

  getCoursesTotal: async function() {
    const db = wx.cloud.database()

    try {
      const {
        total
      } = await db.collection('lagou_courses').count()
      this.setData({
        total: total
      })
    } catch (err) {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
    }



  },

  getCourses: function() {
    const {
      page,
      pageSize,
      total
    } = this.data
    const skip = page * pageSize

    if (skip >= total) {
      console.log('done')
      return
    }

    const db = wx.cloud.database()
    db.collection('lagou_courses')
      .skip(page * pageSize)
      .limit(pageSize)
      .get({
        success: res => {
          this.setData({
            page: page + 1,
            courses: this.data.courses.concat(res.data)
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '查询记录失败'
          })
          console.error('[数据库] [查询记录] 失败：', err)
        }
      })
  }
})