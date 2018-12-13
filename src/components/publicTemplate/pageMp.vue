<template>
  <div class="PageDiv">
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNumber" 
              :page-sizes="[10, 20, 40,60,80,100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount"></el-pagination>
  </div>
</template>
<script>
import * as tabApi from "@/api/api";
export default {
  // ['tabObj', 'name', 'type', 'otherType','keywords'],
  props: {
    tabObj: { default: null }, //表格数据
    name: { default: null }, //接口名称
    type: { default: null }, //筛选过滤类型
    typeTwo: { default: null }, //筛选过滤类型第二个
    otherType: { default: null }, //其他过滤参数
    keywords: { default: null }, //多个关键字过滤搜索
    searchsKey: { default: null }, //单个关键字搜索  或者 可以使用他使用多个筛选过滤条件
    edit: { default: false } //是否对返回数据进行添加状态控制
  },
  data() {
    return {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      tableData: [],
      //筛选过滤条件参数
      selectType: "",
      selectTypeTwo: "",
      //关键字过滤条件
      keywordsVal: "",
      //多个关键字过滤条件
      searchsVal: ""
    };
  },

  watch: {
    tabObj(val) {
      if(val==null){
         this.totalCount = 0;
         this.tableData = [];
      }else{
         this.totalCount = val.totalcount;
         this.tableData = val.list;
      }
    },
    type(val) {
      this.selectType = val;
    },
    typeTwo(val) {
      this.selectTypeTwo = val;
    },
    keywords(val) {
      this.keywordsVal = val;
    },
    searchsKey(val) {
      this.searchsVal = val;
    }
  },
  methods: {
    //     //分页事件
    handleSizeChange(val) {
      tabApi[this.name]({
        pageSize: val,
        pageNumber: this.pageNumber,
        //筛选过滤参数
        newsStyleType: this.selectType ? this.selectType : this.selectTypeTwo,
        title: this.keywordsVal,
        sex: this.selectType ? this.selectType : this.selectTypeTwo,
        idStatus: this.selectType ? this.selectType : this.selectTypeTwo,
        auditStatus: this.selectType ? this.selectType : this.selectTypeTwo,
        checkStatus: this.selectType ? this.selectType : this.selectTypeTwo,
        //多个关键字筛选条件
        searchWord: this.searchsVal ? this.selectType : this.selectTypeTwo,
        //其他参数(考勤分页其他参数))
        startDate:
          this.otherType && this.otherType[0] ? this.otherType[0] : null,
        endDate: this.otherType && this.otherType[1] ? this.otherType[1] : null,
        //其他参数(考勤详情分页其他参数和过滤参数)
        checkDate:
          this.otherType && this.otherType.checkDate
            ? this.otherType.checkDate
            : null,
        attendanceTimeType:
          this.otherType && this.otherType.attendanceTimeType
            ? this.otherType.attendanceTimeType
            : null
      }).then(res => {
        if (res.data.code == 200) {
          if (!this.edit) {          
            this.tableData = res.data.data;
          } else {
            res.data.data.data.forEach(item => {
              item.hoverShow = false;
            });
            this.tableData = res.data.data;
          }

          this.$emit("update:tabObj", this.tableData);
        }
      });
      this.pageSize = val;
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      let _this=this;
      tabApi[this.name]({
        pageSize: this.pageSize,
        pageNumber: val,
        //多个关键字筛选条件
        searchWord: this.searchsVal,
        //其他参数
        checkDate: this.otherType ? this.otherType.checkDate : null,
        attendanceTimeType: this.otherType
          ? this.otherType.attendanceTimeType
          : null
      }).then(res => {
        console.log(res.data.code);
        if (res.data.code == 200) {
          _this.tableData = res.data.data;
          this.$emit("update:tabObj", _this.tableData);
        }
      });
      _this.pageNumber = val;
      // console.log(`当前页: ${val}`)
    }
  }
};
</script>

<style>
</style>
