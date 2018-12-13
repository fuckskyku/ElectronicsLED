<template>
  <div id="app">
    <main>
      
      <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
             <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
             <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
             <el-breadcrumb-item>占屏管理</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'educationindex'})">
            <img src="/static/img/返回.png" alt="">返回
          </div>
      </el-aside>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
        <el-tab-pane label="占屏管理" name="first">
          <div class="tabelmain">
            <el-container>
              <el-header style="height:auto;">
                <el-row :gutter="20" class="searchcontent">
                  <span style="float:right;">
                    <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button>
                  </span>
                </el-row>
              </el-header>
              <el-main>
                <el-table :data="screenData" style="width: 100%">
                  <el-table-column prop="pageId" label="页面编号" min-width="100" align="center"></el-table-column>
                  <el-table-column prop="pageName" label="页面名称" min-width="100" align="center"></el-table-column>
                  <el-table-column prop="orderId" label="排序ID" align="center"></el-table-column>
                  <el-table-column prop="fixedScreenStatus" label="当前占屏状态" align="center"></el-table-column>
                  <el-table-column prop="pageScreenNum" label="当前占屏的班级数量" align="center"></el-table-column>
                  <el-table-column prop="setinfo" label="占屏设置" align="center">
                    <template slot-scope="scope">   
                      <el-button type="primary" round="" icon="iconfont icon-zengjia"  @click="skip('editfixedscreen',scope.row.schoolpageid)" v-hasButton name="memberscreenlist:edit">占屏设置</el-button>  
                    </template>    
                  </el-table-column>    
                </el-table>
                <!-- <pageHtml :tabObj.sync='screenData' name="getScreenList" :searchsKey="keywordsVal"></pageHtml> -->
              </el-main>
            </el-container>
          </div>
        </el-tab-pane>
        <el-tab-pane label="占屏记录" name="second">
            <div class="tabelmain">
            <el-container>
              <el-header style="height:auto;">
                <el-row :gutter="20" class="searchcontent">
                  <el-input clearable placeholder="请输入关键词" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                  <span style="float:right;">
                    <el-button type="primary" round="" icon="el-icon-edit"  @click="skip('editfixedscreen',0)" v-hasButton name="memberscreenlist:edit">设置占屏</el-button>
                    <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button>
                    <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button>
                  </span>
                </el-row>
              </el-header>
              <el-main>
                <el-table :data="screenData2.list!=null?screenData2.list:[]" style="width: 100%">
                  <el-table-column prop="title" label="标题" min-width="100" align="center"></el-table-column>
                  <el-table-column prop="pageName" label="页面" min-width="100" align="center"></el-table-column>
                  <el-table-column prop="beginTime" label="开始时间" min-width="100" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.beginTime | formatDate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="endTime" label="结束时间" min-width="100" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.endTime | formatDate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="targetClassIds" label="班级" align="center">
                    <template slot-scope="scope">
                        <span>
                          {{ scope.row.targetClassIds == null?'0个班级':scope.row.targetClassIds.split(',').length + '个班级' }}
                        </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="createTime" label="添加时间" min-width="100" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.createTime | formatDate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                  <el-table-column label="管理操作" align="center">
                    <template slot-scope="scope">
                      <el-button  @click="skip('editfixedscreen',scope.row.screenId)" class="editbtn" v-hasButton name="memberscreenlist:edit"></el-button>
                      <el-button @click="handleDelete(scope.$index, scope.row)" class="deletebtn" v-hasButton name="memberscreenlist:delete"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <pageHtml :tabObj.sync='screenData2' name="getFixedScreenList" :searchsKey="keywordsVal"></pageHtml>
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
import { getScreenList, delFixedScreen, getFixedScreenList, getClassList } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      activeName: "first",
      screenData2: [],
      //获取列表
      screenData: [],
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
      value: "全部年级",
      //关键字过滤条件
      keywordsVal: "",
      //班级条件
      classId: '',
      targetClassId: [],
      keys: "",
      keyVal: [],
      options: [
        {
          value: "1",
          label: "一年级"
        },
        {
          value: "选项2",
          label: "双皮奶"
        }
      ],
      value: ""
    };
  },
  mounted() {
    var that = this;
    //获取列表
    this.getFixedScreenListFun()
    //获取班级列表
    getClassList({ pageSize: 60 }).then(res => {
      if (res.data.code == 200) {
        that.classList = res.data.data.list;
      }
    });
    //获取获取轮播页列表
    getScreenList().then(res => {
      if (res.data.code == 200) {
        that.screenData = res.data.data
      }
      console.log("that.screenData",that.screenData)
    });
   
  },
  methods: {
    getFixedScreenListFun(val) {
      var that = this
      // that.screenData2 = []
      getFixedScreenList({ 
        pageSize: 15,
        keyword: val
      }).then(res => {
        if (res.data.code == 200) {
          if(res.data.data != null){
            that.screenData2 = res.data.data;
          }else{
            that.screenData2 = []
          }
          console.log("nd", that.screenData2);
        }
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delFixedScreen({
          id: row.screenId
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            this.getFixedScreenListFun()
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
      if(tab.label == '占屏记录') {
        
      }else{
        
      }
    },
    skip(type, param) {
      var that = this
      console.log('param',param)
      this.$router.push({
        name: type,
        params: {
          id: param,
          activeName: that.activeName,
        },
        query: {
          id: param,
          activeName: that.activeName,
        }
      });
    },
    keyWordsInput(val) {
      console.log(val);
      this.screenData2 = [];
      var that = this;
      //获取資訊列表
      //获取列表
      getFixedScreenList({ 
        keyword: val
      }).then(res => {
        if (res.data.code == 200) { 
          console.log("gfdg", res.data.data);  
          if(res.data.data != null){
            that.screenData2 = res.data.data;
          }        
          console.log("nd", that.screenData2);
        }
      });
    },
    //清空
    clear() {
      this.screenData2 = [];
      this.value = '';
      this.keywordsVal = ''
      
    },
    //刷新
    refresh() {
      location.reload();
    },
  },
  watch: {
    activeName(nv,v) {
      console.log(nv)
    }
  },
  components: { Header }
};
</script>
