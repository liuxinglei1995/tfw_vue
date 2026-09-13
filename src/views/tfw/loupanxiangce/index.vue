<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="小区id" prop="xqId">
        <el-input v-model="queryParams.xqId" placeholder="请输入小区id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <el-form-item label="创建者" prop="createdBy">
        <el-input v-model="queryParams.createdBy" placeholder="请输入创建者" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="更新者" prop="updatedBy">
        <el-input v-model="queryParams.updatedBy" placeholder="请输入更新者" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['loupanxiangce:loupanxiangce:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['loupanxiangce:loupanxiangce:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['loupanxiangce:loupanxiangce:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['loupanxiangce:loupanxiangce:export']">导出</el-button>
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="loupanxiangceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="小区id" align="center" prop="xqId" /> -->
      <el-table-column label="图片链接" align="center" prop="image" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="图片类型" align="center" prop="type" /> -->
      <!-- <el-table-column label="状态" align="center" prop="status" /> -->
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
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['loupanxiangce:loupanxiangce:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['loupanxiangce:loupanxiangce:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加或修改楼盘相册对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="图片链接" prop="image">
          <image-upload v-model="form.image" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
import { listLoupanxiangce, getLoupanxiangce, delLoupanxiangce, addLoupanxiangce, updateLoupanxiangce } from "@/api/loupanxiangce/loupanxiangce";
import { mapState } from 'vuex';

export default {
  name: "Loupanxiangce",
  computed: {
    ...mapState("datatools", ["id"])
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
      // 楼盘相册表格数据
      loupanxiangceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqId: null,
        image: null,
        type: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        nickName: null,
      },
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        id: [
          { required: true, message: "图片id不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },

  methods: {
    /** 查询楼盘相册列表 */
    getList() {
      this.loading = true;
      this.queryParams.xqId = this.id

      listLoupanxiangce(this.queryParams).then(response => {
        this.loupanxiangceList = response.rows;
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
        xqId: this.id,
        image: null,
        type: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        remark: null,
        nickName: null,
        createByName: null,
        updateByName: null,
      };
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
      this.title = "添加楼盘相册";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getLoupanxiangce(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改楼盘相册";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLoupanxiangce(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLoupanxiangce(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除楼盘相册编号为"' + ids + '"的数据项？').then(function () {
        return delLoupanxiangce(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('loupanxiangce/loupanxiangce/export', {
        ...this.queryParams
      }, `loupanxiangce_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
