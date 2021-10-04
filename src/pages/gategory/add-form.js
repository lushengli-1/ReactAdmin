import React, {Component} from 'react'
import {Select, Form, Input} from 'antd'
/* 
添加分类的form组件
*/

const Item = Form.Item
const Option = Select.Option


  
class AddForm extends Component {
    componentWillMount(){
        //將form對象通過setForm（）传递给父组件
        this.props.setForm(this.props.form)
    }
    render(){
        const {getFieldDecorator} = this.props.form
        const {categorys,parentId} = this.props
        console.log('天天天天天',categorys)
        return(
           <Form
           >
               <Item>
                   {
                       getFieldDecorator('parentId',{
                           initialValue:parentId,
                           
                       })(
                        <Select
                            
                        >
                            <Option value='0'>一级分类</Option>
                            {
                                categorys.map((items,index) => <Option value={items._id} key={index}>{items.name}</Option>)
                            }
                        </Select>
                       )
                   }
               </Item>
               <Item>
                   {
                       getFieldDecorator('categoryName',{
                           initialValue:'',
                           rules:[
                            {required:true, message:'分类名称必须输入'}
                        ]
                       })(
                        <Input placeholder='请输入分类名称' />
                       )
                   }
               </Item>
             
           </Form>
        )
    }
}

export default Form.create()(AddForm)