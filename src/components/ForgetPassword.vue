<template>
 <div id="forget">
				<div class="forget-form" style="heigth:660px;">
					<div class="forget-header"><img src="/static/img/logo3.png" height="88" width="100%" alt="">
					</div>
					<el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="80px"  class="demo-form-inline ">
                       <el-form-item>
							<p>忘记密码</p>
						</el-form-item>
					<el-form-item prop="Mobile">
						<el-input  v-model="form.Mobile" placeholder="请输入手机号"></el-input>
					</el-form-item>
					<el-form-item  prop="Code">
						<el-input v-model="form.Code"  placeholder="请输入短信验证码"></el-input>
              <el-button type="primary"  v-bind:disabled="!dis" icon="warning" round class="getcode" @click="getCode" id="vcode" ref="inputCode">{{codeMsg}}</el-button>
					</el-form-item>
           <el-form-item prop="Password">
						<el-input v-model="form.Password" type="password" placeholder="请输入新密码"></el-input>
					</el-form-item>
          <el-form-item prop="repass">
						<el-input v-model="form.repass" type="password" placeholder="请输入确认密码"></el-input>
					</el-form-item>
					<el-form-item class="forget-buttonform">
						<el-button type="primary" icon="warning" round class="forget-button" @click="onSubmit('form') ">提交</el-button>						
					</el-form-item>
					<el-form-item style="margin-top:-18px;">
							<span class="forgetPass">已有账号？<a @click="skip('login')" href="#">马上登录</a></span>
					</el-form-item>
				</el-form>
			</div>
				</div>
				
</template>
<style lang="scss" >
//scoped 表示唯一
@import "@/assets/Scss/forgetpass.scss";
</style>
<script>
import { getPhoneCode, editUserPwd } from "@/api/api.js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.repass !== "") {
          this.$refs.form.validateField("repass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.Password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      labelPosition: "right",
      dis: true,
      codeMsg: "获取短信验证码",
      form: {
        Mobile: "",
        Code: "",
        Password: "",
        repass: ""
      },
      rules: {
        Mobile: [{ required: true, message: "请填写手机号", trigger: "blur" }],
        Code: [
          { required: true, message: "请填写短信验证码", trigger: "blur" }
        ],
        Password: [{ validator: validatePass, trigger: "blur" }],
        repass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    skip(type, param) {
      this.$router.push({
        name: type
      });
    },
    getCode() {
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.form.Mobile == "") {
        this.$message.warning("请输入手机号码");
      } else if (!reg.test(this.form.Mobile)) {
          this.$message.warning("手机格式不正确");
      } else {
        let that = this;
        getPhoneCode({ tel: that.form.Mobile }).then(res => {
          if (res.data.code == 200) {
            var miao = 60;
            this.$message({
              type: "success",
              message: "验证码已发送，请查收短信"
            });
            var timehandler = setInterval(function() {
              that.codeMsg = miao + "秒后再获取";
              that.dis = false;
              miao--;
              if (timehandler != null && miao <= 0) {
                clearInterval(timehandler);
                that.dis = true;
                that.codeMsg = "获取短信验证码";
              }
            }, 1000);
          } else {
            this.$message({
              type: "fail",
              message: res.data.message
            });
          }
        });
      }
    },
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          editUserPwd({
            Mobile: this.form.Mobile,
            PassWord: this.form.Password,
            Code: this.form.Code
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("login");
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
    }    
  }

};
</script>