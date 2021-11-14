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

//获取商品分页列表
export const reqProducts = (pageNum,pageSize) => ajax(BASE+'/manage/product/list',{pageNum,pageSize})

/* //搜索商品分页列表(根据商品名称来搜)
export const reqSearchProducts = ({pageNum,pageSize,searchName}) => ajax(BASE+'manage/product/search',{
  pageNum,
  pageSize,
  productName:searchName,
}) */
/* //搜索商品分页列表(根据商品描述来搜)
export const reqSearchProducts2 = ({pageNum,pageSize,searchName}) => ajax(BASE+'manage/product/search',{
  pageNum,
  pageSize,
  productDesc: searchName
}) */

/* 
  合并以上
  搜索商品分页列表（根据商品名称/商品描述）
  searchType：搜索的类型，productName/productDesc
*/
export const reqSearchProducts = ({pageNum,pageSize,searchName, searchType}) => ajax(BASE+'manage/product/search',{
  pageNum,
  pageSize,
  [searchType]: searchName,
})

//获取一个分类
export const reqCategory = (categoryId) =>ajax(BASE + '/manage/category/info',{categoryId})

//更新商品的状态（上架/下架）
export const reqUpdateStatus = (productId,status) => ajax(BASE+'/manage/product/updateStatus',{productId,status},'POST')

//删除图片
export const reqDeleteImg = (name) => ajax(BASE+'/manage/img/delete', {name}, 'POST')

//添加商品
export const reqAddProduct = (product) => ajax(BASE + '/manage/product/add',product, 'POST')
//修改商品
export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update',product, 'POST')

/* // 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/'+(product._id ? 'update':'add'),product, 'POST') 
*/


 //获取所有角色的列表
 export const reqRoles = () => ajax(BASE + '/manage/role/list')
 // 添加角色
 export const reqAddRoles = (roleName) => ajax(BASE + '/manage/role/add',{roleName}, 'POST')


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

//解决get请求的跨域问题，浏览器通过script标签去发请求，