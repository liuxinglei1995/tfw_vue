<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="领取状态" prop="type">
        <el-select v-model="queryParams.params.status" placeholder="领取状态" clearable>
          <el-option v-for="dict in dict.type.tfw_loan_get_status" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="贷款用途" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择贷款用途" clearable>
          <el-option v-for="dict in dict.type.tfw_loan_type" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['loan:loan:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['loan:loan:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['loan:loan:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['loan:loan:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="loanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="loanId" />
      <el-table-column label="所属人" align="center" prop="userId" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="手机号" align="center" prop="num" />
      <el-table-column label="贷款用途" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_loan_type" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="所在区域" align="center" prop="area" />
      <el-table-column label="推荐人" align="center" prop="reference" />
      <el-table-column label="特殊备注" align="center" prop="remark" />
      <el-table-column label="创建者" align="center" prop="createId" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userId" size="mini" type="text" icon="el-icon-edit"
            @click="handleDrawer(scope.row)" v-hasPermi="['loan:loan:edit']">详情</el-button>
          <el-button v-else size="mini" type="text" icon="el-icon-edit" @click="receiveUpdate(scope.row)"
            v-hasPermi="['loan:loan:edit']">领取</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['loan:loan:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['loan:loan:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!--    详情-->
    <el-drawer :visible.sync="drawer" :direction="direction" size="45%" :with-header="false">
      <el-descriptions class="margin-top" :title="title" :column="3" border>
        <template slot="extra">
          <el-button type="primary" @click="handlefollowAdd(drawerform)" size="small">新增跟进</el-button>
          <el-button type="primary" @click="handleUpdate(drawerform)" size="small">修改</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            姓名
          </template>
          {{ drawerform.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{ drawerform.num }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            贷款用途
          </template>
          <dict-tag :options="dict.type.tfw_loan_type" :value="drawerform.type" />
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            所在区域
          </template>
          {{ drawerform.area }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            所属人
          </template>
          {{ drawerform.userId }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            推荐人
          </template>
          {{ drawerform.reference }}
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template slot="label">
            <i class="el-icon-office-building"></i>
            特殊备注
          </template>
          {{ drawerform.remark }}
        </el-descriptions-item>
      </el-descriptions>
      <div class="loan_block" v-infinite-scroll="getList">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in loanFollowList" :key="index" placement="top">
            <el-card class="loan_card">
              <h4>{{ item.remack }}</h4>
              <p>王小虎 提交于 {{ item.createTime }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-drawer>
    <!-- 添加或修改贷款对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="num">
          <el-input v-model="form.num" placeholder="请输入手机号" maxlength="11" show-word-limit />
        </el-form-item>
        <el-form-item label="贷款用途" prop="type">
          <el-select v-model="form.type" placeholder="请选择贷款用途">
            <el-option v-for="dict in dict.type.tfw_loan_type" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所在区域" prop="area">
          <StateCityDistrictStreetSelector :placeholder="'选择区域'" v-model="form.area" :ssqldList="ssqldListIndex"
            :value="form.area" />
        </el-form-item>
        <el-form-item label="推荐人" prop="reference">
          <el-input v-model="form.reference" placeholder="请输入推荐人" />
        </el-form-item>
        <el-form-item label="特殊备注" prop="remark">
          <el-input v-model="form.remark" placeholder="特殊备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    添加跟进对话框-->

    <!-- 添加或修改贷款跟进对话框 -->
    <el-dialog :title="title" :visible.sync="followopen" width="500px" append-to-body>
      <el-form ref="followform" :model="followform" label-width="80px">
        <el-form-item label="跟进内容" prop="remack">
          <el-input v-model="followform.remack" placeholder="请输入跟进内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="followsubmitForm">确 定</el-button>
        <el-button @click="followopen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>


import { addLoan, delLoan, getLoan, listLoan, updateLoan } from '@/api/loan/loan'
import { getlist } from '@/api/province'
import { addLoanFollow, listLoanFollow } from '@/api/loan/loanFollow'

export default {
  name: "Loan",
  dicts: ['tfw_loan_type', 'tfw_loan_get_status'],
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      ssqldListIndex: [],
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
      // 贷款表格数据
      loanList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptId: null,
        userId: null,
        type: null,
        area: null,
        reference: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        params: {
          status: "1"
        }
      },
      // 表单参数
      form: {},
      drawerform: {},
      // 表单校验
      rules: {
      },

      //   跟进
      followopen: false,
      followform: {},
      loanFollowList: []
    };
  },
  created() {
    this.getList();
    getlist(3).then(response => {
      this.ssqldListIndex = this.handleTree(response.data, "id", "parentId");
    })
  },
  methods: {
    /** 领取 */
    receiveUpdate(row) {
      this.$confirm('是否确认领取?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let userId = this.$store.state.user.userid
        updateLoan({ loanId: row.loanId, userId: userId, params: { receive: true } }).then(response => {
          this.$modal.msgSuccess("领取成功");

          this.getList();
        })
      })
    },
    /** 查询贷款列表 */
    getList() {
      this.loading = true;
      listLoan(this.queryParams).then(response => {
        this.loanList = response.rows;
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
        loanId: null,
        deptId: null,
        name: null,
        num: null,
        userId: null,
        type: null,
        area: null,
        reference: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    // 表单重置
    drawerreset() {
      this.drawerform = {
        loanId: null,
        deptId: null,
        name: null,
        num: null,
        userId: null,
        type: null,
        area: null,
        reference: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    // 表单重置
    followreset() {
      this.followform = {
        id: null,
        loanId: null,
        remack: null,
        deptId: null,
        userId: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      };
      this.resetForm("followform");
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
      this.ids = selection.map(item => item.loanId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加贷款";
    },
    /** 新增跟进按钮操作 */
    handlefollowAdd(row) {
      this.followreset();
      this.followform.loanId = row.loanId;
      this.followopen = true;
      this.title = "添加贷款跟进";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const loanId = row.loanId || this.ids
      getLoan(loanId).then(response => {
        this.form = response.data;
        this.form.area = this.form.area.split(',')
        this.open = true;
        this.title = "修改贷款";
      });
    },
    /** 详情 */
    handleDrawer(row) {
      this.drawerreset();
      const loanId = row.loanId || this.ids
      this.getFollowList(row)
      getLoan(loanId).then(response => {
        this.drawerform = response.data
        this.drawerform.area = this.drawerform.area.split(',')
        this.drawer = true;
        this.title = "贷款用户详情";
      });
    },
    /** 获取跟进 */
    getFollowList(row) {
      const loanId = row.loanId
      listLoanFollow({ loanId: loanId }).then(response => {
        this.loanFollowList = response.rows;
        this.followopen = false;
      });
    },
    /** 跟进提交 */
    followsubmitForm() {
      this.$refs["followform"].validate(valid => {
        if (valid) {
          addLoanFollow(this.followform).then(response => {
            this.$modal.msgSuccess("新增跟进成功");
            this.open = false;
            this.getFollowList(this.followform);
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        this.form.area = this.form.area.join(',')
        if (valid) {
          if (this.form.loanId != null) {
            updateLoan(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              if (this.drawer) {
                this.handleDrawer(this.form)
              }
              this.getList();
            });
          } else {
            console.log(this.form, "传递的数据");
            addLoan(this.form).then(response => {
              console.log(this.form, "1111111");
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
      const loanIds = row.loanId || this.ids;
      this.$modal.confirm('是否确认删除贷款编号为"' + loanIds + '"的数据项？').then(function () {
        return delLoan(loanIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('loan/loan/export', {
        ...this.queryParams
      }, `loan_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style>
.margin-top {}

.loan_card {
  width: 50%;
}

.loan_block {
  margin-top: 20px;
  height: 80%;
  overflow: auto;
}
</style>
