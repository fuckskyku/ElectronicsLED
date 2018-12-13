<template>
	<div id="app">
		<main>
          
          <el-aside class="nav"  style="width:90%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item>会议管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'educationindex'})">
            <img src="/static/img/返回.png" alt="">返回
          </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">   
                            <el-input  placeholder="请输入标题"  @change="keyWordsInput" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">                            
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editmeeting',0)"  v-hasButton name="membermeetinglist:edit">新增会议</el-button>
                            <el-button type="primary" round icon="el-icon-delete"  @click="keyWordsInput('')">清空</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData.list!=null?tableData.list:[]" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="meetingTitle" label="会议"></el-table-column>
                          <el-table-column prop="meetingTime" label="会议时间"  :show-overflow-tooltip="true">
                            <!-- <template slot-scope="scope">
                              <span>{{ scope.row.meetingTime | formatDate }}</span>
                            </template> -->
                          </el-table-column>
                          <el-table-column prop="showBeginTime" label="显示时间" align="center"  :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                              <span>{{ scope.row.showBeginTime | formatDate }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="meetingAddress" label="地址"></el-table-column>
                          <el-table-column prop="meetingMembers" label="人员"></el-table-column>
                          <el-table-column prop="targetClassIds" label="班级">
                            <template slot-scope="scope">
                                  <span>
                                     {{ scope.row.targetClassIds == null?'0个班级':scope.row.targetClassIds.split(',').length + '个班级'}}</span>
                             </template>
                          </el-table-column>
                          <el-table-column prop="createDate" label="添加时间" align="center" :show-overflow-tooltip="true">
                             <template slot-scope="scope">
                              <span>{{ scope.row.createDate | formatDate }}</span>
                            </template>
                          </el-table-column>                           
                         <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editmeeting',scope.row.id)" class="editbtn" v-hasButton name="membermeetinglist:edit"></el-button>
                              <el-button @click="delMeeting(scope.$index,scope.row)" class="deletebtn" v-hasButton name="membermeetinglist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                       <pageHtml :tabObj.sync='tableData' name="getMajormattersList" :searchsKey="keywordsVal"></pageHtml>
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
import { getMeetingList, delMeeting } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: ""
    };
  },
  methods: {
     getMeetingListFun() {
       let that=this;
        //表格数据
        getMeetingList({ pageSize: 10 }).then(res => {
          if (res.data.code == 200) {
            if(res.data.data != null){
              this.tableData = res.data.data;
            }         
          }
        });
     },
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      getMeetingList({
        keyword: val,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            this.tableData = res.data.data;
          }       
        }
      });
    },
    delMeeting(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delMeeting({
            id: row.id
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getMeetingListFun()
            } else {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    skip(type, param) {
      this.$router.push({
        name: type,
        params: { id: param }
      });
    }
  },
  mounted() {
    this.getMeetingListFun()
  },
  components: { Header }
};
</script>