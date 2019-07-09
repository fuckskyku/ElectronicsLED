<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">成长乐园</el-breadcrumb-item>
          <el-breadcrumb-item>校园风采</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'releaseindex'})">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
          <div class="tabelmain">
              <el-container>
                  <el-header style="height:auto;">
                    <el-row :gutter="20" class="searchcontent">                  
                      <el-select v-model="value" @change="classSelect(value)" clearable placeholder="全部班级">
                        <el-option v-for="item in classList" :key="item.classId" :label="item.className" :value="item.className"></el-option>
                      </el-select>
                      <el-input clearable placeholder="请输入关键词" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                        <span style="float:right;">                           
                          <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editglory',0)" v-hasButton name="memberglorylist:edit">新增校园风采</el-button>
                          <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                          <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                      </span>
                    </el-row>
                  </el-header>
                 <el-main>
                      <el-table :data="gloryData.list==null?[]:gloryData.list" style="width: 100%">
                          <el-table-column prop="gloryTitle" label="标题" :show-overflow-tooltip="true" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="gloryTypeName" label="类型" align="center"></el-table-column>
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
                          <el-table-column prop="statusName" label="状态" align="center"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editglory',scope.row.gloryId)" class="editbtn" v-hasButton name="memberglorylist:edit"></el-button>
                              <el-button @click="handleDelete(scope.$index, scope.row)" class="deletebtn" v-hasButton name="memberglorylist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='gloryData' name="getGloryList" :searchsKey="keywordsVal"></pageHtml>
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
import { getGloryList, delGlory, getClassList } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      gloryData: [],
      
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
    //获取相册列表
    getGloryList({ 
      classId: parseInt(that.classId),
      keyword: ""     
    }).then(res => {
      if (res.data.code == 200) {
        if(res.data.data != null){
          that.gloryData = res.data.data;
        }
        
        console.log("nd", that.gloryData);
      }
    });
    //获取班级列表
    getClassList({ pageSize: 60 }).then(res => {
      if (res.data.code == 200) {
        that.classList = res.data.data.list;
        res.data.data.list.forEach( (item,index) =>{
         
        })
      }
    });
  },
  methods: {
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
          delGlory({
            id: row.gloryId
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
        this.gloryData = [];
        //获取列表
        getGloryList({
          pageSize: 15,
          classId: parseInt(that.classId)
        }).then(res => {
          if (res.data.code == 200) {
            if (res.data.data != null) {
              that.gloryData  = res.data.data;
              console.log(that.gloryData);
            }
          }
        });
      }else{
        getGloryList({
          pageSize: 15
        }).then(res => {
          if (res.data.code == 200) {
            if (res.data.data != null) {
              that.gloryData = res.data.data;
              console.log(that.gloryData);
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
      this.gloryData = [];
      var that = this;
      //获取資訊列表
      getGloryList({
        pageSize: 15,
        keyword: val,
        classId: parseInt(that.classId)
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            that.gloryData = res.data.data;
            console.log(that.gloryData);
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
      this.gloryData = [];
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