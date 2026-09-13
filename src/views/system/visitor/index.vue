<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="spanSize1" :xs="24" v-if="deptTreeShow">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search"
            style="margin-bottom: 20px" />
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
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
      </el-form-item>
      <el-form-item label="用户电话" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入用户电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="浏览器id" prop="visitorId">
        <el-input
          v-model="queryParams.visitorId"
          placeholder="请输入浏览器id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="添加人" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入添加人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.tfw_visitor_status"
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
          v-hasPermi="['system:visitor:add']"
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
          v-hasPermi="['system:visitor:edit']"
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
          v-hasPermi="['system:visitor:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:visitor:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="visitorList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户名" align="center" width="200">
        <template slot-scope="scope">
          <div>{{scope.row.userName}}/{{scope.row.nickName}}</div>
          <el-tag v-if="scope.row.userStatus === '0'" type="success">在职</el-tag>
          <el-tag v-else type="danger">离职</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center" prop="deptName" />
      <el-table-column label="浏览器id" align="center" prop="visitorId" />
      <el-table-column label="审批人" align="center" prop="user.nickName" />
      <el-table-column label="时间" align="center" prop="createTime" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_visitor_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="2"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:visitor:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:visitor:remove']"
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
    <!-- 添加或修改账号授权对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户账号" prop="userName">
          <el-input :disabled="true" v-model="form.userName" placeholder="用户账号" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.tfw_visitor_status"
              :key="dict.value"
              :label="dict.value"
            >{{dict.label}}</el-radio>
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

import { addVisitor, delVisitor, getVisitor, listVisitor, updateVisitor,changeRoleStatus } from '@/api/system/visitor'
import {
  myCompanyTreeSelect
} from '@/api/system/user'
  export default {
  name: "Visitor",
  dicts: ['tfw_visitor_status'],
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
      // 账号授权表格数据
      visitorList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: null,
        visitorId: null,
        userId: null,
        status: null,
        deptId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        visitorId: [
          { required: true, message: "浏览器id不能为空", trigger: "blur" }
        ],
      },
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      deptTreeName: '显示部门树',
      deptTreeShow: false,
      spanSize1: 0,
      spanSize2: 24,
    };
  },
  created() {
    this.queryParams.deptId = this.$store.state.user.companyDept.deptId
    this.getDeptTree();
    this.getList();
  },
  methods: {
    handleDeptTree() {
      if(this.deptTreeShow) {
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
    // 角色状态修改
    handleStatusChange(row) {
      let text = row.status === "1" ? "授权" : "停用";
      this.$modal.confirm('确认要' + text  + row.userName + '的设备吗？').then(function() {
        return changeRoleStatus(row.id, row.status);
      }).then(() => {
        this.$modal.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "2" ? "1" : "2";
      });
    },
    /** 查询账号授权列表 */
    getList() {
      this.loading = true;
      listVisitor(this.queryParams).then(response => {
        this.visitorList = response.rows;
        console.log(this.visitorList)
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
        userName: null,
        visitorId: null,
        userId: null,
        updateTime: null,
        createTime: null,
        status: null
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
      this.queryParams.deptId = this.$store.state.user.companyDept.deptId
      this.$refs.tree.setCurrentKey(null);
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
      this.title = "添加账号授权";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getVisitor(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改账号授权";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateVisitor(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addVisitor(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除账号授权编号为"' + ids + '"的数据项？').then(function() {
        return delVisitor(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/visitor/export', {
        ...this.queryParams
      }, `visitor_${new Date().getTime()}.xlsx`)
    },

    /** 查询部门下拉树结构 */
    getDeptTree() {
      myCompanyTreeSelect().then(response => {
        this.deptOptions = response.data;
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
    }
  }
};
</script>
