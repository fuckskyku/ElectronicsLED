<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">成长乐园</el-breadcrumb-item>
          <el-breadcrumb-item>读书推荐</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'releaseindex'})">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
          <div class="tabelmain">
              <el-container>
                 <el-header style="height:auto;">
                    <el-row :gutter="20" class="searchcontent">                  
                      <el-select v-model="value" @change="classSelect(value)" clearable placeholder="选择班级">
                        <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.className"></el-option>
                      </el-select>
                      <el-input clearable placeholder="请输入关键词" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                      <span style="float:right;">                           
                        <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editreading',0)" v-hasButton name="memberreadinglist:edit">新增读书推荐</el-button>
                        <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button>
                        <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button>
                      </span>
                    </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="readData.list==null?[]:readData.list" style="width: 100%">
                          <el-table-column prop="title" label="标题" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="targetClassIds" label="适用班级数量" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.targetClassIds | total(scope.row.targetClassIds) }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="createDate" label="发布时间" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.createDate | formatDate }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editreading',scope.row.readingId)" class="editbtn" v-hasButton name="memberreadinglist:edit"></el-button>
                              <el-button @click="handleDelete(scope.$index,scope.row)" class="deletebtn" v-hasButton name="memberreadinglist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='readData' name="getReadingList" :searchsKey="keywordsVal"></pageHtml>
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
import { getReadingList, delReading, getClassList } from "@/api/api.js";

export default {
  data() {
    return {
      readData: [],
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
    this.getReadingListFun()
    //获取班级列表
    getClassList({ pageSize: 60 }).then(res => {
      if (res.data.code == 200) {
        that.classList = res.data.data.list;
      }
    });
  },
  methods: {
    getReadingListFun() {
      var that = this;
      getReadingList({ 
        classId: parseInt(that.classId),
        keyword: ""     
      }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            that.readData = res.data.data;
            console.log("nd", that.readData);
          }
        }
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delReading({
          id: row.readingId
        }).then(res => {
          if (res.data.code == 200) {
            _this.readData.list.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            // location.reload();
            this.getReadingListFun()
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
        this.readData = [];
        //获取列表
        getReadingList({
          pageSize: 10,
          classId: parseInt(that.classId)
        }).then(res => {
          if (res.data.code == 200) {
            if(res.data.data != null){
            that.readData = res.data.data;
            console.log("nd", that.readData);
          }
          }
        });
      }else{
        getReadingList({
          pageSize: 10
        }).then(res => {
          if (res.data.code == 200) {
            if(res.data.data != null){
            that.readData = res.data.data;
            console.log("nd", that.readData);
          }
          }
        });
      }      
    },
    keyWordsInput(val) {
      if(this.value == ''){
        this.classId = ''
      }
      this.readData = [];
      var that = this;
      //获取資訊列表
      getReadingList({
        pageSize: 15,
        keyword: val,
        classId: parseInt(that.classId)
      }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            that.readData = res.data.data;
            console.log("nd", that.readData);
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
      this.readData = [];
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