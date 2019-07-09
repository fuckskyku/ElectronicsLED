<template>
	<div id="app">
		<main>
          
          <el-aside class="nav"  style="width:90%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
             <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
             <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
             <el-breadcrumb-item to="/basesettingindex">账号管理</el-breadcrumb-item>
             <el-breadcrumb-item>用户管理</el-breadcrumb-item>
             </el-breadcrumb>
            <div class="goback" @click="$router.push({name: 'basesettingindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
           <div class="tabelmain">
              <el-container>
                 <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">
                        <el-input  placeholder="请输入用户名或手机号" @input="keyWordsInput(keywordsVal)" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                         <span style="float:right;">  
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('edituser',0)"  v-hasButton name="memberuserlist:edit">新增用户</el-button>
                        <!-- <el-button type="primary" @click="clear" round icon="el-icon-delete">清空</el-button> -->
                        <!-- <el-button type="primary" @click="refresh" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="userData.list==null?[]:userData.list" style="width: 100%">
                          <el-table-column prop="userName" label="用户名" min-width="90" align="center"></el-table-column>
                          <el-table-column prop="nickName" label="昵称" min-width="90" align="center"></el-table-column>
                          <el-table-column prop="dutyName" label="职务" min-width="90" align="center"></el-table-column>
                          <el-table-column prop="mobile" label="手机号" min-width="110" align="center"></el-table-column>
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('edituser',scope.row.uid)" class="editbtn" v-hasButton name="memberuserlist:edit"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='userData' name="getUserList" :searchsKey="keywordsVal"></pageHtml>
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
<script>
import Header from "@/components/publicTemplate/Header";
import { getUserList } from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      //获取通知列表
      userData: [],
      //关键字过滤条件
      keywordsVal: "",
      keys: "",
      keyVal: []
    };
  },
  created() {
    this.init();
  },
  mounted() {
    var that = this;
    //获取通知列表
    getUserList({ 
      keyword: ""
    }).then(res => {
      if (res.data.code == 200) {
        if(res.data.data != null){
          that.userData = res.data.data;
        }
       
      }
    });
    
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
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
    keyWordsInput(val) {
      console.log(val);
      if(this.value == ''){
        this.classId = ''
      }
      this.userData = [];
      var that = this;
      //获取通知列表
      getUserList({
        pageSize: 15,
        keyword: val,
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            that.userData = res.data.data
            console.log(that.userData);
          }
        }
      });
    },
    //清空
    clear() {
      this.userData = [];
      this.value = '';
      this.keywordsVal = ''
    },
    //刷新
    refresh() {
      location.reload();
    },
    init() {
      this.userData = [];
      this.value = "";
      this.keywordsVal = "";
      
    }
  },
  watch: {
    keywordsVal(val, oldVal) {
      console.log("new", val, "old", oldVal);
    }
  },
  components: { Header }
};
</script>