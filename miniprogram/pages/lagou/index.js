// pages/lagou/index.js
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
    distributionsTotal: 0,
    distributionCourses: [],
    courses: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    await this.getDistributionsTotal()
    await this.getDistributionCourses()
    await this.getCourses()
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
    this.getDistributionCourses()
  },

  // getCoursesTotal: async function() {
  //   try {
  //     const {
  //       total
  //     } = await db.collection('lagou_courses').count()
  //     this.setData({
  //       total: total
  //     })
  //   } catch (err) {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '查询记录失败'
  //     })
  //   }
  // },

  getDistributionsTotal: async function() {
    const res = await db.collection('lagou_distributions').count()

    if (res.total) {
      this.setData({
        distributionsTotal: res.total
      })
    } else {
      wx.showToast({
        icon: 'node',
        title: '查询失败',
      })
    }

  },

  getDistributionCourses: async function() {
    const {
      page,
      pageSize,
      distributionsTotal
    } = this.data
    const skip = page * pageSize

    if (skip >= distributionsTotal) return

    const res = await db.collection('lagou_distributions')
      .skip(skip)
      .limit(pageSize)
      .get()

    if (res.data) {
      this.setData({
        page: page + 1,
        distributionCourses: this.data.distributionCourses.concat(res.data)
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    }
  },

  getCourses: async function() {
    const distributionCourses = this.data.distributionCourses
    const courseIds = distributionCourses.map(course => course.courseId)
    const decorateIds = distributionCourses.map(course => course.decorateId)

    // TODO 这个查询条件好像不严谨
    const res = await db.collection('lagou_courses')
      .where({
        id: _.in(courseIds),
        decorateId: _.in(decorateIds)
      })
      .get()

    const data = res.data // 基本课程数据
    if (data) {
      const courseDatas = []
      // TODO 这里不严谨
      distributionCourses.forEach((item,index) => {
        courseDatas.push({
          ...item,
          ...data[index]
        })
      })
      this.setData({
        courses: this.data.courses.concat(courseDatas)
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      console.error('[数据库] [查询记录] 失败：', err)
    }

  }
})