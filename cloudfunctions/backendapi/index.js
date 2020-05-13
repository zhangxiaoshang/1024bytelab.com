// 云函数入口文件
const cloud = require('wx-server-sdk')
// const axios = require('axios')
const {
  axios
} = require('../lib')
const {
  appid,
  secret
} = require('../config.js')


cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  console.log('event', event)

  switch (event.action) {
    case 'getAccessToken':
      {
        return getAccessToken()
      }

    default:
      {
        return
      }
  }
}

async function getAccessToken() {
  const res = await  axios({
    method: 'get',
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    params: {
      grant_type: 'client_credential',
      appid,
      secret
    }
  })


  return res.access_token
}