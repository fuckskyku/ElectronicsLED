<template>
  <div id="app"  class="animated zoomIn">
    <main>
      <el-aside class="nav">
        <div class="goback" @click="$router.go(-1)">
          <img src="/static/img/返回.png" alt="">返回
        </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
          </el-breadcrumb>
          
      </el-aside>
      <el-container>
        <el-aside class="baseSettingAside" style="width:40%;margin-top:169px;">
          <el-row>
                      <el-tooltip placement="right" trigger="click" v-hasButton name="memberschoolinfo:view">
                          <div slot="content" class="basesettingnavdiv"><a @click="skip('schoolinfo')" class="school-info">学校信息管理</a></div>
                           <el-button style="margin-top:23px;" class="school text">学校基础信息</el-button>                         
                      </el-tooltip>        
                    </el-row> 
                     <el-row>
                        <el-tooltip placement="right" trigger="click">
                          <div slot="content" class="basesettingnavdiv">
                            <div><a @click="skip('userdutylist')"  v-hasButton name="memberdutylist:view">职务管理</a></div>
                            <div><a @click="skip('userlist')"   v-hasButton name="memberuserlist:view">用户管理</a></div>
                            </div>
                           <el-button  class="account text" style="margin-top:23px;" v-hasMenu name="memberdutylist:view,memberuserlist:view">账号管理</el-button>                         
                      </el-tooltip>      
                    </el-row>
                     <el-row>
                       <el-tooltip placement="right" trigger="click">
                          <div slot="content" class="basesettingnavdiv">
                            <div><a @click="skip('teacherlist')" v-hasButton name="memberteacherlist:view">教师管理</a></div>
                            <div><a @click="skip('studentlist')" v-hasButton name="memberstudentlist:view">学生管理</a></div>
                            </div>
                           <el-button  class="user text" style="margin-top:23px;" v-hasMenu name="memberteacherlist:view,memberstudentlist:view">学校成员管理</el-button>                         
                      </el-tooltip>      
                    </el-row>
                     <el-row>
                        <el-tooltip placement="right" trigger="click">
                          <div slot="content" class="basesettingnavdiv">
                            <div><a @click="skip('classroomlist')" v-hasButton name="memberbuildinglist:view">教室管理</a></div>
                            <div><a @click="skip('devicelist')" v-hasButton name="memberclientlist:view">设备管理</a></div>
                            </div>
                           <el-button class="resource text" style="margin-top:23px;" v-hasMenu name="memberbuildinglist:view,memberclientlist:view">学校资源管理</el-button>                         
                        </el-tooltip>  
                    </el-row>
                     <el-row>
                       <el-tooltip placement="right" trigger="click">
                          <div slot="content" class="basesettingnavdiv">
                            <div><a @click="skip('subjectlist')" v-hasButton name="membersubjectlist:view">科目管理</a></div>
                            <div><a @click="skip('classlist')" v-hasButton name="memberclasslist:view">班级管理</a></div>
                            </div>
                           <el-button class="xingzheng text" style="margin-top:23px;" v-hasMenu name="membersubjectlist:view,memberclasslist:view">行政管理</el-button>                         
                        </el-tooltip>  
                    </el-row>    
        
        </el-aside>
        <el-main style="margin-top:132px;">
          <img src="/static/img/jichushezhi.png"/>
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
</style>

<script>
import Header from "@/components/publicTemplate/Header";

export default {
  data() {
    return {
      value: ""
    };
  },
  updated(){
    window.scrollTo(0,0)
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
  components: { Header }
};
</script>
