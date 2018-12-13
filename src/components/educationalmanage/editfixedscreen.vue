<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/fixedscreenlist">占屏管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/fixedscreenlist">占屏记录</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'fixedscreenlist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo dateTime">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="标题:" prop="title">
            <el-input v-model="form.title" size="small"></el-input>
          </el-form-item>
           <el-form-item label="页面:">
             <template>
                  <el-select v-model="value" @change="select(value)" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.pageId" :label="item.pageName" :value="item.pageName"></el-option>
                  </el-select>
             </template>
          </el-form-item>
          <el-form-item label="显示时间:" required>
            <el-col :span="9">
              <el-form-item prop="BeginTime" style="display: inline;">
               <el-date-picker  v-model="form.BeginTime" @change="getBegin(form.BeginTime)" type="datetime"  placeholder="起始时间"></el-date-picker>
              </el-form-item>
            </el-col> 
            <el-col class="line" :span="2"></el-col> 
            <el-col :span="9">
              <el-form-item prop="EndTime" style="display: inline;">
                <el-date-picker  v-model="form.EndTime" @change="getEnd(form.EndTime)" :default-value="date2" type="datetime" placeholder="结束时间"></el-date-picker>
              </el-form-item>
            </el-col>  
          </el-form-item>
          <div class="tip"><i class="el-icon-warning"></i><span>例如：2017-10-10 14:00:00 -- 2017-10-10 18:00:00</span></div>
          <el-form-item label="通知班级:">
            <el-tree
              v-model="form.TargetClassIds"
              :data="tree"
              show-checkbox
              :default-expanded-keys="[0]"
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="状态:">
            <el-switch  v-model="form.status" active-text="" @click="form.status = !form.status"
                      inactive-text="" active-color="#FFDE2A"></el-switch>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="memberscreenlist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('fixedscreenlist')">取消</el-button>
          </el-form-item>
        </el-form>
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
import {
  getFixedScreenDetail,
  getFixedScreenList,
  editFixedScreen,
  getScreenList,
  getClassTree
} from "@/api/api.js";
import { formatDate } from "../../common/time/date.js";

export default {
  data() {
    return {
      screenId: "",
      schoolId: "",
      beginTime: "",
      endTime: "",
      date1: '',
      date2: '',
      form: {
        title: "",
        status: false,
        showdate: ["", ""],
        schoolpageid: "",
        TargetClassIds: "",
        BeginTime: "",
        EndTime: ""
      },
      tempTree: {},
      tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      rules: {
        title: [
          { required: true, message: "请填写标题", trigger: "blur" }
        ],
        BeginTime: [
          { required: true, message: "请填写开始显示时间", trigger: "blur" }
        ],
        EndTime: [
          { required: true, message: "请填写结束显示时间", trigger: "blur" }
        ]
      },
      options: [],
      value4: [],
      value: ""
    };
  },
  created() {
    this.getParams();
  },
  mounted() {
    var that = this;
    //获取年级树
    getClassTree({}).then(res => {
      if (res.data.code == 200) {
        that.tree = [res.data.data];
      }
    });

    setTimeout(() => {
      //获取资讯信息
      if (this.screenId > 0) {
        getFixedScreenDetail({ id: this.screenId }).then(res => {
          var obj = res.data.data;
          this.form.title = obj.title
          this.form.schoolpageid = obj.schoolpageid
          this.form.BeginTime = that.formatDate(obj.beginTime);
          this.form.EndTime = that.formatDate(obj.endTime);
          this.form.status = obj.status
          this.form.TargetClassIds = obj.targetClassIds
          this.form.showdate = [];
          this.beginTime = obj.beginTime;
          this.endTime = obj.endTime;
          this.form.showdate.push(this.beginTime, this.endTime);
          this.date1 = new Date(obj.beginTime)
          this.date2 = new Date(obj.endTime)
          console.log('obj',obj)
          //匹配选中班级
          var arr = [];
          if (obj.targetClassIds != "") {
            obj.targetClassIds.split(",").map((item, index) => {
              arr.push(eval(item));
            });
            this.$refs.tree.setCheckedKeys(arr);
          }

          //获取轮播页列表  获取页面选项option
          getScreenList({}).then(res => {
            this.options = res.data.data;
            //显示列表
            this.options.map((item, index) => {
              if (item.schoolpageid == obj.schoolpageid) {
                this.value = item.pageName;
              }
            });
          });
        });
      } else {
        //if结束
        //获取轮播页列表  获取页面选项option
        getScreenList({}).then(res => {
          this.options = res.data.data;
        });
      }
    }, 600);
  },
  methods: {
    getBegin(val) {
      this.beginTime = new Date(val).getTime() / 1000;
    },
    getEnd(val) {
      this.endTime = new Date(val).getTime() / 1000;
    },
    select(val) {
      this.options.map((item, index) => {
        if (item.pageName == val) {
          this.form.schoolpageid = item.schoolpageid;
        }
      });
    },
    onSubmit(form) {
      //新增/编辑通知
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          //获取班级树ID
          var keys = this.$refs.tree.getCheckedKeys();
          var newTargetClassIds = "";
          keys.map((item, index) => {
            if (item.indexOf("g") == -1 && item != 0) {
              newTargetClassIds += item + ",";
            }
          });
          if (newTargetClassIds != "") {
            newTargetClassIds = newTargetClassIds.substring(
              0,
              newTargetClassIds.length - 1
            );
          }
       
          editFixedScreen({
            ScreenId: that.screenId,
            SchoolPageId: that.form.schoolpageid,
            Title: that.form.title,
            BeginTime: that.beginTime,
            EndTime: that.endTime,
            Status: that.form.status,
            TargetClassIds: newTargetClassIds //投放班级ID，多个请用英文逗号隔开
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("fixedscreenlist");
            } else {
              this.$message({
                type: "fail",
                message: res.data.message
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    skip(type, param) {
      this.$router.push({
        name: type
      });
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.params.id;
      // 将数据放在当前组件的数据内
      if (this.$route.query.activeName == "first") {
        this.schoolId = routerParams;
        //获取列表
        getFixedScreenList({}).then(res => {
          if (res.data.code == 200) {
            res.data.data.list.forEach(item => {
              if (item.schoolpageid == this.schoolId) {
                this.screenId = item.screenId;
              } else {
                this.screenId = 0;
              }
            });
          }
        });
      } else {
        this.screenId = routerParams;
      }
    }
  },
  watch: {
    // value4(newVal, val) {
    //   console.log("newVal:",newVal,"val",val)
    //   this.beginTime = new Date(newVal[0]).getTime() / 1000;
    //   this.endTime = new Date(newVal[1]).getTime() / 1000;
    //   console.log("this.beginTime:",this.beginTime,"this.endTime",this.endTime)
      
    // }
  },
  components: { Header }
};
</script>
