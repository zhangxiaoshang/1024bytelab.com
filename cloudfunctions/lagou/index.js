// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const cheerio = require('cheerio')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  let result;

  switch (event.key) {
    case 'add_courses':
      const courses = await getCourses()
      result = await addCourses(courses)
      break;
    case 'add_distributions':
      const _ = db.command
      const res = await db.collection('lagou_courses').where({
        
      })
      console.log(res)
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
  const access_token = "33_lLDdBtVv71SCq0hoV7M4pGXXptsRg-qtMMJQg63staA_2kkdTjtU2s4ya5o9u5s9T2EXq2Mm5qN0cnjcBW6ikUiMmS33vs79VjiI3fhMVFCtJb6rtY9lA6470o05W6w8SHcRH_wxyvU-h-zgLZWgAHAAOL"

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