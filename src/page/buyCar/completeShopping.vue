<!--完成购物-->
<template>
  <div class="completeShopping">
    <!--购物完成-->
    <div class="first">
      <img class="image" src="../../../static/image/buyCar/buyCar_gouwuche.png" alt="">
      <span class="title">购物完成</span>
    </div>
    <!--步骤条-->
    <div class="second">
      <div class="left">
        <div class="line"></div>
        <img class="image" src="../../../static/image/buyCar/buyCar_one_mr.png" alt="">
        <span class="title">查看购物车</span>
      </div>
      <div class="middle">
        <div class="line"></div>
        <img class="image" src="../../../static/image/buyCar/buyCar_two_mr.png" alt="">
        <span class="title">填写订单信息</span>
      </div>
      <div class="right">
        <div class="line"></div>
        <img class="image" src="../../../static/image/buyCar/buyCar_three_dj.png" alt="">
        <span class="title">完成购物</span>
      </div>
    </div>
    <div class="third">
      <img class="image" src="../../../static/image/buyCar/completePay_succeed.png" alt="">
      <span class="title">购物完成</span>
    </div>
    <div class="fourth">
      <div class="view">
        <div class="line"></div>
        <span class="top">订单号</span>
        <span class="bottom">{{orderInfo.saleOrderCode}}</span>
      </div>
      <div class="view">
        <div class="line"></div>
        <span class="top">支付方式</span>
        <span class="bottom">{{orderInfo.paymentPlatform.text}}</span>
      </div>
      <div class="view">
        <div class="line"></div>
        <span class="top">实际支付金额</span>
        <span class="bottom">{{orderInfo.saleAmount/10000}}元</span>
      </div>
      <div class="view">
        <span class="top">U币数量</span>
        <span class="bottom">{{orderInfo.uxuanPrice}}个</span>
      </div>
    </div>
    <div class="fifth">
      <button class="left" @click="orderDetailClick">查看订单</button>
      <button class="right" @click="backHomeClick">返回首页</button>
    </div>
  </div>
</template>

<script>
  import router from '../../router/index';
  import axios from 'axios';
  export default {
    name: 'completeShopping',
    data() {
      return {
        orderInfo:{}
      }
    },
    created: function(){
      window.scrollTo(0,0);
    },
    mounted(){
       this.getOrderDetail(); 
    },
    methods: {
      orderDetailClick() {
        console.log('查看订单');
        router.push('/personCenter')
      },
      backHomeClick() {
        console.log('返回首页');
        router.push('/')
      },

      //获取订单详情信息
      getOrderDetail() {
        let vm=this,saleOrderId=vm.$route.query.code;
        axios.get(`/m/saleOrder/${saleOrderId}`)
        .then(function(res){
          vm.orderInfo=res.data.data;
        })
        .catch(function (err) { 
            console.log(err);
         })
      },
    }
  }
</script>

<style lang="sass">
  @import '../../../static/css/buyCar'
</style>
