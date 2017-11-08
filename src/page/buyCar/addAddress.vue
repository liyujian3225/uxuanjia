<!--添加收货地址-->
<template>
    <div class="addAddress">
        <div class="title">
            <div class="first">
                <div class="line1"></div>
                <span class="text">添加收货地址</span>
                <div class="line2"></div>
            </div>
            <span class="second">(以下均为必填项，请认真填写，避免收货时发生意外)</span>
        </div>
        <div class="content">
            <select @click='writing' v-model="prov" class='province'>
                <option value="">选择省</option>
                <option v-for="(option,index) in proviceArr" :key="index" :value="option.name">
                    {{ option.name }}
                </option>
            </select>
            <select @click='writing' v-model="city" class='city'>
                <option value="">市/县</option>
                <option v-for="(option,index) in cityArr" :key="index" :value="option.name">
                    {{ option.name }}
                </option>
            </select>
            <select @click='writing' v-model="area" class='area'>
                <option value="">地区</option>
                <option v-for="(option,index) in areaArr" :key="index" :value="option.name">
                    {{ option.name }}
                </option>
            </select>
            <!-- <el-input class="province" placeholder="  省" v-model="province"></el-input>
                  <el-input class="city" placeholder="  市" v-model="city"></el-input>            
                  <el-input class="area" placeholder="  区/县" v-model="area"></el-input> -->
            <el-input @focus='writing' class="name" placeholder="收货人姓名" v-model="userName"></el-input>
            <el-input @focus='writing' class="detail" placeholder="详细地址" v-model="detail"></el-input>
            <el-input @focus='writing' class="phone" placeholder="联系电话/手机" v-model="phone"></el-input>
            <el-switch @focus='writing' class="default" v-model="value" on-text="" off-text=""></el-switch>
            <!-- <img src="../../../static/image/buyCar/buyCar_wxz.png" alt="" class="default"  @click="defaultClick"> -->
            <span class="text">设为默认地址</span>
            <span v-show='needPassInfo'  class='passInfo'>{{passTip}}</span>
        </div>
        <el-button class="submit" @click="submit">确定</el-button>
        
    </div>
</template>

<script>
import api from '../../api/api';
import axios from 'axios';
export default {
    data() {
        return {
            prov: '',
            city: '',
            area: '',
            userName: '',
            detail: '',
            phone: '',
            proviceArr: [],
            cityArr: [],
            areaArr: [],
            value: false,
            areaId: '',
            needPassInfo:false,
            passTip:''
        }
    },
    created() {
           if(this.$store.state.editAddress){
                this.prov = this.$store.state.editAddress.province.name 
                this.area = this.$store.state.editAddress.area.name 
                this.city = this.$store.state.editAddress.city.name 
                this.userName = this.$store.state.editAddress.name 
                this.detail = this.$store.state.editAddress.address 
                this.phone = this.$store.state.editAddress.cellphone 
                this.areaId = this.$store.state.editAddress.areaId 
           }
            
            this.getProvice();
            this.getCity(this.prov);
            this.getArea(this.city);
    },
    methods: {
         
        submit() {
              let vm = this;
            if(this.areaId==''||this.phone==''||this.userName==''||this.detail==''){
                this.needPassInfo = true; 
                if(this.areaId==''&&this.phone!=''&&this.userName!=''&&this.detail!=''){
                    this.passTip = '请选择省市县地区'
                }else if(this.areaId!=''&&this.phone!=''&&this.userName==''&&this.detail!=''){
                    this.passTip = '请输入您的姓名'
                }else if(this.areaId!=''&&this.phone!=''&&this.userName!=''&&this.detail==''){
                    this.passTip = '请输入您的详细地址'
                }else if(this.areaId!=''&&this.phone==''&&this.userName!=''&&this.detail!=''){
                    this.passTip = '请输入您的手机号码'
                }else{
                    this.passTip = '请确保您填的信息齐全'
                }
            }else{
                    this.needPassInfo = true; 
                    let reg = /^1[3|4|5|8][0-9]\d{4,8}$/;
                    if(reg.test(this.phone)==false){
                        this.passTip = '请输入正确的手机号码'
                    }else{
                         if (vm.$store.state.editAddress) {
                    //编辑当前订单
                    axios.put(api.baseURL + '/' + api.addressUrl + '/' + vm.$store.state.editAddress.addressId, {
                        areaId: vm.areaId,
                        cellphone: vm.phone,
                        name: vm.userName,
                        address: vm.detail,
                    })
                        .then(function(res) {
                            if (res.data.code === "200") {
                                vm.$emit("defaultSet",vm.$store.state.editAddress.addressId,vm.value);
                            }
                        })
                        .catch(function(err) {
                            console.log(err)
                        })
                } else {
                    api.addAddress({
                        areaId: vm.areaId,
                        cellphone: vm.phone,
                        name: vm.userName,
                        address: vm.detail,
                    })
                        .then(function(res) {
                            if (res.data.code === "200") {
                                let info = res.data.data.addressId;
                                vm.$emit("defaultSet",info,vm.value);
                            }
                        })
                        .catch(function(err) {
                            console.log(err)
                        })
                }

                    }
               
            }
            
            

            //发送消息到父组件，关闭地址组件

        },
        //获取一级地方数据
        getProvice() {
            let vm = this;
            axios.get(api.baseURL + '/area')
                .then(function(res) {
                    if (res.data.code === "200") {
                        //  console.log(res.data.data)
                        vm.proviceArr = res.data.data;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },

        //获取二级地方数据
        getCity(prov) {
            let vm = this;
            axios.get(api.baseURL + '/area' + '/' + prov)
                .then(function(res) {
                    if (res.data.code === "200") {

                        vm.cityArr = res.data.data.items;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },

        //获取三级地方数据
        getArea(city) {
            let vm = this;
            axios.get(api.baseURL + '/area' + '/' + city)
                .then(function(res) {
                    if (res.data.code === "200") {
                        vm.areaArr = res.data.data.items;
                    }
                })
                .catch(function(err) {
                    console.log(err)
                })
        },

        writing(){
            this.needPassInfo = false;
        }

    },

    watch: {
        prov(val) {
            //获取省areaId
            let areaId = this.proviceArr.filter(item => item.name == val)[0].areaId

            this.getCity(areaId);
        },
        city(val) {
            //获取市areaId
            let areaId = this.cityArr.filter(item => item.name == val)[0].areaId
            this.getArea(areaId);

        },
        area(val) {
            //获取区areaId
            let areaIdArr = this.areaArr.filter(item => item.name == val)
            this.areaId = areaIdArr[0].areaId;
        }

    }


}
</script>

<style lang="sass">
  @import '../../../static/css/addAddress'
</style>
