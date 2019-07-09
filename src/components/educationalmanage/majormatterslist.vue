<template>
	<div id="app">
		<main>
          
          <el-aside class="nav"  style="width:90%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item>重大事件倒计时</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'educationindex'})">
            <img src="/static/img/返回.png" alt="">返回
          </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">   
                        <el-input  placeholder="请输入关键词"  @change="keyWordsInput" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">                    
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editmajormatters',0)" v-hasButton name="membermajormatterslist:edit">新增倒计时</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-delete"  @click="keyWordsInput('')">清空</el-button> -->
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="title" label="标题"></el-table-column>
                          <el-table-column prop="targetClassIds" label="通知班级数量">
                               <template slot-scope="scope">
                                  <span>
                                     {{ scope.row.targetClassIds == null?"0个班级":scope.row.targetClassIds.split(',').length + '个班级'}}</span>
                             </template>
                          </el-table-column>
                          <el-table-column prop="endTime" label="倒计时时间">
                            <template slot-scope="scope">
                              <span>{{ scope.row.endTime | formatDate }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="createDate" label="添加时间" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.createDate | formatDate }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="statusName" label="状态"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editmajormatters',scope.row.id)" class="editbtn" v-hasButton name="membermajormatterslist:edit"></el-button>
                              <el-button @click="delMajormatters(scope.$index,scope.row)" class="deletebtn" v-hasButton name="membermajormatterslist:delete"></el-button>
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
//接口获取重大事件倒计时列表
import { getMajormattersList, delMajormatters } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: ""
    };
  },
  methods: {
    getMajormattersListFun(){
      var that=this;
      //表格数据
      getMajormattersList({ pageSize: 10 }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            that.tableData = res.data.data;
          } 
        }
      });
    },
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      getMajormattersList({
        keyword: val,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            this.tableData = res.data.data;
          }else{
            this.tableData = []
          }
        }
      });
    },
    delMajormatters(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delMajormatters({
            id: row.id
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getMajormattersListFun()
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
        path: "/editmajormatters/?id=" + param,
        name: type,
        params: {
          id: param
        }
      });
    }
  },
  mounted() {
    this.getMajormattersListFun()
  },
  components: { }
};
</script>