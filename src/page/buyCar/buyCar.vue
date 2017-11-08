<!--购物车-->
<template>
    <div class="buyCar">
        <!--我的购物车-->
        <div class="first">
            <img class="image" src="../../../static/image/buyCar/buyCar_gouwuche.png" alt="">
            <span class="title">我的购物车</span>
        </div>
        <!--步骤条-->
        <div class="second">
            <div class="left">
                <div class="line"></div>
                <img class="image" src="../../../static/image/buyCar/buyCar_one_dj.png" alt="">
                <span class="title">查看购物车</span>
            </div>
            <div class="middle">
                <div class="line"></div>
                <img class="image" src="../../../static/image/buyCar/buyCar_two_mr.png" alt="">
                <span class="title">填写订单信息</span>
            </div>
            <div class="right">
                <div class="line"></div>
                <img class="image" src="../../../static/image/buyCar/buyCar_three_mr.png" alt="">
                <span class="title">完成购物</span>
            </div>
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
            <div class="list" v-for="(item,index) in buyList" :key="index">
                <div v-if="item.extType.code ==3">
                    <div class="left">
                        <el-checkbox v-model="buyList[index].selected"></el-checkbox>
                        <span class="select"></span>
                        <img :src="item.productImage" alt="" class="image">
                        <span class="title">{{item.productName}}</span>
                        <span class="intro" v-if="item.productAttributes.length==0">颜色：原木色</span>
                        <span v-if="item.productAttributes.length>0" class="intro">颜色：{{item.productAttributes[1].attribute2Value}}</span>
                    </div>
                    <div class="middle">
                        <span class="title">￥{{item.finalPrice*item.number/10000}}</span>
                    </div>
                </div>
                <div v-if="item.extType.code ==51">
                    <div class="left">
                        <el-checkbox v-model="buyList[index].selected"></el-checkbox>
                        <span class="select"></span>
                        <img :src="item.extObj.aipPack.image" alt="" class="image">
                        <span class="title">{{item.extObj.aipPack.aipName}}</span>
                        <span class="intro">风格：{{item.extObj.aipPack.styleTag.name}}</span>
                    </div>
                    <div class="middle">
                        <span class="title">￥{{item.extObj.aipPack.aipPrice*item.number/10000}}</span>
                    </div>
                </div>
                <div class="right">
                    <el-button type="danger" icon="delete" class="delete" @click="deleteClick(item.shoppingCartId)"></el-button>
                    <el-input-number class="num" v-model="buyList[index].number" @change="handleChange" :min="1"></el-input-number>
                </div>
            </div>
        </div>
        <!--提交订单-->
        <div class="fifth">
            <div class="bottomLeft">
                <el-checkbox v-model="selectAll">全选</el-checkbox>

            </div>
            <div class="bottomMiddle">
                <div class="one">
                    <span class="num">共{{sumTotal}}件商品：</span>
                    <span class="price">¥ {{priceTotal/10000}}</span>
                </div>
                <div class="two">运费：¥ {{freight}}</div>
                <div class="two">返还优惠：</div>
            </div>
            <button class="submit" @click="submitClick">去结算</button>
        </div>
    </div>
</template>

<script>
import router from "../../router/index";
import api from "../../api/api";
import axios from "axios";
import { Loading } from 'element-ui';
export default {
  name: "buyCar",
  data() {
    return {
      selectAll: false,
      // testNum: 1,
      buyList: [],
      freight: 0,
      productColor:'原木色'
    };
  },
  created: function() {
    window.scrollTo(0, 0);
    this.getCartList();
    for (var i = 0; i < this.buyList.length; i++) {
        if(this.buyList[i].productAttributes&&this.buyList[i]!=[]){
            this.productColor = this.buyList.productAttributes[1].attribute2Value;
        }
    } 
  },
  methods: {
    //获取购物车列表数据
    getCartList() {
      let loadingInstance = Loading.service({ fullscreen: true }); 
      let vm = this;
      api.buyCartList()
        .then(function(res) {
          // console.log(res.data.data.items);
          let info = res.data.data.items;
          for (var i = 0; i < info.length; i++) {
            info[i].number = "testNum" + i;
            info[i].number = info[i].quantity;
            info[i].selected = "select" + i;
            info[i].selected = false;
            info[i].productImage =api.baseURL + "/image" + info[i].productImage + "150x150";

            if (info[i].extType.code == 51) {
              info[i].extObj.aipPack.image = api.baseURL + "/image" + info[i].extObj.aipPack.image + "150x150";
            }
          }
          vm.buyList = info;

          loadingInstance.close();
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    handleChange(value) {
      //          if (value > this.testNum) {
      //            alert('增加');
      //          }else {
      //            alert('减少');
      //          }
    },
    selectClick() {
      // alert('选择');
    },
    deleteClick(shoppingCartId) {
      let vm = this;
      axios
        .delete(api.baseURL + api.delectProductUrl + shoppingCartId)
        .then(function(res) {
          if (res.data.code === "200") {
            alert("删除成功");
            vm.getCartList();
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    selectAllClick() {
      alert("全选");
    },
    submitClick() {
      let testNumber = this.buyList.some(item => item.selected);

      if (!testNumber) {
        alert("请选择至少一个商品！！");
      } else {
        let accountList = this.buyList.filter(item => item.selected);
        // console.log(accountList);
        //结算之前把数据保存起来
        this.$store.commit("account", accountList)
          //去结算 跳到填写订单界面
          router.push("/fillinOrder");
      }
    }
  },
  watch: {
    selectAll(val) {
      if (val) {
        for (var i = 0; i < this.buyList.length; i++) {
          this.buyList[i].selected = true;
        }
      } else {
        for (var i = 0; i < this.buyList.length; i++) {
          this.buyList[i].selected = false;
        }
      }
    }
  },
  computed: {
    // 总数量
    sumTotal() {
      // 遍历取出每个商品的数量，如果这个商品是未选中状态，那么数量设为0
      let totalArr = this.buyList.map(
        item => (item.selected ? +item.number : 0)
      );
      return totalArr.length && totalArr.reduce((v1, v2) => v1 + v2);
    },

    // 总价格
    priceTotal() {
      let priceArr = this.buyList.map(
        // item => (item.selected ? +item.number * item.finalPrice : 0)
        function(item) {
          if (item.selected) {
            if (item.extType.code == 51) {
              return +item.extObj.aipPack.aipPrice;
            } else {
              return +item.number * item.finalPrice;
            }
          }else{
              return 0;
          }
        }
      );
      return priceArr.length && priceArr.reduce((v1, v2) => v1 + v2);
    }
  }
};
</script>

<style lang="sass">
  @import '../../../static/css/buyCar'
</style>
