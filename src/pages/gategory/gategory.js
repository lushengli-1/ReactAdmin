import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd'

import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api'
import AddForm from './add-form'
import Updateform from './update-form'

import LinkButton from '../../components/link-button'



/* 
商品分类路由
*/

export default class Gategory extends Component {


    state = {
        categorys: [], //一级分类列表
        showStateus: 0,  //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加； 2：显示更新
        isloading: false,//是否再获取数据中
        subCategorys: [],//二级分类列表
        parentId: '0',//一级分类列表的parentId为0,二级为1.。。。
        parentName: '',
    }
    /* 
        异步获取一级/二级分类列表显示如果指定了根据指定的请求
        parentId： 如果没有指定根据状态中的parentId请求，
    */
    getGategorys = async (parentId) => {
        //发请求前显示loading
        this.setState({
            isloading: true
        })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)
        //请求完成，关闭loading
        this.setState({
            isloading: false
        })
        console.log('一级/二级分类列表', result)
        if (result.status === 0) {
            //取出分类数组（可能是一级也可能是二级的）
            const categorys = result.data
            if (parentId === '0') {
                //更新一级分类状态
                this.setState({
                    categorys
                })
            } else {
                //更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
            }


        } else {
            message.error('获取分类列表失败')
        }
    }

    //显示指定一级分类的二级列表
    ShowSubCategorys = async (category) => {
        //先更新状态
        await this.setState({
            parentId: category._id,
            parentName: category.name
        })
        console.log('获取parentName', this.state.parentName)
        console.log("第二次获取列表的parentID", this.state.parentId)
        //获取二级分类显示
        this.getGategorys()

    }

    /* 显示指定一级分类列表 */
    showCategorys = () => {
        //更新为显示一级列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []

        })
    }

    //打开添加分类弹窗
    showAdd = () => {
        this.setState({
            showStateus: 1
        })
    }

    //打开修改分类弹窗
    showUpdate = (category) => {
        this.setState({
            showStateus: 2
        })
        //保存分类对象
        this.category = category
        //更新状态
    }

    //关闭弹窗
    handleCancel = () => {
        //清除输入数据
        this.form.resetFields()
        //关闭弹窗
        this.setState({
            showStateus: 0
        })
    }

    //更新分类
    updateCategory = async () => {
        //进行表单验证，只有通过了才处理
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //隐藏确定框
                this.setState({
                    showStateus: 0
                })

                //准备数据
                const categoryId = this.category._id
                const categoryName = values

                //清除输入数据
                this.form.resetFields()

                //发请求更新分类
                const result = await reqUpdateCategory({ categoryId, categoryName })
                if (result.status === 0) {
                    this.getGategorys()
                }

                //重新显示列表
                this.getGategorys()
            }
        })
    }



    //添加分类
    addGategory =  () => {
        //进行表单验证，只有验证通过了才处理
        this.form.validateFields(async(err, values) => {
            if (!err) {
                //隐藏确认框
                this.setState({
                    showStateus: 0
                })
                //收集数据，并提交添加分类的请求
                const { parentId, categoryName } = values

                //清除输入数据
                this.form.resetFields()
                const result = await reqAddCategory(categoryName, parentId)
                if (result.status === 0) {
                    //添加的分类就是当前分类列表下的分类
                    if (parentId === this.state.parentId) {
                        //重新获取分类列表显示
                        this.getGategorys()
                    } else if (parentId === '0') {//在二级分类列表下添加一级分类项，重新获取一级分类列表，但不需要显示一级分类列表
                        this.getGategorys(parentId)
                    }

                }
            }
        })


    }
    //测试


    // 发异步Ajax请求
    componentDidMount() {
        this.getGategorys()
    }

    render() {
        const { categorys, showStateus, isloading, subCategorys, parentId, parentName } = this.state
        //读取指定的分类
        const category = this.category || {}
        //card的左侧
        //console.log('二级分类列表名', parentName)
        const title = parentId === '0' ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <span style={{ marginLeft: '10px', marginRight: '10px' }}>-></span>
                <span>{parentName}</span>
            </span>
        )
        //card的右侧
        const extra = (
            <Button type='primary' onClick={this.showAdd}>
                <span>+</span>
                添加
            </Button>
        )
        //读取状态数据
        const columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',

                width: 300,
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {parentId === '0' ? <LinkButton onClick={() => { this.ShowSubCategorys(category) }}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ];
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        rowKey='_id'
                        loading={isloading}
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        bordered
                        columns={columns}
                        pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                    />

                </Card>
                <Modal
                    title='添加分类'
                    visible={showStateus === 1}
                    onOk={this.addGategory}
                    onCancel={this.handleCancel}
                    okText='确定'
                    cancelText='取消'
                >
                    <AddForm parentId={parentId} categorys={categorys}
                        setForm={(form) => { this.form = form }} />
                </Modal>
                <Modal
                    title='更新分类'
                    visible={showStateus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                    okText='确定'
                    cancelText='取消'
                >

                    <Updateform
                        categoryName={category.name}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </div>
        )
    }
}