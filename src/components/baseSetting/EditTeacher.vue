<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:400px;">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">学校成员管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/teacherlist">老师管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'teacherlist'})">
          <img src="/static/img/返回.png" alt>返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="老师姓名:" prop="teacherName">
            <el-input v-model="form.teacherName" placeholder="请输入教师姓名" size="small"></el-input>
          </el-form-item>
          <el-form-item label="卡号:">
            <el-input v-model="form.cardNo" placeholder="请输入卡号" type="number" size="small"></el-input>
          </el-form-item>
          <el-form-item label="身份证号:">
            <el-input v-model="form.idCard" placeholder="请输入身份证号" size="small"></el-input>
          </el-form-item>
          <el-form-item label="生日:">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.birthday"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="性别:">
            <template>
              <el-select v-model=" form.sex" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="头像:">
            <el-upload
              :action="uploadQiniuUrl"
              list-type="picture-card"
              class="avatar-uploader picture"
              :data="qiniuData"
              :file-list="imagelist"
              :class="{disabled:uploadDisabled}"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
            >
              <img src="/static/img/EditNotice_camera.png" alt>
              <el-button type="primary" class="add-img">上传头像</el-button>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="简介">
            <el-input type="textarea" :rows="8" v-model="form.notes"></el-input>
            <!-- <template>
                           <quill-editor  v-model="form.notes"  ref="myQuillEditor" :options="editorOption"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                      @change="onEditorChange($event)">
                           </quill-editor>
            </template>-->
          </el-form-item>
          <el-form-item style="text-align:left;margin-top:80px;">
            <el-button
              type="primary"
              @click="onSubmit('form')"
              class="submit"
              v-hasButton
              name="memberteacherlist:edit"
            >保存</el-button>
            <el-button class="cancel" type="info" @click="skip('teacherlist')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
<script>
import axios from "axios";
import Header from "@/components/publicTemplate/Header";
import global_ from "@/components/tool/Global";
import { quillEditor } from "vue-quill-editor";
import { getTeacherDetail, editTeacher, getQiniuToken } from "@/api/api";
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
      options: [
        {
          value: 1,
          label: "男"
        },
        {
          value: 2,
          label: "女"
        }
      ],
      form: {
        teacherName: "",
        cardNo: "",
        idCard: "",
        birthday: "",
        teacherId: "",
        sex: "",
        photo: "",
        notes: ""
      },
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        placeholder: "您想说点什么？",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"], // toggled buttons
            [{ font: [] }],
            ["clean"],
            [{ align: [] }],
            [{ color: [] }],
            ["blockquote", "code-block"]
          ]
        }
        /* quill options */
      },
      rules: {
        teacherName: [
          { required: true, message: "请填写老师姓名", trigger: "blur" }
        ]
      },
      value: ""
    };
  },
  methods: {
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },
    handleAvatarSuccess(res, file) {
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
    skip(type) {
      this.$router.push({
        name: type
      });
    },
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          editTeacher({
            TeacherId: this.form.teacherId,
            TeacherName: this.form.teacherName,
            IdCard: this.form.idCard,
            CardNo: this.form.cardNo,
            Photo: this.dialogImageUrl,
            Birthday: new Date(this.form.birthday).getTime() / 1000,
            Sex: this.form.sex,
            Status: 1,
            Notes: this.form.notes
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("teacherlist");
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
    this.TeacherId = this.$route.params.teacherId;
    if (this.TeacherId > 0) {
      getTeacherDetail({ id: this.TeacherId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        if (obj.photo != "" && obj.photo != null) {
          this.dialogImageUrl = obj.photo+"?imageMogr2/strip|imageView2/1/w/158/h/158/q/85";
          this.imagelist.push({ name: "", url: obj.photo });
        }
      });
    }

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