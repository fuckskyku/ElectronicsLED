<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">成长乐园</el-breadcrumb-item>
          <el-breadcrumb-item>知识点管理</el-breadcrumb-item>
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
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editmotto',0)" v-hasButton name="membermottolist:edit">新增知识点</el-button>
                            <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button>
                          <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button>
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="mottoData.list==null?[]:mottoData.list" style="width: 100%">
                          <el-table-column prop="mottoContent" :show-overflow-tooltip="true" label="知识点内容" min-width="100" align="center"></el-table-column>
                          <el-table-column prop="author" label="作者" align="center"></el-table-column>
                          <el-table-column prop="targetClassIds" label="通知班级数量" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.targetClassIds | total(scope.row.targetClassIds) }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="mottoTypeName" label="类型" align="center"></el-table-column>
                          <el-table-column prop="createDate" label="发布时间" align="center">
                            <template slot-scope="scope">
                              <span>{{ scope.row.createDate | formatDate }}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="statusName" label="状态" align="center">
                            <template slot-scope="scope">
                              <span>{{scope.row.statusName != ''?statusName:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editmotto',scope.row.mottoId)" class="editbtn" v-hasButton name="membermottolist:edit"></el-button>
                              <el-button @click="handleDelete(scope.$index, scope.row)" class="deletebtn"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='mottoData' name="getMottoList" :searchsKey="keywordsVal"></pageHtml>
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
import { getMottoList, delMotto, getClassList } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  filters:  {
    formatDate(time) {  //时间过滤
      var  time  =  time  *  1000
      var  date  =  new  Date(time);
      return  formatDate(date,  'yyyy-MM-dd  hh:mm:ss');
    },
    total(str) {  //班级数量过滤
      if(str != '' || str != null){
        var num = str.substring(
          0,
          str.length - 1
        );
        str = str.split(",");
        return `${str.length}个班级`
      }else{
        return `0个班级`
      }
    }
  },
  data() {
    return {
      mottoData: [],
      
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
    //获取班级活动列表
    getMottoList({ 
      classId: parseInt(that.classId),
      keyword: ""     
    }).then(res => {
      if (res.data.code == 200) {
        if (res.data.data != null) {
          that.mottoData = res.data.data;
          console.log(that.mottoData);
        }
      }
    });
    //获取班级列表
    getClassList({ pageSize: 60 }).then(res => {
      if (res.data.code == 200) {
        console.log("nianji", res.data.data.list);
        that.classList = res.data.data.list;
       
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
          delMotto({
            id: row.mottoId
          }).then(res => {
            if (res.data.code == 200) {
              _this.mottoData.splice(index, 1);
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
        this.mottoData = [];
        //获取班级活动列表
        getMottoList({
          pageSize: 15,
          classId: parseInt(that.classId)
        }).then(res => {
          if (res.data.code == 200) {
            if (res.data.data !== null) {
              that.mottoData = res.data.data;
              console.log(that.mottoData);
            }
          }
        });
      }else{
        getMottoList({
          pageSize: 10
        }).then(res => {
          if (res.data.code == 200) {
            if (res.data.data != null) {
              that.mottoData = res.data.data;
              console.log(that.mottoData);
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
      this.mottoData = [];
      var that = this;
      //获取班级活动列表
      getMottoList({
        pageSize: 10,
        keyword: val,
        classId: parseInt(that.classId)
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            that.mottoData = res.data.data;
            console.log(that.mottoData);
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
      this.mottoData = [];
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