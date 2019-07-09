<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">班级资讯</el-breadcrumb-item>
          <el-breadcrumb-item>班级活动</el-breadcrumb-item>
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
                            <el-input clearable placeholder="请输入活动标题" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">                           
                          <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editclassactivity',0)" v-hasButton name="memberclassactivitylist:edit">新增活动</el-button>
                          <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                          <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="classData.list==null?[]:classData.list" style="width: 100%">
                          <el-table-column prop="title" label="活动标题" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="targetClassIds" label="班级" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.targetClassIds | total(scope.row.targetClassIds) }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="createDate" label="添加时间" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.createDate | formatDate }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="author" label="发布人" min-width="100" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.author != '' ? scope.row.author : '无' }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editclassactivity',scope.row.id)" class="editbtn" v-hasButton name="memberclassactivitylist:edit"></el-button>
                              <el-button @click="handleDelete(scope.$index, scope.row)" class="deletebtn" v-hasButton name="memberclassactivitylist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='classData' name="getClassactivityList" :searchsKey="keywordsVal"></pageHtml>
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
import { getClassactivityList, delClassactivity, getClassList } from "@/api/api.js";

export default {
  data() {
    return {
      classData: [],
      //获取班级列表
      classList: [],
      //存储班级信息
      classInfo: { classId: '',gradeId: '',className: '',gradeName: '',roomName: ''},
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
    //获取班级活动列表
    this.getClassactivityListFun()
    //获取班级列表
    getClassList({ pageSize: 2000 }).then(res => {
      if (res.data.code == 200) {
        console.log("nianji", res.data.data.list);
        that.classList = res.data.data.list;
        res.data.data.list.forEach( (item,index) =>{
         
        })
      }
    });
  },
  methods: {
    getClassactivityListFun() {
      getClassactivityList({ 
        classId: parseInt(this.classId),
        keyword: ""     
      }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            this.classData = res.data.data;
            console.log("nd", this.classData);
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
        delClassactivity({
          id: row.id
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getClassactivityListFun()
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
        this.classData = [];
        //获取班级活动列表
        getClassactivityList({
          pageSize: 15,
          classId: parseInt(that.classId)
        }).then(res => {
          if (res.data.code == 200) {
            if(res.data.data != null){
              this.classData = res.data.data;
              console.log("nd", this.classData);
            }
          }
        });
      }else{
        getClassactivityList({
          pageSize: 15
        }).then(res => {
          if (res.data.code == 200) {
            if(res.data.data != null){
              this.classData = res.data.data;
              console.log("nd", this.classData);
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
      this.classData = [];
      var that = this;
      //获取班级活动列表
      getClassactivityList({
        pageSize: 10,
        keyword: val,
        classId: parseInt(that.classId)
      }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            this.classData = res.data.data;
            console.log("nd", this.classData);
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
      this.classData = [];
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