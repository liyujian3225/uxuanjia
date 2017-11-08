<!-- @Author: 李雨健——前台的预约设计弹窗
@Last Modified by:   李雨健 -->
<template>
  <div class="designReservation">
    <div class="black">
      <h1>——免费预约设计，遇见未来家——</h1>
      <p>截至当前，优选家已为30231位用户提供免费服务</p>
      <div class="distance">
        <el-input v-model="reservationName" placeholder="请输入您的称呼" name="reservationName" ></el-input>
      </div>
      <div class="distance">
        <el-select v-model="value" style="width:100%;" placeholder="请选择风格" name="style">
          <el-option
            v-for="item in tag"
            :key="item.levelId"
            :label="item.levelName"
            :value="item.levelId">
          </el-option>
        </el-select>
      </div>
      <div class="distance">
        <el-input v-model="budgetAmount" placeholder="请输入您的装修预算" name="budgetAmount"></el-input>
      </div>
      <div class="distance">
        <el-input v-model="picturecode" placeholder="请输入您的图形验证码" ></el-input>
        <div>
          <img class="image" :src="pictureCodeImage" alt="" @click="getPictureCode()">
        </div>
      </div>
      <div class="distance">
          <el-input v-model="cellphone" placeholder="请输入您的手机号码" name="cellphone"></el-input>
          <el-input v-model="phonecode" placeholder="验证码" name="phonecode"></el-input>
          <el-button @click="getPhoneCode()">{{flag == true ? time : phoneCodeButton}}</el-button>
      </div>
      <div class="distance">
        <el-upload
          class="upload-demo"
          drag
          action="http://test.uxuanjia.cn/platform/image?fileName=apartmentImg"
          name="apartmentImg"
          :headers='headers'
          :on-success="getPicUrl">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将户型图拖到此处，或<em>点击上传</em></div>
        </el-upload>
      </div>
      <div class="distance">
        <el-button  size="large" @click="submit()">确认提交</el-button>
      </div>
      <div @click="designHide">
        +
      </div>
    </div>
  </div>
</template>
<script>
  import api from '../api/api'
  export default {
    data() {
      return {
        reservationName:'',
        tag:[],
        value:'',
        budgetAmount:'',
        cellphone:"",
        phonecode:"",
        apartmentImg:"",
        fileList:'',
        pictureCodeImage: '',//图片验证码
        uuid:'',
        picturecode:'',
        time:61,
        phoneCodeButton:'点击获取验证码',
        flag:false,
        headers:{'Content-Type':'application/octet-stream'}
      }
    },
    //图片验证码的唯一标识符
    methods : {
      //点击关闭按钮
      designHide(){
        this.$emit('closeReservation');
      },
      //获取上传图片的地址
      getPicUrl(response){
        this.apartmentImg=response.data;
      },
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
      //获取图片验证码
      getPictureCode(){
        this.uuid = this.getUuid(8,16);
        this.pictureCodeImage = api.baseURL+'/phoneCode/'+this.uuid;
      },
      //点击获取手机验证码
      getPhoneCode(){
        let vm=this;
        api.phoneCode({
          "cellphone": vm.cellphone,
          "photoCode": vm.picturecode,
          "uuid": vm.uuid
        })
        .then(function(res){
          if(res.data.code==='200'){
            if(vm.time===61){
              vm.$message({
                message: '验证码已经发送至您的手机，请查收',
                type: 'success'
              });
              vm.timer();
            }
          }else{
            vm.$message({
              message: '验证码获取失败',
              type: 'success'
            });
            vm.getPictureCode();
          }
        })
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
      //获取风格列表
      getStyleList(){
        let vm=this;
        //参数也可以直接以查询字符串的方式去书写
        api.getStyleList().then(function(res){
            vm.tag=res.data.data;
        });
      },
      //提交数据到后台！
      submit(){
        let vm=this;
        api.phoneCodeCheck({
          "cellphone" : vm.cellphone,
          "phoneCode" : vm.phonecode
        })
        .then(function(res){
          if(res.data.code==='200'){
            api.postReservation({
              'reservationName':vm.reservationName,//预约申请人名称
              'labelId':vm.value,//风格id
              'budgetAmount':vm.budgetAmount,//装修预算
              'picturecode':vm.picturecode,//图新验证码
              "cellphone":vm.cellphone,//手机号码
              'phoneCode':vm.phonecode,//手机验证码
              'apartmentImg':vm.apartmentImg,//上传图片地址
              "dealStatus":"DEALING",
            })
            .then(function(res){
              if(res.status===200){
                vm.designHide();
                const h = vm.$createElement;
                vm.$notify({
                  title: '温馨提示',
                  message: h('i', { style: 'color: teal'}, '您的预约设计申请已经提交，请您等待工作人员的电话通知')
                });
              }
            });

          }else{
            vm.$message({
              message: '验证码输入错误'
            });
          }
        });
      },
      //移除模态框
      removeModule(){
          this.$emit('sendRemove');
      }
    },
    created : function(){
      this.getStyleList();
      this.getPictureCode();
      this.getPictureCode();
    }
  }
</script>
<style lang="sass">
  @import ../../static/css/designReservation
</style>
