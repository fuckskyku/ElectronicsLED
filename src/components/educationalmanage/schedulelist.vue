<template>
	<div id="app">
		<main>
          
          <el-aside class="nav"  style="width:90%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item>作息表管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'educationindex'})">
            <img src="/static/img/返回.png" alt="">返回
          </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">   
                        <el-input  placeholder="请输入关键词" @change="keyWordsInput" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">              
                            <el-button type="primary" round icon="el-icon-date" @click="download('/static/uploads/template/作息表模板.xls')">下载作息表模板</el-button>             
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editschedule',0)"  v-hasButton name="memberschedulelist:edit">新增作息表</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-delete"  @click="keyWordsInput('')">清空</el-button> -->
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData.list==null?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="title" label="作息表名称" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="class" label="适用班级数量" align="center">
                             <template slot-scope="scope">
                                  <span>
                                     {{ (scope.row.targetClassIds == null || scope.row.targetClassIds == '')?"0个班级":scope.row.targetClassIds.split(',').length + '个班级'}}</span>
                             </template>
                          </el-table-column>
                          <el-table-column prop="xlsPath" label="作息时间表" align="center">
                               <template slot-scope="scope">     
                                       <a @click="download(scope.row.xlsPath)"  target="_blank">下载</a> 
                               </template>
                          </el-table-column>
                          <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('scheduledetail',scope.row.scheduleId)" class="viewbtn"  v-hasButton name="memberschedulelist:edit"></el-button>
                              <el-button  @click="skip('editschedule',scope.row.scheduleId)" class="editbtn"  v-hasButton name="memberschedulelist:edit"></el-button>
                              <el-button @click="delSchedule(scope.$index, scope.row)" class="deletebtn" v-hasButton name="memberschedulelist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                       <pageHtml :tabObj.sync='tableData' name="getScheduleList" :searchsKey="keywordsVal"></pageHtml>
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
import { getScheduleList, getScheduleDetail,delSchedule } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: ""
    };
  },
  methods: {
    getList() {
      let _this = this;
      getScheduleList({
        keyword: this.keywordsVal,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          _this.tableData = res.data.data;
          if (res.data.data != null) {
            _this.tableData.list.forEach(item => {
              item.hoverShow = false;
            });
          } else _this.tableData = [];
        }
      });
    },
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      this.getList();
    },
    delSchedule(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delSchedule({
            id: row.scheduleId
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              _this.tableData.list.splice(index, 1);
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
        path: "/"+type+"/?id=" + param,
        name: type,
        params: {
          id: param
        }
      });
    },
    download(path){
      location.href=path;
    }
  },
  mounted() {
    this.getList();
  },
  components: { Header }
};
</script>