<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/examinationroomlist">考试管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑考场信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="考试名称:" prop="examName">
            <el-input disabled v-model="form.examName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="考试时间:">
            <div class="block">
              <el-date-picker
                v-model="value"
                disabled
                type="datetimerange"
                range-separator="——"
                start-placeholder="起始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </div>
            
          </el-form-item>
          <el-form-item label="显示时间:">
            <div class="block">
              <el-date-picker
                v-model="value2"
                disabled
                type="datetimerange"
                range-separator="——"
                start-placeholder="起始时间"
                end-placeholder="结束时间">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="考场名称:" prop="examroomName">
            <el-input v-model="form.examroomName" size="small"></el-input>
          </el-form-item> 
          <el-form-item label="选择考场:">
              <template>
                <el-select v-model="className" placeholder="请选择班级作为考场">
                  <el-option  v-for="item in options" :key="item.classId" :label="item.className" :value="item.className"></el-option>
                </el-select>
              </template>
            <div class="tip"><i class="el-icon-warning"></i><span>找不到班级？去<a @click="skip('editclass',0)">添加班级</a></span></div>
           </el-form-item>
            <el-form-item label="监考老师:" prop="examTeacher">
            <el-input v-model="form.examTeacher" size="small"></el-input>
          </el-form-item>
            <el-form-item label="参考人员:">               
               <input type="file" class="file" name="file" id="txtfile" @change="uploading($event)"> 
                <div class="tip" v-show="fileshow">已上传<span><a :href="form.xlsPath" target="_blank">下载查看</a></span></div>
               <div class="tip" v-show="!fileshow"><span><a href="/static/uploads/template/考生模板.xls" target="_blank">下载考生模板</a></span></div>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="memberexaminationroomlist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('examinationroomdetaillist')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
