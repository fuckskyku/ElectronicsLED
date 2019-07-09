<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">账号管理</el-breadcrumb-item>
              <el-breadcrumb-item to="/userlist">用户管理</el-breadcrumb-item>
              <el-breadcrumb-item>编辑用户</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'userlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div id="editUserInfo" class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px" style="padding-left:400px;">
                <el-form-item label="用户名:">
                     <el-input v-model="form.userName" size="small"  ></el-input>
                     <!-- style="border: 1px solid #ccc; width: 350px;height:32px;border-radius: 5px;" -->
                </el-form-item>
                <el-form-item label="头像:" style="height:216px;">
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
                <el-form-item label="用户邮箱:">
                     <el-input v-model="form.email" size="small"></el-input>
                 </el-form-item>
                <el-form-item label="手机号码:">
                     <el-input v-model="form.mobile" size="small"></el-input>
                 </el-form-item>
                 <el-form-item label="昵称:">
                    <el-input v-model="form.nickName" size="small"></el-input>
                 </el-form-item>
                 <el-form-item label="密码:">
                       <el-input v-model="password" value="" placeholder="有新密码请填写,空则不修改密码" size="small" type="password"></el-input>
                 </el-form-item>
                 <el-form-item label="职务">
                      <template>
                            <el-select v-model="value" placeholder="请选择职务" @change="select(value)">
                               <el-option  v-for="item in options" :key="item.dutyId" :label="item.dutyName" :value="item.dutyName"></el-option>
                            </el-select>
                      </template>
                 </el-form-item>
                 <el-form-item style="text-align:left;margin-top:80px;">
                     <div style="margin-left:-280px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit"  v-hasButton name="memberdutylist:edit">保存</el-button>
                       <el-button class="cancel" type="info" @click="skip('userlist')">取消</el-button>
                     </div>
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
  getDutyList,
  getUserDetail,
  editUser,
  getQiniuToken
} from "@/api/api.js";
import global_ from "@/components/tool/Global";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      userId: "",
      password: "",
      dutyId: "",
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl+"?imageMogr2/strip|imageView2/1/w/158/h/158/q/85",
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      imagelist: [],
      dialogImageUrl: "",
      dialogVisible: false,
      imgData: {
        accept: "image/gif, image/jpeg, image/png, image/jpg"
      },
      form: {
        userId: "",
        userName: "",
        mobile: "",
        nickname: "",
        email: "",
        userId: ""
      },
      options: [],
      value: ""
    };
  },
  created() {
    this.getParams();
    console.log(this.userId);
  },
  mounted() {
    var that = this;
    //获取用户明细
    if (this.userId > 0) {
      getUserDetail({ id: this.userId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        that.dutyId = obj.dutyId;
        if (obj.avatar != "") {
          this.dialogImageUrl = obj.avatar;
          this.imagelist.push({ name: "", url: obj.avatar });
        } 
      });
    } 
    //获取职务列表
    getDutyList({}).then(res => {
      that.options = res.data.data.list;
      console.log("that.options", that.options);
      that.options.map((item, index) => {
        if (that.dutyId == item.dutyId) {
          that.value = item.dutyName;
        }
      });
    });

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
      this.qiniuData.key = new Date().getTime()+extension;
      
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
      this.options.map(item => {
        if (item.dutyName == val) {
          this.dutyId = item.dutyId;
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
      //新增/编辑通知
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          console.log(
              'UserId: ',that.userId,
              'Nickname: ',that.form.nickName,
              'Username: ',that.form.userName,
              'Email: ',that.form.email,
              'Mobile: ',that.form.mobile,
              'Avatar: ',that.dialogImageUrl,
              'DutyId: ',that.dutyId,
              'Password: ',that.password //不修改传空值
          )
          if (that.dutyId > 0 && that.dutyId != "") {

            editUser({
              UserId: that.userId,
              Nickname: that.form.nickName,
              Username: that.form.userName,
              Email: that.form.email,
              Mobile: that.form.mobile,
              Avatar: that.dialogImageUrl,
              DutyId: that.dutyId,
              Password: that.password //不修改传空值
            }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.skip("userlist");
              } else {
                this.$message({
                  type: "fail",
                  message: res.data.message
                });
              }
            });
          } else {
            alert("请选择职务");
          }
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
      this.userId = routerParams;
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