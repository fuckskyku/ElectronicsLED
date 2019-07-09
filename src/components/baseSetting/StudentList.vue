<template>
	<div id="app">
		<main>
        
        <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">学校成员管理</el-breadcrumb-item>
              <el-breadcrumb-item>学生管理</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.push({name: 'basesettingindex'})">
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
                            <el-input  placeholder="请输入学生名称" suffix-icon="el-icon-search" style="width:230px;" @change="keyWordsInput" v-model="keywordsVal"></el-input>
                         <span style="float:right;">                            
                            <el-button type="primary" round icon="iconfont icon-daoru"  @click="skip('importstudent',0)">批量导入学生</el-button>
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editstudent',0)"  v-hasButton name="memberstudentlist:edit">新增学生</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-delete"  @click="keyWordsInput('')">清空</el-button> -->
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                     <el-table :data="tableData.list==null?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="className" label="年级班级">
                            <template slot-scope="scope">
                              <span>{{scope.row.className != null?scope.row.className:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="studentName" label="学生姓名"></el-table-column>
                          <el-table-column prop="studentCode" label="学号"></el-table-column>
                          <el-table-column prop="cardNo" label="卡号" align="center">
                            <template slot-scope="scope">
                              <span>{{scope.row.cardNo != null?scope.row.cardNo:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="idCard" label="身份证号" align="center">
                            <template slot-scope="scope">
                              <span>{{scope.row.idCard != null?scope.row.idCard:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="sex" label="性别" align="center">
                               <template slot-scope="scope">
                                  <span>
                                     {{ scope.row.sex ==1?'男':'女'}}</span>
                             </template>
                          </el-table-column>
                          <el-table-column prop="photo" label="头像" align="center">
                             <template slot-scope="scope">
                               <img  :src="scope.row.photo == null || scope.row.photo == '' ? url : scope.row.photo+'?imageMogr2/strip|imageView2/1/w/48/h/48/q/85'" alt="" style="width: 48px;height: 48px">
                             </template>
                          </el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editstudent',scope.row)" class="editbtn"  v-hasButton name="memberstudentlist:edit"></el-button>
                              <el-button @click="delStudent(scope.$index, scope.row)" class="deletebtn"  v-hasButton name="memberstudentlist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='tableData' name="getStudentList" :searchsKey="keywordsVal"></pageHtml>
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
import { getStudentList, delStudent, getClassList } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
      options: [],
      classId: 0,
      value: 0,
      url: '/static/img/shuiyin.png'
    };
  },
  methods: {
    open(){
      this.$message('等待开发')
    },
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
      getStudentList({
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
          }else
             this.tableData=[] 
        }
      });
    },
    delStudent(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delStudent({
            id: row.studentId
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
    skip(type, row) {

      console.log('row',row)
      this.$router.push({
        path: "/editstudent/?id=" + row.studentId,
        name: type,
        params: {
          id: row.studentId,
        },
        query: {
          className: row.className
        }
      });
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