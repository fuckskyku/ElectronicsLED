<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
          <el-breadcrumb-item to="/schoolinfo">学校信息管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑学校信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'schoolinfo'})">
          <img src="/static/img/返回.png" alt>返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="学校名称:" prop="schoolName">
            <el-input v-model="form.schoolName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="学校地址:">
            <el-input v-model="form.address" size="small"></el-input>
          </el-form-item>
          <el-form-item label="学校电话:">
            <el-input v-model="form.tel" size="small"></el-input>
          </el-form-item>
          <el-form-item label="开学日期:">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.beginDate"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="期末日期:">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.endDate"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="学校Logo:">
            <el-upload
              :action="uploadQiniuUrl"
              list-type="picture-card"
              class="avatar-uploader picture"
              :data="logoData"
              :file-list="logolist"
              :class="{disabled:uploadDisabled}"
              :before-upload="beforeLogoUpload"
              :limit="1"
              :on-preview="handleLogoPreview"
              :on-remove="handleLogoRemove"
              :on-success="handleLogoSuccess"
            >
              <!-- <i class="el-icon-plus"></i> -->
              <img src="/static/img/EditNotice_camera.png" alt>
              <el-button type="primary" class="add-img">上传图片</el-button>
            </el-upload>
            <el-dialog :visible.sync="logoDialogVisible">
              <img width="100%" :src="logoImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="校训图片:">
            <el-upload
              :action="uploadQiniuUrl"
              list-type="picture-card"
              class="avatar-uploader picture"
              :data="mottoData"
              :file-list="mottolist"
              :class="{disabled:uploadDisabled1}"
              :before-upload="beforeMottoUpload"
              :limit="1"
              :on-preview="handleMottoPreview"
              :on-remove="handleMottoRemove"
              :on-success="handleMottoSuccess"
            >
              <img src="/static/img/EditNotice_camera.png" alt>
              <el-button type="primary" class="add-img">上传图片</el-button>
            </el-upload>
            <el-dialog :visible.sync="mottoDialogVisible">
              <img width="100%" :src="mottoImageUrl" alt>
            </el-dialog>
          </el-form-item>
          <el-form-item label="学校介绍">
            <template>
              <quill-editor
                style="font-size: 12px;"
                v-model="form.info"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @change="onEditorChange($event)"
              ></quill-editor>
            </template>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button
              type="primary"
              @click="onSubmit('form')"
              class="submit"
              v-hasButton
              name="memberschoolinfo:edit"
            >保存</el-button>
            <el-button class="cancel" type="info" @click="skip('schoolinfo')">取消</el-button>
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
import { formatDate } from "../../common/time/date.js";
import Header from "@/components/publicTemplate/Header";
import global_ from "@/components/tool/Global";
import { quillEditor } from "vue-quill-editor";
import { quillRedefine } from "vue-quill-editor-upload";
import { getSchoolInfo, editSchoolInfo, getQiniuToken } from "@/api/api";
import { parseDate } from "@/util/date.js";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      qiniuToken: "",
      form: {
        schoolName: "",
        address: "",
        tel: "",
        beginDate: "",
        endDate: "",
        info: ""
      },
      //富文本区域配置和内容
      editorOption: {
        /* quill options */
      },
      rules: {
        schoolName: [
          { required: true, message: "请填写学校名称", trigger: "blur" }
        ]
      },
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      logoData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      logolist: [],
      logoImageUrl: "",
      logoDialogVisible: false,

      mottoData: {
        token: "",
        key: ""
      },
      mottolist: [],
      mottoImageUrl: "",
      mottoDialogVisible: false
    };
  },
  created() {
    getSchoolInfo().then(res => {
      var obj = res.data.data;
      this.form = obj;
      this.form.beginDate = this.formatDate(obj.beginDate);
      this.form.endDate = this.formatDate(obj.endDate);
      if (obj.logo != null && obj.logo != "") {
        this.logoImageUrl = obj.logo;
        this.logolist.push({ name: "", url: obj.logo });
      }
      if (obj.motto != null && obj.motto != "") {
        this.mottoImageUrl = obj.motto;
        this.mottolist.push({ name: "", url: obj.motto });
      }
    });

    getQiniuToken().then(res => {
      this.logoData.token = res.data.data.token;
      this.mottoData.token = res.data.data.token;
      this.qiniuToken = res.data.data.token;
    });

    var that = this;
    this.editorOption = quillRedefine({
      // 图片上传的设置
      uploadConfig: {
        action: this.uploadQiniuUrl, // 必填参数 图片上传地址
        res: respnse => {
          return that.imageQiniuUrl + respnse.key;
        },
        header: (xhr, formData) => {
          formData.append("token", that.logoData.token);
          formData.append("key", new Date().getTime());
        },
        name: "file", // 图片上传参数名,
        accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon" // 可选参数 可上传的图片格式
      },
      // 以下所有设置都和vue-quill-editor本身所对应
      placeholder: "请输入内容", // 可选参数 富文本框内的提示语
      theme: "snow", // 可选参数 富文本编辑器的风格
      toolOptions: [
        ["bold", "italic", "underline", "strike", "image", "video"],
        [{ color: [] }, { background: [] }],
        ["clean"]
      ], // 可选参数  选择工具栏的需要哪些功能  默认是全部
      handlers: {} // 可选参数 重定义的事件，比如link等事件
    });
  },
  methods: {
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          editSchoolInfo({
            logo: this.logoImageUrl,
            motto: this.mottoImageUrl,
            schoolName: this.form.schoolName,
            address: this.form.address,
            tel: this.form.tel,
            info: this.form.info,
            beginDate: new Date(this.form.beginDate).getTime() / 1000,
            endDate: new Date(this.form.endDate).valueOf() / 1000
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("schoolinfo");
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
    handleLogoSuccess(res, file) {
      this.logoImageUrl = this.imageQiniuUrl + res.key;
      this.logolist.push({ name: res.key, url: this.logoImageUrl });
    },
    handleLogoRemove(file, fileList) {
      this.logolist = [];
      this.logoImageUrl = "";
    },
    handleLogoPreview(file) {
      this.logoImageUrl = file.url;
      this.logoDialogVisible = true;
    },
    beforeLogoUpload: function(file) {
      var seat = file.name.lastIndexOf(".");
      var extension = file.name.substring(seat).toLowerCase();
      this.logoData.key = new Date().getTime() + extension;
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

    handleMottoSuccess(res, file) {
      this.mottoImageUrl = this.imageQiniuUrl + res.key;
      this.mottolist.push({ name: res.key, url: this.mottoImageUrl });
    },
    handleMottoRemove(file, fileList) {
      this.mottolist = [];
      this.mottoImageUrl = "";
    },
    handleMottoPreview(file) {
      this.mottoImageUrl = file.url;
      this.mottoDialogVisible = true;
    },
    beforeMottoUpload: function(file) {
      if (this.logoData.token == null) {
        getQiniuToken().then(res => {
          this.logoData.token = res.data.data.token;
          this.mottoData.token = res.data.data.token;
        });
      }
      var seat = file.name.lastIndexOf(".");
      var extension = file.name.substring(seat).toLowerCase();
      this.mottoData.key = new Date().getTime() + extension;
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
    }
  },
  mounted() {},
  updated() {},
  computed: {
    uploadDisabled: function() {
      return this.logolist.length > 0;
    },
    uploadDisabled1: function() {
      return this.mottolist.length > 0;
    }
  },
  components: { Header }
};
</script>