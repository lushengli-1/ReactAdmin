/* 
包含应用中所有接口请求函数的模块
*/

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'



//const BASE = 'http://localhost:5000'
const BASE = ''
//登录
/* export function reqLogin(){
 return ajax('/login',{username, password}, 'POST')
} */

export const reqLogin = (username, password) => ajax(BASE+'/login', {username,password}, 'POST')
//添加用户
export const reqAddUser =(user) => ajax('/manage/user/add',user,'POST')


//获取一级、二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE+'/manage/category/list', {parentId})
// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', {categoryName, parentId}, 'POST')

// 更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax(BASE + '/manage/category/update', {categoryId, categoryName}, 'POST')


/*
json请求的接口请求函数
 */

export const reqWeather = (adcode) => {
    return new Promise((resolve, reject) => {
     // const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
     // const url = 'https://restapi.amap.com/v3/weather/weatherInfo?key=081dd71112ad124f6476086d1d659951&city='+ adcode
     const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=081dd71112ad124f6476086d1d659951&city=${adcode}`
      // 发送jsonp请求
      jsonp(url, {}, (err, data) => {
        console.log('jsonp()1111111', err, data)
        // 如果成功了
        if (!err && data.status=== "1") {
          // 取出需要的数据
         // const {dayPictureUrl, weather} = data.results[0].weather_data[0]
          const {weather, city, province,temperature} = data.lives[0]
          resolve({weather,city,province,temperature})
        } else {
          // 如果失败了
          message.error('获取天气信息失败!')
        }
  
      })
    })
  }

