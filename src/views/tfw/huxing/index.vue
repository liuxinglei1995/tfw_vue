<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <!-- <el-form-item label="小区id" prop="xqId">
        <el-input v-model="queryParams.xqId" placeholder="请输入小区id" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="户型标题" prop="title">
        <el-input v-model="queryParams.title" placeholder="请输入户型标题" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="面积" prop="habitableSpace">
        <el-input v-model="queryParams.habitableSpace" placeholder="请输入面积" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="价格" prop="price">
        <el-input v-model="queryParams.price" placeholder="请输入价格" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="卧室数量" prop="bedRoomNum">
        <el-input v-model="queryParams.bedRoomNum" placeholder="请输入卧室数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="餐厅数量" prop="livingRoomNum">
        <el-input v-model="queryParams.livingRoomNum" placeholder="请输入餐厅数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="厨房数量" prop="kitchenNum">
        <el-input v-model="queryParams.kitchenNum" placeholder="请输入厨房数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="卫生间数量" prop="bathroomNum">
        <el-input v-model="queryParams.bathroomNum" placeholder="请输入卫生间数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="阳台数量" prop="balconyNum">
        <el-input v-model="queryParams.balconyNum" placeholder="请输入阳台数量" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="朝向" prop="towards">
        <el-input v-model="queryParams.towards" placeholder="请输入朝向" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="装修情况" prop="fitment">
        <el-input v-model="queryParams.fitment" placeholder="请输入装修情况" clearable @keyup.enter.native="handleQuery" />
      </el-form-item> -->
      <!-- <el-form-item label="创建者" prop="createdBy">
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
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                   v-hasPermi="['huxing:huxing:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                   v-hasPermi="['huxing:huxing:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                   v-hasPermi="['huxing:huxing:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                   v-hasPermi="['huxing:huxing:export']"
        >导出
        </el-button>
      </el-col>
      <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
    </el-row>

    <el-table v-loading="loading" :data="huxingList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="小区id" align="center" prop="xqId"/>
      <el-table-column label="户型标题" align="center" prop="title"/>
      <el-table-column label="户型图片" align="center" prop="img" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.img" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="面积" align="center" prop="habitableSpace"/>
      <el-table-column label="价格" align="center" prop="price"/>
      <el-table-column label="卧室数量" align="center" prop="bedRoomNum"/>
      <el-table-column label="餐厅数量" align="center" prop="livingRoomNum"/>
      <el-table-column label="厨房数量" align="center" prop="kitchenNum"/>
      <el-table-column label="卫生间数量" align="center" prop="bathroomNum"/>
      <el-table-column label="阳台数量" align="center" prop="balconyNum"/>
      <el-table-column label="朝向" align="center" prop="towards">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_housing_orientation" :value="scope.row.towards"/>
        </template>
      </el-table-column>
      <el-table-column label="装修情况" align="center" prop="fitment">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_decoration_situation" :value="scope.row.fitment"/>
        </template>
      </el-table-column>
      <el-table-column label="建筑类型" align="center" prop="buildingType"/>
      <el-table-column label="状态" align="center" prop="status"/>
      <el-table-column label="创建者" align="center" prop="createByName"/>
      <el-table-column label="更新者" align="center" prop="updateByName"/>
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
      <el-table-column label="备注" align="center" prop="remark"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['huxing:huxing:edit']"
          >修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['huxing:huxing:remove']"
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
        <!-- <el-form-item label="小区id" prop="xqId">
          <el-input v-model="form.xqId" placeholder="请输入小区id" />
        </el-form-item> -->
<!--        <el-form-item label="户型标题" prop="title">-->
<!--          <el-input v-model="form.title" placeholder="请输入户型标题"/>-->
<!--        </el-form-item>-->
        <el-form-item label="户型图片" prop="img">
          <image-upload v-model="form.img" :limit="1"/>
        </el-form-item>

        <el-form-item label="面积" prop="habitableSpace">
          <el-input v-model="form.habitableSpace" placeholder="请输入面积"/>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格"/>
        </el-form-item>
        <el-form-item label="卧室数量" prop="bedRoomNum">
          <el-input-number v-model="form.bedRoomNum" :min="0" :max="100">
          </el-input-number>
        </el-form-item>
        <el-form-item label="餐厅数量" prop="livingRoomNum">
          <el-input-number v-model="form.livingRoomNum" :min="0" :max="100">
          </el-input-number>
        </el-form-item>
        <el-form-item label="厨房数量" prop="kitchenNum">
          <el-input-number v-model="form.kitchenNum" :min="0" :max="100">
          </el-input-number>
        </el-form-item>
        <el-form-item label="卫生间数量" prop="bathroomNum">
          <el-input-number v-model="form.bathroomNum" :min="0" :max="100">
          </el-input-number>
        </el-form-item>
        <el-form-item label="阳台数量" prop="balconyNum">
          <el-input-number v-model="form.balconyNum" :min="0" :max="100">
          </el-input-number>
        </el-form-item>
        <el-form-item label="朝向" prop="towards">
          <el-select v-model="form.towards" placeholder="请选择">
            <el-option v-for="dict in dict.type.tfw_housing_orientation" :key="dict.value" :label="dict.label"
                       :value="dict.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="装修情况" prop="fitment">
          <el-select v-model="form.fitment" placeholder="请选择">
            <el-option v-for="dict in dict.type.tfw_decoration_situation" :key="dict.value" :label="dict.label"
                       :value="dict.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="创建者" prop="createdBy">
          <el-input v-model="form.createdBy" placeholder="请输入创建者" />
        </el-form-item>
        <el-form-item label="更新者" prop="updatedBy">
          <el-input v-model="form.updatedBy" placeholder="请输入更新者" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createdAt">
          <el-date-picker clearable v-model="form.createdAt" type="date" value-format="yyyy-MM-dd" placeholder="请选择创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="更新时间" prop="updatedAt">
          <el-date-picker clearable v-model="form.updatedAt" type="date" value-format="yyyy-MM-dd" placeholder="请选择更新时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="删除时间" prop="deletedAt">
          <el-date-picker clearable v-model="form.deletedAt" type="date" value-format="yyyy-MM-dd" placeholder="请选择删除时间">
          </el-date-picker>
        </el-form-item> -->
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
import { listHuxing, getHuxing, delHuxing, addHuxing, updateHuxing } from '@/api/huxing/huxing'
import { mapState } from 'vuex'

export default {
  name: 'Huxing',
  dicts: ['tfw_housing_orientation', 'tfw_decoration_situation'],
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
      huxingList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        xqId: null,
        title: null,
        img: null,
        habitableSpace: null,
        price: null,
        bedRoomNum: null,
        livingRoomNum: null,
        kitchenNum: null,
        bathroomNum: null,
        balconyNum: null,
        towards: null,
        fitment: null,
        buildingType: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        updateByName: null,
        createByName: null
      },
      // 表单参数
      form: {},
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
      listHuxing(this.queryParams).then(response => {
        this.huxingList = response.rows
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
        id: null,
        xqId: this.id,
        title: null,
        img: null,
        habitableSpace: null,
        price: null,
        bedRoomNum: 0,
        livingRoomNum: 0,
        kitchenNum: null,
        bathroomNum: 0,
        balconyNum: null,
        towards: null,
        fitment: null,
        buildingType: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        remark: null,
        createByName: null,
        updateByName: null
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
      this.title = '添加楼盘户型'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getHuxing(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改楼盘户型'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateHuxing(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addHuxing(this.form).then(response => {
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
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除楼盘户型编号为"' + ids + '"的数据项？').then(function() {
        return delHuxing(ids)
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
    }
  }
}
</script>
<style scoped></style>
