<template>
  <div>
    <el-row :gutter="0">
      <!--      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"-->
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px" label-position="top">
        <el-col :span="24">
          <el-row gutter="15">
            <el-col :span="8">
              <el-form-item label="成交价格(元)" prop="money">
                <el-input v-model="formData.money" placeholder="成交价格(元)" clearable :style="{ width: '100%' }">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="装修家电作价 如:物业专项维修基金,现有装修及附属设施...." prop="price_inclusion">
                <el-input v-model="formData.price_inclusion" placeholder="装修家电作价 如:物业专项维修基金,现有装修及附属设施...." clearable
                  :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="10">
          <el-form-item label="购房定金(元)" prop="deposit">
            <el-input v-model="formData.deposit" placeholder="购房定金(元)" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="物业交割保证金(元)" prop="guarantee">
            <el-input v-model="formData.guarantee" placeholder="物业交割保证金(元)" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资金监管" prop="funds_supervision_status">
            <el-radio-group v-model="formData.funds_supervision_status" size="medium">
              <el-radio v-for="(item, index) in funds_supervision_statusOptions" :key="index" :label="item.value"
                :disabled="item.disabled">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="付款方式" prop="payment_method">
            <el-radio-group v-model="formData.payment_method" size="medium">
              <el-radio v-for="(item, index) in payment_methodOptions" :key="index" :label="item.value"
                :disabled="item.disabled">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="formData.payment_method === '全款'">
          <el-row type="flex" align="bottom">
            <el-col :span="12">
              <el-form-item label="首款金额(元)" prop="initial_amount">
                <el-input v-model="formData.initial_amount" placeholder="首款金额(元)" clearable
                  :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资金监管方式" prop="supervise1">
                <el-select v-model="formData.supervise1" placeholder="请选择资金监管" clearable
                           :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in supervise" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" align="bottom">
            <el-col :span="12">
              <el-form-item label="二期金额(元)" prop="initial_amount_2">
                <el-input v-model="formData.initial_amount_2" placeholder="二期金额(元)" clearable
                  :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资金监管方式" prop="supervise2">
                <el-select v-model="formData.supervise2" placeholder="请选择资金监管" clearable
                           :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in supervise" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="start" align="bottom">
            <el-col :span="12">
              <el-form-item label="三期金额(元)" prop="initial_amount_3">
                <el-input v-model="formData.initial_amount_3" placeholder="二期金额(元)" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="资金监管方式" prop="supervise3">
                <el-select v-model="formData.supervise3" placeholder="请选择资金监管" clearable
                           :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in supervise" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" v-if="formData.payment_method === '按揭贷款'">
          <el-row type="flex" justify="start" align="bottom">
            <el-col :span="12">
              <el-form-item label="是否为住宅" prop="is_housing">
                <el-radio-group v-model="formData.is_housing" size="medium">
                  <el-radio v-for="(item, index) in is_housingOptions" :key="index" :label="item.value"
                    :disabled="item.disabled">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="贷款方式" prop="loan_options">
                <el-radio-group v-model="formData.loan_options" size="medium">
                  <el-radio v-for="(item, index) in loan_optionsOptions" :key="index" :label="item.value"
                    :disabled="item.disabled">{{ item.label }}</el-radio>
                </el-radio-group>
                <el-input v-model="formData.loan_options_other" placeholder="请填写其他 " clearable :style="{ width: '100%' }"
                  v-if="formData.loan_options === '其他'"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="start" align="bottom">
            <el-col :span="7">
              <el-form-item label="首付款金额" prop="initial_amount">
                <el-input v-model="formData.initial_amount" placeholder="首付款金额" clearable
                  :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="资金监管方式" prop="supervise1">
                <el-select v-model="formData.supervise1" placeholder="请选择资金监管" clearable
                           :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in supervise" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="贷款金额" prop="amount_of_second_phase_2">
                <el-input v-model="formData.amount_of_second_phase_2" placeholder="贷款金额" clearable
                  :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="贷款年限" prop="first_period_2">
                <el-input v-model="formData.first_period_2" placeholder="贷款年限" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item label="贷款资格" prop="first_period_2">
                <div>
                  <p>第一条 名下房屋：</p>
                  <p style="display: flex">买受人及买受人家庭在成都市已拥有
                    <el-input v-model="formData.haveHouses" type="number" placeholder="几套房" clearable style="width: 150px"></el-input>
                    套及以上（无论是否有贷款或是否结清相应贷款）住房。</p>
                </div>
                <div>
                  <p>第二条征信情况（头受人近半年内查询的征信报告显示）：</p>
                  <p>（一）买受人购房贷款未结清账户数
                    <el-input v-model="formData.to1" type="number" placeholder="账户数" clearable style="width: 150px"></el-input>，
                    其他贷款未结清账户数<el-input v-model="formData.to2" type="number" placeholder="账户数" clearable style="width: 120px"></el-input>，
                    累计未结清余额为¥<el-input v-model="formData.to3" type="number" placeholder="多少钱" clearable style="width: 150px"></el-input>元整。
                    发生过逾期的账户数<el-input v-model="formData.to4" type="number" placeholder="账户数" clearable style="width: 120px"></el-input>，
                    其中发生过90天以上逾期的账户数<el-input v-model="formData.to5" type="number" placeholder="账户数" clearable style="width: 120px"></el-input>个。</p>
                  <p>（二）买受共有人购房贷款未结清账户数<el-input v-model="formData.to6" type="number" placeholder="账户数" clearable style="width: 150px"></el-input>，
                    其他贷款未结清账户数<el-input v-model="formData.to7" type="number" placeholder="账户数" clearable style="width: 120px"></el-input>，
                    累计未结清余额为¥<el-input v-model="formData.to8" type="number" placeholder="多少钱" clearable style="width: 150px"></el-input>元整。
                    发生过逾期的账户数<el-input v-model="formData.to9" type="number" placeholder="账户数" clearable style="width: 120px"></el-input>，
                    其中发生过90天以上逾期的账户数<el-input v-model="formData.to10" type="number" placeholder="账户数" clearable style="width: 120px"></el-input>个。</p>
                </div>
              </el-form-item>
            </el-col>
          </el-row>


        </el-col>

        <el-col :span="24">
          <el-form-item label="*贷款事项约定" prop="loan_agreement">
            <el-select v-model="formData.loan_agreement" placeholder="请选择资金监管" clearable
                       :style="{ width: '100%' }">
              <el-option v-for="(item, index) in loan_agreements" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">保存当前页面信息</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { updateContract } from "@/api/contract/contract";
