<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="tastList">
      <el-table-column label="流程名称" align="center" prop="instanceName" />
      <el-table-column label="任务节点名称" align="center" prop="name" />
      <el-table-column label="任务状态" align="center" prop="status" />
      <el-table-column label="办理人" align="center" prop="assignee" />
      <el-table-column label="创建时间" align="center" prop="createdDate" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="examineAndApprove(scope.row)">审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 审批对话框 -->
    <el-dialog :title="title" :visible.sync="open" v-if="open" width="600px" append-to-body
      v-loading.fullscreen.lock="loading" element-loading-text="审核提交中，请稍后" element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <leaveHistoryForm :businessKey="businessKey" v-if="'leave' == definitionKey" />
      <reportingHistoryForm :businessKey="businessKey" v-if="'Process_1' == definitionKey" />
      <el-steps direction="vertical" :active="1">
        <el-step :title="'下一步'">
          <template slot="description">
            <div>

              <el-form :model="form" ref="form" label-width="100px" class="demo-dynamic">
                <div v-for="(domain, index) in form.formData" :key="index">
                  <el-form-item :label="domain.controlLable" v-if="domain.flag">
                    <div class="step-row">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="processing_content">
                        <tr>
                          <td style="color:#98A6BE">
                            <el-radio-group v-model="domain.controlValue" v-if="'radio' == domain.controlType"
                              @change="changeradio(domain.controlLable)">
                              <el-radio v-for="(defaults, indexd) in domain.controlDefault.split('--__--')"
                                :label=indexd :key="indexd">{{
      defaults }}
                              </el-radio>
                            </el-radio-group>
                            <div v-if="'input' == domain.controlType">
                              <el-input v-model="domain.controlValue"></el-input>
                            </div>
                            <div v-if="'textarea' == domain.controlType">
                              <el-input type="textarea" v-model="domain.controlValue"></el-input>
                            </div>
                            <div v-if="'imageupload' == domain.controlType">
                              <image-upload v-model="domain.controlValue" :limit=5 />
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>

          </template>
        </el-step>
      </el-steps>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


import { listTask, formDataShow, formDataSave, test } from "@/api/activiti/task";
import leaveHistoryForm from "@/views/workflow/leave/leaveHistoryForm";
import reportingHistoryForm from "@/views/workflow/reporting/reportingHistoryForm";
export default {
  name: "Leave",
  components: { leaveHistoryForm, reportingHistoryForm },
  data() {
    return {
      businessName: "",
      id: '',
      definitionKey: '',
      businessKey: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 请假表格数据
      tastList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {
        formData: []
      },
      // 表单校验
      rules: {}
    };
  },
  created() {
    this.getList();
  },
  methods: {
    test() {
      test().then(res => {
        console.log(res, "111111");
      })
    },
    changeradio(e) {
      if (e == "是否成交") {
        for (let index = 0; index < this.form.formData.length; index++) {
          if (this.form.formData[index].controlLable != "是否成交") {
            this.form.formData[index].flag = !this.form.formData[index].flag
          }
        }
      }
    },
    /** 查询请假列表 */
    getList() {
      this.loading = true;
      listTask(this.queryParams).then(response => {
        this.tastList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.definitionKey = '',
        this.businessKey = '',
        this.form = {
          formData: [],
        };
      this.resetForm("form");
    },

    /** 审批按钮操作 */
    examineAndApprove(row) {
      this.reset();
      this.definitionKey = row.definitionKey;
      this.businessKey = row.businessKey;
      this.businessName = row.name
      this.id = row.id;
      formDataShow(row.id).then(response => {
        // FormProperty_3qipis2--__!!radio--__!!审批意见--__!!i--__!!同意--__--不同意
        // FormProperty_0lffpcm--__!!textarea--__!!批注--__!!f--__!!null
        let datas = response.data;
        console.log(response, "6666666666666666666666666666666");
        let formData = []
        if (datas) {
          for (let i = 0; i < datas.length; i++) {
            let strings = datas[i].split('--__!!')
            let controlValue = null
            let controlDefault = null
            switch (strings[1]) {
              case 'radio':
                controlValue = 0;
                controlDefault = strings[4]
                break;
              // default:
            }
            formData.push({
              controlId: strings[0],
              controlType: strings[1],
              controlLable: strings[2],
              controlIsParam: strings[3],
              controlValue: controlValue,
              controlDefault: controlDefault,
              flag: true,
            })

          }
        }
        this.form.formData = formData;
        console.log(this.form.formData, "3333");
        this.open = true;
        this.title = "审批";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.loading = true;
      formDataSave(this.id, this.form.formData).then(response => {
        this.$modal.msgSuccess("审批成功");
        this.open = false;
        this.loading = false;
        this.getList();
      });
    },
  }
};
</script>
