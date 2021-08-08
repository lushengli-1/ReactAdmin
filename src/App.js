import React, {Component} from "react";
import {Button,message} from 'antd'
//import 'antd/dist/antd.css'

export default class App extends Component{
  handleClick = () => {
    message.success('成功。。。。。。。。。。。')
  }
render(){
  return (
    <div>
    <div>gdgg</div>
    <Button type='primary' onClick={this.handleClick}>dff</Button>
  </div>
  )
}
}