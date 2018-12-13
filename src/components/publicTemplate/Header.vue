<template>
	<header class="boxshadow" style="height:100px;">
    <div class="head">
      <el-row>
        <el-col :span="8" style="padding-left:10px;">
          <div class="headerImageDiv">
            <img :src="icon" />
          </div>
          <div class="SchoolName">{{firstSchool}}</div>
          <div class="selSchool">
            <el-select v-model="changeSchoolName" placeholder="" class="selectSchool" size="small" @change="changeSchool">
            <el-option v-for="item in options" :key="item.schoolId" :label="item.schoolName" :value="item.schoolId">
            </el-option>
          </el-select>
          </div>
          
        </el-col>
        <div v-if="flags">
          <el-col :span="4"><div class="toolBarClass"><a @click="skip('basesettingindex')">基础设置</a></div></el-col>
          <el-col :span="4"><div class="toolBarClass"><a @click="skip('releaseindex')">发布管理</a></div></el-col>
          <el-col :span="4"><div class="toolBarClass"><a @click="skip('educationindex')">教务管理</a></div></el-col>
        </div>
        <el-col :span="2" class="quit">
          <i class="iconfont icon-tuichu1"></i> <span @click="logoutClick()">退出</span>
        </el-col>
      </el-row>
    </div>
	</header>
</template>
<style lang="scss">
@import "@/assets/Scss/publicTemplate/header.scss";
@import "../../common/fonts/quit/iconfont.css";
.headerImageDiv{
  height: 60px;
  width: 60px;
  border-radius: 50%;
  overflow: hidden;
  img{
    width: 100%;
    height: 100%;
  }
}


</style>
<style scoped>

  
</style>
<script>
//接口切换学校
import { setSchoolCredential,getMySchoolList, getSchoolInfo } from '@/api/api.js'

export default {
  props: {
    flags:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return { 
      flag: true,
      options: [],
      icon: '',
      changeSchoolName: '',
      firstSchool:"",
      navType: true
    };
  },
  methods:{
    //点击退出
    logoutClick() {
      this.removeItem("token");
      this.clearLocalStorage();
      this.$router.push({ path: "/Login" });
    },
    //切换学校
    changeSchool(selVal){
       setSchoolCredential({schoolId:selVal}).then(res=>{
          if(res.data.code = 200){
            var obj = this.options.find((item)=>{
              return item.schoolId === selVal;
            });
            this.firstSchool = obj.schoolName
            //  location.reload()
            getMySchoolList().then(res => { 
              if(res.data.data !== '' && res.data.data !== undefined){
                this.options = res.data.data
                console.log(this.options)
                if(res.data.data.length == 0 ){
                  this.removeItem('token')
                  this.$router.push({
                    name: 'login',
                    params: {
                      id: res.data.data.length
                    }
                  });
                }
                
              }
            });
            getSchoolInfo().then(res => { 
              if(res.data.code == 200){
                console.log('info',res.data.data)
                this.firstSchool = res.data.data.schoolName
                if(res.data.data.logo=='' || res.data.data.logo==null){          
                  this.icon='/static/img/schoollogo.png'
                }else
                this.icon = res.data.data.logo
              }
            })
            location.reload()
          }
       })
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    }
  },
  mounted() {
    if(this.$route.name == 'login' || this.$route.name == 'register' || this.$route.name == 'forgetpassword'){
      console.log(this.$route.name)
    }else{
      getMySchoolList().then(res => { 
        if(res.data.data !== '' && res.data.data !== undefined){
          this.options = res.data.data
          console.log(this.options)
          if(res.data.data.length == 0 ){
            this.removeItem('token')
            this.$router.push({
              name: 'login',
              params: {
                id: res.data.data.length
              }
            });
          }else{
            // this.firstSchool = res.data.data[0].schoolName
          }
          
        }
      });
      getSchoolInfo().then(res => { 
        if(res.data.code == 200){
          this.firstSchool = res.data.data.schoolName
          if(res.data.data.logo=='' || res.data.data.logo==null){          
            this.icon='/static/img/schoollogo.png'
            
          }else
          this.icon = res.data.data.logo
        }
      })
    }
    
  }
};
</script>