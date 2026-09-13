<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="type === 4">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['lpxq:cooperate:insert']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cooperateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="合作商" align="center" prop="partners"/>
      <el-table-column label="联系人" align="center" prop="contacts"/>
      <el-table-column label="联系方式" align="center" prop="phone"/>
      <el-table-column label="佣金分成" align="center" prop="divide">
        <template slot-scope="scope">
          <div v-if="scope.row.type === 1">{{ scope.row.divide }} %</div>
          <div v-else>{{ scope.row.divide }} 元</div>
        </template>
      </el-table-column>
      <el-table-column label="现金奖" align="center" prop="cash"/>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="创建人" align="center" prop="user.nickName"/>
      <el-table-column label="备注" align="center" prop="remark"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" v-if="type !== 4">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['lpxq:cooperate:edit']"
          >修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['lpxq:cooperate:edit']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <!-- 添加或修改楼盘户型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="合作商" prop="partners">
          <el-input v-model="form.partners" placeholder="请输入合作商"/>
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" placeholder="请输入合作商"/>
        </el-form-item>
        <el-form-item label="联系方式" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系方式" type="number"/>
        </el-form-item>
        <el-form-item label="佣金分成" prop="divide">
          <div style="display: flex;">
            <el-select v-model="form.type" placeholder="请选择" style="width: 30%;margin-right: 10px" @change="changeType()">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-if="form.type === 1">
              <el-input-number v-model="form.divide" :min="0" :max="100"></el-input-number> %
            </div>
            <div v-else style="display:flex;">
              <el-input v-model="form.divide" placeholder="请填写具体金额" type="number"/> 元
            </div>
          </div>
        </el-form-item>
        <el-form-item label="现金奖" prop="cash">
          <el-input v-model="form.cash" type="number" :min="0" :max="100">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注"/>
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
import { listCooprate, getCooprate, addCooprate, updateCooprate } from '@/api/cooperate/cooperate'
import { mapState } from 'vuex'

export default {
  name: 'cooperate',
  dicts: ['tfw_housing_orientation', 'tfw_decoration_situation'],
  props: ['state', 'type'],
  computed: {
    ...mapState('datatools', ['id'])
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
      // 楼盘户型表格数据
      cooperateList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqId: null,
      },
      options: [{
        value: 1,
        label: '百分比'
      },{
        value: 2,
        label: '固定金额'
      }],
      // 表单参数
      form: {
        type: 1
      },
      // 表单校验
      rules: {
        id: [
          { required: true, message: '$comment不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询楼盘户型列表 */
    getList() {
      this.loading = true
      this.queryParams.xqId = this.id
      listCooprate(this.queryParams).then(response => {
        this.cooperateList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        xqId: this.id,
        type: 1
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加合作商'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      getCooprate(row.id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改合作商'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.form.xqId = this.id
      this.$refs['form'].validate(valid => {
        console.log(this.form, 'this.form')
        if (valid) {
          if (this.form.id != null) {
            updateCooprate(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addCooprate(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除合作商编号为"' + row.id + '"的数据项？').then(function() {
        return updateCooprate({ id: row.id, state: 0 })
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('huxing/huxing/export', {
        ...this.queryParams
      }, `huxing_${new Date().getTime()}.xlsx`)
    },
    changeType() {
      this.form.divide = null
    }
  }
}
</script>
<style scoped></style>
