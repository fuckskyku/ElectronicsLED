<template>
  <div id="app">
    <Header v-if="flag" :flags="flags"></Header>  
    <router-view v-if="Safari"></router-view>
    <div id="context" class="context" v-if="!Safari" >
        
        <div id="msg" class="msg">
          <div style="width: 362px;height: 358px;margin: 0 auto; margin-top: 169px;"><img src="/static/img/rocket.png" alt=""></div>
          <div id="text" class="text">
            检测到您正在使用Safari浏览器,请使用IE11及其以上版本或其它浏览器才可以进行浏览
            <p id="chrome" style="padding-top: 32px;width: 600px;margin: 0 auto;">
              推荐使用<img style="vertical-align: middle;margin: 0 3px 6px;" src="/static/img/chrome.png" alt="">谷歌浏览器<a target="_blank" href='http://ruanjian.jxsgdsmc.cn/99/39324.html?tab=45816'>点击下载</a>
            </p>

          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Header from "@/components/publicTemplate/Header";

export default {
  name: 'App',
  data() {
    return { 
      flag: true,
      flags: true,
      visibility: true,
      Safari: true
    };
  },
  methods:{

  },
  created() {
    if(this.$route.name == 'login' || this.$route.name == 'register' || this.$route.name == 'forgetpassword'){
      this.flag = false
    }
    if(this.$route.name == 'home'){
      this.flags = false
    }
    var versions
    var userAgent = navigator.userAgent;  // 取得浏览器的 userAgent 字符串
    //Safari
    if(userAgent.indexOf("Chrome") == -1 && userAgent.indexOf("Safari") != -1){
      this.Safari = false
      this.flag = false
      // alert("检测到您正在使用Safari浏览器,推荐使用谷歌浏览器,以获得最佳体验")
      // alert(context)
      // context.style.display = 'block'
      // console.log('context',context,'text',text)
      // text.innerHTML = '检测到您正在使用Safari浏览器,推荐使用谷歌浏览器,以获得最佳体验'
    }
  },
  mounted() {
    


    
  },
  components: { Header },
  watch: {
    $route(e) {
      if(e.name == 'home'){
        this.flags = false
      }else{
        this.flags = true
      }
      if(e.name == 'login' || e.name == 'register' || e.name == 'forgetpassword'){
        this.flag = false
      }else{
        this.flag = true
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  width: 100%;
  height: 100%;
  .el-scrollbar {
    width: 100%;
    height: 100%;
    .el-scrollbar__wrap {
      overflow-x: hidden;
      height: 100%;
    }
  }
}
.context{
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  z-index: 9999;
  display: block;
}
.msg{
  width: 100%;
  height: 100%;
  position: absolute;
  text-align: center;
  font-size:24px;
  font-family:'幼圆';
  font-weight:400;
  color:#000;
  
}
.text{
  width:980px;
  height:30px;
  margin:0 auto;
  margin-top: 83px;
}
</style>
