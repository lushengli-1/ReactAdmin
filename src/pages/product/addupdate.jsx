import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddProduct,reqUpdateProduct} from '../../api'
import PicturesWall from './pictureswall'
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input
/* 产品的添加和修改的子路由组件 */
class ProductAddUpdate extends Component {
   constructor(props){
       super(props)
       this.state = {
        options:[]
    }
    //创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef()
    this.editor = React.createRef()
   }
   
    //初始化options
    initOptions = async(categorys) => {
        //根据categorys生成options数组
      const options =  categorys.map(c => ({ //返回一个对象
            value: c._id,
            label: c.name,
            isLeaf: false, //不是叶子
        })) 

        //如果是一个二级分类商品的更新
        const {isUpdate, product} = this
        const {pCategoryId} = product
        if(isUpdate && pCategoryId !== '0'){
            //获取对应的二级分类列表
           const subCategorys = await this.getCategorys(pCategoryId)
           //生成二级下拉列表的options
           const childOptions = subCategorys.map(c => ({
               value: c._id,
               label: c.name,
               isLeaf: true
           }))
           //找到当前商品对应的一级option对象
           const targetOption = options.find(option => option.value === pCategoryId)
           //关联到对应的一级option上去
           targetOption.children = childOptions
        }


        //更新options状态
        this.setState({
            options
        })
    }

    //提交表单
    submit = () => {
        //进行表单验证，如果通过了，才发送请求
        this.props.form.validateFields(async(err, value) => {
            if (!err) {
                //验证通过

                //1.收集数据 并封装成product对象
                let  {name, desc,price, categoryIds} = value
                let pCategoryId, categoryId
                if(categoryIds.length === 1){
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                }else{
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                //访问ref获取到PicturesWall组件传过来的getImgs()方法
                const imgs = this.pw.current.getImgs()
                //通过ref获取到RichTextEditor（商品详情）组件的.getDetail()方法
                const detail = this.editor.current.getDetail()

                let product = { //封装一个product对象传给reqAddOrUpdateProduct方法获取后台数据
                    name,desc,price,imgs,detail,pCategoryId,categoryId}

                // 如果是更新，需要添加_id
                if(this.isUpdate){
                    let _id = this.product._id
                    let product = { //封装一个product对象传给reqAddOrUpdateProduct方法获取后台数据
                        name,desc,price,imgs,detail,pCategoryId,categoryId,_id}
                    const result = await reqUpdateProduct(product)
                    if(result.status === 0){
                        message.success('更新商品品成功')
                        this.props.history.goBack()
                    }else{
                        message.error('更细商品失败')
                    }
                }else{
                     //2.调用接口请求函数去添加
                    const result = await reqAddProduct(product)
                    if(result.status === 0){
                        message.success('添加商品品成功')
                        this.props.history.goBack()
                    }else{
                        message.error('添加商品失败')
                    }
                }
                //3.根据结果提示
                

            }
        })
    }

     /* 
        异步获取一级/二级分类列表，并显示
        async函数的返回值是一个新的promise对象，promise的结果和值由async的结果来决定
     */
     getCategorys = async(parentId) => {
        const result = await reqCategorys(parentId)
    
        if(result.status === 0 ){
            const categorys = result.data
            //如果是一级分类列表
            if(parentId === '0'){
                this.initOptions(categorys)
            }else{ //二级列表
                return categorys //返回二级列表 ==》 当前async函数返回的promise就会成功且value为categorys
            }
            
        }
    }

    //自定义验证价格的函数
    validatePrice = (rule,value,callback) => {
        //直接调用callback（）不传任何参数说明验证通过
        //callback('价格必须大于0') 验证没通过
        if(value*1 > 0){//value是字符串，*1转换为number
            callback()
        }else{
            callback('价格必须大于0')
        }
    }

    /* 
        用于加载下一级列表的回调函数
    */
    loadData = async selectedOptions => {
        //得到选择的option对象
        const targetOption = selectedOptions[0]
        targetOption.loading = true //显示loading效果

        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false //隐藏loading效果
        //二级分类列表又数据
        if(subCategorys && subCategorys.length >0){
            //生成一个二级列表的options
         const childOptions =  subCategorys.map(c=>({
                value: c._id,
                label: c.name,
                isLeaf: true, 
            }))
            //关联到当前option上
            targetOption.children = childOptions
        }else{ //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
         //更新options状态
         this.setState({
            options: this.state.options
        })
       
    }

    componentWillMount(){
      const  product =  this.props.location.state 
      console.log('为什么我的product中detaiL不会更新',product)
      //强制转换为bool类型（保存是否更新的标识）
      this.isUpdate = !!product
      //保存商品 如果没有保存的是空对象
      this.product = product || {}
    }

    componentDidMount(){
        this.getCategorys('0')
    }


    render() {

        const {isUpdate, product} = this
        const {pCategoryId, categoryId, imgs,detail} = product
        console.log('我要detail',product)

        //用来接收级联分类Id的数组
        const categoryIds = []
        if(isUpdate){
            //商品是一级分类的商品
            if(pCategoryId === "0"){
                categoryIds.push(categoryId)
            }else{//商品是二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }                    
        }

        //指定Item布局的配置对象
        const layout = {
            labelCol: { span: 3 }, //左侧label的宽度
            wrapperCol: { span: 8 } //指定右侧包裹的宽度
        }
        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{ fontSize: '15px' }} onClick={() => this.props.history.goBack()}/>
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        

        const { getFieldDecorator } = this.props.form
        return (
            <Card title={title}>
                <Form {...layout}>
                    <Item label='商品名称'>
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: '必须输入商品名称' }
                                ]
                            })(
                                <Input placeholder='商品名称' />
                            )
                        }

                    </Item>
                    <Item label='商品描述'>
                        {
                            getFieldDecorator("desc", {
                                initialValue: product.desc,
                                rules: [
                                    { required: true, message: '请输入商品描述' }
                                ]
                            })(
                                <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />
                            )
                        }
                    </Item>
                    <Item label='商品价格'>
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '请输入商品价格' },
                                    {validator:this.validatePrice} //自定义验证价格的函数
                                ]
                            })(
                                <Input type='number' placeholder="请输入商品jiage" addonAfter="元" />
                            )
                        }
                    </Item>
                    <Item label='商品分类'>
                    {
                        getFieldDecorator('categoryIds',{
                            initialValue:categoryIds,
                            rules:[
                                {required: true, message:'必须指定商品分类'}
                            ]
                        })(
                            <Cascader
                            options={this.state.options} /* 需要显示的列表数据数组 */
                            loadData={this.loadData} /* 当选择某个列表项，加载下一级列表的监听回调 */
                         />
                        )
                    }
                    </Item>
                    <Item label='商品图片'>
                    
                        {/*  子组件调用父组件的方法： 将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
                        父组件调用子组件的方法： 在父组件中通过ref得到子组件标签对象（也就是组件对象）调用其方法 */}

                        <PicturesWall ref={this.pw} imgs={imgs}/>
                    </Item>
                    <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
                       <RichTextEditor ref={this.editor} detail={detail}/>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpdate)

