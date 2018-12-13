<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/curriculumlist">课程表管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'curriculumlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px"  :rules="rules" id="form">
          <el-form-item label="课程表名称:"  prop="title">
            <el-input v-model="form.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="班级:"  prop="classId">
            <el-select v-model="form.classId" placeholder="请选择">
                 <el-option v-for="item in options" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程表:">
            <input type="file" class="file" name="file" id="txtfile" @change="uploading($event)"> 
                <div class="tip" v-show="fileshow">已上传<span><a :href="form.xlsPath" target="_blank">下载查看</a></span></div>
               <div class="tip" v-show="!fileshow"><span><a href="/static/uploads/template/课程表模板.xls" target="_blank">下载课程表模板</a></span></div>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" :rows="8" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit"  v-hasButton name="membercurriculumllist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('curriculumlist')">取消</el-button>
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
<style>
  .el-upload{
    width: 160px !important;
    height: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .el-upload-list{
    height: 25px !important;
    line-height: 25px !important;
  }  

  li.el-upload-list__item{
    width: 100% !important;
  }
</style>
<script>
import Header from "@/components/publicTemplate/Header";  
import { getCurriculumDetail, editCurriculum, getQiniuToken, getClassList, getClassTree } from "@/api/api";
import global_ from "@/components/tool/Global";
var qiniu = require("qiniu-js");


export default {
  data() {
    return {
      file: "",
      fileshow: false,
      formData:new FormData(), 
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      fileList: [],
      CourseId: 0,
      form: {
        title: "",
        classId: '',
        remark:"",  
      },
       rules: {
        title: [
          { required: true, message: "请填写课程表名称", trigger: "blur" }
        ],
        classId:[{
          required: true, message: "请选择班级", trigger: "blur"
        }]
      },
      options:[],
      value: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabledClass: true
    };
  },
  methods: {
    handlePreview(file) {
      this.dialogImageUrl = file.url;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },

    handleAvatarSuccess(res, file) {
      console.log(res)
      this.dialogImageUrl = this.imageQiniuUrl + res.key;
      this.fileList.push({ name: res.key, url: this.dialogImageUrl });
    },
    handleRemove(file, fileList) {
        this.formData.delete(file);        
    },
    beforeAvatarUpload: function(file) {
      this.qiniuData.key = new Date().getTime();
      const isXLSX = file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isXls=file.type==="application/vnd.ms-excel";
      if (!isXls && !isXLSX) {
        this.$message.error("文件只能是 .xlsx/.xls 格式!");
        return false;
      }
    },
    submitUpload(content){
         this.formData.append('file', content.file);

    },
     uploading(event) {
      var windowURL = window.URL || window.webkitURL;
      this.file = event.target.files[0];
      console.log("event:" + event);
      //创建文件的url
      this.form.xlsPath = windowURL.createObjectURL(event.target.files[0]);
    },
    onSubmit(form) {      
      this.$refs[form].validate(valid => {
        if (valid) {
          this.formData.append('CourseId', this.CourseId);
          this.formData.append('Title', this.form.title);
          this.formData.append('ClassId', this.form.classId);
          this.formData.append('Remark', this.form.remark);
          this.formData.append("file", this.file);
          editCurriculum(this.formData).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("curriculumlist");
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
    skip(type, param) {
      this.$router.push({
        name: type
      });
    }
  },
  mounted() {
     getClassList({ pageSize: 10000 }).then(res => {
      var list = res.data.data.list;
      this.options = res.data.data.list;
    });

    this.CourseId = this.$route.params.id;
    if (this.CourseId > 0) {
      getCurriculumDetail({ id: this.CourseId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        if (obj.xlsPath != "" && obj.xlsPath != null) {
          this.fileshow = true;
        }
      });
    }

    getQiniuToken().then(res => {
      this.qiniuData.token = res.data.data.token;
    });
  },
  components: { Header }
};
</script>
