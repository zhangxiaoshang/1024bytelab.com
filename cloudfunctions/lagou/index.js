// 云函数入口文件
const cloud = require('wx-server-sdk')
const cheerio = require('cheerio')
const {
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
exports.main = async(event, context) => {
  const action = event.action || 'updateCourses'
  switch (action) {
    case 'updateCourses':
      return updateCourses()
    default:
      return console.info('action 未定义')
  }
}

async function updateCourses() {
  let courses = await _getCourses()
  courses = await _setPrimaryKeyId(courses)
  courses = await _insertDistributionData(courses)
  await _syncDBLog()

  return await _bulkCreateOrUpdate(courses)
}

async function _syncDBLog() {
  const db = cloud.database()
  const res = await db.collection('sync_db_log').doc(`lagou_courses`).set({
    data: {
      at: db.serverDate()
    }
  })
}

async function _setPrimaryKeyId(courses) {
  return courses.map(item => ({
    _id: `${item.id}_${item.decorateId}`,
    ...item
  }))
}

// 课程添加分销数据
async function _insertDistributionData(courses) {
  const newCourses = []
  for (const course of courses) {
    const {
      showDistributionButton,
      distributionBaseInfoVo
    } = await _getDistributionBaseInfo(course);
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

  return {}
}

/**
 * @desc 批量创建或更新
 * @desc 更新课程
 * @desc 创建未存在的课程
 */
async function _bulkCreateOrUpdate(courses) {
  const db = cloud.database()
  const {
    data: oldCourses
  } = await db.collection('lagou_courses')
    .orderBy('id', 'desc')
    .limit(100) // 最多100条 超过100条时需要修改程序
    .get()

  const newCourses = []
  for (const course of courses) {
    const existed = oldCourses.find(item => item.id === course.id)
    if (existed) {
      await _updateCourse(course)
    } else {
      newCourses.push(course)
    }
  }
  if (newCourses.length) {
    await bulkCreate('lagou_courses', newCourses)
    console.info(`新增课程总计: ${newCourses.length} 条, `)
  }

  console.info(`更新完成`)
}

async function _updateCourse(course) {
  console.log(`更新课程 ${course.courseName}`)
  const db = cloud.database()
  delete course._id
  const res = await db.collection('lagou_courses').doc(`${course.id}_${course.decorateId}`).set({
    data: course
  })

  return res
}