.upload-demo {
  display: inline-block;
}
.el-button--primary {
  background: #ffdb33;
}
.el-upload {
  margin-bottom: 0;
}
li.el-upload-list__item {
  margin-top: -80px !important;
}
</style>
<script>
import Header from "@/components/publicTemplate/Header";
import {
  getExamRoomDetail,
  getExamDetail,
  editExamRoom,
  getExamRoomList,
  getExamList,
  getClassList,
  getQiniuToken
} from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";
import global_ from "@/components/tool/Global";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      formData: new FormData(),
      id: "",
      fileshow: false,
      examroomId2: "",
      examroomId: "",
      examroomName: "",
      examBeginTime: "",
      examEndTime: "",
      showBeginTime: "",
      showEndTime: "",
      value: [],
      value2: [],
      file: "",
      form: {
        examroomId: "",
        examName: "",
        examroomName: "",
        examBeginTime: "",
        examEndTime: "",
        showBeginTime: "",
        showEndTime: "",
        examTeacher: "",
        xlsPath: ""
      },
      rules: {
        examName: [
          { required: true, message: "请填写考试名称", trigger: "blur" }
        ],
        examroomName: [
          {
            required: true,
            message: "请填写考场名称",
            trigger: "blur"
          }
        ],
        // examTeacher: [
        //   {
        //     required: true,
        //     message: "请填写监考老师",
        //     trigger: "blur"
        //   }
        // ]
      },
      options: [],
      className: "",
      classId: "",
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      disabledClass: true
    };
  },
  mounted() {
    var that = this;
    this.examroomId = that.$route.params.roomid;
    this.examroomId2 = that.$route.params.roomid;
    this.id = that.$route.params.id;
    console.log(this.examroomId2);

    if (this.id > 0) {
      //获取获取考场信息
      getExamRoomDetail({
        id: this.id
      }).then(res => {
        var obj = res.data.data;
        this.form.xlsPath = obj.xlsPath;
        this.form.examTeacher = obj.examTeacher;
        this.form.examroomName = obj.examroomName;
        if (obj.xlsPath != "" && obj.xlsPath != null) {
          this.fileshow = true;
        }

        //获取考试列表
        getExamList({}).then(res => {
          var obj2 = res.data.data.list;
          obj2.map(item => {
            if (item.examroomId == obj.examroomId) {
              this.form.examName = item.examName;
              this.form.examBeginTime = that.formatDate(item.examBeginTime);
              this.form.examEndTime = that.formatDate(item.examEndTime);
              this.form.showBeginTime = that.formatDate(item.showBeginTime);
              this.form.showEndTime = that.formatDate(item.showEndTime);
              //时间戳
              this.examBeginTime = that.formatDate(item.examBeginTime);
              this.examEndTime = that.formatDate(item.examEndTime);
              this.showBeginTime = that.formatDate(item.showBeginTime);
              this.showEndTime = that.formatDate(item.showEndTime);
              this.value.push(
                new Date(this.examBeginTime),
                new Date(this.examEndTime)
              );
              this.value2.push(
                new Date(this.showBeginTime),
                new Date(this.showEndTime)
              );
            }
          });
        });
        //获取教室列表
        getClassList({ pageSize: 70 }).then(res => {
          if (res.data.code == 200) {
            this.options = res.data.data.list;
          }
        });
        //获取考场列表
        getExamRoomList({}).then(res => {
          if (res.data.code == 200) {
            this.op = res.data.data.list;
            this.op.map(item => {
              if (item.id == obj.id) {
                this.className = item.className;
              }
            });
          }
        });
      });
    } else {
      //获取教室列表
      getClassList({ pageSize: 70 }).then(res => {
        if (res.data.code == 200) {
          this.options = res.data.data.list;
        }
      });
      if (this.examroomId > 0) {
        //获取考试信息
        getExamDetail({
          id: this.examroomId
        }).then(res => {
          var obj = res.data.data;

          this.form.examName = obj.examName;
          this.form.examBeginTime = that.formatDate(obj.examBeginTime);
          this.form.examEndTime = that.formatDate(obj.examEndTime);
          this.form.showBeginTime = that.formatDate(obj.showBeginTime);
          this.form.showEndTime = that.formatDate(obj.showEndTime);
          //时间戳
          this.examBeginTime = that.formatDate(obj.examBeginTime);
          this.examEndTime = that.formatDate(obj.examEndTime);
          this.showBeginTime = that.formatDate(obj.showBeginTime);
          this.showEndTime = that.formatDate(obj.showEndTime);
          this.value.push(
            new Date(this.examBeginTime),
            new Date(this.examEndTime)
          );
          this.value2.push(
            new Date(this.showBeginTime),
            new Date(this.showEndTime)
          );
          if (obj.xlsPath != "" && obj.xlsPath != null) {
            this.fileshow = true;
          }
          this.file=obj.xlsPath;
        });
      }
    }
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data.data.token;
    });
  },
  methods: {
    uploading(event) {
      var windowURL = window.URL || window.webkitURL;
      this.file = event.target.files[0];
      // console.log("event:" + event);
      //创建文件的url
      this.form.xlsPath = windowURL.createObjectURL(event.target.files[0]);      
    },
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
      // console.log(file);
      this.dialogImageUrl = this.imageQiniuUrl + res.key;
      this.fileList.push({ name: res.key, url: this.dialogImageUrl });
    },
    handleRemove(file, fileList) {
      this.formData.delete(file);
    },
    beforeAvatarUpload: function(file) {
      this.qiniuData.key = new Date().getTime();
      const isXLSX =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isXls = file.type === "application/vnd.ms-excel";
      if (!isXls && !isXLSX) {
        this.$message.error("文件只能是 .xlsx/.xls 格式!");
        return false;
      }
    },
    submitUpload(content) {
      this.formData.append("file", content.file);
    },
    onSubmit(form) {
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          if (that.className == "") {
            this.$message.warning("请选择考场");
            return;
          }
          if (that.file == "") {
            this.$message.warning("请上传参考人员文件");
            return;
          }
          this.options.map(item => {
            if (this.className == item.className) {
              this.classId = item.classId;
            }
          });
          that.formData.append("Id", that.id);
          this.formData.append("ExamroomId", that.examroomId2);
          this.formData.append("ClassId", that.classId);
          this.formData.append("ExamRoomName", that.form.examroomName);
          this.formData.append("ExamTeacher", that.form.examTeacher);
          this.formData.append("file", that.file);

          editExamRoom(that.formData).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("examinationroomdetaillist");
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
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  watch: {
    value(newVal, val) {
      // console.log("old", val, "new", newVal);
      this.examBeginTime = new Date(newVal[0]).getTime() / 1000;
      this.examEndTime = new Date(newVal[1]).getTime() / 1000;
      console.log(
        "this.beginTime",
        this.examBeginTime,
        "this.endTime",
        this.examEndTime
      );
    },
    value2(newVal, val) {
      console.log("old", val, "new", newVal);
      this.showBeginTime = new Date(newVal[0]).getTime() / 1000;
      this.showEndTime = new Date(newVal[1]).getTime() / 1000;
      console.log(
        "this.beginTime:",
        this.showBeginTime,
        "this.endTime:",
        this.showEndTime
      );
    },
    className(newVal, val) {
      console.log("old", val, "new", newVal);
    }
  },
  computed: {
    uploadDisabled: function() {
      return this.fileList.length > 0;
    }
  },
  components: { Header }
};
</script>
