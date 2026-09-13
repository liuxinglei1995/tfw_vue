<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="60px">
      <el-form-item label="小区名" prop="xqId">
        <el-input v-model="queryParams.xqId" placeholder="id/小区名" clearable @keyup.enter.native="handleQuery"
          style="width: 100px;" />
      </el-form-item>
      <el-form-item label="客户名" prop="userOrSoureId">
        <el-input v-model="queryParams.userOrSoureId" placeholder="手机号/id/名字" clearable @keyup.enter.native="handleQuery"
          style="width: 100px;" />
      </el-form-item>
      <el-form-item label="报备时间" prop="createTime" label-width="68px">
        <el-date-picker clearable v-model="queryParams.createTime" type="date" placeholder="请选择时间" style="width: 130px;">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="到访时间" prop="customerReportingTime" label-width="68px">
        <el-date-picker clearable v-model="queryParams.customerReportingTime" type="date" placeholder="请选择时间"
          style="width: 130px;">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="客户信息" prop="customer">
        <el-input v-model="queryParams.customer" placeholder="请输入客户信息" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="结束时间" prop="leaveEndTime">
        <el-date-picker clearable v-model="queryParams.leaveEndTime" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item> -->
      <!-- <el-form-item label="流程实例ID" prop="instanceId">
        <el-input v-model="queryParams.instanceId" placeholder="请输入流程实例ID" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="状态" prop="state">
        <el-input v-model="queryParams.state" placeholder="请输入状态" clearable @keyup.enter.native="handleQuery"
          style="width: 130px;" />
      </el-form-item>
      <el-form-item label="创建者" prop="createName">
        <el-input v-model="queryParams.createName" placeholder="请输入创建者" clearable @keyup.enter.native="handleQuery"
          style="width: 130px;" />
      </el-form-item>
      <!-- <el-form-item label="用户id" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="部门id" prop="deptId">
        <el-input v-model="queryParams.deptId" placeholder="部门id" clearable @keyup.enter.native="handleQuery"
          style="width: 100px;" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="reportingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="id" align="center" prop="id" />
      <el-table-column label="小区id" align="center" prop="xqId" />
      <el-table-column label="手机号/id/名字" align="center" prop="userOrSoureId" />
      <el-table-column label="看房类型" align="center" prop="type" />
      <el-table-column label="到访时间" align="center" prop="customerReportingTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.customerReportingTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="leaveEndTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.leaveEndTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户信息" align="center" prop="customer" />
      <!-- <el-table-column label="标题" align="center" prop="title" /> -->
      <!-- <el-table-column label="备注" align="center" prop="reason" /> -->
      <!-- <el-table-column label="附件" align="center" prop="attachmentLink" /> -->
      <el-table-column label="流程实例ID" align="center" prop="instanceId" />
      <!-- <el-table-column label="状态" align="center" prop="state" /> -->
      <el-table-column label="创建者" align="center" prop="createName" />
      <!-- <el-table-column label="用户id" align="center" prop="userId" /> -->
      <el-table-column label="部门" align="center" prop="deptId" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:reporting:edit']">查看流程</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改带看对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <!-- <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="小区id" prop="xqId">
          <el-input v-model="form.xqId" placeholder="请输入小区id" />
        </el-form-item>
        <el-form-item label="用户id 或者 客源id" prop="userOrSoureId">
          <el-input v-model="form.userOrSoureId" placeholder="请输入用户id 或者 客源id" />
        </el-form-item>
        <el-form-item label="到访时间" prop="customerReportingTime">
          <el-date-picker clearable
            v-model="form.customerReportingTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择到访时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="客户信息" prop="customer">
          <el-input v-model="form.customer" placeholder="请输入客户信息" />
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="备注" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="结束时间" prop="leaveEndTime">
          <el-date-picker clearable
            v-model="form.leaveEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="附件" prop="attachmentLink">
          <el-input v-model="form.attachmentLink" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="流程实例ID" prop="instanceId">
          <el-input v-model="form.instanceId" placeholder="请输入流程实例ID" />
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-input v-model="form.state" placeholder="请输入状态" />
        </el-form-item>
        <el-form-item label="创建者名称" prop="createName">
          <el-input v-model="form.createName" placeholder="请输入创建者名称" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
      </el-form> -->
      <reportingHistoryForm :businessKey="businessKey" v-if="open"></reportingHistoryForm>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReporting, getReporting, delReporting, addReporting, updateReporting, lookafter } from "@/api/workflow/reporting";
import reportingHistoryForm from "./reportingHistoryForm";
export default {
  components: { reportingHistoryForm },
  name: "Reporting",
  data() {
    return {
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
      // 带看表格数据
      reportingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqId: null,
        userOrSoureId: null,
        customerReportingTime: null,
        customer: null,
        type: null,
        title: null,
        reason: null,
        leaveEndTime: null,
        attachmentLink: null,
        instanceId: null,
        state: null,
        createName: null,
        userId: null,
        deptId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      businessKey: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询带看列表 */
    getList() {
      this.loading = true;
      lookafter(this.queryParams).then(response => {
        console.log(response, "hhhhhhhhhh");
        this.reportingList = response.rows;
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
      this.form = {
        id: null,
        xqId: null,
        userOrSoureId: null,
        customerReportingTime: null,
        customer: null,
        type: null,
        title: null,
        reason: null,
        leaveEndTime: null,
        attachmentLink: null,
        instanceId: null,
        state: null,
        createName: null,
        createBy: null,
        createTime: null,
        updateTime: null,
        userId: null,
        deptId: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    testadd() {
      this.form = {
        xqId: 2718,
        type: 1,
        params: {
          userType: 1,
          jjrid: 141
        }
      }
      addReporting(this.form).then(response => {
        this.$modal.msgSuccess("新增成功");
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加带看";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.businessKey = row.id
      this.open = true;
      this.title = "修改带看";
      // const id = row.id || this.ids
      // getReporting(id).then(response => {
      //   this.form = response.data;
      // });

    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateReporting(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReporting(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除带看编号为"' + ids + '"的数据项？').then(function () {
        return delReporting(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/reporting/export', {
        ...this.queryParams
      }, `reporting_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
