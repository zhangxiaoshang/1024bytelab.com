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
  const courses = JSON.stringify(await getCourses())


  const query = `db.collection("lagou_courses").add({data: [{key:1},{key:2}]})`
  const ids = await axios({
    method: 'post',
    url: `https://api.weixin.qq.com/tcb/databaseadd?access_token=33_WV4IV31mLcWelm4YVikFnYI7dF0JziFYx05wWSmQhLuTrhdMPYYaqKYGLVZ_dvw-2SyEiCmvFGWb5ZCNMlOFxbI1IYqEwcoqJfUTS226NilGezE3WjhTEg1o0eDNNYkZsg9gT5GWvAqYUcumUYMfAHACGU`,
    data: {
      env: "bytelab-dev-cnoaq",
      query,
    }
  })

  console.log(courses)
  // const id = await db.collection('lagou_courses').add({
  //   data: courses
  // })
  // console.log('courses ', id )

  return ids
}

const getCourses = async function () {
  const { data } = await axios.get('https://kaiwu.lagou.com');

  const $ = cheerio.load(data);
  let courseList = [];
  $('script').each(function (index) {
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

