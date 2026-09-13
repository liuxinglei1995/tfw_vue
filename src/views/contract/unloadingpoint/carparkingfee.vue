<template>
    <div>
        <el-form ref="elForm" :model="formData" size="medium" label-width="100px" :inline="true">
            <el-col :span="24">
                <el-form-item label="付款方式" prop="field101" label-width="72px">
                    <el-select v-model="formData.field101" placeholder="请选择付款方式" clearable :style="{ width: '100%' }">
                        <el-option v-for="(item, index) in field101Options" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="车位出售价格" prop="field104">
                    <el-input v-model="formData.field104" placeholder="请输入车位价格" show-word-limit clearable
                        prefix-icon='el-icon-mobile' :style="{ width: '100%' }"></el-input>
                </el-form-item>
            </el-col>
            <div v-if="formData.field101 == '一'">
                <el-col :span="24">
                    <el-form-item label="一期支付订金" prop="field102">
                        <el-input v-model="formData.field102" placeholder="请输入一期支付订金" clearable :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="二期乙方支付日期" prop="field105" label-width="130px">
                        <el-date-picker v-model="formData.field105" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            :style="{ width: '100%' }" placeholder="请选择二期乙方支付日期" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="二期乙方支付金额" prop="field106" label-width="130px">
                        <el-input v-model="formData.field106" placeholder="请输入二期乙方支付金额" clearable
                            :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="三期乙方支付日期" prop="field107"  label-width="130px">
                        <el-date-picker v-model="formData.field107" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            :style="{ width: '100%' }" placeholder="请选择三期乙方支付日期" clearable></el-date-picker>
                    </el-form-item>
                    <el-form-item label="三期乙方支付金额" prop="field108"  label-width="130px">
                        <el-input v-model="formData.field108" placeholder="请输入三期乙方支付金额" clearable
                            :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="成交多少日办理手续" prop="field114"  label-width="142px">
                        <el-input v-model="formData.field114" placeholder="请输入成交多少日办理手续" clearable
                            :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
            </div>
            <div v-if="formData.field101 == '二'">
                <el-col :span="24">
                    <el-form-item label="按揭乙方支付定金" prop="field109" label-width="130px">
                        <el-input v-model="formData.field109" placeholder="请输入按揭乙方支付定金" clearable
                            :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="按揭乙方支付时间" prop="field110" label-width="130px">
                        <el-date-picker v-model="formData.field110" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            :style="{ width: '100%' }" placeholder="请选择按揭乙方支付时间" clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="按揭乙方首付" prop="field111">
                        <el-input v-model="formData.field111" placeholder="请输入按揭乙方首付" clearable :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="按揭乙方贷款" prop="field112">
                        <el-input v-model="formData.field112" placeholder="请输入按揭乙方贷款" clearable :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="按揭不足部分支付最迟日期" prop="field113">
                        <el-date-picker v-model="formData.field113" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                            :style="{ width: '100%' }" placeholder="请选择按揭不足部分支付最迟日期" clearable></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="按揭多少日起" prop="field115">
                        <el-input v-model="formData.field115" placeholder="请输入按揭多少日起" clearable :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="由谁共同办理" prop="field116">
                        <el-input v-model="formData.field116" placeholder="请输入由谁共同办理" clearable :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
            </div>
            <el-col :span="24">
                <el-form-item label="交房时间" prop="field117"  label-width="70px">
                    <el-select v-model="formData.field117" placeholder="请选择交房时间" clearable :style="{ width: '100%' }">
                        <el-option v-for="(item, index) in field117Options" :key="index" :label="item.label"
                            :value="item.value" :disabled="item.disabled"></el-option>
                    </el-select>
                    <el-input v-model="formData.field118" placeholder="请输入其他交房时间" clearable :style="{ width: '100%' }"
                        v-if="formData.field117 == '其他'">
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
                field101: '',
                field102: '',
                field102_zh: '',
                field104: '',
                field104_zh: '',
                field105: '',
                field106: '',
                field106_zh: '',
                field107: '',
                field108: '',
                field108_zh: '',
                field109: '',
                field109_zh: '',
                field110: '',
                field111: '',
                field111_zh: '',
                field112: '',
                field112_zh: '',
                field113: '',
                field114: '',
                field115: '',
                field116: '',
                field117: '',
                field118: '',
            },
            rules: {
                field101: [{
                    required: true,
                    message: '请选择付款方式',
                    trigger: 'change'
                }],
                field102: [{
                    required: true,
                    message: '请输入一期支付金额',
                    trigger: 'blur'
                }],
                field104: [{
                    required: true,
                    message: '请输入车位价格',
                    trigger: 'blur'
                }, {
                    pattern: /^1(3|4|5|7|8|9)\d{9}$/,
                    message: '手机号格式错误',
                    trigger: 'blur'
                }],
                field105: [{
                    required: true,
                    message: '请输入二期乙方于',
                    trigger: 'blur'
                }],
                field106: [{
                    required: true,
                    message: '请输入二期乙方支付金额',
                    trigger: 'blur'
                }],
                field107: [{
                    required: true,
                    message: '请输入三期乙方于',
                    trigger: 'blur'
                }],
                field108: [{
                    required: true,
                    message: '请输入三期乙方支付金额',
                    trigger: 'blur'
                }],
                field109: [{
                    required: true,
                    message: '请输入按揭乙方支付定金',
                    trigger: 'blur'
                }],
                field110: [{
                    required: true,
                    message: '请输入按揭乙方于',
                    trigger: 'blur'
                }],
                field111: [{
                    required: true,
                    message: '请输入按揭乙方首付',
                    trigger: 'blur'
                }],
                field112: [{
                    required: true,
                    message: '请输入按揭乙方贷款',
                    trigger: 'blur'
                }],
                field113: [{
                    required: true,
                    message: '请选择按揭不足部分支付最迟日期',
                    trigger: 'change'
                }],
                field114: [{
                    required: true,
                    message: '请输入成交多少日办理手续',
                    trigger: 'blur'
                }],
                field115: [{
                    required: true,
                    message: '请输入按揭多少日起',
                    trigger: 'blur'
                }],
                field116: [{
                    required: true,
                    message: '请输入由谁共同办理',
                    trigger: 'blur'
                }],
                field117: [{
                    required: true,
                    message: '请选择交房时间',
                    trigger: 'blur'
                }],
            },
            field101Options: [{
                "label": "一次性",
                "value": "一"
            }, {
                "label": "按揭",
                "value": "二"
            }],
            field117Options: [{
                "label": "过户后收到尾款三工作日内",
                "value": "过户后收到尾款三工作日内"
            }, {
                "label": "其他",
                "value": "其他"
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
            console.log(this.formData, "666666666");
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
                field101: '',
                field102: '',
                field102_zh: '',
                field104: '',
                field104_zh: '',
                field105: '',
                field106: '',
                field106_zh: '',
                field107: '',
                field108: '',
                field108_zh: '',
                field109: '',
                field109_zh: '',
                field110: '',
                field111: '',
                field111_zh: '',
                field112: '',
                field112_zh: '',
                field113: '',
                field114: '',
                field115: '',
                field116: '',
                field117: '',
                field118: '',
            }
        },
    }
}

</script>
<style></style>
