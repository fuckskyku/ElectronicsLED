<template>
	<div id="app">
		<main>
          
         <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">学校成员管理</el-breadcrumb-item>
              <el-breadcrumb-item to="/studentlist">学生管理</el-breadcrumb-item>
              <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'studentlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
        </el-aside>
          <div class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px" :rules="rules">
                <el-form-item label="班级:">
                     <el-select v-model="className" placeholder="请选择" @change="check">
                                    <el-option v-for="item in options" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                     </el-select>
                      <div class="tip"><i class="el-icon-warning"></i><span>找不到班级？去<a style="color: #409EFF;" @click="skip('classlist',0)">添加班级</a></span></div>
                </el-form-item>
                <el-form-item label="学生姓名:">
                     <el-input v-model="form.studentName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="学号:">
                     <el-input v-model="form.studentCode" size="small"></el-input>
                 </el-form-item>
                <el-form-item label="卡号:">
                     <el-input v-model="form.cardNo" size="small"></el-input>
                 </el-form-item>
                <el-form-item label="身份证号:">
                     <el-input v-model="form.idCard" size="small"></el-input>
                 </el-form-item>
                 <el-form-item label="性别:">
                      <template>
                            <el-select v-model="form.sex" placeholder="请选择">
                               <el-option  v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                      </template>
                 </el-form-item>
                 <el-form-item label="头像:">
                        <el-upload :action="uploadQiniuUrl"  list-type="picture-card" class="avatar-uploader picture" :data="qiniuData"
                            :file-list="imagelist" :class="{disabled:uploadDisabled}" :before-upload="beforeAvatarUpload"       
                                         :limit="1" :on-preview="handlePictureCardPreview"  :on-remove="handleRemove" :on-success="handleAvatarSuccess">
                        <img src="/static/img/EditNotice_camera.png" alt="">
                        <el-button type="primary" class="add-img">上传头像</el-button>
                     </el-upload>
                     <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                     </el-dialog>
                 </el-form-item>
                 <el-form-item style="text-align:left;margin-top:80px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('studentlist')">取消</el-button>
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
import axios from "axios";
import Header from "@/components/publicTemplate/Header";
import global_ from "@/components/tool/Global";
import {
  getStudentDetail,
  editStudent,
  getQiniuToken,
  getClassList
} from "@/api/api";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      imagelist: [],
      dialogImageUrl: "/static/img/shuiyin.png",
      dialogVisible: false,
      disabledClass: true,
      StudentId: 0,
      className: '',
      form: {
        studentId: "",
        classId: "",
        studentName: "",
        studentCode: "",
        cardNo: "",
        idCard: "",
        sex: ""
      },
      rules: {
        studentName: [
          { required: true, message: "请填写学生姓名", trigger: "blur" }
        ],
        classId: [{ required: true, message: "请选择班级", trigger: "blur" }],
        studentCode: [
          { required: true, message: "请填写学号", trigger: "blur" }
        ]
      },
      options: [],
      options2: [
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        }
      ],
      value: ""
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.dialogImageUrl = this.imageQiniuUrl + res.key;
      this.imagelist.push({ name: res.key, url: this.dialogImageUrl });
    },
    handleRemove(file, fileList) {
      this.imagelist = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible=true;
    },
    beforeAvatarUpload: function(file) {
      var seat = file.name.lastIndexOf(".");
      var extension = file.name.substring(seat).toLowerCase();
      this.qiniuData.key = new Date().getTime() + extension;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isPNG) {
        this.$message.error("图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 5MB!");
        return false;
      }
    },
    check(val) {
      this.form.classId = val
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    },
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          editStudent({
            StudentId: this.StudentId,
            ClassId: this.form.classId,
            StudentName: this.form.studentName,
            IdCard: this.form.idCard,
            StudentCode: this.form.studentCode,
            CardNo: this.form.cardNo,
            Photo: this.dialogImageUrl,
            Sex: this.form.sex,
            Status: 1
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("studentlist");
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
    }
  },
  mounted() {
    this.StudentId = this.$route.params.id;
    this.className = this.$route.query.className;
    if (this.StudentId > 0) {
      getStudentDetail({ id: this.StudentId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        
        if (obj.photo != "" && obj.photo != null) {
          this.dialogImageUrl = obj.photo+"?imageMogr2/strip|imageView2/1/w/158/h/158/q/85";
          this.imagelist.push({ name: "", url: obj.photo });
        } 
      });
    } 
    
    getClassList({ pageSize: 10000 }).then(res => {
      this.options = res.data.data.list;
    });

    getQiniuToken().then(res => {
      this.qiniuData.token = res.data.data.token;
    });
    
  },
  computed: {
    uploadDisabled: function() {
      return this.imagelist.length > 0;
    }
  },
  components: { Header }
};
</script>