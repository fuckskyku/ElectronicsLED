<template>
  <div id="app">
    <main>
      <el-aside class="nav">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">班级资讯</el-breadcrumb-item>
          <el-breadcrumb-item to="/classglorylist">班级荣誉</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px">
          <el-form-item label="荣誉标题:">
            <el-input v-model="form.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="年级班级:">
            <el-tree
              v-model="form.targetClassIds"
              :data="tree"
              show-checkbox
              :default-expanded-keys="[0]"
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="荣誉封面图片:" style="height:220px">
            <el-upload  :action="uploadQiniuUrl"  list-type="picture-card" class="avatar-uploader picture" :data="qiniuData"
                        :file-list="imagelist" :class="{disabled:uploadDisabled}" :before-upload="beforeAvatarUpload"       
                        :limit="1" :on-preview="handlePictureCardPreview"  :on-remove="handleRemove" :on-success="handleAvatarSuccess"
                        >
              <img src="/static/img/EditNotice_camera.png" alt="">
              <el-button type="primary" class="add-img">添加图片</el-button>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="内容:">
            <template>
              <quill-editor  v-model="form.content"  ref="myQuillEditor" 
              :options="editorOption"  
              @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                              @change="onEditorChange($event)">
              </quill-editor>
            </template> 
          </el-form-item>
          <el-form-item label="发布人:">
            <el-input v-model="form.author" size="small"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="memberclassglorylist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('classglorylist')">取消</el-button>
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
import {
  getClassgloryDetail,
  editClassglory,
  getClassTree,
  getQiniuToken
} from "@/api/api.js";
import { quillEditor } from "vue-quill-editor";
import { quillRedefine } from "vue-quill-editor-upload";
import global_ from "@/components/tool/Global";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      newsId: "",
      form: {
        newsId: "",
        content: "",
        title: "",
        pic: "",
        author: "",
        targetClassIds: ""
      },
      tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      value: "",
      dialogVisible: false,
      disabledClass: true,
      qiniuToken: "",
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      tempUrl: [],
      imgUrls: "",
      imagelist: [],
      dialogImageUrl: "",
      classInfo: [],
      imgData: {
        accept: "image/gif, image/jpeg, image/png, image/jpg"
      },
      
    };
  },
  created() {
    this.getParams();
    var that = this;
    //获取年级树
    getClassTree({}).then(res => {
      if (res.data.code == 200) {
        that.tree = [res.data.data];
        console.log(that.tree);
      }
    });
    //获取通知信息
    console.log("this", this.newsId);
    if (this.newsId > 0) {
      getClassgloryDetail({ id: this.newsId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        console.log("pageShowTime:", obj);
        //匹配选中班级
        var arr = [];
        if (obj.targetClassIds != "") {
          obj.targetClassIds.split(",").map((item, index) => {
            arr.push(eval(item));
          });
          this.$refs.tree.setCheckedKeys(arr);
        }

        //图片显示
        if(obj.pic!=null && obj.pic!='')
            this.imagelist.push({ name: "", url: obj.pic });
      });
    }
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data.data.token;
      this.qiniuToken = res.data.data.token;
    });
    this.editorOption = quillRedefine({
      // 图片上传的设置
      uploadConfig: {
        action: this.uploadQiniuUrl, // 必填参数 图片上传地址
        res: respnse => {
          return that.imageQiniuUrl + respnse.key;
        },
        header: (xhr, formData) => {
          formData.append("token", that.qiniuData.token);
          formData.append("key", new Date().getTime());
        },
        name: "file", // 图片上传参数名,
        accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon" // 可选参数 可上传的图片格式
      },
      // 以下所有设置都和vue-quill-editor本身所对应
      placeholder: '请输入内容', // 可选参数 富文本框内的提示语
      theme: 'snow', // 可选参数 富文本编辑器的风格
      toolOptions: [
        ["bold", "italic", "underline", "strike", "image"],
        [{ color: [] }, { background: [] }],
        ['clean']
      ], // 可选参数  选择工具栏的需要哪些功能  默认是全部
      handlers: {} // 可选参数 重定义的事件，比如link等事件
    });
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.dialogImageUrl = this.imageQiniuUrl + res.key;
      this.imagelist.push({ name: res.key, url: this.dialogImageUrl });
    },
    handleRemove(file, fileList) {
      this.imagelist = fileList;
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
    select(val) {
      console.log(val);
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
      //新增/编辑通知
      var that = this;

      this.$refs[form].validate(valid => {
        if (valid) {
          //获取班级树ID
          var keys = this.$refs.tree.getCheckedKeys();
          var newTargetClassIds = "";
          keys.map((item, index) => {
            if (item.indexOf("g") == -1  && item!=0 ) {
              newTargetClassIds += item + ",";
            }
          });
          if (newTargetClassIds != "") {
            newTargetClassIds = newTargetClassIds.substring(
              0,
              newTargetClassIds.length - 1
            );
          }
          editClassglory({
            NewsId: that.newsId,
            NewsAuthor: that.form.author,
            NewsTitle: that.form.title,
            NewsContent: that.form.content,
            NewsPic: that.dialogImageUrl,
            TargetClassIds: newTargetClassIds //投放班级ID，多个请用英文逗号隔开
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("classglorylist");
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
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.params.id;
      // 将数据放在当前组件的数据内
      this.newsId = routerParams;
    }
  },
  computed: {
    uploadDisabled: function() {
      return this.imagelist.length > 0;
    }
  },
  components: { Header }
};
</script>
