import React, {Component} from 'react'
import {Form, Input} from 'antd'
/* 
添加分类的form组件
*/

const Item = Form.Item


  
class Updateform extends Component {
  /*   constructor(props){
        super(props)
    } */

    componentWillMount(){
        //將form對象通過setForm（）传递给父组件
        this.props.setForm(this.props.form)
    }

    render(){
        const {getFieldDecorator} = this.props.form
        const {categoryName} = this.props
        console.log('dddd',categoryName)
        return(
           <Form
           >
               <Item>
                   {
                       getFieldDecorator('categoryName',{
                           initialValue: categoryName,
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

export default Form.create()(Updateform)