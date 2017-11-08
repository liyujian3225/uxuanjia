<!-- @Author: 李雨健
@Last Modified by:   李雨健 -->
<template>
  <header>
    <div class="header">
      <div class="header-com">
        <div class="left">
            <img :src="userInfo.photo" height="30" width="30" alt="" v-show="$store.state.login==true"/>
            <div class="left-content">
              <!--登录-->
              <span class="loginButton" v-show="loginStatus==false" @click="loginClick">登录</span>
              <span class="loginButton" @click="goPersonCenter" v-show="loginStatus==true" >{{userInfo.name}}</span>
              <com-Login v-if="dialogVisible" @closeLogin='removeLogin' @closeLoginView='removeModule'></com-Login>
              <span class="long-string" >|</span>
              <!--退出登录-->
              <span class="loginButton" @click="logouting">退出</span>
            </div>
        </div>
        <div class="right">
            <ul>
              <li>
                <router-link @click.native="needLogin" class="orderButton" to="/personCenter">我的订单</router-link>
                <span>|</span>
              </li>
              <li>
                <p>帮助中心</p>
                <span class="lineHelf">|</span>
              </li>
              <li>
                <p>
                  <a  href="http://wpa.qq.com/msgrd?v=3&uin=3445921547&site=qq&menu=yes" style="color:#fff;" target="_blank">联系客服</a>
                </p>
              </li>
            </ul>
        </div>
      </div>
    </div>
    <aside v-if="scroll>400">
      <ul>
        <li>
          <div class="iconfont icon-zaixianzixun1">
          </div>
          <div>
            <a  href="http://wpa.qq.com/msgrd?v=3&uin=3445921547&site=qq&menu=yes" style="color:#000;" target="_blank">在线咨询</a>
          </div>
        </li>
        <li class="string"></li>
        <li>
          <div class="iconfont icon-shouhou"></div>
          <div>售后服务</div>
        </li>
        <li class="string"></li>
        <li class="weChat">
          <div class="iconfont icon-zaixianzixun"></div>
          <div>公众号</div>
          <div class="qrCode">
            <img src="../../static/image/QR.jpg" alt="">
          </div>
        </li>
        <li class="string"></li>
        <li @click="scrollToTop()">
          <div class="iconfont icon-dingbu"></div>
          <div>回顶部</div>
        </li>
      </ul>

    </aside>
  </header>
</template>
<script>
  import Login from '../page/login/login.vue';
  import store from '../store/store';
  import api from '../api/api';
  import cookie from '../store/cookie';
  export default {
    name: 'header',
    data () {
      return{
        dialogVisible: false,
        userInfo:{},
        loginStatus:'',
        scroll: ''
      }
    },
    created(){
        // console.log(this.$store.state.user)
        this.loginStatus = this.$store.state.login;
        if(this.$store.state.user){
           this.userInfo=this.$store.state.user;
        }

        this.$store.state.token && cookie.setCookie('platform_sid',this.$store.state.token)
    //    cookie.setCookie('platform_sid','YOO7xLaWJEX83nFnvozc7aAOk42xCSNuvI1srpOK99RleCkBiBonAQWAymV%2FtDtQgkgnpV5ImNFqWIU%2BBXn2CsGPrxF2IkdxeXkrXIeIcEDl6U%2Bf%2BeEpE18nDj7XLl%2BqSzoPbpkAYw13LQk1%2BQD6Ng%3D%3D');
    },
    mounted(){
      this.$store.state.login &&  this.getUserInfo();
      window.addEventListener('scroll', this.menu)
    },
    components: {
      comLogin: Login
    },
    methods: {
      menu() {
        this.scroll = document.body.scrollTop||document.documentElement.scrollTop;
      },
      //顶级回到顶部
      scrollToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      loginClick() {
        this.dialogVisible = true;
      },
      removeLogin(){
         this.dialogVisible=false;
      },
      removeModule(){
          this.dialogVisible=false;
          //解决自动刷新
          setTimeout(function() {
               window.location.reload();
          }, 500);

      },
      //订单页面需要登录
      needLogin(){
          if(!this.$store.state.login){
             this.dialogVisible=true;
          }
      },
      //获取个人信息
      getUserInfo(){
         let vm = this;
         api.userInfo()
         .then(function (res) {

             let info = res.data.data;
             info.photo = api.baseURL + '/image' + info.photo;
             vm.userInfo = info;
            //  console.log(res.data.data);
            vm.$store.commit('user',info);
          })
        .catch(function (error) {
            console.log(error);
         })
      },

      //退出登录
      logouting(){
         this.$store.commit('logout');
         cookie.clearCookie();
         this.$router.push('/');
         window.location.reload();
      },
      goPersonCenter(){
          this.$router.push('/personCenter')
      }
    }
  }
</script>
<style scoped lang="sass">
  @import '../../static/css/header'
</style>
