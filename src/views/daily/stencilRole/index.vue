<template>
  <div class="app-container" v-loading="loading" >

    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="模板名称" prop="company">
        <el-input v-model="queryParams.title" placeholder="请输入模板名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="stencilList">
      <el-table-column label="日报模板名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.user.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用角色" align="center" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleStencils !== null && scope.row.roleStencils.length > 0">{{ scope.row.roleStencils[0].role.roleName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.roleStencils === null || scope.row.roleStencils.length === 0" size="mini" type="text" icon="el-icon-circle-plus-outline" v-hasPermi="['stencil:role:insert']"
                     @click="handleStencilRoleAdd(scope.row)">添加</el-button>
          <el-button v-else size="mini" type="text" icon="el-icon-delete" v-hasPermi="['stencil:role:remove']"
                     @click="handleStencilRoleDelete(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getDataList" />

    <!--    编辑日报模板内容-->
    <el-dialog width="50%" append-to-body :visible.sync="roleSync">
      <div style="overflow-x: auto; height: 450px;">
        <el-table :data="roleList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column label="角色" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="标识" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.roleKey }}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="roleParams.total > 0" :total="roleParams.total" :page.sync="roleParams.pageNum" :limit.sync="roleParams.pageSize"
                    @pagination="getRoleDataList" />
      </div>
      <div>
        <el-button @click="stencilRoleAdd">添加</el-button>
        <el-button @click="roleSync = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { listStencilRole, addStencilRole, delStencilRole } from '@/api/daily/stencilRole'
import { initNumber, isTimeExceeded } from '@/utils/activiti/myUtil'
import stencilUpload from '@/views/daily/stencil/upload/index.vue'
import ImagePreview from '@/views/daily/img/index.vue'
import { listRole } from '@/api/system/role'
import { delStencil } from '@/api/daily/stencil'

function changeFrameHeight() {
  var iframe = document.getElementById("iframe");
  iframe.height = document.documentElement.clientHeight;
}
window.onresize = function () {
  changeFrameHeight();
}
export default {
  components: {
    ImagePreview,
    stencilUpload
  },
  name: "stencil",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 日报模板数据
      stencilList: [],
      queryParams: {
        title: null,
        state: 1,
        pageNum: 1,
        pageSize: 10,
      },

      //模板使用者
      roleSync: false,
      roleList: [],
      roleParams: {
        type: 3,
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      stencilRoleTitle: '',
      stencilRoleFromSync: false,
      userStencilFrom: {
        text: '',
        remark: {
          image1:"",
          image2:"",
        }
      },
      userStencilRules: {
        text: [
          { required: true, message: '请填写日历模板内容名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },

      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    initNumber,
    getDataList() {
      this.loading = true
      listStencilRole(this.queryParams).then(res => {
        this.stencilList = res.rows;
        console.log(this.stencilList)
        this.total = res.total;
        this.loading = false
      })
    },
    getRoleDataList() {
      this.loading = true
      listRole(this.roleParams).then(res => {
        this.roleList = res.rows;
        console.log(this.roleList)
        this.roleParams.total = res.total;
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getDataList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.state = 1;
      this.queryParams.types = []
      this.queryParams.title = null;
      this.handleQuery();
    },
    handleStencilRoleAdd(row) {
      this.roleSync = true
      this.roleParams.stencilId = row.id;
      this.getRoleDataList();
    },
    handleStencilRoleDelete(row) {
      this.$modal.confirm('是否确认移除该日报模板绑定的角色？').then(function() {
        return delStencilRole(row.id);
      }).then(() => {
        this.getDataList();
        this.$modal.msgSuccess("解除成功!");
      }).catch(() => {
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.roleId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    stencilRoleAdd() {
      if(this.ids.length === 0) {
        this.$message({
          message: '请选择角色！',
          type: 'warning'
        });
        return false
      }
      console.log(this.ids)
      this.loading = true
      let stencilRoles = [];
      for (let roleId of this.ids) {
        let stencilRole = {
          roleId: roleId,
          stencilId: this.roleParams.stencilId
        }
        stencilRoles.push(stencilRole);
      }
      addStencilRole(stencilRoles).then(res => {
        this.roleSync = false;
        this.loading = false;
        this.getDataList();
      })
    },
    /** 删除按钮操作 */
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
};
</script>
<style scoped>
.custom-div {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
