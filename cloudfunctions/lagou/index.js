// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')
const {
  appid,
  secret,
  lagou_nickname,
  lagou_cookie
} = require('./config.js')
const axios = require('./lib/axios.js')
const bulkCreate = require('./lib/bulkCreate.js')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  switch (event.action) {
    case 'initCourses':
      return initCourses()
      default:
      return console.info('action 未定义')
  }
}

async function initCourses() {
  let courses = await _getCourses()
  courses = await _insertDistributionData(courses)
  console.log(courses)

  return await bulkCreate('lagou_courses', courses)
}

// 课程添加分销数据
async function _insertDistributionData(courses) {
  const newCourses = []
  for (const course of courses) {
    const { showDistributionButton, distributionBaseInfoVo } = await _getDistributionBaseInfo(course);
    course.distributionBaseInfoVo = distributionBaseInfoVo
    course.showDistributionButton = showDistributionButton

    if (showDistributionButton) {
      course.distributionDetail = await _getDistributionDetailData(course)
    }

    newCourses.push(course)
  }

  return newCourses
}

// 所有课程
async function _getCourses() {
  const data = await axios.get('https://kaiwu.lagou.com');
  const $ = cheerio.load(data);
  let courseList = [];
  $('script').each(function (index) {
    if (index === 2) {
      const window = {};
      const scriptText = $(this).html();
      eval(scriptText);
      courseList = window.courseList;
    }
  });

  return courseList;
}

// 分销基本数据
async function _getDistributionBaseInfo(course) {
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

// 分销详细数据
async function _getDistributionDetailData(course) {
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