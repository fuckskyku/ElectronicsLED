<template>
	<div id="app">
		<main>
          
          <el-aside class="nav"  style="width:90%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item>考试管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'educationindex'})">
            <img src="/static/img/返回.png" alt="">返回
          </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">   
                            <el-input clearable="" placeholder="请输入考试名称" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">                            
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editexaminationroom',0)" v-hasButton name="memberexaminationroomlist:edit">新增考试</el-button>
                            <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                            <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="testData.list!=null?testData.list:[]" style="width: 100%">
                          <el-table-column prop="examName" label="考试名称" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="examRoomNum" label="考场数量" align="center"></el-table-column>
                          <el-table-column label="考试时间" min-width="100" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">    
                              {{scope.row.examBeginTime | formatDate}} ~ 
                              {{scope.row.examEndTime | formatDate}}
                            </template>    
                          </el-table-column>
                          <el-table-column label="显示时间" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">   
                              {{scope.row.showBeginTime | formatDate}} ~ 
                              {{scope.row.showEndTime | formatDate}}  
                            </template>    
                          </el-table-column>
                          <el-table-column prop="createTime" label="添加时间" align="center" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                              {{scope.row.createTime!=null?new Date(scope.row.createTime*1000).format('yyyy-MM-dd hh:mm:ss'):'无'}}
                            </template> 
                          </el-table-column>                   
                          <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                          <el-table-column label="设置考场信息" align="center">
                            <template slot-scope="scope">     
                              <a @click="skip2('examinationroomdetaillist',scope.row.examroomId)">设置考场信息</a>                              
                            </template>    
                          </el-table-column>        
                         <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editexaminationroom',scope.row.examroomId)" class="editbtn" v-hasButton name="memberexaminationroomlist:edit"></el-button>
                              <el-button @click="handleDelete(scope.$index, scope.row)" class="deletebtn" v-hasButton name="memberexaminationroomlist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='testData' name="getExamList" :searchsKey="keywordsVal"></pageHtml>
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
import Header from "@/components/publicTemplate/Header";
import { getExamList, delExam } from "@/api/api.js";

export default {
  data() {
    return {
      examindate: "",
      showdate: "",
      //关键字过滤条件
      keywordsVal: "",
      testData: []
    };
  },
  mounted() {
    this.getExamListFun()
  },
  methods: {
    getExamListFun() {
      var that = this;
      //获取考试列表
      getExamList({
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data !== null) {
            that.testData = res.data.data;
            console.log(that.testData);
          }
        }
      });
    },
    skip(type, param) {
      this.$router.push({
        name: type,
        params: {
          id: param
        }
      });
    },
    skip2(type, param) {
      this.$router.push({
        name: type,
        params: {
          roomid: param
        }
      });
    },
    handleDelete(index, row) {
      console.log(index, row);
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delExam({
          id: row.examroomId
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getExamListFun()
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
      });
    },
    keyWordsInput(val) {
      console.log(val);
      this.testData = [];
      var that = this;
      //获取考试列表
      getExamList({
        pageSize: 10,
        keyword: val
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data !== null) {
            that.testData = res.data.data;
            console.log(that.testData);
          }
        }
      });
    },
    //清空
    clear() {
      this.testData = [];
      this.value = "";
      this.keywordsVal = "";
    },
    //刷新
    refresh() {
      location.reload();
    }
  },
  components: { Header }
};
</script>