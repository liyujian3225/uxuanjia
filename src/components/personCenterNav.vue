<template>
    <div class="parent">
        <div class="personnav">
            <div class="left">
                <router-link to="/">
                  <img src="../../static/image/person/1.png" alt="">
                </router-link>
            </div>
            <div class="right">
                <router-link to="/">优选家首页</router-link>
                <router-link :class="{navCurrent:activeIndex=='/personCenter'}" to="/personCenter">订单</router-link>
                <router-link :class="{navCurrent:activeIndex=='/myUcoin'}" to="/myUcoin">U币</router-link>
            </div>
        </div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>
<style lang="sass">
  @import '../../static/css/personCenterNav'
</style>
<script>
export default {
    name: 'personCenterNav',
    data() {
        return {
            // 导航栏
            activeIndex: '',
        }
    },
    created(){
            this.activeIndex = this.$route.path;
    }
}

</script>
