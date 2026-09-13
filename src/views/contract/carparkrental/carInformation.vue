<template>
    <div>
        <el-form ref="elForm" :model="formData" size="medium" label-width="100px">
            <el-form-item label="产权位置" prop="field101">
                <el-input v-model="formData.field101" placeholder="请输入产权位置"  show-word-limit clearable
                     :style="{ width: '100%' }"></el-input>
            </el-form-item>
            <el-form-item label="车位号" prop="field102">
                <el-input v-model="formData.field102" placeholder="请输入车位号"  show-word-limit clearable
                    :style="{ width: '100%' }"></el-input>
            </el-form-item>
            <el-form-item label="业务号" prop="field104">
                <el-input v-model="formData.field104" placeholder="请输入业务号"  show-word-limit clearable
                    :style="{ width: '100%' }"></el-input>
            </el-form-item>
            <el-form-item label="车位面积" prop="field103">
                <el-input v-model="formData.field103" placeholder="请输入车位面积"  show-word-limit clearable
                     :style="{ width: '100%' }"></el-input>
            </el-form-item>

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
                field103: '',
                field104: '',

            },
            rules: {
                field101: [{
                    required: true,
                    message: '请输入车位位置',
                    trigger: 'blur'
                }],
                field102: [{
                    required: true,
                    message: '请输入车位号',
                    trigger: 'blur'
                }],
                field103: [{
                    required: true,
                    message: '请输入车位面积',
                    trigger: 'blur'
                }],
                field104: [{
                    required: true,
                    message: '请输入业务号',
                    trigger: 'blur'
                }],
            },
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
                field101: '',
                field102: '',
                field103: '',
                field104: '',
            }
        },
    }
}

</script>
<style></style>
