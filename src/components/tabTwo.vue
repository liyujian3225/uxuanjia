<template>
    <div id="tab-main">
        <el-tabs v-model="editableTabsValue" @tab-click="handleClick">
            <el-tab-pane :key="index" v-for="(item, index) in titles" :label="item.levelName" :name="item.tagId+''">
                <div>
                    <div class="drawimg-room">

                        <div class="drawimg-roomleft" v-for="(aipPack,index) in aipPackList" :key="index" >
                            <router-link :to="'/houseDetails?aipId='+aipPack.aipId" target="_blank">
                              <div>
                                <img :src="aipPack.image" height="400" width="590" alt="" />
                              </div>
                            <p class="roomleft-p">{{aipPack.aipName}}</p>
                            </router-link>
                        </div>

                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div v-show="flag">
            <div class="drawimg-room clearfix">
                        <div class="drawimg-roomleft clearfix" v-for="(aipPack,index) in aipPackList" :key="index" >
                            <router-link :to="'/houseDetail?aipId='+aipPack.aipId" target="_blank">
                              <div>
                                <img :src="aipPack.image" height="400" width="590" alt="" />
                              </div>
                            <p class="roomleft-p">{{aipPack.aipName}}</p>
                            </router-link>
                        </div>
            </div>
        </div>
    </div>
</template>
<script>
import api from '../api/api';
export default {
    props: {
        titles: { type: Array },
    },
    data() {
        return {
            editableTabsValue: '',
            flag:true,
            aipPackList: [],
        }
    },
    mounted() {
        this.getSpaceClass();
    },
    methods: {
        handleClick(tab, event) {
            this.flag=false;
            let tagId = tab.$options.propsData.name;
            this.getSpaceClass(tagId);
        },



        //获取套餐数据
        getSpaceClass(tagId) {
            let vm = this;
            api.aipPack({
                params: {
                    apartmentType: 'HOUSEHOLD',
                    offset: 0,
                    limit: 2,
                    styleTagId:tagId,
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
                        vm.aipPackList = aipPack;
                    }
                })
                .catch(function(err) {
                      console.log(err)
                })
        }

    }
};
</script>
<style lang="scss">
#tab-main {
    .el-tab-pane {
        color: #000;
        height: 100px;
    }
    .el-tabs__nav {
        float: right;
        margin-right: 112px !important;
    }
    .el-tabs__item {
        font-size: 20px;
        color: #323232; // padding:0;
        // margin:0 20px;
    }
    .el-tabs__header {
        border-bottom: 0;
    }
    .el-tabs__item.is-active {
        color: #F29335;
    }
    .el-tabs__active-bar {
        height: 2px;
        background-color: #F29335;
    }
    .drawimg-room {
        .drawimg-roomleft {
            float: left;
            text-align: center;
            width: 50%;
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
            .roomleft-p {
                margin-top: 10px;
                font-size: 16px;
            }
        }
        .drawimg-roomright {
            float: right;
            text-align: center;
            width: 50%;
            .roomright-p {
                margin-top: 10px;
                font-size: 16px;
            }
        }
    }
}
</style>
