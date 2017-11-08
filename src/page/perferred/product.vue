<!-- @Author: 钟晶
@Last Modified by:   钟晶 -->
<template>
    <div id="perferred-product">
        <!-- 导航栏 -->
        <!-- <com-nav></com-nav> -->
        <div class="content-img">
            <img src="../../../static/image/home/banner4.png" alt="" />
        </div>

        <!-- 二级tab切换 -->
        <div class="product-tab">
            <div class="tab-second clearfix">

                <div class="product-tab-top">
                    <div class="tab-second-head" style="overflow: auto">
                        <div v-for="(item, index) in tab1" :key="index" @click="tab1Change(item, index)" :class="{active: tab1ChoseCount==item.category1Id}" class="tab-second-one icon-img">
                            <div class="icon-imgshow" >
                               <img :src="item.image" alt="">
                            </div>
                            {{item.category1Name}}
                        </div>
                    </div>

                    <br>
                    <div style="overflow: auto" class="tab-second-main">
                        <div v-for="(item, index) in tab2" :key="index" @click="tab2Change(item, index)" :class="{active: tab2ChoseCount==item.category2Id}" class="tab-second-one">
                            {{item.category2Name}}
                        </div>
                    </div>
                </div>
                <div class="tab-second-laster clearfix">
                    <div v-for="(item,index) in tab3" :key="index" class="tab-second-three">
                        <div class="tab-second-three-img">
                            <router-link target="_blank" :to="'/productDetail?productId='+item.productId">
                                <div>
                                  <img :src="item.productImage" alt="" />
                                </div>
                                <div>{{item.productName}}</div>
                                <div>¥{{item.finalPrice/10000}}</div>
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="view-more">
                    <button ref="btnAdd" @click="addMore">查看更多</button>
                </div>

            </div>
        </div>

    </div>
