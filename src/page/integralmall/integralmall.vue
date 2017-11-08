<!--
积分商城，京东电子礼品卡卷 李雨健
-->
<template>
  <div>
    <div class="img">
      <img src="../../../static/image/home/banner2.png" alt="" />
    </div>
  <ul class="integralmall">
    <li class="first">
      <div>———京东电子礼品卡券———</div>
      <p>
        (使用说明：兑换成功后，平台将通过短信将卡号和密码发送至您的手机，登陆您的京东账号，购物时输入账号密码即可使用)
      </p>
    </li>
    <li class="last">
      <div>
        <a href="javascript:;" @click="dialogVisible = true;getProductMessage(index)" v-for="(item,index) in productList">
          <img  alt="" :src="item.fullPath">
          <h3>&yen;{{item.couponProductValue/10000}}</h3>
        </a>
      </div>
    </li>
    <li class="log" v-if="dialogVisible">
        <div>
          <div>
            <img src="../../../static/image/logo.png" alt="">
          </div>
          <p>免费全包软装设计，重新诠释空间大小定义</p>
          <p>本次兑换需消耗U币:&yen;{{couponValue/10000}}</p>
          <p>剩余U币:&yen;{{restValue/10000}}</p>
          <div class="pictureCode">
            <el-input class="pictureCode" v-model="pictureCode" placeholder="验证码" ></el-input>
            <div class="pictureCodeImage">
              <img class="image" :src="pictureCodeImage" alt="" @click="getPictureCodeImage">
            </div>
          </div>
          <div class="phoneNumber">
            <el-input class="phoneNumber" v-model="phoneNumber" placeholder="请输入手机号"></el-input>
            <el-input class="phoneCode" v-model="phoneCode" placeholder="短信验证码"></el-input>
            <el-button class="phoneCodeButton" @click="getPhoneCode">{{flag == true ? time : phoneCodeButton}}</el-button>
          </div>
          <div>
            <el-radio class="radio" v-model="wealthType" label="POINT">U币兑换</el-radio>
            <el-radio class="radio" v-model="wealthType" label="CASH">现金兑换</el-radio>
          </div>
          <div @click="exchange">确认兑换</div>
          <div @click="attention=true;del=false">(查看须知)</div>
          <transition name="fade">
            <div v-if="attention" class="attention">
              <h2>兑换商品</h2>
              <p>
                本次兑换商品（京东电子礼品卡）确认提交后，系统将以短信形式将京东卡号及密码发送到您的手机，请注意查收
              </p>
              <h2>兑换须知</h2>
              <p>
                扣除U币后，平台将卡号和密码发送至您的手机前，如需退换请拨打客服电话400—606—6866，进行撤销；若平台已确认兑换，积分将不予支持退换。
              </p>
              <h2>权责声明</h2>
              <p>
                最终解释权归优选家平台所有
              </p>
              <div @click="attention=false;del=true"><</div>
            </div>
          </transition>
          <a href="javascript:;" @click="hide" v-if="del" class="del">
            +
          </a>
        </div>
    </li>
  </ul>
  </div>
</template>
<style lang="sass">
  @import '../../../static/css/integralmall'
</style>
<script>
  import api from '../../api/api'
  export default {
    name : 'integralmall',
    data () {
      return {
        phoneNumber: '',
        dialogVisible: false,
        attention:false,
        del:true,
        productList:'',
        pictureCode: '',
        phoneCode: '',
        pictureCodeImage: '',
        phoneCodeButton: '获取验证码',
        flag: false,
        time: 61,
        uuid: '',
        wealthType:'',
        couponProductId:'',
        couponValue:'',
        restValue:''
      }
    },
    methods: {
      //获取用户的剩余U币
      getUserInfo(){
        let vm = this;
        api.userInfo()
          .then(function (res) {
            vm.restValue=res.data.data.consumablePoint;
          })
      },
      //获取京东电子购物卷列表
      getCouponProduct() {
        let vm=this;
        api.getCouponProduct().then(function(res){
          vm.productList=res.data.data.productList;
          vm.productList.forEach(function(value){
            value.fullPath=api.baseURL+'/image'+value.photo;
          });
        })
      },
      hide(){
        this.dialogVisible=false
      },
      //点击兑换卷获取兑换卷的详细信息
      getProductMessage(value){
        this.couponProductId=this.productList[value].couponProductId;
        this.couponValue=this.productList[value].couponProductValue;
      },
      //兑换京东电子购物卷
      exchange(){
        let vm=this;
        const h = vm.$createElement;
        if(!vm.pictureCode){
          vm.$notify({
            title: '温馨提示',
            message: h('i', { style: 'color: teal'}, '请您输入图形验证码！')
          });
          return;
        };
        if(!vm.phoneNumber){
          vm.$notify({
            title: '温馨提示',
            message: h('i', { style: 'color: teal'}, '请您输入手机号码！')
          });
          return;
        };
        if(!vm.phoneCode){
          vm.$notify({
            title: '温馨提示',
            message: h('i', { style: 'color: teal'}, '手机验证码为空！')
          });
          return;
        };
        if(!vm.wealthType){
          vm.$notify({
            title: '温馨提示',
            message: h('i', { style: 'color: teal'}, '请选择您的支付方式！')
          });
          return;
        }
        api.postExchange({
          "phone":vm.phoneNumber,
          "phoneCode":vm.phoneCode,
          "couponProductId":vm.couponProductId,
          "couponValue":vm.couponValue,
          "wealthType":vm.wealthType,
          "quantity":vm.couponValue,
        }).then(function(res){
          vm.$notify({
            title: '温馨提示',
            message: h('i', { style: 'color: teal'}, res.data.message)
          });
          vm.hide();
        })
      },
      //获取图片验证码
      getPictureCodeImage() {
        this.uuid = this.getUuid(8,16);
        this.pictureCodeImage = api.baseURL+'/phoneCode/'+this.uuid;
      },
      //获取手机验证码
      getPhoneCode() {
        let vm = this;
        api.phoneCode({
          cellphone: vm.phoneNumber,
          photoCode: vm.pictureCode,
          uuid: vm.uuid})
          .then(function(res){
            if (res.data.code === '200') {
              if (vm.time === 61) {
                vm.$message({
                  message: '验证码发送成功，请留意短信',
                  type: 'success'
                });
                vm.timer();
              }
            }else {
              vm.$message.error(res.data.message);
              vm.getPictureCodeImage();
            }
          }).catch(function(err){
          console.log(err);
        });
      },
      //倒计时
      timer: function () {
        if (this.time > 1) {
          this.flag = true;
          this.time--;
          setTimeout(this.timer, 1000);
        }else {
          this.flag = false;
          this.phoneCodeButton = "重新获取";
          this.time = 61;
        }
      },
      //获取唯一标志
      getUuid(len, radix) {
        let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        radix = radix || chars.length;

        if (len) {
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
          let r;

          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';

          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i = 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
      }

    },
    created: function(){
      this.getCouponProduct();
      this.getUserInfo();
      this.getPictureCodeImage();
    }
  }
</script>
