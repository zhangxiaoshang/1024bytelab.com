// pages/lagou/index.js
const dayjs = require('dayjs')
const app = getApp()
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pageSize: 20,
    total: 0,
    courses: [],
    lastSyncTime: '',
    brokerage: 0,
    showActionSheet: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    await this.getCoursesTotal()
    await this.getCourses()
    await this.getLastSyncTime()
  },

  onReachBottom: function() {
    this.getCourses()
  },

  getCoursesTotal: async function() {
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
        title: '查询失败'
      })
    }
  },

  getCourses: async function() {
    const {
      page,
      pageSize,
      total
    } = this.data
    const skip = page * pageSize

    if (skip >= total) return

    const {
      data
    } = await db.collection('lagou_courses')
      .where({
        showDistributionButton: true
      })
      .orderBy('id', 'desc')
      .skip(page * pageSize)
      .limit(pageSize)
      .get()

    this.setData({
      page: page + 1,
      courses: this.data.courses.concat(data)
    })
  },

  getLastSyncTime: async function() {
    const {data} = await db.collection('sync_db_log').doc('lagou_courses').get()
    console.log(data.at)
    if (data) {
      this.setData ({
        lastSyncTime: dayjs(data.at).format('YYYY-MM-DD HH:mm:ss')
      })
    }
  },

  onCopyLink: async function (e) {

    this.setData({
      brokerage: e.detail,
      showActionSheet: true
    })
  },

  onClose: function() {
    this.setData({
      showActionSheet: false
    })
  }
})