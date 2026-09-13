<template>
  <div>
    <el-form ref="elForm" :inline="true" :model="formData" label-width="100px" size="medium">
      <el-col :span="24">
        <el-form-item label="过户税费承担方式" label-width="130px" prop="field101">
          <el-select v-model="formData.field101" :style="{ width: '100%' }" clearable placeholder="请选择税费承担方式">
            <el-option v-for="(item, index) in field101Options" :key="index" :disabled="item.disabled"
                       :label="item.label"
                       :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="甲方服务费" label-width="90px" prop="field102">
          <el-input v-model="formData.field102" :style="{ width: '100%' }" clearable placeholder="请输入甲方服务费">
          </el-input>
        </el-form-item>
        <el-form-item label="乙方服务费" label-width="90px" prop="field103">
          <el-input v-model="formData.field103" :style="{ width: '100%' }" clearable placeholder="请输入乙方服务费">
          </el-input>
        </el-form-item>
        <el-form-item label="乙方按揭服务费" label-width="110px" prop="field104">
          <el-input v-model="formData.field104" :style="{ width: '100%' }" clearable placeholder="请输入乙方按揭服务费">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="违约劳务费" label-width="90px" prop="field106">
          <el-input v-model="formData.field106" :style="{ width: '100%' }" clearable placeholder="请输入违约劳务费">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="纠纷选择方式" label-width="105px" prop="field107">
          <el-select v-model="formData.field107" :style="{ width: '100%' }" clearable placeholder="请选择纠纷选择方式">
            <el-option v-for="(item, index) in field107Options" :key="index" :disabled="item.disabled"
                       :label="item.label"
                       :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="签约地点" label-width="78px" prop="field108">
          <el-input v-model="formData.field108" :style="{ width: '100%' }" clearable placeholder="请输入签约地点">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="签约日期选择" label-width="105px" prop="field109">
          <el-date-picker v-model="formData.field109" :style="{ width: '100%' }" clearable
                          format="yyyy-MM-dd" placeholder="请选择签约日期选择" value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-col>

      <el-col :span="24">
        <el-form-item label="补充条款" label-width="78px" prop="field111">
          <el-input style="width: 800px" size="medium" v-model="formData.field111" type="textarea" placeholder="请输入补充条款"
                    :autosize="{ minRows: 4, maxRows: 4 }" ></el-input>
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="产权证" prop="image1">
          <image-upload v-model="formData.image1" :limit="1"/>
        </el-form-item>
        <el-form-item prop="image2">
          <image-upload v-model="formData.image2" :limit="1"/>
        </el-form-item>
        <el-form-item prop="image3">
          <image-upload v-model="formData.image3" :limit="1"/>
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="业主身份证反面" prop="image4">
          <image-upload v-model="formData.image4" :limit="1"/>
        </el-form-item>
        <el-form-item label="" prop="image5">
          <image-upload v-model="formData.image5" :limit="1"/>
        </el-form-item>
        <el-form-item label="" prop="image6">
          <image-upload v-model="formData.image6" :limit="1"/>
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="业主身份证国徽面" prop="image7">
          <image-upload v-model="formData.image7" :limit="1"/>
        </el-form-item>
        <el-form-item label="" prop="image8">
          <image-upload v-model="formData.image8" :limit="1"/>
        </el-form-item>
        <el-form-item label="" prop="image9">
          <image-upload v-model="formData.image9" :limit="1"/>
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="购买方身份证反面" prop="image10">
          <image-upload v-model="formData.image10" :limit="1"/>
        </el-form-item>
        <el-form-item label="" prop="image11">
          <image-upload v-model="formData.image11" :limit="1"/>
        </el-form-item>
      </el-col>
      <el-col style="display: flex">
        <el-form-item label="购买方身份证国徽面" prop="image12">
          <image-upload v-model="formData.image12" :limit="1"/>
        </el-form-item>
        <el-form-item label="" prop="image13">
          <image-upload v-model="formData.image13" :limit="1"/>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="其他证件" prop="image14">
          <image-upload v-model="formData.image14" :limit="1"/>
        </el-form-item>
      </el-col>

      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { listContract, getContract, delContract, addContract, updateContract } from '@/api/contract/contract'

export default {
  components: {},
  props: ['id', 'submitFormFlag', 'data'],
  data() {
    return {
      formData: {
        field101: '',
        field102: '',
        field103: '',
        field104: '',
        field106: '',
        field107: '二',
        field108: '',
        field109: '',
        field110: '',
        field111: '',
        image1: null,
        image2: null,
        image3: null,
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
        field101: [{
          required: true,
          message: '请选择税费承担方式',
          trigger: 'change'
        }],
        field102: [{
          required: true,
          message: '请输入甲方服务费',
          trigger: 'blur'
        }],
        field103: [{
          required: true,
          message: '请输入乙方服务费',
          trigger: 'blur'
        }],
        field104: [{
          required: true,
          message: '请输入乙方按揭服务费',
          trigger: 'blur'
        }],

        field106: [{
          required: true,
          message: '请输入违约劳务费',
          trigger: 'blur'
        }],
        field107: [{
          required: true,
          message: '请选择纠纷选择方式',
          trigger: 'change'
        }],
        field108: [{
          required: true,
          message: '请输入签约地点',
          trigger: 'blur'
        }],
        field109: [{
          required: true,
          message: '请选择签约日期选择',
          trigger: 'change'
        }],
        field111: [{
          required: true,
          message: '请输入补充条款',
          trigger: 'blur'
        }]
      },
      field110Action: 'https://jsonplaceholder.typicode.com/posts/',
      field110fileList: [],
      field101Options: [{
        'label': '由甲方一并承担所有税费',
        'value': '一'
      }, {
        'label': '由乙方一并承担所有税费',
        'value': '二'
      }, {
        'label': '由甲乙双方按规定各自承担。',
        'value': '三'
      }],
      field107Options: [{
        'label': '申请仲裁委员会仲裁',
        'value': '一'
      }, {
        'label': '依法向车位所在地有管辖权的人民法院起诉',
        'value': '二'
      }]
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
        // TODO 提交表单
        updateContract({
          'id': this.id
          , 'otherInformation': JSON.stringify(this.formData)
        }).then(res => {
          console.log('66666666666666666666666')
          if (this.submitFormFlag == true) {
            // this.$emit('flag',false);
          } else {

            this.$modal.msgSuccess('保存成功')
          }

        })
      })
    },
    resetForm() {
      this.formData = {
        field101: '',
        field102: '',
        field103: '',
        field104: '',
        field106: '',
        field107: '二',
        field108: '',
        field109: '',
        field110: '',
        field111: '',
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
    }

  }
}

</script>
<style></style>
