import React, {Component} from 'react'
import { withRouter } from 'react-router-dom'
import {Modal } from 'antd'
import {reqWeather} from '../../api/index'
import {formateDate} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button'
import './index.less'



class Header extends Component{
state = {
    currentTime:formateDate(Date.now()),
    city:"",
    province:"",
    temperature:"",
    weather:"",
    setIsModalVisible: false,
    isModalVisible: false,
}

getTime = () => {
    //每隔一秒钟获取当前时间，饼更新状态数据currentTime
    this.intervalId = setInterval( () => {
        const currentTime =formateDate(Date.now())
        this.setState({
            currentTime
        })
    }, 1000)
}

getWeather = async() => {
    //调用接口请求异步获取数据
   const {city, province, temperature,weather} =  await reqWeather("520111")
   console.log('获取天气数据',weather)
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
            const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0 )
            //如果有值才说明有匹配的
            if(cItem){
                //取出它的title
                title = cItem.title
            }
        }
    })
    return title
}
/* confirm = async(e) => {
    console.log('确定',e);
    //删除保存的user数据
    console.log('gggggggggggggg',storageUtils.user)
    await storageUtils.removeUser()
    storageUtils.user = {}
    //跳转到login
    this.props.history.replace('/login')
   
   
  }

cancel = (e) => {
    console.log('取消');
    message.error('Click on No');
  } */

  /*
  退出登陆
   */
  logout = () => {
    // 显示确认框
    Modal.confirm({
        okText:'确定',
      content: '确定退出吗?',
      onOk: () => {
        console.log('OK', this)
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}

        // 跳转到login
        this.props.history.replace('/login')
      },
      onCancle:()=>{
       console.log('dd')
      }
    })
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

componentWillUnmount(){
    console.log('清除定时器')
     // 清除定时器
     clearInterval(this.intervalId)
}
    render(){
        const {currentTime, city, weather } = this.state
        const {username} = memoryUtils.user
        const title = this.gettitle()
        return(
          <div className='header'> 
            <div className='header-top'>
                <span>欢迎, {username}</span>
                <LinkButton onClick={this.logout}>退出</LinkButton>
            </div>
            <div className='header-bottom'>
                <div className='header-bottom-left'>{title}</div>
                <div className='header-bottom-right'>
                    <span>{currentTime}</span>
                    <span style={{paddingLeft:'10px',paddingRight:'5px'}}>{city}</span>
                    <span>{weather}</span>
                </div>
            </div>
          </div>
        )
    }
}

export default withRouter(Header)