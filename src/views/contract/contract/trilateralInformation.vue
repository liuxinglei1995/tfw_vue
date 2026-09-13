<template>
  <div>
    <el-row :gutter="24">
      <!--      <el-form ref="trilateralInformation" :model="trilateralInformationData" :rules="rules" size="medium"-->
      <el-form ref="trilateralInformation" :model="trilateralInformationData" size="medium" label-width="100px"
        label-position="top">
        <el-col :span="24">
          <el-form-item label="合同名称" prop="title">
            <el-input v-model="title" placeholder="请输入合同名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="background-color: #f8f8f9;height: 30px">甲方信息（出租方或售卖方）</div>
        </el-col>
        <el-col :span="24">
          <el-col :span="6">
            <el-form-item label="" prop="a_name">
              <el-input v-model="trilateralInformationData.a_name" placeholder="甲方姓名" clearable
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="a_phone">
              <el-input v-model="trilateralInformationData.a_phone" placeholder="甲方联系电话" :maxlength="11" show-word-limit
                clearable prefix-icon='el-icon-mobile' :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="a_total_name">
              <el-input v-model="trilateralInformationData.a_total_name" placeholder="共有产权人姓名" clearable
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="a_total_phone">
              <el-input v-model="trilateralInformationData.a_total_phone" placeholder="共有产权人联系电话" :maxlength="11"
                show-word-limit clearable prefix-icon='el-icon-mobile' :style="{ width: '100%' }">
              </el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="6">
            <el-form-item label="" prop="a_idCard_type">
              <el-select v-model="trilateralInformationData.a_idCard_type" placeholder="请选择证件类型"
                :style="{ width: '100%' }">
                <el-option v-for="(item, index) in a_idCard_typeOptions" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="a_idCard_number">
              <el-input v-model="trilateralInformationData.a_idCard_number" placeholder="甲方证件号" :maxlength="18"
                show-word-limit clearable :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="a_total_idCard_type">
              <el-select v-model="trilateralInformationData.a_total_idCard_type" placeholder="请选择证件类型"
                :style="{ width: '100%' }">
                <el-option v-for="(item, index) in a_total_idCard_typeOptions" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="a_total_idCard_number">
              <el-input v-model="trilateralInformationData.a_total_idCard_number" placeholder="共有产权人证件号" :maxlength="18"
                show-word-limit clearable :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">

          <el-col :span="12">
            <el-form-item label="" prop="a_addresses">
              <el-input v-model="trilateralInformationData.a_addresses" placeholder="甲方联系地址" clearable
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="a_total_addresses">
              <el-input v-model="trilateralInformationData.a_total_addresses" placeholder="共有产权人联系地址" clearable
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
        </el-col>


        <el-col :span="24">
          <div style="background-color: #f8f8f9;height: 30px">甲方代理人信息</div>
        </el-col>
        <el-col :span="24">

          <el-col :span="12">
            <el-form-item label="" prop="a_agent_name">
              <el-input v-model="trilateralInformationData.a_agent_name" placeholder="代理人姓名" clearable
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="a_agent_phone">
              <el-input v-model="trilateralInformationData.a_agent_phone" placeholder="代理人联系电话" :maxlength="11"
                show-word-limit clearable prefix-icon='el-icon-mobile' :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="a_agent_idCard_type">
              <el-select v-model="trilateralInformationData.a_agent_idCard_type" placeholder="请选择证件类型"
                :style="{ width: '100%' }">
                <el-option v-for="(item, index) in a_agent_idCard_typeOptions" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="a_agent_idCard_number">
              <el-input v-model="trilateralInformationData.a_agent_idCard_number" placeholder="代理人证件号码" :maxlength="18"
                show-word-limit clearable :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="24">
          <div style="background-color: #f8f8f9;height: 30px">乙方信息（承租方或买方）</div>
        </el-col>
        <el-col :span="24">
          <el-col :span="6">
            <el-form-item label="" prop="b_name">
              <el-input v-model="trilateralInformationData.b_name" placeholder="乙方姓名" clearable
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="b_phone">
              <el-input v-model="trilateralInformationData.b_phone" placeholder="乙方联系电话" :maxlength="11" show-word-limit
                clearable prefix-icon='el-icon-mobile' :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="b_total_name">
              <el-input v-model="trilateralInformationData.b_total_name" placeholder="共有产权人姓名" clearable
                :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="b_total_phone">
              <el-input v-model="trilateralInformationData.b_total_phone" placeholder="共有产权人联系电话" :maxlength="11"
                show-word-limit clearable prefix-icon='el-icon-mobile' :style="{ width: '100%' }">
              </el-input>
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="24">
          <el-col :span="6">
            <el-form-item label="" prop="b_idCard_type">
              <el-select v-model="trilateralInformationData.b_idCard_type" placeholder="请选择证件类型"
                :style="{ width: '100%' }">
                <el-option v-for="(item, index) in b_idCard_typeOptions" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="b_idCard_number">
              <el-input v-model="trilateralInformationData.b_idCard_number" placeholder="乙方证件号" :maxlength="18"
                show-word-limit clearable :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="b_total_idCard_type">
              <el-select v-model="trilateralInformationData.b_total_idCard_type" placeholder="请选择证件类型"
                :style="{ width: '100%' }">
                <el-option v-for="(item, index) in b_total_idCard_typeOptions" :key="index" :label="item.label"
                  :value="item.value" :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" prop="b_total_idCard_number">
              <el-input v-model="trilateralInformationData.b_total_idCard_number" placeholder="共有产权人证件号" :maxlength="18"
                show-word-limit clearable :style="{ width: '100%' }"></el-input>
            </el-form-item>
          </el-col>
        </el-col>

        <el-col :span="12">
          <el-form-item label="" prop="b_addresses">
            <el-input v-model="trilateralInformationData.b_addresses" placeholder="乙方联系地址" clearable
              :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="b_total_addresses">
            <el-input v-model="trilateralInformationData.b_total_addresses" placeholder="共有产权人联系地址" clearable
              :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div style="background-color: #f8f8f9;height: 30px">乙方代理人信息</div>
        </el-col>

        <el-col :span="12">
          <el-form-item label="" prop="b_agent_name">
            <el-input v-model="trilateralInformationData.b_agent_name" placeholder="代理人姓名" clearable
              :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="b_agent_phone">
            <el-input v-model="trilateralInformationData.b_agent_phone" placeholder="代理人联系电话" :maxlength="11"
              show-word-limit clearable prefix-icon='el-icon-mobile' :style="{ width: '100%' }"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="b_agent_idCard_type">
            <el-select v-model="trilateralInformationData.b_agent_idCard_type" placeholder="请选择证件类型"
              :style="{ width: '100%' }">
              <el-option v-for="(item, index) in b_agent_idCard_typeOptions" :key="index" :label="item.label"
                :value="item.value" :disabled="item.disabled"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="b_agent_idCard_number">
            <el-input v-model="trilateralInformationData.b_agent_idCard_number" placeholder="代理人证件号码" :maxlength="18"
              show-word-limit clearable :style="{ width: '100%' }"></el-input>
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
import { listContract, getContract, delContract, addContract, updateContract } from "@/api/contract/contract";
import { getGenderAndBirthFromID } from '@/utils/activiti/myUtil'

