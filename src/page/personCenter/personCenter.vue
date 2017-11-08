<!--个人中心-->
<template>
  <div class="personpage">
    <com-person></com-person>
    <section>
      <div class="img">
        <img :src="userInfo.photo" alt="">
      </div>
      <div class="name">
        {{userInfo.nickname}}
      </div>
    </section>
    <section>
      <div class="address">
        <h2>我的收货地址:</h2>
        <div>
          <ul class="addressList" >
            <li @mouseenter="enter(index)" @mouseleave="leave" v-for="(item,index) in addressArr" :key="index">
              <span>{{item.name}}</span>
              <span>{{item.province.name}} {{item.city.name}} {{item.area.name}} {{item.address}}</span>
              <span class="default" v-show='showHideList[index].defaulted' @click="defaultClick"  >默认</span>
              <span class="default" v-show='showHideList[index].show' @click="defaultClick(index,item.addressId)">设为默认</span>
              <span v-show='showHideList[index].show'>
                         <i @click="editClick(index,item.addressId)" class="iconfont icon-bianji"></i>
                         <i>|</i>
                         <i @click="deleteClick(item.addressId)" class="iconfont icon-552cc15b74087"></i>
               </span>
            </li>
          </ul>
        </div>
        <div class="add" @click="addAddress">
          添加新的收获地址
        </div>
      </div>
      <div>
        <h2>可用U币</h2>
        <div>
          &yen;{{myPoint.consumablePoint/10000}}
        </div>
        <div>
          (下单返U币，1U币=&yen;0.1,可用于兑换京东，携程，滴滴卡卷，抵扣优选家积分商城)
        </div>
      </div>
    </section>
    <section>
      <!--订单筛选-->
      <div class="selectOrder">
        <button v-bind:class="{active:saleOrderListSeen}" @click="saleOrderListSeen=true;paymentPending=false;forTheGoods=false;toEvaluate=false">全部订单</button>
        <button v-bind:class="{active:paymentPending}" @click="saleOrderListSeen=false;paymentPending=true;forTheGoods=false;toEvaluate=false">待付款</button>
        <button v-bind:class="{active:forTheGoods}" @click="saleOrderListSeen=false;paymentPending=false;forTheGoods=true;toEvaluate=false">待收货</button>
        <button v-bind:class="{active:toEvaluate}" @click="saleOrderListSeen=false;paymentPending=false;forTheGoods=false;toEvaluate=true">待评价</button>
      </div>
    </section>
    <section class="orderList">
      <!--订单列表-->
      <div class="list" v-for="(item,index) in saleOrderList" v-show="saleOrderListSeen">
        <div class="top">
          <div class="intro">
            <div class="price">套餐价格：&yen;{{item.saleAmount/10000}}</div>
            <div class="detail">订单号：{{item.saleOrderId}}</div>
            <div class="detail">收货信息：{{item.receiveName}}/{{item.receiveCellphone}}/{{item.receiveAddressFinal}}</div>
            <div class="detail">下单时间：{{item.createTime}}</div>
          </div>
          <div class="right">
            <div>订单状态：{{item.saleOrderStatus.text}}</div>
            <div class="static" v-show="item.saleOrderStatus.code==3020||item.saleOrderStatus.code==3021">正在配货中...</div>
            <div class="static" v-show="item.saleOrderStatus.code==3018">贷款审批中</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="pay(item.saleOrderId,item.saleOrderPayments[0].paymentCode)">去支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3015">重新支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3016">支付尾款</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="delSaleOrder(item.saleOrderId)">取消订单</div>
            <div class="active" v-show="item.saleOrderStatus.code==3090">确认收货</div>
            <div class="active" v-show="item.saleOrderStatus.code==3900">去评价</div>
            <!--<div>待付款3010\3015\3016</div>-->
            <!--<div>待收货3018\3020\3021\3090</div>-->
            <!--<div>待评价3020\3021\3900</div>-->
          </div>
        </div>
        <div class="bottom" @click="toDetailClick(item.saleOrderId)" v-for="sonItem in item.saleOrderItems">
          <div>
            <img class="introImage" v-bind:src="sonItem.fullPath" alt="">
          </div>
          <div class="introLeft">
            <div>
              <span class="title">{{sonItem.productNames}}</span>
              <span>&yen;{{sonItem.orderPrice/10000}}×{{sonItem.quantity}}件</span>
            </div>
            <div>
              <span class="second">{{sonItem.productInfomation}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--根据订单的状态来筛选待付款订单-->
      <div class="list"  v-show="paymentPending&&item.saleOrderStatus.code==(3010||3015||3016)" v-for="(item,index) in saleOrderList">
        <div class="top">
          <div class="intro">
            <div class="price">套餐价格：&yen;{{item.saleAmount/10000}}</div>
            <div class="detail">订单号：{{item.saleOrderId}}</div>
            <div class="detail">收货信息：{{item.receiveName}}/{{item.receiveCellphone}}/{{item.receiveAddressFinal}}</div>
            <div class="detail">下单时间：{{item.createTime}}</div>
          </div>
          <div class="right">
            <div>订单状态：{{item.saleOrderStatus.text}}</div>
            <div class="static" v-show="item.saleOrderStatus.code==3020||item.saleOrderStatus.code==3021">正在配货中...</div>
            <div class="static" v-show="item.saleOrderStatus.code==3018">贷款审批中</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="pay(item.saleOrderId,item.saleOrderPayments[0].paymentCode)">去支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3015">重新支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3016">支付尾款</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="delSaleOrder(item.saleOrderId)">取消订单</div>
            <div class="active" v-show="item.saleOrderStatus.code==3090">确认收货</div>
            <div class="active" v-show="item.saleOrderStatus.code==3900">去评价</div>
          </div>
        </div>
        <div class="bottom" @click="toDetailClick(item.saleOrderId)" v-for="sonItem in item.saleOrderItems">
          <div>
            <img class="introImage" v-bind:src="sonItem.fullPath" alt="">
          </div>
          <div class="introLeft">
            <div>
              <span class="title">{{sonItem.productNames}}</span>
              <span>&yen;{{sonItem.orderPrice/10000}}×{{sonItem.quantity}}件</span>
            </div>
            <div>
              <span class="second">{{sonItem.productInfomation}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--待收货订单-->
      <div class="list"  v-show="forTheGoods&&item.saleOrderStatus.code==(3020||3021||3090)" v-for="(item,index) in saleOrderList">
        <div class="top">
          <div class="intro">
            <div class="price">套餐价格：&yen;{{item.saleAmount/10000}}</div>
            <div class="detail">订单号：{{item.saleOrderId}}</div>
            <div class="detail">收货信息：{{item.receiveName}}/{{item.receiveCellphone}}/{{item.receiveAddressFinal}}</div>
            <div class="detail">下单时间：{{item.createTime}}</div>
          </div>
          <div class="right">
            <div>订单状态：{{item.saleOrderStatus.text}}</div>
            <div class="static" v-show="item.saleOrderStatus.code==3020||item.saleOrderStatus.code==3021">正在配货中...</div>
            <div class="static" v-show="item.saleOrderStatus.code==3018">贷款审批中</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="pay(item.saleOrderId,item.saleOrderPayments[0].paymentCode)">去支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3015">重新支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3016">支付尾款</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="delSaleOrder(item.saleOrderId)">取消订单</div>
            <div class="active" v-show="item.saleOrderStatus.code==3090">确认收货</div>
            <div class="active" v-show="item.saleOrderStatus.code==3900">去评价</div>
          </div>
        </div>
        <div class="bottom" @click="toDetailClick(item.saleOrderId)" v-for="sonItem in item.saleOrderItems">
          <div>
            <img class="introImage" v-bind:src="sonItem.fullPath" alt="">
          </div>
          <div class="introLeft">
            <div>
              <span class="title">{{sonItem.productNames}}</span>
              <span>&yen;{{sonItem.orderPrice/10000}}×{{sonItem.quantity}}件</span>
            </div>
            <div>
              <span class="second">{{sonItem.productInfomation}}</span>
            </div>
          </div>
        </div>
      </div>
      <!--待评价订单-->
      <div class="list"  v-show="toEvaluate&&item.saleOrderStatus.code==(3900)" v-for="(item,index) in saleOrderList">
        <div class="top">
          <div class="intro">
            <div class="price">套餐价格：&yen;{{item.saleAmount/10000}}</div>
            <div class="detail">订单号：{{item.saleOrderId}}</div>
            <div class="detail">收货信息：{{item.receiveName}}/{{item.receiveCellphone}}/{{item.receiveAddressFinal}}</div>
            <div class="detail">下单时间：{{item.createTime}}</div>
          </div>
          <div class="right">
            <div>订单状态：{{item.saleOrderStatus.text}}</div>
            <div class="static" v-show="item.saleOrderStatus.code==3020||item.saleOrderStatus.code==3021">正在配货中...</div>
            <div class="static" v-show="item.saleOrderStatus.code==3018">贷款审批中</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="pay(item.saleOrderId,item.saleOrderPayments[0].paymentCode)">去支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3015">重新支付</div>
            <div class="active" v-show="item.saleOrderStatus.code==3016">支付尾款</div>
            <div class="active" v-show="item.saleOrderStatus.code==3010" @click="delSaleOrder(item.saleOrderId)">取消订单</div>
            <div class="active" v-show="item.saleOrderStatus.code==3090">确认收货</div>
            <div class="active" v-show="item.saleOrderStatus.code==3900">去评价</div>
          </div>
        </div>
        <div class="bottom" @click="toDetailClick(item.saleOrderId)" v-for="sonItem in item.saleOrderItems">
          <div>
            <img class="introImage" v-bind:src="sonItem.fullPath" alt="">
          </div>
          <div class="introLeft">
            <div>
              <span class="title">{{sonItem.productNames}}</span>
              <span>&yen;{{sonItem.orderPrice/10000}}×{{sonItem.quantity}}件</span>
            </div>
            <div>
              <span class="second">{{sonItem.productInfomation}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dialogVisible" class="addAddressModule">
        <!-- 添加收货地址 -->
        <el-dialog :before-close="closeAddAddress" :close-on-click-modal="false" :visible.sync="dialogVisible">
          <com-add-address @defaultSet='defaultSet'  @closeAddAddressView="closeAddAddressView"></com-add-address>
        </el-dialog>
      </div>
       <!-- 支付 -->
        <!--选择支付方式-->
        <el-dialog v-if="dialogVisible2" :before-close="closeSelectPay" :close-on-click-modal="false" :visible.sync="dialogVisible2">
            <comSelectPay page='personCenter' @closeSelectPayView="closeSelectPayView"></comSelectPay>
        </el-dialog>
    </section>
  </div>
</template>
<style lang="sass">
  @import '../../../static/css/personCenter'
</style>
<script>
import AddAddress from "../../page/buyCar/addAddress.vue";
import personCenterNav from "../../components/personCenterNav";
import router from "../../router/index";
import api from "../../api/api";
import axios from "axios";
import selectPay from '../buyCar/selectPay.vue';
export default {
  data() {
    return {
      userInfo: {},
      dialogVisible: false,
      addressArr: [],
      showHideList: [],
      saleOrderList: '',
      operation: '',
      saleOrderListSeen: true,
      paymentPending: false,
      forTheGoods: false,
      toEvaluate: false,
      myPoint: '',
      active: true,
      dialogVisible2:false
    };
  },
  components: {
    comPerson: personCenterNav,
    comAddAddress: AddAddress,
    comSelectPay:selectPay
  },
  created: function() {
    this.getSaleOrderList();
    this.userInfo = this.$store.state.user;
    this.getAddressList();
    this.getMyPoint();
  },
  methods: {
    //点击查看订单详情
      toDetailClick(id) {
        router.push({path:'/orderDetail',query:{saleOrderId:id}})
      },
    closeAddAddress(done) {
      done();
    },
    //弹出新增地址
    addAddress() {
      this.dialogVisible = true;
      this.$store.commit("editAddress", null);
    },
    //获取用户U币
    getMyPoint(){
      let vm=this;
      api.getMyPoint().then(function(res){
        vm.myPoint=res.data.data;
        console.log(vm.myPoint);
      })
    },
    //获取用户地址列表
    getAddressList() {
      let vm = this;
      api.addressList()
        .then(function(res) {
          if (res.data.code === "200") {
            vm.addressArr = res.data.data;
            for (var key in vm.addressArr) {
              vm.showHideList.push({ show: false, defaulted: false });
            }
            for (var i = 0; i < vm.addressArr.length; i++) {
              if (vm.addressArr[i].defaultStatus.code == 1) {
                vm.showHideList[i].defaulted = true;
              }
            }
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //切换默认地址
    enter(index) {
      if (!this.showHideList[index].defaulted)
        this.showHideList[index].show = true;
    },

    leave() {
      for (var key in this.showHideList) {
        this.showHideList[key].show = false;
      }
    },
    defaultClick(index,addressId) {
      this.showHideList[index].show = false;
      for (var key in this.showHideList) {
        this.showHideList[key].defaulted = false;
      }
      this.showHideList[index].defaulted = true;
      //设为默认地址
      this.defaultAddressSet(addressId);
    },
    //组件设为默认处理
    defaultSet(addressId, value) {
      if (value) {
        for (var key in this.showHideList) {
          this.showHideList[key].defaulted = false;
        }

        this.defaultAddressSet(addressId);
      }

      //关闭添加收货地址组件;
      this.dialogVisible = false;
    },
     //设为默认地址
    defaultAddressSet(addressId) {
      let vm = this;
      axios.put(api.baseURL + "/m/customer/defaultAddress/" + addressId)
        .then(function(res) {
          if (res.data.code === "200") {
            // console.log("设为默认")
            vm.getAddressList();
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //修改用户地址
    editClick(index, id) {
      this.thisAddress = this.addressArr[index];
      this.thisAddress.edit = true;
      this.$store.commit("editAddress", this.thisAddress);
      this.dialogVisible = true;
    },
    //删除用户地址
    deleteClick(id) {
      let vm = this;
      axios
        .delete(api.baseURL + "/" + api.addressUrl + "/" + id)
        .then(function(res) {
          if (res.data.code === "200") {
            alert("删除成功");
            vm.getAddressList();
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
     //获取用户的全部订单列表
      getSaleOrderList() {
        let vm=this;
        api.getSaleOrderList().then(function(res){
          vm.saleOrderList=res.data.data.items;
          if(vm.saleOrderList.saleOrderItems==null || (vm.saleOrderList.saleOrderItems != null && vm.saleOrderList.saleOrderItems.length == 0)){
            vm.saleOrderList.forEach(function(value){
              value.saleOrderItems.forEach(function(value){
                value.fullPath=api.baseURL+'/image'+value.productImage;
                if(value.productSpec!=='{}'){
                  value.productInfo=JSON.parse(value.productSpec);
                  value.productInfomation='';
                  for (let i in value.productInfo){
                    value.productInfomation+=i+'：'+value.productInfo[i]+'；';
                  }
                }
              })
            });
          }
        })
      },
      //取消订单
      delSaleOrder(id) {
        let vm=this;
        axios.put(`/m/saleOrder/${id}/status`,{
          "saleOrderStatus":"CANCELLED",
          "note":"取消订单"
        }).then(function(res){
          if(res.status){
            const h = vm.$createElement;
            vm.$notify({
              title: '温馨提示',
              message: h('i', { style: 'color: teal'}, '恭喜您，订单取消成功')
            });
            vm.getSaleOrderList();
          }
        })
      },

    //去支付
    pay(saleOrderId,saleOrderCode){
        //把支付的信息存起来
        this.$store.commit('payInfo',{
            saleOrderId:saleOrderId,
            saleOrderCode:saleOrderCode
        })
        this.dialogVisible2 = true;
    },
     closeSelectPayView(data) {
      //关闭选择支付方式组件
      this.dialogVisible2 = data;
      router.push("/completeShopping");
    },
    closeAddAddress(done) {
      done();
    },
    closeSelectPay(done) {
      done();
    },
  }
};
</script>

