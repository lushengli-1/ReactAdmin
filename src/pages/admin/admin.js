import React, {Component} from "react"
import { Redirect } from "react-router"
import { Layout } from "antd"
import memoryUtils from "../../utils/memoryUtils"
import LeftNav from "../../components/left-nav"
import Head from "../../components/header"


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
                <Content style={{backgroundColor:'white'}}>Content</Content>
                <Footer style={{textAlign:'center', color:'#cccccc'}}>推荐使用谷歌浏览器，可以获得更佳页面效果</Footer>
            </Layout>
        </Layout>
     )
 }
}