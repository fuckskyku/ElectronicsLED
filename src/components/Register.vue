<template>
 <div id="forget">
				<div class="forget-form">
					<div class="forget-header"><img src="/static/img/logo3.png" height="88" width="100%" alt="">
					</div>
					<el-form ref="form" :model="form" :rules="rules"  :inline="true" label-width="80px"  class="demo-form-inline ">            
                    <el-form-item>
                      <el-select v-model="form.cityId" placeholder="请选择城市">
                          <el-option-group  v-for="group in options"  :key="group.groupName"  :label="group.groupName">
                                <el-option  v-for="item in group.list"  :key="item.CityId" :label="item.CityName" :value="item.CityId">
                                </el-option>
                          </el-option-group>
                      </el-select>
                    </el-form-item>        
					<el-form-item  prop="mobile">
						<el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
					</el-form-item>
					<el-form-item  prop="code">
						<el-input v-model="form.code"  placeholder="请输入短信验证码"></el-input>
                        <el-button type="primary"  v-bind:disabled="!dis" icon="warning" round class="getcode" @click="getCode" id="vcode" ref="inputCode">{{codeMsg}}</el-button>
					</el-form-item>
          <el-form-item prop="name">
						<el-input v-model="form.name" placeholder="请输入用户名"></el-input>
					</el-form-item>
          <el-form-item prop="password">
						<el-input v-model="form.password" type="password" placeholder="请输入新密码"></el-input>
					</el-form-item>
          	<el-form-item prop="repass">
						<el-input v-model="form.repass" type="password" placeholder="请输入确认密码"></el-input>
					</el-form-item>
           <el-form-item prop="nickName">
						<el-input v-model="form.nickName" placeholder="请输公司名称或学校名称"></el-input>
					</el-form-item>
					<el-form-item class="forget-buttonform">
						<el-button type="primary" icon="warning" round class="forget-button" @click="onSubmit('form') ">注                 册</el-button>						
					</el-form-item>
					<el-form-item style="margin-top:-18px;">
							<span class="forgetPass">已有账号？<a href="/login">马上登录</a></span>
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
import { getPhoneCode, register, getCity,getCity2 } from "@/api/api.js";

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
      } else if (value !== this.form.password) {
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
        cityId: "",
        name: "",
        code: "",
        mobile: "",
        password: "",
        nickName: "",
        repass: ""
      },
      rules: {
        mobile: [{ required: true, message: "请填写手机号", trigger: "blur" }],
        code: [
          { required: true, message: "请填写短信验证码", trigger: "blur" }
        ],
        name: [{ required: true, message: "请填写用户名", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        repass: [{ validator: validatePass2, trigger: "blur" }],
        nickName:[{ required: true, message: "请填写公司名称或学校名称", trigger: "blur" }]
      },
      options: [ ]
    };
  },
  methods: {
    skip(type, param) {
      this.$router.push({
        name: type
      });
    },
    getCode() {
      var msg = $('.getcode')
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.form.mobile == "") {
        this.$message.warning("请输入手机号码");
      } else if (!reg.test(this.form.mobile)) {
        this.$message.warning("手机格式不正确");
      } else {
        let that = this;
        getPhoneCode({ tel: that.form.mobile }).then(res => {
          if (res.data.code == 200) {
            var miao = 60;
            this.$message.success("验证码已发送，请查收短信");
            // this.$message({
            //   type: "success",
            //   message: "验证码已发送，请查收短信"
            // });
            var timehandler = setInterval(function() {
              that.codeMsg = miao + "秒后再获取";
              msg.html(`${that.codeMsg}`)
              that.dis = false;
              miao--;
              if (timehandler != null && miao <= 0) {
                clearInterval(timehandler);
                that.dis = true;
                that.codeMsg = "获取短信验证码";
                msg.html(`${that.codeMsg}`)
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
          register({
            Name: this.form.name,
            NickName: this.form.nickName,
            CityId: this.form.cityId,
            Mobile:this.form.mobile,
            PassWord:this.form.password,
            Code:this.form.code
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "注册成功"
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
    },        
  },
  mounted() {
    getCity2().then(res => {
      if (res.data.code == 200) {
        this.options = res.data.data;
      }
    });
  },
};


</script>