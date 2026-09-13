<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px" disabled :inline="true">
    <el-form-item label="用户昵称" prop="nickName">
      <el-input v-model="user.nickName" maxlength="30" />
    </el-form-item>
    <el-form-item label="所属门店" prop="deptName" label-width="80px">
      <el-input v-model="user.dept.deptName" maxlength="11" />
    </el-form-item>
    <el-form-item label="经纪人从业证号" prop="no" label-width="120px">
      <el-input v-model="user.no" maxlength="11" />
    </el-form-item>
    <el-form-item label="外网展示手机号" prop="utel" label-width="120px">
      <el-input v-model="user.utel" maxlength="11">
        <template slot="prepend">4008162019,</template>
      </el-input>
    </el-form-item>
    <!-- <el-form-item label="身份证号" prop="email">
      <el-input v-model="user.email" maxlength="50" />
    </el-form-item> -->
    <!-- <el-form-item>
      <el-button type="primary" size="mini" @click="submit">保存</el-button>
      <el-button type="danger" size="mini" @click="close">关闭</el-button>
    </el-form-item> -->
  </el-form>
</template>

<script>
import { updateUserProfile } from "@/api/system/user";
export default {
  props: {
    user: {
      type: Object
    }
  },
  data() {
    return {
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
        email: [
          { required: true, message: "身份证号不能为空", trigger: "blur" },
          {
            pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请输入正确的身份证号",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserProfile(this.user).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
