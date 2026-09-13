<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">

      <el-form-item label="小区名称">
        <el-autocomplete
          class="inline-input"
          v-model="queryParams.searchValue"
          :fetch-suggestions="querySearch"
          placeholder="请输入小区名称"
        ></el-autocomplete>
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
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accessList" @selection-change="handleSelectionChange">
      <el-table-column label="id" prop="id" width="120" />
      <el-table-column label="小区名称" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="横坐标" prop="lon" :show-overflow-tooltip="true"/>
      <el-table-column label="纵坐标" prop="lat" :show-overflow-tooltip="true"/>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type === '来客看房'"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleReceiveInsert(scope.row)"
          >领取</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
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

    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="绑定公司" prop="deptId">

        </el-form-item>
        <el-form-item label="公司全称" prop="name">
          <el-input v-model="form.name" placeholder="请输入公司全称" />
        </el-form-item>
        <el-form-item label="开户行">
          <el-input v-model="form.bank" placeholder="请输入开户行" />
        </el-form-item>
        <el-form-item label="开户行号" prop="bankAccount">
          <el-input v-model="form.bankAccount" placeholder="请输入开户行号" />
        </el-form-item>

      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listCommunity } from "@/api/tfgj/community";
import { listContractCompany, addContractCompany, delContractCompany, updateContractCompany } from "@/api/contract/company";

export default {
  name: "Role",
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
      // 角色表格数据
      accessList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      //小区数据集合
      communityData: [],
      community: '',
      // 日期范围
      dateRange: [],
      //访问类型
      types: [{
        value: '来客看房'
      },{
        value: '中介看房'
      },{
        value: '物业中心'
      },{
        value: '外卖'
      },{
        value: '家政'
      },{
        value: '访友'
      },{
        value: '维修'
      },{
        value: '送货'
      },{
        value: '装修'
      }],
      // 查询参数
      queryParams: {
        searchValue: '', //小区名称
        pageNum: 1, //第几页
        pageSize: 10, //页面条数
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deptId: [
          { required: true, message: "绑定公司部门不能为空！", trigger: "blur" }
        ],
        name: [
          { required: true, message: "公司全称不能为空！", trigger: "blur" }
        ],
        bank: [
          { required: true, message: "开户行不能为空！", trigger: "blur" }
        ],
        bankAccount: [
          { required: true, message: "开户行号不能为空！", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.dateRange = [this.getPreviousDate(), this.getPreviousDate()];
    this.getList();
  },
  mounted() {
   //初始化查询小区列表
   listCommunity({
      searchValue: "",
      pageNum: 1,
      pageSize: 100
    }).then(response => {
      let community = [];
      for (let responseElement of response.rows) {
        let value = {
          id: responseElement.id,
          value: responseElement.name
        }
        community.push(value)
      }
     this.communityData = community;
    });
  },
  methods: {
    /** 查询小区列表 */
    getList() {
      this.loading = true;
      listContractCompany({}).then(res => {
        console.log(JSON.stringify(res), 'response')

      });
      listCommunity(this.queryParams).then(response => {
        console.log(JSON.stringify(response), 'response')
        this.accessList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.searchValue = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      console.log('点击了新增按钮！')
      // this.getMenuTreeselect();
      this.open = true;
      this.title = "新增合同公司";
    },
    /** 修改按钮操作 */
    handleReceiveInsert(row) {
      console.log('点击了领取按钮！')
    },
    /** 导出按钮操作 */
    handleExport() {
      console.log('点击了导出按钮！')
      return false
      // this.download('system/role/export', {
      //   ...this.queryParams
      // }, `role_${new Date().getTime()}.xlsx`)
    },
    /** 小区列表按钮 */
    querySearch(queryString, cb) {
      let communityData = this.communityData;
      let results = queryString ? communityData.filter(this.createFilter(queryString)) : communityData;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    //获取时间
    getPreviousDate() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      return year + '-' + month + '-' + day;
    },
    //处理电话前3后4显示
    initPhone(number) {
      const numberStr = number.toString();
      // 检查数字长度是否足够
      if (numberStr.length >= 7) {
        // 取前3位
        const firstThree = numberStr.slice(0, 3);
        // 取后4位
        const lastFour = numberStr.slice(-4);
        // 返回结果
        return firstThree + '****' + lastFour;
      } else {
        // 如果数字长度不足7位，则不进行任何替换操作
        return numberStr;
      }
    }
  }
};
</script>
