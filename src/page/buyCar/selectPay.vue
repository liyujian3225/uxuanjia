<!--选择支付方式-->
<template>
    <div class="selectPay">
        <div class="title">
            <div class="first">
                <div class="line1"></div>
                <span class="text">选择支付方式</span>
                <div class="line2"></div>
            </div>
            <span class="second">(您的订单已提交成功,请及时支付,支付完成后,客服将可能会电话回访跟您确认订单信息,请保持电话畅通!)</span>
        </div>
        <div v-show="payStatus" class="selectView">
            <div class="left" @click="select1Click">
                <img class="image" :src="onlineImage" alt="">
                <span class="text">银行卡支付</span>
            </div>
            <div class="right" @click="select2Click">
                <span class="text">Pos机支付</span>
                <img class="image" :src="offlineImage" alt="">
            </div>
        </div>
        <div class="onlinePay" v-show="showOnLine">
            <el-input class="name" @focus='writing' placeholder="  持卡人姓名" v-model="name"></el-input>
            <el-input class="number" @focus='writing' placeholder="  请输入身份证号码" v-model="idNumber"></el-input>
            <span class="passInfo" v-show="needPassInfo">{{passInfo}}</span>
        </div>
        <div class="posPay" v-show="showOffLine">
            <div v-show="payStatus" id="qrcode"></div>
            <div class="noPay" v-show="!payStatus">支付失败！</div>
            <p v-show="!payStatus">{{countDown}}秒后跳到订单页面</p>
        </div>
        <el-button v-show="showOnLine" class="submit" @click="submit">确定</el-button>
        <div class="threePay">
            <form v-show="false"  ref="formPay" action="https://cashier.lianlianpay.com/payment/authpay.htm" method="post">
                <input type="text" name="version" v-model="version">
                <input type="text" name="oid_partner" v-model="oid_partner">
                <input type="text" name="user_id" v-model="user_id">
                <input type="text" name="busi_partner" v-model="busi_partner">
                <input type="text" name="no_order" v-model="no_order">
                <input type="text" name="dt_order" v-model="dt_order">
                <input type="text" name="name_goods" v-model="name_goods">
                <input type="text" name="timestamp" v-model="timestamp">
                <input type="text" name="money_order" v-model="money_order">
                <input type="text" name="notify_url" v-model="notify_url">
                <input type="text" name="url_return" v-model="url_return">
                <input type="text" name="pay_type" v-model="pay_type">
                <input type="text" name="sign_type" v-model="sign_type">
                <input type="text" name="sign" v-model="sign">
                <input type="text" name="risk_item" v-model="risk_item">
                <input type="text" name="id_type" v-model="id_type">
                <input type="text" name="id_no" v-model="id_no">
                <input type="text" name="acct_name" v-model="acct_name">
                <input type="submit" value="确认">
            </form>
        </div>
    </div>
</template>

<script>
import api from "../../api/api";
import axios from "axios";
import QRCode from "../../../static/js/qrcode.js";

