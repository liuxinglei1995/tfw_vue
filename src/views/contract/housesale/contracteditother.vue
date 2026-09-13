<template>
  <div>
    <el-form ref="elForm" :inline="true" :model="formData" size="medium" label-width="140px" label-position="left">
      <el-col>
        <el-form-item label="产权转移" prop="ownership_transfer_time">
          <el-input-number v-model="formData.ownership_transfer_time"
                           placeholder="产权转移时间"></el-input-number>个工作日内
        </el-form-item>
      </el-col>

      <el-row>
        <el-col>
          <el-form-item label="出卖方承担税费">
            <div style="display: flex;">
              <div v-for="(item, index) in categories_taxes" style="display: flex;margin-left: 15px">
                <input
                  type="checkbox"
                  name="sell_pop"
                  :value="item.value"
                  :id="item.value"
                  v-model="formData.sell_pop"
                >
                <label :for="item.value">{{ item.label }}</label>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="买受方承担税费" prop="taxes">
            <div style="display: flex;">
              <div v-for="(item, index) in categories_taxes" style="display: flex;margin-left: 15px">
                <input
                  type="checkbox"
                  name="buy_pop"
                  :value="item.value"
                  :id="item.value"
                  v-model="formData.buy_pop"
                >
                <label :for="item.value">{{ item.label }}</label>
              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="维修基金" prop="maintenance">
            <el-select v-model="formData.maintenance" placeholder="请选择维修基金承担方" clearable :style="{ width: '100%' }" @change="initWaterPosition(formData.water_leak)">
              <el-option v-for="(item, index) in mutual" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="政策房税费" prop="resettle">
            <el-select v-model="formData.resettle" placeholder="请选择政策房税费承担方" clearable :style="{ width: '100%' }" @change="initWaterPosition(formData.water_leak)">
              <el-option v-for="(item, index) in mutual" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="土地转让金" prop="transfers">
            <el-select v-model="formData.transfers" placeholder="请选择土地转让金承担方" clearable :style="{ width: '100%' }" @change="initWaterPosition(formData.water_leak)">
              <el-option v-for="(item, index) in mutual" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="中介服务费" prop="a_service_fee">
            出卖方（元）
            <el-input v-model="formData.a_service_fee" placeholder="甲方付丙方" clearable
                      :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="b_service_fee">
            买受方（元）
            <el-input v-model="formData.b_service_fee" placeholder="乙方付丙方" clearable
                      :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="非正常死亡" prop="die">
            <el-radio-group v-model="formData.die" size="medium">
              <el-radio v-for="(item, index) in dieOptions" :key="index" :label="item.value"
                        :disabled="item.disabled">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="是否漏水" prop="water_leak">
            <el-select v-model="formData.water_leak" placeholder="请选择是否漏水" clearable :style="{ width: '100%' }" @change="initWaterPosition(formData.water_leak)">
              <el-option v-for="(item, index) in waters" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled" ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="" prop="water_position" size="small">
            <div style="display: flex;" v-if="formData.water_leak === '存在'">
              <div v-for="(item, index) in water_positions" style="display: flex;margin-left: 15px">
                <input
                  type="checkbox"
                  name="water_positions"
                  :value="item.value"
                  :id="item.value"
                  v-model="formData.water_position"
                >
                <label :for="item.value">{{ item.label }}</label>

              </div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="墙面是否脱皮、起泡" prop="water_leak_2">
            <el-select v-model="formData.water_leak_2" placeholder="请选择墙面是否脱皮、起泡" clearable :style="{ width: '100%' }" @change="initWaterPosition(formData.water_leak)">
              <el-option v-for="(item, index) in waters" :key="index" :label="item.label"
                         :value="item.value" :disabled="item.disabled" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="water_leak_2_position" size="small" v-if="formData.water_leak_2 === '存在'">
            <el-input v-model="formData.water_leak_2_position" placeholder="位置" clearable
                      :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="是否代办签署合同" prop="agency">
            <el-radio-group v-model="formData.agency" size="medium">
              <el-radio v-for="(item, index) in agencyOptions" :key="index" :label="item.value"
                        :disabled="item.disabled">{{
                  item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label="是否委托丙方办理过户/按揭贷款" prop="loan_agency">
            <el-radio-group v-model="formData.loan_agency" size="medium">
              <el-radio v-for="(item, index) in loan_agencyOptions" :key="index" :label="item.value"
                        :disabled="item.disabled">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item v-if="formData.loan_agency === '同意'" label="服务费" prop="commercial_loan_service_fees">
            <el-input v-model="formData.commercial_loan_service_fees" placeholder="服务费" clearable
                      :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
      <el-form-item label="房屋交付" prop="delivery">
        收齐本合同成交价款(物业交割费除外)<el-input-number v-model="formData.delivery" :min="1" :max="100" label="房屋交付日期"></el-input-number>日内，甲方将该房屋交付给乙方

      </el-form-item>
      </el-col>
      </el-row>

      <el-col>
        <el-form-item label="其他约定" prop="other_engagements">
          <el-input style="width: 800px" size="medium" v-model="formData.other_engagements" type="textarea"
                    placeholder="请输入其他约定" :autosize="{ minRows: 4, maxRows: 4 }"></el-input>
        </el-form-item>
      </el-col>

      <el-col style="display: flex">
        <el-form-item label="产权证/产调" prop="image1">
          <image-upload v-model="formData.image1" :limit="1" />
        </el-form-item>
        <el-form-item prop="image2">
          <image-upload v-model="formData.image2" :limit="1" />
        </el-form-item>
        <el-form-item prop="image3">
          <image-upload v-model="formData.image3" :limit="1" />
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="业主身份证人像面照片" prop="image4">
          <image-upload v-model="formData.image4" :limit="1" />
        </el-form-item>
        <el-form-item label="" prop="image5">
          <image-upload v-model="formData.image5" :limit="1" />
        </el-form-item>
        <el-form-item label="" prop="image6">
          <image-upload v-model="formData.image6" :limit="1" />
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="业主身份证国徽面" prop="image7">
          <image-upload v-model="formData.image7" :limit="1" />
        </el-form-item>
        <el-form-item label="" prop="image8">
          <image-upload v-model="formData.image8" :limit="1" />
        </el-form-item>
        <el-form-item label="" prop="image9">
          <image-upload v-model="formData.image9" :limit="1" />
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="购买方身份证人像面照片" prop="image10">
          <image-upload v-model="formData.image10" :limit="1" />
        </el-form-item>
        <el-form-item label="" prop="image11">
          <image-upload v-model="formData.image11" :limit="1" />
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="购买方身份证国徽面" prop="image12">
          <image-upload v-model="formData.image12" :limit="1" />
        </el-form-item>
        <el-form-item label="" prop="image13">
          <image-upload v-model="formData.image13" :limit="1" />
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="其他证件" prop="image14">
          <image-upload v-model="formData.image14" :limit="1" />
        </el-form-item>
      </el-col>

      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">保存当前页面信息</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import {
  updateContract
} from "@/api/contract/contract";
import { initNumber,numberToChineseUppercase } from '@/utils/activiti/myUtil'


export default {
  components: {},
  props: ['id', 'submitFormFlag', 'data'],
  dicts: ['tfw_featured_tags'],
  data() {
    return {
      formData: {
        skgs: '',
        ownership_transfer_time: '60',
        taxes: '',
        a_service_fee: '',
        a_service_fee_zh: '',
        b_service_fee: '',
        b_service_fee_zh: '',
        limited_sale: '',
        judicial_seizures: '',
        qualifications: '',
        house_loans: '',
        die: '',
        water_leak: '',
        water_position: [''],
        water_position_str: '',
        water_leak_2: '', //墙面是否
        water_leak_2_position: '', //墙面脱皮起泡位置
        sell_pop: [],//出卖人税费
        sell_pop_str: '',//出卖人税费
        buy_pop: [],//买受人税费
        buy_pop_str: '',//买受人税费
        maintenance: '买受人',
        resettle: '买受人', //安置房契费
        transfers: '买受人', //土地转让金
        agency: '',
        loan_agency: '',
        commercial_loan_service_fees: '2000',
        commercial_loan_service_fees_zh: '2000',
        cpf_service_fees: '',
        combination_service_fees: '',
        delivery: 3,
        other_engagements: '1、甲乙双方已认真阅读以上条款并签字认可，2、乙方确认本人有购房资格，同时征信没有进入黑名单；3、甲方确认没有隐瞒潜在查封本房屋债务风险；',
        image1: null,
        image4: null,
        image5: null,
        image6: null,
        image7: null,
        image8: null,
        image9: null,
        image10: null,
        image11: null,
        image12: null,
        image13: null,
        image14: null,
      },
      rules: {
        skgs: [{
          required: true,
          message: '收款公司不能为空',
          trigger: 'change'
        }],
        ownership_transfer_time: [{
          required: true,
          message: '多少个工作日',
          trigger: 'blur'
        }],
        taxes: [{
          required: true,
          message: '请选择税费',
          trigger: 'change'
        }],
        a_service_fee: [{
          required: true,
          message: '甲方付丙方',
          trigger: 'blur'
        }],
        b_service_fee: [{
          required: true,
          message: '乙方付丙方',
          trigger: 'blur'
        }],
        limited_sale: [{
          required: true,
          message: '该房是否限售不能为空',
          trigger: 'change'
        }],
        judicial_seizures: [{
          required: true,
          message: '该房是否司法查封不能为空',
          trigger: 'change'
        }],
        qualifications: [{
          required: true,
          message: '买方有无购房资格不能为空',
          trigger: 'change'
        }],
        house_loans: [{
          required: true,
          message: '房源贷款情况不能为空',
          trigger: 'change'
        }],
        die: [{
          required: true,
          message: '非正常死亡不能为空',
          trigger: 'change'
        }],
        water_leak: [{
          required: true,
          message: '是否漏水不能为空',
          trigger: 'change'
        }],
        agency: [{
          required: true,
          message: '是否代办合同不能为空',
          trigger: 'change'
        }],
        loan_agency: [{
          required: true,
          message: '是否按揭不能为空',
          trigger: 'change'
        }],
        commercial_loan_service_fees: [{
          required: true,
          message: '商货服务费',
          trigger: 'blur'
        }],
        cpf_service_fees: [{
          required: true,
          message: '公积金贷款服务费',
          trigger: 'blur'
        }],
        combination_service_fees: [{
          required: true,
          message: '组合贷款 服务费',
          trigger: 'blur'
        }],
        other_engagements: [{
          required: true,
          message: '请输入其他约定',
          trigger: 'blur'
        }],
      },
      //漏水情况
      waters: [{
        "label": "存在",
        "value": "存在"
      },{
        "label": "不存在",
        "value": "不存在"
      }],
      //漏水位置
      water_positions: [{
        "label": "顶部",
        "value": "顶部"
      },{
        "label": "室内墙面",
        "value": "室内墙面"
      },{
        "label": "室内管道",
        "value": "室内管道"
      },{
        "label": "室内地面",
        "value": "室内地面"
      },{
        "label": "阳台",
        "value": "阳台"
      },{
        "label": "飘窗",
        "value": "飘窗"
      },{
        "label": "公共管道",
        "value": "公共管道"
      },{
        "label": "室外墙面",
        "value": "室外墙面"
      },{
        "label": "顶楼",
        "value": "顶楼"
      }],
      taxesOptions: [{
        "label": "全部税费由甲方承担",
        "value": "一"
      }, {
        "label": "全部税费由乙方承担",
        "value": "二"
      }, {
        "label": "由法律、法规的缴纳发承担相应税费",
        "value": "三"
      }],
      limited_saleOptions: [{
        "label": "不限售",
        "value": "不限售"
      }, {
        "label": "限售",
        "value": "限售"
      }],
      judicial_seizuresOptions: [{
        "label": "否",
        "value": "否"
      }, {
        "label": "是",
        "value": "是"
      }],
      qualificationsOptions: [{
        "label": "无",
        "value": "无"
      }, {
        "label": "有",
        "value": "有"
      }],
      house_loansOptions: [{
        "label": "无贷款",
        "value": "无贷款"
      }, {
        "label": "有抵押贷款",
        "value": "有抵押贷款"
      }, {
        "label": "有按揭贷款",
        "value": "有按揭贷款"
      }],
      dieOptions: [{
        "label": "没发生过",
        "value": "没发生过"
      }, {
        "label": "有发生",
        "value": "有发生"
      }],
      water_leakOptions: [{
        "label": "无漏水",
        "value": "无漏水"
      }, {
        "label": "有漏水",
        "value": "有漏水"
      }],
      agencyOptions: [{
        "label": "否",
        "value": "否"
      }, {
        "label": "是",
        "value": "是"
      }],
      loan_agencyOptions: [{
        "label": "同意",
        "value": "同意"
      }, {
        "label": "不同意",
        "value": "不同意"
      }],
      //税费相关
      categories_taxes: [{
        "label": "增值税及附加",
        "value": "增值税及附加"
      },{
        "label": "个人所得税",
        "value": "个人所得税"
      },{
        "label": "契税",
        "value": "契税"
      },{
        "label": "土地增值税",
        "value": "土地增值税"
      },{
        "label": "买方印花税",
        "value": "买方印花税"
      },{
        "label": "卖方印花税",
        "value": "卖方印花税"
      },{
        "label": "房屋交易手续费",
        "value": "房屋交易手续费"
      },{
        "label": "转移登记费",
        "value": "转移登记费"
      },{
        "label": "书证费",
        "value": "书证费"
      }],
      //双方
      mutual: [{
          "label": "出卖人",
          "value": "出卖人"
        },{
          "label": "买受人",
          "value": "买受人"
        }],

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
        if (JSON.parse(this.data.otherInformation)) {
          this.formData = JSON.parse(this.data.otherInformation)
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
    if (JSON.parse(this.data.otherInformation)) {
      this.formData = JSON.parse(this.data.otherInformation)
    }
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return

        if(this.formData.a_service_fee) this.formData.a_service_fee_zh = numberToChineseUppercase(initNumber(this.formData.a_service_fee));
        else this.formData.a_service_fee_zh = ''

        if(this.formData.b_service_fee) this.formData.b_service_fee_zh = numberToChineseUppercase(initNumber(this.formData.b_service_fee));
        else this.formData.b_service_fee_zh = ''

        if(this.formData.commercial_loan_service_fees) this.formData.commercial_loan_service_fees_zh = numberToChineseUppercase(initNumber(this.formData.commercial_loan_service_fees));
        else this.formData.commercial_loan_service_fees_zh = ''

        this.formData.sell_pop_str = ''
        this.formData.buy_pop_str = ''
        for (let sell of this.formData.sell_pop) {
          if(this.formData.sell_pop_str !== '') this.formData.sell_pop_str += '、'
          this.formData.sell_pop_str += sell
        }
        for (let buy of this.formData.buy_pop) {
          if(this.formData.buy_pop_str !== '') this.formData.buy_pop_str += '、'
          this.formData.buy_pop_str += buy
        }

        this.formData.water_position_str = ''
        for (let water of this.formData.water_position) {
          if(this.formData.water_position_str !== '') this.formData.water_position_str += '、'
          this.formData.water_position_str += water
        }
        // TODO 提交表单
        updateContract({
          "id": this.id,
          "otherInformation": JSON.stringify(this.formData)
        }).then(res => {
          if (this.submitFormFlag === true) {
            // this.$emit('flag',false);
          } else {
            this.$modal.msgSuccess("保存成功");
          }

        })
      })
    },
    resetForm() {
      this.formData = {
        skgs: '',
        ownership_transfer_time: '60',
        taxes: '',
        a_service_fee: '',
        a_service_fee_zh: '',
        b_service_fee: '',
        b_service_fee_zh: '',
        limited_sale: '',
        judicial_seizures: '',
        qualifications: '',
        house_loans: '',
        die: '',
        water_leak: '',
        water_position: [''],
        water_position_str: '',
        water_leak_2: '', //墙面是否
        water_leak_2_position: '', //墙面脱皮起泡位置
        sell_pop: [],//出卖人税费
        buy_pop: [],//买受人税费
        maintenance: '买受人',//维修基金
        resettle: '买受人', //安置房契费
        transfers: '买受人', //土地转让金
        agency: '',
        loan_agency: '',
        commercial_loan_service_fees: '2000',
        commercial_loan_service_fees_zh: '2000',
        cpf_service_fees: '',
        combination_service_fees: '',
        delivery: 3,
        other_engagements: '1、甲乙双方已认真阅读以上条款并签字认可，2、乙方确认本人有购房资格，同时征信没有进入黑名单；3、甲方确认没有隐瞒潜在查封本房屋债务风险；',
        image1: null,
        image4: null,
        image5: null,
        image6: null,
        image7: null,
        image8: null,
        image9: null,
        image10: null,
        image11: null,
        image12: null,
        image13: null,
        image14: null,
      }

    },
    initWaterPosition(value) {
      if(value === '不存在') this.formData.water_position = []
    },
  }
}
</script>
<style></style>
