<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item>自定义显示</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.go(-1)">
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
                      <el-input clearable placeholder="请输入标题" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                      <span style="float:right;">                           
                        <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editschoolcustom',0)" v-hasButton name="membereditcustom:edit">新增自定义显示</el-button>
                        <!-- <el-button type="primary" @click="keyWordsInput('')" round icon="el-icon-delete">清空</el-button> -->
                        <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                      </span>
                    </el-row>
                 </el-header>
                 <el-main>
                     <el-table :data="tableData.list == null?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="className" label="年级班级" align="center"></el-table-column>
                          <el-table-column prop="title" label="标题" align="center"></el-table-column>
                          <el-table-column prop="status" label="上下架" align="center">
                            <template slot-scope="scope">
                               <el-switch
                                      v-model="scope.row.status" @change="updateStatus(scope.row.status,scope.row.customId)" active-color="#FFDE2A"  inactive-color="#D6D6D6"></el-switch>
                            </template>
                          </el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editschoolcustom',scope.row.customId)" class="editbtn" v-hasButton name="membereditcustom:edit"></el-button>
                              <el-button @click="delSchoolCustom(scope.$index, scope.row)" class="deletebtn" v-hasButton name="membereditcustom:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='tableData' name="getSchoolCustomList" :searchsKey="keywordsVal"></pageHtml>
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
import { getSchoolCustomList, delSchoolCustom, getClassList,updateSchoolCustom } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
      classId: 0,
      options: [],
      value: 0,
      url: '/static/img/shuiyin.png'
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
      getSchoolCustomList({
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
    updateStatus(customStatus,id)
    {
       updateSchoolCustom({
            Id: id,
            Status:customStatus,
          }).then(res => {
            if (res.data.code == 200) {              
            } else {
              this.$message({
                type: "fail",
                message: res.data.message
              });
            }
          });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    delSchoolCustom(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          delSchoolCustom({
            id: row.customId
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
    skip(type, param) {
      this.$router.push({
        path: "/editschoolcustom/?id=" + param,
        name: type,
        params: {
          id: param
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