<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">学校资源管理</el-breadcrumb-item>
              <el-breadcrumb-item>教室管理</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'basesettingindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                 <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">       
                            <el-input  placeholder="请输入教学楼或教室名称" @change="keyWordsInput" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">                          
                            <!-- <el-button type="primary" round icon="iconfont icon-daoru"  @click="skip('importclassroom',0)">批量导入教室</el-button> -->
                            <el-button type="primary" round icon="iconfont icon-daoru"  @click="skip('importclassroom',0)">批量导入教室</el-button>
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editclassroom',0)" v-hasButton name="memberbuildinglist:edit">新增教室</el-button>
                            <el-button type="primary" round icon="el-icon-delete"  @click="keyWordsInput('')">清空</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                         </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData.list==null?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="roomId" label="教室ID">
                            <template slot-scope="scope">
                                  <span>
                                     {{scope.row.schoolId+'-'+scope.row.roomId}}</span>
                             </template>
                          </el-table-column>
                          <el-table-column prop="buildingName" label="教学楼名称"></el-table-column>
                          <el-table-column prop="roomName" label="房间号"></el-table-column>
                          <el-table-column prop="className" label="班级">
                            <template slot-scope="scope">
                              <span>{{scope.row.className != null?scope.row.className:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="bindClientNum" label="绑定设备数量">
                            <template slot-scope="scope">
                              <span>{{scope.row.bindClientNum != null?scope.row.bindClientNum:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column label="管理操作">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editclassroom',scope.row.roomId)" class="editbtn" v-hasButton name="memberbuildinglist:edit"></el-button>
                              <el-button @click="delBuilding(scope.$index, scope.row)" class="deletebtn" v-hasButton name="memberbuildinglist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='tableData' name="getBuildingList" :searchsKey="keywordsVal"></pageHtml>
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
import { getBuildingList, delBuilding } from "@/api/api.js";

export default {
  data() {
    return {
      //关键字过滤条件
      keywordsVal: "",
      tableData: [],
      value: ""
    };
  },
  methods: {
    open(){
      this.$message('等待开发')
    },
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      this.getList();
    },
    getList() {
      getBuildingList({
        keyword: this.keywordsVal,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
          this.tableData = res.data.data;
          } else {
            this.tableData=[];
          }
        }
        console.log("this.tableData",this.tableData)
      });
    },
    delBuilding(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delBuilding({
            id: row.roomId
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
        path: "/editclassroom/?id=" + param,
        name: type,
        params: {
          id: param
        }
      });
    }
  },
  mounted() {
    this.getList();
  },
  components: { Header }
};
</script>