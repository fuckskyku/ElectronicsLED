<template>
	<div id="" class="indexcontent">
		<main style="margin-top: 10px;">

			<section class="center" style="padding-bottom: 40px;">
				<div style="width:100%">
					<div class="deviceinfo">
						<el-row>
							<el-col :span="6" class="deviceborder">
								<div><img src="/static/img/shebei.png" /></div>
								<div class="devicetitle">可绑定设备</div>
								<div class="deviceNum">{{clientNum}}个</div>
							</el-col>
							<el-col :span="6" class="deviceborder">
								<div><img src="/static/img/bangding.png" /></div>
								<div class="devicetitle">已绑定设备</div>
								<div class="deviceNum">{{clientUsedNum}}个</div>
							</el-col>
							<el-col :span="6" class="deviceborder">
								<div><img src="/static/img/daili.png" /></div>
								<div class="devicetitle">资质认证</div>
								<div class="deviceNum">{{aptitude}}</div>
							</el-col>
							<el-col :span="6" class="deviceborder" style="border:0;">
								<div><img src="/static/img/daoqi.png" /></div>
								<div class="devicetitle">服务到期日期</div>
								<div class="deviceNum">{{serviceEndTime}}</div>
							</el-col>
						</el-row>

					</div>
				</div>
				<div class="manageinfo">
					<el-row type="flex" justify="space-between">
						<el-tooltip class="item" effect="dark" placement="bottom">
							<div slot="content" style="width:200px;">设置校内规章制度，如考勤时间范围、课程表、作息表；发布学校办公事务如会议、考试、倒计时等。</div>
							<el-col :span="6" class="manageorder">
								<router-link to="/basesettingindex">
									<div><img src="/static/img/jichu.png" /></div>
									<div class="managetitle">基础设置</div>
								</router-link>
							</el-col>
						</el-tooltip>
						<el-tooltip class="item" effect="dark"  placement="bottom">
							<div slot="content" style="width:200px;">发布校园和班级的宣传和教学图文，如通知、资讯、班级荣誉、读书推荐、知识点管理等。</div>
							<el-col :span="6" class="manageorder">
								<router-link to="/releaseindex">
								<div><img src="/static/img/fabu.png" /></div>
								<div class="managetitle">发布管理</div>
								</router-link>
							</el-col>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" placement="bottom">
						   <div slot="content" style="width:200px;">录入学校的基础信息，如科目、班级、教室、教师、学生的数据；给子管理员开设系统账号和设置权限。</div>
							<el-col :span="6" class="manageorder">
								<router-link to="/educationindex">
									<div><img src="/static/img/jiaowu.png" /></div>
									<div class="managetitle">教务管理</div>
								</router-link>
							</el-col>
						</el-tooltip>
					</el-row>
				</div>
			</section>

		</main>
    <img src="/static/img/bg3.png" style="width: 100%;height:216px;position: fixed;bottom:0;left:0;z-index:10;" alt="">
		<el-dialog
			title="提示"
			:visible.sync="show"
			width="30%"
			center>
			<span>
						<img class="tips" src="/static/img/tip-war.png" alt="">
						检测到您购买的软件服务已到期，请及时联系您的代理商工
作人员进行续费，热线电话：0592-5223797。</span>
			<span slot="footer" class="dialog-footer">
				<el-button class="btn-ok" @click="show = false">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<style lang="scss">
//scoped 表示唯一
@import "@/assets/Scss/main.scss";
.center {
  // padding-bottom: 60px;
}
.el-dialog__header {
  text-align: left;
}
.el-dialog--center .el-dialog__footer {
  .dialog-footer {
    .btn-ok {
      background: rgba(255, 219, 51, 1);
      border: 1px solid #e6e6e6;
    }
    .btn-ok:hover {
      color: #ffffff;
    }
  }
}
.tips {
  width: 25px;
  height: 25px;
}
</style>
<script>
import Header from "@/components/publicTemplate/Header";
import { getSchoolStatistic, getMySchoolList } from "@/api/api.js";
import { formatDate } from "@/common/time/date.js";

export default {
  data() {
    return {
      flag: false,
      value: "",
      loginSchool: "",
      school: [],
      option: [],
      show: false,
      aptitude: "", //审核状态说明
      serviceEndTime: "",
      clientNum: "", //设备数量
      clientUsedNum: "" //已绑定设备数量
    };
  },
  mounted() {
    var that = this;
    //获取登录用户的学校列表
    // getMySchoolList().then(res => {
    // 	console.log('res.data.data',res.data.data)
    // 	this.option = res.data.data
    // 	// res.data.data.map(item => {
    // 	// 	this.option.push(iteim)
    // 	// 	// this.option.push({
    // 	// 	// 	schoolId: item.schoolId,
    // 	// 	// 	schoolName: item.schoolName
    // 	// 	// })
    // 	// })

    //   this.school = res.data.data
    //   console.log("s",this.option)
    // })
    //获取学校统计
    getSchoolStatistic({}).then(res => {
      if (res.data.code == 200) {
        var obj = res.data.data;
        //时间戳
        that.serviceEndTime = that.formatDate(obj.serviceEndTime);
        that.school = obj.schoolName;
        that.aptitude = obj.statusName;
        that.clientNum = obj.clientNum;
        that.clientUsedNum = obj.clientUsedNum;
        //console.log(new Date().getTime()/1000,new Date(that.serviceEndTime).getTime()/1000)
        if (
          new Date().getTime() / 1000 >
          new Date(that.serviceEndTime).getTime() / 1000
        ) {
          that.show = true;
        }
      }
    });
  },
  updated(){
    window.scrollTo(0,0)
  },
  methods: {
    //获取时间戳
    formatDate(time) {
      var time = time * 1000;
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    logout() {
      this.removeItem("token");
      this.clearLocalStorage();
      this.skip("login");
    },
    skip(type) {
      this.$router.push({
        name: type
      });
    },
    changeSchool:function(){
      skip('home')
    }
  },
  components: { Header }
};
</script>