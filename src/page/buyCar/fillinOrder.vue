<!--填写订单-->
<template>
    <div class="fillinOrder">
        <!--确认订单-->
        <div class="first">
            <img class="image" src="../../../static/image/buyCar/buyCar_gouwuche.png" alt="">
            <span class="title">确认订单</span>
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
                <img class="image" src="../../../static/image/buyCar/buyCar_two_dj.png" alt="">
                <span class="title">填写订单信息</span>
            </div>
            <div class="right">
                <div class="line"></div>
                <img class="image" src="../../../static/image/buyCar/buyCar_three_mr.png" alt="">
                <span class="title">完成购物</span>
            </div>
        </div>
        <!--收货信息-->
        <div class="address">
            <div class="item">
                <span class="title">收货信息</span>
                <span class="intro">(优选家已与各专业家具物流运输公司达成合作，24h为您提供免费配送服务)</span>
                <button class="addAddress" @click="newAddress">+新建收货地址</button>
            </div>
            <!--地址列表-->
            <el-radio-group v-model="radio">

                <div class="addressList" @mouseenter="enter(index)" @mouseleave="leave" v-for="(item,index) in addressArr" :key='index'>
                    <div class="one">
                        <el-radio :label="index" class="select" style="color:white"></el-radio>
                        <!-- <img src="../../../static/image/buyCar/buyCar_wxz.png" alt="" class="select"  @click="selectClick"> -->
                        <span class="name">{{item.name}}</span>
                        <span class="detail">{{item.province.name}} {{item.city.name}} {{item.area.name}} {{item.address}}</span>
                    </div>
                    <div class="two">
                        <span class="phone">{{item.cellphone}}</span>
                    </div>
                    <div class="three">
                        <button class="default" v-show='showHideList[index].defaulted'>默认</button>
                        <button v-show='showHideList[index].show' class="default" @click="defaultClick(index,item.addressId)">设为默认</button>
                        <div v-show='showHideList[index].show' class="rightButton">
                            <i class="button iconfont icon-bianji" @click="editClick(index,item.addressId)">
                            </i>
                            <span>|</span>
                            <i class="button iconfont icon-552cc15b74087" @click="deleteClick(item.addressId)">
                            </i>
                        </div>
                    </div>
                </div>

            </el-radio-group>
        </div>
        <!--全部商品-->
        <div class="third">
            <div class="left">
                <span class="title">全部商品</span>
                <span class="intro">(下单返U币，1U币=¥0.1，可用于兑换京东、携程、滴滴卡券，抵扣优选家积分商品)</span>
            </div>
            <div class="middle">
                <span class="title">单价</span>
            </div>
            <div class="right">
                <span class="title">数量</span>
            </div>
        </div>
        <!--商品列表-->
        <div class="fourth">
            <div class="list" v-for="(item,index) in account" :key="index">
                <div v-if="item.extType.code ==3">
                    <div class="left">
                        <img :src="item.productImage" alt="" class="image">
                        <span class="title">{{item.productName}}</span><span class="intro" v-if="item.productAttributes.length==0">颜色：原木色</span>
                        <span v-if="item.productAttributes.length>0" class="intro">颜色：{{item.productAttributes[1].attribute2Value}}</span>
                    </div>
                    <div class="middle">
                        <span class="title">￥{{item.finalPrice/10000}}</span>
                    </div>
                </div>
                <div v-if="item.extType.code ==51">
                    <div class="left">
                        <img :src="item.extObj.aipPack.image" alt="" class="image">
                        <span class="title">{{item.extObj.aipPack.aipName}}</span>
                        <span class="intro">风格：{{item.extObj.aipPack.styleTag.name}}</span>
                    </div>
                    <div class="middle">
                        <span class="title">￥{{item.extObj.aipPack.aipPrice/10000}}</span>
                    </div>
                </div>
                
                <div class="right">
                    <p class="num">x{{item.number}}</p>
                </div>
            </div>
        </div>
        <!--支付-->
        <div class="fifth">
            <div class="left">
                <div class="one">
                    <span class="num">共{{sumTotal}}件商品：</span>
                    <span class="price">¥ {{priceTotal/10000}}</span>
                </div>
                <div class="two">运费：¥0.00</div>
                <div class="two">返还优惠：</div>
            </div>
            <div class="right">
                <button class="pay" @click="fullPayClick">去支付</button>
            </div>
        </div>
        <!--添加收货地址-->
        <div v-if="dialogVisible" class="addAddressModule">
            <el-dialog :before-close="closeAddAddress" :close-on-click-modal="false" :visible.sync="dialogVisible">
                <com-add-address  @defaultSet='defaultSet'></com-add-address>
            </el-dialog>
        </div>
        
        <!--选择支付方式-->
        <el-dialog v-if="dialogVisible2" :before-close="closeSelectPay" :close-on-click-modal="false" :visible.sync="dialogVisible2">
            <comSelectPay page='fillinOrder' @closeSelectPayView="closeSelectPayView"></comSelectPay>
        </el-dialog>
    </div>
