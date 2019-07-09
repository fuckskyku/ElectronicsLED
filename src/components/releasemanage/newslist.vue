<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
             <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
             <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
             <el-breadcrumb-item to="/releaseindex">学校资讯</el-breadcrumb-item>
             <el-breadcrumb-item>资讯管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'releaseindex'})">
            <img src="/static/img/返回.png" alt="">返回
          </div>
      </el-aside>
      <el-tabs v-model="activeName" @tab-click="handleClick"  type="border-card">
        <el-tab-pane label="资讯信息" name="first">
          <div class="tabelmain">
            <el-container>
              <el-header style="height:auto;">
                <el-row :gutter="20" class="searchcontent">
                  <el-select v-model="value" clearable placeholder="全部班级" @change="classSelect(value)">
                    <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.className"></el-option>
                  </el-select>
                  <el-input  placeholder="请输入标题关键词" clearable @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                  <span style="float:right;">
                    <el-button type="primary" round="" icon="iconfont icon-zengjia"  @click="skip('editnews',0)" v-hasButton name="membernewslist:edit">新增资讯</el-button>
                    <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                    <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                  </span>
                </el-row>
              </el-header>
              <el-main>
                <el-table :data="newsData.list==null?[]:newsData.list" style="width: 100%">
                    <el-table-column prop="newsTitle" label="资讯标题" min-width="100" align="center"></el-table-column>
                    <el-table-column prop="targetClassIds" label="通知班级数量" min-width="100" align="center">
                      <template slot-scope="scope">
                        <span>{{ scope.row.targetClassIds | total(scope.row.targetClassIds) }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="createDate" label="发布时间" align="center">
                      <template slot-scope="scope">
                        <span>{{ scope.row.createDate | formatDate }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="author" label="作者" align="center"></el-table-column>
                    <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                    <el-table-column prop="newsTypeName" label="类型" align="center"></el-table-column>
                    <el-table-column label="管理操作" align="center">
                      <template slot-scope="scope">
                        <el-button @click="skip('editnews',scope.row.newsId)" class="editbtn" v-hasButton name="membernewslist:edit"></el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" class="deletebtn" v-hasButton name="membernewslist:delete"></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <pageHtml :tabObj.sync='newsData' name="getNewsList" :searchsKey="keywordsVal"></pageHtml>
              </el-main>
            </el-container>
          </div>
        </el-tab-pane>
        <el-tab-pane label="资讯类别" name="second">
            <div class="tabelmain">
            <el-container>
              <el-header style="height:auto;">
                <el-row :gutter="20" class="searchcontent">
                  <el-input  placeholder="请输入关键词" clearable @input="keyWordsInput2(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                  <span style="float:right;">
                    <el-button type="primary" round="" icon="iconfont icon-zengjia"  @click="skip('editnewstype',-1)" v-hasButton name="membernewslist:edit">新增类别</el-button>
                    <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                    <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                  </span>
                </el-row>
              </el-header>
              <el-main>
                <el-table :data="newsData2.list==null?[]:newsData2.list" style="width: 100%">
                  <el-table-column prop="newsTypeName" label="资讯类型" min-width="100" align="center"></el-table-column>
                  <el-table-column prop="statusName" label="状态" min-width="100" align="center"></el-table-column>
                  <el-table-column label="管理操作" align="center">
                    <template slot-scope="scope">
                      <el-button  @click="skip('editnewstype',scope.row.newsType)" class="editbtn" v-hasButton name="membernewslist:edit"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pageHtml :tabObj.sync='newsData2' name="getNewsTypeList" :searchsKey="keywordsVal"></pageHtml>
              </el-main>
            </el-container>
          </div>
        </el-tab-pane>
      </el-tabs>
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
import { getNewsList, delNews, getNewsTypeList, getClassList } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";
export default {
  data() {
    return {
      activeName: "first",
      newsData2: [],
      //获取資訊列表
      newsData: [],
      //获取班级列表
      classList: [],
      //存储班级信息
      classInfo: {
        classId: '',
        gradeId: '',
        className: '',
        gradeName: '',
        roomName: ''
      },
      //
      options: [],
      value: "全部年级",
      //关键字过滤条件
      keywordsVal: "",
      //班级条件
      classId: '',
      targetClassId: [],
      keys: "",
      keyVal: []
    };
  },
  mounted() {
    var that = this;
    //获取資訊列表
    this.getNewsListFun()
    //获取班级列表
    getClassList({ pageSize: 100 }).then(res => {
      if (res.data.code == 200) {
         if(res.data.data != null){
          that.classList = res.data.data.list
        } 
      }
    });
    //获取资讯类别列表
    this.getNewsTypeListFun()
  },
  methods: {
    getNewsListFun() {
      var that = this;
      //获取資訊列表
      getNewsList({ 
        pageSize: 10,
        classId: parseInt(that.classId),
        keyword: ""       
      }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){   
            that.newsData = res.data.data;
          }
        }
      });
    },
    getNewsTypeListFun() {
      //获取资讯类别列表
      var that = this;
      getNewsTypeList({  }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            that.newsData2 = res.data.data
          } 
        }
      });
    },
    handleEdit(index,row) {
      console.log(index,row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delNews({
          id: row.newsId
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getNewsListFun()
            // location.reload();
          } else {
            this.$message({
              type: "success",
              message: res.data.message
            });
          }
        });
      });
    },
    handleClick(tab, event) {
      console.log(this.activeName)
      console.log(tab, event);
      console.log(tab.label)
      if(tab.label == '资讯信息') {
        
      }else{
        
      }
    },
    skip(type, param) {
      console.log('param',param)
      this.$router.push({
        name: type,

        params: {
          id: param
        }
      });
    },
    classSelect(val) {
      var that = this;
      //如果清空班级查询，初始化classId
      if(this.value == ''){
        this.classId = ''
      }
      //获取查询班级的classId
      this.classList.map( (item)=> {
        if(val == item.className){
          that.classId = item.classId
        }
      })
      if(val !== '全部年级'){
        this.newsData = [];
        //获取資訊列表
        getNewsList({
          pageSize: 10,
          classId: parseInt(that.classId)
        }).then(res => {
          if (res.data.code == 200) {
            if (res.data.data != null) {
              that.newsData = res.data.data
              console.log(that.newsData);
            }
          }
        });
      }else{
        getNewsList({
          pageSize: 10
        }).then(res => {
          if (res.data.code == 200) {
            if (res.data.data !== null) {
              that.newsData = res.data.data
              console.log(that.newsData);
            }
          }
        });
      }      
    },
    keyWordsInput(val) {
      console.log(val);
      if(this.value == ''){
        this.classId = ''
      }
      this.newsData = [];
      var that = this;
      //获取資訊列表
      getNewsList({
        pageSize: 10,
        keyword: val,
        classId: parseInt(that.classId)
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data !== null) {
            that.newsData = res.data.data;
            console.log(that.newsData);
          }
        }
      });
    },
    //
    keyWordsInput2(val) {
      console.log(val);
      this.newsData2 = [];
      var that = this;
      //获取資訊列表
      getNewsTypeList({
        pageSize: 10,
        keyword: val,
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            that.newsData2 = res.data.data
            console.log(that.newsData2);
          }
        }
      });
    },
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    //清空
    clear() {
      this.newsData = [];
      this.value = '';
      this.keywordsVal = ''
      
    },
    //刷新
    refresh() {
      location.reload();
    },
  },
  components: { }
};
</script>
