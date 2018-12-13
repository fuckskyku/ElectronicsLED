<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">学校资讯</el-breadcrumb-item>
          <el-breadcrumb-item to="/newslist">资讯类别管理</el-breadcrumb-item>
          <el-breadcrumb-item>资讯类别编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div id="editUserInfo" class="editInfo">     
        <el-form ref="form" :model="form" label-width="280px"  style="padding-left:400px;">
          <el-form-item label="类型名称:">
            <el-input v-model="form.newsTypeName" size="small"></el-input>
          </el-form-item>
           <el-form-item label="状态:">
          <el-switch  v-model="close" active-color="#FFDE2A"></el-switch>
          </el-form-item>
         <el-form-item style="text-align:left;margin-top:300px;">
             <div style="margin-left:-280px;">
              <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="membernewslist:edit">保存</el-button>
              <el-button class="cancel" type="info" @click="skip('newslist')">取消</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
</style>
<script>
import Header from "@/components/publicTemplate/Header";
import {  getNewsTypeDetail, getNewsTypeList, editNewsType } from "@/api/api.js";
export default {
  data() {
    return {
      newsTypeId: '-1',
      form: {
        newsTypeName: "",
        status: "",
        newsType: ''
      },      
      value: "",
      close: false,
     
    };
  },
  mounted() {
    this.getParams()
    var that = this;
    if(this.newsTypeId != -1){
      getNewsTypeDetail({ id: this.newsTypeId }).then(res =>{        
        if (res.data.code == 200) {
          if(res.data.data != null){
            that.form = res.data.data
            if(that.form.status == 0){
              that.close = false
            }else{
              that.close = true
            }
          }
            
        }       
      })
    }
  },
  methods: {
    onSubmit(form) {
      //新增/编辑通知
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          if(this.newsTypeId == -1){
            editNewsType({ 
              NewsTypeName: that.form.newsTypeName,
              Status: that.close
            }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.skip("newslist");
              }else{
                this.$message({
                  type: "fail",
                  message: res.data.message
                });
              }
            });
          }else{
            editNewsType({ 
              NewsType: this.newsTypeId,
              NewsTypeName: that.form.newsTypeName,
              Status: that.close
            }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.skip("newslist");
              }else{
                this.$message({
                  type: "fail",
                  message: res.data.message
                });
              }
            });
          } 
        }else {
          console.log("error submit!!");
          return false;
        } 
      })    
    },
    skip(type, param) {
      this.$router.push({
        name: type
      });
    },
    change(close) {
      console.log(close)
      if(close == true){
        this.form.status = true
      }else{
        this.form.status = false
      }
    },
    getParams () {
      // 取到路由带过来的参数 
      var routerParams = this.$route.params.id
      // 将数据放在当前组件的数据内
      this.newsTypeId = routerParams
    }
  },
  components: { Header }
};
</script>
