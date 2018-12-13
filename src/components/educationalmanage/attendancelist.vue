<template>
	<div id="app">
		<main>
          <el-aside class="nav"  style="width:90%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item>考勤管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'educationindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">   
                            <el-input clearable placeholder="请输入学生名称" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">                            
                            <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button>
                        <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button>
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="attendanceData.list==null?[]:attendanceData.list" style="width: 100%">
                          <el-table-column prop="className" label="年级班级" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="studentName" label="姓名" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="cardNo" label="卡号" align="center"></el-table-column>
                          <el-table-column prop="createTime" label="打卡时间" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.createTime | formatDate }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                          <el-table-column prop="studentPhoto" label="学生头像" align="center">
                             <template slot-scope="scope">     
                                <img  :src="scope.row.studentPhoto == null || scope.row.studentPhoto == '' ? url : scope.row.studentPhoto+'?imageMogr2/strip|imageView2/1/w/48/h/48/q/85'" alt="" style="width: 48px;height: 48px">
                             </template>
                          </el-table-column>
                          <el-table-column prop="picUrl" label="打卡照相" align="center">
                             <template slot-scope="scope">
                               <img  :src="scope.row.picUrl != '' ||  scope.row.picUrl != null ? scope.row.picUrl : url" alt="" style="width: 48px;height: 48px">
                             </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='attendanceData' name="getAttendanceList" :searchsKey="keywordsVal"></pageHtml>
                 </el-main>
              </el-container>
          </div>
		</main>
	</div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
</style>
<style>
@import "../../common/fonts/add/iconfont.css";
@import "../../common/fonts/import/iconfont.css";
</style>
<script>
import { getAttendanceList } from "@/api/api.js";

export default {
  data() {
    return {
      attendanceData: [],
      //关键字过滤条件
      keywordsVal: "",
      url: '/static/img/shuiyin.png'
    };
  },
  created() {
    this.init();
  },
  mounted() {
    var that = this;
    //获取考勤列表
    getAttendanceList({ 
      keyword: ""
      
    }).then(res => {
      if (res.data.code == 200) {
        if(res.data.data != null){
          that.attendanceData = res.data.data;
        }
      }
    });
    
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
    },
    skip(type, param) {
      this.$router.push({
        name: type,
        params: {
          id: param
        }
      });
    },
    keyWordsInput(val) {
      console.log(val);
      this.attendanceData = [];
      var that = this;
      //获取考勤列表
      getAttendanceList({
        keyword: val
      }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            that.attendanceData = res.data.data;
          }
        }
      });
    },
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    //清空
    clear() {
      this.attendanceData = [];
      this.value = '';
      this.keywordsVal = ''
    },
    //刷新
    refresh() {
      location.reload();
    },
    init() {
      this.classList = [];
      this.attendanceData = [];
      this.value = "";
      this.keywordsVal = "";
      this.classId = ""
    }
  },
  watch: {
    keywordsVal(val, oldVal) {
      
    }
  },
  components: {  }
};
</script>