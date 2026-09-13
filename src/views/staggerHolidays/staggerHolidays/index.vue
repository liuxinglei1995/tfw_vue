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
      <!--数据-->
      <el-col :span="spanSize2" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item v-if="deptOptions.length > 0">
            <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
          </el-form-item>
          <el-form-item label="休假日期" prop="date">
            <el-date-picker clearable
                            v-model="queryParams.queryDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择休假日期">
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
          <el-form-item label="状态" prop="state">
            <el-input
              v-model="queryParams.state"
              placeholder="请输入状态"
              clearable
              @keyup.enter.native="handleQuery"
            />
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
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['replacement:replacement:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="replacementList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="主键" align="center" prop="id" />
          <el-table-column label="休假日期" align="center" prop="date" width="180">
            <template slot-scope="scope">
              <div v-if="scope.row.dateList.length > 0">
                <div v-for="item in scope.row.dateList">
                  {{ parseTime(item, '{y}-{m}-{d}') }}、
                </div>
              </div>
              <span v-else>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请人" align="center" prop="userName" />
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
          <el-table-column label="审核人" align="center" prop="approveName" />
          <el-table-column label="审核日期" align="center" prop="approveTime" width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.approveTime !== scope.row.date">{{ parseTime(scope.row.approveTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                v-if="scope.row.state === '0' || scope.row.state === '99'"
                @click="handleApply(scope.row)"
              >申请审核</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['replacement:replacement:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                v-if="scope.row.state !== '100'"
                @click="handleDelete(scope.row)"
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
    <!-- 添加或修改补卡申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="休假日期" prop="dateList">
          <el-date-picker
            v-model="form.dateList"
            type="dates"
            :picker-options="pickerOptions"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"
            v-model="form.remark">
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
import { listHolidays, getHolidays, delHolidays, addHolidays, updateHolidays } from "@/api/staggerHolidays/staggerHolidays";
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
        queryDate: null,
        dateType: null,
        type: null,
        state: null,
        userId: null,
      },

      // 表单参数
      form: {},
      //选定休假日期
      selectedDate: '',
      pickerOptions: {
        disabledDate: (time) => {
          // 获取当前日期
          const now = new Date();
          // 设置当前日期为今天午夜（去掉时间部分）
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          // 计算允许的最早日期（今天+1天）
          const minDate = new Date(today);
          minDate.setDate(minDate.getDate() + 1);
          // 计算允许的最晚日期（最早日期+15天）
          const maxDate = new Date(minDate);
          maxDate.setDate(maxDate.getDate() + 30); // 14天后共15天
          // 禁用今天和明天的日期
          if (time < minDate) {
            return true
          }
          // 禁用15天后的日期
          if (time > maxDate) {
            return true
          }
          return false
        }
      },
      // 表单校验
      rules: {
        date: [
          { required: true, message: "休假日期不能为空", trigger: "blur" }
        ],
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
    this.form.userId = this.$store.state.user.userid
    this.queryParams.deptId = this.$store.state.user.companyDept.deptId;
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
      listHolidays(this.queryParams).then(response => {
        this.replacementList = response.rows;

        for (const holidays of response.rows) {
          let dateList = []
          for (const holiday of holidays.holidays) {
            dateList.push(holiday.date)
          }
          holidays.dateList = dateList
        }
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
        dateList: null,
        state: "1",
        userId: this.$store.state.user.userid,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加休假申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      getHolidays(row.id).then(response => {
        this.form = response.data;
        let dateList = [];
        for (const holiday of response.data.holidays) {
          dateList.push(holiday.date)
        }
        this.form.dateList = dateList;
        console.log(this.form)
        this.open = true;
        this.title = "修改休假申请";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            this.form.state = 1;
            updateHolidays(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addHolidays(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除补卡申请编号为"' + ids + '"的数据项？').then(function() {
        return delHolidays(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleApply(row) {
      updateHolidays({ id: row.id, state: '1' }).then(response => {
        this.$modal.msgSuccess("提交申请成功");
        this.open = false;
        this.getList();
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('replacement/replacement/export', {
        ...this.queryParams
      }, `replacement_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
