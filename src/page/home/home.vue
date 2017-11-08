<template>
    <div class="index-content">
        <!-- 导航栏 -->
        <com-nav></com-nav>
      <div class="block" id="index-banner">
        <el-carousel>
          <el-carousel-item v-for="(image,index) in images" :key="index">
              <a :href="image.pictureLink">
                   <img :src="image.pictureUrl" alt="" class="banner-img" />
              </a>
          </el-carousel-item>
        </el-carousel>
      </div>

        <!-- 一级tab -->
        <div class="index-tab-com">
            <div class="index-space">
                <img src="../../../static/image/home/icon_kjtc.png" height="77" width="180" alt="" />
            </div>
            <div class="tab-title">
                <p class="tab-title-left">空间套餐</p>
                <router-link to="/spacePackage" class="tab-title-right" >查看全部</router-link>
            </div>
            <com-tab :titles="titles1"></com-tab>
            <div class="index-space">
                <img src="../../../static/image/home/icon_qwtc.png" height="77" width="180" alt="" />
            </div>
            <div class="tab-title">
                <p class="tab-title-left">全屋套餐</p>
                <router-link to="/house" class="tab-title-right">查看全部</router-link>
            </div>
            <com-tab2 :titles="titles2"></com-tab2>
        </div>
        <div class="product">
            <img src="../../../static/image/home/banner1.jpg" alt="" class="product-img" />
        </div>

        <!-- 二级tab -->
        <com-tabs></com-tabs>
        <!-- 点击轮播 -->
        <div class="carousel-title">
            <img src="../../../static/image/home/viewpoint.png" height="77" width="120" alt="" />
        </div>
        <v-carousel :contents="contents"></v-carousel>

        <div class="index-partner">
            <div class="partner-headimg">
                <img src="../../../static/image/home/partner-headimg.png" height="81" width="132" alt="" />
            </div>
            <div class="partner-bottom clearfix">
                <ul>
                    <li>
                        <img src="../../../static/image/home/partner-bottom1.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom2.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom3.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom4.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom5.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom6.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom7.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom8.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom9.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom10.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom11.png" height="130" width="225" alt="" />
                    </li>
                    <li>
                        <img src="../../../static/image/home/partner-bottom12.png" height="130" width="225" alt="" />
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>


import Tab from '../../components/tab.vue';
import TabTwo from '../../components/tabTwo.vue';
import Tabs from '../../components/tabsecond.vue';
import Carousel from '../../components/carousel.vue';
import nav from '../../components/nav.vue';
import api from '../../api/api';
import designReservation from '../../components/designReservation.vue'
export default {

    components: {
        comTab: Tab,
        comTab2:TabTwo,
        comTabs: Tabs,
        'v-carousel': Carousel,
        comNav: nav,
        designReservation:designReservation
    },

    data: () => ({
        contents:[
            {count:1},
            {count:2},
            {count:3},
            ],

        active: 0,

        images: [],

        titles1: [],

        titles2: [],
    }),
    mounted(){
    //    console.log(this.$store.state.login);
       this.getTopBanner();
       this.getTag();
    },
    methods: {


        getTopBanner() {
            let vm = this;
            api.topBanner({
                params: {
                    sceneCode: "topBanner",
                }

            })
                .then(function(res) {
                    if (res.data.code === "200") {
                        var bannerList=res.data.data[0].topBanner;
                        for(var i=0;i<bannerList.length;i++){
                            bannerList[i].pictureUrl=api.baseURL+'/image'+bannerList[i].pictureUrl+"1920x640";
                        }
                        vm.images=bannerList;
                        // console.log(res.data.data[0].topBanner)
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },


        //获标签数据
      getTag(){
        let vm = this;
         api.tags({
             params:{
                parentExtType:"CREATIVE",
                extType:"SPACE"
             }

         })
         .then(function (res) {
            if(res.data.code==="200"){
              vm.titles1=res.data.data;
            //   console.log(res.data.data)
            }
          })
          .catch(function (err) {
              console.log(err)
           })
          api.tags({
             params:{
                parentExtType:"CREATIVE",
                extType:"STYLE"
             }

         })
         .then(function (res) {
            if(res.data.code==="200"){
              vm.titles2=res.data.data;
            //   console.log(res.data.data)
            }
          })
          .catch(function (err) {
              console.log(err)
           })
      },

    },
}

</script>
<style lang="scss">
  @import "../../../static/css/home";
</style>
