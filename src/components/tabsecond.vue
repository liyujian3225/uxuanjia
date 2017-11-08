<template>
    <div class="second-menu">
        <!-- 二级tab切换 -->
        <div class="tab-second">
            <div class="tab-second-head">
                <div v-for="(item, index) in tab1" :key="index" @click="tab1Change(item, index)" :class="{active: tab1ChoseCount==item.category1Id}" class="tab-second-one icon-img">
                    <div class="icon-imgshow" >
                        <img :src="item.image" alt="">
                    </div>
                    {{item.category1Name}}
                </div>
            </div>

            <br>
            <div  class="tab-second-main">
                <div v-for="(item, index) in tab2" :key="index" @click="tab2Change(item, index)" :class="{active: tab2ChoseCount==item.category2Id}" class="tab-second-one">
                    {{item.category2Name}}
                </div>
            </div>
            <div v-for="(item,index) in tab3" :key="index" class="tab-second-three">
                <div  class="tab-second-three-img clearfix">
                    <router-link target="_blank" :to="'/productDetail?productId='+item.productId">
                        <div>
                          <img :src="item.productImage" alt="" />
                        </div>
                        <div>{{item.productName}}</div>
                        <div>¥{{item.salePrice/10000}}</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../api/api';
export default {

    data: () => ({
        active: false,
        tab1: [],
        tab1ChoseCount: 1,
        tab2ChoseCount: 1,
        tab2: [],
        tab3: [],
        tab2show: 1,
        tab3show: 1,

    }),

    // 二级tab切换
    created() {
        this.getProductCategory();
    },

    mounted() {
    },

    methods: {
        // 二级tab切换
        tab1Change(item, index) {
            this.tab2 = item.category2s
            this.tab1ChoseCount = item.category1Id
            this.tab2ChoseCount = item.category2s[0].category2Id
            this.getProduct(this.tab2ChoseCount)
        },

        tab2Change(item, index) {
            this.tab3 = item.category2s;
            this.tab2ChoseCount = item.category2Id;
            this.getProduct(this.tab2ChoseCount);
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
                        vm.getProduct(vm.tab2ChoseCount);
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },
        //获取商品
        getProduct(category2Id) {
            let vm = this;
            api.product({
                params: {
                    category2Id: category2Id,
                    limit: 8
                }
            })
                .then(function(res) {
                    if (res.data.code === "200") {
                        //   vm.tab2.push(...res.data.data);
                        //   console.log(res.data.data.items);
                        var productList = res.data.data.items;
                        for (var i = 0; i < productList.length; i++) {
                            productList[i].productImage = api.baseURL + '/image' + productList[i].productImage+'285x276';
                        }
                        vm.tab3 = productList;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        }
    },
    computed: {},
    watch: {},
}
</script>
<style scoped lang="scss">
  @import '../../static/css/tabsecond';
</style>
