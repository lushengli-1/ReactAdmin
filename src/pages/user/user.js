import React, {Component} from 'react'
import {Card, Button, Table, Modal} from 'antd'

/* 用户管理路由 */

const columns = [
    {
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'age',
        key: 'age',
      },
      {
        title: '电话',
        dataIndex: 'address',
        key: 'address',
      },
      {
          title:'注册时间',
          dataIndex:'time'
      },
      {
        title:'所属角色',
        dataIndex:'time'
    },
    {
        title:'操作',
    }
]

const dataSource = [

  ];
export default class User extends Component{
    constructor(props){
        super(props)
        this.state={
            openModal:false
        }
    }
    //点击创建用户按钮触发的事件
    createUser = ()=>{
        this.setState({
            openModal:true
        })
    }

    handleOk =() =>{
        this.setState({
            openModal:false
        })
    }
    handleCancel = () => {
        this.setState({
            openModal:false
        })
    }
    render(){
        const {openModal} = this.state
        const title = (
            <Button type='primary' onClick={this.createUser}>创建用户</Button>
        )
        return(
           <Card title={title}>
              <Table
                bordered
                columns={columns}
                dataSource={dataSource}
              />
              <Modal
               visible={openModal}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
               
              />
           </Card>
        )
    }
}