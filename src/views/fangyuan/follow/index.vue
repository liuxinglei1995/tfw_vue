<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="房源id" prop="houseId">
        <el-input v-model="queryParams.houseId" placeholder="请输入房源id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建者" prop="createdBy">
        <el-input v-model="queryParams.createdBy" placeholder="请输入创建者" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="更新者" prop="updatedBy">
        <el-input v-model="queryParams.updatedBy" placeholder="请输入更新者" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createdAt">
        <el-date-picker clearable v-model="queryParams.createdAt" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="更新时间" prop="updatedAt">
        <el-date-picker clearable v-model="queryParams.updatedAt" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择更新时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="删除时间" prop="deletedAt">
        <el-date-picker clearable v-model="queryParams.deletedAt" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择删除时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:follow:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:follow:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:follow:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:follow:export']">导出</el-button>
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="followList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="房源id" align="center" prop="houseId" />
      <el-table-column label="备注" align="center" prop="remark" />
<!--      <el-table-column label="类型" align="center" prop="type" />-->
      <el-table-column label="创建者" align="center" prop="createByName" />
      <el-table-column label="更新者" align="center" prop="updateByName" />
      <el-table-column label="创建时间" align="center" prop="createdAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="updatedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updatedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="删除时间" align="center" prop="deletedAt" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deletedAt, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:follow:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:follow:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改房源跟进对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="房源id" prop="houseId">
          <el-input v-model="form.houseId" placeholder="请输入房源id" />
        </el-form-item> -->
<!--        <el-form-item label="创建者" prop="createdBy">-->
<!--          <el-input v-model="form.createdBy" placeholder="请输入创建者" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="更新者" prop="updatedBy">-->
<!--          <el-input v-model="form.updatedBy" placeholder="请输入更新者" />-->
<!--        </el-form-item>-->
<!--        <el-form-item label="创建时间" prop="createdAt">-->
<!--          <el-date-picker clearable v-model="form.createdAt" type="date" value-format="yyyy-MM-dd" placeholder="请选择创建时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="更新时间" prop="updatedAt">-->
<!--          <el-date-picker clearable v-model="form.updatedAt" type="date" value-format="yyyy-MM-dd" placeholder="请选择更新时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="删除时间" prop="deletedAt">-->
<!--          <el-date-picker clearable v-model="form.deletedAt" type="date" value-format="yyyy-MM-dd" placeholder="请选择删除时间">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item label="跟进内容" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listFollow, getFollow, delFollow, addFollow, updateFollow } from "@/api/system/follow";
import { mapState } from 'vuex';

export default {
  name: "Follow",
  computed: {
    ...mapState("datatools", ["fanyuanid"])
  },
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
      showSearch: false,
      // 总条数
      total: 0,
      // 房源跟进表格数据
      followList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        houseId: null,
        type: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        id: [
          { required: true, message: "主键不能为空", trigger: "blur" }
        ],
        houseId: [
          { required: true, message: "房源id不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询房源跟进列表 */
    getList() {
      this.loading = true;
      this.queryParams.houseId = this.fanyuanid;
      listFollow(this.queryParams).then(response => {
        this.followList = response.rows;
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
        houseId: this.fanyuanid,
        type: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加房源跟进";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFollow(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改房源跟进";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFollow(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            console.log(this.form,"dkjakfjwkjfkajf")
            addFollow(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除房源跟进编号为"' + ids + '"的数据项？').then(function () {
        return delFollow(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/follow/export', {
        ...this.queryParams
      }, `follow_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
