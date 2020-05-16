// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')

const appid = "wx12639acd965bfb76"
const secret = "6309ecdb8a1f29ac7626941b863c7870"


cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
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
  const {
    data
  } = await axios({
    method: 'get',
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    params: {
      grant_type: 'client_credential',
      appid,
      secret
    }
  })


  return data.access_token
}