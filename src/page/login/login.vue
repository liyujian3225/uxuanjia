<!--登录-->
<template>
  <div class="loginBack">
    <div class="login">
      <div class="left">
        <img class="left-image" src="../../../static/image/login_bgImage.png" alt="">
      </div>
      <div class="right">
        <div>
          <img class="logo" src="../../../static/image/logo.png" alt="">
        </div>
        <el-input class="phoneNumber" v-model="phoneNumber" placeholder="请输入手机号"></el-input>
        <div class="pic">
          <el-input class="pictureCode" v-model="pictureCode" placeholder="验证码"></el-input>
          <div class="pictureCodeImage">
            <img class="image" :src="pictureCodeImage" alt="" @click="getPictureCodeImage">
          </div>
        </div>
        <div class="pic">
          <el-input class="phoneCode" v-model="phoneCode" placeholder="请输入短信验证码"></el-input>
          <el-button class="phoneCodeButton" @click="getPhoneCode">{{flag == true ? time : phoneCodeButton}}</el-button>
        </div>
        <el-button class="submit" @click="submit">确定</el-button>
      </div>
      <div class="del" @click="removeModule">
        +
      </div>
    </div>
  </div>
</template>
<script>
  import cookie from '../../store/cookie';
  import api from '../../api/api'
  export default {
    name: 'login',
    data() {
      return {
        phoneNumber: '',
        pictureCode: '',
        phoneCode: '',
        pictureCodeImage: '',//图片验证码
        phoneCodeButton: '获取验证码',
        flag: false,
        time: 61,
        uuid: '',
      }
    },
    mounted: function () {
      this.getPictureCodeImage();
    },
    methods: {
      getPictureCodeImage() {
        //获取图片验证码
        this.uuid = this.getUuid(8,16);
        this.pictureCodeImage = api.baseURL+'/phoneCode/'+this.uuid;
      },
      getPhoneCode() {
        //获取手机验证码
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
      submit() {
        let vm = this;
        api.login({
          cellphone: vm.phoneNumber,
          phoneCode: vm.phoneCode
        })
        .then(function(res){
          console.log('success');
          if (res.data.code === '200') {
            //登录成功 保存token
            vm.$store.commit('login', res.data.data.authToken);
            //发送消息到父组件，关闭登录组件
            vm.$emit("closeLoginView");
          }else {
            vm.$message.error(res.data.message);
          }
        }).catch(function(err){
          console.log(err);
        });
      },
      timer: function () {
        //倒计时
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
      },

      removeModule(){
          this.$emit('closeLogin');
      }
    }
  }
</script>

<style lang="sass">
  @import '../../../static/css/login'
</style>
