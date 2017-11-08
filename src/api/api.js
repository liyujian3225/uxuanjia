import axios from 'axios'
import qs from 'qs'
import store from '../store/store'
// axios 配置
axios.defaults.timeout = 5000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.baseURL = 'http://test.uxuanjia.cn/platform';//测试环境
// axios.defaults.baseURL = 'https://api.uxuanjia.com/platform';//生产环境
//本地http://localhost:8089/platform


export default {
  baseURL: 'http://test.uxuanjia.cn/platform',//测试环境
  //baseURL: 'https://api.uxuanjia.com/platform',//生产环境

  phoneCodeURL: '/phoneCode/',//验证码
  loginURL: '/auth/phoneCode',//手机登录
  getStyleListUrl: '/mobile/labels/tags?parentExtType=CREATIVE&extType=STYLE',//获取风格标签
  phoneCodeCheckURL: '/phoneCode/check',//预约设计数据提交
  postReservationURL: '/mobile/designReservation',
  uploadPictureUrl: "/image?fileName=apartmentImg",//预约设计主图的上传地址
  myPointUrl:'/m/point',//获取用户的U币
  myPointExchangeInfoUrl:'/m/pointFlow?type=POINT_EXCHANGE&&offset=0',//用户U币兑换详情
  myPointEnableInfoUrl:'/m/pointFlow?type=POINT_ENABLE&&offset=0',//用户U币返还详情
  myPointGetInfoUrl:'/m/pointFlow?type=POINT_GET&&offset=0',//用户U币获得详情
  couponProductUrl: '/mobile/couponProduct/sub/1080',//获取京东电子卷列表
  exchangeUrl: '/m/coupon/exchange',//京东电子卷兑换接口
  willReturnUrl:'/m/point/willReturn',//用户三个月内待返U币
  pointConsumeUrl:'/m/point/consume',//用户三个月内U币兑换记录


  homeListURL: '/mobile/premises/search',//首页列表
  buyCarURL: '/m/shoppingCart/list',//购物车列表
  tagsURL: '/mobile/labels/tags',//标签列表
  topBannerUrl:'mobile/advertisement/list', //顶部广告
  aipPackUrl:'/mobile/aipPack/search',//套餐列表
  productUrl:'/mobile/product/search',//商品列表
  productCategoryUrl:'/mobile/product/category',//商品分类
  aipPackDetailUrl:'/mobile/aipPack/',//套餐详情
  productDetailUrl:'/mobile/product/',//产品详情
  pointUrl:'/mobile/special/search/v3.0',//优选观点
  joinBuyCartUrl:'/m/shoppingCart', //加入到购物车
  userInfoUrl:'/profile',  //获取个人信息
  delectProductUrl:'/m/shoppingCart/',//删除购物车商品
  addressUrl:'m/customer/address',  //新增用户地址 用户地址列表 修改用户地址 获取单个地址 删除单个地址
  payUrl:'/m/lianlianpay/prepay',  //支付
  saleOrderListUrl:'/m/saleOrder/list',  //订单列表
  saleOrderDetailUrl:'/m/saleOrder/', //订单详情
  saleOrderGoUrl:'/m/saleOrder/submit',//提交订单


  /*** 获取手机验证码*/
  phoneCode(params) {
    return axios.post(this.phoneCodeURL,params);
  },
  /*** 获取手机验证码之后进行登陆*/
  login(params) {
    return axios.post(this.loginURL,params);
  },
  /*** 获取风格标签*/
  getStyleList(params) {
    return axios.get(this.getStyleListUrl,params);
  },
  /*** 预约设计的数据提交*/
  phoneCodeCheck(params) {
    return axios.post(this.phoneCodeCheckURL,params);
  },
  postReservation(params) {
    return axios.post(this.postReservationURL,params);
  },
  /*** 获取电子卷列表*/
  getCouponProduct(params) {
    return axios.get(this.couponProductUrl,params);
  },
  /*** 获取用户的U币信息*/
  getMyPoint(params) {
    return axios.get(this.myPointUrl,params);
  },
  /*** 获取用户的U币兑换详情*/
  getMyPointExchangeInfo(params) {
    return axios.get(this.myPointExchangeInfoUrl,params);
  },
  /*** 获取用户的U币返还详情*/
  getMyPointEnableInfo(params) {
    return axios.get(this.myPointEnableInfoUrl,params);
  },
  /*** 获取用户的U币获得详情*/
  getMyPointGetInfo(params) {
    return axios.get(this.myPointGetInfoUrl,params);
  },
  /*** 获取电子卷列表*/
  getCouponProduct(params) {
    return axios.get(this.couponProductUrl,params);
  },
  /*** 京东电子卷兑换接口*/
  postExchange(params) {
    return axios.post(this.exchangeUrl,params);
  },
  /*** 获取用户的订单列表*/
  getSaleOrderList(params) {
    return axios.get(this.saleOrderListUrl,params);
  },
  /*** 获取用户的待支付、待付款、待评价订单列表*/
  getOrderList(params) {
    return axios.post(this.saleOrderListUrl,params);
  },
  /*** 用户三个月内待返U币*/
  getWillReturn(params) {
    return axios.get(this.willReturnUrl,params);
  },
  /*** 用户三个月内U币兑换记录*/
  getPointConsume(params) {
    return axios.get(this.pointConsumeUrl,params);
  },





  /**
   * 首页列表
   */
  homeList(params) {
    return axios.get(this.homeListURL,params);

  },

  /**
   * 购物车列表
   */
  buyCar(params) {
    // const x = 'platform_sid='+store.state.token;
    // return axios({
    //   method: 'get',
    //   url: '/m/shoppingCart/list',
    //   // withCredentials: true,
    //   headers: {
    //     cookie: 'ftv1443qby6bdfa41t90sfvq89hg3h54u989m9imog79g4'
    //   }
    // });
    return axios.get(this.buyCarURL,params);
  },
  /**
   * 套餐标签
   */
  tags(params){
    return axios.get(this.tagsURL,params);
  },
  /**
   * 头部广告
   */
  topBanner(params){
    return axios.get(this.topBannerUrl,params)
  },
  /**
   * 套餐列表
   */
  aipPack(params){
    return axios.get(this.aipPackUrl,params)
  },
  /**
   * 商品列表
   */
  product(params){
    return axios.get(this.productUrl,params)
  },
  //获取风格标签
  getStyleList(){
    return axios.get(this.getStyleListUrl)
  },

  /**
   * 商品分类
   */
  productCategory(params){
    return axios.get(this.productCategoryUrl,params)
  },
  /**
   * 优选观点
   */
  point(params){
    return axios.get(this.pointUrl,params)
  },
  /**
   * 优选观点
   */
  userInfo(params){
    return axios.get(this.userInfoUrl,params)
  },
  /**
   * 加入购物车
   */
  joinBuyCart(params){
    return axios.post(this.joinBuyCartUrl,params)
  },
  /**
   * 购物车列表
   */
  buyCartList(params){
    return axios.get(this.buyCarURL,params)
  },
  addAddress(params){
    return axios.post(this.addressUrl,params)
  },
  /**
   * 新增用户地址
   */
  addressList(params){
    return axios.get(this.addressUrl,params)
  },
  /**
   * 支付
   */
  pay(params){
    return axios.post(this.payUrl,params)
  },
  /**
   * 提交订单
   */
  saleOrderGo(params){
    return axios.post(this.saleOrderGoUrl,params)
  },

}


