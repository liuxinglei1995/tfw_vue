<template>
  <div style="height: 100% ;width: 100%">
    <el-card class="box-card">
      <div class="text item">
        <div v-if="houseflag">
          <div v-if="housedata.type == 1">
            <h1>提示：</h1>
            尊敬的{{ this.housedata.phoneNumber[0].name }}你好 您委托的
            {{ housedata.xqname }}<br />
            {{ housedata.building }}栋{{ housedata.unit }}单元{{ housedata.floor }}楼{{ housedata.roomNum }}号<br />
            <div style="display: flex">
              <span style="margin-right: 10px;">面积{{ housedata.propertyArea }}平米 </span><dict-tag
                :options="dict.type.tfw_decoration_situation" :value="housedata.decoration" /><br />
            </div>
            委托挂牌出售价:{{ housedata.sellingPrice }}万
          </div>
          <div v-if="housedata.type == 2">
            <h1>提示：</h1>
            尊敬的{{ this.housedata.phoneNumber[0].name }}你好 您委托的
            {{ housedata.xqname }}<br />
            {{ housedata.building }}栋{{ housedata.unit }}单元{{ housedata.floor }}楼{{ housedata.roomNum }}号<br />
            <div style="display: flex">
              <span style="margin-right: 10px;">面积{{ housedata.propertyArea }}平米 </span><dict-tag
                :options="dict.type.tfw_decoration_situation" :value="housedata.decoration" /><br />
            </div>
            挂牌出租：{{ housedata.rental }}元<br />
            <div style="display: flex">
              出租类型： <dict-tag :options="dict.type.tfw_czlx" :value="housedata.rentalMethod" />
            </div>
            <div style="display: flex">
              付款方式： <dict-tag :options="dict.type.tfw_fkfs" :value="housedata.paymentMethod" />
            </div>
          </div>
          <div v-if="housedata.type == 3">
            <h1>提示：</h1>
            尊敬的{{ this.housedata.phoneNumber[0].name }}你好 您委托的
            {{ housedata.xqname }}<br />
            {{ housedata.building }}栋{{ housedata.unit }}单元{{ housedata.floor }}楼{{ housedata.roomNum }}号<br />
            <div style="display: flex;">
              <span style="margin-right: 10px;">面积{{ housedata.propertyArea }}平米 </span> <dict-tag
                :options="dict.type.tfw_decoration_situation" :value="housedata.decoration" />
            </div>
            委托挂牌出售价:{{ housedata.sellingPrice }}万<br />
            挂牌出租{{ housedata.rental }}元<br />
            <div style="display: flex">
              出租类型： <dict-tag :options="dict.type.tfw_czlx" :value="housedata.rentalMethod" />
            </div>
            <div style="display: flex">
              付款方式： <dict-tag :options="dict.type.tfw_fkfs" :value="housedata.paymentMethod" />
            </div>
          </div>
          本人同意委托给 (赶集好房) 代理销售 推广到天府网 平台展示请你查看确认信息后 将验证码告知 经纪人 确认委托。
          <div>服务佣金=成交后服务佣金收取成交价*{{ housedata.grade == 3 ? "1.8%" : "1.5%" }}</div>
          <div>根据成都住建要求:委托房屋租售需要提供 产权证照片身份证号 真实有效 ;如有司法查封和房屋内有意外事故发生请你如实告知给经纪人 谢谢你的配合!</div>
          <div v-if="isashow">调整为A级房源推广 佣金为成交价格*1.8%</div>
        </div>
      </div>
    </el-card>
    <el-card>

      <el-form ref="loginForm" :model="loginForm" class="login-form">
        <h3 class="title">天府网房源委托确认验证</h3>
        <el-form-item prop="phonenumber">
          <!-- <el-input v-model="loginForm.phonenumber" type="text" auto-complete="off" placeholder="手机号">
          </el-input> -->
          <el-select @change="change($event)" v-model="loginForm.phonenumber" placeholder="请选择手机号" style="width:150px">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
            <el-option v-for=" (dict, index) in housedata.phoneNumber" :key="index" :label="dict.value"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="code">
          <div style="display: flex">
            <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" style="width: 63%">
              <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
            </el-input>
            <div>
              <el-button @click="getcode()" class="login-code-img">
                <span v-if="iscode">获取验证码</span>
                <span v-else>已发送{{ formatTime(timer) }}</span>
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
            <span v-if="!loading">提交验证</span>
            <span v-else>验证成功</span>
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  getFangyuan, getphonecode, phoneCode, updateFangyuan
} from '@/api/fangyuan/fangyuan'
export default {
  dicts: ['tfw_czlx', 'tfw_fkfs', 'tfw_decoration_situation'],
  data() {
    return {
      loginForm: {
        phonenumber: "",
        houseId: "",
        rememberMe: false,
        code: "",
      },
      houseflag: false,
      housedata: null,
      loading: false,
      iscode: true,
      timer: 0,
      isashow: false
    }
  },
  methods: {
    change(e) {
      console.log(e)
    },
    formatTime(time) {
      // 将时间格式化为 hh:mm:ss 的形式
      let hour = Math.floor(time / 3600);
      let minute = Math.floor((time - hour * 3600) / 60);
      let second = Math.floor(time - hour * 3600 - minute * 60);
      return `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    },
    // 房源验证
    handleLogin() {
      phoneCode({ phonenumber: this.loginForm.phonenumber, code: this.loginForm.code, houseId: this.loginForm.houseId }).then(response => {
        this.$modal.msgSuccess(response.msg);
        console.log(response.msg);
        this.loading = true;
        if (response.msg == "操作成功") {
          updateFangyuan({ id: this.loginForm.houseId, grade: 3 }).then(res => {
            console.log(res, "llllllll");
            setTimeout(function () {
              window.opener = null;
              window.open("about:blank", "_top").close()
            }, 3000)
          })
        }
      })
    },
    //获取手机号验证码
    getcode() {
      if (this.loginForm.phonenumber) {
        getphonecode({ phonenumber: this.loginForm.phonenumber, houseId: this.loginForm.houseId }).then(response => {
          console.log(response, "kkkkkkkkkkkkk");
          this.$message({
            message: response.msg,
            type: 'success'
          });
          this.iscode = false;
          setInterval(() => {
            this.timer++;
          }, 1000);
        })
      } else {
        this.$message({
          message: '请确认填写信息',
          type: 'warning'
        });
      }

    },

  },
  created() {
    this.loginForm.houseId = this.$route.query.id
    this.isashow = this.$route.query.isok
    console.log(this.$route.query.isok, "5555555");
    getFangyuan(this.loginForm.houseId).then(response => {
      this.housedata = response.data
      this.houseflag = true
      this.housedata.phoneNumber = JSON.parse(this.housedata.phoneNumber)
      console.log(this.housedata.phoneNumber, "22222")
    })
  },

}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 480px;
  margin: auto;
}
</style>