</template>

<script>
import AddAddress from "../../page/buyCar/addAddress.vue";
import SelectPay from "../../page/buyCar/selectPay.vue";
import store from "../../store/store";
import api from "../../api/api";
import router from "../../router/index";
import axios from "axios";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      account: [],
      sumTotal: 0,
      priceTotal: 0,
      addressArr: [],
      radio: 0,
      showHideList: [],
      defaulted: false,
      thisAddress: {},
      addressId: 0
    };
  },
  components: {
    comAddAddress: AddAddress,
    comSelectPay: SelectPay
  },
  created: function() {
    this.getAddressList();

    window.scrollTo(0, 0);
    this.account = this.$store.state.account;
    console.log(this.account);
    let totalArr = this.$store.state.account.map(
      item => (item.selected ? +item.number : 0)
    );
    this.sumTotal = totalArr.length && totalArr.reduce((v1, v2) => v1 + v2);
    let priceArr = this.$store.state.account.map(
      function(item) {
          if (item.selected) {
            if (item.extType.code == 51) {
              return +item.extObj.aipPack.aipPrice*item.number;
            } else {
              return +item.number * item.finalPrice;
            }
          }else{
              return 0;
          }
        }
    );
    this.priceTotal = priceArr.length && priceArr.reduce((v1, v2) => v1 + v2);
  },
  methods: {
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
                vm.radio = i;
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
    //子组件传了是否设置默认
    defaultSet(addressId, value) {
      if (value) {
        for (var key in this.showHideList) {
          this.showHideList[key].defaulted = false;
        }
        this.defaultAddressSet(addressId);
      }

     //this.getAddressList();
      //关闭添加收货地址组件;
      this.dialogVisible = false;
    },

    //新建地址
    newAddress() {
      this.dialogVisible = true;
      this.$store.commit("editAddress", null);
    },

    selectClick() {
      alert("选择");
    },

    deleteClick(id) {
      let vm = this;
      axios.delete(api.baseURL + "/" + api.addressUrl + "/" + id)
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

    //支付
    fullPayClick() {
      //把地址id和商品id存起来

      //商品id
      let shoppingIdArr = this.account.map(function(item) {
        return item.shoppingCartId;
      });
      let shoppingId = shoppingIdArr.toString(",");
      this.$store.commit("shoppingId", shoppingId);

      // 地址id
      let addressId = this.addressArr[this.radio].addressId;
      this.$store.commit("addressId", addressId);

      //总价格
      this.$store.commit("shoppingPrice", this.priceTotal);
      //全额支付
      this.dialogVisible2 = true;
    },
    defaultClick(index, addressId) {
      this.showHideList[index].show = false;
      for (var key in this.showHideList) {
        this.showHideList[key].defaulted = false;
      }
      this.showHideList[index].defaulted = true;

      //设为默认地址
      this.defaultAddressSet(addressId);
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
      this.$store.commit("editAddress", this.thisAddress);
      this.dialogVisible = true;
    },

    closeAddAddress(done) {
      done();
    },
    closeSelectPay(done) {
      done();
    },
    // closeAddAddressView(data) {
    //   this.addressArr.push({});
    //   this.addressArr.pop();
    //   //关闭添加收货地址组件;
    //   this.dialogVisible = false;
    //   this.getAddressList();
    // },
    closeSelectPayView(data) {
      //关闭选择支付方式组件
      this.dialogVisible2 = data;
      router.push("/completeShopping");
    }
  }
};
</script>

<style scoped lang="sass">
  @import '../../../static/css/buyCar'
</style>

