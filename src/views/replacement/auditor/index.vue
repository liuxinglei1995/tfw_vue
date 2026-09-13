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
      <el-col :span="spanSize2" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item v-if="deptOptions.length > 0">
            <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
          </el-form-item>
          <el-form-item label="补卡日期" prop="date">
            <el-date-picker clearable
                            v-model="queryParams.date"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择补卡日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="queryParams.type" placeholder="请选择类型" clearable>
              <el-option
                v-for="dict in dict.type.tfw_buka_type"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建id" prop="userId">
            <el-input
              v-model="queryParams.userId"
              placeholder="请输入创建id"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="replacementList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="主键" align="center" prop="id" />
          <el-table-column label="补卡日期" align="center" prop="date" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="type">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tfw_buka_type" :value="scope.row.type"/>
            </template>
          </el-table-column>
          <el-table-column label="申请人" align="center" prop="createBy" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="状态" align="center" prop="state">
            <template slot-scope="scope">
              <span v-if="scope.row.state === '0'">待提交</span>
              <span v-else-if="scope.row.state === '1'">审核中</span>
              <span v-else-if="scope.row.state === '99'">驳回</span>
              <span v-else-if="scope.row.state === '100'">通过</span>
              <span v-else>未知状态</span>
            </template>
          </el-table-column>
          <el-table-column label="审核人" align="center" prop="updateName" />
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                v-if="scope.row.state !== '100'"
                @click="handleApply(scope.row)"
              >审核</el-button>
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
    <!-- 添加或修改补卡申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="申请原因" prop="state">
          {{form.remark}}
        </el-form-item>
        <el-form-item label="审批" prop="state">
          <el-radio v-model="form.state" label="100">同意</el-radio>
          <el-radio v-model="form.state" label="99">驳回</el-radio>
        </el-form-item>
        <el-form-item label="审批意见" prop="view">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入审批意见"
            v-model="form.view">
          </el-input>
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
import { auditorListReplacement, getReplacement, delReplacement, addReplacement, updateReplacement } from "@/api/replacement/replacement";
import { myDeptTreeSelect } from '@/api/system/user'

export default {
  name: "Replacement",
  dicts: ['tfw_buka_type'],
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
      // 补卡申请表格数据
      replacementList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        date: null,
        dateType: null,
        type: null,
        state: "1",
        userId: null,
        deptId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        state: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        view: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ]
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
    this.getDeptTree();
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

    /** 查询补卡申请列表 */
    getList() {
      this.loading = true;
      auditorListReplacement(this.queryParams).then(response => {
        this.replacementList = response.rows;
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
        pageNum: 1,
        pageSize: 10,
        dateType: null,
        state: "1",
        id: null,
        date: null,
        type: null,
        userId: null,
        updateTime: null,
        updateBy: null,
        createTime: null,
        remark: null
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
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 修改按钮操作 */
    handleApply(row) {
      this.reset();
      this.form.id = row.id;
      this.form.remark = row.remark;
      this.open = true;
      this.title = "审核补卡申请";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        console.log(this.form, 'form')
        if (valid) {
          if (this.form.id != null) {
            updateReplacement(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  }
};
</script>
