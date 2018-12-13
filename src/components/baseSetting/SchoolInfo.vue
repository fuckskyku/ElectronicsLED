<template>
	<div id="app">
		<main id="SchoolInfo">
       <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
            <el-breadcrumb-item to="/basesettingindex">学校基础信息</el-breadcrumb-item>
            <el-breadcrumb-item>学校信息管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'basesettingindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
        </el-aside>
           <el-container id="schollContainer">
               <el-row :gutter="20" style="width:100%;text-align:center;">
                 <span class="title">{{schoolName}}</span>
                   <el-button type="primary" round class="edit" @click="skip('editschoolinfo')"  v-hasButton name="memberschoolinfo:edit">编辑信息</el-button>
               </el-row>
              </el-container>
              <el-container id="boxContainer">                
               <el-row :gutter="40" style="width:99%;margin-left:0;">
                 <el-col :span="6"><div class="box kaixuebg redborder">
                     <span class="title">开学日期</span>
                     <span class="date">{{startDate}}</span>
                   </div></el-col>
                 <el-col :span="6"><div class="box qimobg blueborder">
                     <span class="title">期末日期</span>
                     <span class="date">{{endDate}}</span>
                   </div></el-col>
                 <el-col :span="6"><div class="box addressbg yellowborder">
                     <span class="title">地址</span>
                     <span class="date" :title="address">{{address}}</span></div></el-col>
                 <el-col :span="6"><div class="box telbg greenborder">
                     <span class="title">电话</span>
                     <span class="date" :title="phone">{{phone}}</span></div></el-col>
               </el-row>
              </el-container>
              <!-- <el-progress :text-inside="true" :stroke-width="18" :percentage="80" color="rgba(255,222,42,1)"></el-progress> -->
              <el-container class="jinduContainer">
                 <el-row>
                      <el-col :span="3"><div class="title">学校简介：</div></el-col>                      
                 </el-row>
                 <el-row class="schoolcontent">
                   <div class="ql-container ql-snow" style="border:0;">
                      <div class="ql-editor">
                        <span v-html="content"></span>
                      </div>
                   </div>                 
                 </el-row>
              </el-container>
		</main>
	</div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
</style>
<style scoped>
@import "../../common/fonts/quit/iconfont.css";
</style>
<script>
import { parseDate } from "@/util/date.js";
import { quillEditor } from "vue-quill-editor";

//接口获取学校信息
import { setSchoolCredential, getMySchoolList, getSchoolInfo } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";
export default {
  data() {
    return {
      options: [],
      icon: '',
      firstSchool:"",
      schoolName: "",
      startDate: "",
      endDate: "",
      address: "",
      phone: "",
      value: "",
      content: ""
    };
  },
  methods: {
    //点击退出
    logoutClick() {
      this.removeItem('token')
      this.$router.push({ path: '/Login' })
    },
    //切换学校
    changeSchool(selVal){
      setSchoolCredential({schoolId:selVal}).then(res=>{
        if(res.data.code=200){
          var obj = this.options.find((item)=>{
            return item.schoolId === selVal;
          });
          this.firstSchool = obj.schoolName
          location.reload();
        }
      })
    },
    handleSchoolClick() {
      alert(this);
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    },
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  },
  mounted() {
    getMySchoolList().then(res => { 
      if(res.data.data !== ''){
        this.options = res.data.data
        this.firstSchool=res.data.data[0].schoolName
      } 
      console.log("this.options",res)
    });
    getSchoolInfo().then(res => {
      var obj = res.data.data;
      this.icon = res.data.data.logo
      this.schoolName = obj.schoolName;
      this.startDate = this.formatDate(obj.beginDate);
      this.endDate = this.formatDate(obj.endDate);
      this.address = obj.address;
      this.phone = obj.tel;
      this.content = obj.info;
    });
  },
  components: { }
};
</script>