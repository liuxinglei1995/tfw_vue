<template>
  <div>
    <el-row :gutter="15">
      <!--      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"-->
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px" label-position="top">
        <el-col :span="6">
          <el-form-item label="楼层" prop="floor">
            <el-input v-model="formData.floor" placeholder="楼层 如:17" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="建筑面积" prop="ownership_area">
            <el-input v-model="formData.ownership_area" placeholder="建筑面积 如:112" clearable
              :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="监证号/不动产权证号" prop="ownership_number">
            <el-input v-model="formData.ownership_number" placeholder="监证号/不动产权证号" clearable
              :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="权证号/业务件号" prop="business_num">
            <el-input v-model="formData.business_num" placeholder="权证号/业务件号" clearable
                      :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="房屋地址" prop="addresses">
            <el-input v-model="formData.addresses" placeholder="房屋地址:产权地址" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-row type="flex" justify="start" align="bottom">
            <el-col :span="12">
              <el-form-item label="抵押情况" prop="mortgage_situation">
                <el-select v-model="formData.mortgage_situation" placeholder="请选择抵押情况" clearable
                  :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in mortgage_situationOptions" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" v-if="formData.mortgage_situation === '有抵押'">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="抵押权人1" prop="mortgagee_off_time">
                <el-input v-model="formData.mortgagee" placeholder="抵押权人 如:某某银行或个人" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抵押权人2" prop="mortgagee_off_time">
                <el-input v-model="formData.mortgagee2" placeholder="抵押权人 如:某某银行或个人" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="抵押权人3" prop="mortgagee_off_time">
                <el-input v-model="formData.mortgagee3" placeholder="抵押权人 如:某某银行或个人" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24">
          <el-row type="flex" justify="start" align="bottom">
            <el-col :span="12">
              <el-form-item label="租约情况" prop="leasing_status">
                <el-select v-model="formData.leasing_status" placeholder="请选择租约情况" clearable :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in leasing_statusOptions" :key="index" :label="item.label"
                    :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="formData.leasing_status === '已出租'">
              <el-form-item label="租赁期限至" prop="lease_term_b">
                <el-date-picker
                  v-model="formData.lease_term_b"
                  type="date"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="formData.leasing_status === '已出租'">
              <el-form-item label="月租金" prop="termination_conditions_b">
                <el-input v-model="formData.termination_conditions_b" placeholder="月租金" clearable type="number"
                  :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" v-if="formData.leasing_status === '已出租'">
              <el-form-item label="押金" prop="termination_conditions_b_pledge">
                <el-input v-model="formData.termination_conditions_b_pledge" placeholder="月租金" clearable type="number"
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24">
          <el-row type="flex" justify="start" align="bottom">
            <el-col :span="12">
              <el-form-item label="居住权情况" prop="mortgage_situation">
                <el-select v-model="formData.residency_situation" placeholder="请选择居住权情况" clearable
                           :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in residency_situations" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>

        <el-col :span="24" v-if="formData.residency_situation === '已设立居住权'">
          <el-row :gutter="15">
            <el-col :span="12">
              <el-form-item label="居住权人一" prop="residency1_name">
                <el-input v-model="formData.residency1_name" placeholder="居住权人一" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
              <el-form-item label="居住权期限">
                <el-date-picker v-model="formData.residency1_data1" type="date" placeholder="选择开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker> -
                <el-date-picker v-model="formData.residency1_data2" type="date" placeholder="选择截至日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker>
              </el-form-item>
              <el-form-item label="他项权证号" prop="residency1_warrant">
                <el-input v-model="formData.residency1_warrant" placeholder="他项权证号" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="居住权人一" prop="residency2_name">
                <el-input v-model="formData.residency2_name" placeholder="居住权人一" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
              <el-form-item label="居住权期限">
                <el-date-picker v-model="formData.residency2_data1" type="date" placeholder="选择开始日期"> </el-date-picker> -
                <el-date-picker v-model="formData.residency2_data2" type="date" placeholder="选择截至日期"> </el-date-picker>
              </el-form-item>
              <el-form-item label="他项权证号" prop="residency2_warrant">
                <el-input v-model="formData.residency2_warrant" placeholder="他项权证号" clearable
                          :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24" v-if="formData.residency_situation === '已设立居住权'">
          <el-row type="flex" justify="start" align="bottom">
            <el-col :span="12">
              <el-form-item label="居住权继承" prop="mortgage_situation">
                <el-select v-model="formData.residency_agree" placeholder="请选择居住权继承情况" clearable
                           :style="{ width: '100%' }">
                  <el-option v-for="(item, index) in residency_agrees" :key="index" :label="item.label"
                             :value="item.value" :disabled="item.disabled"></el-option>
                </el-select>继承该房屋的居住权
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>


        <el-col :span="24">
          <el-row type="flex" justify="start" align="bottom" :gutter="15">
            <el-col :span="12">
              <el-form-item label="房屋用途" prop="construction_use">
                <el-radio-group v-model="formData.construction_use" size="medium">
                  <el-radio v-for="(item, index) in construction_useOptions" :key="index" :label="item.value"
                    :disabled="item.disabled">{{ item.label }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="formData.construction_use === '其他'">
              <el-form-item label="" prop="construction_use_other">
                <el-input v-model="formData.construction_use_other" placeholder="其他用途" clearable
                  :style="{ width: '100%' }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
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
import { format, initNumber, numberToChineseUppercase } from '@/utils/activiti/myUtil'

export default {
  components: {},
  props: ['id', 'submitFormFlag', 'data'],
  data() {
    return {
      formData: {
        floor: '',
        ownership_area: '',
        ownership_number: '', //不动产权证
        business_num: '', //业务件号
        addresses: '',
        car_parking: '',
        car_addresses: '',
        car_parking_title_number: '',
        household_registration: '',
        move_out_time: '',
        property_taxes: '',
        property_taxes_time: '',
        mortgage_situation: '',
        mortgagee: '',
        mortgagee2: '',
        mortgagee3: '',
        mortgagee_off_time: '',
        leasing_status: '',
        lease_term_a: '',
        termination_conditions_a: '',
        lease_term_b: '',
        lease_term_data: '',
        termination_conditions_b: '',
        termination_conditions_b_zh: '',
        termination_conditions_b_pledge: '',
        termination_conditions_b_pledge_zh: '',
        construction_use: '',
        construction_use_other: '',

        residency_situation: '', //居住权情况
        //居住权人一
        residency1_name:'',
        residency1_data1:'',
        residency1_data2:'',
        residency1_warrant: '',
        //居住权人二
        residency2_name:'',
        residency2_data1:'',
        residency2_data2:'',
        residency2_warrant: '',
        residency_agree: '',
      },
      rules: {
        floor: [{
          required: true,
          message: '楼层 如:17',
          trigger: 'blur'
        }],
        ownership_area: [{
          required: true,
          message: '建筑面积 如:112',
          trigger: 'blur'
        }],
        ownership_number: [{
          required: true,
          message: '监证号/不动产权证号',
          trigger: 'blur'
        }],
        business_num: [{
          required: true,
          message: '权证号/业务件号',
          trigger: 'blur'
        }],
        addresses: [{
          required: true,
          message: '房屋地址:产权地址',
          trigger: 'blur'
        }],
        car_parking: [{
          required: true,
          message: '带车位出售不能为空',
          trigger: 'change'
        }],
        car_addresses: [{
          required: true,
          message: '车位坐落:车位地址',
          trigger: 'blur'
        }],
        car_parking_title_number: [{
          required: true,
          message: '车位产权证号',
          trigger: 'blur'
        }],
        household_registration: [{
          required: true,
          message: '户籍设立不能为空',
          trigger: 'change'
        }],
        move_out_time: [{
          required: true,
          message: '请选择迁出日期',
          trigger: 'change'
        }],
        property_taxes: [{
          required: true,
          message: '房产税不能为空',
          trigger: 'change'
        }],
        property_taxes_time: [{
          required: true,
          message: '请选择甲方停缴期限',
          trigger: 'change'
        }],
        mortgage_situation: [{
          required: true,
          message: '请选择抵押情况',
          trigger: 'change'
        }],
        mortgagee: [{
          required: true,
          message: '抵押权人 如:某某银行或个人',
          trigger: 'blur'
        }],
        mortgagee_off_time: [{
          required: true,
          message: '数字',
          trigger: 'blur'
        }],
        leasing_status: [{
          required: true,
          message: '请选择租约情况',
          trigger: 'change'
        }],
        lease_term_a: [{
          required: true,
          message: '租赁期限 如：按原合同期限执行或具体时间',
          trigger: 'blur'
        }],
        termination_conditions_a: [{
          required: true,
          message: '解约条件',
          trigger: 'blur'
        }],
        construction_use: [{
          required: true,
          message: '房屋用途不能为空',
          trigger: 'change'
        }],
        construction_use_other: [{
          required: true,
          message: '其他用途',
          trigger: 'blur'
        }],
      },
      car_parkingOptions: [{
        "label": "不带车位",
        "value": "不带车位"
      }, {
        "label": "带车位",
        "value": "带车位"
      }],
      household_registrationOptions: [{
        "label": "不设立",
        "value": "不设立"
      }, {
        "label": "设立",
        "value": "设立"
      }],
      property_taxesOptions: [{
        "label": "无",
        "value": "无"
      }, {
        "label": "有",
        "value": "有"
      }],
      mortgage_situationOptions: [{
        "label": "无抵押",
        "value": "无抵押"
      }, {
        "label": "有抵押",
        "value": "有抵押"
      }],
      leasing_statusOptions: [{
        "label": "未出租",
        "value": "未出租"
      }, {
        "label": "已出租",
        "value": "已出租"
      }],
      residency_situations: [{
        "label": "未设立居住权",
        "value": "未设立居住权"
      }, {
        "label": "已设立居住权",
        "value": "已设立居住权"
      }],
      residency_agrees: [{
        "label": "同意",
        "value": "同意"
      }, {
        "label": "不同意",
        "value": "不同意"
      }],
      construction_useOptions: [{
        "label": "住宅",
        "value": "住宅"
      }, {
        "label": "公寓",
        "value": "公寓"
      }, {
        "label": "别墅",
        "value": "别墅"
      }, {
        "label": "商业",
        "value": "商业"
      }, {
        "label": "其他",
        "value": "其他"
      }],
    }
  },
  computed: {},
  watch: {
    id: {
      handler() {
        this.resetForm()
      },
      deep: true // 深度监听父组件传过来对象变化
    },
    data: {
      handler() {
        this.resetForm()
        if (JSON.parse(this.data.houseInformation)) {
          this.formData = JSON.parse(this.data.houseInformation)
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
    if (JSON.parse(this.data.houseInformation)) {
      this.formData = JSON.parse(this.data.houseInformation)
    }
  },
  methods: {
    submitForm() {
      this.$refs['elForm'].validate(valid => {
        if (!valid) return
        //处理租金
        if(this.formData.termination_conditions_b) this.formData.termination_conditions_b_zh = numberToChineseUppercase(initNumber(this.formData.termination_conditions_b));
        else this.formData.termination_conditions_b_zh =  ''
        //处理押金
        if(this.formData.termination_conditions_b_pledge) this.formData.termination_conditions_b_pledge_zh = numberToChineseUppercase(initNumber(this.formData.termination_conditions_b_pledge));
        else this.formData.termination_conditions_b_pledge_zh =  ''

        if(this.formData.lease_term_b) this.formData.lease_term_data = format(this.formData.lease_term_b, 'yyyy-MM-dd')
        else this.formData.lease_term_data =  ''

        // TODO 提交表单
        updateContract({
          "id": this.id,
          "houseInformation": JSON.stringify(this.formData)
        }).then(res => {
          if (this.submitFormFlag === true) {
            this.$emit('flag',false);
          } else {
            this.$modal.msgSuccess("保存成功");
          }

        })

      })
    },
    resetForm() {
      this.formData = {
        floor: '',
        ownership_area: '',
        ownership_number: '',
        business_num: '',
        addresses: '',
        car_parking: '',
        car_addresses: '',
        car_parking_title_number: '',
        household_registration: '',
        move_out_time: '',
        property_taxes: '',
        property_taxes_time: '',
        mortgage_situation: '',
        mortgagee: '',
        mortgagee2: '',
        mortgagee3: '',
        mortgagee_off_time: '',
        leasing_status: '',
        lease_term_a: '',
        termination_conditions_a: '',
        lease_term_b: '',
        lease_term_data: '',
        termination_conditions_b: '',
        termination_conditions_b_zh: '',
        termination_conditions_b_pledge: '',
        termination_conditions_b_pledge_zh: '',
        construction_use: '',
        construction_use_other: '',
        residency_situation: '', //居住权情况
        //居住权人一
        residency1_name:'',
        residency1_data1:'',
        residency1_data2:'',
        residency1_warrant: '',
        //居住权人二
        residency2_name:'',
        residency2_data1:'',
        residency2_data2:'',
        residency2_warrant: '',
      }
    },
  }
}

</script>
<style></style>
