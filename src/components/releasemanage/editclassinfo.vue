<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">班级资讯</el-breadcrumb-item>
          <el-breadcrumb-item to="/classinfolist">班级介绍&班规</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px">
          <el-form-item label="班级:">
             <el-select v-model="value" placeholder="请选择" @change="select(value)">
                <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.className"></el-option>
             </el-select>
          </el-form-item>
          <el-form-item label="班徽:">
            <el-upload  :action="uploadQiniuUrl" list-type="picture-card" class="avatar-uploader picture" :data="qiniuData"
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
          <el-form-item label="班级介绍:">
            <el-input type="textarea" :rows="8" v-model="form.classIntroduce"></el-input>
          </el-form-item>
          <el-form-item label="班风:">
            <el-input type="textarea" :rows="8" v-model="form.classAtmosphere"></el-input>
          </el-form-item>
          <el-form-item label="班训:">
            <el-input type="textarea" :rows="8" v-model="form.classMotto"></el-input>
          </el-form-item>
          <el-form-item label="班规:">
            <el-input type="textarea" :rows="8" v-model="form.classRegulations"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit"  v-hasButton name="memberclassinfolist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('classinfolist')">取消</el-button>
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
import { getClassInfoDetail, editClassInfo, getClassList, getQiniuToken } from "@/api/api.js";
import global_ from "@/components/tool/Global";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {

      //获取班级列表
      classList: [],
      //存储班级信息
      classInfo: {
        classId: '',
        gradeId: '',
        className: '',
        gradeName: '',
        roomName: ''

      },
      //班级条件
      classId: '',
      targetClassId: [],
     options: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      value: "",
      dialogImageUrl: "",
      dialogVisible: false,
      disabledClass: true,
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"], // toggled buttons
            ["blockquote", "code-block"]
          ]
        }
        /* quill options */
      },
      imagelist: [],
      dialogImageUrl: "",
      dialogVisible: false,
      classInfo: [],
      imgData: {
        accept: 'image/gif, image/jpeg, image/png, image/jpg',
      },

      form: {
        classId: '',
        classLogo: '',
        classAtmosphere: '',
        classMotto: '',
        classRegulations: '',
        classIntroduce: ''
      },
    };
  },
  created() {
    this.getParams()
    // console.log(this.form.Id)
  },
  mounted() {
    this.classid = this.$route.params.id;
    var that = this;
    //获取班级列表
    getClassList({ pageSize: 100 }).then(res => {
      if (res.data.code == 200) {
        that.classList = res.data.data.list;
        setTimeout(() =>{
          that.classList.map( (item,index) =>{
            if(item.classId == that.form.classId){
              that.value = item.className
            }
          })
        },1000)
      }
    });
    
    //获取通知信息
    if(this.classId>0){
      getClassInfoDetail({ id: this.classId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        this.dialogImageUrl = obj.classLogo;
        this.imagelist.push({ name: "", url: obj.classLogo });
      });
    }
    
    
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data.data.token;
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
      var that = this
      //获取班级列表
      //获取选中的班级ID
      getClassList({ pageSize: 100 }).then(res => {
        if (res.data.code == 200) {
          res.data.data.list.map( (item) =>{
            if(item.className == that.value){  
              that.form.classId = item.classId
            }
          })
        }
        
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
      // console.log(this);
      //新增/编辑通知
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
            editClassInfo({ 
            ClassId: that.form.classId,
            ClassAtmosphere: that.form.classAtmosphere,
            ClassLogo: that.dialogImageUrl,
            ClassMotto: that.form.classMotto,
            ClassRegulations: that.form.classRegulations,
            ClassIntroduce: that.form.classIntroduce
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("classinfolist");
            }else{
              this.$message({
                type: "fail",
                message: res.data.message
              });
            }
          });
        }else {
          console.log("error submit!!");
          return false;
        }
        
      })
        
    },
    skip(type,param) {
      this.$router.push({
        name: type
      });
    },
    getParams () {       
          this.classId= this.$route.params.id;
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
