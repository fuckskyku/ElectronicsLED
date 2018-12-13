<template>
  <div id="app" class="animated zoomIn">
    <main>
        <el-aside class="nav" style="width:100%">
             <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
              <el-breadcrumb-item>发布管理</el-breadcrumb-item>
             </el-breadcrumb>
             <div class="goback" @click="$router.go(-1)">
              <img src="/static/img/返回.png" alt="">返回
            </div>
          </el-aside>
      <el-container>
        <el-aside class="baseSettingAside" style="width:40%;margin-top:248px;">
          <el-row>
                      <el-tooltip placement="right" trigger="click">
                         <div slot="content" class="basesettingnavdiv">
                            <div><a @click="skip('noticelist')" v-hasButton name="membernoticelist:view">通知管理</a></div>
                            <div><a @click="skip('newslist')" v-hasButton name="membernewslist:view">资讯管理</a></div>
                         </div>
                           <el-button  class="news text" style="margin-top:23px;" v-hasMenu name="membernoticelist:view,membernewslist:view">学校资讯</el-button>                         
                      </el-tooltip>        
                    </el-row> 
                     <el-row>
                        <el-tooltip placement="right" trigger="click">
                          <div slot="content" class="basesettingnavdiv">
                            <div><a @click="skip('photolist')" v-hasButton name="memberphotolist:view">班级相册</a></div>
                            <div><a @click="skip('classactivitylist')" v-hasButton name="memberclassactivitylist:view">班级活动</a></div>
                            <div><a @click="skip('classglorylist')" v-hasButton name="memberclassglorylist:view">班级荣誉</a></div>
                            <div><a @click="skip('classinfolist')" v-hasButton name="memberclassinfolist:view">班级介绍&班规</a></div>
                            </div>
                           <el-button  class="class text" style="margin-top:23px;" v-hasMenu name="memberphotolist:view,memberclassactivitylist:view,memberclassglorylist:view,memberclassinfolist:view">班级资讯</el-button>                         
                      </el-tooltip>      
                    </el-row>
                     <el-row>
                       <el-tooltip placement="right" trigger="click">
                          <div slot="content" class="basesettingnavdiv">
                            <div><a @click="skip('readinglist')" v-hasButton name="memberreadinglist:view">读书推荐</a></div>
                            <div><a @click="skip('mottolist')" v-hasButton name="membermottolist:view">知识点管理</a></div>
                            <div><a @click="skip('glorylist')" v-hasButton name="memberglorylist:view">校园风采</a></div>
                            <div><a @click="skip('schoolcustomlist')" v-hasButton name="membereditcustom:view">自定义显示</a></div>                          
                            </div>
                           <el-button  class="park text" style="margin-top:23px;" v-hasMenu name="memberreadinglist:view,membermottolist:view,memberglorylist:view">成长乐园</el-button>                         
                      </el-tooltip>      
                    </el-row>                   
        
        </el-aside>
        <el-main style="margin-top:132px;">
          <img src="/static/img/fabushezhi.png"/>
        </el-main>
      </el-container>
    </main>
    
  </div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
</style>
<style>
.el-menu--collapse {
  width: 400px;
  min-height: 400px;
}

</style>

<script>
import Header from "@/components/publicTemplate/Header";

export default {
  data() {
    return {
      value: ""
    };
  },
  updated(){
    window.scrollTo(0,0)
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    }
  },
  components: { Header }
};
</script>
