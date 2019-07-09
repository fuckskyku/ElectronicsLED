<template>
	<div id="app">
		<main>
          
          <el-aside class="nav">
             <el-breadcrumb separator-class="el-icon-arrow-right">
             <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
             <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
             <el-breadcrumb-item to="/basesettingindex">学校成员管理</el-breadcrumb-item>
             <el-breadcrumb-item to="/teacherlist">老师管理</el-breadcrumb-item>
             <el-breadcrumb-item :to="path">任课管理</el-breadcrumb-item>
             <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: path})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
           <div id="editUserInfo" class="editInfo" >           
          <el-form ref="form" :model="form" label-width="280px" style="padding-left:400px;" :rules="rules">
                <el-form-item label="老师:" prop="teacherId">
                      <el-select v-model="teacherName" placeholder="请选择" :disabled="flag" >
                        <el-option v-for="item in teacherOptions" :key="item.teacherId" :label="item.teacherName" :value="item.teacherId"></el-option>
                      </el-select>
                      <div style="color: #999;"><i class="el-icon-warning"></i> <span>新增请从下拉列表选择老师</span></div>
                </el-form-item>
               <el-form-item label="科目:" prop="subjectId">
                     <el-select v-model="subjectName" placeholder="请选择">
                                    <el-option v-for="item in subjectOptions" :key="item.subjectId" :label="item.subjectName" :value="item.subjectId"></el-option>
                     </el-select>
                      <div style="color: #999;"><i class="el-icon-warning"></i> <span>找不到科目？去<a style="color: #1594FA;" @click="skip('classlist',0)">添加科目</a></span></div>
                </el-form-item>                
               <el-form-item label="班级:" v-if="flag">
                     <el-select v-model="className" placeholder="请选择" @change="selectClass(className)">
                                    <el-option v-for="item in classOptions" :key="item.classId"  :label="item.className" :value="item.classId"></el-option>
                     </el-select>
                      <div class="tip"><i class="el-icon-warning"></i><span>找不到班级？去<a style="color: #1594FA;" @click="skip('classlist',0)">添加班级</a></span></div>
                </el-form-item> 
                <el-form-item label="通知班级:" v-if="!flag" prop="newTargetClassIds">
                  <el-tree
                    v-model="targetClassIds"
                    :data="classInfo"
                    show-checkbox
                    :default-expanded-keys="[0]"
                    node-key="id"
                    ref="tree"
                    highlight-current
                    :props="defaultProps">
                  </el-tree>
                  <span style="color: #F56C6C;" v-if="show">请选择通知的班级</span>
                </el-form-item>
                 <el-form-item style="text-align:left;margin-top:180px;">
                     <div style="margin-left:-280px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info"  @click="skip('teachersubjectlist')" >返回列表</el-button>
                     </div>
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
  getTeacherSubjectDetail,
  editTeacherSubject,
  getTeacherSubjectList,
  getTeacherList,
  getSubjectList,
  getClassList,
  getClassTree
} from "@/api/api";

