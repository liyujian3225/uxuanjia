<template>
    <div id="spaceDetails">

        <div class="content-crumb clearfix">
            <router-link to="/product">
                <p class="crumbone">优选良品</p>
            </router-link>
            <span>></span>
            <p class="crumbtwo">套餐详情</p>
        </div>

        <div class="add-shopping clearfix">
            <div class="shopping-img">
                <img :src="detail.productImage" height="570" width="480" alt="" />
            </div>
            <div class="shopping-cart">

                <p class="cart-title">
                    {{detail.productName}}
                    <span>（{{detail.category1Name}}&nbsp;&nbsp;{{detail.category2Name}}&nbsp;&nbsp;{{detail.category3Name}}）</span>
                </p>
                <p class="place-order">下单赠送U币，1U币=￥1.0</p>
                <p class="price">
                    ￥{{detail.salePrice*num/10000}}
                </p>

                <div class="productSize" v-for="(item,index) in productAttribute" :key="index">
                    <span class="introduce">
                        {{item.attribute2Name}}：
                    </span>
                    <span>{{item.attribute2Value}}</span>
                </div>
                <div class="shopping-btn">
                    <div class="joinCart" v-show="joinCart">
                      已成功加入购物车
                    </div>
                    <el-input-number v-model="num" @change="handleChange" :min="1"></el-input-number>
                    <button class="shop-btn-left" @click="joinCarted">加入购物车</button>
                    <button @click="goPay" class="shop-btn-right" >立即购买</button>
                </div>
            </div>
        </div>
        <div class="aipInfo">
            <!-- <div class="title">
                <span>商品详情</span>
                <span>/</span>
                <span>Product details</span>
            </div>
            <div class="icon">
                <i class="el-icon-caret-bottom"></i>
            </div> -->
            <div class="aipInfoImage">
                <ul>
                    <li v-for="(item,index) in decriptsImage" :key="index">
                        <img :src="item.descriptionImage" alt="套餐详情图片">
                    </li>
                </ul>
            </div>
        </div>
      <com-Login v-if="dialogVisible" @closeLogin='removeLogin' @closeLoginView='removeModule'></com-Login>  
      <com-design-reservation v-if="seen" @closeReservation="closeReservation"></com-design-reservation>
    </div>
</template>
<script>
import api from "../../api/api";
import axios from "axios";
import designReservation from "../../components/designReservation.vue";
import Login from "../login/login.vue";
import { Loading } from 'element-ui';
export default {
  components: {
    comDesignReservation: designReservation,
    comLogin: Login
  },
  props: {
    contents: { type: Array }
  },
  data: () => ({
    joinCart: false,
    seen: false,
    num: 1,
    detail: {},
    decriptsImage: [],
    productAttribute: [],
    dialogVisible: false
  }),
  created() {
    this.getProductDetail();
  },
  methods: {
    //预约设计弹窗
    openDesignReservation() {
      this.seen = true;
    },
    closeReservation() {
      this.seen = false;
    },
    handleChange(value) {
      // console.log(value);
    },
    //获取商品详情数据
    getProductDetail() {
      let loadingInstance = Loading.service({ fullscreen: true });   
      let vm = this;
      axios
        .get(api.productDetailUrl + this.$route.query.productId)
        .then(function(res) {
          if (res.data.code === "200") {

            let info = res.data.data;
            info.productImage = api.baseURL + "/image" + info.productImage;
            vm.detail = info;
            vm.productAttribute = info.productAttributes;

            let descripts = info.productSubDescriptions;
            for (var i = 0; i < descripts.length; i++) {
              descripts[i].descriptionImage =
                api.baseURL + "/image" + descripts[i].descriptionImage;
            }
            vm.decriptsImage = descripts;
            loadingInstance.close();
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    //加入购物车
    joinCarted() {
      let vm = this;
      if (this.$store.state.login) {
        let sum = this.$store.state.shoppingNum + 1;
        this.$store.commit("shoppingSum", sum);
        this.joinCart = true;
        setTimeout(function() {
          vm.joinCart = false;
        }, 2000);
        api
          .joinBuyCart({
            extType: "PRODUCT",
            extId: vm.$route.query.productId,
            quantity: vm.num
          })
          .then(function(res) {
            // console.log(res.data);
          })
          .catch(function(err) {
            console.log(err);
          });
      } else {
        this.dialogVisible = true;
      }
    },

    //立即支付
    goPay() {
      if (this.$store.state.login) {
        let vm = this;
        //先存入购物车
        api.joinBuyCart({
            extType: "PRODUCT",
            extId: vm.$route.query.productId,
            quantity: vm.num
          })
          .then(function(res) {
            let shoppingId = res.data.data.shoppingCartId;
            //存立即购买商品信息
            vm.$store.commit("account", [
              {
                extType:{code:3},
                selected: true,
                number: vm.num,
                productName: vm.detail.productName,
                productImage: vm.detail.productImage,
                finalPrice: vm.detail.finalPrice,
                productId: vm.detail.productId,
                shoppingCartId:shoppingId,
                productAttributes:vm.productAttribute
              }
            ]);
          })
          .then(function() {
            //跳到订单页面
            vm.$router.push("/fillinOrder");
          })
          .catch(function(err) {
            console.log(err);
          });
      } else {
        this.dialogVisible = true;
      }
    },
    //登录设置
    removeLogin() {
      this.dialogVisible = false;
    },
    removeModule() {
      this.dialogVisible = false;
      //解决自动刷新
      setTimeout(function() {
        window.location.reload();
      }, 500);
    }
  }
};
</script>
<style scoped lang='scss'>
@import "../../../static/css/productDetail";
</style>
