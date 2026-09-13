<template>
    <div>
        <el-form ref="elForm"  :inline="true" :model="formData" size="medium" label-width="100px">
          <el-col>
            <el-form-item label="解决纠纷方式" prop="field101">
              <el-select v-model="formData.field101" placeholder="请选择解决纠纷方式解决纠纷方式" clearable :style="{ width: '100%' }">
                <el-option v-for="(item, index) in field101Options" :key="index" :label="item.label" :value="item.value"
                           :disabled="item.disabled"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        <el-col :span="24">
          <el-form-item label="备注（如车牌号:xxxx）" prop="field102">
            <el-input style="width: 800px" v-model="formData.field102" type="textarea" placeholder="请输入本文行多备注备注"
                      :autosize="{ minRows: 4, maxRows: 4 }" ></el-input>
          </el-form-item>
        </el-col>
          <el-col>
            <el-form-item label="签约地点" prop="field103">
              <el-input v-model="formData.field103" placeholder="请输入签约地点" clearable :style="{ width: '100%' }">
              </el-input>
            </el-form-item>
            <el-form-item label="签约日期" prop="field104">
              <el-date-picker v-model="formData.field104" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                              :style="{ width: '100%' }" placeholder="请选择签约日期" clearable></el-date-picker>
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
            <el-form-item label="业主身份证人像面照片" prop="image4">
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
            <el-form-item label="租户身份证人像面照片" prop="image10">
              <image-upload v-model="formData.image10" :limit="1"/>
            </el-form-item>
            <el-form-item label="" prop="image11">
              <image-upload v-model="formData.image11" :limit="1"/>
            </el-form-item>
          </el-col>
          <el-col style="display: flex">
            <el-form-item label="租户身份证国徽面" prop="image12">
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
import { listContract, getContract, delContract, addContract, updateContract } from "@/api/contract/contract";
export default {
    components: {},
    props: ['id', 'submitFormFlag', 'data'],
    data() {
        return {
            formData: {
                field101: undefined,
                field102: undefined,
                field103: undefined,
                field104: null,
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
                field101: [{
                    required: true,
                    message: '请选择解决纠纷方式解决纠纷方式',
                    trigger: 'change'
                }],
                field102: [{
                    required: true,
                    message: '请输入本文行多备注备注',
                    trigger: 'blur'
                }],
                field103: [{
                    required: true,
                    message: '请输入签约地点',
                    trigger: 'blur'
                }],
                field104: [{
                    required: true,
                    message: '请选择签约日期',
                    trigger: 'change'
                }],
            },
            field101Options: [{
                "label": "申请劳动仲裁委员会仲裁",
                "value": "一"
            }, {
                "label": "依法向房屋所在地有管辖权的人民法院起诉",
                "value": "二"
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
                // TODO 提交表单
                updateContract({
                    "id": this.id
                    , "otherInformation": JSON.stringify(this.formData)
                }).then(res => {
                    console.log("66666666666666666666666")
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
                field101: undefined,
                field102: undefined,
                field103: undefined,
                field104: null,
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

    }
}

</script>
<style></style>
