<template>
    <div>
        <div style="width: 50%;background: #fff;padding:20px;">
            <div class="approvalProcess">
                <el-steps :active="this.fromData.length + 1" finish-status="success" direction="vertical">
                    <el-step :title="form.title">
                        <template slot="description">
                            <div class="step-row">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                                    <tr>
                                        <td style="color:#98A6BE">
                                            <div class="processing_content_detail" style="float:left;width:80%">
                                                <div style="display: flex; font-size: 16px;">
                                                    <dict-tag :options="dict.type.tfw_look_type" :value="form.type"
                                                        class="dicts" />
                                                    <dict-tag :options="dict.type.tfw_yuye_type" :value="form.userType"
                                                        class="dicts" />
                                                    <dict-tag :options="dict.type.tfw_time_type" :value="form.timeType"
                                                        class="dicts" />
                                                </div>
                                            </div>
                                            <div>
                                                <div class="processing_content_detail" style="float:left;"><span><i
                                                            class="el-icon-s-help"></i>&nbsp;&nbsp;带看人:{{ form.user.nickName
                                                            }}</span>
                                                </div>
                                            </div>
                                            <div v-if="form.type == 1">
                                                <div class="processing_content_detail" style="float:left;">
                                                    <span><i class="el-icon-s-help"></i>&nbsp;&nbsp;新房小区:
                                                        <span v-for="(item, index) in form.loupanXqs" :key="index">
                                                            {{ item.title }}小区id:{{ item.id }}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div class="processing_content_detail" style="float:left;">
                                                    <span><i class="el-icon-s-help"></i>&nbsp;&nbsp;房源小区:
                                                        <div v-for="(item, index) in form.houses" :key="index">
                                                            {{ item.loupanXq.title }}:{{ item.building }}栋{{ item.unit
                                                            }}单元{{ item.floor }}层{{ item.roomNum }}号
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                            <div v-if="form.userType == 1">
                                                <div class="processing_content_detail" style="float:left;"><span><i
                                                            class="el-icon-s-help"></i>&nbsp;&nbsp;预约用户id:{{
                                                                form.appointmentUser.nickName
                                                            }}</span>
                                                </div>
                                            </div>
                                            <div v-if="form.userType == 2">
                                                <div class="processing_content_detail" style="float:left;"><span><i
                                                            class="el-icon-s-help"></i>&nbsp;&nbsp;求购用户:
                                                        <span v-for="(item, index) in form.sourceTourists.customer"
                                                            :key="index">
                                                            {{ item.name }}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div class="processing_content_detail" style="float:left;"><span><i
                                                        class="el-icon-user-solid"></i>&nbsp;&nbsp;陪看人:
                                                    <span v-for="(item, index) in form.andUser" v-if="item">
                                                        {{ item.nickName }}
                                                    </span>
                                                </span>
                                            </div>
                                            <div class="processing_content_detail" style="float:left;">
                                                <span><i class="el-icon-time"></i>&nbsp;&nbsp;到访时间:{{
                                                    form.customerReportingTime
                                                }}</span>
                                                <br />
                                                <span><i class="el-icon-time"></i>&nbsp;&nbsp;备注:{{ form.reason
                                                }}</span>
                                            </div>

                                            <div v-if="form.attachmentLink" v-for="item in form.attachmentLink">
                                              <imagePreview  :src="item" :width="80"
                                                               :height="70" :looktext="[item]" />
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </template>
                    </el-step>
                    <el-step :title="item.taskNodeName" v-for="item in fromData" :key="item.id" :id="item.id">
                        <template slot="description">
                            <div class="step-row">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                                    <tr>
                                        <td style="color:#98A6BE">
                                            <div class="processing_content_detail" style="float:left;width:70%">
                                                <span>审批人&nbsp;&nbsp;<span style="color:#219AFF">{{ item.createName
                                                }}</span>&nbsp;&nbsp;提交了审批</span>
                                            </div>
                                            <div class="processing_content_detail" style="float:left;"><span><i
                                                        class="el-icon-time"></i>&nbsp;&nbsp;{{ item.createdDate }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="processing_content_detail" style="float:left;width:70%"
                                                v-for="formlist in item.formHistoryDataDTO" :key="formlist.vlaue">
                                                <div
                                                    style="float:left;width: 2px;height: 20px; background:#C7D4E9;margin-left:10px;margin-right:10px">
                                                </div>
                                                <div v-if="formlist.title == '看房图片'">
                                                    <imagePreviewindex :src="formlist.value.split(',')[0]" :width="80"
                                                        :height="70" :looktext="formlist.value.split(',')" />

                                                </div>
                                                <div v-else>
                                                    <span style="color:#919FB8">{{ formlist.title }}:</span>
                                                    <span style="color:#919FB8">{{ formlist.value }}</span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </template>
                    </el-step>
                </el-steps>
            </div>
        </div>

    </div>
</template>

<script>
// import { getLeave } from '@/api/workflow/leave'
import { historyFromData } from '@/api/activiti/historyFormdata'
import { getReporting } from "@/api/workflow/reporting";
import dict from '../../../store/modules/dict';

export default {
    dicts: ['tfw_look_type', 'tfw_yuye_type', 'tfw_time_type'],
    name: "leaveHistoryForm",
    props: {
        businessKey: {
            type: String
        }
    },
    data() {
        return {
            // 表单参数
            form: {},
            fromData: [],
        };
    },
    created() {
        this.getReporting();
        this.historyFromData();
    },
    methods: {
        getReporting() {
            getReporting(this.businessKey).then(response => {
                this.form = response.data;
                this.form.sourceTourists.customer = JSON.parse(this.form.sourceTourists.customer)
                this.form.attachmentLink = JSON.parse(this.form.attachmentLink)
                console.log(this.form, "sssssss");
            });
        },
        historyFromData() {
            historyFromData(this.businessKey).then(response => {
                this.fromData = response.data;
                console.log(this.fromData, "2222222");
            });
        },
    },
    components: { dict }
}
</script>

<style scoped lang="scss">
.stepComponent {
    width: 80%;
    // background-color: #DFEBFF;
    padding: 10px 10px 10px 10px;
    margin: 10px 10px 10px 10px;
}

.stepsTitle {
    margin: 10px 0px 10px 10px;
}

.approvalProcess {
    // color: #9EADC4;
    font-size: 14px;
    /* width: 100%; */
    // background: #DFEBFF;
    margin-left: 20px;
    margin-right: 0px;
    margin-top: 10px;
}

.processing_content {
    // background-color: #D9E5F9;
}

.processing_content_detail {
    margin-left: 10px;
    margin-top: 3.5px;
    margin-bottom: 3.5px;
    width: 200px;
    display: inline-block;
}

.step-row {
    min-width: 300px;
    margin-bottom: 12px;
    margin-top: 12px;
}

.dicts {
    margin-right: 10px;
    color: #409EFF;
}
</style>
