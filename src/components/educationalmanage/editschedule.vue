<template>
  <div id="app">
    <main>
      
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/schedulelist">作息表管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'schedulelist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="作息表名称:"  prop="title">
            <el-input v-model="form.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="适用年级:">
            <el-tree  v-model="form.TargetClassIds" :default-expanded-keys="[0]"
                        :data="classInfo"  show-checkbox  node-key="id" ref="tree" highlight-current :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="状态:">
             <el-switch  v-model="form.status"></el-switch>
          </el-form-item>
          <el-form-item label="作息表:">
              <input type="file" class="file" name="file" id="txtfile" @change="uploading($event)"> 
                <div class="tip" v-show="fileshow">已上传<span><a :href="form.xlsPath" target="_blank">下载查看</a></span></div>
               <div class="tip" v-show="!fileshow"><span><a href="/static/uploads/template/作息表模板.xls" target="_blank">下载模板</a></span></div>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit"  v-hasButton name="memberschedulelist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('schedulelist')">取消</el-button>
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
.el-upload {
  width: 160px !important;
  height: 0 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
}
li.el-upload-list__item {
  width: 100% !important;
}
</style>
<script>
import Header from "@/components/publicTemplate/Header";
import {
  getScheduleDetail,
  editSchedule,
  getQiniuToken,
  getClassTree
} from "@/api/api";
import global_ from "@/components/tool/Global";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      formData: new FormData(),
      file: "",
      fileshow: false,
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      ScheduleId: 0,
      form: {
        title: "",
        targetClassIds: "",
        status: true
      },
      classInfo: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      rules: {
        title: [
          { required: true, message: "请填写作息表名称", trigger: "blur" }
        ]
      },
      value: "",
      fileList: [],
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
      this.dialogImageUrl = this.imageQiniuUrl + res.key;
      this.fileList.push({ name: res.key, url: this.dialogImageUrl });
    },
    handleRemove(file, fileList) {
      //this.formData.delete(file);
      this.fileList = [];
      this.dialogImageUrl = "";
    },
    beforeAvatarUpload: function(file) {
      this.qiniuData.key = new Date().getTime();
    },
    uploading(event) {
      var windowURL = window.URL || window.webkitURL;
      this.file = event.target.files[0];
      console.log("event:" + event);
      //创建文件的url
      this.form.xlsPath = windowURL.createObjectURL(event.target.files[0]);
    },
    onSubmit(form) {
      let that=this;
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          //获取班级树ID
          var keys = this.$refs.tree.getCheckedKeys();
          var newTargetClassIds = "";
          keys.map((item, index) => {
            if (item.indexOf("g") == -1 && item!=0 ) {
              newTargetClassIds += item + ",";
            }
          });
          if (newTargetClassIds != "")
            newTargetClassIds = newTargetClassIds.substring(
              0,
              newTargetClassIds.length - 1
            );

          that.formData.append("ScheduleId", that.ScheduleId);
          that.formData.append("Title", that.form.title);
          that.formData.append("TargetClassIds", newTargetClassIds);
          that.formData.append("file", that.file);
          editSchedule(that.formData).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("schedulelist");
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
  computed: {
    uploadDisabled: function() {
      return this.fileList.length > 0;
    }
  },
  mounted() {
    getClassTree().then(res => {
      let that = this;
      if (res.data.code == 200) {
        that.classInfo = [res.data.data];
      }
    });

    this.ScheduleId = this.$route.params.id;
    if (this.ScheduleId > 0) {
      getScheduleDetail({ id: this.ScheduleId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        this.form.status = obj.status == 1;
        this.form.xlsPath = obj.xlsPath;
        if (obj.xlsPath != "" && obj.xlsPath != null) {
          this.fileshow = true;
        }
        var arr = [];
        if (obj.targetClassIds != "") {
          obj.targetClassIds.split(",").map((item, index) => {
            arr.push(eval(item));
          });
          this.$refs.tree.setCheckedKeys(arr);
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
