<template>
	<div id="app">
		<main>
          
          <el-aside class="nav" style="width:100%">
           <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
            <el-breadcrumb-item to="/basesettingindex">学校资源管理</el-breadcrumb-item>
            <el-breadcrumb-item to="/devicelist">设备管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="goback" @click="$router.push({name: 'devicelist'})">
                <img src="/static/img/返回.png" alt="">返回
              </div>
          </el-aside>
          <div class="editInfo">           
           <el-form ref="form" :model="form" label-width="280px" :rules="rules">
                <el-form-item label="绑定教室:" prop="roomId">
                      <el-select v-model="form.roomId" placeholder="请选择" style="min-width:300px;">
                                    <el-option v-for="item in options" :key="item.roomId" :label="item.buildingName+'：'+item.roomName+ (item.className!=null?'（'+item.className+'）':'')" :value="item.roomId"></el-option>
                            </el-select>
                      <div style="color:#888;"><i class="el-icon-warning"></i><span>找不到班级？去<a style="color:#00A4EF;" @click="skip('classroomlist')">添加教室</a></span></div>
                </el-form-item>
                <el-form-item label="操作系统:">
                     <el-input v-model="form.osInfo" size="small"></el-input>
                </el-form-item>
                <el-form-item label="MAC地址:" prop="mac">
                     <el-input v-model="form.mac" size="small"></el-input>
                 </el-form-item>
                <el-form-item label="页面轮播间隔时间:">
                   <template>
                      <div class="block">
                            <el-slider v-model="form.pageShowTime" :format-tooltip="showimeFormat"></el-slider>
                     </div>
                   </template>
                </el-form-item>
                <!-- <el-form-item label="图片占屏轮播:">
                     <el-switch v-model="form.isCarousel"  active-color="#FFDE2A"  inactive-color="#D6D6D6"></el-switch>
                     <span class="tip" style="margin-left:10px;"><i class="el-icon-warning"></i><span>去</span><a @click="skip('photolist')" style="padding-left:2px;color:#00A4EF;">设置轮播图片</a></span>
                 </el-form-item> -->
                <el-form-item label="定时开关机:">
                     <el-switch  v-model="form.timingSwitch" min="0" max="30"  active-color="#FFDE2A"  inactive-color="#D6D6D6" @change="switchtiming"></el-switch>
                 </el-form-item>
                 <el-form-item label="定时开机时间:" v-if="showTime">
                      <template>
                           <el-time-select  placeholder="起始时间" v-model="form.bootTime"  :picker-options="{ start: '00:00',  step: '00:15',   end: '23:45' }"> </el-time-select>
                      </template>
                 </el-form-item>
                 <el-form-item label="定时关机时间:" v-if="showTime">
                      <template>
                           <el-time-select  placeholder="结束时间"  v-model="form.shutdownTime"  :picker-options="{  start: '00:00',  step: '00:15',  end: '23:45', 
                               minTime: form.bootTime }"> </el-time-select>
                       </template>
                 </el-form-item>
                 <el-form-item style="text-align:left;margin-top:80px;">
                       <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
                       <el-button class="cancel" type="info"  @click="skip('devicelist')">取消</el-button>
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
import { getClientDetail, editClient,getBuildingList } from "@/api/api";

export default {
  data() {
    return {      
      options: [],
      form: {
        clientId: "",
        roomId:"",
        osInfo: "",
        mac: "",
        pageShowTime: 10,
        isCarousel: false,
        timingSwitch:false,
        bootTime:"6:00",
        shutdownTime:"22:00",
        bootTimeHour:0,
        bootTimeMinute:0,
        shutdownTimeHour:0,
        shutdownTimeMinute:0
      },
      rules: {
        roomId: [
          { required: true, message: "请选择教室", trigger: "blur" }
        ],
        mac: [
          { required: true, message: "请输入MAC地址", trigger: "blur" }
        ]
      },
      showTime:false,
      value: ""
    };
  },
  methods: {
    showimeFormat(value)
    {
    return value+"秒";
    },
    onSubmit(form) {
      //这里执行ajax
      this.$refs[form].validate(valid => {
        if (valid) {
          
          console.log(
            'clientId',this.form.clientId,
            'roomId',this.form.roomId,
            'osInfo',this.form.osInfo,
            'mac',this.form.mac,
            'pageShowTime',this.form.pageShowTime,
            'timingSwitch',this.form.timingSwitch,
            'isCarousel',this.form.isCarousel,
            'bootTimeHour:',parseInt(this.form.bootTime.split(':')[0]),
            'bootTimeMinute:',parseInt(this.form.bootTime.split(':')[1]),
            'shutdownTimeHour:',parseInt(this.form.shutdownTime.split(':')[0]),
            'shutdownTimeMinute:',parseInt(this.form.shutdownTime.split(':')[1])         
            )
          editClient({
            clientId: this.form.clientId,
            osInfo: this.form.osInfo,
            mac:this.form.mac,
            roomId:this.form.roomId,
            pageShowTime:this.form.pageShowTime,
            timingSwitch:this.form.timingSwitch,
            isCarousel:this.form.isCarousel,
            bootTimeHour:parseInt(this.form.bootTime.split(':')[0]),
            bootTimeMinute:parseInt(this.form.bootTime.split(':')[1]),
            shutdownTimeHour:parseInt(this.form.shutdownTime.split(':')[0]),
            shutdownTimeMinute:parseInt(this.form.shutdownTime.split(':')[1])
          }).then(res => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("devicelist");
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
    formatTooltip(val) {
         return val / 1000 +'秒';
    },
    skip(type,param) {
      this.$router.push({
        name: type
      });
    },
    switchtiming(e){
       this.showTime = e;
    }
  },
  mounted() {
    this.form.clientId= this.$route.params.id;
    if (this.form.clientId > 0) {
      getClientDetail({ id: this.form.clientId }).then(res => {
        var obj = res.data.data;
        this.form = obj;
        this.form.pageShowTime = obj.pageShowTime/1000;
      });
    }
     //获取教室数据
     getBuildingList({ pageSize: 10000 }).then(res => {
      this.options = res.data.data.list;
    });
  },
  components: { Header }
};
</script>