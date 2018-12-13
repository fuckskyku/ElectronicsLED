<template>
  <div id="app">
    <main>
      
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/schedulelist">作息表管理</el-breadcrumb-item>
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
              <el-table-column prop="begintime" label="午别"  width="80"  :formatter="typeFormatter">
              </el-table-column>
              <el-table-column prop="name" label="内容"></el-table-column>
              <el-table-column prop="begintime" label="时间">
                  <template slot-scope="scope">
                                  <span>
                                     {{scope.row.begintime + "-" + scope.row.endtime}}</span>
                             </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注"></el-table-column>
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
  background: #ffde2a;
  color: #202020;
  border-right: 0;
  text-align: center;
}
.el-table th {
  border-bottom: 1px solid #7d7d7d !important;
}
.el-table td {
  border-right: 1px solid #7d7d7d;
  border-bottom: 1px solid #7d7d7d;
}
.el-table_1_column_1 {
  background: #ffde2a;
  border-bottom: 0 !important;
}
</style>

<script>
import Header from "@/components/publicTemplate/Header";
import { getScheduleDetail } from "@/api/api.js";

export default {
  data() {
    return {
      scheduleId: 0,
      tableData: []
    };
  },
  methods: {
    skip(type, param) {
      this.$router.push({
        name: type
      });
    },
    typeFormatter: function(type, param) {
      if (type.begintime != "") {
        return parseInt(type.begintime.split(",")[0]) > 13 ? "下午" : "上午";
      } else return "";
    }
  },
  mounted() {
    this.scheduleId = this.$route.params.id;
    console.log(this.$route.params.id);
    if (this.scheduleId > 0) {
      getScheduleDetail({ id: this.scheduleId }).then(res => {
        var obj = res.data.data.detail;
        this.tableData = obj;
      });
    }
  },
  components: { Header }
};
</script>
