<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
              <el-breadcrumb-item to="/releaseindex">学校资讯</el-breadcrumb-item>
              <el-breadcrumb-item to="/noticelist">通知管理</el-breadcrumb-item>
              <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="goback" @click="$router.go(-1)">
              <img src="/static/img/返回.png" alt="">返回
            </div>
          </el-aside>
          
          <div class="editInfo">
           <el-form ref="form" :model="form" label-width="280px" :rules="rules">
                <el-form-item label="通知标题:"  prop="noticeTitle">
                  <el-input v-model="form.noticeTitle" size="small"></el-input>
                </el-form-item>
                <el-form-item label="通知类别:"  prop="noticeType">
                  <template>
                    <el-select v-model="form.noticeType" @change="select(form.noticeType)" placeholder="请选择通知类别">
                      <el-option v-for="item in options" :key="item.noticeType" :label="item.newsTypeName" :value="item.noticeType"></el-option>
                    </el-select>
                  </template>
                </el-form-item>
                <el-form-item label="通知班级:">
                  <el-tree 
                    v-model="form.TargetClassIds"
                    :data="classInfo"
                    show-checkbox
                    :default-expanded-keys="[0]"
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps">
                  </el-tree>
                </el-form-item>
                <el-form-item label="通知图片:">
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
                 <el-form-item label="通知内容" style="height:350px;">
                   <template>
                      <quill-editor class="editor"  v-model="form.noticeContent"  ref="myQuillEditor" :options="editorOption"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                      @change="onEditorChange($event)" id="editor">
                      </quill-editor>
                    </template> 
                 </el-form-item>
                 <el-form-item style="text-align:center;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('noticelist')">取消</el-button>
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
  getNoticeList,
  editNotice,
  getNoticeDetail,
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
      noticeId: "",
      noticeTypeId:"",
      qiniuToken: "",
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
      classInfo: [],
      imgData: {
        accept: "image/gif, image/jpeg, image/png, image/jpg"
      },

      form: {
        noticeId: "",
        // author: '',
        noticeTitle: "",
        noticePic: "",
        noticeContent: "",
        TargetClassIds: "",
        noticeType: ""
      },
      rules: {
        noticeTitle: [
          { required: true, message: "请填写通知标题", trigger: "blur" }
        ],
        noticeType: [
          { required: true, message: "请选择通知类别", trigger: "blur" }
        ]
      },
      tempTree: {},
      tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      options: [
        {
          value: 1,
          newsTypeName: "普通通知",
          noticeType: "1"
        },
        {
          value: 2,
          newsTypeName: "紧急通知",
          noticeType: "2"
        },
        {
          value: 3,
          newsTypeName: "跑马灯通知",
          noticeType: "3"
        }
      ],
      value: ""
    };
  },

  created() {
    this.getParams();
    var that = this;
    //获取年级树
    getClassTree({}).then(res => {
      if (res.data.code == 200) {
        that.classInfo = [res.data.data];
      }
    });
    //获取通知信息
    if (this.noticeId > 0) {
      getNoticeDetail({ id: this.noticeId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        //匹配通知类型
        that.options.forEach(item => {
          if (item.value == obj.noticeType) {
            that.form.noticeType = item.newsTypeName;
          }
        });
        that.noticeTypeId=obj.noticeType

        this.dialogImageUrl = obj.noticePic;
        this.imagelist.push({ name: "", url: obj.noticePic });
        //匹配选中班级
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
      this.imagelist = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible=true;
    },
    beforeAvatarUpload: function(file) {
      this.qiniuData.key = new Date().getTime();
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
      // console.log(this);
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
          editNotice({
            NoticeId: that.noticeId,
            NoticeType:  this.noticeTypeId,
            NoticeTitle: that.form.noticeTitle,
            NoticeContent: that.form.noticeContent,
            NoticePic: that.dialogImageUrl,
            TargetClassIds: newTargetClassIds //投放班级ID，多个请用英文逗号隔开
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("noticelist");
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
    select(type){
          //匹配通知类型
        this.options.forEach(item => {
          if (item.noticeType == type) {
            this.form.noticeType = item.newsTypeName;
             this.noticeTypeId=item.noticeType
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
      this.noticeId = routerParams;
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