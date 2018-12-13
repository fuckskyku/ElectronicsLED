<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">发布管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/releaseindex">班级资讯</el-breadcrumb-item>
          <el-breadcrumb-item to="/glorylist">校园风采</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'glorylist'})">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px">
          <el-form-item label="标题:">
            <el-input v-model="form.gloryTitle" size="small"></el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <template>
              <el-select v-model="form.typeName" @change="select(form.typeName)" placeholder="请选择类型">
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
          <el-form-item label="上传图片:" class="up-btn">
            <!-- ************************************************************************* -->
            <div class="upload_btn"  style="margin-bottom: 30px;">
             &nbsp;
            </div>
            <div class="upload-img-item" v-for="(item, index) in details" :key="index">
              <img :src="item.url" class="show-img">
              <div class="handle">
                <div class="positions"> 
                  <span @click="toLeft(details,index,details.length)">左移</span>
                  <span @click="toRight(details,index,details.length)">右移</span>
                </div>
                <span @click="delUpload(item,index)" class="del-img">删除</span>
                </div>
                <el-input type="text" v-model="item.picTitle" placeholder="请添加图片说明" @input="input(item.picTitle,index)" size="small" ></el-input>
                <!--  -->
                
            </div>
            <el-upload  :action="uploadQiniuUrl" list-type="picture" :data="qiniuData"
                        :on-preview="handlePictureCardPreview" 
                        :on-remove="handleRemove"  class="el-upload2"
                        :file-list="imagelist"  :before-upload="beforeAvatarUpload"       
                        :limit="20" :class="{disabled:uploadDisabled}" :on-success="handleAvatarSuccess" :show-file-list="false"
                        >
              <el-button type="primary" class="upload-img">上传图片</el-button> 
              <div slot="tip" class="el-upload__tip img-tip">
                最多20张，5M以内图片
              </div>
              <div slot="tip" class="el-upload__tip">
                <p><span>注意</span> 1. 在地址栏中，键入 chrome://settings/content</p>  
                <p>2. 设置允许播放flash即可</p>
                <p>3. 或添加网络白名单</p>
              </div>
              </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit" v-hasButton name="memberglorylist:edit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('glorylist')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </main>
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
.upload-img-item{
  display: inline-block;
  margin: 10px 10px;
  .show-img{
    width: 160px;
    height: 160px;
  }
  .handle{
    width: 160px;
    height: 28px;
    line-height: 28px;
    // margin-top: -10px;
    span{
      cursor: pointer !important;
      font-size:14px;
      color:rgba(153,153,153,1);
      transition: all 0.5s;
    }
    span:hover{
      color: #333;
    }
    .positions{
      float: left;
    }
    .del-img{
      display: inline-block;
      width: 28px;
      height:14px;
      font-family:PingFang-SC-Regular;
      float: right; 
    }
  }
  
  
  .el-input__inner{
    height: 30px;
    width: 156px;
    line-height: 30px; 
    background:rgba(255,255,255,1);
    border:1px solid rgba(214,214,214,1);
    text-indent: 2px;
  }
  
}

.el-upload{
  position: static;
  div.warp{
    width: 100%;
    height: 100%;
    position: relative;
  }
}
.el-upload--picture-card{
   border:0px !important;
  height: 0px !important;
}
.el-form-item__content{ 
  position: relative;
}
.upload-img{
  position: absolute !important;
  width: 165px !important;
  height: 34px !important;
  top: 0px !important;
  left: 0px !important;
  margin-left: 0 !important; 
  border-radius: 6px !important;
  background: #FFDB33 !important;
}
.upload-img-item{
  margin-top:-27px !important;
  margin-bottom: 56px !important;
}
.img-tip{
    position: absolute;
    top: 6px;
    left: 170px;
    margin-left: 0; 
  }
