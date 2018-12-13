<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">行政管理</el-breadcrumb-item>
              <el-breadcrumb-item>科目管理</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'basesettingindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                 <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">                     
                        <el-input  placeholder="请输入科目名称" @change="keyWordsInput" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                        <span style="float:right;">                            
                            <el-button type="primary" round icon="iconfont icon-daoru"  @click="skip('importsubject',0)">批量导入科目</el-button>
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editsubject',0)" v-hasButton name="membersubjectlist:view">新增科目</el-button>
                            <el-button type="primary" round icon="el-icon-delete"  @click="keyWordsInput('')">清空</el-button>
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData==[]?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column type="index" label="序号" width="100px"></el-table-column>
                          <el-table-column prop="subjectName" label="科目名称"></el-table-column>
                          <el-table-column prop="teacherNumber" label="任课教师数量"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editsubject',scope.row.subjectId)" class="editbtn" v-hasButton name="membersubjectlist:edit"></el-button>
                              <el-button @click="delSubject(scope.$index, scope.row)" class="deletebtn" v-hasButton name="membersubjectlist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='tableData' name="getSubjectList" :searchsKey="keywordsVal"></pageHtml>
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
//接口获取科目列表
import { getSubjectList, delSubject } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
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
      let _this = this;
      getSubjectList({
        keyword: this.keywordsVal,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          _this.tableData = res.data.data;
          if (res.data.data != null) {
            _this.tableData.list.forEach(item => {
              item.hoverShow = false;
            });
          }else
             _this.tableData=[]
        }
      });
    },
    delSubject(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delSubject({
            id: row.subjectId
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
        path: "/editsubject/?id=" + param,
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