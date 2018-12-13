<template>
	<div id="app">
		<main>
          
           <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">学校资源管理</el-breadcrumb-item>
              <el-breadcrumb-item to="/classroomlist">教室管理</el-breadcrumb-item>
              <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'classroomlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div id="editUserInfo" class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px" style="padding-left:30%;padding-top:7%;"  :rules="rules">
                <el-form-item label="教学楼名称:"  prop="buildingName">
                     <el-input v-model="form.buildingName" size="small"></el-input>
                     <div class="tip" style="margin-top:-10px;"><span>例如：逸夫楼</span></div>
                </el-form-item>
                <el-form-item label="教室名称:"  prop="roomName">
                     <el-input v-model="form.roomName" size="small"></el-input>
                     <div class="tip" style="margin-top:-10px;"><span>例如：3-303</span></div>
                </el-form-item>
                 <el-form-item style="text-align:left;margin-top:400px;">
                     <div style="margin-left:-280px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('classroomlist')">返回列表</el-button>
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
import { getBuildingDetail, editBuilding } from "@/api/api";

export default {
  data() {
    return {
      form: {
        buildingName: "",
        roomName: "",
        roomId: ""
      },
      rules: {
        buildingName: [
          { required: true, message: "请选择教学楼名称", trigger: "blur" }
        ],
        roomName: [
          { required: true, message: "请填写教室名称", trigger: "blur" }
        ]
      },
    };
  },
  methods: {
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          editBuilding({
            buildingName: this.form.buildingName,
            roomName: this.form.roomName,
            roomId: this.form.roomId
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("classroomlist");
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
    this.form.roomId = this.$route.params.id;
    if (this.form.roomId > 0) {
      getBuildingDetail({ id: this.form.roomId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
      });
    }
  },
  components: { Header }
};
</script>