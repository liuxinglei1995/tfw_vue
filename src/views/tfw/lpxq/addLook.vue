<template>
  <div>
    <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" @click="handleAddlookhouse">新房报备</el-button>
    <el-dialog :title="lookform.title" :visible.sync="lookopen" width="1000px" append-to-body v-if="lookopen">
      <el-form ref="lookform" :model="lookform" label-width="80px" :inline="true" v-loading="loading">
        <el-form-item label="标题" prop="title" label-width="60px">
          <el-input v-model="lookform.title" placeholder="请输入标题" clearable size="medium" style="width: 500px;" />
        </el-form-item>
        <div>
          <el-form-item label="到访时间" prop="customerReportingTime">
            <el-date-picker v-model="lookform.customerReportingTime" type="datetime" placeholder="选择到访时间"
                            value-format="yyyy-MM-dd hh:mm:ss">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="到访人数" prop="userNum">
            <el-input-number v-model="lookform.userNum" :min="1" :max="10" label="到访人数"></el-input-number>
          </el-form-item>
        </div>
        <div>
          <div v-if="choicelist">
            <div v-for="item in choicelist.customer ? JSON.parse(choicelist.customer) : [{}]" :key="item.value">
              <i > {{ item.name ? item.name : "--"
                }} {{ item.value }}</i>
              <el-button type="text" @click="choicelist=null">删除</el-button>
            </div>
          </div>

          <el-form-item label="选择用户" prop="xqname"  v-if="lookform.type == 1">
            <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"  label-width="68px">
            <el-input v-model="queryParams.customer" placeholder="请输入姓名/手机号/备注" clearable/>
            </el-form>
            <el-button @click="getList">搜索客户</el-button>
            <div v-for="(tourists,index) in touristsList">
              <div style="display: flex;justify-content:space-between;flex-direction: column; align-items: center;">
                <div v-for="item in tourists.customer ? JSON.parse(tourists.customer) : [{}]" :key="item.value"
                     style="display: flex;justify-content: space-around; margin-bottom: 10px;">
                  <i > {{ item.name ? item.name : "--"
                    }} {{ item.value }}</i>
                  <el-button type="text" @click="choice(tourists)">选择</el-button>
                </div>
                <div :class="[tourists.publicAndPrivate == 1 ? 'one' : 'two']" v-if="touristspublicAndPrivate">
                  <dict-tag :options="dict.type.tfw_khlx" :value="tourists.publicAndPrivate" />
                </div>
              </div>
            </div>
          </el-form-item>
        </div>
        <customeruser v-if="lookopen" v-model="lookform.andUserId"></customeruser>
        <el-form-item label="备注" prop="reason">
          <el-input v-model="lookform.reason" placeholder="请输入备注" clearable size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addlookform">确 定</el-button>
        <el-button @click="cancellook">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>



import { guestList } from '@/api/source/tourists'
import customeruser from "@/views/source/customeruser/index";
import { addReporting } from '@/api/workflow/reporting'

export default {
  dicts: ['tfw_wtly', 'tfw_khlx', 'tfw_wtdj', 'tfw_property_type', 'tfw_gjmd', 'tfw_wtlx', 'sys_user_sex', 'tfw_fuxing', 'tfw_look_type'],
  components: { customeruser },
  props: {
    loupandata:{

    }
  },
  data(){
    return {
      lookform: {},
      lookopen:false,
      xqids:[],
      loading: false,
      queryParams:{},
      count:0,
      touristsList:null,
      choicelist:null
    }
  },
  methods:{
    choice(data){
      this.choicelist=data
      this.touristsList =[]
      this.queryParams.customer=null
    },
    getList() {
      guestList(this.queryParams).then(response => {
        this.touristsList = response.rows;
        console.log(this.touristsList, "222222");

      });
    },
    // 确认
    addlookform(){
      if (this.lookform.andUserId) {
        this.lookform.andUserId = this.lookform.andUserId.join(',')
      }
      addReporting(this.lookform).then(response => {
        this.lookopen = false;
        this.$modal.msgSuccess(response.msg);
      })
    },
    // 取消
    cancellook(){
      this.reset();
      this.lookopen=false

    },
    //新增看房
    handleAddlookhouse() {
      this.reset();
      this.lookform.xqId.push(this.loupandata.id)
      this.lookform.xqId =  this.lookform.xqId.join(',');
      this.lookform.title = this.$store.getters.nickName + new Date().toLocaleString() + "看房记录"
      this.lookopen = true
    },
    reset(){
      this.lookform = {
        xqId: [],
        userOrSoureId: null,
        customerReportingTime: null,
        customer: null,
        customerId: null,
        type: "1",
        title: null,
        reason: null,
        leaveEndTime: null,
        attachmentLink: null,
        instanceId: null,
        state: null,
        createName: null,
        createBy: null,
        createTime: null,
        updateTime: null,
        userId: null,
        userNum: null,
        deptId: null,
        userType: 2,
      }
      this.resetForm("form");
    }
  },
  created () {
  },
}
</script>

<style lang="less" scoped>

</style>
