import React, {Component} from 'react'
import {Select, Form, Input} from 'antd'
/* 
添加分类的form组件
*/

const Item = Form.Item


class AddForm extends Component {
    componentWillMount(){
        //將form對象通過setForm（）传递给父组件
        this.props.setForm(this.props.form)
    }
    render(){
        const {getFieldDecorator} = this.props.form
        return(
           <Form>
               <Item label='角色名称'>
                   {
                       getFieldDecorator('roleName',{
                           initialValue:'',
                           rules:[
                            {required:true, message:'角色名称必须输入'}
                        ]
                       })(
                        <Input placeholder='请输入角色名称' />
                       )
                   }
               </Item>
             
           </Form>
        )
    }
}

export default Form.create()(AddForm)