const cloud = require('wx-server-sdk')
const axios = require('./axios.js')

cloud.init()

// 批量插入数据
async function bulkCreate(collectionName, arr) {
  const arrStringify = JSON.stringify(arr).replace(/"/g, "\\\"")
  const { result: access_token } = await cloud.callFunction({
    name: 'backendapi',
    data: {
      action: 'getAccessToken'
    }
  })

  const query = `db.collection("${collectionName}").add({data: ${arrStringify}})`

  const res = await axios({
    method: 'post',
    url: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`,
    data: {
      env: "bytelab-dev-cnoaq",
      query,
    }
  })


  return res
}

module.exports = bulkCreate