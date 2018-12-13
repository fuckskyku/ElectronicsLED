<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item>考勤设置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'educationindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px">
          <el-form-item label="早上上学打卡时间段:">
             <el-time-select  placeholder="起始时间"  v-model="form.AmStartTime1"  :picker-options="{start: '00:00', step: '00:10', end: '23:50' }"> </el-time-select>
             <span class="line"></span>
             <el-time-select  placeholder="结束时间"  v-model="form.AmStartTime2"  :picker-options="{start: '00:00',step: '00:10', end: '23:50', minTime: form.startTime1 }">
           </el-time-select>
          </el-form-item>
         <el-form-item label="早上放学打卡时间段:">
             <el-time-select  placeholder="起始时间"  v-model="form.AmCloseTime1"  :picker-options="{start: '00:00', step: '00:10', end: '23:30' }"> </el-time-select>
             <span class="line"></span>
             <el-time-select  placeholder="结束时间"  v-model="form.AmCloseTime2"  :picker-options="{start: '00:00',step: '00:10', end: '23:50', minTime: form.startTime2 }">
           </el-time-select>
          </el-form-item>
         <el-form-item label="下午上学打卡时间段:">
             <el-time-select  placeholder="起始时间"  v-model="form.PmStartTime1"  :picker-options="{start: '00:00', step: '00:10', end: '23:50' }"> </el-time-select>
             <span class="line"></span>
             <el-time-select  placeholder="结束时间"  v-model="form.PmStartTime2"  :picker-options="{start: '00:00',step: '00:10', end: '23:50', minTime: form.startTime3 }">
           </el-time-select>
          </el-form-item>
         <el-form-item label="下午放学打卡时间段:">
             <el-time-select  placeholder="起始时间"  v-model="form.PmCloseTime1"  :picker-options="{start: '00:00', step: '00:10', end: '23:50' }"> </el-time-select>
             <span class="line"></span>
             <el-time-select  placeholder="结束时间"  v-model="form.PmCloseTime2"  :picker-options="{start: '00:00',step: '00:10', end: '23:50', minTime: form.startTime4 }">
           </el-time-select>
          </el-form-item>
          <div class="sub">
            <el-form-item>
              
                <el-button type="primary" @click="onSubmit('form')" class="submit"  v-hasButton name="memberattendancesetting:edit">保存</el-button>
                <el-button class="cancel" type="info" @click="skip('educationindex')">取消</el-button>
              
            </el-form-item>
          </div>
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
import { getAttendanceSetting, attendanceSetting } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      AmStartTime1: '',
      AmStartTime2: '',
      AmCloseTime1: '',
      AmCloseTime2: '',
      PmStartTime1: '',
      PmStartTime2: '',
      PmCloseTime1: '',
      PmCloseTime2: '',
      form: {
        AmStartTime1: "",
        AmStartTime2: "",
        AmCloseTime1: "",
        AmCloseTime2: "",
        PmStartTime1: "",
        PmStartTime2: "",
        PmCloseTime1: "",
        PmCloseTime2: ""
      }
    };
  },
  mounted() {
    var that = this;
    //获取考勤设置信息
    getAttendanceSetting({}).then(res => {
      var obj = res.data.data;
      this.form = obj; 
      this.AmStartTime1 = obj.AmStartTime1;
      this.AmStartTime2 = obj.AmStartTime2;
      this.AmCloseTime1 = obj.AmCloseTime1;
      this.AmCloseTime2 = obj.AmCloseTime2;
      this.PmStartTime1 = obj.PmStartTime1;
      this.PmStartTime2 = obj.PmStartTime2;
      this.PmCloseTime1 = obj.PmCloseTime1;
      this.PmCloseTime2 = obj.PmCloseTime2;
      console.log("pageShowTime:" , obj);
    }); 
  },
  methods: {  
    onSubmit(form) {
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          attendanceSetting({ 
            AmStartTime1: that.form.AmStartTime1,
            AmStartTime2: that.form.AmStartTime2,
            AmCloseTime1: that.form.AmCloseTime1,
            AmCloseTime2: that.form.AmCloseTime2,
            PmStartTime1: that.form.PmStartTime1,
            PmStartTime2: that.form.PmStartTime2,
            PmCloseTime1: that.form.PmCloseTime1,
            PmCloseTime2: that.form.PmCloseTime2,
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("educationindex");
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
    }
  },
  components: { Header }
};
</script>