import { initNumber,numberToChineseUppercase } from '@/utils/activiti/myUtil'

export default {
  components: {},
  props: ['id', 'submitFormFlag', 'data'],
  data() {
    return {
      formData: {
        add_money: '',
        add_money_zh: '',
        money: '',
        money_zh: '',
        price_inclusion: '0',
        price_inclusion_zh: '',
        deposit: '',
        deposit_zh: '',
        deposit_time: '',
        guarantee: '5000',
        guarantee_zh: '',
        funds_supervision_status: '',
        payment_method: '',
        initial_amount: '',
        initial_amount_zh: '',
        first_period: '',
        amount_of_second_phase: '',
        amount_of_second_phase_zh: '',
        second_phase_time: '',
        payment_memo: '',
        is_housing: '',
        loan_options: '',
        loan_options_other: '',
        first_period_2: '',
        initial_amount_2: '',
        initial_amount_2_zh: '',
        initial_amount_3: '',
        initial_amount_3_zh: '',
        amount_of_second_phase_2: '',
        amount_of_second_phase_2_zh: '',
        payment_memo_2: '',
        payment_memo_2_zh: '',
        supervise1: '', //监管方式1
        supervise2: '', //监管方式2
        supervise3: '', //监管方式3
        loan_agreement: '乙方在过户递件前自行筹齐剩余房款，通过资金监管专用账户或通过银行转账转给甲方', //贷款事项约定
        //贷款资格事项
        haveHouses: '', //
        to1: '',
        to2: '',
        to3: '',
        to4: '',
        to5: '',
        to6: '',
        to7: '',
        to8: '',
        to9: '',
        to10: '',

      },
      rules: {
        money: [{
          required: true,
          message: '成交价格(元)',
          trigger: 'blur'
        }],
        price_inclusion: [{
          required: true,
          message: '装修家具作价 如:物业专项维修基金,现有装修及附属设施....',
          trigger: 'blur'
        }],
        deposit: [{
          required: true,
          message: '购房定金(元)',
          trigger: 'blur'
        }],
        deposit_time: [{
          required: true,
          message: '定金付款期限:时间条件',
          trigger: 'blur'
        }],
        guarantee: [{
          required: true,
          message: '交房保证金(元)',
          trigger: 'blur'
        }],
        funds_supervision_status: [{
          required: true,
          message: '资金监管不能为空',
          trigger: 'change'
        }],
        payment_method: [{
          required: true,
          message: '付款方式不能为空',
          trigger: 'change'
        }],
        initial_amount: [{
          required: true,
          message: '首款金额(元)',
          trigger: 'blur'
        }],
        first_period: [{
          required: true,
          message: '首款付款期限 如：过户前、资金监管 ',
          trigger: 'blur'
        }],
        amount_of_second_phase: [{
          required: true,
          message: '二期金额(元)',
          trigger: 'blur'
        }],
        second_phase_time: [{
          required: true,
          message: '二期付款期限 如：取件前，资金监管',
          trigger: 'blur'
        }],
        payment_memo: [],
      },
      funds_supervision_statusOptions: [{
        "label": "同意",
        "value": "同意"
      }, {
        "label": "不同意",
        "value": "不同意"
      }],
      payment_methodOptions: [{
        "label": "全款",
        "value": "全款"
      }, {
        "label": "按揭贷款",
        "value": "按揭贷款"
      }],
      is_housingOptions: [{
        "label": "住宅",
        "value": "住宅"
      }, {
        "label": "非住宅",
        "value": "非住宅"
      }],
      loan_optionsOptions: [{
        "label": "商业贷款",
        "value": "商业贷款"
      }, {
        "label": "公积金贷款",
        "value": "公积金贷款"
      },
      {
        "label": "公积金组合贷款",
        "value": "公积金组合贷款"
      },
      {
        "label": "其他",
        "value": "其他"
      }],
      supervise: [{
        "label": "房管局资金监管",
        "value": "房管局资金监管"
      }, {
        "label": "银行资金存管",
        "value": "银行资金存管"
      }, {
        "label": "自行支付",
        "value": "自行支付"
      }, {
        "label": "担保支付",
        "value": "担保支付"
      }, {
        "label": "公证提存",
        "value": "公证提存"
      }],
      loan_agreements: [{
        "label": "乙方在过户递件前自行筹齐剩余房款，通过资金监管专用账户或通过银行转账转给甲方",
        "value": "乙方在过户递件前自行筹齐剩余房款，通过资金监管专用账户或通过银行转账转给甲方"
      }, {
        "label": "本合同终止，乙方支付的定金和房款甲方应如数返还，双方互不承担违约责任，在申办贷款过程中发生的各项费用由乙方承担",
        "value": "本合同终止，乙方支付的定金和房款甲方应如数返还，双方互不承担违约责任，在申办贷款过程中发生的各项费用由乙方承担"
      }]
    }
  },
  computed: {},
  watch: {
    id: {
      handler() {
        this.resetForm()
        if (this.id) {
          this.getcontract()
        }

      },
      deep: true // 深度监听父组件传过来对象变化
    },
    data: {
      handler() {
        this.resetForm()
        if (JSON.parse(this.data.pricesDeals)) {
          this.formData = JSON.parse(this.data.pricesDeals)
        }
      },
      deep: true // 深度监听父组件传过来对象变化
    },
    submitFormFlag: {
      handler() {
        if (this.submitFormFlag) {
          this.submitForm()
        }
      },
      deep: true // 深度监听父组件传过来对象变化
    }
  },
  created() {
    if (JSON.parse(this.data.pricesDeals)) {
      this.formData = JSON.parse(this.data.pricesDeals)
    }
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        //总金额
        if(this.formData.money) this.formData.money_zh = numberToChineseUppercase(initNumber(this.formData.money));
        else this.formData.money_zh = ''

        if(this.formData.price_inclusion) this.formData.price_inclusion_zh = numberToChineseUppercase(initNumber(this.formData.price_inclusion));
        else this.formData.price_inclusion_zh = ''

        if(this.formData.deposit) this.formData.deposit_zh = numberToChineseUppercase(initNumber(this.formData.deposit));
        else this.formData.deposit_zh = ''

        if(this.formData.guarantee) this.formData.guarantee_zh = numberToChineseUppercase(initNumber(this.formData.guarantee));
        else this.formData.guarantee_zh = ''

        if(this.formData.initial_amount) this.formData.initial_amount_zh = numberToChineseUppercase(initNumber(this.formData.initial_amount));
        else this.formData.initial_amount_zh = ''

        if(this.formData.initial_amount_2) this.formData.initial_amount_2_zh = numberToChineseUppercase(initNumber(this.formData.initial_amount_2));
        else this.formData.initial_amount_2_zh = ''

        if(this.formData.initial_amount_3) this.formData.initial_amount_3_zh = numberToChineseUppercase(initNumber(this.formData.initial_amount_3));
        else this.formData.initial_amount_3_zh = ''

        if(this.formData.amount_of_second_phase_2) this.formData.amount_of_second_phase_2_zh = numberToChineseUppercase(initNumber(this.formData.amount_of_second_phase_2));
        else this.formData.amount_of_second_phase_2_zh = ''
        this.formData.add_money = 0;
        if(this.formData.money) this.formData.add_money += initNumber(this.formData.money)
        if(this.formData.price_inclusion) this.formData.add_money += initNumber(this.formData.price_inclusion)
        if(this.formData.add_money) this.formData.add_money_zh = numberToChineseUppercase(initNumber(this.formData.add_money))
        else this.formData.add_money_zh = ''

        if(this.formData.payment_method === '全款') {
          this.formData.loan_options = ''
          this.formData.loan_options_other = ''
          this.formData.amount_of_second_phase_2 = ''
          this.formData.first_period_2 = ''
        }
        console.log(this.formData)
        // TODO 提交表单
        updateContract({
          "id": this.id
          , "pricesDeals": JSON.stringify(this.formData)
        }).then(res => {
          if (this.submitFormFlag == true) {
            // this.$emit('flag',false);
          } else {
            this.$modal.msgSuccess("保存成功");
          }

        })
      })
    },
    resetForm() {
      this.formData = {
        add_money: '',
        add_money_zh: '',
        money: '',
        money_zh: '',
        price_inclusion: '0',
        price_inclusion_zh: '',
        deposit: '',
        deposit_zh: '',
        deposit_time: '',
        guarantee: '5000',
        guarantee_zh: '',
        funds_supervision_status: '',
        payment_method: '',
        initial_amount: '',
        initial_amount_zh: '',
        first_period: '',
        amount_of_second_phase: '',
        amount_of_second_phase_zh: '',
        second_phase_time: '',
        payment_memo: '',
        is_housing: '',
        loan_options: '',
        loan_options_other: '',
        first_period_2: '',
        initial_amount_2: '',
        initial_amount_2_zh: '',
        initial_amount_3: '',
        initial_amount_3_zh: '',
        amount_of_second_phase_2: '',
        amount_of_second_phase_2_zh: '',
        payment_memo_2: '',
        payment_memo_2_zh: '',
        supervise1: '', //监管方式1
        supervise2: '', //监管方式2
        supervise3: '', //监管方式3
        loan_agreement: '乙方在过户递件前自行筹齐剩余房款，通过资金监管专用账户或通过银行转账转给甲方', //贷款事项约定
        //贷款资格事项
        haveHouses: '', //
        to1: '',
        to2: '',
        to3: '',
        to4: '',
        to5: '',
        to6: '',
        to7: '',
        to8: '',
        to9: '',
        to10: '',
      }
    },

  }
}

</script>
<style></style>
