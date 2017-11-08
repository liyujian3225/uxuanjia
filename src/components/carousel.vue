<template>
    <div id="carouselid">
        <el-carousel arrow="always" :autoplay="false" trigger="click">
            <el-carousel-item v-for="(item,index) in contents" :key="index">
                <!-- <h3>{{ item }}</h3> -->
                <div v-show="item.count == 1">
                    <ul class="viewpoint-one">
                        <li v-for="(item,index) in pointList1" :key="index">
                          <router-link :to="{path:'pointDetail',query:{specialId:item.specialId}}">
                            <img :src="item.bannerUrl" alt="" class="viewpoint-img" />
                            <h6>{{item.specialTitle}}</h6>
                            <div class="viewpoint-icon">
                              <img src="../../static/image/home/login-header.png" height="20" width="20" alt="" />
                              <span>
                                    <i class="iconfont icon-shijian-xianxing"></i>
                                    {{item.lastUpdate}}
                                    </span>
                            </div>
                            <p>{{item.description}}</p>
                          </router-link>

                        </li>
                    </ul>
                </div>
                <div v-show="item.count == 2">
                    <ul class="viewpoint-one">
                        <li v-for="(item,index) in pointList2" :key="index">
                          <router-link :to="{path:'pointDetail',query:{specialId:item.specialId}}">
                            <img :src="item.bannerUrl" alt="" class="viewpoint-img" />
                            <h6>{{item.specialTitle}}</h6>
                            <div class="viewpoint-icon">
                              <img src="../../static/image/home/login-header.png" height="20" width="20" alt="" />
                              <span><i class="iconfont icon-shijian-xianxing"></i>{{item.lastUpdate}}</span>
                            </div>
                            <p>{{item.description}}</p>
                          </router-link>
                        </li>
                    </ul>

                </div>
                <div v-show="item.count == 3">
                    <ul class="viewpoint-one">
                        <li v-for="(item,index) in pointList3" :key="index">
                          <router-link :to="{path:'pointDetail',query:{specialId:item.specialId}}">
                              <img :src="item.bannerUrl" alt="" class="viewpoint-img" />
                              <h6>{{item.specialTitle}}</h6>
                              <div class="viewpoint-icon">
                                <img src="../../static/image/home/login-header.png" height="20" width="20" alt="" />
                                <span><i class="iconfont icon-shijian-xianxing"></i>{{item.lastUpdate}}</span>
                              </div>
                              <p>{{item.description}}</p>
                          </router-link>
                        </li>
                    </ul>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>
<script>
import api from "../api/api.js";
export default {
    props: {
        contents: { type: Array },
    },
    data: () => {
        return {
            pointList1: [],
            pointList2: [],
            pointList3: []
        }
    },
    created() {
        this.getPoint();
    },
    methods: {
        getPoint() {

            let vm = this;
            api.point({
                params: {
                    limit: 12
                }

            })
                .then(function(res) {
                    if (res.data.code === "200") {

                        let pointList = res.data.data.items;
                        //pitureUrl还是bannerUrl
                        for (var i = 0; i < pointList.length; i++) {
                            pointList[i].bannerUrl = api.baseURL + '/image' + pointList[i].bannerUrl+'450x400';
                        }
                        vm.pointList1=pointList.slice(0,4);
                        vm.pointList2=pointList.slice(4,8);
                        vm.pointList3=pointList.slice(8,12);
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        }
    }
}
</script>
<style scoped lang="scss">
@import '../../static/css/carousel.scss';
</style>
<style lang="scss">
#carouselid {
    width: 1200px;
    margin: 0 auto;
    .el-carousel {
        overflow-y: hidden;
    }
    .el-carousel__indicators {
        top: 0;
        height: 18px;
    }
    .el-carousel__container {
        height: 410px !important;
    } // 三角
    .el-carousel__arrow {
        width: 25px;
        height: 19px;
        top: 95%;
        border: 1px solid #323232;
        border-radius: 0;
        color: #323232;
        -ms-transform: none;
        transform: none;
        background-color: #fff;
    }
    .el-carousel__arrow--left {
        left: 50%;
        -ms-transform: translateX(-25px);
        transform: translateX(-25px);
    }
    .el-carousel__arrow--right {
        right: 50%;
        -ms-transform: translateX(24px);
        transform: translateX(24px);
    }
    .el-carousel__arrow i {
        line-height: 1.5;
    } // 原点
    .el-carousel__indicator {
        padding: 4px;
    }
    .el-carousel__indicator:hover button {
        opacity: 1;
    }
    .el-carousel__button {
        width: 10px;
        height: 10px;
        border-radius: 5px;
        opacity: 1;
        background-color: #fff;
        border: 1px solid #979797;
    }
    .el-carousel__indicator.is-active button {
        opacity: 1;
        width: 10px;
        height: 10px;
        border: 1px solid #E6E6E6;
        background-color: #E6E6E6 !important;
    }

    .el-carousel__item {
        background-color: #fff;
    }
    .viewpoint-one {
        cursor: pointer;
        margin-top: 50px;
        li {
            float: left;
            width: 265px;
            margin-right: 45px;
            text-align: left;
            .viewpoint-img {
                width: 100%;
                height: 200px;
            }
            h6 {
                color: #323232;
                font-size: 16px;
                font-weight: normal;
                margin: 10px 0;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }
            .viewpoint-icon {
                height: 20px;
                margin: 6px 0;
                span {
                    line-height: 20px;
                    display: inline-block;
                    color: #999;
                    font-size: 14px;
                    position: relative;
                    i{
                    position: absolute;
                    top:0px;
                    left: -30px;
                    font-size:16px;
                    color:#232323;
                }
                }

                img {
                    vertical-align: middle;
                    margin-right: 6px;
                }
            }
            p {
                color: #999;
                font-size: 14px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
            }
        }
        li:nth-of-type(4) {
            margin-right: 0;
        }
    }
}
</style>
