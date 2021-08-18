import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import { Menu, Button } from 'antd';
import {
    AppstoreOutlined,
    HomeOutlined,
    UnorderedListOutlined,
    SettingOutlined,
    UserOutlined,
    AreaChartOutlined,
    WindowsOutlined,
    BarChartOutlined,
    LineChartOutlined,
    PieChartOutlined,
  } from '@ant-design/icons';
//import menuList from '../../config/menuConfig';
import logo from '../../pages/login/images/ht.png'
import './index.less'


/* 左侧导航组件 */
const menuList = [
    {
        title:'首页', //菜单标题名称
        key: '/home', //对应的path
        icon: <HomeOutlined/>
    },
    {
        title:'商品',
        key: '/products',
        icon: <AppstoreOutlined />,
        children: [ //子菜单列表
          {
            title:'品类管理',
            key: '/gategory',
            icon: <UnorderedListOutlined />,
          },
          {
            title:'商品管理',
            key: '/product',
            icon: <SettingOutlined/>,
          }
        ]
    },
    {
        title:'用户管理',
        key: '/user',
        icon: <UserOutlined/>
    },
    {
        title:'角色管理',
        key: '/role',
        icon: <UserOutlined/>
    },
    {
        title:'图形列表',
        key: '/charts',
        icon: <AreaChartOutlined/>,
        children:[
            {
                title:'柱形图',
                key: '/charts/bar',
                icon: <BarChartOutlined/>
            },
            {
                title:'折线图',
                key: '/charts/line',
                icon: <LineChartOutlined/> 
            },
            {
                title:'饼图',
                key: '/charts/pie',
                icon: <PieChartOutlined/>
            }
        ]
    },
    {
        
        title:'订单管理',
        key: '/p',
        icon: <WindowsOutlined />
    }
]
const { SubMenu } = Menu;
export default class LeftNav extends Component{
    //根据menu的数据数组生成对应的标签数组
    //使用map()+递归调用
    getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if(!item.children){
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            }else{
                return(
                    <SubMenu key={item.key} icon={item.icon} title={
                        <span>{item.title}</span>
                    }>
                       {this.getMenuNodes(item.children)} {/* 递归 */}
                    </SubMenu>
                )
            }
            
        })
    }
    render(){
        return(
            <div to='/' className='left-nav'>
                <Link className='left-nav-header'>
                    <img src={logo} alt='logo'/>
                    <h1>React后台</h1>
                </Link>
                <Menu 
                    mode='inline'
                    theme='dark'
                >
                    {this.getMenuNodes(menuList)}

                </Menu>
            </div>
        )
    }
}