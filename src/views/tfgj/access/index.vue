<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="到访人" prop="roleName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入到访人"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="roleKey">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="小区名称">
        <el-autocomplete
          class="inline-input"
          v-model="queryParams.community"
          :fetch-suggestions="querySearch"
          placeholder="请输入小区名称"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item label="访问类型" prop="status">
        <el-select
          v-model="queryParams.type"
          placeholder="访问类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="type in types"
            :key="type.value"
            :label="type.value"
            :value="type.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="查询时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="primary"-->
<!--          plain-->
<!--          icon="el-icon-plus"-->
<!--          size="mini"-->
<!--          @click="handleAdd"-->
<!--          v-hasPermi="['system:role:add']"-->
<!--        >新增</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['tfgj:access:delete']"
        >删除</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--          v-hasPermi="['system:role:export']"-->
<!--        >导出</el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="accessList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="访问人" prop="userName" width="120" />
      <el-table-column label="联系方式" prop="phone" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="访问小区" prop="community" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="访问住户" prop="homeID" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="中介公司" prop="company" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="访问类型" prop="type" width="100" />

      <el-table-column label="访问时间" align="center" prop="signTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.signTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="离开时间" align="center" prop="outTime" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.signTime === scope.row.outTime"></span>
          <span v-else>{{ parseTime(scope.row.outTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.type === '来客看房'"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleReceiveInsert(scope.row)"
            v-hasPermi="['tfgj:receive:insert']"
          >领取</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['tfgj:access:delete']"
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
  </div>
</template>

<script>
import { listCommunity } from "@/api/tfgj/community";
import { listAccess, deleteAccessByids } from "@/api/tfgj/access";

export default {
  name: "access",
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
        pageNum: 1, //第几页
        pageSize: 10, //页面条数
        community: undefined, //小区名称
        userName: undefined, //到访人
        phone: undefined, //联系电话
        type: undefined, //访问类型
        startDate: undefined, //指定开始时间
        endTime: undefined, //指定结束时间
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" }
        ],
        roleKey: [
          { required: true, message: "权限字符不能为空", trigger: "blur" }
        ],
        roleSort: [
          { required: true, message: "角色顺序不能为空", trigger: "blur" }
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
        console.log(JSON.stringify(responseElement))
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
    /** 查询到访人员列表 */
    getList() {
      this.queryParams.startDate = this.dateRange[0];
      this.queryParams.endDate = this.dateRange[1];
      this.loading = true;
      listAccess(this.queryParams).then(response => {
        console.log(JSON.stringify(response), 'response')
        for (let responseKey in response.rows) {
          response.rows[responseKey].homeID = "";
          if(response.rows[responseKey].type === '物业中心') {
            response.rows[responseKey].homeID = '物业中心';
          } else {
            for (let roomsKey in response.rows[responseKey].lsitRooms) {
              if(response.rows[responseKey].homeID !== "") response.rows[responseKey].homeID += "/";
              response.rows[responseKey].homeID += response.rows[responseKey].lsitRooms[roomsKey].building +'-'+ response.rows[responseKey].lsitRooms[roomsKey].unit +'-'+ response.rows[responseKey].lsitRooms[roomsKey].floor + response.rows[responseKey].lsitRooms[roomsKey].roomNum;
            }
          }
        }
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
      this.dateRange = [];
      this.dateRange = [this.getPreviousDate(), this.getPreviousDate()];
      this.queryParams.userName = undefined;
      this.queryParams.phone = undefined;
      this.queryParams.type = undefined;
      this.queryParams.community = undefined;
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
      // this.open = true;
      // this.title = "添加角色";
    },
    /** 修改按钮操作 */
    handleReceiveInsert(row) {
      console.log('点击了领取按钮！')
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除访问数据？').then(function() {
        return deleteAccessByids(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
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
