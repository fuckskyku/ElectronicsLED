<template>
  <div id="app">
    <main>      
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/schedulelist">自定义显示管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
       <div class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px" :rules="rules">
                <el-form-item label="标题:" prop="title">
                     <el-input v-model="form.title" size="small"></el-input>
                </el-form-item>
                <el-form-item label="年级班级:">
                     <el-select v-model="form.classId" placeholder="请选择" @change="check">
                                    <el-option v-for="item in options" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                     </el-select>
                      <div class="tip"><i class="el-icon-warning"></i><span>找不到班级？去<a style="color: #409EFF;" @click="skip('classlist',0)">添加班级</a></span></div>
                </el-form-item>
                 <el-form-item label="显示时间:">
                                 <el-date-picker  v-model="form.beginTime"  type="datetime"   placeholder="选择日期时间"></el-date-picker> ——
                <el-date-picker  v-model="form.endTime"  type="datetime"   placeholder="选择日期时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="文件类型:">
                     <template>
                          <el-radio-group v-model="form.fileType">
                             <el-radio :label="1">照片</el-radio>
                             <el-radio :label="2">PPT</el-radio>
                             <el-radio :label="3">视频</el-radio>
                          </el-radio-group>
                     </template>
                 </el-form-item>
                 <el-form-item label="文件:" class="file-upload">
                        <el-upload :action="uploadQiniuUrl"  class="avatar-uploader" :data="qiniuData" 
                            :file-list="imagelist" :before-upload="beforeAvatarUpload"  :class="{disabled:uploadDisabled}"      
                                         :limit="1" :on-preview="handlePictureCardPreview"  :on-remove="handleRemove" :on-success="handleAvatarSuccess">
                        <el-button type="primary" class="add-img file">点击上传</el-button>                        
                     </el-upload>
                      <el-dialog :visible.sync="dialogVisible">         
                         <!-- <div class="tip" v-show="dialogVisible">已上传<span><a :href="dialogImageUrl" target="_blank">下载查看</a></span></div>                -->
                            <img width="100%" v-show="this.form.fileType==1" :src="dialogImageUrl" alt="">
                            <span width="100%"  v-show="this.form.fileType==2">{{dialogImageUrl}}</span>
                            <video :src="dialogImageUrl"  v-show="this.form.fileType==3">视频</video>
                        <a :href="dialogImageUrl" target="_blank">下载查看</a>
                     </el-dialog>
                 </el-form-item>
                 <el-form-item style="text-align:left;margin-top:80px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('schoolcustomlist')">取消</el-button>
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
.file {
  margin-top: 0px;
  bottom: -29px;
}
</style>

<script>
import axios from "axios";
import { formatDate } from "../../common/time/date.js";
import Header from "@/components/publicTemplate/Header";
import global_ from "@/components/tool/Global";
import {
  getSchoolCustomDetail,
  editSchoolCustom,
  getClassList,
  getQiniuToken
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
      dialogImageUrl: "",
      dialogVisible: false,
      disabledClass: true,
      CustomId: 0,
      className: "",
      form: {
        title: "",
        classId: "",
        beginTime: "",
        endTime: "",
        fileType: 1,
        fileUrl: ""
      },
      rules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }]
      },
      options: [],
      value: ""
    };
  },
  methods: {
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.dialogImageUrl = this.imageQiniuUrl + res.key;
      this.imagelist.push({ name: res.key, url: this.dialogImageUrl });
    },
    handleRemove(file, fileList) {
      this.imagelist = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    beforeAvatarUpload: function(file) {
      this.qiniuData.key = new Date().getTime() + file.name;
      if (this.form.fileType == 1) {
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
      }else if(this.form.fileType==2){
        console.log(file.type)
        const isPptx=file.type==="application/vnd.openxmlformats-officedocument.presentationml.presentation";
        const isPpt=file.type==="application/vnd.ms-powerpoint";
        if(!isPptx && !isPpt)
        {
            this.$message.error("格式只能是ppt/pptx格式!");
          return false;
        }
      }else if(this.form.fileType==3){
        //const isMp4=file.type==="video/mp4";
      }
    },
    check(val) {
      this.form.classId = val;
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
          editSchoolCustom({
            Id: this.CustomId,
            Title: this.form.title,
            ClassId: this.form.classId,
            BeginTime: Math.floor(
              new Date(this.form.beginTime).getTime() / 1000
            ),
            EndTime: Math.floor(new Date(this.form.endTime).getTime() / 1000),
            FileType: this.form.fileType,
            FileUrl: this.dialogImageUrl
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("schoolcustomlist");
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
    var that = this;
    this.CustomId = this.$route.params.id;
    if (this.CustomId > 0) {
      getSchoolCustomDetail({ id: this.CustomId }).then(res => {
        var obj = res.data.data;
        this.form = obj;

        this.form.beginTime = that.formatDate(obj.beginTime);
        this.form.endTime = that.formatDate(obj.endTime);

        if (obj.fileUrl != "" && obj.fileUrl != null) {
          this.dialogImageUrl = obj.fileUrl;
          this.imagelist.push({ name: obj.fileUrl, url: obj.fileUrl });
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
      return false;
    }
  },
  components: { Header }
};
</script>