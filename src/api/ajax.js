/* 
发送Ajax请求
封装axios库
函数的返回值是promise对象
1.优化：统一处理请求异常
*/

import axios from 'axios'
import {message} from 'antd'


export default function ajax(url,data={},type='GET'){

    return new Promise((resolve,reject) => {
        let promise
        //1.执行异步ajax请求
        if(type === 'GET'){//发GET请求
            promise = axios.get(url,{ //配置对象
             params: data //指定请求参数
            })
         }else {//发post请求
             promise  = axios.post(url, data)
         }
        //2.成果，调用resolve(value)
        promise.then( response => {
            resolve(response.data)

        //3.失败，不调用reject(reason),提示异常信息
        }).catch(error =>{
            message.error('请求出错了：'+ error.massage)
        })
        
    })

   
}