<template>
	<div id="app">
		<main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
        <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
        <el-breadcrumb-item to="/basesettingindex">学校成员管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/studentlist">学生管理</el-breadcrumb-item>
        <el-breadcrumb-item>批量导入</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'studentlist'})">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>    
          <!-- <el-aside class="nav" style="width:400px;"><span class="frontClass">首页</span>  >  <span class="frontClass">基础设置</span>  >  <span class="frontClass">学校成员管理</span>  > <span class="frontClass">学生管理</span>  > <span class="lastClass">批量导入</span></el-aside> -->
      <div id="importStudent" class="editInfo">           
        <el-form ref="ruleForm" :model="form" label-width="280px" style="padding-left:400px;">
            <el-form-item label="导入文件:">
              <el-upload class="upload-demo" :headers="headers" style="height: 40px" ref="upload" name="file" action="/api/admin/editImportStudent" :on-change="fileChange" :before-upload="beforeAvatarUploadFile" :on-success="handleAvatarSuccessFile" :show-file-list="false" :auto-upload='false'  :multiple="false">
                <el-button icon="el-icon-upload" class="seach_yellow" type="primary">点击选择文件</el-button>
              </el-upload>
              <span class="tips" v-if="fileFlagErr" style="color: #FF7262;"><i class="el-icon-error"></i> 选择失败</span>
              <span class="tips" v-if="fileFlag" style="color: #0ACF83;"><i class="el-icon-success"></i> 选择成功</span>
                  <!-- <el-input  size="small" prefix-icon="el-icon-upload2" placeholder="点击选择文件"></el-input> -->
                  <div>
                      <a href="http://dzbp.mseenet.com/uploads/template/StudentInfotemp.xls" download="学生导入模板">下载学生信息模板</a>
                  </div>
            </el-form-item>
              <el-form-item style="text-align:left;margin-top:400px;">
                  <div style="margin-left:-280px;">
                    <el-button type="primary" @click="submit" class="submit">保存</el-button>
                    <el-button class="cancel" type="info" @click="skip('studentlist')">返回列表</el-button>
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
import { Loading } from 'element-ui'
var LoadingShow
export default {
  data() {
    return {      
      value: "",
      form: {},
      fileFlag: false,
      fileFlagErr: false
    };
  },
  methods: {
    //提交上传
    submit() {
      // console.log("this.$refs",this.$refs)
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          //
          //手动提交文件
          if (this.fileFlag != true) {
            this.$message({
              type: 'error',
              message: '请选择导入的学生信息'
            })
          } else {
            LoadingShow = Loading.service({
              lock: true,
              text: '文件上传中,请耐心等待',
              // spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            this.$refs.upload.submit()
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //提示用户文件选择成功
    fileChange(file) {
      console.log('fileChange(file)',file)
      //控制上传文件格式
      let Xls = file.name.split('.')
      if (Xls[1] === 'xls' || Xls[1] === 'xlsx') {
        if (file.status == 'ready') {
          this.$message.success('选择成功')
          this.fileFlag = true
          this.fileFlagErr = false
        }
        return file
      } else {
        this.$message.error('上传文件只能是 xls/xlsx 格式!')
        this.fileFlag = false
        this.fileFlagErr = true
        return false
      }
    },
    //文件上传之前处理
    beforeAvatarUploadFile(file) {
      console.log('beforeAvatarUploadFile(file)',file)
      //控制上传文件格式
      let Xls = file.name.split('.')
      if (Xls[1] === 'xls' || Xls[1] === 'xlsx') {
        return file
      } else {
        this.$message.error('上传文件只能是 xls/xlsx 格式!')
        this.fileFlag = false
        this.fileFlagErr = true
        return false
      }
    },
    //导入文件
    handleAvatarSuccessFile(res,file) {
      console.log('handleAvatarSuccessFile:','res',res,'file',file)
      if (file.response.code == '200') {
        LoadingShow.close()
        this.$message.success(file.response.message)
        this.$router.go(-1)
      } else {
        LoadingShow.close()
        this.$message.error(file.response.message)
        this.fileFlagErr = true
        this.fileFlag = false
      }
    },
    onSubmit() {
      alert(this);
    },
    skip(type) {
      this.$router.push({
        name: type
      })
     }
  },
  computed: {
    headers() {
      if (TOKEN) {
        return {
          TOKEN
        }
      } else {
        this.$router.push('/')
      }
    }
  }
};
</script>