<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5" v-if="type === 5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['xq:info:insert']"
        >新增
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="cooperateList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="栋" align="center" prop="building"/>
      <el-table-column label="单元" align="center" prop="unit"/>
      <el-table-column label="层数" align="center" prop="storey"/>

      <el-table-column label="梯户比" align="center">
        <template slot-scope="scope">
          {{scope.row.ladder != null ? scope.row.ladder : " / " }}梯{{scope.row.door != null ? scope.row.door : " / "}}户
        </template>
      </el-table-column>

      <el-table-column label="供暖" align="center" prop="heating">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_heating_type" :value="scope.row.heating" />
        </template>
      </el-table-column>


      <el-table-column label="结构" align="center" prop="structure">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_house_structure" :value="scope.row.structure" />
        </template>
      </el-table-column>

      <el-table-column label="电梯情况" align="center" prop="liftState">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_elevator_situation" :value="scope.row.liftState" />
        </template>
      </el-table-column>

      <el-table-column label="用电类型" align="center" prop="electricityType">>
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_electricity_consumption" :value="scope.row.electricityType" />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" v-if="type !== 4">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['xq:info:edit']"
          >修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['xq:info:delete']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <!-- 添加或修改小区详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="550px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="栋">
          <div style="display: flex;">
            <el-input v-model="form.building" placeholder="几栋" style="width: 100px" :disabled="disabled"/>
            <span style="margin-left: 15px">单元</span><el-input v-model="form.unit" placeholder="几单元" style="width: 100px" :disabled="disabled"/>
            <span style="margin-left: 15px">层数</span><el-input v-model="form.storey" placeholder="总层数" style="width: 100px"/>
          </div>
        </el-form-item>

        <el-form-item label="梯户比">
          <el-input v-model="form.ladder" placeholder="梯数" style="width: 100px"/>
          <span style="margin-left: 15px">梯</span>
          <el-input v-model="form.door" placeholder="层户数" style="width: 100px"/>
          <span style="margin-left: 15px">户</span>
        </el-form-item>

        <el-form-item label="电梯情况">
          <el-select v-model="form.liftState" placeholder="请选择电梯情况">
            <el-option v-for="dict in dict.type.tfw_elevator_situation" :key="dict.value"
                       :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="楼栋结构">
          <el-select v-model="form.structure" placeholder="请选择房屋结构">
            <el-option v-for="dict in dict.type.tfw_house_structure" :key="dict.value"
                       :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用电类型">
          <el-select v-model="form.electricityType" placeholder="请选择用电类型">
            <el-option v-for="dict in dict.type.tfw_electricity_consumption"
                       :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供暖">
          <el-select v-model="form.heating" placeholder="请选择供暖" style="width:200px">
            <el-option v-for="dict in dict.type.tfw_heating_type" :key="dict.value"
                       :label="dict.label" :value="dict.value"></el-option>
          </el-select>
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
import { selectTfwXqInfoList, selectTfwXqInfo, insertTfwXqInfo, updateTfwXqInfo, deleteTfwXqInfoById} from '@/api/tfw/xqInfo'
import { mapState } from 'vuex'
export default {
  name: 'cooperate',
  dicts: ['tfw_heating_type', 'tfw_house_structure', 'tfw_elevator_situation','tfw_electricity_consumption'],
  props: {
    value: [String, Object, Array],
    id: {
      type: Number,
      required: true
    },
    type: {
      type: Number,
      default: false
    },
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
      //是否支持填写楼栋单元
      disabled: false,
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
      },
    }
  },
  watch: {
    id: {
      immediate: true,// 组件创建时立即执行一次
      deep: true, // 深度监听父组件传过来对象变化
      handler() {
        console.log(this.id, 'id')
        this.getList()
      },

    },
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询楼盘户型列表 */
    getList() {
      this.loading = true
      this.queryParams.xqId = this.id
      selectTfwXqInfoList(this.queryParams).then(response => {
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
      console.log(this.queryParams, 'queryParams..')
      this.reset()
      this.open = true
      this.disabled = false
      this.title = '添加小区详情信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row.id)
      this.reset()
      selectTfwXqInfo({id: row.id}).then(response => {
        this.form = response.data
        this.form.heating += ""
        this.form.structure += ""
        this.form.liftState += ""
        this.form.electricityType += ""
        this.open = true
        this.disabled = true
        this.title = '修改小区详情信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.form.xqId = this.id
      this.$refs['form'].validate(valid => {
        console.log(this.form, 'this.form')
        if (valid) {
          if (this.form.id != null) {
            updateTfwXqInfo(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            insertTfwXqInfo(this.form).then(response => {
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
      console.log(row, 'delete-row')
      this.$modal.confirm('是否确认删除该数据？').then(function() {
        return deleteTfwXqInfoById(row.id)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
  }
}
</script>
<style scoped></style>
