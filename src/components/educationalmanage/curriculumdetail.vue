<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/curriculumlist">课程表管理</el-breadcrumb-item>
          <el-breadcrumb-item>查看</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.go(-1)">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo">
          <div style="width:60%;margin:auto;">
      <template>
            <el-table :data="tableData"  border  style="width: 100%">
              <el-table-column prop="nodeNumber" label="节次"  width="80"></el-table-column>
              <el-table-column prop="monday" label="星期一"></el-table-column>
              <el-table-column prop="tuesday" label="星期二"></el-table-column>
              <el-table-column prop="wednesday" label="星期三"></el-table-column>
              <el-table-column prop="thursday" label="星期四"></el-table-column>
              <el-table-column prop="friday" label="星期五"></el-table-column>
            </el-table>
     </template>
          </div>
      </div>
    </main>
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
</style>
<style>
 .el-table {
  color: #202020;
  border: 1px solid #7d7d7d;
  text-align: center;
}
.el-table th {
  background: #ffde2a !important;
  color: #202020;
  border-bottom: 1px solid #7d7d7d !important;
  border-right: 0;
  text-align: center;
}
.el-table td {
  border-right: 1px solid #7d7d7d;
  border-bottom: 1px solid #7d7d7d;
}
.el-table_1_column_1 {
  border-bottom: 0 !important;
}
</style>

<script>
import Header from "@/components/publicTemplate/Header";
import { getCurriculumDetail } from "@/api/api.js";

export default {
  data() {
    return {
         curriculumId: 0,
         tableData: []
    };
  },
  methods: {
    skip(type, param) {
      this.$router.push({
        name: type
      });
    }
  },
   mounted() {
    this.curriculumId = this.$route.params.id;
    if (this.curriculumId > 0) {
      getCurriculumDetail({ id: this.curriculumId }).then(res => {
        var obj = res.data.data.detail;
        this.tableData = obj;
      });
    }
  },
  components: { Header }
};
</script>
