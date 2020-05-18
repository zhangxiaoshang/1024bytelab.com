// pages/juejin/juejin.js
const db = wx.cloud.database()
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    page: 0,
    pageSize: 10,
    total: 0,
    books: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    await this._getBooksTotal()
    await this._getBooks()
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this._getBooks()
  },


  /**
   * 打开海报页
   */
  onclickBuy: function(event) {
    const {
      title,
      image,
      brokerage
    } = event.detail

    wx.navigateTo({
      url: `/pages/post/post?image=${image}&brokerage=${brokerage}&title=${title}`,
    })
  },

  onClose: function() {
    this.setData({
      showPopup: false
    })
  },

  _getBooksTotal: async function() {
    try {
      const {
        total
      } = await db.collection('juejin_books').count()

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

  _getBooks: async function() {
    const {
      page,
      pageSize,
      total
    } = this.data
    const skip = page * pageSize
    if (skip >= total) {
      return
    }

    const {
      data
    } = await db.collection('juejin_books')
      .where({
        brokerage: _.exists(true),
      })
      .orderBy('createdAt', 'desc')
      .skip(page * pageSize)
      .limit(pageSize)
      .get()


    this.setData({
      page: page + 1,
      books: this.data.books.concat(this._addImageUrl(data))
    })
  },

  _addImageUrl: function(books) {
    const bookImagePrefix = "cloud://bytelab-dev-cnoaq.6279-bytelab-dev-cnoaq-1302105421/jujin-books/books/"
    const postImagePrefix = "cloud://bytelab-dev-cnoaq.6279-bytelab-dev-cnoaq-1302105421/jujin-books/posts/"
    return books.map(book => {
      book.bookImage = `${bookImagePrefix}${book._id}.png`
      book.postImage = `${postImagePrefix}${book._id}.png`

      return book
    })
  }
})