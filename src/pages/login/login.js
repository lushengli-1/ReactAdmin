import React from 'react'
import {Icon,Button,Input,Form,message} from 'antd'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

import './login.less'
import logo from './images/ht.png'
import { Redirect } from 'react-router-dom'



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
    
  handleSubmit = (event) => {
    //阻止事件的默认行为（组织表单自动提交）
    event.preventDefault()
  
    // 对所有表单字段进行检验
    this.props.form.validateFields(async (err, values) => {
      // 检验成功
      if (!err) {
        // console.log('提交登陆的ajax请求', values)
        // 请求登陆
        const {username, password} = values
        const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
        // console.log('请求成功', result)
        if (result.status===0) { // 登陆成功
          //保存user的信息
          const user = result.data
          console.log('保存的user值',user.username)
          memoryUtils.user = user//保存到内存中
          storageUtils.saveUser(user)//保存到local 中

          
           // 提示登陆成功
           message.success('登陆成功')
           // 跳转到管理界面 (不需要再回退回到登陆)
           this.props.history.replace('/')
        } else { // 登陆失败
          // 提示错误信息
          message.error(result.msg)
        }

      } else {
        console.log('检验失败!')
      }
    });
    /* //得到form对象
    const form = this.props.form
    //获取表单项的输入数据
    const values = form.getFieldsValue()
    console.log('获取数据',values) */

  }

  /* 
  对密码进行自定义验证
  */
  validatePwd = (rule,value,callback) => {
    //callback() //验证通过
    // callback('xxxx') //验证失败，并指定提示的文本
    if(!value){
      callback('密码必须输入')
    }else if(value.length < 4){
      callback('密码长度不能小于4位')
    }else if(value.length > 12){
      callback('密码长度不能大于12位')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须是英文、数字或下划线组成')
    }else{
      callback()
    }


  }


    render(){
      //如果用户已经登录，自动跳转到管理界面（看内存里有没有user）
        const user = memoryUtils.user
        if(user && user._id){
          return <Redirect to='/'/>
        }
        //得到具有强大功能的form对象
        const form = this.props.form
        const {getFieldDecorator} = form
        return(
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo"/>
                    <h1>React后台管理系统</h1>
                </header>
                <section className="login-content">
                     <h2>用户登录</h2>
                     <Form hideRequiredMark {...layout}   className='login-form' onSubmit={this.handleSubmit}>
                            <Form.Item>
                              {getFieldDecorator('username',{ //配置对象：属性名是一些特定名称
                              // 声明式验证：直接使用别人定义好的验证规则进行验证
                                rules:[
                                  { required:true, whitespace:true, message:'用户名必须输入'},
                                  { min:4, message:'用户名至少4位'},
                                  { max:12, message:'用户名最多12位'},
                                  { pattern: /^[a-zA-Z0-9_]+$/, message:'用户名为英文、数字或下划线'}
                                ]
                              })(
                              <Input 
                                prefix={<Icon type="username" style={{color:'rgba(0,0,0,.25)'}}/>}
                                type="username"
                                placeholder="用户名"
                                style={{width:'320px'}}
                              />
                              )
                            }    
                        </Form.Item>
                        <Form.Item>
                          {getFieldDecorator('password',{
                            rules:[
                              /* 
                              用户名/密码的合法性要求
                              1.必须输入
                              2.必须大于4位
                              3.必须小于12位
                              4.必须是英文、数字或下划线组成
                              */
                             //自定义验证
                             {
                              validator: this.validatePwd
                             }
                            ]
                          })(
                            <Input 
                            prefix={<Icon type="lock" style={{color:'rgba(0,0,0,.25)'}}/>}
                            type="password"
                            placeholder="密码"
                            style={{width:'320px'}}
                         />
                          )

                          }
                            
                        </Form.Item>
                        <Form.Item>
                            <Button  htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                     </Form>
                </section>
            </div>
        )
    }
}

/* 
  高阶函数
    接收函数类型的函数
    返回值是函数
    常见：定时器：setTimeout()/setInterval, promise(()=>{}) then(value=>{},reason=>{})
  高阶组件
    本质是一个函数
      接收一个组件（被包装组件），返回一个新的组件（包装组件），包装组件会向被包装组件传入特定属性，返回的组件与传入的组件是父子关系
      作用：扩展组件的功能
      高阶组件也是高阶函数，至少它接收的组件函数，返回的是新的组件函数
*/

/* 
包装Form组件生成一个新的组件：Form(Login)
新组件会向form组件传递一个强大的对象属性
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin

/* 

前台表单验证
收集表单输入数据
*/