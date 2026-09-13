<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="contractList">
      <el-table-column label="合同编号" align="center" prop="no" />
      <el-table-column label="合同名称" align="center" prop="title">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1">{{ scope.row.title }}</span>
          <span v-else>{{ scope.row.tfwContractOut.community }}</span>
        </template>
      </el-table-column>
      <el-table-column label="甲方姓名" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.trilateralInformation">{{ scope.row.trilateralInformation.a_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="乙方姓名" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.trilateralInformation">{{ scope.row.trilateralInformation.b_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag v-if="scope.row.state === 1" :options="dict.type.tfw_contract" :value="scope.row.type" />
          <span v-else>外部合同</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-link v-if="scope.row.trilateralInformation" type="primary" :href="'/ifram?id=' + scope.row.id + '&type='+ scope.row.type + '&aname='+ scope.row.trilateralInformation.a_name + '&bname='+ scope.row.trilateralInformation.b_name" target="_blank"><i
            class="el-icon-view el-icon--right"></i><span style="font-size: 12px;">合同预览</span></el-link>

          <el-button v-if="scope.row.state === 2" size="mini" type="text" icon="el-icon-notebook-2" @click="showContractOut(scope.row)">合同详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-notebook-2" @click="processRecord(scope.row)">合同流程情况</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 合同模态框 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList" />

    <!-- 展示合同流程情况 -->
    <el-dialog title="合同流程" :visible.sync="processShow" width="50%" style="height: 95%">
      <procedure @flag="closeMain" :id="contract.id" :data="contract" :dialogFlag="processShow"></procedure>
    </el-dialog>

    <!-- 外部合同 -->
    <el-dialog title="外部合同" :visible.sync="outShow" width="50%" append-to-body>
      <div style="overflow-x: auto; height: 450px;">
        <el-form ref="contractOutForm" style="font-family: initial;">
          <el-row>
            <el-col :span="24"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="小区信息">
                <span>{{ contractOut.community }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="买方">
                <span>{{ contractOut.buyer }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="买方电话" prop="buyerPhone">
                <span>{{ contractOut.buyerPhone }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="卖方" prop="seller">
                <span>{{ contractOut.seller }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="卖方电话" prop="sellerPhone">
                <span>{{ contractOut.sellerPhone }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="中介" prop="intermediary">
                <span>{{ contractOut.intermediary }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="中介电话" prop="intermediaryPhone">
                <span>{{ contractOut.intermediaryPhone }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="成交经纪人" prop="broker">
                <span>{{ contractOut.broker }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="联系电话" prop="brokerPhone">
                <span>{{ contractOut.brokerPhone }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="成交价" prop="deal">
                <span>{{ contractOut.deal }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="定金" prop="deposit">
                <span>{{ contractOut.deposit }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="首付" prop="advance">
                <span>{{ contractOut.advance }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="10"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="资金监管" prop="remark">
                <span>{{ contractOut.remark }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款额" prop="loan">
                <span>{{ contractOut.loan }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款年限" prop="loanAge">
                <span>{{ contractOut.loanAge }}</span>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款服务费" prop="loanServe">
                <span>{{ contractOut.loanServe }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="入账服务费" prop="entryServe">
                <span>{{ contractOut.entryServe }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import { initNumber, isTimeExceeded } from '@/utils/activiti/myUtil'
import { listContractProcess2 } from "@/api/contract/contractProcess";

import procedure from '@/views/contract/procedure/index.vue';
import trilateralInformation from '@/views/contract/contract/trilateralInformation.vue'
function changeFrameHeight() {
  var iframe = document.getElementById("iframe");
  iframe.height = document.documentElement.clientHeight;
}
//onresize属性可以用来获取或设置当前窗口的resize事件的事件处理函数
//onresize事件会在窗口或框架被调整大小时发生
window.onresize = function () {
  changeFrameHeight();
}
export default {
  dicts: ['tfw_contract', 'tfw_ecommendation_level', 'tfw_property_type', 'tfw_state', 'contract_process'],
  name: "Contract",
  components: {
    trilateralInformation,
    procedure,
  },
  data() {
    return {
      //编辑天数
      contractEditData: 3,
      centerDialogVisible: false,
      // 合同预览id
      contractPreviewid: null,
      submitFormFlag: false,
      // 添加合同
      newopen: false,
      // 合同id
      contractid: null,
      activeName: 'first',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 合同表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        no: null,
        title: null,
        company: null,
        type: null,
        partyAStatus: null,
        partyBStatus: null,
        trilateralInformation: null,
        houseInformation: null,
        otherInformation: null,
        pricesDeals: null,
        createtime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      //用户id
      userId: null,
      //合同流程
      processShow: false,
      userList: [],
      contract: {},

      //外部合同预览
      outShow: false,
      contractOut: {},
    };
  },
  created() {
    this.userId = this.$store.state.user.userid;
    this.queryParams.userId = this.userId;
    this.getConfigKey('contract_edit_data').then(response => {
      this.contractEditData = initNumber(response.msg)
      this.getList();
    });
  },
  methods: {
    isTimeExceeded,
    /** 查询合同列表 */
    getList() {
      let editData = this.contractEditData
      this.loading = true;
      listContractProcess2(this.queryParams).then(response => {
        this.contractList = response.rows;
        this.contractList.forEach(function(item, index) {
          if (item.trilateralInformation) {
            item.trilateralInformation = JSON.parse(item.trilateralInformation)
          } else {
            item.trilateralInformation = null
          }
          //判断创建时间在指定天数内可编辑
          item.edit = isTimeExceeded(item.createtime, editData)
        })
        this.total = response.total;
        this.loading = false;
      });
    },

    //合同流程记录
    processRecord(row) {
      this.contract = row;
      this.processShow = true;
    },
    showContractOut(row) {
      console.log(row)
      this.contractOut = row.tfwContractOut;
      this.outShow = true;
    },
    closeMain(val) {
      this.processShow = val;
    },
  }
};
</script>
<style scoped>
.custom-div {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
