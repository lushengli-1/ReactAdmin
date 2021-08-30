import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
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
import {reqWeather} from '../../api/index'
import {formateDate} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'




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

class Head extends Component{
state = {
    currentTime:formateDate(Date.now()),
    city:"",
    province:"",
    temperature:"",
    weather:"",
}

getTime = () => {
    //每隔一秒钟获取当前时间，饼更新状态数据currentTime
    setInterval( () => {
        const currentTime =formateDate(Date.now())
        this.setState({
            currentTime
        })
    }, 1000)
}

getWeather = async() => {
    //调用接口请求异步获取数据
   const {city, province, temperature,weather} =  await reqWeather("520100")
   // 更新状态
   this.setState({
    city,
    province,
    temperature,
    weather
   })
}

gettitle = () => {
    //得到当前请求路经
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
        if (item.key === path){ //如果当前item对象的key与path一样，item的title就是需要显示的title
            title = item.title
        }else if (item.children){
            // 在所有子item中查找匹配的
            const cItem = item.children.find(cItem => cItem.key === path)
            //如果有值才说明有匹配的
            if(cItem){
                //取出它的title
                title = cItem.title
            }
        }
    })
    return title
}

/* 
第一次render之后执行，
一般在此执行异步操作：发送ajax请求或启动定时器
*/
componentDidMount(){
    //获取当前时间
     this.getTime()
    // 获取当前天气显示
    this.getWeather()

}
    render(){
        const {city,province, temperature,weather,currentTime } = this.state
        const username = memoryUtils.user.username
        const title = this.gettitle()
        console.log('gggggggggggg',title)
        return(
            <div className='header'>
               <div className='header-top'>
                   <span>欢迎,{username}</span>
                   <a href="javascript"> 退出</a>
               </div>
               <div className='header-bottom'>
                   <div className='header-bottom-left'>{title}</div>
                   <div className='header-bottom-right'>
                       <span>{currentTime}</span>
                       <span style={{fontSize:'15px',marginRight:'5px'}}>{city}</span>
                      {/*  <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather"/> */}
                      <span style={{fontSize:'10px',}}>|</span>
                       <span style={{fontSize:'15px', marginLeft:'5px'}}>{weather}</span>
                   </div>
               </div>
            </div>
        )
    }
}

export default withRouter(Head)