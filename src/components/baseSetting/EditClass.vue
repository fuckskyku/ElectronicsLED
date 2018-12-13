<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">行政管理</el-breadcrumb-item>
              <el-breadcrumb-item to="/classlist">班级管理</el-breadcrumb-item>
              <el-breadcrumb-item>编辑班级</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.go(-1)">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
           <div id="editUserInfo" class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px" style="padding-left:30%;padding-top:20px;"  :rules="rules">
                <el-form-item label="年级:"  prop="gradeId">
                       <template>
                            <el-select v-model="form.gradeId" placeholder="请选择">
                               <el-option  v-for="item in options" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
                            </el-select>
                      </template>
                </el-form-item>
                <el-form-item label="班级名称:" prop="className">
                     <el-input v-model="form.className" size="small"></el-input>
                     <div class="tip" style="margin-top:-10px;"><i class="el-icon-warning"></i><span>例如：三年级2班</span></div>
                </el-form-item>
                <el-form-item label="班级别名:">
                     <el-input v-model="form.classAliasName" size="small"></el-input>
                </el-form-item>
                  <el-form-item label="绑定教室:">
                       <template>
                            <el-select v-model="form.roomId" placeholder="请选择" style="min-width:300px;">
                                    <el-option v-for="item in options2" :key="item.roomId" :label="item.buildingName+'：'+item.roomName+ (item.className!=null?'（'+item.className+'）':'')" :value="item.roomId"></el-option>
                            </el-select>
                      </template>
                </el-form-item>
                 <el-form-item style="text-align:left;margin-top:150px;">
                     <div style="margin-left:-80px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('classlist')">取消</el-button>
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
import { getClassDetail, editClass, getSchoolGradeList, getBuildingList } from "@/api/api";

export default {
  data() {
    return {
      form: {
        classAliasName: "",
        className: "",
        classId: "0",
        gradeId: "",
        roomId:"",
      },
      rules: {
        gradeId: [
          { required: true, message: "请选择年级", trigger: "blur" }
        ],
        className: [
          { required: true, message: "请填写班级名称", trigger: "blur" }
        ]
      },
      options: [],
      options2: [],
      value: ""
    };
  },
  methods: {
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          editClass({
            ClassName: this.form.className,
            ClassAliasName: this.form.classAliasName,
            ClassId: this.form.classId,
            GradeId: this.form.gradeId,
            RoomId: this.form.roomId
          }).then(res => {
             if (res.data.code == 200) {
                  console.log(res)
                  // console.log(res.data.data)
                  this.$message({
                    type: 'success',
                    message: res.data.message
                  })
                  this.skip("classlist")
                } else {
                  this.$message({
                    type: 'fail',
                    message: res.data.message
                  })
                }
              })
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
    this.classId= this.$route.params.id;
    if (this.classId > 0) {
      getClassDetail({ id: this.classId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
      });
    }

    getSchoolGradeList().then(res => {
      this.options = res.data.data;
    });
    getBuildingList({pageSize:10000}).then(res=>{
      this.options2=res.data.data.list;
    });
  },
  components: { Header }
};
</script>