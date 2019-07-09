<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">班级资讯</el-breadcrumb-item>
          <el-breadcrumb-item>班级介绍&班规</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'releaseindex'})">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
          <div class="tabelmain">
              <el-container>
                 <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">         
                        <el-input clearable @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" placeholder="请输入班级名称" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                        <span style="float:right;">                           
                          <el-button type="primary" round icon="el-icon-edit"  @click="skip('editclassinfo',0)"  v-hasButton name="memberclassinfolist:edit">设置班级介绍</el-button>
                          <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                          <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="classInfoData.list==null?[]:classInfoData.list" style="width: 100%">
                          <el-table-column prop="className" label="班级名称" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="classLogo" label="班徽" align="center">
                              <template slot-scope="scope">
                               <img  :src="scope.row.classLogo == null || scope.row.classLogo == '' ? url : scope.row.classLogo+'?imageMogr2/strip|imageView2/1/w/48/h/48/q/85'" alt="" style="width: 48px;height: 48px">
                             </template>
                          </el-table-column>
                          <el-table-column prop="classAtmosphere" label="班风" align="center"></el-table-column>
                          <el-table-column prop="classMotto" label="班训" align="center"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editclassinfo',scope.row.classId)" class="editbtn"  v-hasButton name="memberclassinfolist:edit"></el-button>
                              <el-button @click="handleDelete(scope.$index,scope.row)" class="deletebtn" v-hasButton name="memberclassinfolist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='classInfoData' name="getClassInfoList" :searchsKey="keywordsVal"></pageHtml>
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
import { getClassInfoList,delClassInfo } from "@/api/api.js";

export default {
  data() {
    return {
      classInfoData: [],
      options: [],
      //关键字过滤条件
      keywordsVal: "",
      targetClassId: [],
      keys: "",
      keyVal: []
    };
  },
  mounted() {
    var that = this;
    this.getClassInfoListFun()
    
  },
  methods: {
    getClassInfoListFun() {
      //获取班级介绍列表
      getClassInfoList({ 
        keyword: ""     
      }).then(res => {
        if (res.data.code == 200) {
          console.log(res.data)
          if(res.data.data !== null){
            this.classInfoData = res.data.data;
            console.log("nd", this.classInfoData);
          }
          
        }
      });
    },
    handleDelete(index, row) {
        console.log(index, row);
        let _this = this;
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          delClassInfo({
            id: row.classId
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getClassInfoListFun()
            } else {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        });
      },
     skip(type, param) {
      this.$router.push({
        name: type,
        params: {
          id: param
        }
      });
    },  
    keyWordsInput(val) {
      console.log(val);
      if(this.value == ''){
        this.classId = ''
      }
      this.classInfoData = [];
      var that = this;
      //获取資訊列表
      getClassInfoList({
        pageSize: 10,
        keyword: val,
        // classId: parseInt(that.classId)
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data !== null) {
            that.classInfoData = res.data.data.list;
            console.log(that.classInfoData);
          }
        }
      });
    },
    //清空
    clear() {
      this.classInfoData = [];
      this.value = '';
      this.keywordsVal = ''
    },
    //刷新
    refresh() {
      location.reload();
    },
  },
  components: { Header }
};
</script>