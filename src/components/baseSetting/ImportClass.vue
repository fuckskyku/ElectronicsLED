<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:400px;"><span class="frontClass">首页</span>  >  <span class="frontClass">基础设置</span>  >  <span class="frontClass">学校信息管理</span>  > <span class="frontClass">班级管理</span>  > <span class="lastClass">批量导入</span></el-aside>
          <div id="editUserInfo" class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px" style="padding-left:400px;padding-top:7%;">
                <el-form-item label="导入文件:">
                     <el-input  size="small" prefix-icon="el-icon-upload2" placeholder="点击选择文件"></el-input>
                     <div>
                         <a href="#">下载班级模板</a>
                     </div>
                </el-form-item>
                 <el-form-item style="text-align:left;margin-top:400px;">
                     <div style="margin-left:-280px;">
                       <el-button type="primary" @click="onSubmit" class="submit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('classlist')">返回列表</el-button>
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

export default {
  data() {
    return {      
      value: ""
    };
  },
  methods: {
    onSubmit() {
      alert(this);
    },
    skip(type) {
      this.$router.push({
        name: type
      })
     }
  },
  components: { Header }
};
</script>