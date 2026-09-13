<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="queryParams.userId" placeholder="请输入用户ID" clearable style="width:150px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="企业微信ID" prop="wxUserId">
        <el-input v-model="queryParams.wxUserId" placeholder="请输入企业微信ID" clearable style="width:180px" @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd" v-hasPermi="['system:wxUserBind:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:wxUserBind:remove']">删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bindList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="企业微信ID" align="center" prop="wxUserId" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status == 1 ? 'success' : 'danger'" size="small">
            {{ scope.row.status == 1 ? '正常' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:wxUserBind:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" v-hasPermi="['system:wxUserBind:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList" />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入本系统用户ID" />
        </el-form-item>
        <el-form-item label="企业微信ID" prop="wxUserId">
          <el-input v-model="form.wxUserId" placeholder="请输入企业微信成员ID" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
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
import { listWxUserBind, getWxUserBind, addWxUserBind, updateWxUserBind, delWxUserBind } from "@/api/system/wxUserBind";

export default {
  name: "WxUserBind",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      bindList: [],
      open: false,
      title: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        wxUserId: null
      },
      form: {},
      rules: {
        userId: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
        wxUserId: [{ required: true, message: "企业微信ID不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listWxUserBind(this.queryParams).then(response => {
        this.bindList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    reset() {
      this.form = {
        id: null,
        userId: null,
        wxUserId: null,
        status: 1
      };
      this.resetForm("form");
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增绑定";
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getWxUserBind(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改绑定";
      });
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWxUserBind(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addWxUserBind(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除选中的数据项？').then(function() {
        return delWxUserBind(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    cancel() {
      this.open = false;
      this.reset();
    }
  }
};
</script>
