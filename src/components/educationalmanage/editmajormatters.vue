<template>
  <div id="app">
    <main>
      
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/majormatterslist">重大事件倒计时</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'majormatterslist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules"> 
          <el-form-item label="标题:"  prop="title">
            <el-input v-model="form.title" size="small"></el-input>
          </el-form-item>
          <el-form-item label="结束时间:"  prop="endTime">
            <el-date-picker   v-model="form.endTime"   type="datetime"   placeholder="选择日期时间"></el-date-picker>
            
          </el-form-item>
           <el-form-item label="通知班级:">
                  <el-tree  v-model="form.TargetClassIds"  :default-expanded-keys="[0]"
                        :data="classInfo"  show-checkbox  node-key="id" ref="tree" highlight-current :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="标语:">
            <el-input type="textarea" :rows="8" v-model="form.remark"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="membermajormatterslist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('majormatterslist')">取消</el-button>
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
import { parseDate } from "@/util/date.js";
import {formatDate} from '../../common/time/date.js';
import {
  getMajormattersDetail,
  editMajormatters,
  getClassTree
} from "@/api/api";

export default {
  data() {
    return {
      form: {
        id: "",
        title: "",
        endTime: "",
        remark: ""
      },
      rules: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        endTime: [
          { required: true, message: "请填写结束时间", trigger: "blur" }
        ]
      },
      classInfo: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  methods: {
    //获取时间戳
    formatDate(time) {
      var time = time * 1000
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          //获取班级树ID
          var keys = this.$refs.tree.getCheckedKeys();
          var newTargetClassIds = "";
          keys.map((item, index) => {
            if (item.indexOf("g") == -1 && item!=0) {
              newTargetClassIds += item + ",";
            }
          });
          if(newTargetClassIds!='')
             newTargetClassIds=newTargetClassIds.substring(0,newTargetClassIds.length-1);
             
          editMajormatters({
            Id: this.form.id,
            Title: this.form.title,
            Remark: this.form.remark,
            EndTime: new Date(this.form.endTime).getTime() / 1000,
            TargetClassIds: newTargetClassIds
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("majormatterslist");
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
    skip(type, param) {
      this.$router.push({
        name: type
      });
    }
  },
  mounted() {
    var that = this;
    this.id = this.$route.params.id;
    getClassTree().then(res => {
      if (res.data.code == 200) {
        that.classInfo = [res.data.data];
        console.log(that.classInfo);
      }
    });


    //设置班级树
    if (this.id > 0) {
      getMajormattersDetail({ id: this.id }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        this.form.endTime = that.formatDate(obj.endTime);
        var arr=[]
        if(obj.targetClassIds!=''){
          obj.targetClassIds.split(',').map((item, index) => {
             arr.push(eval(item))
          });
           this.$refs.tree.setCheckedKeys(arr);
        }
      });
    }
  },
  components: { Header }
};
</script>
