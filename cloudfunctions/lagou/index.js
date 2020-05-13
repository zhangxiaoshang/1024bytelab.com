// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')
const {
  appid,
  secret,
  lagou_nickname,
  lagou_cookie
} = require('../config.js')
const {
  axios,
  bulkCreate
} = require('../lib/index.js')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async(event, context) => {
  switch (event.action) {
    case 'updateCourses':
      return updateCourses()
    case 'updateDistributions':
      return updateDistributions()
  }
}

async function updateCourses() {
  const courses = await _getCourses()

  return await bulkCreate('lagou_courses', courses)
}

async function updateDistributions() {
  const db = cloud.database()
  const res = await db.collection('lagou_courses').get() // 云函数默认返回100条记录
  const courses = res.data || []

  const distributions = await _getDistributions(courses)
  const result = await bulkCreate('lagou_distributions', distributions)

  return result

}

async function _getCourses() {
  const data = await axios.get('https://kaiwu.lagou.com');
  const $ = cheerio.load(data);
  let courseList = [];
  $('script').each(function(index) {
    if (index === 2) {
      const window = {};
      const scriptText = $(this).html();
      eval(scriptText);
      courseList = window.courseList;
    }
  });

  return courseList;
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
      cookie: lagou_cookie,
    },
  })

  if (content && content.nickName === lagou_nickname) {
    return content
  }

  console.info('获取分销数据错误,可能是cookie失效：nickName ' + content.nickName)
  return {}
}