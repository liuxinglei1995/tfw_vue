<template>
    <div>
        <el-row :gutter="15">
            <!--      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px"-->
            <el-form ref="elForm" :model="formData" size="medium" label-width="100px" label-position="top">
                <el-col :span="6">
                    <el-form-item label="建筑面积 如:112" prop="ownership_area">
                        <el-input v-model="formData.ownership_area" placeholder="建筑面积 如:112" clearable
                            :style="{ width: '100%' }"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所有权证号/不动产权证号" prop="ownership_number">
                        <el-input v-model="formData.ownership_number" placeholder="所有权证号/不动产权证号" clearable
                            :style="{ width: '100%' }"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="房屋地址:产权地址" prop="addresses">
                        <el-input v-model="formData.addresses" placeholder="房屋地址:产权地址" clearable :style="{ width: '100%' }">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-row type="flex" justify="start" align="bottom" :gutter="15">
                        <el-col :span="12">
                            <el-form-item label="房屋用途" prop="construction_use">
                                <el-radio-group v-model="formData.construction_use" size="medium">
                                    <el-radio v-for="(item, index) in construction_useOptions" :key="index"
                                        :label="item.value" :disabled="item.disabled">{{ item.label }}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" v-if="formData.construction_use == '其他'">
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

export default {
    components: {},
    props: ['id', 'submitFormFlag', 'data'],
    data() {
        return {
            formData: {
                ownership_area: undefined,
                ownership_number: undefined,
                addresses: undefined,
                construction_use: undefined,
                construction_use_other: '',
            },
            rules: {
                ownership_area: [{
                    required: true,
                    message: '建筑面积 如:112',
                    trigger: 'blur'
                }],
                ownership_number: [{
                    required: true,
                    message: '所有权证号/不动产权证号',
                    trigger: 'blur'
                }],
                addresses: [{
                    required: true,
                    message: '房屋地址:产权地址',
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
                if (this.id) {
                    this.getcontract()
                }
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
                // TODO 提交表单
                updateContract({
                    "id": this.id
                    , "houseInformation": JSON.stringify(this.formData)
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
                ownership_area: undefined,
                ownership_number: undefined,
                addresses: undefined,
                construction_use: undefined,
                construction_use_other: '',
            }
        },
    }
}

</script>
<style></style>
