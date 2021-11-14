import React, {Component} from 'react'
import {Card, Button, Table, Modal, Form, Input, message} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddRoles } from '../../api'
import AddForm from './add-form'

/* 角色管理路由 */

const Item = Form.Item

export default class Role extends Component{
    constructor(props){
        super(props)
        this.state={
            roles: [],//所有橘色的列表
            role: {}, //选中的role
            isShowAdd: false, //是否显示添加界面
            isShowAuthor: false, //是否显示设置权限界面

        }
    }

    initColumns = () => {
        this.columns = [
            {
                title:'角色名称',
                dataIndex: 'name',
                key:'juse'
                
            },
            {
                title:'创建时间',
                dataIndex: 'create_time',
                key:'t'
                
            },
            {
                title:'授权时间',
                dataIndex: 'auth_time',
                key:'s'
                
            },
            {
                title:'授权人',
                dataIndex: 'auth_name',
                key:'p'
                
            },

        ]
    }
       

    createRole = () =>{
        this.setState({
            isShowAdd:true
        })
    }

    addRole = () => {
        // 进行表单验证
        this.form.validateFields(async(error, values) => {
            this.setState({
                isShowAdd:false
            })
            if(!error) {
            // 收集输入数据
                const {roleName} = values
                this.form.resetFields()
            // 请求添加
                const result = await reqAddRoles(roleName)
                console.log('请求添加',result)
            // 根据结果提示/更新列表显示
                if(result.status === 0) {
                    message.success('添加成功')
                    // this.getRoles()
                    
                    // 新产生的角色
                    const role = result.data
                    // 更新roles状态: 基于原本状态数据更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))
                }else{
                    message.error(result.msg)
                }
            }
        
        })
      
    }

    handleCancel = () => {
        this.setState({
            isShowAdd:false
        })
    }

    //点击行
    onRow = (role) =>{
        return {
            onClick: event => {//点击行
                console.log('hhhh',role)
               this.setState({
                   role
               })
            } 
          }

    }
    //获取所有角色列表
    getRoles = async() => {
     const result = await reqRoles()
     if(result.status === 0){
         const roles = result.data
         this.setState({
             roles
         })
    }
}

    componentWillMount(){
        this.initColumns()
    }

    componentDidMount(){
        this.getRoles()
    }
    
    render(){
        const {roles, role, isShowAdd, isShowAuthor} = this.state
        console.log('roles是个什么贵', roles)
        const title =(
           <div>
                <Button type='primary' style={{marginRight:'10px'}} onClick={this.createRole}>创建角色</Button>
                 <Button type='primary' disabled={!role._id}>设置角色权限</Button>
           </div>
        )
        return(
          <Card title={title}>
              <Table
                bordered
                rowKey='_id'
                columns={this.columns}
                dataSource={roles}
                pagination={{defaultPageSize: PAGE_SIZE}}
                rowSelection={{type:'radio', selectedRowKeys: [role._id]}}
                onRow={this.onRow}
              />
              <Modal
                title='添加角色'
                visible={isShowAdd}
                onOk = {this.addRole}
                onCancel ={this.handleCancel}
              >
               <AddForm
                    setForm={(form) => {this.form = form}}
               />
              </Modal>
              <Modal
                title='设置角色权限'
                visible={isShowAuthor}
                onOk = {this.updateRole}
                onCancel ={this.handleCancel}
              >
               <AddForm
                    setForm={(form) => {this.form = form}}
               />
              </Modal>
          </Card>
        )
    }
}