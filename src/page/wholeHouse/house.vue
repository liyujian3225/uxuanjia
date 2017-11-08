<template>
  <div id="perferred-product">
    <div class="content-img">
      <img src="../../../static/image/home/banner3.png" alt="" />
    </div>


        <!-- 二级tab切换 -->
        <div class="product-tab">
            <div class="tab-second">
                <div class="product-tab-top">
                    <div class="tab-second-head" style="overflow: auto">
                        <span class="style-color">风格:</span>
                        <div class="tab-second-one" @click="tab1All" :class="{active: flag1}">
                            全部
                        </div>
                        <div v-for="(item, index) in tab1" :key="item.levelId" @click="tabChange(item, index)" :class="{active: tab1ChoseCount==item.tagId}" class="tab-second-one">
                            {{item.levelName}}
                        </div>
                    </div>

                    <br>
                    <div style="overflow: auto" class="tab-second-main">
                        <span class="style-color">户型:</span>
                        <div class="tab-second-one" @click="tab2All" :class="{active: flag2}">
                            全部
                        </div>
                        <div v-for="(item, index) in tab2" :key="item.levelId" @click="tab2Change(item, index)" :class="{active: tab2ChoseCount==item.tagId}" class="tab-second-one">
                            {{item.levelName}}
                        </div>
                    </div>
                </div>
                <div class="tab-second-laster clearfix">
                    <div class="tab-second-three">
                        <div class="tab-second-three-img">
                            <div class="drawimg-room clearfix">
                                <ul>
                                    <li v-for="(item,index) in tab3" :key="index">
                                        <!-- 这里需要在新窗口打开？？ -->
                                        <router-link :to="'/houseDetail?aipId='+item.aipId" target="_blank">
                                            <div>
                                              <img :src="item.image" height="400" width="590" alt="" />
                                            </div>
                                            <p class="room-p">{{item.aipName}}</p>
                                        </router-link>
                                    </li>

                                </ul>
                            </div>
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

import api from '../../api/api';

