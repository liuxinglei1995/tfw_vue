<template>
    <div>
        <el-form ref="elForm" :model="formData" size="mini" label-width="100px" :inline="true">
            <el-col :span="24">
                <el-form-item label="租期开始时间" prop="field101">
                    <el-date-picker v-model="formData.field101" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{ width: '100%' }" placeholder="请选择日期选择开始时间" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="租期结束时间" prop="field102">
                    <el-date-picker v-model="formData.field102" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{ width: '100%' }" placeholder="请选择结束时间" clearable></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="交付日期" prop="field103" label-width="72px">
                    <el-date-picker v-model="formData.field103" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{ width: '100%' }" placeholder="请选择交付日期" clearable></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="月租金" prop="field104" label-width="60px">
                    <el-input v-model="formData.field104" placeholder="请输入租金" clearable :style="{ width: '100%' }">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="甲方服务费(如无请填0)" prop="field112" label-width="160px">
                    <el-input v-model="formData.field112" placeholder="请输入甲方服务费" clearable :style="{ width: '100%' }">
                    </el-input>
                </el-form-item>
                <el-form-item label="乙方服务费(如无请填0)" prop="field113" label-width="160px">
                    <el-input v-model="formData.field113" placeholder="请输入乙方服务费" clearable :style="{ width: '100%' }">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="租金支付方式" prop="field105">
                    <el-select v-model="formData.field105" placeholder="请选择支付方式" clearable :style="{ width: '100%' }">
                        <el-option v-for="(item, index) in field105Options" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="第一次支付时间" prop="field108" label-width="115px">
                    <el-date-picker v-model="formData.field108" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{ width: '100%' }" placeholder="请选择第一次支付时间" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="下一次支付时间" prop="field109" label-width="115px">
                    <el-date-picker v-model="formData.field109" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{ width: '100%' }" placeholder="请选择下一次支付时间" clearable></el-date-picker>
                </el-form-item>
              <el-form-item label="提前多少天支付" prop="field110" label-width="115px">
                <el-input-number v-model="formData.field110"  :min="0" :max="30" label="描述文字"></el-input-number>
              </el-form-item>
            </el-col>




            <el-col :span="24">
                <el-form-item label="递增方式" prop="field111" label-width="75px">
                    <el-input v-model="formData.field111" placeholder="请输入递增方式" clearable :style="{ width: '100%' }">
                    </el-input>
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
import { updateContract } from "@/api/contract/contract";

export default {
    components: {},
    props: ['id', 'submitFormFlag', 'data'],
    data() {
        return {
            formData: {
                field101: null,
                field102: null,
                field103: null,
                field104: undefined,
                field105: undefined,
                field108: null,
                field109: null,
                field110: 0,
                field111: null,
                field112: null,
                field113: null

            },
            rules: {
                field101: [{
                    required: true,
                    message: '请选择日期选择开始时间',
                    trigger: 'change'
                }],
                field102: [{
                    required: true,
                    message: '请选择结束时间',
                    trigger: 'change'
                }],
                field103: [{
                    required: true,
                    message: '请选择交付日期',
                    trigger: 'change'
                }],
                field104: [{
                    required: true,
                    message: '请输入租金',
                    trigger: 'blur'
                }],
                field105: [{
                    required: true,
                    message: '请选择支付方式',
                    trigger: 'change'
                }],
                field108: [{
                    required: true,
                    message: '请选择第一次支付时间',
                    trigger: 'change'
                }],
                field109: [{
                    required: true,
                    message: '请选择下一次支付时间',
                    trigger: 'change'
                }],
                field112: [{
                    required: true,
                    message: '请输入甲方服务费',
                    trigger: 'blur'
                }],
                field113: [{
                    required: true,
                    message: '请输入甲方服务费',
                    trigger: 'blur'
                }],
            },
            field105Options: [{
                "label": "月",
                "value": "月"
            }, {
                "label": "季度",
                "value": "季度"
            },
            {
                "label": "半年",
                "value": "半年"
            },
            {
                "label": "年",
                "value": "年"
            }],
        }
    },
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
              console.log(this.data)
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
                field101: null,
                field102: null,
                field103: null,
                field104: undefined,
                field105: undefined,
                field108: null,
                field109: null,
                field111: null,
                field112: null,
                field113: null
            }
        },
    }
}

</script>
<style></style>
