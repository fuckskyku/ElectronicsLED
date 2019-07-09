<template>
  <div id="classlist">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">行政管理</el-breadcrumb-item>
          <el-breadcrumb-item>班级管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div class="tabelmain">
        <el-container>
          <el-header style="height:auto;">
            <el-row :gutter="20" class="searchcontent">
              <el-input
                placeholder="请输入班级名称(回车进行搜索)"
                @change="keyWordsInput"
                v-model="keywordsVal"
                suffix-icon="el-icon-search"
                style="width:240px;"
              ></el-input>
              <span style="float:right;">
                <!-- <el-button type="primary" round icon="iconfont icon-daoru"  @click="skip('importclass',0)">批量导入班级</el-button> -->
                <el-button type="primary" round icon="iconfont icon-daoru" @click="open">批量导入班级</el-button>
                <el-button
                  type="primary"
                  round
                  icon="iconfont icon-zengjia"
                  @click="skip('editclass',0)"
                  v-hasButton
                  name="memberclasslist:edit"
                >新增班级</el-button>
                <!-- <el-button type="primary" round icon="el-icon-delete" @click="keyWordsInput('')">清空</el-button> -->
                <!-- <el-button type="primary" round icon="el-icon-refresh" @click="keyWordsInput('')">刷新</el-button> -->
              </span>
            </el-row>
          </el-header>
          <el-main>
            <el-table
              :data="tableData.list"
              style="width: 100%"
              :header-cell-style="{textAlign:'center'}"
              :cell-style="{textAlign:'center',color:'#606266',padding:'4px 0'}"
              :row-style="{height:'55px'}"
            >
              <el-table-column prop="gradeName" label="年级"></el-table-column>
              <el-table-column prop="className" label="班级名称"></el-table-column>
              <el-table-column prop="classAliasName" label="班级别名">
                <template slot-scope="scope">
                  <span>{{scope.row.classAliasName != '' ? scope.row.classAliasName : '无'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="roomName" label="绑定教室">
                <template slot-scope="scope">
                  <span>{{scope.row.roomName != null?scope.row.roomName:'无'}}</span>
                </template>
              </el-table-column>
              <el-table-column label="管理操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    @click="skip('editclass',scope.row.classId)"
                    class="editbtn"
                    v-hasButton
                    name="memberclasslist:edit"
                  ></el-button>
                  <el-button
                    @click="deleteClass(scope.$index,scope.row)"
                    class="deletebtn"
                    v-hasButton
                    name="memberclasslist:delete"
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <pageHtml :tabObj.sync="tableData" name="getClassList" :searchsKey="keywordsVal"></pageHtml>
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
//接口获取班级列表
import { getClassList, delClass } from "@/api/api.js";

export default {
  data() {
    return {
      tableData: [],
      //关键字过滤条件
      keywordsVal: "",
      value: ""
    };
  },
  methods: {
    open() {
      this.$message("等待开发");
    },
    //关键字筛选
    keyWordsInput(val) {
      this.keywordsVal = val;
      getClassList({
        keyword: val,
        pageSize: 10
      }).then(res => {
        if (res.data.code == 200) {
          if (res.data.data != null) {
            this.tableData = res.data.data;
            this.tableData.list.forEach(item => {
              item.hoverShow = false;
            });
          } else this.tableData = [];
        }
      });
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    deleteClass(index, row) {
      let _this = this;
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delClass({
            id: row.classId
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              _this.tableData.list.splice(index, 1);
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
            message: "已取消删除"
          });
        });
    },
    skip(type, param) {
      this.$router.push({
        path: "/editclass/?id=" + param,
        name: type,
        params: {
          id: param
        }
      });
    }
  },
  mounted() {
    //表格数据
    getClassList({ pageSize: 10 }).then(res => {
      if (res.data.code == 200) {
        this.tableData = res.data.data;
        console.log(this.tableData);
      }
    });
  },
  components: { Header }
};
</script>