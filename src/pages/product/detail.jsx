import React, { Component } from 'react'
import { Card, Icon, List } from 'antd'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reqCategory} from '../../api/index'


const Item = List.Item

/* Product的详情子路由组件 */
export default class ProductDetail extends Component {

    state={
        cName1:'', //一级分类名称
        cName2:'', //二级分类名称
    }

    async componentDidMount(){
        //得到当前商品的分类ID
        const {pCategoryId, categoryId} = this.props.location.state.product
        if(pCategoryId === '0'){//一级分类下的商品
            //根据分裂ID去查询分类名
           const result = await reqCategory(pCategoryId)
           //const cName1 = result.data.name
           const cName1 = result.data
           this.setState({cName1})
        }else{//二级分类下的商品
            /* 
            //通过多个await的方式发送请求：后面一个请求时在前一个请求成功返回后才发送 影响效率
            const result1 = await reqCategory(pCategoryId)//获取一级分类列表
            const result2 = await reqCategory(categoryId)//获取二级分类列表
            const cName1 = result1.data.name
            const cName2 = result2.data.name 
                所以换下面的写法
            */

            //一次性发送多个请求， 只有都成功了，才正常处理
            const results = await Promise.all([reqCategory(pCategoryId),reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }

    }

    render() {
        //读取从ProductHome组件携带过来的state数据
        const {name,price,imgs,detail,desc,} = this.props.location.state.product
        const {cName1,cName2} = this.state
        console.log('读取从ProductHome组件携带过来的state数据', this.props.location.state.product)
        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{
                            marginRight: '10px',
                            fontSize: '15px'
                        }}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <Card title={title} className="product-detail" >
                <List>
                    <Item>
                        <span className="left">商品名称：</span>
                        <span>{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述：</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格：</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类：</span>
                        <span>{cName1} {cName2 ? '-->' +cName2 :''}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片：</span>
                        <span>
                            {
                                imgs.map(img=>(
                                    <img
                                    key={img}
                                    className='product-img'
                                    src={BASE_IMG_URL + img}
                                    alt='img'
                                />
                                )
                            )
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html:detail}}>{/* react的属性dangerouslySetInnerHTML */}
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}