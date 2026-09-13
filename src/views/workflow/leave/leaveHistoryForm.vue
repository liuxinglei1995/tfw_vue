<template>
  <div>
    <div style="width: 50%;background: #fff;padding:20px; ">
      <div class="approvalProcess">
        <el-steps :active="this.fromData.length + 1" finish-status="success" direction="vertical">
          <el-step :title="form.title">
            <template slot="description">
              <div class="step-row">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                  <tr>
                    <td style="color:#98A6BE">
                      <div class="processing_content_detail" style="float:left;width:80%"><span>请假人：&nbsp;&nbsp;<span
                            style="color:#219AFF">{{ form.createName }}</span>&nbsp;&nbsp;</span></div>
                      <div class="processing_content_detail" style="float:left;"><span><i
                            class="el-icon-s-help"></i>&nbsp;&nbsp;请假原因：{{ form.reason }}</span> </div>
                      <div class="processing_content_detail" style="float:left;">
                        <span><i class="el-icon-time"></i>&nbsp;&nbsp;开始时间:{{ form.leaveStartTime }}</span>
                        <br>
                        <span><i class="el-icon-time"></i>&nbsp;&nbsp;结束时间:{{ form.leaveEndTime }}</span>
                        <br>
                        <span><i class="el-icon-time"></i>&nbsp;&nbsp;提交时间:{{ form.createTime }}</span>
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
                      <div class="processing_content_detail" style="float:left;width:70%"><span>审批人&nbsp;&nbsp;<span
                            style="color:#219AFF">{{ item.createName }}</span>&nbsp;&nbsp;提交了审批</span></div>
                      <div class="processing_content_detail" style="float:left;"><span><i
                            class="el-icon-time"></i>&nbsp;&nbsp;{{ item.createdDate }}</span> </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div class="processing_content_detail" style="float:left;width:70%"
                        v-for="formlist in item.formHistoryDataDTO" :key="formlist.vlaue">
                        <div
                          style="float:left;width: 2px;height: 20px; background:#C7D4E9;margin-left:10px;margin-right:10px">
                        </div>
                        <span style="color:#919FB8">{{formlist.title }}:</span>
                        <span style="color:#919FB8">{{formlist.value }}</span>
        
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </template>
          </el-step>
        </el-steps>
        <!-- <el-button style="margin-top: 12px;" @click="next">下一步</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getLeave } from '@/api/workflow/leave'
import { historyFromData } from '@/api/activiti/historyFormdata'
export default {
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
      active: 0,
    }
  },
  created() {
    this.getLeave()
    this.historyFromData()
  },
  methods: {
    getLeave() {
      getLeave(this.businessKey).then(response => {
        this.form = response.data
      })
    },
    historyFromData() {
      historyFromData(this.businessKey).then(response => {
        this.fromData = response.data
        console.log(this.fromData, "322222s");
      })
    },

  }

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
</style>
