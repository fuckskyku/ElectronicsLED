<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">行政管理</el-breadcrumb-item>
              <el-breadcrumb-item to="/subjectlist">科目管理</el-breadcrumb-item>
              <el-breadcrumb-item>编辑科目</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'subjectlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div id="editUserInfo" class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px"  :rules="rules"    style="padding-left:300px;padding-top:7%;">
                <el-form-item label="科目名称:" prop="subjectName">
                       <el-input v-model="form.subjectName" size="small"></el-input>
                </el-form-item>
                 <el-form-item style="text-align:left;margin-top:400px;">
                     <div style="margin-left:-80px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('subjectlist')">返回列表</el-button>
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
import { getSubjectDetail, editSubject } from "@/api/api";

export default {
  data() {
    return {
      form: {
        subjectName: "",
        subjectId: "0"
      },
      rules: {
        subjectName: [
          { required: true, message: "请输入科目", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          editSubject({
            subjectName: this.form.subjectName,
            subjectId: this.form.subjectId
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("subjectlist");
            } else {
              this.$message({
                type: "fail",
                message: res.data.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    }
  },
  mounted() {
    this.subjectId = this.$route.params.id;
    console.log(this.subjectId);
    if (this.subjectId > 0) {
      getSubjectDetail({ id: this.subjectId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
      });
    }
  },
  components: { Header }
};
</script>