<template>
	<div id="app">
		<main>
          
          <el-aside class="nav"  style="width:90%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/examinationroomlist">考试管理</el-breadcrumb-item>
          <el-breadcrumb-item>设置考场信息</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: 'examinationroomlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">   
                            <el-input clearable placeholder="请输入考场名称" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">      
                           <el-button type="primary" round icon="el-icon-upload"><a href="/static/uploads/template/考生模板.xls" style="color:#000;text-decoration: none;" target="_blank">下载考生模板</a></el-button>                      
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip2('editexaminationroomdetail',0)" v-hasButton name="memberexaminationroomlist:view">新增考场信息</el-button>
                            <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                            <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                            <el-button type="primary" round icon="iconfont icon-returnfanhuizuo"  @click="skip('examinationroomlist')">返回</el-button>
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="testData" style="width: 100%">
                          <el-table-column prop="examroomName" label="考试名称" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="className" label="考场地址" align="center"></el-table-column>
                          <el-table-column prop="examTeacher" label="监考老师" align="center"></el-table-column>             
                          <el-table-column label="参考人员" align="center">
                           <template slot-scope="scope">   
                                        <a @click="download(scope.row.xlsPath)" target="_blank">查看</a> 
                               </template>    
                          </el-table-column>         
                          <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>     
                         <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip2('editexaminationroomdetail',scope.row.id)" class="editbtn" v-hasButton name="memberexaminationroomlist:edit"></el-button>
                              <el-button @click="handleDelete(scope.$index, scope.row)" class="deletebtn" v-hasButton name="memberexaminationroomlist:delete"></el-button>
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
@import "../../common/fonts/import/iconfont.css";

</style>
<script>
import Header from "@/components/publicTemplate/Header";
import { getExamRoomList, getExamRoomDetail, delExamRoom } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      //考试Id
      examroomId: "",
      //关键字过滤条件
      keywordsVal: "",
      testData: [],
      //参考人员
      examinee: ""
    };
  },
  mounted() {
    this.examroomId = this.$route.params.roomid;
    var that = this;
    //获取考试列表
    getExamRoomList({
      examId: this.examroomId,
      pageSize: 15
    }).then(res => {
      if (res.data.code == 200) {
        if (res.data.data !== null) {
          res.data.data.list.forEach(item => {
            //时间戳
            item.createTime = this.timestampToTime(item.createTime);
          });
          that.testData = res.data.data.list;
          
          // console.log(that.testData);
        }
      }
    });
  },
  methods: {
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D = date.getDate() + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    skip(type, param) {
      this.$router.push({
        name: type,
        params: {
          id: param
        },
        query: {
          roomid: this.examroomId
        }
      });
    },
    skip2(type, param) {
      this.$router.push({
        name: type,
        params: {
          roomid: this.examroomId,
          id: param
        }
      });
    },
    download(path) {
      if (path != "") {
        location.href = path;
      }
    },
    too(row) {
      getExamRoomDetail({
        id: row.id //考试ID
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data !== null) {
            this.examinee = res.data.data.xlsPath;
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
        delExamRoom({
          id: row.id
        }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
            location.reload();
          } else {
            this.$message({
              type: "success",
              message: res.data.message
            });
          }
        });
      });
    },
    keyWordsInput(val) {
      console.log(val);
      this.testData = [];
      var that = this;
      //获取考试列表
      getExamRoomList({
        pageSize: 15,
        keyword: val
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data !== null) {
            that.testData = res.data.data.list;
            res.data.data.list.forEach(item => {
              item.createTime = this.timestampToTime(item.createTime);
            });           
            console.log(that.testData);
          }
        }
      });
    },
    //清空
    clear() {
      this.testData = [];
      this.value = "";
      this.keywordsVal = "";
    },
    //刷新
    refresh() {
      location.reload();
    }
  },
  components: { Header }
};
</script>