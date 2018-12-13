<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">成长乐园</el-breadcrumb-item>
          <el-breadcrumb-item to="/mottolist">知识点管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'mottolist'})">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px">
          <el-form-item label="作者:">
            <el-input v-model="form.author" size="small"></el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <template>
              <el-select v-model="form.mottoTypeName" @change="select(form.mottoTypeName)" placeholder="请选择类型">
                <el-option  v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="班级:">
            <el-tree
              v-model="form.targetClassIds"
              :data="tree"
              show-checkbox
              :default-expanded-keys="[0]"
              node-key="id"
              ref="tree"
              highlight-current
              :props="defaultProps">
            </el-tree>
          </el-form-item>
          <el-form-item label="正文:">
            <template>
              <quill-editor  v-model="form.mottoContent"  ref="myQuillEditor" :options="editorOption"  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                              @change="onEditorChange($event)">
              </quill-editor>
            </template> 
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="membermottolist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('mottolist')">取消</el-button>
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
import { getMottoDetail, editMotto, getClassTree } from "@/api/api";

export default {
  data() {
    return {
      mottoId: "",
      form: {
        mottoId: "",
        author: "",
        mottoContent: "",
        targetClassIds: "",
        mottoTypeName: "",
        mottoType: ""
      },
      tree: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      options: [
        {
          value: 1,
          label: "名人名言",
          mottoType: "1"
        },
        {
          value: 2,
          label: "每日一句",
          mottoType: "2"
        }
      ],
      editorOption: {
        placeholder: "",
        theme: "snow", // or 'bubble'
        placeholder: "您想说点什么？",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"], // toggled buttons
            ["blockquote", "code-block"]
          ]
        }
      },
      value: ""
    };
  },
  created() {
    this.getParams();
    console.log(this.mottoId);
  },
  mounted() {
    var that = this;
    //获取年级树
    getClassTree({}).then(res => {
      if (res.data.code == 200) {
        that.tree = [res.data.data];
        console.log(that.tree);
      }
    });
    //获取通知信息
    if (this.mottoId > 0) {
      getMottoDetail({ id: this.mottoId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        //匹配通知类型
        that.options.forEach(item => {
          if (item.value == obj.mottoType) {
            that.form.mottoTypeName = item.label;
          }
        });
        console.log("pageShowTime:", obj);
        //匹配选中班级
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

  methods: {
    select(val) {
      console.log(val);
      this.options.map(item => {
        console.log(item);
        if (item.value == val) {
          this.form.mottoType = item.value;
          console.log("that.form.mottoType", this.form.mottoType);
        }
      });
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
      // console.log(this);
      //新增/编辑通知
      var that = this;
      this.$refs[form].validate(valid => {
        if (valid) {
          //获取班级树ID
          var keys = this.$refs.tree.getCheckedKeys();
          var newTargetClassIds = "";
          keys.map((item, index) => {
            if (item.indexOf("g") == -1  && item!=0) {
              newTargetClassIds += item + ",";
            }
          });
          if (newTargetClassIds != "") {
            newTargetClassIds = newTargetClassIds.substring(
              0,
              newTargetClassIds.length - 1
            );
          }
          editMotto({
            MottoId: that.mottoId,
            MottoType: that.form.mottoType,
            MottoContent: that.form.mottoContent.replace(/<[^>]+>/g, ""), //去除标签
            Author: that.form.author,
            TargetClassIds: newTargetClassIds //投放班级ID，多个请用英文逗号隔开
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("mottolist");
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
    },
    getParams() {
      // 取到路由带过来的参数
      var routerParams = this.$route.params.id;
      // 将数据放在当前组件的数据内
      this.mottoId = routerParams;
    }
  },
  computed: {
    uploadDisabled: function() {
      return this.imagelist.length > 0;
    }
  },
  components: { Header }
};
</script>
