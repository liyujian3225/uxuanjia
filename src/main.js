// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//  main.js入口文件，主要作用是初始化vue实例并使用需要的插件
//  vue.config.productionTip为false启动时会生成生产提示
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import store from './store/store'
import '../static/icon/iconfont.css'


Vue.config.productionTip = false;
Vue.prototype.host="/ser";
Vue.use(ElementUI);
Vue.use(Vuex);




let vm = new Vue({
  el: '#app',
  router,
  store:new Vuex.Store(store),
  template: '<App/>',
  components: { App }
})


// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {// 判断是否需要登录权限
    if (localStorage.getItem('login')) {// 判断是否登录
     next();
    } else {// 没登录则跳转到登录界面
    //  next({
    //  path: '/Register',
    //  query: {redirect: to.fullPath}
    //  })
    //    alert('请先登录');
    }
    } else {
    next()
    }
   })
