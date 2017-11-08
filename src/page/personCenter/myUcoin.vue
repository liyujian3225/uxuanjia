<!--我的U币 2017.10.10李雨健-->
<template>
  <div class="myUcoin">
    <com-person></com-person>
    <!--个人资料-->
    <div class="head">
      <div>
        <img class="image" v-bind:src='usePhoto' alt="">
      </div>
      <div>
        {{useInfo.nickname}}
      </div>
    </div>
    <!--U币金额-->
    <div class="price">
      <div class="top">
        <span class="title1">U币金额</span>
        <router-link to="/integralmall">进入积分商城兑换</router-link>
      </div>
      <div class="bottom">
        <div class="group">
          <span class="item">可用U币</span>
          <span class="number">&yen;{{myPoint.consumablePoint/10000}}</span>
        </div>
        <div class="line"></div>
        <div class="group">
          <span class="item">待返U币</span>
          <span class="number">&yen;{{myPoint.returnPoint/10000}}</span>
          <a href="javascript:;" @click="seen=true">?</a>
        </div>
      </div>
    </div>
    <!--U币是什么-->
    <div class="money" v-if="seen">
      <div>
        <h3>U币是什么</h3>
        <p>U币是用户在优选家平台购买家具单品、空间套餐商品，订单正常结束后，即确认收货后，补贴的积分卷，1U币=1.0&yen;，永久有效，您可以使用它来兑换京东、携程、地滴电子卡卷！</p>
        <h3>U币生效规则</h3>
        <p>订单正常完成后，即确认验收完毕，根据本次订单实际补贴额度，确定分期，次月起每月返还补贴。</p>
        <h3>分期返还额度规则</h3>
        <p>每期补贴U币=实际补贴额度/期数</p>
        <div @click="closeMoney">
          +
        </div>
      </div>
    </div>
    <!--获得U币-->
    <div class="getUcoin">
      <div>
        <h3>近三个月待返U币：<span>&yen;{{willReturnTotal}}</span></h3>
        <div>
          <div v-for="item in willReturn">
            <div>2017-9-9</div>
            <div>+&yen;0.00</div>
          </div>
        </div>
      </div>
      <div>
        <h3>近三个月已兑换U币：<span>&yen;{{totalQuantity/10000}}</span></h3>
        <div>
          <div v-for="item in pointConsume">
            <div>{{item.reMonth}}</div>
            <div>&yen;{{item.totalQuantity/10000}}</div>
          </div>
        </div>
      </div>
    </div>
    <!--U币明细-->
    <div class="detail">
      <div class="top">
        <span class="title" @click="tableOne=true;tableTwo=false;tableThree=false" v-bind:class="{active:tableOne}">返现详情</span>
        <span class="title" @click="tableOne=false;tableTwo=true;tableThree=false" v-bind:class="{active:tableTwo}">兑换详情</span>
        <span class="title" @click="tableOne=false;tableTwo=false;tableThree=true" v-bind:class="{active:tableThree}">待返详情</span>
      </div>
      <table class="listOne" v-if="tableOne">
        <tr class="tableHeader">
          <th>时间</th>
          <th>已返U币</th>
          <th>总期数</th>
          <th>剩余期数</th>
          <th>详细说明</th>
        </tr>
        <tr class="tableBody" v-for="item in myPointEnable">
          <td>{{item.createTime}}</td>
          <td>&yen;{{item.bizObj.quantity/10000}}</td>
          <td>{{item.bizObj.total}}期</td>
          <td>{{item.bizObj.current}}期</td>
          <td>订单号{{item.flowNum}}</td>
        </tr>
        <tr class="tableBody">
          <td colspan="5">
            <div class="moreInf" @click="morePointEnableInfo">
              {{message}}
            </div>
          </td>
        </tr>
      </table>
      <table class="listTwo" v-if="tableTwo">
        <tr class="tableHeader">
          <th>时间</th>
          <th>U币兑换</th>
          <th>详细说明</th>
        </tr>
        <tr class="tableBody" v-for="item in myPointExchange">
          <td>{{item.createTime}}</td>
          <td>&yen;{{item.quantity/10000}}</td>
          <td>订单号{{item.flowNum}}</td>
        </tr>
        <tr class="tableBody">
          <td colspan="3">
            <div class="moreInf" @click="morePointExchangeInfo">
              {{message}}
            </div>
          </td>
        </tr>
      </table>
      <table class="listThree" v-if="tableThree">
        <tr class="tableHeader">
          <th>时间</th>
          <th>待返U币</th>
          <th>总期数</th>
          <th>剩余期数</th>
          <th>详细说明</th>
        </tr>
        <tr class="tableBody" v-for="item in MyPointGet">
          <td>{{item.createTime}}</td>
          <td>&yen;{{item.quantity/10000}}</td>
          <td>5期</td>
          <td>4期</td>
          <td>订单号{{item.flowNum}}</td>
        </tr>
        <tr class="tableBody">
          <td colspan="5">
            <div class="moreInf" @click="morePointGetInfo">
              {{message}}
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import personCenterNav from '../../components/personCenterNav'
  import api from '../../api/api'
  export default {
    name: 'myUcoin',
    data() {
      return {
        seen: false,
        tableOne: true,
        tableTwo: false,
        tableThree: false,
        myPoint: '',
        willReturn: '',//用户近三月内待返U币
        willReturnTotal:0,//用户近三月内待返U币总和
        pointConsume: '',//用户近三月U币兑换记录
        totalQuantity: 0,//用户近三月U币兑换总和
        myPointExchange: '',//用户的U币兑换详情
        myPointEnable: '',//用户的U币返还详情
        MyPointGet: '',//用户的U币获得详情
        useInfo: '',
        usePhoto: '',
        limit:5,
        message: '点击查看更多详情'
      }
    },
    components: {
      comPerson: personCenterNav
    },
    created: function () {
      window.scrollTo(0, 0);
      this.getMyPoint();
      this.getMyPointExchangeInfo(5);
      this.getMyPointEnableInfo(5);
      this.getMyPointGetInfo(5);
      this.$store.state.login &&  this.getUserInfo();
      this.getWillReturn();
      this.getPointConsume();
    },
    methods: {
      closeMoney(){
        this.seen=false;
      },
      //获取用户的信息
      getUserInfo(){
        let vm = this;
        api.userInfo()
          .then(function (res) {
            vm.useInfo=res.data.data;
            vm.usePhoto=api.baseURL + '/image' + vm.useInfo.photo;
          })
      },
      //获取用户U币
      getMyPoint(){
        let vm=this;
        api.getMyPoint().then(function(res){
          vm.myPoint=res.data.data;
        })
      },
      //获取用户三个月内的待返U币
      getWillReturn(){
        let vm=this;
        api.getWillReturn().then(function(res){
          console.log('近三月内的待返U币：');
          console.log(res.data.data);
          vm.willReturn=res.data.data;
        })
      },
      //获取用户三个月内的U币兑换记录
      getPointConsume(){
        let vm=this;
        api.getPointConsume().then(function(res){
          console.log('近三月内的U币兑换记录：');
          vm.pointConsume=res.data.data;
          vm.pointConsume.forEach(function(value){
            vm.totalQuantity+=value.totalQuantity;
          });
        })
      },
      //获取用户的U币兑换详情
      getMyPointExchangeInfo(limit){
        let vm=this;
        api.getMyPointExchangeInfo({
          params: {
            'limit':limit
          }
        }).then(function(res){
          vm.myPointExchange=res.data.data.items;
        })
      },
      //再多获取5条U币兑换详情
      morePointExchangeInfo(){
        let vm=this;
        vm.limit+=5;
        vm.getMyPointEnableInfo(vm.limit)
      },
      //获取用户的U币返还详情
      getMyPointEnableInfo(limit){
        let vm=this;
        api.getMyPointEnableInfo({
          params: {
            'limit':limit
          }
        }).then(function(res){
          vm.myPointEnable=res.data.data.items;
          console.log('近三月内的返现闲情：');
          console.log(res.data.data)
        })
      },
      //再多获取5条U币返还详情
      morePointEnableInfo(){
        let vm=this;
        vm.limit+=5;
        vm.getMyPointEnableInfo(vm.limit)
      },
      //获取用户的U币获得详情
      getMyPointGetInfo(limit){
        let vm=this;
        api.getMyPointGetInfo({
          params: {
            'limit':limit
          }
        }).then(function(res){
          vm.MyPointGet=res.data.data.items;
        })
      },
      //再多获取5条U币获得详情
      morePointGetInfo(){
        let vm=this;
        vm.limit+=5;
        vm.getMyPointGetInfo(vm.limit)
      }
    }
  }
</script>

<style lang="sass">
  @import '../../../static/css/myUcoin'
</style>