export default {

  components: {},
  props: ['id', 'submitFormFlag', 'data'],
  data() {
    return {
      title: null,
      trilateralInformationData: {
        a_name: '',
        a_phone: '',
        a_total_name: '',
        a_total_phone: '',
        a_idCard_type: '',
        a_idCard_number: '',
        a_idCard_sex: '',
        a_idCard_bro: '',
        a_total_idCard_type: '',
        a_total_idCard_number: '',
        a_total_idCard_sex: '',
        a_total_idCard_bro: '',
        a_addresses: '',
        a_total_addresses: '',
        a_agent_name: '',
        a_agent_phone: '',
        a_agent_idCard_type: '',
        a_agent_idCard_number: '',
        a_agent_idCard_sex: '',
        a_agent_idCard_bro: '',
        b_name: '',
        b_phone: '',
        b_total_name: '',
        b_total_phone: '',
        b_idCard_type: '',
        b_idCard_number: '',
        b_idCard_sex: '',
        b_idCard_bro: '',
        b_total_idCard_type: '',
        b_total_idCard_number: '',
        b_total_idCard_sex: '',
        b_total_idCard_bro: '',
        b_addresses: '',
        b_total_addresses: '',
        b_agent_name: '',
        b_agent_phone: '',
        b_agent_idCard_type: '',
        b_agent_idCard_number: '',
        b_agent_idCard_sex: '',
        b_agent_idCard_bro: '',
      },
      rules: {
        a_name: [{
          required: true,
          message: '甲方姓名',
          trigger: 'blur'
        }],
        a_phone: [{
          required: true,
          message: '甲方联系电话',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        a_total_name: [],
        a_total_phone: [{
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        a_idCard_type: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }],
        a_idCard_number: [{
          required: true,
          message: '甲方证件号',
          trigger: 'blur'
        }],
        a_total_idCard_type: [],
        a_total_idCard_number: [],
        a_addresses: [{
          required: true,
          message: '甲方联系地址',
          trigger: 'blur'
        }],
        a_total_addresses: [],
        a_agent_name: [{
          required: true,
          message: '代理人姓名',
          trigger: 'blur'
        }],
        a_agent_phone: [{
          required: true,
          message: '代理人联系电话',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        a_agent_idCard_type: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }],
        a_agent_idCard_number: [{
          required: true,
          message: '代理人证件号码',
          trigger: 'blur'
        }],
        b_name: [{
          required: true,
          message: '乙方姓名',
          trigger: 'blur'
        }],
        b_phone: [{
          required: true,
          message: '乙方联系电话',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        b_total_name: [],
        b_total_phone: [{
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        b_idCard_type: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }],
        b_idCard_number: [{
          required: true,
          message: '乙方证件号',
          trigger: 'blur'
        }],
        b_total_idCard_type: [],
        b_total_idCard_number: [],
        b_addresses: [{
          required: true,
          message: '乙方联系地址',
          trigger: 'blur'
        }],
        b_total_addresses: [],
        b_agent_name: [{
          required: true,
          message: '代理人姓名',
          trigger: 'blur'
        }],
        b_agent_phone: [{
          required: true,
          message: '代理人联系电话',
          trigger: 'blur'
        }, {
          pattern: /^1(3|4|5|7|8|9)\d{9}$/,
          message: '手机号格式错误',
          trigger: 'blur'
        }],
        b_agent_idCard_type: [{
          required: true,
          message: '请选择',
          trigger: 'change'
        }],
        b_agent_idCard_number: [{
          required: true,
          message: '代理人证件号码',
          trigger: 'blur'
        }],
      },

      a_idCard_typeOptions: [{
        "label": "身份证",
        "value": "身份证"
      }, {
        "label": "军官证",
        "value": "军官证"
      }, {
        "label": "士兵证",
        "value": "士兵证"
      }, {
        "label": "护照",
        "value": "护照"
      }],
      a_total_idCard_typeOptions: [{
        "label": "身份证",
        "value": "身份证"
      }, {
        "label": "军官证",
        "value": "军官证"
      }, {
        "label": "士兵证",
        "value": "士兵证"
      }, {
        "label": "护照",
        "value": "护照"
      }],
      a_agent_idCard_typeOptions: [{
        "label": "身份证",
        "value": "身份证"
      }, {
        "label": "军官证",
        "value": "军官证"
      }, {
        "label": "士兵证",
        "value": "士兵证"
      }, {
        "label": "护照",
        "value": "护照"
      }],
      b_idCard_typeOptions: [{
        "label": "身份证",
        "value": "身份证"
      }, {
        "label": "军官证",
        "value": "军官证"
      }, {
        "label": "士兵证",
        "value": "士兵证"
      }, {
        "label": "护照",
        "value": "护照"
      }],
      b_total_idCard_typeOptions: [{
        "label": "身份证",
        "value": "身份证"
      }, {
        "label": "军官证",
        "value": "军官证"
      }, {
        "label": "士兵证",
        "value": "士兵证"
      }, {
        "label": "护照",
        "value": "护照"
      }],
      b_agent_idCard_typeOptions: [{
        "label": "身份证",
        "value": "身份证"
      }, {
        "label": "军官证",
        "value": "军官证"
      }, {
        "label": "士兵证",
        "value": "士兵证"
      }, {
        "label": "护照",
        "value": "护照"
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
        console.log(this.data, '三方信息')
        this.resetForm()
        this.title = this.data.title
        if(this.data.trilateralInformation === undefined) return false
        if (JSON.parse(this.data.trilateralInformation)) {
          this.trilateralInformationData = JSON.parse(this.data.trilateralInformation)
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
    this.title = this.data.title
    if (JSON.parse(this.data.trilateralInformation)) {
      this.trilateralInformationData = JSON.parse(this.data.trilateralInformation)
    }
  },
  methods: {
    submitForm() {
      this.$refs['trilateralInformation'].validate(valid => {
        if (!valid) return
        if(this.trilateralInformationData.a_idCard_number !== '') {
          this.trilateralInformationData.a_idCard_sex = getGenderAndBirthFromID(this.trilateralInformationData.a_idCard_number).gender
          this.trilateralInformationData.a_idCard_bro = getGenderAndBirthFromID(this.trilateralInformationData.a_idCard_number).birthDate
        }
        if(this.trilateralInformationData.a_total_idCard_number !== '') {
          this.trilateralInformationData.a_total_idCard_sex = getGenderAndBirthFromID(this.trilateralInformationData.a_total_idCard_number).gender
          this.trilateralInformationData.a_total_idCard_bro = getGenderAndBirthFromID(this.trilateralInformationData.a_total_idCard_number).birthDate
        }
        if(this.trilateralInformationData.b_idCard_number !== '') {
          this.trilateralInformationData.b_idCard_sex = getGenderAndBirthFromID(this.trilateralInformationData.b_idCard_number).gender
          this.trilateralInformationData.b_idCard_bro = getGenderAndBirthFromID(this.trilateralInformationData.b_idCard_number).birthDate
        }
        if(this.trilateralInformationData.b_total_idCard_number !== '') {
          this.trilateralInformationData.b_total_idCard_sex = getGenderAndBirthFromID(this.trilateralInformationData.b_total_idCard_number).gender
          this.trilateralInformationData.b_total_idCard_bro = getGenderAndBirthFromID(this.trilateralInformationData.b_total_idCard_number).birthDate
        }
        updateContract({
          "id": this.id,
          "title": this.title,
          "trilateralInformation": JSON.stringify(this.trilateralInformationData)
        }).then(res => {
          if (this.submitFormFlag === true) {
            this.$emit('flag', false);
          } else {
            this.$modal.msgSuccess("保存成功");
          }

        })

      })
    },
    resetForm() {
      this.trilateralInformationData = {
        a_name: '',
        a_phone: '',
        a_total_name: '',
        a_total_phone: '',
        a_idCard_type: '',
        a_idCard_number: '',
        a_idCard_sex: '',
        a_idCard_bro: '',
        a_total_idCard_type: '',
        a_total_idCard_number: '',
        a_total_idCard_sex: '',
        a_total_idCard_bro: '',
        a_addresses: '',
        a_total_addresses: '',
        a_agent_name: '',
        a_agent_phone: '',
        a_agent_idCard_type: '',
        a_agent_idCard_number: '',
        a_agent_idCard_sex: '',
        a_agent_idCard_bro: '',
        b_name: '',
        b_phone: '',
        b_total_name: '',
        b_total_phone: '',
        b_idCard_type: '',
        b_idCard_number: '',
        b_idCard_sex: '',
        b_idCard_bro: '',
        b_total_idCard_type: '',
        b_total_idCard_number: '',
        b_total_idCard_sex: '',
        b_total_idCard_bro: '',
        b_addresses: '',
        b_total_addresses: '',
        b_agent_name: '',
        b_agent_phone: '',
        b_agent_idCard_type: '',
        b_agent_idCard_number: '',
        b_agent_idCard_sex: '',
        b_agent_idCard_bro: '',
      }
    },

  }
}

</script>
<style></style>
