<!--
app.vue是我们的主组件，所有页面都是在App.vue下进行切换的，由于app.vue在所有页面都有，我们在app.vue
上写一些初始化全局的方法
-->
<template>
  <div id="app">
    <com-header></com-header>
    <router-view></router-view>
    <com-footer></com-footer>
  </div>
</template>

<script>
  import Header from './components/header.vue'
  import Footer from './components/footer.vue'
  export default {
      data () {
        return{

        }
      },
      components: {
        comHeader: Header,
        comFooter: Footer,
      }

  }

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000;
  font-size: 14px;
}
* {
  padding:0;
  margin:0;
  list-style:none;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
a {
  text-decoration:none;
}
</style>