export default {

    data: () => ({
        active: 'false',
        flag1: true,
        flag2: true,
        tab1ChoseCount: "",
        tab2ChoseCount: "",
        tab1: [],
        tab2: [],
        tab3: [],
        start: 0,
        active: '/spacePackage',
    }),

    // 二级tab切换
    mounted() {
        this.getTag();
        this.getSpace(0, 6);
    },

    methods: {

        tab1All() {
            this.$refs.btnAdd.disabled = false;
            this.$refs.btnAdd.innerHTML = "加载更多";
            this.start = 0;
            this.flag1 = true;
            this.tab1ChoseCount = "";
            if (this.tab2ChoseCount == "") {
                this.getSpace(0, 6);
            } else {
                this.getSpace(0, 6, this.tab2ChoseCount);
            }

        },
        tab2All() {
            this.$refs.btnAdd.disabled = false;
            this.$refs.btnAdd.innerHTML = "加载更多";
            this.start = 0;
            this.flag2 = true;
            this.tab2ChoseCount = "";
            if (this.tab1ChoseCount == "") {
                this.getStyle(0, 6);
            } else {
                this.getStyle(0, 6, this.tab1ChoseCount);
            }
        },
        // 二级tab切换
        tabChange(item, index) {
            this.$refs.btnAdd.disabled = false;
            this.$refs.btnAdd.innerHTML = "加载更多";
            this.start = 0;
            this.tab1ChoseCount = item.tagId;
            this.flag1 = false;

            if (this.tab2ChoseCount == "") {
                this.getStyle(0, 6, this.tab1ChoseCount);
            } else {
                this.getSpaceStyle(0, 6, this.tab2ChoseCount, this.tab1ChoseCount)
            }
        },
        tab2Change(item, index) {
            this.start = 0;
            // this.tab3 = item.tab3;
            // this.tab2ChoseCount = index+1;
            this.flag2 = false;
            this.tab2ChoseCount = item.tagId;

            this.$refs.btnAdd.disabled = false;
            this.$refs.btnAdd.innerHTML = "加载更多";


            if (this.tab1ChoseCount == "") {
                this.getSpace(0, 6, this.tab2ChoseCount);
            } else {
                this.getSpaceStyle(0, 6, this.tab2ChoseCount, this.tab1ChoseCount)
            }
        },

        //获标签数据
        getTag() {
            let vm = this;
            api.tags({
                params: {
                    parentExtType: "CREATIVE",
                    extType: "STYLE"
                }

            })
                .then(function(res) {
                    if (res.data.code === "200") {
                        vm.tab1 = res.data.data;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
            api.tags({
                params: {
                    parentExtType: "CREATIVE",
                    extType: "HOUSETYPE"
                }

            })
                .then(function(res) {
                    if (res.data.code === "200") {
                        vm.tab2 = res.data.data;
                        //   console.log(res.data.data)
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },

        //获取风格套餐数据
        getStyle(start, total, tagIdHouse) {


            let vm = this;
            api.aipPack({
                params: {
                    apartmentType: 'HOUSEHOLD',
                    offset: start,
                    limit: total,
                    // apartmentTagId: tagIdSpace,
                    styleTagId: tagIdHouse,
                }

            })
                .then(function(res) {
                    if (res.data.code === "200") {
                        //   vm.titles1=res.data;

                        let aipPack = res.data.data.items;
                        // console.log(aipPack)

                        for (var i = 0; i < aipPack.length; i++) {
                            aipPack[i].image = api.baseURL + '/image' + aipPack[i].image+'590x400';
                        }
                        vm.tab3 = aipPack;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },
        //获取空间套餐数据
        getSpace(start, total, tagIdSpace) {


            let vm = this;
            api.aipPack({
                params: {
                    apartmentType: 'HOUSEHOLD',
                    offset: start,
                    limit: total,
                    apartmentTagId: tagIdSpace,
                    // styleTagId:tagIdHouse,
                }

            })
                .then(function(res) {
                    if (res.data.code === "200") {
                        //   vm.titles1=res.data;

                        let aipPack = res.data.data.items;
                        // console.log(aipPack)

                        for (var i = 0; i < aipPack.length; i++) {
                            aipPack[i].image = api.baseURL + '/image' + aipPack[i].image+'590x400';
                        }
                        vm.tab3 = aipPack;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },
        //获取空间和套餐数据
        getSpaceStyle(start, total, tagIdSpace, tagIdHouse) {


            let vm = this;
            api.aipPack({
                params: {
                    apartmentType: 'HOUSEHOLD',
                    offset: start,
                    limit: total,
                    apartmentTagId: tagIdSpace,
                    styleTagId: tagIdHouse,
                }

            })
                .then(function(res) {
                    if (res.data.code === "200") {
                        //   vm.titles1=res.data;

                        let aipPack = res.data.data.items;
                        // console.log(aipPack)

                        for (var i = 0; i < aipPack.length; i++) {
                            aipPack[i].image = api.baseURL + '/image' + aipPack[i].image+'590x400';
                        }
                        vm.tab3 = aipPack;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },

        addMore() {
            let vm = this;
            this.start += 6;
            var start = this.start;

            if (this.tab1ChoseCount == "" && this.tab2ChoseCount == "") {
                api.aipPack({
                    params: {
                        apartmentType: 'HOUSEHOLD',
                        offset: start,
                        limit: 6,
                        // apartmentTagId: tagIdSpace,
                        // styleTagId: tagIdHouse,
                    }

                })
                    .then(function(res) {
                        if (res.data.code === "200") {
                            //   vm.titles1=res.data;

                            let aipPack = res.data.data.items;
                            if (aipPack.length < 6) {
                                vm.$refs.btnAdd.disabled = true;
                                vm.$refs.btnAdd.innerHTML = "已经加载完了";
                            }
                            // console.log(aipPack)

                            for (var i = 0; i < aipPack.length; i++) {
                                aipPack[i].image = api.baseURL + '/image' + aipPack[i].image+'590x400';
                            }
                            vm.tab3.push(...aipPack);

                        }
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
            } else if (this.tab1ChoseCount != "" && this.tab2ChoseCount == "") {
                let tagIdHouse = this.tab1ChoseCount;
                api.aipPack({
                    params: {
                        apartmentType: 'HOUSEHOLD',
                        offset: start,
                        limit: 6,
                        // apartmentTagId: tagIdSpace,
                        styleTagId: tagIdHouse,
                    }

                })
                    .then(function(res) {
                        if (res.data.code === "200") {
                            //   vm.titles1=res.data;

                            let aipPack = res.data.data.items;
                            // console.log(aipPack)
                            if (aipPack.length < 6) {
                                vm.$refs.btnAdd.disabled = true;
                                vm.$refs.btnAdd.innerHTML = "已经加载完了";
                            }
                            for (var i = 0; i < aipPack.length; i++) {
                                aipPack[i].image = api.baseURL + '/image' + aipPack[i].image+'590x400';
                            }
                            vm.tab3.push(...aipPack);
                        }
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
            } else if (this.tab1ChoseCount == "" && this.tab2ChoseCount != "") {
                let tagIdSpace = this.tab2ChoseCount;
                api.aipPack({
                    params: {
                        apartmentType: 'HOUSEHOLD',
                        offset: start,
                        limit: 6,
                        apartmentTagId: tagIdSpace,
                        // styleTagId: tagIdHouse,
                    }

                })
                    .then(function(res) {
                        if (res.data.code === "200") {
                            //   vm.titles1=res.data;

                            let aipPack = res.data.data.items;
                            // console.log(aipPack)
                            if (aipPack.length < 6) {
                                vm.$refs.btnAdd.disabled = true;
                                vm.$refs.btnAdd.innerHTML = "已经加载完了";
                            }
                            for (var i = 0; i < aipPack.length; i++) {
                                aipPack[i].image = api.baseURL + '/image' + aipPack[i].image+'590x400';
                            }
                            vm.tab3.push(...aipPack);
                        }
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
            } else {
                let tagIdSpace = this.tab2ChoseCount;
                let tagIdHouse = this.tab1ChoseCount;
                api.aipPack({
                    params: {
                        apartmentType: 'HOUSEHOLD',
                        offset: start,
                        limit: 6,
                        apartmentTagId: tagIdSpace,
                        styleTagId: tagIdHouse,
                    }

                })
                    .then(function(res) {
                        if (res.data.code === "200") {
                            //   vm.titles1=res.data;

                            let aipPack = res.data.data.items;
                            // console.log(aipPack)
                            if (aipPack.length < 6) {
                                vm.$refs.btnAdd.disabled = true;
                                vm.$refs.btnAdd.innerHTML = "已经加载完了";
                            }
                            for (var i = 0; i < aipPack.length; i++) {
                                aipPack[i].image = api.baseURL + '/image' + aipPack[i].image+'590x400';
                            }
                            vm.tab3.push(...aipPack);
                        }
                    })
                    .catch(function(err) {
                        console.log(err)
                    })
            }
        }

    },
    computed: {},
    watch: {},
}
</script>
<style scoped lang="scss">
#perferred-product {
    .content-img {
      width: 100%;
      height: auto;
      @media screen and (max-width:1400px){
        width:1400px;
        height:auto;
      }
      img {
        display:block;
        width: 100%;
      }
    }

    .product-tab {
        .tab-second-one.active {
            color: #F3973B!important;
            border: 1px solid #F3973B!important;
            padding: 9px;
            border-radius: 5px;
        }
        .tab-second {
            width: 1280px;
            height: auto;
            color: #4A4A4A;
            margin: 0 auto;
            .product-tab-top {
                height: 165px;
                margin: 30px 0 25px 0;
                box-shadow: 0 0 12px 3px #eee;
                padding-top: 30px;
                .tab-second-head {

                    .tab-second-one {
                        float: left;
                        font-size: 15px;
                        margin-right: 150px;
                        text-align: center;
                        cursor: pointer;
                        border: 1px solid #fff;
                        padding: 9px;
                        img {
                            display: block;
                            margin: 0 auto;
                        }
                    }
                    .tab-second-one:nth-of-type(7) {
                        margin-right: 0;
                    }
                }
                .tab-second-main {
                    margin: 30px auto 20px;
                    div {
                        float: left;
                        font-size: 15px;
                        text-align: center;
                        color: #323232;
                        border: 1px solid #fff;
                        padding: 9px;
                        border-radius: 5px;
                        margin-right: 60px;
                        cursor: pointer;
                    }
                }
            }
            .tab-second-laster {
                width: 100%;
                height: auto;
                .tab-second-three {
                    float: left;
                    font-size: 22px;
                    text-align: center;
                    margin-top: 10px;
                    .tab-second-three-img {
                        width: 1280px;
                        color: #323232;
                        font-size: 20px;
                        .drawimg-room {
                            ul {
                                li {
                                  margin-left: 33px;  
                                  >a{
                                    display:block;
                                    >div{
                                      width:590px;
                                      height:400px;
                                      overflow:hidden;
                                      >img{
                                        display:block;
                                        width:100%;
                                        height:100%;
                                        transition:all 2s ease;
                                        &:hover{
                                          transform:scale(1.2);
                                        }
                                      }
                                    }
                                  }
                                    float: left;
                                    text-align: center;
                                    height: 500px;
                                    .room-p {
                                        margin: 10px auto 30px;
                                        font-size: 16px;
                                        color: #323232;
                                    }
                                }

                            }
                        }
                    }
                }
            }

            .view-more {
                button {
                    border: 2px solid #323232;
                    color: #000000;
                    font-size: 16px;
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
    .style-color {
        float: left;
        font-size: 16px;
        color: #323232;
        margin: 6px 60px 0 40px;
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
