import React from 'react'
import {Icon,Button,Input,Form, Result, message} from 'antd'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'

import './login.less'
import logo from './images/ht.png'


/* 登录的路由组件 */


const layout = {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 20,
    },
  };
class Login extends  React.Component {
    formRef = React.createRef();
    checkAuth=async()=>{
          
        if (this.formRef && this.formRef.current){ //很重要，在render后，formRef才实例化
             try {
                 // 使用 validateFields 获取多个字段值,若验证通过，则返回表单值数组
                 const values = await this.formRef.current.validateFields();
                 console.log('提交登录的Ajax请求', values);
      
                 //执行提交数据
                 const {username,password} = values
                
                const result =await reqLogin(username,password)//{status:0 , data:user}{status: 1, msg:"xxx"}
               if (result.status === 0){
                   //登录成功
                   message.success('登录成功')
                    //保存user
                    const user = result.data
                    memoryUtils.user = user //保存在内存中
                   //跳转到后台管理界面(不需要再回退回来，所以用replace,否则用push)
                   this.props.history.replace('/')
               }else{
                   //登录失败
                   message.error(result.msg)
               }
                
               /*  reqLogin(username,password).then(response => {
                     console.log('请求成功', response.data)

                }).catch(error => {
                    console.log('请求出错了',error)
                }) */
      
               } catch (errorInfo) {
                 //若验证失败，返回数组{values:{表单值数组},errorFields:{验证未通过的表单值数组:{errors,name}}}
                 console.log('校验失败');
               }
      
         }
        }
         
     
      /* 对密码进行自定义验证 */
      /* 新版的antd使用了React的hooks，表单中的字段效验方法进行了一些修改。
      原来的回调方法改成返回一个Promise对象 */
      validatorPwd = (rule, value, callback) => {
          console.log('validatePwd()',rule, value)
          if(!value){
           return Promise.reject('密码必须输入')
          }
          else if(value.length<4){
            return  Promise.reject('密码长度不能小于4位')
              
          }
          else if (value.length > 12){
            return Promise.reject('密码长度不能大于12位')
              
          }
          else if (!/^[a-zA-Z0-9_]+$/.test(value)){
            return Promise.reject('密码必须是英文、字母或下划线')
             
          }else{
            return Promise.resolve()//验证通过
          }
       
        
      }
    render(){
       
        
        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React后台管理系统</h1>
                </header>
                <section className="login-content">
                     <h2>用户登录</h2>
                     <Form hideRequiredMark {...layout} ref={this.formRef}  className='login-form'>
                            <Form.Item
                            name="username"
                            label="用户名"
                            /* 声明式验证：直接使用别人定义好的验证规则去验证 */
                            rules={[
                                {required: true, message:'用户名必须输入'},
                                {min: 4, message:'用户名至少四位'},
                                {max: 12,message:'用户名最多12位'},
                                {pattern: /^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、字母或下划线'}
                            ]}
                                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[
                                {validator: this.validatorPwd}
                            ]}
                                        >
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button onClick={()=>this.checkAuth()} /* htmlType="submit" */ className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                     </Form>
                </section>
            </div>
        )
    }
}

export default Login 