<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/examinationroomlist">考试管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'examinationroomlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo dateTime">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="考试名称:" prop="examName">
            <el-input v-model="form.examName" size="small"></el-input>
          </el-form-item>
          <el-form-item label="考试时间:" required>
            <el-col :span="9">
              <el-form-item prop="examBeginTime" style="display: inline;">
                <el-date-picker v-model="form.examBeginTime" type="datetime" placeholder="起始时间"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="2"></el-col>
            <el-col :span="9">
              <el-form-item prop="examEndTime" style="display: inline;">
                <el-date-picker v-model="form.examEndTime" type="datetime" placeholder="结束时间"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <div class="tip"><i class="el-icon-warning"></i><span>例如：2017-10-10 14:00:00 -- 2017-10-10 18:00:00</span></div>
          <el-form-item label="显示时间:" required>
            <el-col :span="9">
              <el-form-item prop="showBeginTime" style="display: inline;">
               <el-date-picker v-model="form.showBeginTime" type="datetime" placeholder="起始时间"></el-date-picker>
              </el-form-item>
            </el-col> 
            <el-col class="line" :span="2"></el-col> 
            <el-col :span="9">
              <el-form-item prop="showEndTime" style="display: inline;">
                <el-date-picker v-model="form.showEndTime" type="datetime" placeholder="结束时间"></el-date-picker>
              </el-form-item>
            </el-col>  
          </el-form-item>
          <div class="tip"><i class="el-icon-warning"></i><span>例如：2017-10-10 14:00:00 -- 2017-10-10 18:00:00</span></div>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('examinationroomlist')">取消</el-button>
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
import { getExamDetail, editExam } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      examroomId: '',
      examName: '',
      examBeginTime: '',
      examEndTime: '',
      showBeginTime: '',
      showEndTime: '',
      form: {
        examName: '',
        examBeginTime: '',
        examEndTime: '',
        showBeginTime: '',
        showEndTime: '',
      },
       rules: {
        examName: [
          { required: true, message: "请填写考试名称", trigger: "blur" }
        ],
        showBeginTime: [
          { required: true, message: "请填写开始显示时间", trigger: "blur" }
        ],
        showEndTime: [
          { required: true, message: "请填写结束显示时间", trigger: "blur" }
        ],
        examBeginTime: [
          { required: true, message: "请填写考试开始时间", trigger: "blur" }
        ],
        examEndTime: [
          { required: true, message: "请填写考试结束时间", trigger: "blur" }
        ],
      },
      value: [],
      value2: []
    };
  },
  mounted() {
    var that = this;
    this.examroomId = this.$route.params.id
    //console.log(this.examroomId) 
    if(this.examroomId > 0){
      //获取考试信息
      getExamDetail({
        id: this.examroomId
      }).then(res => {
        var obj = res.data.data; 
        this.form.examName = obj.examName;
        this.form.examBeginTime = that.formatDate(obj.examBeginTime);
        this.form.examEndTime = that.formatDate(obj.examEndTime);
        this.form.showBeginTime = that.formatDate(obj.showBeginTime);
        this.form.showEndTime = that.formatDate(obj.showEndTime)
        //时间戳
        this.examBeginTime = that.formatDate(obj.examBeginTime)
        this.examEndTime = that.formatDate(obj.examEndTime)
        this.showBeginTime = that.formatDate(obj.showBeginTime)
        this.showEndTime = that.formatDate(obj.showEndTime)
      }); 
    }
  },
  methods: {  
    onSubmit(form) {
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          editExam({ 
            ExamroomId: that.examroomId,
            ExamName: that.form.examName,
            ExamBeginTime: new Date(that.form.examBeginTime).getTime() / 1000,
            ExamEndTime: new Date(that.form.examEndTime).getTime() / 1000,
            ShowBeginTime: new Date(that.form.showBeginTime).getTime() / 1000,
            ShowEndTime: new Date(that.form.showEndTime).getTime() / 1000
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("examinationroomlist");
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
    },
  },
  watch: {
    value( newVal , val) {
      //console.log("old",val,"new",newVal)
      this.form.examBeginTime = new Date(newVal[0]).getTime()/1000
      this.form.examEndTime = new Date(newVal[1]).getTime()/1000
      //console.log("this.beginTime",this.form.examBeginTime,"this.endTime",this.form.examEndTime)
    },
    value2( newVal , val) {
      //console.log("old",val,"new",newVal)
      this.form.showBeginTime = new Date(newVal[0]).getTime()/1000
      this.form.showEndTime = new Date(newVal[1]).getTime()/1000
      //console.log("this.beginTime:",this.showBeginTime,"this.endTime:",this.form.showEndTime)
    }
  },
  components: { Header }
};
</script>
