<template>
	<div id="app">
		<main>
          <el-aside class="nav"  style="width:90%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item>课程表管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'educationindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">   
                            <el-select v-model="value" placeholder="请选择" @change="currentSel">
                                    <el-option v-for="item in options" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                            </el-select>
                            <el-input  placeholder="请输入关键词" suffix-icon="el-icon-search" @change="keyWordsInput" style="width:230px;"></el-input>
                         <span style="float:right;">              
                            <el-button type="primary" round icon="el-icon-date" @click="download('/static/uploads/template/课程表模板.xls')">下载课程表模板</el-button>              
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editcurriculum',0)"  v-hasButton name="membercurriculumllist:view">新增课程表</el-button>
                            <el-button type="primary" round icon="el-icon-delete"  @click="keyWordsInput('')">清空</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData==[]?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="title" label="课程表名称" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="className" label="年级班级" align="center"></el-table-column>
                          <el-table-column prop="xlsPath" label="课程表" align="center">
                               <template slot-scope="scope">     
                                        <a @click="download(scope.row.xlsPath)"  target="_blank">下载</a> 
                               </template>
                          </el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('curriculumdetail',scope.row.courseId)" class="viewbtn"  v-hasButton name="membercurriculumllist:edit"></el-button>
                              <el-button  @click="skip('editcurriculum',scope.row.courseId)" class="editbtn"  v-hasButton name="membercurriculumllist:edit"></el-button>
                              <el-button @click="delCurriculum(scope.$index, scope.row)" class="deletebtn" v-hasButton name="membercurriculumllist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='tableData' name="getCurriculumList" :searchsKey="keywordsVal"></pageHtml>
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
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script>
import Header from "@/components/publicTemplate/Header";
import {
  getCurriculumList,
  getCurriculumDetail,
  delCurriculum,
  getClassList
} from "@/api/api.js";
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
      classId: 0,
      options: [],
      value: 0
    };
  },
  methods: {
    currentSel(selVal) {
      this.classId = selVal;
      this.getList();
    },
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      this.getList();
    },
    getList() {
      getCurriculumList({
        keyword: this.keywordsVal,
        classId: this.classId,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          if (res.data.data != null) {
            this.tableData.list.forEach(item => {
              item.hoverShow = false;
            });
          } else this.tableData = [];
        }
      });
    },
    delCurriculum(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delCurriculum({
            id: row.courseId
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
        path: "/editstudent/?id=" + param,
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
    getClassList({ pageSize: 10000 }).then(res => {
      var list = res.data.data.list;
      list.unshift({ classId: 0, className: "全部" });
      this.options = res.data.data.list;
    });
  },
  components: { Header }
};
</script>