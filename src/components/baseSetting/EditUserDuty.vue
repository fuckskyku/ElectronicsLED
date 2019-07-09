<template>
  <div id="app">
    <main>
      <el-aside class="nav" style="width:100%">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">基础设置</el-breadcrumb-item>
          <el-breadcrumb-item to="/basesettingindex">账号管理</el-breadcrumb-item>
          <el-breadcrumb-item to="/userdutylist">职务管理</el-breadcrumb-item>
          <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="goback" @click="$router.push({name: 'userdutylist'})">
          <img src="/static/img/返回.png" alt="">返回
        </div>
      </el-aside>
      <div class="editInfo">
        <el-form ref="form" :model="form" label-width="280px" :rules="rules">
          <el-form-item label="职务名称:" prop="dutyName">
            <el-input v-model="form.dutyName" size="small" :disabled="dutyDisable"></el-input>
          </el-form-item>
          <el-form-item label="选择权限:">
            <table class="dataTable table-no-bordered" data-show-columns="false"></table>
          </el-form-item>
          <el-form-item style="text-align:center;">
            <el-button type="primary" @click="onSubmit('form')" class="submit">保存</el-button>
            <el-button class="cancel" type="info" @click="skip('userdutylist')">取消</el-button>
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
import { getDutyDetail, editDuty, getModulePermission } from "@/api/api";
import $ from "jquery";

export default {
  data() {
    return {
      dutyId: "",
      dutyDisable: false,
      form: {
        dutyName: "",
        permissionIds: ""
      },
      rules: {
        dutyName: [
          { required: true, message: "请填写职务名称", trigger: "blur" }
        ]
      },
      value: ""
    };
  },
  methods: {
    onSubmit(form) {
      var checkboxStr = document.getElementsByName("permission");
      var check_val = "";
      for (var i = 0; i < checkboxStr.length; i++) {
        if (checkboxStr[i].checked && checkboxStr[i].value != "0")
          check_val += checkboxStr[i].value + ",";
      }
      check_val =
        check_val != "" ? check_val.substring(0, check_val.length - 1) : "";
      this.$refs[form].validate(valid => {
        if (valid) {
          editDuty({
            DutyId: this.dutyId,
            DutyName: this.form.dutyName,
            PermissionIds: check_val
          }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: res.data.message
              });
              this.skip("userdutylist");
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
    skip(type, param) {
      this.$router.push({
        name: type
      });
    }
  },
  mounted() {
    var bootstrapTable;
    getModulePermission().then(res => {
      bootstrapTable = res.data.data;
      console.log(res.data.data)
      $(".dataTable").bootstrapTable({
        toggle: "table",
        data: bootstrapTable,
        sortName: "Level",
        sortOrder: "asc",
        idField: "Id",
        dataField: "rows",
        sidePagination: "server",
        columns: [
          { checkbox: true },
          { field: "Module.name", title: "模块", formatter: nameFormatter },
          {
            field: "Permissions",
            title: "权限分配",
            formatter: permissionFormatter
          }
        ],
        onCheck: function(row) {
          if (row.Module.modulelevel == 2) {
            $(
              "input[type='checkbox'][id='" +
                row.Permissions[0].permissionId +
                "']"
            )
              .parents("tr")
              .find("input[type='checkbox']")
              .prop("checked", true);
            $(".permission-error").addClass("hide");
          }
        },
        onUncheck: function(row) {
          if (row.Module.modulelevel == 2) {
            $(
              "input[type='checkbox'][id='" +
                row.Permissions[0].permissionId +
                "']"
            )
              .parents("tr")
              .find("input[type='checkbox']")
              .prop("checked", false);
          }
        },
        onCheckAll: function(row) {
          $(".dataTable input[type='checkbox']").prop("checked", true);
          $(".permission-error").addClass("hide");
        },
        onUncheckAll: function(row) {
          $(".dataTable input[type='checkbox']").prop("checked", false);
        }
      });
      this.dutyId = this.$route.params.id;
      if (this.dutyId > 0) {
        getDutyDetail({ id: this.dutyId }).then(res => {
          var obj = res.data.data;
          this.form = obj;
          if (
            obj.dutyName == "校长" ||
            obj.dutyName == "副校长" ||
            obj.dutyName == "年段长" ||
            obj.dutyName == "班主任"
          ) {
            this.dutyDisable = true;
          }

          var rolePermissions = obj.permissionIds;
          if (rolePermissions != "") {
            var array = rolePermissions.split(",");
            //hdList转化为数组并用list变量接收
            array.forEach(function(item) {
              $(".dataTable #" + item).prop("checked", true);
              $("input[type='checkbox'][id='" + item + "']")
                .parents("tr")
                .find(".bs-checkbox input[type='checkbox']")
                .prop("checked", true);
              $(".permission-error").addClass("hide");
            });
          }
        });
      }
    });

    function nameFormatter(value, row) {
      if (row.Module.modulelevel > 0) {
        var nbsp = "";
        for (var i = 0; i < row.Module.modulelevel; i++) {
          nbsp += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        value =
          nbsp +
          "<span style='color:#C9C9CF'>|--&nbsp;<i class='fa fa-folder-open'></i>&nbsp;&nbsp;</span>" +
          value;
      }
      return value;
    }

    //权限列调整
    function permissionFormatter(value, row) {
      if (value == undefined) return "";

      var response = "";
      for (var i = 0; i < value.length; i++) {
        response +=
          "<input name='permission' type='checkbox' value='" +
          value[i].permissionId +
          "' id='" +
          value[i].permissionId +
          "'  /><label for='" +
          value[i].permissionId +
          "'>" +
          value[i].name +
          "</label>&nbsp;&nbsp;&nbsp;";
      }
      return response;
    }
  },
  components: { Header }
};
</script>

