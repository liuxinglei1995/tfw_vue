<template>
  <div class="app-container" v-loading="loading" >

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="合同类型" prop="state" oninput="">
        <el-radio-group v-model="queryParams.state" @input="radioChang">
          <el-radio-button label="1">内部合同</el-radio-button>
          <el-radio-button label="2">外部合同</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="中介公司" prop="company">
        <el-input v-model="queryParams.intermediary" placeholder="请输入创建公司" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="贷款银行" prop="company">
        <el-input v-model="queryParams.bank" placeholder="请输入创建公司" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建人" prop="company">
        <el-input v-model="queryParams.nickName" placeholder="请输入创建人" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createtime">
        <el-date-picker clearable v-model="queryParams.createtime" type="date" value-format="yyyy-MM-dd"
                        placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['contract:contractOut:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['contract:contractOut:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini"
                   v-hasPermi="['contract:contract:export']">导出</el-button>
      </el-col>
    </el-row>

    <el-table :data="contractOutList" :row-style="{ height: '100px' }" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand" v-if="props.row.tfwContractOut">
            <el-row>
              <el-col :span="4">
                <el-form-item label="买方">
                  <span>{{ props.row.tfwContractOut.buyer }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="买方联系电话">
                  <span>{{ props.row.tfwContractOut.buyerPhone }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="卖方">
                  <span>{{ props.row.tfwContractOut.seller }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="卖方联系电话">
                  <span>{{ props.row.tfwContractOut.sellerPhone }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="成交价">
                  <span>{{ props.row.tfwContractOut.deal }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="定金">
                  <span>{{ props.row.tfwContractOut.deposit }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="首付">
                  <span>{{ props.row.tfwContractOut.advance }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="贷款年限">
                  <span>{{ props.row.tfwContractOut.loanAge }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="资金监管">
                  <span>{{ props.row.tfwContractOut.remark }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="贷款服务费">
                  <span>{{ props.row.tfwContractOut.loanServe }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="贷款服务费入账">
                  <span>{{ props.row.tfwContractOut.loanEntryServe }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="贷款返利情况">
                  <span>{{ props.row.tfwContractOut.loanState }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="props.row.tfwContractOut.loanState !== '否'">
                <el-form-item label="贷款服务费返利">
                  <span>{{ props.row.tfwContractOut.loanServe - props.row.tfwContractOut.loanEntryServe }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="银行返点">
                  <span>{{ props.row.tfwContractOut.bankServe }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="银行返点入账">
                  <span>{{ props.row.tfwContractOut.bankEntryServe }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="银行返点情况">
                  <span>{{ props.row.tfwContractOut.bankState }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="4" v-if="props.row.tfwContractOut.bankState !== '否'">
                <el-form-item label="银行返点返利">
                  <span>{{ props.row.tfwContractOut.bankServe - props.row.tfwContractOut.bankEntryServe }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column label="小区信息" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tfwContractOut">{{ scope.row.tfwContractOut.community }}</span>
          <span v-else>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中介公司" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.tfwContractOut" class="item" effect="dark" :content="`phone: ${scope.row.tfwContractOut.intermediaryPhone}`" placement="top">
            <span>{{ scope.row.tfwContractOut.intermediary }}</span>
          </el-tooltip>
          <span v-else>赶集好房</span>
        </template>
      </el-table-column>
      <el-table-column label="经纪人" align="center">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.tfwContractOut" class="item" effect="dark" :content="`phone: ${scope.row.tfwContractOut.brokerPhone}`" placement="top">
            <span>{{ scope.row.tfwContractOut.broker }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="贷款银行" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tfwContractOut">{{ scope.row.tfwContractOut.bank }}</span>
          <span v-else>
            {{initText(scope.row.processMap['银行贷款批贷']).bank}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="贷款额" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tfwContractOut">{{ scope.row.tfwContractOut.loan }}</span>
          <span v-else>
            {{initText(scope.row.processMap['银行贷款批贷']).bank}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="总服务费" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tfwContractOut">{{ scope.row.tfwContractOut.loanServe + scope.row.tfwContractOut.bankServe }}</span>
          <span v-else-if="scope.row.type === '3'">{{ initNumber(scope.row.otherInformation.field104) + initNumber(initText(scope.row.processMap['银行贷款批贷']).bankServe)}}</span>
          <span v-else>{{ initNumber(scope.row.otherInformation.commercial_loan_service_fees) + initNumber(initText(scope.row.processMap['银行贷款批贷']).bankServe)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="总入账" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.tfwContractOut">{{ scope.row.tfwContractOut.loanEntryServe + scope.row.tfwContractOut.bankEntryServe}}</span>
          <span v-else-if="scope.row.type === '3'">
            {{ initNumber(scope.row.otherInformation.field104) +
              initNumber(initText(scope.row.processMap['银行贷款批贷']).bankServe) -
              initNumber(initText(scope.row.processMap['银行贷款批贷']).bankPayServe) -
              initNumber(initText(scope.row.processMap['银行贷款面签']).loanPayServe)
            }}
          </span>
          <span v-else>
            {{ initNumber(scope.row.otherInformation.commercial_loan_service_fees) +
              initNumber(initText(scope.row.processMap['银行贷款批贷']).bankServe) -
              initNumber(initText(scope.row.processMap['银行贷款批贷']).bankPayServe) -
              initNumber(initText(scope.row.processMap['银行贷款面签']).loanPayServe)
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="nickName" />
      <el-table-column label="创建时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createtime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.edit && scope.row.tfwContractOut" size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['contract:contractOut:edit']">填写</el-button>
          <el-button size="mini" type="text" icon="el-icon-notebook-2" @click="processRecord(scope.row)">合同流程情况</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 合同模态框 -->
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getDataList" />

    <!-- -->
    <el-dialog :title="outTitle" :visible.sync="outFrom" width="50%" append-to-body :before-close="handleClose">
      <div style="overflow-x: auto; height: 450px;">
        <el-form label-position="left" label-width="130px"  ref="contractOutForm" :model="contractOutForm" :rules="rules" style="font-family: initial;">
          <el-row>
            <el-col :span="23"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="小区信息" prop="community">
                <el-input v-model="contractOutForm.community" placeholder="请输入合同小区信息（如：世纪金沙5栋1单元702）" style="width: 99%"/>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="买方" prop="buyer">
                <el-input v-model="contractOutForm.buyer" placeholder="请输入买方信息" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="买方电话" prop="buyerPhone">
                <el-input v-model="contractOutForm.buyerPhone" placeholder="请输入买方联系电话" style="width: 85%"/>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="卖方" prop="seller">
                <el-input v-model="contractOutForm.seller" placeholder="请输入卖方信息" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="卖方电话" prop="sellerPhone">
                <el-input v-model="contractOutForm.sellerPhone" placeholder="请输入卖方联系电话" style="width: 85%"/>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="中介" prop="intermediary">
                <el-input v-model="contractOutForm.intermediary" placeholder="请输入中介信息" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="中介电话" prop="intermediaryPhone">
                <el-input v-model="contractOutForm.intermediaryPhone" placeholder="请输入中介联系电话" style="width: 85%"/>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="成交经纪人" prop="broker">
                <el-input v-model="contractOutForm.broker" placeholder="请输入成交经纪人信息" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="联系电话" prop="brokerPhone">
                <el-input v-model="contractOutForm.brokerPhone" placeholder="请输入成交经纪人联系电话" style="width: 85%"/>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="成交价" prop="deal">
                <el-input v-model="contractOutForm.deal" placeholder="请输入成交价格" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="定金" prop="deposit">
                <el-input v-model="contractOutForm.deposit" type="number" placeholder="请输入定金金额" style="width: 85%"/>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="首付" prop="advance">
                <el-input v-model="contractOutForm.advance" type="number" placeholder="请输入首付金额" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="资金监管" prop="remark">
                <el-select v-model="contractOutForm.remark" placeholder="请选择" style="width: 85%">
                  <el-option label="是" value="是"></el-option>
                  <el-option label="否" value="否"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款银行" prop="loan">
                <el-input v-model="contractOutForm.bank" placeholder="请输入贷款银行" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款额" prop="loan">
                <el-input v-model="contractOutForm.loan" type="number" placeholder="请输入贷款金额" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款年限" prop="loanAge">
                <el-input v-model="contractOutForm.loanAge" type="number" placeholder="请输入贷款年限" style="width: 85%"/>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款服务费" prop="loanServe">
                <el-input v-model="contractOutForm.loanServe" type="number" placeholder="请输入贷款服务费" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <div style="width: 100%">
                <el-form-item label="贷款入账服务费" prop="loanEntryServe">
                  <el-input v-model="contractOutForm.loanEntryServe" type="number" placeholder="请输入入账服务费" style="width: 85%"/>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="贷款服务返利" prop="loanState">
                <el-select v-model="contractOutForm.loanState" placeholder="请选择返利情况" style="width: 85%">
                  <el-option label="否" value="否"></el-option>
                  <el-option label="返私" value="返私"></el-option>
                  <el-option label="返公" value="返公"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="银行返点" prop="loan">
                <el-input v-model="contractOutForm.bankServe" placeholder="请输入贷款银行返点" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="银行返点入账" prop="loan">
                <el-input v-model="contractOutForm.bankEntryServe" placeholder="请输入贷款银行返点" style="width: 85%"/>
              </el-form-item>
            </el-col>
            <el-col :span="12"> <!-- 占据12栅格，即一半宽度 -->
              <el-form-item label="银行返点返利" prop="bankState">
                <el-select v-model="contractOutForm.bankState" placeholder="请选择返利情况" style="width: 85%">
                  <el-option label="否" value="否"></el-option>
                  <el-option label="返私" value="返私"></el-option>
                  <el-option label="返公" value="返公"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button @click="saveContractOut('contractOutForm')">确定</el-button>
            <el-button @click="outFrom = false">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>

    <!-- 展示合同流程情况 -->
    <el-dialog title="合同流程" :visible.sync="processShow" width="50%" style="height: 95%">
      <procedure @flag="closeMain" :id="contract.id" :data="contract" :dialogFlag="processShow"></procedure>
    </el-dialog>
  </div>
</template>
<script>

import { getContractOut, delContractOut, addContractOut, updateContractOut } from "@/api/contract/contractOut";
import ImagePreviewHouse from '@/views/fangyuan/ImagePreviewHouse/index.vue'
import { getContract, listContract } from '@/api/contract/contract'
import { addContractProcess, listContractProcess, updateContractProcess } from '@/api/contract/contractProcess'
import { listUser2 } from '@/api/system/user'
import { initNumber, isTimeExceeded } from '@/utils/activiti/myUtil'
import procedure from '@/views/contract/procedure/index.vue'

function changeFrameHeight() {
  var iframe = document.getElementById("iframe");
  iframe.height = document.documentElement.clientHeight;
}
window.onresize = function () {
  changeFrameHeight();
}
export default {
  dicts: ['contract_process'],
  components: {
    procedure,
    ImagePreviewHouse
  },
  name: "Contract",
  data() {
    return {
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
      contractOutList: [],
      queryParams: {
        state: 2,
        intermediary: null,
        bank: null,
        nickName: null,
        types: [],
      },
      contractOutForm: {
        community: "",
        buyer: "",
        buyerPhone: "",
        seller: "",
        sellerPhone: "",
        intermediary: "",
        intermediaryPhone: "",
        broker: '',
        brokerPhone: '',
        deal: '',
        deposit: '',
        advance: '',
        loan: '',
        loanAge: '',
        loanEntryServe: '',
        loanState: '',
        remark: '',
        bank: '',
        bankServe: '',
        bankEntryServe: '',
        bankState: ''
      },
      //编辑外部合同
      outFrom: false,
      outTitle: "",
      // 外部合同填写规则
      rules: {
        community: [
          { required: true, message: '请输入合同小区信息（如：世纪金沙5栋1单元702）', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        buyer: [
          { required: true, message: '请输入买方人员信息', trigger: 'blur' },
        ],
        buyerPhone: [
          { required: true, message: '请输入买方联系电话', trigger: 'blur' },
        ],
        seller: [
          { required: true, message: '请输入卖方人员信息', trigger: 'blur' },
        ],
        sellerPhone: [
          { required: true, message: '请输入卖方人员联系电话', trigger: 'blur' },
        ],
        intermediary: [
          { required: true, message: '请输入中介信息', trigger: 'blur' },
        ],
        intermediaryPhone: [
          { required: true, message: '请输入中介联系电话', trigger: 'blur' },
        ],
        broker: [
          { required: true, message: '请输入经纪人信息', trigger: 'blur' },
        ],
        brokerPhone: [
          { required: true, message: '请输入经纪人联系电话', trigger: 'blur' },
        ],
        deal: [
          { required: true, message: '请输入成交价格', trigger: 'blur' },
        ],
        deposit: [
          { required: true, message: '请输入定金金额', trigger: 'blur' },
        ],
        advance: [
          { required: true, message: '请输入首付金额', trigger: 'blur' },
        ],
        loan: [
          { required: true, message: '请输入贷款金额', trigger: 'blur' },
        ],
        loanAge: [
          { required: true, message: '请输入贷款年限', trigger: 'blur' },
        ],
        loanServe: [
          { required: true, message: '请输入贷款服务费', trigger: 'blur' },
        ],
        loanEntryServe: [
          { required: true, message: '请输入入账服务费', trigger: 'blur' },
        ],
        remark: [
          { required: true, message: '选择是否资金监管', trigger: 'blur' },
        ],
        bank: [
          { required: true, message: '请填写贷款银行', trigger: 'blur' },
        ],
      },
      contract: {},
      //合同流程
      processShow: false,
    };
  },
  created() {
    // if(this.$store.state.user.userid !== 1 && this.$store.state.user.userid !== 116) this.queryParams.userId = this.$store.state.user.userid
    this.getDataList();
  },
  methods: {
    initNumber,
    getDataList() {
      this.loading = true
      listContract(this.queryParams).then(res => {
        if(this.queryParams.state === '1') {
          res.rows.forEach(function(item, index) {
            if (item.otherInformation) {
              item.otherInformation = JSON.parse(item.otherInformation)
            } else {
              item.otherInformation = null
            }
          })
        }
        this.contractOutList = res.rows;
        this.total = res.total;
        this.loading = false
      })
    },
    radioChang(val) {
      if (val === '1') this.queryParams.types = [1,3]
      if (val === '2') this.queryParams.types = []
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getDataList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.bank = null;
      this.queryParams.intermediary = null;
      this.queryParams.nickName = null;
      this.queryParams.state = 2;
      this.queryParams.types = []
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.outTitle = "新增外部合同";
      this.outFrom = true;
      this.loading = false;
    },
    // 表单重置
    reset() {
      this.contractOutForm = {
        community: "",
        buyer: "",
        buyerPhone: "",
        seller: "",
        sellerPhone: "",
        intermediary: "",
        intermediaryPhone: "",
        broker: '',
        brokerPhone: '',
        deal: '',
        deposit: '',
        advance: '',
        loan: '',
        loanAge: '',
        loanEntryServe: '',
        loanState: '',
        remark: '',
        bank: '',
        bankServe: '',
        bankEntryServe: '',
        bankState: ''
      };
      this.resetForm("contractOutForm");
    },
    //保存外部合同
    saveContractOut(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.contractOutForm.id != null) {
            updateContractOut(this.contractOutForm).then(res => {
              this.outFrom = false;
              this.getDataList();
            })
          } else {
            addContractOut(this.contractOutForm).then(res => {
              this.outFrom = false;
              this.getDataList();
            })
          }
        } else {
          return false;
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = this.ids[0];
      this.$modal.confirm('是否确认删除合同编号为"' + ids + '"的数据项？').then(function() {
        return delContractOut(ids);
      }).then(() => {
        this.getDataList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },

    handleUpdate(row) {
      this.reset();
      this.contractid = row.outId || this.ids[0]
      const id = row.outId || this.ids[0]
      getContractOut(id).then(response => {
        this.contractOutForm = response.data;
        this.outFrom = true;
        this.outTitle = "修改外部合同";
      });
    },
    processRecord(row) {
      this.contract = row;
      if (this.contract.trilateralInformation) {
        try {
          this.contract.trilateralInformation = JSON.parse(this.contract.trilateralInformation)
        } catch (e) {}
      } else {
        this.contract.trilateralInformation = null
      }
      this.processShow = true;
    },
    initText(value) {
      try {
        return JSON.parse(value.content)
      } catch (e) {
        return { title: null,
          no: null,
          wy: null,
          deposite: null, //首付款
          deposit: null, //已付定金
          estimate: null, //银行评估价
          type: null, //贷款类型
          bank: null, //贷款银行
          subBank: null, //贷款支行
          duration: null, //贷款年限
          sum: null, //贷款金额
          mode: null, // 还款模式
          sets: null, //贷款套数
          rate: null, //贷款利率
          limit: null, //交税取新证
          text: null, //其他
          bankServe: 0,
          bankPayServe: 0,
          loanPayServe: 0 }
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
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
