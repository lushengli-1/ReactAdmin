import React, {Component} from 'react'
import {Card, Table, Button, message, Modal,Select,Input,Icon} from 'antd'

import {reqCategorys,reqAddCategory} from '../../api'
import AddForm from './add-form'

import LinkButton from '../../components/link-button'

/* 
商品分类路由
*/

export default class Gategory extends Component{


    state = {
        categorys:[], //一级分类列表
        showStateus:0,  //标识添加/更新的确认框是否显示，0：都不显示，1：显示添加； 2：显示更新
        isloading:false,//是否再获取数据中
        subCategorys:[],//二级分类列表
        parentId: '0',
        parentName:'',
    }
/* 
    异步获取一级/二级分类列表显示
*/
getGategorys = async()=>{
    //发请求前显示loading
    this.setState({
        isloading:true
    })
    const {parentId} = this.state
    const result = await reqCategorys(parentId)
    //请求完成，关闭loading
    this.setState({
        isloading:false
    })
    console.log('一级/二级分类列表',result)
    if(result.status === 0){
        //取出分类数组（可能是一级也可能是二级的）
        const categorys = result.data
        if(parentId==='0'){
            //更新一级分类状态
        this.setState({
            categorys
        })
        }else{
            //更新二级分类状态
            this.setState({
                subCategorys:categorys
            })
        }
        
      
    }else{
       message.error('获取分类列表失败') 
    }
}

ShowSubCategorys = async(category) => {
    //先更新状态
    await this.setState({
        parentId:category._id,
        parentName: category.name
    })
    console.log('获取parentName', this.state.parentName)
    console.log("第二次获取列表的parentID",this.state.parentId)
    //获取二级分类显示
     this.getGategorys()
    
}

/* 显示指定一级分类列表 */
showCategorys = () => {
    //更新为显示一级列表的状态
    this.setState({
        parentId:'0',
        parentName:'',
        subCategorys:[]

    })
}

//打开添加分类弹窗
showAdd = () => {
    this.setState({
        showStateus:1
    })
}

//打开修改分类弹窗
showUpdate = () =>{
    this.setState({
        showStateus:2
    })
}

//关闭弹窗
handleCancel = () =>{
    this.setState({
        showStateus:0
    })
}

//添加分类
addGategory = async() =>{
    const reasult = await reqAddCategory('分类9','0')
    console.log('添加分类',reasult)
}
//测试


// 发异步Ajax请求
    componentDidMount(){
        this.getGategorys()
    }

    render(){
        const {categorys,showStateus,isloading,subCategorys,parentId,parentName} = this.state
        //card的右侧
        console.log('二级分类列表名',parentName)
        const title = parentId==='0'? '一级分类列表':(
            <span>
                <span onClick={this.showCategorys}>一级分类列表</span>
                <span style={{marginLeft:'10px', marginRight:'10px'}}>-></span>
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
               title:'操作',

               width: 300,
               render: (category) => ( // 返回需要显示的界面标签
                   <span>
                       <Button onClick={this.showUpdate}>修改分类</Button>
                       {parentId==='0' ? <Button onClick={() => {this.ShowSubCategorys(category)}}>查看子分类</Button> : null}
                   </span>
               )
           }
          ];
        return(
            <div>
            <Card title={title} extra={extra}>
            <Table 
            rowKey='_id'
            loading={isloading}
            dataSource={parentId==='0' ? categorys: subCategorys} 
            bordered
            columns={columns} 
            pagination={{defaultPageSize: 5, showQuickJumper: true}}
            />
           
          </Card>
          <Modal
            title='添加分类'
            visible={showStateus === 1} 
            onOk = {this.addGategory}
            onCancel={this.handleCancel}
            okText='确定'
            cancelText='取消'
            >
                <AddForm/>
          </Modal>
          <Modal
            title='更新分类'
            visible={showStateus === 2} 
            onOk={this.updateCategory}
            onCancel={this.handleCancel}
            okText='确定'
            cancelText='取消'
            >
         
              <Input style={{width:'100%', marginTop:'20px'}}/>
          </Modal>
          </div>
        )
    }
} 