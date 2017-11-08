/**
 * Created by superman on 17/2/16.
 */
import Vue from 'vue'
import * as types from './types'
export default {
    state: {
        //该状态修改的是登陆组件的显示或隐藏
        login:JSON.parse(localStorage.getItem('login'))||false,
        user: JSON.parse(localStorage.getItem('user'))||{},
        token: localStorage.getItem('token')||null,
        title: '',
        account:JSON.parse(localStorage.getItem('account'))||[],
        editAddress:{},
        shoppingIdString:'',
        addressIdOne:'',
        totalPrice:0,
        shoppingNum:JSON.parse(localStorage.getItem('shoppingNumber')) || 0,
        payContent:{}
    },
    mutations: {
        [types.LOGIN](state, data){
            localStorage.token = data;
            state.token = data;
            localStorage.setItem('login',true);

        },
        [types.LOGOUT](state){
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            localStorage.removeItem('login');

            state.token = null
        },
        [types.TITLE](state, data){
          state.title = data;
        },

        //用户信息 
        [types.USER](state,data){
          localStorage.setItem('user',JSON.stringify(data));
          state.user=data;
        },
        //购买信息
        [types.ACCOUNT](state,data){
           localStorage.setItem('account',JSON.stringify(data));
           state.account=data;
        },
        //编辑用户地址
        [types.EDITADDRESS](state,data){
            state.editAddress=data;
         },
        //存储购物商品id
        shoppingId(state,data){
             state.shoppingIdString = data;
        },
        //提交订单时用户地址id  
        addressId(state,data){
              state.addressIdOne = data;
        },
        //总价格
        shoppingPrice(state,data){
              state.totalPrice = data;
        },
        //商品数量
        shoppingSum(state,data){
            localStorage.setItem('shoppingNumber',JSON.stringify(data));
            state.shoppingNum = data;
        },
        //支付信息
        payInfo(state,data){
            state.payContent = data;
        }


    }
}
