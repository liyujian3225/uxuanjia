<template>
    <!-- 导航栏 -->
    <div id="nav-bar">
        <div class="index-logo">
          <router-link to="/">
            <img src="../../static/image/logo.png" height="57" width="220" alt="" />
          </router-link>
        </div>
        <div class="buyCar">
            <span>{{shoppingNum}}</span>
            <router-link @click.native="isLogin" to="/buyCar">
                <i class="iconfont icon-gouwuche"></i>
            </router-link>
            <com-Login v-if="dialogVisible" @closeLogin='removeLogin' @closeLoginView='removeModule'></com-Login>
        </div>
        <div class="index-nav">
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">

                <el-menu-item index="/">
                    <router-link to="/">
                        首页
                    </router-link>
                </el-menu-item>

                <el-menu-item index="/spacePackage">
                    <router-link to="/spacePackage">
                        空间套餐
                    </router-link>
                </el-menu-item>

                <el-menu-item index="/house">
                    <router-link to="/house">
                        全屋套餐
                    </router-link>
                </el-menu-item>

                <el-menu-item index="/product">
                    <router-link to="/product">
                        优选良品
                    </router-link>
                </el-menu-item>

                <el-menu-item index="/integralmall">
                    <router-link to="/integralmall">
                        积分商城
                    </router-link>

                </el-menu-item>
                <el-menu-item index="/about">
                    <router-link to="/about">
                        关于我们
                    </router-link>

                </el-menu-item>
            </el-menu>

            <router-view></router-view>
        </div>
    </div>
</template>
<script>
import Login from "../page/login/login.vue";
import api from "../api/api.js";
export default {
  name: "header",
  data() {
    return {
      dialogVisible: false,
      activeIndex: "/",
      shoppingNum:this.$store.state.shoppingNum
    };
  },
  created() {
    this.activeIndex = this.$route.path;
    this.getCartList();
  },
  components: {
    comLogin: Login
  },
  computed:{
     listenNumber(){
         return this.$store.state.shoppingNum;
     }
  },
  watch:{
     listenNumber(val){
       this.shoppingNum = val;
     }
  },
  methods: {
    // 导航栏
    handleSelect(key, keyPath) {
      // console.log(key, keyPath);
    },
    //购物车 需要登录
    isLogin() {
      if (!this.$store.state.login) {
        this.dialogVisible = true;
      }
    },
    removeLogin() {
      this.dialogVisible = false;
    },
    removeModule() {
      this.dialogVisible = false;
      //解决自动刷新
      setTimeout(function() {
        window.location.reload();
      }, 500);
    },

    //获取购物车列表数据
    getCartList() {
      if (this.$store.state.login) {
        let vm = this;
        api.buyCartList()
          .then(function(res) {
            // console.log(res.data.data.items);
             vm.shoppingNum = res.data.data.items.length;
             vm.$store.commit("shoppingSum",vm.shoppingNum);
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  }
};
</script>
<style scoped lang="scss">
// 导航栏
#nav-bar {
  position: relative;
  .index-logo {
    margin: 25px auto 6px;
  }
  .buyCar {
    position: absolute;
    right: 300px;
    top: 35px;
    i {
      font-size: 30px;
      color: #000;
    }
    span {
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #f2902d;
      text-align: center;
      line-height: 20px;
      left: 25px;
      bottom: 20px;
      color: white;
      font-size: 12px;
    }
  }
  .index-nav {
    margin: 0 auto;
    .el-menu {
      background-color: #fff;
    }
    .el-menu-item {
      a {
        height: 50px;
        display: block;
      }
    }
    .el-menu-item,
    .el-submenu__title {
      color: #000;
      font-size: 16px;
      margin: 0 36px !important;
      padding: 0;
    }
    .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active,
    .el-menu-item.is-active {
      color: #f2902d;
      border-bottom: 2px solid #f2902d !important;
    }
    .el-menu--horizontal .el-submenu .el-submenu__title {
      border-bottom: 0;
    }
    .el-menu--horizontal > .el-menu-item:hover,
    .el-menu--horizontal > .el-submenu.is-active .el-submenu__title,
    .el-menu--horizontal > .el-submenu:hover .el-submenu__title {
      border-bottom: 0;
    }
    .el-menu--horizontal .el-menu-item {
      border-bottom: 0px;
      height: 50px;
    }
    .el-menu-demo {
      width: 802px;
      height: 70px;
      margin: 0 auto;
    }
    .el-menu--horizontal .el-menu-item:hover,
    .el-menu--horizontal .el-submenu__title:hover {
      background-color: #fff;
    }
  }
}
</style>
