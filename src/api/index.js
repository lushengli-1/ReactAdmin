/* 
包含应用中所有接口请求函数的模块
*/

import ajax from './ajax'


//const BASE = 'http://localhost:5000'
const BASE = ''
//登录
/* export function reqLogin(){
 return ajax('/login',{username, password}, 'POST')
} */

export const reqLogin = (username, password) => ajax(BASE+'/login', {username,password}, 'POST')
//添加用户
export const reqAddUser =(user) => ajax('/manage/user/add',user,'POST')