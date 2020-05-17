// pages/juejin/juejin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    image: '1',
    showPopup: false,
    book: {
      "_id": "5cc98974f265da03a54c2b37",
      "section": ["5d785906f265da03af19fdb5", "5d70cdc3e51d453bc470df3d", "5d70d0a0f265da03b81080dd", "5d70d0bd518825643a10c4cc", "5d2d84e8e51d45109b01b242", "5d2de9d96fb9a07eee5f012d", "5d30135e6fb9a07f0b03f8fc", "5d54a369518825371070e452", "5d55043c5188250dd37b51f4", "5d5a08725188253abd7e9bbb", "5d5b9b725188252231108c64", "5d7efe8e6fb9a06acf2b8b32", "5d7efeb76fb9a06adb8012d6", "5d5e8da251882556ee6de083", "5d5fae945188256332721e1f", "5d667dbef265da03de3b1457", "5d68ba13e51d45620d2cb931", "5d68c459e51d4557ca7fdd79", "5d6cd0246fb9a06ae3727a92", "5d6fcfe9f265da03de3b2203", "5d7efa3f6fb9a06aef091b2a", "5d7efb285188250b055dd0eb"],
      "desc": "来来来，你什么都不用会，真正的从零蛋开始系统又轻松地学习MySQL。",
      "user": "5bff96c6e51d45452f2d6f95",
      "price": 19.9,
      "title": "MySQL 是怎样使用的：从零蛋开始学习 MySQL",
      "buyCount": 2123,
      "viewCount": 0,
      "contentSize": 238132,
      "img": "https://user-gold-cdn.xitu.io/2019/9/25/16d67c7db5fc6421?w=1950&h=2730&f=png&s=613110",
      "category": "5562b419e4b00c57d9b94ae2",
      "tags": ["555e9a8de4b00c57d9955eb9"],
      "createdAt": "2019-09-19T11:23:56.869Z",
      "updatedAt": "2019-12-17T02:33:34.820Z",
      "finishedAt": "2019-10-08",
      "isFinished": true,
      "isDeleted": false,
      "isHot": false,
      "isPublish": 2,
      "isShow": true,
      "profile": "公众号「我们都是小青蛙」作者，专注将复杂概念简单化。",
      "lastSectionCount": 22,
      "pv": 66900,
      "wechatSignal": "mysql0822",
      "wechatImg": "https://user-gold-cdn.xitu.io/1585108762809626f9d08bd3e12b1c198accea1cafdc0.jpg",
      "wechatImgDesc": "小册八姐",
      "isTop": true,
      "url": "https://user-gold-cdn.xitu.io/1569475419316cee4de4ad6faf1f48943b84aa2fc2f6e.jpg",
      "navId": ["50"],
      "isEditor": false,
      "isBuy": false,
      "readLog": {
        "sectionId": "",
        "sign": ""
      },
      "userData": {
        "role": "guest",
        "username": "小孩子4919",
        "selfDescription": "喜欢把复杂的事情说简单",
        "jobTitle": "后端工程师 | 公众号 「我们都是小青蛙」作者",
        "company": "",
        "avatarHd": "https://mirror-gold-cdn.xitu.io/168e096b62f70298fbd",
        "avatarLarge": "https://mirror-gold-cdn.xitu.io/168e096b62f70298fbd",
        "mobilePhoneVerified": true,
        "isAuthor": "",
        "isXiaoceAuthor": "1",
        "bookletCount": 2,
        "objectId": "5bff96c6e51d45452f2d6f95",
        "uid": "5bff96c6e51d45452f2d6f95",
        "level": 3
      },
      "id": "5cc98974f265da03a54c2b37"
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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

  },

  onChangeType(event) {
    wx.showToast({
      title: `切换到标签 ${event.detail.name}`,
      icon: 'none',
    });

    this.setData({
      type: event.detail.name
    })
  },

  /**
   * 展示邀请海报
   */
  showImage: function(event) {
    const image = event.detail
    this.setData({
      image: '../../images/000.png',
      showPopup: true
    })
  },

  onClose: function() {
    this.setData({
      showPopup: false
    })
  }
})