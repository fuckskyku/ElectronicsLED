<template>
	<div id="app">
		<main>
          
          <el-aside class="nav">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">学校成员管理</el-breadcrumb-item>
          <el-breadcrumb-item>老师管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'basesettingindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
        </el-aside>
        <div class="tabelmain">
              <el-container>
                 <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">                  
                            <el-select v-model="value" placeholder="请选择年级" @change="currentSel" clearable>
                                    <el-option v-for="item in options" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                            </el-select>
                            <el-input  placeholder="请输入老师名称" suffix-icon="el-icon-search" @change="keyWordsInput" v-model="keywordsVal" style="width:230px;"></el-input>
                         <span style="float:right;">                           
                            <el-button type="primary" round icon="iconfont icon-daoru"  @click="skip('importteacher',0)">批量导入老师</el-button>
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editteacher',0)"  v-hasButton name="memberteacherlist:edit">新增老师</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-delete" @click="keyWordsInput('')">清空</el-button> -->
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData.list==null?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="teacherName" label="教师姓名">

                          </el-table-column>
                          <el-table-column prop="cardNo" label="卡号">
                            <template slot-scope="scope">
                              <span>{{scope.row.cardNo != null?scope.row.cardNo:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="teacherSubjects" label="科目" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                              <span>{{scope.row.teacherSubjects != null?scope.row.teacherSubjects:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="idCard" label="身份证号" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                              <span>{{scope.row.idCard != null?scope.row.idCard:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="sex" label="性别">
                             <template slot-scope="scope">
                                  <span>
                                     {{ scope.row.sex == 2?'女':'男'}}</span>
                             </template>
                          </el-table-column>
                          <el-table-column prop="photo" label="头像">
                             <template slot-scope="scope">
                               <img  :src="scope.row.photo == null || scope.row.photo == '' ? url : scope.row.photo +'?imageMogr2/strip|imageView2/1/w/48/h/48/q/85'" alt="" style="width: 48px;height: 48px">
                             </template>
                          </el-table-column>
                          <el-table-column prop="job" label="职务管理">
                            <template slot-scope="scope">                          
                              <a @click="skip2('schooldutylist',scope.row.teacherId)" v-hasButton name="memberdutylist:view">职务管理</a>
                            </template>
                          </el-table-column>
                          <el-table-column prop="teach" label="任课管理">
                            <template slot-scope="scope">
                              <a @click="skip2('teachersubjectlist',scope.row.teacherId)"  v-hasButton name="memberteacherlist:view">任课管理</a>
                            </template>
                          </el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editteacher',scope.row.teacherId)" class="editbtn"  v-hasButton name="memberteacherlist:edit"></el-button>
                              <el-button @click="delTeachers(scope.$index, scope.row)" class="deletebtn"  v-hasButton name="memberteacherlist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='tableData' name="getTeacherList" :searchsKey="keywordsVal"></pageHtml>
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
//接口获取教师列表
import { getTeacherList, delClass, getClassList, delTeacher } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
      classId: 0,
      options: [],
      value: '',
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
      getTeacherList({
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
    handleEdit(index, row) {
      console.log(index, row);
    },
    delTeachers(index, row) {
      console.log(row)
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          delTeacher({
            id: row.teacherId
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              location.reload();
            } else {
              this.$message({
                type: "error",
                message: res.data.message
              });
            }
          });
        })
    },
    skip2(type, param) {
      this.$router.push({
        name: type,
        params: {
          teacherId: param
        },
        
      });
    },
    skip(type, param) {
      this.$router.push({
        name: type,
        params: {
          teacherId: param
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