import React, {Component} from "react"
import { Redirect, Route,Switch} from "react-router"
import { Layout } from "antd"
import memoryUtils from "../../utils/memoryUtils"
import LeftNav from "../../components/left-nav"
import Head from "../../components/header"
import Home from '../home/home'
import Gategory from '../gategory/gategory'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


/* 后台管理的路由组件 */


const {Header, Footer, Sider, Content} = Layout
export default class Admin extends Component{
 render(){
     const user = memoryUtils.user
     //如过内存中没有存储user >>>当前没有登录
     if(!user || !user._id){
     // 自动跳转到登录（在render（）中）
     return <Redirect to='/login'/>
     }
     return(
        <Layout style={{height:'100%'}}>
            <Sider>
                <LeftNav/>
            </Sider>
            <Layout>
                <Head>Header</Head>
                <Content style={{backgroundColor:'white'}}>
                  <Switch>
                      <Route path='/home' component={Home} />
                      <Route path='/gategory' component={Gategory} />
                      <Route path='/product' component={Product} />
                      <Route path='/role' component={Role} />
                      <Route path='/user' component={User} />
                      <Route path='/charts/bar' component={Bar} />
                      <Route path='/charts/line' component={Line} />
                      <Route path='/charts/pie' component={Pie} />
                      <Redirect to='/home'/>
                  </Switch>
                    
                </Content>
                <Footer style={{textAlign:'center', color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面效果</Footer>
            </Layout>
        </Layout>
     )
 }
}