import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import ProductHome from './home'
import ProductAddUpdate from './addupdate'
import ProductDetail from './detail'
import './product.less'

/* 商品路由 */

export default class Product extends Component{
    render(){
        return(
           <Switch>
               <Route path='/product' exact component={ProductHome}/>
               <Route path='/product/addupdate' component={ProductAddUpdate}/>
               <Route path='/product/detail' component={ProductDetail}/>
               <Redirect to='/product'/>
           </Switch>
        )
    }
}