import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon} from 'antd';

import menuList from '../../config/menuConfig';
import logo from '../../pages/login/images/ht.png'
import './index.less'



const { SubMenu } = Menu;
 class LeftNav extends Component{

    //根据 menu的数据数组生成相应的标签数组
    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map( item => {
           /* 
               {
                title:'首页', //菜单标题名称
                key: '/home', //对应的path
                icon: 'home', //对应的图标
                children: [] //可能有可能没有
             },
            */ 
          if(!item.children){
              return(
                <Menu.Item key={item.key} >
                    <Link to={item.key}>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item>
              )
          }else{
            //导航栏被选中 刷新后自动展开
            //查找一个与当前请求路径相匹配的子item
          const cItem =  item.children.find(cItem => path.indexOf(cItem.key)===0)
            //如果存在，说明当前item的子列表需要打开
           if(cItem){
            this.openkey = item.key
           }

              return(
                <SubMenu 
                    key={item.key}
                    title={
                        <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </span>
                    }
                >
                    {/* 递归调用 */}
                   {this.getMenuNodes(item.children)}
                
                </SubMenu> 
              )
          }
        })
    }
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render(){
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        console.log("获取路径",path)
        if(path.indexOf('/product') === 0){ //当前请求的是商品或其子路由界面
            path = '/product'
        }
        //得到需要打开菜单项的key
        const openkey = this.openkey
        return(
            <div className='left-nav'>
               <Link to='/' className='left-nav-header'>
                <img src={logo} alt='logo'/>
                <h1>React后台</h1>
               </Link>
               <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openkey]}
                    >
                    {
                     this.menuNodes
                    }
                    
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)

//withRouter 高阶组件
/* 
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/