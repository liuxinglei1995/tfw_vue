<template>
    <div>
        <el-form ref="elForm" :model="formData" size="mini" label-width="82px" :inline="true">
            <el-col :span="24">
                <el-form-item label="开始时间" prop="field101" label-width="75px">
                    <el-date-picker v-model="formData.field101" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{ width: '100%' }" placeholder="请选择日期选择开始时间" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="field102">
                    <el-date-picker v-model="formData.field102" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                        :style="{ width: '100%' }" placeholder="请选择结束时间" clearable></el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="月租金" prop="field104" label-width="60px">
                    <el-input v-model="formData.field104" placeholder="请输入月租金" clearable :style="{ width: '100%' }">
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
                <el-form-item label="甲方违约金(如无请填0)" prop="field114" label-width="160px">
                    <el-input v-model="formData.field114" placeholder="请输入甲方违约金" clearable :style="{ width: '100%' }">
                    </el-input>
                </el-form-item>
                <el-form-item label="乙方违约金(如无请填0)" prop="field115" label-width="160px">
                    <el-input v-model="formData.field115" placeholder="请输入乙方违约金" clearable :style="{ width: '100%' }">
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="支付月份" prop="field105" label-width="72px">
                    <el-select v-model="formData.field105" placeholder="请选择支付月份" clearable :style="{ width: '100%' }">
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
            </el-col>
            <el-col :span="24">
                <el-form-item label="是否包含管理费" prop="field109" label-width="115px">
                    <el-select v-model="formData.field109" placeholder="请选择是否包含管理费" clearable :style="{ width: '100%' }">
                        <el-option v-for="(item, index) in field109Options" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="递增方式" prop="field111" label-width="72px">
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

                field104: undefined,
                field105: undefined,
                field108: null,
                field109: null,
                field111: null,
                field112: null,
                field113: null,
                field114: null,
                field115: null,

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
                "label": "三个月",
                "value": "三个月"
            },
            {
                "label": "六个月",
                "value": "六个月"
            },
            {
                "label": "十二个月",
                "value": "十二个月"
            }],
            field109Options: [
                {
                    "label": "含",
                    "value": "含"
                },
                {
                    "label": "不含",
                    "value": "不含"
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

                field104: undefined,
                field105: undefined,
                field108: null,
                field109: null,
                field111: null,
                field112: null,
                field113: null,
                field114: null,
                field115: null,
            }
        },
    }
}

</script>
<style></style>
