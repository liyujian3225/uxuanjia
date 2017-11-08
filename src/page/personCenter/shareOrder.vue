<!--晒单-->
<template>
  <div class="shareOrder">
    <com-person></com-person>
    <div class="main">
      <div class="header">
        <span class="price">¥ 1234</span>
        <span class="detail">单号：123456789111</span>
        <span class="detail">收货信息：xxx / 150xxxx1371 / 广州天河珠江新城xxx</span>
      </div>
      <div class="left">
        <img class="picture" src="../../../static/image/login_bgImage.png" alt="">
        <span class="title">意大利风情桌子</span>
        <span class="detail">颜色：红木色 规格：一米二</span>
        <span class="price">¥ 1234</span>
      </div>
      <div class="right">
        <el-input class="evaluate" type="textarea" :rows="10" placeholder="  输入评价内容" v-model="text"></el-input>
        <span class="text1">上传图片</span>
        <span class="text2">(最多上传5张图片)</span>
        <div class="upload">
          <el-upload
            class="uploadImage"
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <el-button class="submit" @click="submit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import personCenterNav from '../../components/personCenterNav'
  export default {
    name: 'shareOrder',
    components: {
      comPerson: personCenterNav
    },
    data() {
      return {
        text: '',
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    created: function(){
      window.scrollTo(0,0);
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      submit() {
        this.$message({
          message: '评价成功，+U币 100',
          type: 'success'
        });
      }
    }
  }
</script>

<style lang="sass">
  @import '../../../static/css/shareOrder'
</style>

