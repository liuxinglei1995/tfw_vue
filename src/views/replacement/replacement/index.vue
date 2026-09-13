<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
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

    <!-- 添加或修改补卡申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="补卡日期" prop="dateType">
          <el-select v-model="form.dateType" placeholder="请选择补卡日期">
            <el-option
              v-for="dict in tfw_buka_date"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择类型">
            <el-option
              v-for="dict in dict.type.tfw_buka_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
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
import { listReplacement, getReplacement, delReplacement, addReplacement, updateReplacement } from "@/api/replacement/replacement";

export default {
  name: "Replacement",
  dicts: ['tfw_buka_type'],
  data() {
    return {
      tfw_buka_date:[
        {
          label:"今天",
          value:"1"
        },
        {
          label:"昨天",
          value:"2"
        }
      ],
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
        state: null,
        userId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dateType: [
          { required: true, message: "补卡日期不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    var date = new Date()
    var hours = date.getHours()

    if (hours<10){
      this.tfw_buka_date.push({
        label:"昨天",
        value:"2"
      })
    }
    this.getList();
    this.form.userId = this.$store.state.user.userid
  },
  methods: {
    /** 查询补卡申请列表 */
    getList() {
      this.loading = true;
      listReplacement(this.queryParams).then(response => {
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
        id: null,
        date: null,
        type: null,
        state: null,
        userId: this.$store.state.user.userid,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加补卡申请";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getReplacement(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改补卡申请";
      });
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
          } else {
            addReplacement(this.form).then(response => {
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
        return delReplacement(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    handleApply(row) {
      updateReplacement({ id: row.id, state: '1' }).then(response => {
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
