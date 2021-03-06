import React, {Component} from "react"
import { Redirect, Route,Switch} from "react-router"
import { Layout } from "antd"
import memoryUtils from "../../utils/memoryUtils"
import LeftNav from "../../components/left-nav"
import Header from "../../components/header"
// import Login from "../login/login"
import Home from '../home/home'
import Gategory from '../gategory/gategory'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


/* 后台管理的路由组件 */


const {Footer, Sider, Content} = Layout
export default class Admin extends Component{
 render(){
     const user = memoryUtils.user
     console.log('admin页面获取的user值',user)
     //如果内存中没有存储user===>当前没有登录
     if(!user || !user._id){
        //自动跳传到登录界面
        return<Redirect to='/login'/>
     }
     return(
       <Layout style={{minHeight:'100%'}}>
           <Sider>
               <LeftNav/>
           </Sider>
           <Layout>
                <Header>header</Header>
                <Content style={{margin:'20px',backgroundColor:"white"}}>
                    <Switch>
                        <Route path='/home' component={Home}/>
                        <Route path='/gategory' component={Gategory}/>
                        <Route path='/product' component={Product}/>
                        <Route path='/role' component={Role}/>
                        <Route path='/user' component={User}/>
                        <Route path='/charts/bar' component={Bar}/>
                        <Route path='/charts/line' component={Line}/>
                        <Route path='/charts/pie' component={Pie}/>
                        <Redirect to='/home'/>
                    </Switch>
                </Content>
                <Footer style={{textAlign:'center',color:'#ccc'}}>推荐使用谷歌浏览器</Footer>
           </Layout>

       </Layout>
     )
 }
}