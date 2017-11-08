import Home from '../page/home/home.vue';
import product from '../page/perferred/product.vue';
import spacePackage from '../page/space/spacePackage.vue';
import house from '../page/wholeHouse/house.vue';
import spaceDetails from '../page/space/spaceDetails.vue';
import nav from '../components/nav.vue';
import Vue from 'vue'
import Router from 'vue-router'
import integralmall from '../page/integralmall/integralmall.vue'
import buyCar from '../page/buyCar/buyCar.vue'
import fillinOrder from '../page/buyCar/fillinOrder.vue'
import completeShopping from '../page/buyCar/completeShopping.vue'
import personCenter from '../page/personCenter/personCenter.vue'
import shareOrder from '../page/personCenter/shareOrder.vue'
import orderDetail from '../page/personCenter/orderDetail.vue'
import myUcoin from '../page/personCenter/myUcoin.vue'
import houseDetail from '../page/wholeHouse/houseDetail.vue';
import productDetail from '../page/perferred/productDetail.vue';
import about from '../page/abort/abort.vue'
import pointDetail from '../page/point/pointDetail.vue'


Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        //主页的路由
        {
            path: '/',
            component: Home,
        },

        //购物车的路由
        {
            path: '/buyCar',
            meta: { 
                  requireAuth: true
            },
            component: buyCar,
        },
        //填写订单的路由
        {
            path: '/fillinOrder',
            component: fillinOrder
        },
        //完成购物的路由
        {
            path: '/completeShopping',
            component: completeShopping
        },
        //个人中心的路由
        {
            path: '/personCenter',
            meta: { 
                  requireAuth: true
            },
            component: personCenter
        },
        {
            path: '/nav',
            component: nav,
            children: [
                //优选良品
                {
                    path: '/product',
                    component: product
                },
                //空间套餐
                {
                    path: '/spacePackage',
                    component: spacePackage
                },
                //全屋套餐
                {
                    path: '/house',
                    component: house
                },
                //空间套餐详情
                {
                    path: '/spaceDetails',
                    component: spaceDetails
                },
                //全屋套餐详情
                {
                    path: '/houseDetail',
                    component: houseDetail
                },
                //优选产品详情
                {
                    path: '/productDetail',
                    component: productDetail
                },
                //积分商城的路由
                {
                    path: '/integralmall',
                    component: integralmall
                },
                //关于我们
                {
                    path:'/about',
                    component:about
                }
            ]
        },
        //晒单的路由
        {
            path: '/shareOrder',
            component: shareOrder
        },
        //订单详情的路由
        {
            path: '/orderDetail',
            component: orderDetail
        },
        //我的U币的路由
        {
            path: '/myUcoin',
            component: myUcoin
        },
        //观点详情的路由
        {
            path:'/pointDetail',
            component: pointDetail
        }
    ]
})

