<template>
    <div id="spaceDetails">
        <com-Login v-if="dialogVisible" @closeLogin='removeLogin' @closeLoginView='removeModule'></com-Login>
        <div class="content-crumb clearfix">
            <router-link to="/spacePackage">
                <p class="crumbone">空间套餐</p>
            </router-link>
            <span>></span>
            <p class="crumbtwo">套餐详情</p>
        </div>

        <div class="add-shopping clearfix">
            <div class="shopping-img">
                <img :src="detail.image" height="480" width="570" alt="" />
            </div>
            <div class="shopping-cart">
                <p class="cart-title">{{detail.aipName}}
                    <!-- <span>（风格：{{detail.styleTag.name}}&nbsp;&nbsp;&nbsp;&nbsp;空间：{{detail.apartmentTag.name}}&nbsp;&nbsp;&nbsp;&nbsp; 适用面：{{detail.areaTag.name}}）</span> -->
                </p>
                <p class="place-order">下单赠送U币，1U币=￥1.0</p>
                <p class="price">￥{{price/10000}}
                    <span>家具（共{{productDetail.length}}件）</span>
                </p>
                <div class="change-select clearfix">
                    <button @click="priceLevel(1)" :class="{active:priceNum==1}">高配</button>
                    <button @click="priceLevel(2)" :class="{active:priceNum==2}">中配</button>
                    <button @click="priceLevel(3)" :class="{active:priceNum==3}">经济</button>
                </div>
                <p class="introduce">{{detail.briefIntroduction}}</p>
                <div class="shopping-btn">
                    
                    <div class="joinCart" v-show="joinCart">
                        已成功加入购物车
                    </div>
                    <button class="shop-btn-left" @click="joinCarted">加入购物车</button>
                    <button class="shop-btn-right" @click="designShow">预约设计</button>
                    <span>
                        <i ref="liking" @click="liked" class="iconfont icon-shoucang"></i>{{likeNum}}人喜欢</span>
                </div>
            </div>
        </div>

        <div class="productInfo">
            <div class="title">
                <span>单品详情</span>
            </div>
            <ul :style="'width:'+productDetail.length*236+'px'" ref='slideUl' class='slide-ul' name="list">
                <li v-for="(list,index) in productDetail" :key="index">
                    <router-link :to='"/productDetail/?productId="+list.productId'>
                        <img :src="list.product.productImage" :alt="list.desc">
                        <p class='productName'>{{list.product.briefName}}</p>
                        <p class='productPrice'>￥{{list.product.finalPrice/10000}}</p>
                    </router-link>
                </li>
            </ul>
            <span class='leftBtn' @click="leftClick()">
                <</span>
                    <span class='rightBtn' @click="rightClick()">></span>
        </div>

        <div class="aipInfo">
            <div class="title">
                <span>套餐详情</span>
            </div>
        </div>
            <div class="aipInfoImage">
                <ul>
                    <li v-for="(item,index) in aipImage" :key="index">
                        <img :src="item.contentImage" alt="套餐详情图片">
                    </li>
                </ul>
            </div>
        

      <designReservation v-if="show" @closeReservation="closeDesign"></designReservation>

    </div>