export default {
  data() {
    return {
      teacherId: '',
      targetClassIds: '',
      newTargetClassIds: "",
      teacherName: '',
      subjectName: '',
      className: '',
      targetClassList: [],
      path: this.$route.query.path,
      flag: true,
      show: false,
      form: {
        teacherId: '',
        subjectId: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      classInfo: [],
      classId: [],
      teacherOptions: [],
      subjectOptions: [],
      classOptions: [],
      value: "",
      rules: {
        teacherId: [{ required: true, message: "请选择教师", trigger: "blur" }],
        subjectId: [{ required: true, message: "请选择科目", trigger: "blur" }],
        newTargetClassIds: [{ required: true, message: "请选择班级", trigger: "blur" }],
        
      }
    };
  },
  methods: {
    onSubmit(form) {
      
      if(this.form.teacherSubjectId == 0){
        //获取班级树ID
        var keys = this.$refs.tree.getCheckedKeys();
        
        keys.map((item, index) => {
          if (item.indexOf("g") == -1 && item!=0 ) {
            this.newTargetClassIds += item + ",";
          }
        });
        if (this.newTargetClassIds != "") {
          this.newTargetClassIds = this.newTargetClassIds.substring(
            0,
            this.newTargetClassIds.length - 1
          );
        }
      }
      if(this.newTargetClassIds == ''){
        this.show = true
      }else{
        this.show = false
      }
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          // var newTargetClassIds = "";
          
          console.log('TeacherSubjectId:',this.form.teacherSubjectId,'TeacherId:',this.form.teacherId,'SubjectId:',this.form.subjectId,'ClassId:',this.form.classId,'TargetClassIds:',this.newTargetClassIds)
          if(this.newTargetClassIds != ''){
            editTeacherSubject({
              TeacherSubjectId: this.form.teacherSubjectId,
              TeacherId: this.form.teacherId,
              SubjectId: this.form.subjectId,
              ClassId: this.form.classId,
              TargetClassIds: this.newTargetClassIds
            }).then(res => {
              if (res.data.code == 200) {
                console.log(res);
                this.$message({
                  type: "success",
                  message: res.data.message
                });
                this.$router.push({
                  name: "teachersubjectlist",
                  params: {
                    teacherId: this.form.teacherId
                  }
                });
              } else {
                this.$message({
                  type: "error",
                  message: res.data.message
                });
              }
            });
          }
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    skip(type) {
      this.$router.push({
        name: type,
        params: {
          teacherId: this.teacherId
        }
      });
    },
    selectClass(val){
     
    }
  },
  mounted() {
    this.form.teacherSubjectId = this.$route.params.id;
    if (this.form.teacherSubjectId > 0) {
      this.teacherId = this.$route.params.teacherId;
      this.targetClassIds = '';
      getTeacherSubjectDetail({ id: this.form.teacherSubjectId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        
        // console.log("obj",obj)
        //获取所任课科目
        getSubjectList({ pageSize: 10000 }).then(res => {
          this.subjectOptions = res.data.data.list;
          this.subjectOptions.map(item => {
            //匹配默认显示的科目
            if(obj.subjectId == item.subjectId){
              this.subjectName = item.subjectName
              this.form.subjectId = item.subjectId
            } 
          })
          // console.log('this.subjectOptions',this.subjectOptions)
        });
        //获取班级列表
        getClassList({ pageSize: 10000 }).then(res => {
          this.classOptions = res.data.data.list;
          this.classOptions.map(item => {
            //匹配默认显示的班级
            if(obj.classId == item.classId){
              this.className = item.className
              this.form.classId = item.classId
            } 
          })
          // console.log('this.classOptions',this.classOptions)
        });
        //获取教师列表
        getTeacherList({ pageSize: 10000 }).then(res => {
          this.teacherOptions = res.data.data.list;
          getTeacherSubjectList({ pageSize: 10000,teacherId: this.teacherId }).then(res => {
            var teacherOption = res.data.data.list;
            teacherOption.map(item => {
              //匹配默认显示的班级
              if(obj.teacherSubjectId == item.teacherSubjectId){
                this.teacherName = item.teacherName
              }
              //获取targetClass
              this.targetClassList.push({teacherSubjectId: item.teacherSubjectId,targetClass: item.className})
            })
          });
          // console.log('targetClasslist',this.targetClassList)
          
          // console.log('this.teacherOptions',this.teacherOptions)
        });
      });
    }else{
      this.flag = false
      //获取年级树
      getClassTree({}).then(res => {
        if (res.data.code == 200) {
          this.classInfo = [res.data.data];
        }
      })
      getTeacherList({ pageSize: 10000 }).then(res => {
        this.teacherOptions = res.data.data.list;
      });

      getClassList({ pageSize: 10000 }).then(res => {
        this.classOptions = res.data.data.list;

      });

      getSubjectList({ pageSize: 10000 }).then(res => {
        this.subjectOptions = res.data.data.list;
      });
    }
  },
  watch: {
    subjectName(newVal,val){
      console.log('newVal',newVal,'val',val)
      this.form.subjectId = newVal
      console.log('this.form.subjectId',this.form.subjectId)
    },
    className(newVal,val){
      if(typeof(newVal) == 'number'){
        this.form.classId = newVal
      }
      console.log('this.form.classId',this.form.classId)
    },
    teacherName(newVal,val){
      if(this.form.teacherSubjectId == 0){
        this.form.teacherId = newVal
      }else{ 
        this.form.teacherId = this.$route.params.teacherId
      }
      
      console.log('this.form.teacherId',this.form.teacherId)
      
    },
  },
  components: { Header }
};
</script>