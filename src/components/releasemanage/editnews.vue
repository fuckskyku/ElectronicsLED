<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">学校资讯</el-breadcrumb-item>
          <el-breadcrumb-item to="/newslist">资讯管理</el-breadcrumb-item>
          <el-breadcrumb-item>资讯信息编辑</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="资讯标题:" prop="newsTitle">
            <el-input v-model="form.newsTitle" size="small"></el-input>
          </el-form-item>
          <el-form-item label="资讯类别:" prop="newsTypeId">
            <template>
              <el-select v-model="newsTypeId" @change="select(form.newsTypeId)" placeholder="请选择资讯类别" >
                <el-option  v-for="item in options"  :key="item.newsType" :label="item.newsTypeName" :value="item.newsType"></el-option>
              </el-select>
            </template>
            <div class="tip">
              <i class="el-icon-warning"></i>
              <span>
                找不到类别？去<a href="#" @click="skip('editnewstype',-1)">添加类别</a>
              </span>
            </div>
          </el-form-item>
          <el-form-item label="通知班级:">
            <el-tree
              v-model="form.TargetClassIds"
              :data="tree"
              show-checkbox
              :default-expanded-keys="[0]"
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="资讯图片:">
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
          <el-form-item label="资讯内容:" prop="newsContent">
            <template>
              <quill-editor   v-model="form.newsContent"  ref="myQuillEditor" :options="editorOption"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                              @change="onEditorChange($event)">
              </quill-editor>
            </template> 
            
          </el-form-item>
          <el-form-item label="作者:">
            <el-input v-model="form.newsAuthor" size="small"></el-input>
          </el-form-item>
          <el-form-item label="来源:">
            <el-input v-model="form.newSource" size="small"></el-input>
          </el-form-item>
          <el-form-item label="链接:">
            <el-input v-model="form.newsLink" size="small"></el-input>
          </el-form-item>
          <el-form-item label="摘要:">
            <el-input type="textarea" :rows="8" v-model="form.newsAbstract"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="membernewslist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('newslist')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";

.cancel {
  color: #aeaeae;
  background: transparent;
  border: 1px solid #e5e5e5;
}
</style>
<script>
import Header from "@/components/publicTemplate/Header";
import {
  editNews,
  getNewsDetail,
  getNewsTypeDetail,
  getNewsTypeList,
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
      newsTypeId: "",
      newsId: "",
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      newsTypeName: "",
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      rules: {
        newsTitle: [
          { required: true, message: "请填写资讯标题", trigger: "blur" }
        ],
        newsTypeName: [
          {
            required: true,
            message: "请选择资讯类别",
            trigger: "blur"
          }
        ],
        newsContent: [
          { required: true, message: "请填写资讯内容", trigger: "blur" }
        ]
      },
      form: {
        newsId: "",
        newsTypeId: "",
        newsTypeName: "",
        newsTitle: "",
        newsContent: "",
        newsPic: "",
        newsAuthor: "",
        newSource: "",
        newsLink: "",
        publishTime: "",
        TargetClassIds: ""
      },
      tempTree: {},
      tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      options: [],
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        placeholder: "您想说点什么？",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"], // toggled buttons
            ["blockquote", "code-block"]
          ]
        }
        /* quill options */
      },
      value: "",
      imagelist: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabledClass: true
    };
  },
  created() {
    this.getParams();
    var that = this;

    //获取年级树
    getClassTree({}).then(res => {
      if (res.data.code == 200) {
        that.tree = [res.data.data];
        console.log(that.tree.length - 1);
      }
    });
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data.data.token;
      this.qiniuToken = res.data.data.token;
    });

    //获取资讯类别列表option
    getNewsTypeList({}).then(res => {
      if (res.data.code == 200) {
        console.log('res.data',res.data)
        if (res.data.data != null) {
          that.options = res.data.data.list;
          // that.options.value = res.data.data.list.newsType
        }
      }
    });

    //获取资讯信息
    if (this.newsId > 0) {
      getNewsDetail({ id: this.newsId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        if (obj.newsPic != "") {
          this.dialogImageUrl = obj.newsPic;
          this.imagelist.push({ name: "", url: obj.newsPic });
        }
        if (obj.newsType != 0) {
          this.newsTypeId = obj.newsType;
          this.form.newsTypeId = obj.newsType;
        } else this.form.newsTypeId = "";
        //匹配选中班级
        var arr = [];
        if (obj.targetClassIds != "") {
          obj.targetClassIds.split(",").map((item, index) => {
            arr.push(eval(item));
          });
          this.$refs.tree.setCheckedKeys(arr);
        }

        if (that.newsTypeId != "" && that.newsTypeId != 0) {
          //获取资讯类别信息
          getNewsTypeDetail({ id: that.form.newsTypeId }).then(res => {
            if (res.data.code == 200) {
              if (res.data.data != null) {
                that.newsTypeName = res.data.data.newsTypeName;
              }
            }
          });
        }
      });
    } //if结束
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
    //
    select(val) {
      this.options.map(item => {
        if (item.newsTypeName == val) {
          this.newsTypeId = item.newsType;
        }
      });
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
          editNews({
            NewsId: that.newsId,
            NewsType: that.newsTypeId,
            NewsTitle: that.form.newsTitle,
            NewsContent: that.form.newsContent,
            NewsPic: that.dialogImageUrl,
            NewsAuthor: that.form.newsAuthor,
            NewSource: that.form.newSource,
            NewsLink: that.form.newsLink,
            NewsAbstract: that.form.newsAbstract,
            PublishTime: that.form.publishTime,
            TargetClassIds: newTargetClassIds //投放班级ID，多个请用英文逗号隔开
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("newslist");
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
