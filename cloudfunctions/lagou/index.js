// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')
const {
  appid,
  secret
} = require('../config.js')
const {
  axios
} = require('../lib/index.js')
const COOKIE = `sensorsdata2015session=%7B%7D; _putrc=1D9F0019DE95B6A7; login=true; unick=%E5%BC%A0%E5%B9%BF%E4%B8%8A; privacyPolicyPopup=false; index_location_city=%E4%B8%8A%E6%B5%B7; user_trace_token=20200510133430-9753d9b2-b49d-4c4f-bbe0-118c352e6484; LGUID=20200510133430-24e574e0-e66b-4251-997e-fd13406bbafa; _ga=GA1.2.749180251.1589089061; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1589089061; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1589089061; LGRID=20200510133430-eba8a255-cc57-4648-b505-6d1334601e7e; kw_login_authToken="YkFYrZDSYjOrQ2CQQQzNyAhqv4S+61YPKlH0hhQTcvLKTjkMGC4r8d5mf2BFSOqhzK83lLpTf3t0OUUbys6RVgKHpG4Y/CY9SLYiUtN5Kk2RX9JkOsQt+hc/lwWduMBilsjuqFFiQkkCEdLEeDOfmvV1R7aHrF10mVpQQZVl3Gt4rucJXOpldXhUiavxhcCELWDotJ+bmNVwmAvQCptcy5e7czUcjiQC32Lco44BMYXrQ+AIOfEccJKHpj0vJ+ngq/27aqj1hWq8tEPFFjdnxMSfKgAnjbIEAX3F9CIW8BSiMHYmPBt7FDDY0CCVFICHr2dp5gQVGvhfbqg7VzvNsw=="; gate_login_token=b36cbeb2a0dfc0ee3da731baf7e2b02c5f991326abc7b648; X_HTTP_TOKEN=0eb5f279f9138a55094502985123c5e28c49e7dc1f; sensorsdata2015jssdkcross=%7B%22distinct_id%22%3A%227188564%22%2C%22%24device_id%22%3A%22171fc9a165542b-034f8a49aa95f-39687007-1296000-171fc9a1656126%22%2C%22props%22%3A%7B%22%24latest_traffic_source_type%22%3A%22%E7%9B%B4%E6%8E%A5%E6%B5%81%E9%87%8F%22%2C%22%24latest_referrer%22%3A%22%22%2C%22%24latest_referrer_host%22%3A%22%22%2C%22%24latest_search_keyword%22%3A%22%E6%9C%AA%E5%8F%96%E5%88%B0%E5%80%BC_%E7%9B%B4%E6%8E%A5%E6%89%93%E5%BC%80%22%2C%22%24os%22%3A%22iOS%22%2C%22%24browser%22%3A%22Safari%22%2C%22%24browser_version%22%3A%2213.0.3%22%7D%2C%22first_id%22%3A%22171fc9a165542b-034f8a49aa95f-39687007-1296000-171fc9a1656126%22%7D`;

const NICK_NAME = '张广上'

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  let result;

  switch (event.action) {
    case 'add_courses':
      const courses = await getCourses()
      result = await addCourses(courses)
      break;
    case 'updateDistributions':
      return updateDistributions()
  }



  console.log({
    event,
    result
  })

  return result
}

const getCourses = async function() {
  const {
    data
  } = await axios.get('https://kaiwu.lagou.com');

  const $ = cheerio.load(data);
  let courseList = [];
  $('script').each(function(index) {
    if (index === 2) {
      const window = {};
      const scriptText = $(this).html();
      // eslint-disable-next-line no-eval
      eval(scriptText);
      courseList = window.courseList;
    }
  });

  return courseList;
}

const addCourses = async courses => {
  const coursesStringify = JSON.stringify(courses).replace(/"/g, "\\\"")
  const {
    result: {
      access_token,
      errmsg
    }
  } = await cloud.callFunction({
    name: 'backendapi',
    data: {
      action: 'getAccessToken'
    }
  })

  if (errmsg) {
    return errmsg
  }


  const query = `db.collection("lagou_courses").add({data: ${coursesStringify}})`
  const {
    data
  } = await axios({
    method: 'post',
    url: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`,
    data: {
      env: "bytelab-dev-cnoaq",
      query,
    }
  })


  if (data.errcode === 0) {
    return data.id_list
  }

  return data.errmsg
}

async function updateDistributions() {
  const db = cloud.database()
  const res = await db.collection('lagou_courses').get() // 云函数默认返回100条记录


  const courses = res.data || []
  const distributions = await _getDistributions(courses)
  // http批量插入
  console.log('distributions', distributions)
  const result = await bulkCreate('lagou_distributions', distributions)

  return result

}

async function _getDistributions(courses) {
  const distributions = []
  for (let course of courses) {

    const distributionBaseInfo = await _getDistributionInfo(course);
    let distributionPosterData = {};

    if (distributionBaseInfo.showDistributionButton) {
      distributionPosterData = await _getDistributionPosterData(course)
    }

    distributions.push({
      courseId: course.id,
      decorateId: course.decorateId,
      showDistributionButton: distributionBaseInfo.showDistributionButton,
      ...distributionBaseInfo.distributionBaseInfoVo,
      ...distributionPosterData,
    });
  }

  return distributions
}

async function _getDistributionInfo(course) {
  const url = 'https://gate.lagou.com/v1/neirong/kaiwu/getDistributionInfo';
  const {
    id: courseId,
    decorateId
  } = course;

  const res = await axios({
    method: 'get',
    url: url,
    params: {
      courseId,
      decorateId
    },
    headers: {
      'x-l-req-header': '{deviceType:1}',
    }
  })


  return res.content || {}
}

async function _getDistributionPosterData(course) {
  const url =
    'https://gate.lagou.com/v1/neirong/course/distribution/getDistributionPosterData';
  const {
    id: courseId,
    decorateId
  } = course;

  const {
    content
  } = await axios({
    method: 'get',
    url: url,
    params: {
      courseId,
      decorateId
    },
    headers: {
      'x-l-req-header': '{deviceType:1}',
      cookie: COOKIE,
    },
  })

  if (content && content.nickName === NICK_NAME) {
    return content
  }

  console.log('获取分销数据错误,可能是cookie失效：nickName ' + content.nickName)
  return {}
}

// 工具函数

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