<template>
  <div id="app"  class="animated zoomIn">
    <main>
      
      <el-aside class="nav"  style="width:90%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item>教务管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.go(-1)">
            <img src="/static/img/返回.png" alt="">返回
          </div>
      </el-aside>
      <el-container>
        <el-aside class="baseSettingAside" style="width:40%;margin-top:50px;margin-bottom:50px;">
                    <el-row v-hasButtonId id="memberattendancesetting:view">
                          <div class="btndiv attendancesetting"><router-link to="attendancesetting">考勤设置</router-link></div>
                    </el-row> 
                     <el-row v-hasButtonId id="memberattendancelist:view">
                           <div  class="btndiv attendancemanage"><router-link to="attendancelist">考勤管理</router-link></div>      
                    </el-row>
                     <el-row v-hasButtonId id="membercurriculumllist:view">
                           <div class="btndiv schedule"><router-link to="curriculumlist">课程表管理</router-link></div>        
                    </el-row>    
                     <el-row v-hasButtonId id="memberschedulelist:view">
                           <div class="btndiv rest"><router-link to="schedulelist">作息表管理</router-link></div>       
                    </el-row>  
                     <el-row v-hasButtonId id="membermeetinglist:view">
                           <div class="btndiv conference"><router-link to="meetinglist">会议管理</router-link></div>       
                    </el-row>  
                     <el-row v-hasButtonId id="memberexaminationroomlist:view">
                           <div class="btndiv exam"><router-link to="examinationroomlist">考试管理</router-link></div>       
                    </el-row>  
                     <el-row v-hasButtonId id="membermajormatterslist:view">
                           <div class="btndiv countdown"><router-link to="majormatterslist">重大事件倒计时</router-link></div>        
                    </el-row>      
                    <el-row v-hasButtonId id="memberscreenlist:view">
                           <div class="btndiv screen"><router-link to="fixedscreenlist">占屏管理</router-link></div>        
                    </el-row>   
        </el-aside>
        <el-main style="margin-top:132px;">
          <img src="/static/img/jiaowuguanli.png"/>
        </el-main>
      </el-container>
    </main>
    
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
</style>
<style>
.el-menu--collapse {
  width: 400px;
  min-height: 400px;
}
.btndiv a{
  color:#2D2D2D;
  
}
</style>

<script>
import Header from "@/components/publicTemplate/Header";

export default {
  data() {
    return {
      value: ""
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    }
  },
  updated(){
    window.scrollTo(0,0)
  },
  components: { Header }
};
</script>
