<template>
	<div id="app">
		<main>
          <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
              <el-breadcrumb-item to="/basesettingindex">学校资源管理</el-breadcrumb-item>
              <el-breadcrumb-item>设备管理</el-breadcrumb-item>
             </el-breadcrumb>
              <div class="goback" @click="$router.push({name: 'basesettingindex'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
             
          </el-aside>
           <div class="tabelmain">
              <el-container>
                 <el-header style="height:auto;">
                     <el-row :gutter="20" class="searchcontent">            
                             <el-select v-model="value" placeholder="请选择" @change="currentSel">
                                    <el-option v-for="item in options" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                            </el-select>
                            <el-input  placeholder="请输入mac地址" clearable @change="keyWordsInput" v-model="keywordsVal" suffix-icon="el-icon-search" style="width:230px;"></el-input>
                        <span style="float:right;">                                 
                            <el-button type="primary" round icon="iconfont icon-zengjia"  @click="skip('editdevice',0)" v-hasButton name="memberclientlist:edit">新增设备</el-button>
                            <!-- <el-button type="primary" round icon="el-icon-delete" @click="keyWordsInput('')">清空</el-button> -->
                            <!-- <el-button type="primary" round icon="el-icon-refresh">刷新</el-button> -->
                        </span>
                     </el-row>
                 </el-header>
                 <el-main>
                      <el-table :data="tableData.list==null?[]:tableData.list" style="width: 100%" :header-cell-style="{textAlign:'center'}" 
                        :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"  :row-style="{height:'55px'}">
                          <el-table-column prop="linkstatus" label="链接状态" align="center">
                             <template slot-scope="scope">
                               <img :src="scope.row.linkState==true?'/static/img/ylj.png':'/static/img/wlj.png'"  alt="" style="width: 20px;height: 20px">
                             </template>
                          </el-table-column>
                          <el-table-column prop="roomName" label="绑定教室"></el-table-column>
                          <el-table-column prop="className" label="班级">
                            <template slot-scope="scope">
                              <span>{{scope.row.className != null?scope.row.className:'无'}}</span>
                            </template>
                          </el-table-column>
                          <el-table-column prop="mac" label="MAC地址"></el-table-column>
                          <el-table-column prop="osInfo" label="操作系统"></el-table-column>
                          <el-table-column prop="pageShowTime" label="轮播时间"> 
                            <template slot-scope="scope">
                              <span>{{scope.row.pageShowTime != null?scope.row.pageShowTime/1000+"秒":'无'}}</span>
                            </template>
                          </el-table-column>
                          <!-- <el-table-column prop="isCarousel" label="占屏轮播图片">
                             <template slot-scope="scope">
                                 <span style="margin-left: 10px">
                                     {{scope.row.isCarousel==true?"开启":"关闭"}}
                                 </span>
                             </template>
                          </el-table-column> -->
                          <el-table-column prop="timingSwitch" label="自动开关机">
                              <template slot-scope="scope">
                                 <span style="margin-left: 10px">
                                     {{scope.row.timingSwitch==true?"开启":"关闭"}}
                                 </span>
                              </template>  
                          </el-table-column>                          
                          <el-table-column label="管理操作" align="center">
                            <template slot-scope="scope">
                              <el-button  @click="skip('editdevice',scope.row.clientId)" class="editbtn" v-hasButton name="memberclientlist:edit"></el-button>
                              <el-button @click="delClient(scope.$index, scope.row)" class="unbindbtn" v-hasButton name="memberclientlist:delete"></el-button>
                            </template>
                          </el-table-column>
                      </el-table>
                      <pageHtml :tabObj.sync='tableData' name="getClientList" :searchsKey="keywordsVal"></pageHtml>
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
//接口获取设备列表
import { getClientList, delClient, getClassList } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
      options: [],
      value: ""
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
      getClientList({
        keyword: this.keywordsVal,
        classId: this.classId,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            this.tableData = res.data.data;
          }else
            this.tableData=[]
        }
        console.log('this.tableData',this.tableData)
      });
    },
    delClient(index, row) {
      let _this = this;
      this.$confirm("此操作将解除班级与班牌的绑定, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delClient({
            id: row.clientId
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "解绑成功!"
              });
              this.getList();
            } else {
              this.$message({
                type: "success",
                message: res.data.message
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消解绑"
          });
        });
    },
    skip(type, param) {
      this.$router.push({
        path: "/editdevice/?id=" + param,
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