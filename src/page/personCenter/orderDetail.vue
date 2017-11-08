<!--订单详情-->
<template>
  <div class="orderDetail">
    <com-person></com-person>
    <!--上半部分-->
    <div class="orderIntro">
      <div class="head">
        <div class="left">
          <span class="item1">订单详情</span>
          <span class="item2">订单号：{{orderInfo.saleOrderId}}</span>
        </div>
        <div class="right">
          <span class="item1">单价</span>
          <span class="item2">数量</span>
          <span class="item3">小计</span>
        </div>
      </div>
      <div class="list" v-for="(item,index) in orderInfo.saleOrderItems">
        <div class="left">
          <img class="picture" :src="item.fullPath" alt="">
          <span class="title">{{item.productNames}}</span>
          <span class="intro">{{item.productInfomation}}</span>
        </div>
        <div class="right">
          <span class="item1">{{item.orderPrice/10000}}</span>
          <span class="item2">x{{item.quantity}}</span>
          <span class="item3">{{item.orderPrice/10000*item.quantity}}</span>
        </div>
      </div>
    </div>
    <!--下半部分-->
    <div class="personIntro">
      <div class="left">
        <span class="text">收货人：{{orderInfo.receiveName}}</span>
        <span class="text">收货地址：{{orderInfo.receiveAddress}}</span>
        <span class="text">电话：{{orderInfo.receiveCellphone}}</span>
      </div>
      <!-- <div class="middle">
        <span class="text">物流公司：德邦物流</span>
        <span class="text">物流单号：1234567890987</span>
      </div> -->
      <div class="right">
        <div class="row">
          <span class="item">共{{orderInfo.saleOrderItems.length}}个套餐：</span>
          <span class="content">¥ 1234</span>
        </div>
        <!-- <div class="row">
          <span class="item">运费：</span>
          <span class="content">1111</span>
        </div> -->
        <div class="row">
          <span class="item">返还优币：</span>
          <span class="content">&yen;{{orderInfo.uxuanPrice/1000}}</span>
        </div>
        <!-- <div class="row">
          <span class="item">实际支付：</span>
          <span class="content">¥ 9999</span>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
  import personCenterNav from '../../components/personCenterNav'
  import axios from 'axios'
  import api from'../../api/api'
  export default {
    name: 'orderDetail',
    data() {
      return {
        orderInfo: '',
        orderAddress: ''
      }
    },
    components: {
      comPerson: personCenterNav
    },
    created: function(){
      window.scrollTo(0,0);
      this.getOrderDetail();
      this.getOrderAddress();
    },
    methods:{
      //获取订单详情信息
      getOrderDetail() {
        let vm=this,saleOrderId=vm.$route.query.saleOrderId;
        axios.get(`/m/saleOrder/${saleOrderId}`).then(function(res){
          vm.orderInfo=res.data.data;
          vm.orderInfo.saleOrderItems.forEach(function(value){
            value.fullPath=api.baseURL+'/image'+value.productImage;
            if(value.productSpec!=='{}'){
              value.productInfo=JSON.parse(value.productSpec);
              value.productInfomation='';
              for (let i in value.productInfo){
                value.productInfomation+=i+'：'+value.productInfo[i]+'；';
              }
              console.log(value.productInfomation);
            }
          })

        })

      },
      //获取订单地址信息
      getOrderAddress() {
        let vm=this,saleOrderId=vm.$route.query.saleOrderId;
        axios.get(`/m/saleOrder/shipping/${saleOrderId}`).then(function(res){
          vm.orderAddress=res.data.data;
        })

      }
    }
  }
</script>
<style lang="sass">
  @import '../../../static/css/orderDetail'
</style>
