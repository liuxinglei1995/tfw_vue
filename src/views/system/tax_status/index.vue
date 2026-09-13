<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="城市选择" prop="xqname" size="mini" label-width="80px">
        <el-cascader
          v-model="regionCode"
          :options="ssqldList"
          :disabled="cityState"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader>
      </el-form-item>

      <el-form-item label="城市搜索" prop="dictName">
        <el-input
          v-model="queryParams.dictName"
          placeholder="请输入城市名称"
          clearable
          style="width: 240px"
          :disabled="cityState"
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
          v-hasPermi="['system:dict:add']"
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
          v-hasPermi="['system:dict:edit']"
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
          v-hasPermi="['system:dict:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="typeList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字典编号" align="center" prop="dictId" />
      <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
      <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
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
  </div>
</template>

<script>
import { getlist } from '@/api/province'

export default {
  name: "Dict",
  dicts: ['sys_normal_disable'],
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
      // 字典表格数据
      typeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      queryParams: {},
      //
      cityState: true,
      regionCode: null,
      ssqldList: null,
    };
  },
  created() {
    if(this.$store.state.user.userid === 1 || this.$store.state.user.userid === 116) this.cityState = false
    this.regionCode = [this.$store.state.user.provinceCode, this.$store.state.user.cityCode];

    localStorage.setItem("citycode", JSON.stringify(this.citycode));
    getlist(2).then(response => {
      const options = response.data.map(option => ({
        ...option,
        label: option.extName, // 如果 extName 不存在，则回退到 name
        value: option.id
      }));
      this.ssqldList = this.handleTree(options, "id", "parentId");
    })
    this.getList();
  },
  methods: {
    /** 查询字典类型列表 */
    getList() {
      this.loading = false
    },
    //城市选择
    handleChange() {

    },
    //搜索
    handleQuery() {

    },
    //重置
    resetQuery() {

    },
    //新增
    handleAdd() {

    },
    //编辑
    handleUpdate() {

    },
    //删除
    handleDelete() {

    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
  }
};
</script>
