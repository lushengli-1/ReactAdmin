import React, { Component } from 'react'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd'
import LinkButton from '../../components/link-button'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'

/*
Product的默认子路由组件
*/


const Option = Select.Option
class ProductHome extends Component {

    state = {
        total: 0, //商品的总数量
        products: [], //商品的数组
        loading: false,//是否正在加载中
        searchName: '',//搜索的关键字
        searchType: 'productName', //根据哪个字段搜索
    }

    

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum //保存pageNum,让其他方法可以看到
        //请求之前显示loading
        this.setState({
            loading: true
        })
        const { searchName, searchType } = this.state
        //如果搜素关键字有值，说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {//一般分页
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        //请求结束之后关闭loading
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            //取出分页数据，更新状态，显示分页列表
            const { total, list } = result.data
            console.log('获取指定页码的列表数据显示', result)
            this.setState({
                total,
                products: list
            })
        }
    }

    //更新指定商品的状态
    updateStatus = async(productId,status) =>{
        const result = await reqUpdateStatus(productId,status)
        if(result.status === 0){
            message.success('更新商品成功')
            //更新列表显示
            this.getProducts(this.pageNum)
        }
    }


    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    //初始化table列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name'
            },
            {
                title: '商品描速',
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
               // dataIndex: 'status',
                render: (product) => {
                    console.log('sdksfjdfjkdjskajkhdjkafhkjhfjs',product)
                    const { status, _id } = product
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, status=== 1 ? 2 :1)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
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
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton
                                onClick={() => this.props.history.push('/product/detail', { product })}
                            >
                                详情
                            </LinkButton>
                            <LinkButton onClick={()=>{this.props.history.push('/product/addupdate',product)}}>修改</LinkButton>
                        </span>
                    )
                }

            }

        ]
    }

    render() {
        //取出状态里的数据
        const { products, total, loading, searchName, searchType } = this.state
        console.log('dhjjsdh', products)
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: '150px' }}
                    onChange={value => this.setState({ searchType: value })}//value就是选中的value productName或productDesc
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchName}
                    onChange={event => this.setState({ searchName: event.target.value })}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}> 搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading}
                    bordered
                    rowKey='_id'
                    dataSource={products}
                    columns={this.columns}
                    pagination={{//分页，是一个配置对象,showQuickJumper快速跳转到指定页码
                        total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: (pageNum) => (this.getProducts(pageNum))//等于this.getProducts 在翻页时自动获取当前页的数据
                    }}

                />

            </Card>
        )
    }
}

export default ProductHome