</template>
<script>
//   import Nav from '../../components/Nav.vue'
import api from "../../api/api";
export default {
  data: () => ({
    active: false,
    tab1: [],
    tab1ChoseCount: 1,
    tab2ChoseCount: 1,
    tab2: [],
    tab3: [],
    start: 0
  }),

  // 二级tab切换
  created() {
    this.getProductCategory();
  },

  mounted() {},

  methods: {
    // 二级tab切换
    tab1Change(item, index) {
      this.start = 0;
      this.$refs.btnAdd.disabled = false;
      this.$refs.btnAdd.innerHTML = "加载更多";
      this.tab2 = item.category2s;
      this.tab1ChoseCount = item.category1Id;
      this.tab2ChoseCount = item.category2s[0].category2Id;
      this.getProduct(this.tab2ChoseCount, this.start);
    },

    tab2Change(item, index) {
      this.start = 0;
      this.$refs.btnAdd.disabled = false;
      this.$refs.btnAdd.innerHTML = "加载更多";
      this.tab3 = item.category2s;
      this.tab2ChoseCount = item.category2Id;
      this.getProduct(this.tab2ChoseCount, this.start);
    },

    //获取一级标签
    getProductCategory() {
      let vm = this;
      api.productCategory()
        .then(function(res) {
          if (res.data.code === "200") {
           let firstTab = res.data.data; 
           for (var i = 0; i < firstTab.length; i++) {
                firstTab[i].image = api.baseURL + '/image' + firstTab[i].image;
            }
            vm.tab1 = firstTab;
            vm.tab2 = res.data.data[0].category2s;
            vm.tab1ChoseCount = res.data.data[0].category1Id;
            vm.tab2ChoseCount = res.data.data[0].category2s[0].category2Id;
            vm.getProduct(vm.tab2ChoseCount, vm.start);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    //获取商品
    getProduct(category2Id, start) {
      let vm = this;
      api.product({
          params: {
            category2Id: category2Id,
            offset: start,
            limit: 8
          }
        })
        .then(function(res) {
          if (res.data.code === "200") {
            //   vm.tab2.push(...res.data.data);
            //   console.log(res.data.data.items);
            var productList = res.data.data.items;
            if (productList.length < 8) {
              vm.$refs.btnAdd.disabled = true;
              vm.$refs.btnAdd.innerHTML = "已经加载完了";
            }
            for (var i = 0; i < productList.length; i++) {
              productList[i].productImage =
                api.baseURL +
                "/image" +
                productList[i].productImage +
                "285x276";
            }
            vm.tab3 = productList;
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },

    //查看更多
    addMore() {
      let vm = this;
      this.start += 8;
      let start = this.start;
      let category2Id = this.tab2ChoseCount;
      api
        .product({
          params: {
            category2Id: category2Id,
            offset: start,
            limit: 8
          }
        })
        .then(function(res) {
          if (res.data.code === "200") {
            //   vm.tab2.push(...res.data.data);
            //   console.log(res.data.data.items);
            var productList = res.data.data.items;
            if (productList.length < 8) {
              vm.$refs.btnAdd.disabled = true;
              vm.$refs.btnAdd.innerHTML = "已经加载完了";
            }
            for (var i = 0; i < productList.length; i++) {
              productList[i].productImage =
                api.baseURL +
                "/image" +
                productList[i].productImage +
                "285x276";
            }
            vm.tab3.push(...productList);
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
};
</script>
<style scoped lang="scss">
#perferred-product {
  .content-img {
    width: 100%;
    height: auto;
    @media screen and (max-width: 1400px) {
      width: 1400px;
      height: auto;
    }
    img {
      display: block;
      width: 100%;
    }
  }

  .product-tab {
    .icon-img {
      text-align: center;
    }
    .icon-imgshow {
      background: {
        size: cover;
        repeat: no-repeat;
      }
      width: 70px;
      height: 50px;
      float: none !important;
      margin: 0 !important;
    }
    .tab-second-one.active {
      color: #f3973b !important;
    }
    .tab-second {
      width: 1280px;
      color: #4a4a4a;
      margin: 0 auto;
      .product-tab-top {
        height: 180px;
        margin: 15px 0 20px 0;
        box-shadow: 0 0 12px 3px #eee;
        padding-top: 30px;
        .tab-second-head {
          display: flex;
          justify-content: center;
          .tab-second-one {
            padding: 0 60px;
            float: left;
            font-size: 16px;
            text-align: center;
            cursor: pointer;
            img {
              display: block;
              margin: 0 auto;
            }
          }
          .tab-second-one:nth-of-type(1) {
            margin-left: 40px;
          }
          .tab-second-one:nth-of-type(7) {
            margin-right: 0;
          }
        }
        .tab-second-main {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          div {
            padding: 0 60px;
            float: left;
            font-size: 16px;
            cursor: pointer;
            text-align: center;
            color: #323232;
          }
        }
      }
      .tab-second-laster {
        width: 100%;
        height: auto;
        .tab-second-three {
          float: left;
          width: 300px;
          height: 337px;
          margin-top: 10px;
          padding: 10px;
          .tab-second-three-img {
            height: 100%;
            margin: 0 auto;
            box-sizing: border-box;
            padding-top: 10px;
            transition: all 0.35s ease;
            > a {
              border-radius: 8px;
              display: block;
              width: 100%;
              height: 100%;
              > div:first-child {
                width: 280px;
                height: 235px;
                > img {
                  display: block;
                  width: 100%;
                  height: 100%;
                }
              }
              > div:nth-child(2) {
                line-height: 30px;
                font-size: 14px;
                color: #f3973b;
              }
              > div:nth-child(3) {
                line-height: 25px;
                font-size: 14px;
                color: #000;
              }
            }
            &:hover {
              box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.1);
              transform: translateY(-5px);
            }
          }
        }
      }

      .view-more {
        button {
          border: 2px solid #323232;
          color: #000000;
          font-size: 20px;
          padding: 6px 25px;
          outline: none;
          background-color: #fff;
          cursor: pointer;
          margin-bottom: 50px;
          margin-top: 40px;
        }
      }
    }
  }
  .clearfix:after {
    content: "";
    display: block;
    visibility: hidden;
    height: 0;
    clear: both;
  }
  .clearfix {
    zoom: 1;
  }
}
</style>
