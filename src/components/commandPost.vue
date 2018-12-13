<template>
 <div id="login">
				<div class="login-form">
					<div class="login-header"><img src="/static/img/logo22.png" height="223" width="100%" alt="">
					</div>
			    <el-form ref="form" :model="form"  :rules="rules" :inline="true" label-width="80px"  class="demo-form-inline ">
					<el-form-item  prop="name">
						<el-input v-model="form.name" clearable placeholder="用户名/手机号"></el-input>
					</el-form-item>
					<el-form-item  prop="pass">
						<el-input v-model="form.pass" clearable type="password" placeholder="密码" @keyup.enter.native="onSubmit('form')"></el-input>
					</el-form-item>
					<el-form-item class="login-buttonform">
						<el-button type="primary" icon="warning" round class="login-button" @click="onSubmit('form')">登                 录</el-button>						
					</el-form-item>
					<el-form-item style="margin-top:-18px;">
						<!-- <span class="regSpan"><router-link to="/register">注册</router-link></span>						 -->
						<span class="forgetPass"><router-link to="/forgetpassword">忘记密码？</router-link></span>
					</el-form-item>
				</el-form>
			</div>
      <el-dialog
        title="提示"
        :visible.sync="show"
        width="30%"
        center>
        <span>
              <img class="tips" src="/static/img/tip-war.png" alt="">
              请耐心等待咪师官方工作人员与您取得联系，验证学校资质
              后方可进行操作。或者您可与咪师官方主动联系，尽快完成
              认证，全国热线电话：400-XXXXXX。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="show = false">取 消</el-button>
          <el-button class="btn-ok" @click="show = false">确 定</el-button>
        </span>
      </el-dialog>
		</div>	
    			
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/login.scss";
.forgetPass a{
  color: #56B1FC !important;
}
.el-dialog__header{
  text-align: left;
}
.el-dialog--center .el-dialog__footer{
  
  .dialog-footer{
    .btn-ok{
      background:rgba(255,219,51,1);
      border: 1px solid #e6e6e6;
    }
    .btn-ok:hover{
      color: #ffffff;
    }
  }
}
.tips{
  width: 25px;
  height: 25px;
}
.el-message-box__btns button{
  background: #FFDE2A !important;
  outline: none !important;
}
</style>
<script>
//接口
import { login, getMySchoolList } from "../api/api.js";

export default {
  data() {
    return {
      Id: '',
      show: false,
      form: {      
        name: "",
        pass: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入用户名/手机号", trigger: "blur" }
        ],
        pass: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
    var that = this;
    var routerParams = this.$route.params.id
    this.Id = routerParams
    setTimeout(()=>{
      if(this.Id == 0){
        this.show = true
        that.Id = '';
      }
    },500)
  },
  methods: {
    searchEnterFun: function(e, form) {
      var keyCode = window.event ? e.keyCode : e.which;
      //  console.log('回车搜索',keyCode,e);
      if (keyCode == 13 && this.input) {
        //这里执行ajax
        this.$refs[form].validate(valid => {
          if (valid) {
            login({ Name: this.form.name, password: this.form.pass }).then(
              res => {
                if(res.data.code == 200){
                  if(res.data.data.userType == 2){
                    //存储token
                    this.saveAllLocalStorage(res.data.data, "login_userInfo", [
                      "userId",
                      "nickName",
                      "userName",
                      "expirationDate",
                      "permissions"
                    ]);
                    this.saveLocalStorage("token", res.data.data.token);
                    this.$router.push({ name: "home" });
                  }else{
                    this.$message({
                        type: 'warning',
                        message: `您是尊贵的超级管理员，即将跳转到总管理后台`
                    });
                    setTimeout(()=>{
                        window.location.href = 'http://dzbp.mseenet.com'
                    },3000)
                  }  
                }else{
                  this.$alert('账号或密码错误，请重新登录！', '登录失败', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$message({
                        type: 'error',
                        message: `账号或密码错误，请重新登录！`
                      });
                    }
                  });     
                }
                
              }
            );
            
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          login({ Name: this.form.name, password: this.form.pass }).then(
            
            res => {
                "expirationDate",
                "permissions"
              if(res.data.code == 200){
                console.log(res.data)
                if(res.data.data.userType == 2){
                  //存储token
                  this.saveAllLocalStorage(res.data.data, "login_userInfo", [
                    "userId",
                    "nickName",
                    "userName",
                    "expirationDate",
                    "permissions"
                  ]);
                  this.saveLocalStorage("token", res.data.data.token);
                  this.$router.push({ name: "home" });
                }else{
                    this.$message({
                        type: 'warning',
                        message: `您是尊贵的超级管理员，即将跳转到总管理后台`
                    });
                    setTimeout(()=>{
                        window.location.href = 'http://dzbp.mseenet.com'
                        // window.open('www.baidu.com')
                    },3000)
                }  
              }else{
                this.$alert('账号或密码错误，请重新登录！', '登录失败', {
                    confirmButtonText: '确定',
                    callback: action => {
                      this.$message({
                        type: 'error',
                        message: `账号或密码错误，请重新登录！`
                      });
                    }
                  });   
              }
              
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>