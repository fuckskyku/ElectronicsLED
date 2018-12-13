<template>
	<div id="app">
		<main>
          
          <el-aside class="nav">
             <el-breadcrumb separator-class="el-icon-arrow-right">
             <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
             <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
             <el-breadcrumb-item to="/basesettingindex">学校成员管理</el-breadcrumb-item>
             <el-breadcrumb-item to="/teacherlist">老师管理</el-breadcrumb-item>
             <el-breadcrumb-item :to="fullPath">职务管理</el-breadcrumb-item>
             <el-breadcrumb-item>编辑职务</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="goback" @click="$router.push({name: fullPath})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div id="editUserInfo" class="editInfo" :rules="rules">           
           <el-form ref="form" :model="form" label-width="280px" style="padding-left:400px;">
                <el-form-item label="老师:" @change="checkTeacher">
                      <el-select v-model="form.teacherId" :disabled="flag" placeholder="请选择">
                             <el-option v-for="item in teacherOptions" :key="item.teacherId" :label="item.teacherName" :value="item.teacherId"></el-option>
                      </el-select>
                      <div class="tip"><i class="el-icon-warning"></i><span>新增请从下拉列表选择老师</span></div>
                </el-form-item>
               <el-form-item label="职务:" prop="dutyId">
                     <el-select v-model="form.dutyId" placeholder="请选择" @change="onSelectDuty($event)">
                                    <el-option v-for="item in dutyOptions" :key="item.dutyId" :label="item.dutyName" :value="item.dutyId"></el-option>
                     </el-select>
                </el-form-item>                
               <el-form-item label="班级:" v-show="classShow">
                     <el-select v-model="form.classId" placeholder="请选择">
                                    <el-option v-for="item in classOptions" :key="item.classId" :label="item.className" :value="item.classId"></el-option>
                     </el-select>
                      <div class="tip"><i class="el-icon-warning"></i><span>找不到班级？去<a style="color: #1E88DA;" @click="skip('classlist',0)">添加班级</a></span></div>
                </el-form-item>    
               <el-form-item label="年级:" v-show="gradeShow">
                     <el-select v-model="form.gradeId" placeholder="请选择">
                                <el-option v-for="item in gradeOptions" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
                     </el-select>
                </el-form-item>
                 <el-form-item style="text-align:left;margin-top:180px;">
                     <div style="margin-left:-280px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info"  @click="skip('schooldutylist')" >返回列表</el-button>
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
  getTeacherDutyDetail,
  editTeacherDuty,
  getTeacherList,
  getDutyList,
  getClassList,
  getSchoolGradeList
} from "@/api/api";

export default {
  data() {
    return {
      form: {
        teacherId: 0,
        dutyId: 1,
        classId: 0,
        gradeId: 0,
        teacherdutyId: 0
      },
      flag: true,
      teacherOptions: [],
      dutyOptions: [],
      classOptions: [],
      gradeOptions: [],
      value: "",
      gradeShow: false,
      classShow: false,
      rules: {
        dutyId: [{ required: true, message: "请选择职务", trigger: "blur" }]
      },
      fullPath: this.$route.query.fullPath
    };
  },
  methods: {
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          editTeacherDuty({
            TeacherDutyId: this.form.teacherdutyId,
            TeacherId: this.form.teacherId,
            DutyId: this.form.dutyId,
            GradeId: this.form.gradeId,
            ClassId: this.form.classId
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.$router.push({
                path: "/schooldutylist/?teacherId=" + this.form.teacherId,
                name: "schooldutylist",
                params: {
                  teacherId: this.form.teacherId
                }
              });
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
    skip(type) {
      this.$router.push({
        path: "/" + type + "/?teacherId=" + this.form.teacherId,
        name: type,
        params: {
          teacherId: this.form.teacherId
        }
      });
    },
    onSelectDuty(value) {
      if (value == 3) {
        this.gradeShow = true;
        this.classShow = false;
      }
      if (value == 4) {
        this.gradeShow = false;
        this.classShow = true;
      }
    },
    //选择教师姓名
    checkTeacher(val) {
      console.log(val)
      this.form.teacherId = val 
    }
  },
  mounted() {
    console.log('this.$route',this.$route.query.fullPath)
    getTeacherList({ pageSize: 10000 }).then(res => {
      this.teacherOptions = res.data.data.list;
    });

    getClassList({ pageSize: 10000 }).then(res => {
      this.classOptions = res.data.data.list;
    });

    getDutyList({ pageSize: 10000 }).then(res => {
      this.dutyOptions = res.data.data.list;
    });

    getSchoolGradeList({ pageSize: 10000 }).then(res => {
      this.gradeOptions = res.data.data;
    });

    this.form.teacherId = this.$route.params.teacherId;
    this.form.teacherdutyId = this.$route.params.id;

    if (this.form.teacherdutyId > 0) {
      getTeacherDutyDetail({ id: this.form.teacherdutyId }).then(res => {
        var obj = res.data.data;
        console.log('obj',obj)
        this.form = obj;
        if (obj.dutyId == 4) {
          //班主任
          this.classShow = true;
        }
        if (obj.dutyId == 3) {
          //年段长
          this.gradeShow = true;
        }
        if (obj.gradeId == -1) {
          this.form.gradeId = 0;
        }
        // this.form.teacherId = this.$route.params.teacherId;
        // this.form.teacherdutyId = this.$route.params.id;
      });
    }else{
      this.flag = false
    }
  },
  components: { Header }
};
</script>