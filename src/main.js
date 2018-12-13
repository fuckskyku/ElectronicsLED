// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'




//引入Vuex
// import VuexPersistence from 'vuex-persist'

//引入Jquery
import $ from 'jquery'

//引入富文本
import  VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)

//引入babel-polyfill
import 'babel-polyfill'

//引入全局模版
import pageHtml from './components/publicTemplate/pageMp'
Vue.component('pageHtml', pageHtml)

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.use(ElementUI);
Vue.use(VueResource);
Vue.config.productionTip = false

import store from './store/Store'
import util from './util/util'

//引用第三方js
// import $ from 'jquery'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'

import 'bootstrap-table/dist/bootstrap-table.min.css'
import 'bootstrap-table/dist/bootstrap-table.min'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN'
//引入animate
import animate from 'animate.css'
//权限控制引入
import has from './util/directive'

//路由守卫
var routeList = [];
router.beforeEach((to, from, next) => {
   /* 路由发生变化修改页面title */
   if (to.meta.title) {
    document.title = to.meta.title
  }
  
  var token = window.localStorage.getItem("token");
  if (token == null) {
    //token为空的时候，全局token也的等于空
    global.TOKEN = null;
    if (to.name == "home") {
      next('login')
    } else {
      next();
    }
  }else{
    if (token) {
      if (to.name == 'login') {
        next('/')
      }
    }

    //配置全局变量
    if (window.localStorage.getItem('token') != null) {
      global.TOKEN = window.localStorage.getItem('token');
    } else {
      global.TOKEN = null;
    }

    // 面包屑导航
    var index = -1;
    for (var i = 0; i < routeList.length; i++) {
      if (routeList[i].name == to.name) {
        index = i;
        break;
      }
    }
    if (index !== -1) {
      //如果存在路由列表，则把之后的路由都删掉
      routeList.splice(index + 1, routeList.length - index - 1);
    } else if (to.name !== 'login') {
      routeList.push({ "name": to.name, "path": to.fullPath, "title": to.meta.title });
      to.meta.routeList = routeList;
    }
    next();
  }


  // var token = window.localStorage.getItem("token");
  // if (token == null) {
  //   //token为空的时候，全局token也的等于空
  //   global.TOKEN = null;
  //   if (to.name == 'Login') {
  //     next()
  //   } else {
  //     next('/Login')
  //   }
  // } else {
  //   if (token) {
  //     if (to.name == 'Login') {
  //       next('/')
  //     }
  //   }

  //   //配置全局变量
  //   if (window.localStorage.getItem('token') != null) {
  //     global.TOKEN = 'Bearer ' + window.localStorage.getItem('token');
  //   } else {
  //     global.TOKEN = null;
  //   }

  // 面包屑导航
  // var index = -1;
  // for (var i = 0; i < routeList.length; i++) {
  //   if (routeList[i].name == to.name) {
  //     index = i;
  //     break;
  //   }
  // }
  // if (index !== -1) {
  //   //如果存在路由列表，则把之后的路由都删掉
  //   routeList.splice(index + 1, routeList.length - index - 1);
  // } else if (to.name !== 'Login') {
  //   routeList.push({ "name": to.name, "path": to.fullPath, "title": to.meta.title });
  //   to.meta.routeList = routeList;
  // }
  //   next();
  // }
});


Vue.use(util);

/* 注册全局过滤器 */ 
Vue.filter('total',function(str){  //班级数量过滤
  if(str != '' || str != null){
    str = str.split(",");
    return `${str.length -1}个班级`
  }else{
    return `0个班级`
  }
})

import { formatDate } from "@/common/time/date.js";
Vue.filter('formatDate',function(time){  //时间过滤
  var  times  =  time  *  1000
  var  date  =  new  Date(times);
  return  formatDate(date,  'yyyy-MM-dd  hh:mm:ss');
})


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