export default {
  props: ["page"],
  data() {
    return {
      idNumber:"",
      radio: "1",
      showOnLine: true, //银行卡支付
      showOffLine: false, //pos支付
      name: "",
      number: "",
      onlineImage: "../../../static/image/buyCar/selectPay_select.png",
      offlineImage: "../../../static/image/buyCar/selectPay_unselect.png",
      payStatus: true,
      countDown: 10,
      //第三方提交数据
      version: "",
      oid_partner: "",
      user_id: "",
      busi_partner: "",
      no_order: "",
      name_goods: "",
      money_order: "",
      notify_url: "",
      url_return: "",
      pay_type: "",
      sign_type: "",
      sign: "",
      timestamp: "",
      dt_order: "",
      risk_item: "",
      id_type: "",
      id_no: "",
      acct_name: "",
      payNum: "",
      payData: "",
      saleOrderId: "",
      payNumber: "",
      timer: "",
      passInfo: "",
      needPassInfo: false
    };
  },
  methods: {
    select1Click() {
      this.showOnLine = true;
      this.showOffLine = false;
      this.onlineImage = "../../../static/image/buyCar/selectPay_select.png";
      this.offlineImage = "../../../static/image/buyCar/selectPay_unselect.png";
      clearInterval(this.timer);
    },
    select2Click() {
      this.showOnLine = false;
      this.showOffLine = true;
      this.onlineImage = "../../../static/image/buyCar/selectPay_unselect.png";
      this.offlineImage = "../../../static/image/buyCar/selectPay_select.png";
      let vm = this;

      if (this.page == "fillinOrder") {
        if (this.payData == "") {
          //获取支付号
          api.saleOrderGo({
              shoppingcarts: this.$store.state.shoppingIdString,
              customerId: this.$store.state.user.userId,
              addressId: this.$store.state.addressIdOne,
              paymentType: "FULLPAY",
              agentCellphone: "",
              paymentPlatform: "BANKPAY_QR",
              aipAmount: this.$store.state.totalPrice,
              insuranceAmount: 0,
              saleAmount: this.$store.state.totalPrice
            })
            .then(function(res) {
              if (res.data.code === "200") {
                // console.log(res.data.data)
                vm.payNumber = res.data.data.saleOrderCodeVos[0].paymentCode;
                vm.saleOrderId = res.data.data.saleOrderCodeVos[0].saleOrderId;
                return vm.payNumber;
              }
            })
            .then(function(payNumber) {
              //获取第三方支付地址
              api.pay({
                  paymentCode: payNumber,
                  paymod: 2,
                  paymentPlatform: "BANKPAY_QR"
                })
                .then(function(res) {
                  if (res.data.code === "200") {
                    vm.payData = res.data.data.dimension_url;
                    var qrcode = new QRCode(document.getElementById("qrcode"), {
                      width: 150, //设置宽高
                      height: 150
                    });
                    qrcode.makeCode(vm.payData);
                  }
                })
                .catch(function(err) {
                  console.log(err);
                });
            })
            .catch(function(err) {
              console.log(err);
            });
        }
        //选择post机支付的时候
        let time = 0;
        vm.timer = setInterval(function() {
          time += 1;
          if (time > 120) {
            vm.payStatus = false;
            //倒计时跳到订单页面
            if (vm.countDown <= 0) {
              vm.$router.push("/personCenter");
              clearInterval(vm.timer);
            } else {
              vm.countDown--;
            }
          } else {
            axios.get(api.baseURL + "/m/saleOrder/" + vm.saleOrderId)
              .then(function(res) {
                if (res.data.code == 200) {
                  // console.log(res.data.data);
                  let saleCode = res.data.data.saleOrderStatus.code;
                  if (saleCode == 3020) {
                    clearInterval(vm.timer);
                    //跳到支付成功页面
                    vm.$router.push("/completeShopping?code=" + vm.saleOrderId);
                    
                    vm.$emit("closeSelectPayView", false);
                  }
                }
              })
              .catch(function(err) {
                console.log(err);
              });
          }
        }, 1000);
      } else if (this.page == "personCenter") {
        if (this.payData == "") {
          api.pay({
              paymentCode: vm.$store.state.payContent.saleOrderCode,
              paymod: 2,
              paymentPlatform: "BANKPAY_QR"
            })
            .then(function(res) {
              if (res.data.code === "200") {
                vm.payData = res.data.data.dimension_url;
                var qrcode = new QRCode(document.getElementById("qrcode"), {
                  width: 150, //设置宽高
                  height: 150
                });
                qrcode.makeCode(vm.payData);
              }
            })
            .catch(function(err) {
              console.log(err);
            });

          //选择post机支付的时候
          let time = 0;
          vm.timer = setInterval(function() {
            time += 1;
            if (time > 120) {
              vm.payStatus = false;
              //倒计时跳到订单页面
              if (vm.countDown <= 0) {
                vm.$router.push("/personCenter");
                clearInterval(vm.timer);
              } else {
                vm.countDown--;
              }
            } else {
              axios.get(
                  api.baseURL +
                    "/m/saleOrder/" +
                    vm.$store.state.payContent.saleOrderId
                )
                .then(function(res) {
                  if (res.data.code == 200) {
                    // console.log(res.data.data);
                    let saleCode = res.data.data.saleOrderStatus.code;
                    if (saleCode == 3020) {
                      //跳到支付成功页面
                      vm.$router.push("/completeShopping?code="+vm.$store.state.payContent.saleOrderId);

                      vm.$emit("closeSelectPayView", false);
                    }
                  }
                })
                .catch(function(err) {
                  console.log(err);
                });
            }
          }, 1000);
        }
      }
    },
    submit() {
      let vm = this;
      if (this.name == "" && this.idNumber != "") {
        this.needPassInfo = true;
        this.passInfo = "请输入名字";
      } else if (this.name !="" && this.idNumber == "") {
        this.needPassInfo = true;
        this.passInfo = "请输入您的身份证号";
      } else if (this.name == "" && this.idNumber == "") {
        this.needPassInfo = true;
        this.passInfo = "请输入你的姓名和身份证号";
      } else if (this.name != "" && this.idNumber != "") {
        var reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/;
        if (reg.test(this.idNumber) === false) {
          this.needPassInfo = true;
          this.passInfo = "请输入正确的身份证号";
        } else {
          this.needPassInfo = false;
          if (this.page == "fillinOrder") {
            if (this.showOnLine) {
              //获取支付号
              api.saleOrderGo({
                  shoppingcarts: this.$store.state.shoppingIdString,
                  customerId: this.$store.state.user.userId,
                  addressId: this.$store.state.addressIdOne,
                  paymentType: "FULLPAY",
                  agentCellphone: "",
                  paymentPlatform: "BANKPAY_NO",
                  aipAmount: this.$store.state.totalPrice,
                  insuranceAmount: 0,
                  saleAmount: this.$store.state.totalPrice
                })
                .then(function(res) {
                  if (res.data.code === "200") {
                    let payNumber =
                      res.data.data.saleOrderCodeVos[0].paymentCode;

                    return payNumber;
                  }
                })
                .then(function(payNumber) {
                  //获取第三方支付地址
                  api.pay({
                      paymentCode: payNumber,
                      paymod: 6,
                      paymentPlatform: "BANKPAY_NO",
                      idNo: vm.idNumber,
                      acctName: vm.name
                    })
                    .then(function(res) {
                      if (res.data.code === "200") {
                        vm.payNum = res.data.data;
                        vm.version = vm.payNum.version;
                        vm.oid_partner = vm.payNum.oid_partner;
                        vm.user_id = vm.payNum.user_id;
                        vm.busi_partner = vm.payNum.busi_partner;
                        vm.no_order = vm.payNum.no_order;
                        vm.name_goods = vm.payNum.name_goods;
                        vm.money_order = vm.payNum.money_order;
                        vm.notify_url = vm.payNum.notify_url;
                        vm.url_return = vm.payNum.url_return;
                        vm.pay_type = vm.payNum.pay_type;
                        vm.sign_type = vm.payNum.sign_type;
                        vm.sign = vm.payNum.sign;
                        vm.timestamp = vm.payNum.timestamp;
                        vm.dt_order = vm.payNum.dt_order;
                        vm.risk_item = vm.payNum.risk_item;
                        vm.id_type = vm.payNum.id_type;
                        vm.id_no = vm.payNum.id_no;
                        vm.acct_name = vm.payNum.acct_name;
                      }
                    })
                    .then(function(data) {
                      vm.$refs.formPay.submit();
                    })
                    .catch(function(err) {
                      console.log(err);
                    });
                })
                .catch(function(err) {
                  console.log(err);
                });
            }
          } else if (this.page == "personCenter") {
            //获取第三方支付地址
            api.pay({
                paymentCode: vm.$store.state.payContent.saleOrderCode,
                paymod: 6,
                paymentPlatform: "BANKPAY_NO",
                idNo: vm.idNumber,
                acctName: vm.name
              })
              .then(function(res) {
                if (res.data.code === "200") {
                  vm.payNum = res.data.data;
                  vm.version = vm.payNum.version;
                  vm.oid_partner = vm.payNum.oid_partner;
                  vm.user_id = vm.payNum.user_id;
                  vm.busi_partner = vm.payNum.busi_partner;
                  vm.no_order = vm.payNum.no_order;
                  vm.name_goods = vm.payNum.name_goods;
                  vm.money_order = vm.payNum.money_order;
                  vm.notify_url = vm.payNum.notify_url;
                  vm.url_return = vm.payNum.url_return;
                  vm.pay_type = vm.payNum.pay_type;
                  vm.sign_type = vm.payNum.sign_type;
                  vm.sign = vm.payNum.sign;
                  vm.timestamp = vm.payNum.timestamp;
                  vm.dt_order = vm.payNum.dt_order;
                  vm.risk_item = vm.payNum.risk_item;
                  vm.id_type = vm.payNum.id_type;
                  vm.id_no = vm.payNum.id_no;
                  vm.acct_name = vm.payNum.acct_name;
                }
              })
              .then(function(data) {
                vm.$refs.formPay.submit();
              })
              .catch(function(err) {
                console.log(err);
              });
          }
        }
      }
    },
    writing(){
        this.needPassInfo = false;
    }
  }
};
</script>

<style lang="sass">
  @import '../../../static/css/selectPay'
</style>
