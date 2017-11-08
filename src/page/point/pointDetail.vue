<template>
    <div class="pointDetail">
      <header>
        <div>
          <router-link to="/">
            <img src="../../../static/image/logo.png" alt="">
          </router-link>
        </div>
        <div>免费全包软装设计，重新诠释空间大小定义！</div>
      </header>
      <h3>{{pointDetail.specialTitle}}</h3>
      <div>
        <span>标签：
          <i v-for="item in pointDetail.tags">
            {{item.name}}
          </i>
        </span>
        <span>发布时间：{{pointDetail.releaseTime}}</span>
        <span>点击量：{{pointDetail.readCount}}</span>
      </div>
      <div class="main">
        <p>{{pointDetail.description}}</p>
        <div>
          <img :src="src" alt="">
        </div>
      </div>
      <div class="contain main" v-for="item in pointDetail.contents">
        <p>{{item.contentDesc}}</p>
        <div>
          <img :src='item.pic' alt="">
        </div>
      </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import api from'../../api/api'
export default {
  name: 'pointDetail',
  data() {
    return{
      pointDetail:'',
      src:''
    }
  },
  created: function(){
    this.getPointMessage();
  },
  methods: {
    getPointMessage() {
      let vm=this;
      let specialId=this.$route.query.specialId;
      axios.get('/mobile/special/v3.0/'+specialId)
        .then(function(res){
          vm.pointDetail=res.data.data;
          vm.src=api.baseURL+'/image'+res.data.data.pictureUrl;
          res.data.data.contents.forEach(function(value){
            value.pic=api.baseURL+'/image'+value.pictureUrl;
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '../../../static/css/pointDetail';
</style>