</template>
<script>
import api from "../../api/api";
import axios from "axios";
import designReservation from "../../components/designReservation.vue";
import Login from "../login/login.vue";
import { Loading } from 'element-ui';
export default {
  //提交预约申请
  components: {
    designReservation: designReservation,
    comLogin: Login
  },
  props: {
    contents: { type: Array }
  },
  data: () => ({
    detail: {},
    priceNum: 3,
    price: "",
    likeNum: 600,
    flag: true,
    aipImage: [],
    productDetail: [],
    moduleShow: false,
    joinCart: false,
    show: false,
    affordableStandard: [],
    highEndStandard: [],
    midrangStandard: [],
    productDetail: [],
    index: 0,
    dialogVisible: false
  }),
  created() {
    this.getAipPackDetail();
  },
  methods: {
    //预约弹窗出现
    designShow() {
      this.show = true;
    },
    closeDesign() {
      this.show = false;
    },
    //获取套餐详情数据
    getAipPackDetail() {
      let loadingInstance = Loading.service({ fullscreen: true });  
      let vm = this;
      axios
        .get(api.aipPackDetailUrl + this.$route.query.aipId)
        .then(function(res) {
          if (res.data.code === "200") {
            // vm.tab1 = res.data.data;
            //   console.log(res.data.data)
            let info = res.data.data;
            info.image = api.baseURL + "/image" + info.image + "570x480";
            vm.detail = info;
            vm.price = info.affordableStandard.standardPrice;
            vm.productDetail = info.affordableStandard.standardItems;
            let image = info.packContentList;
            for (var i = 0; i < image.length; i++) {
              image[i].contentImage =
                api.baseURL + "/image" + image[i].contentImage;
            }
            vm.aipImage = image;

            //经济套餐
            let affordable = info.affordableStandard.standardItems;

            for (var i = 0; i < affordable.length; i++) {
              affordable[i].product.productImage =
                api.baseURL +
                "/image" +
                affordable[i].product.productImage +
                "216x220";
            }
            vm.affordableStandard = affordable;
            //高配
            let highEnd = info.highEndStandard.standardItems;
            for (var i = 0; i < highEnd.length; i++) {
              highEnd[i].product.productImage =
                api.baseURL +
                "/image" +
                highEnd[i].product.productImage +
                "216x220";
            }
            vm.highEndStandard = highEnd;
            //中配
            let midrang = info.midrangStandard.standardItems;
            for (var i = 0; i < midrang.length; i++) {
              midrang[i].product.productImage =
                api.baseURL +
                "/image" +
                midrang[i].product.productImage +
                "216x220";
            }
            vm.midrangStandard = midrang;

            loadingInstance.close();
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    //配置水平切换
    priceLevel(num) {
      this.priceNum = num;
      if (num == 1) {
        this.price = this.detail.highEndStandard.standardPrice;
        this.productDetail = this.detail.highEndStandard.standardItems;
      } else if (this.num == 3) {
        this.price = this.detail.affordableStandard.standardPrice;
        this.productDetail = this.detail.affordableStandard.standardItems;
      } else {
        this.price = this.detail.midrangStandard.standardPrice;
        this.productDetail = this.detail.midrangStandard.standardItems;
      }
    },

    //心
    liked() {
      if (this.flag) {
        this.$refs.liking.style.color = "#F2902D";
        this.likeNum++;
        this.flag = false;
      } else {
        this.$refs.liking.style.color = "#ccc";
        this.likeNum--;
        this.flag = true;
      }
    },
    //左右轮播
    leftClick() {
      if (this.index >= 0) {
        return;
      }
      this.index++;
      this.$refs.slideUl.style.transform =
        "translateX(" + 236 * this.index + "px)";
    },
    rightClick() {
      if (-this.index + 5 >= this.productDetail.length) {
        return;
      }
      this.index--;
      this.$refs.slideUl.style.transform =
        "translateX(" + 236 * this.index + "px)";
    },

    //移除模态框
    removeModule() {
      this.moduleShow = false;
    },
    //显示模态框
    showDesign() {
      this.moduleShow = true;
    },

    //加入购物车
    joinCarted() {
      let vm = this;
      if (this.$store.state.login) {
        let sum = this.$store.state.shoppingNum + 1;
        this.$store.commit("shoppingSum", sum);
        let standardId;
        if(this.priceNum ==1){
            standardId = this.detail.highEndStandard.standardId
        }else if(this.priceNum == 2){
            standardId = this.detail.midrangStandard.standardId
        }else{
            standardId = this.detail.affordableStandard.standardId
        }
        this.joinCart = true;
        setTimeout(function() {
          vm.joinCart = false;
        }, 2000);
        api.joinBuyCart({
            extType: "STANDPACK",
            extId: standardId,
            quantity: 1
          })
          .then(function(res) {
            console.log(res.data);
          })
          .catch(function(err) {
            console.log(err);
          });
      }else{
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
#spaceDetails {
  .content-crumb {
    width: 1200px;
    margin: 20px auto 30px;
    p {
      font-size: 20px;
      float: left;
    }
    span {
      float: left;
      color: #000000;
      font-size: 20px;
      line-height: 30px;
      margin: 0 10px;
    }
    .crumbone {
      color: #999999;
    }
    .crumbtwo {
      color: #000000;
    }
  }

  .add-shopping {
    width: 1200px;
    margin: 0 auto 80px;
    .shopping-img {
      float: left;
    }
    .shopping-cart {
      width: 557px;
      float: right;
      text-align: left;
      .cart-title {
        font-size: 30px;
        color: #323232;
        span {
          color: #666666;
          font-size: 14px;
        }
      }
      .place-order {
        width: 480px;
        padding-left: 20px;
        height: 50px;
        line-height: 50px;
        font-size: 20px;
        color: #fff;
        background-color: #f2902d;
        margin: 25px 0;
      }
      .price {
        color: #ff0d0d;
        font-size: 30px;
        margin-bottom: 20px;
        span {
          font-size: 16px;
          color: #999999;
        }
      }
      .change-select {
        button {
          float: left;
          width: 95px;
          height: 46px;
          line-height: 46px;
          background-color: #fff;
          text-align: center;
          outline: none;
          border: 1px solid #999999;
          margin-right: 15px;
          border-radius: 5px;
          cursor: pointer;
        }
        button.active {
          color: #f3973b;
          border-color: #f3973b;
        }
      }
      .introduce {
        color: #666666;
        font-size: 14px;
        line-height: 30px;
        margin-top: 25px;
      }
      .shopping-btn {
        position: relative;
        .joinCart {
          width: 200px;
          text-align: center;
          line-height: 50px;
          height: 50px;
          background: #666;
          opacity: 0.5;
          position: absolute;
          left: 90px;
          top: -25px;
          color: white;
        }
        button {
          width: 150px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          color: #323232;
          font-size: 14px;
          border: 1px solid #323232;
          outline: none;
          cursor: pointer;
          background-color: #fff;
          margin-top: 40px;
        }
        .shop-btn-left {
          background-color: #f3973b;
          border-color: #f3973b;
          color: white;
        }
        .shop-btn-right {
          margin-left: 15px;
          margin-right: 60px;
          border-color: #f3973b;
        }
        span {
          i {
            font-size: 30px;
            margin-right: 10px;
            vertical-align: middle;
            color: #ccc;
          }
        }
      }
    }
  }

  .aipInfo {
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 20px;
    .title {
      padding-top: 24px;
      margin-left: 20px;
      text-align: left;
      span {
        font-size: 20px;
        color: #f4993e;
        position: relative;
      }
      span::after {
        content: "";
        position: absolute;
        top: 30px;
        left: 0px;
        width: 80px;
        height: 4px;
        background: #f4993e;
      }
    }
  }
  .aipInfoImage {
    width: 100%;
    margin-bottom: 50px;
    @media screen and (max-width: 1400px) {
      width: 1400px;
      height: auto;
    }
    > ul {
      width: 100%;
      height: 100%;
      > li {
        width: 100%;
        > img {
          display: block;
          width: 100%;
        }
      }
    }
  }
  .productInfo {
    width: 1200px;
    margin: 0 auto;
    height: 350px;
    box-shadow: 0 0 12px 3px #eee;
    margin-bottom: 30px;
    position: relative;
    overflow: hidden;
    .slide-ul {
      padding-top: 20px;
      position: absolute; // width:2000px;
      transition: transform 0.5s ease;
      li {
        transition: all 0.35s ease;
        float: left;
        margin-left: 20px;
        .productPrice {
          font-size: 14px;
          color: #000;
          margin-bottom: 5px;
        }
        .productName {
          font-size: 14px;
          color: #f3973b;
        }
        img {
        }
        &:hover {
          box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }
      }
    }
    .title {
      padding-top: 24px;
      margin-left: 20px;
      text-align: left;
      span {
        font-size: 20px;
        color: #323232;
        position: relative;
      }
      span::after {
        content: "";
        position: absolute;
        top: 30px;
        left: 0px;
        width: 46px;
        height: 4px;
        background: #323232;
      }
    }
    span.leftBtn,
    span.rightBtn {
      cursor: pointer;
      z-index: 100;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      position: absolute;
      font-size: 26px;
      color: #666;
      border: 2px solid #999;
      top: 50%;
    }
    .leftBtn {
      left: 0px;
    }
    .rightBtn {
      right: 0px;
    }
    .productImage {
      ul {
        li {
          float: left;
          width: 300px;
          height: 400px;
          img {
            width: 80%;
            height: 240px;
            vertical-align: middle;
          }
          p:nth-of-type(1) {
            font-size: 16px;
            margin-bottom: 20px;
          }
          p:nth-of-type(2) {
            font-size: 16px;
            color: red;
          }
        }
      }
    }
  }
  .pointDetail {
    width: 1200px;
    margin: 0 auto;
    .title {
      span:nth-of-type(1) {
        font-size: 32px;
        color: #f3973b;
      }
      span:nth-of-type(2) {
        font-size: 32px;
      }
      span:nth-of-type(3) {
        font-size: 26px;
      }
    }
    .icon {
      margin: 15px auto;
      i {
        font-size: 26px;
      }
    }
    .pointContent {
      .pointList {
        padding-left: 60px;
        padding-top: 20px;
        border-top: 1px solid #666;
        text-align: left;
        position: relative;
        .personImage {
          position: absolute;
          left: 0;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid yellow;
        }
        p {
          position: relative;
          span:nth-of-type(1) {
            font-size: 16px;
          }
          span:nth-of-type(2) {
            position: absolute;
            right: 0;
          }
          margin-bottom: 20px;
        }
        ul {
          li {
            float: left;
          }
        }
      }
    }
  }
}
</style>
