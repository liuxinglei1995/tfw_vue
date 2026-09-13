<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="spanSize1" :xs="24" v-if="deptOptions.length > 0 && deptTreeShow">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small"
                    prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                   :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                   @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="spanSize2" :xs="24">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item v-if="deptOptions.length > 0">
        <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
      </el-form-item>
      <el-form-item label="用户名称" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入用户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="用户id" prop="userId">-->
<!--        <el-input-->
<!--          v-model="queryParams.userId"-->
<!--          placeholder="请输入用户id"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="部门id" prop="deptId">-->
<!--        <el-input-->
<!--          v-model="queryParams.deptId"-->
<!--          placeholder="请输入部门id"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="更新者id" prop="updataId">-->
<!--        <el-input-->
<!--          v-model="queryParams.updataId"-->
<!--          placeholder="请输入更新者id"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="工作报告类型" prop="reportType">
        <el-select v-model="queryParams.reportType" placeholder="请选择工作报告类型" clearable>
          <el-option
            v-for="dict in dict.type.tfw_reports_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['reports:reports:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['reports:reports:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['reports:reports:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['reports:reports:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="reportsList" @selection-change="handleSelectionChange">
<!--      <el-table-column type="selection" width="55" align="center" />-->
      <el-table-column label="昵称" align="center" prop="sysUser.nickName" width="150px" />
      <el-table-column label="工作报告类型" align="center" prop="reportType" width="150px">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_reports_type" :value="scope.row.reportType"/>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center" prop="createTime" width="150px" />
      <el-table-column label="工作报告内容" align="center" prop="workContent" >
        <template slot-scope="scope">
          <div v-html="scope.row.workContent"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150px" >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['reports:reports:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['reports:reports:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
        </el-col>
    </el-row>
    <!-- 添加或修改工作报告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="900px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工作报告类型" prop="reportType">
          <el-select v-model="form.reportType" placeholder="请选择工作报告类型">
            <el-option
              v-for="dict in dict.type.tfw_reports_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="工作报告内容">
          <editor v-model="form.workContent" :min-height="192"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


import { addReports, delReports, getReports, listReports, updateReports } from '@/api/reports/reports'
import { myDeptTreeSelect } from '@/api/system/user'

  export default {
  name: "Reports",
  dicts: ['tfw_reports_type'],
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
      // 工作报告表格数据
      reportsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        nickName: null,
        deptId: null,
        reportType: null,
        workContent: null,
        updataId: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      departmentId: null,
      spanSize1: 0,
      spanSize2: 24,
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      deptTreeName: '显示部门树',
      deptTreeShow: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
    };
  },
  created() {
    this.queryParams.deptId = this.$store.state.user.companyDept.deptId;
    // this.getinfo();
    this.getDeptTree();
  },
    watch: {
      // 根据名称筛选部门树
      deptName(val) {
        this.$refs.tree.filter(val);
      }
    },
  methods: {
    /** 查询部门下拉树结构 */
    getDeptTree() {
      myDeptTreeSelect().then(response => {
        this.deptOptions = response.data;
        this.departmentId = this.deptOptions[0].id
        this.queryParams.deptId = this.departmentId
        this.getList();
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    handleDeptTree() {
      if (this.deptTreeShow) {
        this.spanSize1 = 0
        this.spanSize2 = 24
        this.deptTreeShow = false
        this.deptTreeName = '显示部门树'
      } else {
        this.spanSize1 = 4
        this.spanSize2 = 20
        this.deptTreeShow = true
        this.deptTreeName = '隐藏部门树'
      }
    },
    /** 查询工作报告列表 */
    getList() {
      this.loading = true;
      console.log(this.queryParams)
      listReports(this.queryParams).then(response => {
        this.reportsList = response.rows;
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
        reportId: null,
        userId: null,
        deptId: null,
        reportType: "1",
        workContent: null,
        createTime: null,
        updateTime: null,
        updataId: null
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
      this.queryParams.deptId = this.departmentId
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.reportId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.workContent="<p class=\"ql-align-center\"><strong class=\"ql-size-huge\">每日汇总</strong></p><p class=\"ql-align-center\">今日完成<u>（）</u>组出售自开&nbsp;推荐<u>（）</u>组 已录系统；</p><p class=\"ql-align-center\">今日完成<u>（）</u>组出租自开&nbsp;推荐<u>（）</u>组 已录系统；</p><p class=\"ql-align-center\">今日开发求租<u>（）</u>组&nbsp;开发求购<u>（）</u>组&nbsp;已录系统；</p><p class=\"ql-align-center\">今日推荐求购<u>（）</u>组&nbsp;推荐求租<u>（）</u>组&nbsp;已录系统；</p><p class=\"ql-align-center\"><strong class=\"ql-size-huge\">所管项目出租出售</strong></p><p class=\"ql-align-center\">今日带看租<u>（）</u>个，带看求购<u>（）</u>个，自看<u>（）</u>套；</p><p class=\"ql-align-center\">本月目标<u>（）</u>万，已完成<u>（）</u>元；</p><p class=\"ql-align-center\">本月本项目同行成交套出售&nbsp;<u>（）</u>套 出租 <u>（）</u>套</p>"
      this.open = true;
      this.title = "添加工作报告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const reportId = row.reportId || this.ids
      getReports(reportId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改工作报告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.reportId != null) {
            updateReports(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReports(this.form).then(response => {
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
      const reportIds = row.reportId || this.ids;
      this.$modal.confirm('是否确认删除工作报告编号为"' + reportIds + '"的数据项？').then(function() {
        return delReports(reportIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('reports/reports/export', {
        ...this.queryParams
      }, `reports_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
