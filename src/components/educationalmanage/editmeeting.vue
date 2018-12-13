<template>
  <div id="app">
    <main>
      
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/educationindex">教务管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/meetinglist">会议管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'meetinglist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
      </el-aside>
      <div class="editInfo dateTime">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="会议主题:"  prop="meetingTitle">
            <el-input v-model="form.meetingTitle" size="small"></el-input>
          </el-form-item>
          <el-form-item label="会议时间:"  prop="meetingTime">
            <el-input v-model="form.meetingTime" size="small"></el-input>
            <div style="color:#999;"><i class="el-icon-warning"></i><span>例如：2017年10月10日14:00:00 -- 2017年10月10日18:00:00</span></div>
          </el-form-item>
           <el-form-item label="人员:"  prop="meetingMembers">
            <el-input v-model="form.meetingMembers" size="small"></el-input>
          </el-form-item>
           <el-form-item label="地址:" prop="meetingAddress">
            <el-input v-model="form.meetingAddress" size="small"></el-input>
          </el-form-item>
          <el-form-item label="显示时间:" required>
            <el-col :span="9">
              <el-form-item prop="showBeginTime" style="display: inline;">
               <el-date-picker  v-model="form.showBeginTime"  type="datetime" placeholder="选择日期时间"></el-date-picker>
              </el-form-item>
            </el-col> 
            <el-col class="line" :span="2"></el-col> 
            <el-col :span="9">
              <el-form-item prop="showEndTime" style="display: inline;">
                <el-date-picker  v-model="form.showEndTime"  type="datetime" placeholder="选择日期时间"></el-date-picker>
              </el-form-item>
            </el-col>  
                
          </el-form-item>
          <el-form-item label="适用年级:">
             <el-tree  v-model="form.TargetClassIds"  :default-expanded-keys="[0]"
                        :data="classInfo"  show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="内容:">
            <template>
              <quill-editor v-model="form.meetingContent" ref="myQuillEditor" :options="editorOption" 
                            @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                            @change="onEditorChange($event)">
              </quill-editor>
            </template> 
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="membermeetinglist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('meetinglist')">取消</el-button>
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
import { quillEditor } from "vue-quill-editor";
import { quillRedefine } from "vue-quill-editor-upload";
import global_ from "@/components/tool/Global";
import Header from "@/components/publicTemplate/Header";
import { formatDate } from "../../common/time/date.js";
import { getMeetingDetail, editMeeting, getClassTree, getQiniuToken } from "@/api/api";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      meetingId: "",
      form: {},
      rules: {
        meetingTitle: [
          { required: true, message: "请填写会议主题", trigger: "blur" }
        ],
        meetingTime: [
          { required: true, message: "请填写会议时间", trigger: "blur" }
        ],
        meetingMembers: [
          { required: true, message: "请填写人员", trigger: "blur" }
        ],
        meetingAddress: [
          { required: true, message: "请填写地址", trigger: "blur" }
        ],
        showBeginTime: [
          { required: true, message: "请填写开始显示时间", trigger: "blur" }
        ],
        showEndTime: [
          { required: true, message: "请填写结束显示时间", trigger: "blur" }
        ],
      },
      qiniuToken: "",
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      mottoData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      classInfo: [],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  created() {
    getQiniuToken().then(res => {
      this.mottoData.token = res.data.data.token;
      this.qiniuToken = res.data.data.token;
    });
    var that=this;
    this.editorOption = quillRedefine({
      // 图片上传的设置
      uploadConfig: {
        action: this.uploadQiniuUrl, // 必填参数 图片上传地址
        res: respnse => {
          return that.imageQiniuUrl + respnse.key;
        },
        header: (xhr, formData) => {
          formData.append("token", that.mottoData.token);
          formData.append("key", new Date().getTime());
        },
        name: "file", // 图片上传参数名,
        accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon" // 可选参数 可上传的图片格式
      },
      // 以下所有设置都和vue-quill-editor本身所对应
      placeholder: '请输入内容', // 可选参数 富文本框内的提示语
      theme: 'snow', // 可选参数 富文本编辑器的风格
      toolOptions: [
        ["bold", "italic", "underline", "strike", "image"],
        [{ color: [] }, { background: [] }],
        ['clean']
      ], // 可选参数  选择工具栏的需要哪些功能  默认是全部
      handlers: {} // 可选参数 重定义的事件，比如link等事件
    });
  },
  methods: {
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },
    onSubmit(form) {
      console.log(1);
      //这里执行ajax
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
          if (newTargetClassIds != "")
            newTargetClassIds = newTargetClassIds.substring(
              0,
              newTargetClassIds.length - 1
            );

          editMeeting({
            MeetingId: this.meetingId,
            MeetingTitle: this.form.meetingTitle,
            MeetingTime: this.form.meetingTime,
            MeetingAddress: this.form.meetingAddress,
            MeetingMembers: this.form.meetingMembers,
            MeetingContent: this.form.meetingContent,
            ShowBeginTime: Math.floor(
              new Date(this.form.showBeginTime).getTime() / 1000
            ),
            ShowEndTime: Math.floor(
              new Date(this.form.showEndTime).getTime() / 1000
            ),
            TargetClassIds: newTargetClassIds //投放班级ID
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              // console.log(res.data.data)
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("meetinglist");
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
    getClassTree().then(res => {
      let that = this;
      if (res.data.code == 200) {
        that.classInfo = [res.data.data];
        console.log(that.classInfo);
      }
    });

    this.meetingId = this.$route.params.id;
    if (this.meetingId > 0) {
      getMeetingDetail({ id: this.meetingId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        this.form.showBeginTime = this.formatDate(obj.showBeginTime);
        this.form.showEndTime = this.formatDate(obj.showEndTime);

        var arr = [];
        if (obj.targetClassIds != "") {
          obj.targetClassIds.split(",").map((item, index) => {
            arr.push(eval(item));
          });
          this.$refs.tree.setCheckedKeys(arr);
        }
      });
    }
    
  },
  components: { Header }
};
</script>
