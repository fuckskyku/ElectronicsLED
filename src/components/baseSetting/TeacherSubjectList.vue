<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/teacherlist">老师管理</el-breadcrumb-item>
              <el-breadcrumb-item>任课管理</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'teacherlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
           <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">                       
                            <el-input  placeholder="请输入老师名称" suffix-icon="el-icon-search" style="width:230px;"  @change="keyWordsInput"></el-input>
                         <span style="float:right;">                            
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip2('editteachersubject',0)"  v-hasButton name="memberteacherlist:edit">新增任课</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-delete" @click="keyWordsInput('')">清空</el-button> -->
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                            <el-button type="primary" round icon="iconfont icon-returnfanhuizuo" @click="skip('teacherlist',0)">返回</el-button>
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData.list==null?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="teacherName" label="教师姓名"></el-table-column>
                          <el-table-column prop="className" label="班级"></el-table-column>
                          <el-table-column prop="subjectName" label="科目" align="center"></el-table-column>
                          <el-table-column prop="idCard" label="身份证号" align="center"></el-table-column>
                          <el-table-column prop="sex" label="性别" align="center">
                            <template slot-scope="scope">
                                  <span>
                                     {{ scope.row.sex == 2?'女':'男'}}</span>
                             </template>
                          </el-table-column>
                          <el-table-column prop="photo" label="头像" align="center">
                             <template slot-scope="scope">
                               <img  :src="scope.row.photo" alt="" style="width: 48px;height: 48px">
                             </template>
                          </el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip2('editteachersubject',scope.row.teacherSubjectId)" class="editbtn"  v-hasButton name="memberteacherlist:edit"></el-button>
                              <el-button @click="delTeacher(scope.$index, scope.row)" class="deletebtn"  v-hasButton name="memberteacherlist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
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
@import "../../common/fonts/return/iconfont.css";
</style>
<script>
import Header from "@/components/publicTemplate/Header";
import { getTeacherSubjectList, delTeacherSubject } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
      teacherId: 0,
      value: "",
    };
  },
  methods: {
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      this.getList();
    },
    getList() {
      getTeacherSubjectList({
        keyword: this.keywordsVal,
        teacherId: this.teacherId,
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
    delTeacher(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          delTeacherSubject({
            id: row.teacherSubjectId
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              location.reload()
            } else {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
    },
    skip(type, param) {
      this.$router.push({
        path: "/teacherlist"
      });
    },
    skip2(type, param) {
      console.log('teacherId',this.teacherId)
      this.$router.push({
        name: type,
        params: {
          teacherId: this.teacherId,
          id: param
        },
        query: {
          path: this.$route.path
        }
      });
    }
  },
  mounted() {
    console.log(this.$route)
    this.teacherId = this.$route.params.teacherId;
    this.getList();
  },
  components: { Header }
};
</script>