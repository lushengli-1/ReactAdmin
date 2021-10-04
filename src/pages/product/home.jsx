import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table
} from 'antd'
import LinkButton from '../../components/link-button'
/*
Product的默认子路由组件
*/


const Option = Select.Option
class ProductHome extends Component {

    state = {
        products: [
            {
                "status": 1,
                "imgs": [
                    "image-1633335214775.jpg"
                ],
                "_id": "615ab81b9eeec45284d43cf5",
                "name": "联想ThinkPad翼480",
                "desc": "年度重量级新品，X390、T490全新登场，更加轻薄机身设计",
                "price": 66000,
                "detail": "<p>联想（lenovo)扬天V110 15.6英寸家用轻薄便携商务办公手提笔记本电脑 定制【】2G独显</p>\n",
                "pCategoryId": "612f50939c7d812c6859fe24",
                "categoryId": "615aa8e79eeec45284d43cf1",
                "__v": 0
            }
        ], //商品的数组
    }

    //初始化table列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品秒速',
                dataIndex: 'desc'
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price //当前指定了对应的属性，传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                dataIndex: 'status',
                render: (status) => {
                    return (
                        <span>
                            <Button type='primary'>下架</Button>
                            <span>在售</span>
                        </span>
                    )
                }

            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            <LinkButton>详情</LinkButton>
                            <LinkButton>修改</LinkButton>
                        </span>
                    )
                }

            }

        ]
    }


    componentWillMount() {
        this.initColumns()
    }

    render() {
        //取出状态里的数据
        const { products } = this.state

        const title = (
            <span>
                <Select value='1' style={{ width: '150px' }}>
                    <Option value='1'>按名称搜索</Option>
                    <Option value='2'>按描述搜索</Option>
                </Select>
                <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }} />
                <Button type='primary'> 搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary'>
                <Icon type='plus' />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                />

            </Card>
        )
    }
}

export default ProductHome