.el-upload__tip{
  font-size:16px;
  font-family:PingFang-SC-Regular;
  font-weight:400;
  color:rgba(153,153,153,1);
  line-height:12px;
  span{
    color: red;
    margin-left: -35px; 
  }
  
}
.el-upload{
  position: static !important;
  border:0px !important;
  height: 0px !important;
}
</style>
<script>
import Header from "@/components/publicTemplate/Header";
import { getGloryDetail, editGlory, getClassTree, getQiniuToken } from "@/api/api.js";
import global_ from "@/components/tool/Global";
var qiniu = require("qiniu-js");

export default {
  data() {
    return {
      gloryId: '',
      //照片墙
      details: [],
      //图片描述
      tempDescribes: [],
      imgDescribes: '',
      form: {
        gloryId: '',
        gloryType: '',
        gloryTitle: "",
        imgDescribes: '',
        imgUrls: "",
        targetClassIds: ""
      },
      tree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      options: [
        {
          value: 1,
          label: "校园之星"
        },
        {
          value: 2,
          label: "班级之星"
        },
        {
          value: 3,
          label: "文艺之星"
        }
      ],
      value: "",
      dialogVisible: false,
      disabledClass: true,
      uploadQiniuUrl: global_.uploadQiniuUrl, //七牛云服务器地址
      imageQiniuUrl: global_.imageQiniuUrl,
      qiniuData: {
        //上传图片携带的参数
        token: "",
        key: ""
      },
      tempUrl: [],
      imgUrls: '',
      imagelist: [],
      dialogImageUrl: "",
      classInfo: [],
      imgData: {
        accept: 'image/gif, image/jpeg, image/png, image/jpg',
      },
      editorOption: {
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike", "image"], // toggled buttons
            ["blockquote", "code-block"]
          ]
        }
        /* quill options */
      }
    };
  },
  mounted() {
    this.getParams()
    var that = this;
    //获取年级树
    getClassTree({}).then(res => {
      if (res.data.code == 200) {
        that.tree = [res.data.data];
      }
    })
    //获取风采信息
    console.log("this",this.gloryId)
    if (this.gloryId > 0) {
      getGloryDetail({ id: this.gloryId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        //匹配选中班级
        var arr = [];
        if (obj.targetClassIds != "") {
          obj.targetClassIds.split(",").map((item, index) => {
            arr.push(eval(item));
          });
          this.$refs.tree.setCheckedKeys(arr);
        }
        //匹配类型
        that.options.map(item =>{
          if(item.value == that.form.gloryType){
            that.form.typeName = item.label
          }
        })
        //图片显示
        obj.details.map((item,index) =>{
          this.imagelist.push({ name: "", url: item.picUrl+'?imageMogr2/strip|imageView2/1/w/160/h/160/q/85' });
          this.details.push({ picTitle: item.picTitle, url: item.picUrl })
          //获取图片描述
          this.tempDescribes.splice(index,1,item.picTitle)
        })
        console.log('that.tempDescribes',that.tempDescribes)
        this.transUrl(this.imagelist)
        this.imgUrls = this.tempUrl.join(",")
      });
    }
    getQiniuToken().then(res => {
      this.qiniuData.token = res.data.data.token;
    });
   
  },
  methods: {
    //上传图片-删除
    delUpload(list, index) { 
      this.details.splice(index,1)
      this.tempDescribes.splice(index,1)
      this.imagelist = []
      this.details.map((item,index) =>{
        this.imagelist.push({ name: "", url: item.url });
      })
      this.transUrl(this.imagelist)
      this.imgUrls = this.tempUrl.join(",")
    },
    //左移
    toLeft(arr,index,length) {
      this.imagelist = []
      console.log('arr',arr,'index',index,'length',length)
      if(index == 0){
        alert('图片已经置顶咯')
      }else{
        this.swapArray(this.details, index, index-1);
        console.log("this.details",this.details)
       this.details.map((item,index) =>{
          this.imagelist.push({ name: "", url: item.url });
          //获取图片描述
          this.tempDescribes.splice(index,1,item.picTitle)
        })
        this.transUrl(this.imagelist)
        this.imgUrls = this.tempUrl.join(",")
        // console.log("this.tempDescribes",this.tempDescribes)
        // console.log("this.imgUrls",this.imgUrls)
      }
    },
    //右移
    toRight(arr,index,length) {
      console.log('arr',arr,'index',index,'length',length)
      this.imagelist = [];
      if(index == length-1){
        alert('到底啦')
      }else{
        this.swapArray(arr, index, index+1);
        console.log("this.details",this.details)
        this.details.map((item,index) =>{
          this.imagelist.push({ name: "", url: item.url });
          //获取图片描述
          this.tempDescribes.splice(index,1,item.picTitle)
        })
        this.transUrl(this.imagelist)
        this.imgUrls = this.tempUrl.join(",")
        console.log("this.tempDescribes",this.tempDescribes)
        console.log("this.imgUrls",this.imgUrls)

      }
    },
    //
    swapArray(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        console.log('arr',arr,"this.details",this.details) 
    },
    handleAvatarSuccess(res, file) {
      this.dialogImageUrl = this.imageQiniuUrl + res.key;
      this.imagelist.push({ name: res.key, url: this.dialogImageUrl });
      this.details.push({ picTitle: '', url: this.dialogImageUrl  })

      this.transUrl(this.imagelist)
      this.imgUrls = this.tempUrl.join(",")
      //上传成功往数组添加一个空字段
      this.tempDescribes.splice(this.tempDescribes.length,1,'')
    },
    handleRemove(file, fileList) {
      this.imagelist = fileList
      this.transUrl(fileList)
      this.imgUrls = this.tempUrl.join(",")
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
    },
    beforeAvatarUpload: function(file) {
      var seat = file.name.lastIndexOf(".");
      var extension = file.name.substring(seat).toLowerCase();
      this.qiniuData.key = new Date().getTime() + extension;
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isJPG && !isPNG) {
        this.$message.error("图片只能是 JPG/PNG 格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 5MB!");
        return false;
      }
    },
    //转化URL
    transUrl(url) {
      this.tempUrl = [];
      console.log('url',url)
      var that = this
      url.map(item => {
        that.tempUrl.push(item.url)
      })
      // this.imgUrls = this.tempUrl.split(',')
    },
    input(val,index) {
      console.log('val',val,'index',index)
      this.tempDescribes.splice(index,1,val)
      console.log('this.tempDescribes',this.tempDescribes)
     },
    select(val) {
      console.log(val)
      this.form.gloryType = val
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
      //新增/编辑通知
      var that = this;
      console.log('this.form.gloryTitle',this.form.gloryTitle,'that.form.gloryType',that.form.gloryType);
      // if(this.gloryId > 0){
        this.$refs[form].validate(valid => {
          if (valid) {
            //获取班级树ID
            var keys = this.$refs.tree.getCheckedKeys();
            var newTargetClassIds = "";
            keys.map((item, index) => {
              if (item.indexOf("g") == -1  && item!=0 ) {
                newTargetClassIds += item + ",";
              }
            });
            if (newTargetClassIds != "") {
              newTargetClassIds = newTargetClassIds.substring(
                0,
                newTargetClassIds.length - 1
              );
            }
            //获取图片描述
            this.imgDescribes = this.tempDescribes.join(",")
            editGlory({ 
              GloryId: that.gloryId,
              ImgDescribes: that.imgDescribes,
              Type: that.form.gloryType,
              Title: that.form.gloryTitle,
              ImgUrls: that.imgUrls,
              TargetClassIds: newTargetClassIds//投放班级ID，多个请用英文逗号隔开
            }).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.skip("glorylist");
              }else{
                this.$message({
                  type: "fail",
                  message: res.data.message
                });
              }
            });
          }else {
            console.log("error submit!!");
            return false;
          }
          
        })
      // }else{

      // }
      
        
    },
    skip(type, param) {
      this.$router.push({
        name: type
      });
    },
    getParams () {
      // 取到路由带过来的参数 
      var routerParams = this.$route.params.id
      // 将数据放在当前组件的数据内
      this.gloryId = routerParams
    }
  },
  computed: {
    uploadDisabled: function() {
      return this.imagelist.length > 19;
    }
  },
  components: { Header }
};
</script>
