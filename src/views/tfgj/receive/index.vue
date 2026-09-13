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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="receiveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="访问人" prop="access.userName" width="120" />
      <el-table-column label="联系方式" prop="access.user.phonenumber" :show-overflow-tooltip="true" width="120" />

      <el-table-column label="访问小区" prop="access.tfgjCommunity.name" :show-overflow-tooltip="true" width="120" />
      <el-table-column label="访问住户" prop="homeID" :show-overflow-tooltip="true" width="120" />

      <el-table-column label="领取时间" align="center" prop="signTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.receiveTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后沟通时间" align="center" prop="outTime" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.outTime) }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-share"
            @click="handleReceive(scope.row)"
          >详情</el-button>
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

    <el-drawer v-if="drawer" title="详情" :visible.sync="drawer" :direction="direction" size="48%"
               :before-close="handleClose">
      <div style="padding: 20px">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleDelete"
              v-hasPermi="['tfgj:receive:insert']"
            >新增跟进</el-button>
          </el-col>
        </el-row>

        <el-card v-for="intercat in receiveIntercatList" :key="intercat" class="box-card" style="margin-bottom: 10px">
          <div slot="header" class="clearfix">
            <span>沟通时间</span>
            <span style="float: right; padding: 3px 0">{{parseTime(intercat.interactTime)}}</span>
          </div>
          <div slot="header" class="clearfix">
            <span>沟通类型</span>
            <span style="float: right; padding: 3px 0">{{ intercat.type }}</span>
          </div>
          <div class="text item">
            {{ intercat.text }}
          </div>
        </el-card>

        <pagination
          v-show="queryParamIntercats.total>0"
          :total="queryParamIntercats.total"
          :page.sync="queryParamIntercats.pageNum"
          :limit.sync="queryParamIntercats.pageSize"
          @pagination="listReceiveIntercat"
        />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { listCommunity } from "@/api/tfgj/community";
import { listReceive } from "@/api/tfgj/receive";
import { listReceiveIntercat } from "@/api/tfgj/receiveIntercat";

import looklog from '@/views/source/looklog/index.vue'
import { parseTime } from '../../../utils/ruoyi'

export default {
  name: "Role",
  components: { looklog },
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
      // 表格数据
      receiveList: [],
      // 弹出层标题
      title: "",
      //详情抽屉
      drawer: false,
      //选中的数据
      receiveId: undefined,
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
      queryParamIntercats: {
        pageNum: 1, //第几页
        pageSize: 10, //页面条数
        receiveId: undefined,
        total: 0
      },
      // 表格数据
      receiveIntercatList: [],
      // 表单参数
      form: {},
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
    parseTime,
    /** 查询到访人员列表 */
    getList() {
      // this.queryParams.startDate = this.dateRange[0];
      // this.queryParams.endDate = this.dateRange[1];
      this.loading = true;
      console.log(JSON.stringify(this.queryParams), 'this.queryParams')
      listReceive(this.queryParams).then(response => {
        console.log(JSON.stringify(response))
        this.receiveList = response.rows;
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
    /** 详情按钮操作 */
    handleReceive(row) {
      this.drawer = true
      this.listReceiveIntercat(row.id)
    },
    //关闭抽屉
    handleClose(done) {
      this.getList()
      this.drawer = false
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
    //查询跟进信息
    listReceiveIntercat(id) {
      this.queryParamIntercats.receiveId = id
      listReceiveIntercat(this.queryParamIntercats).then(res =>{
        this.queryParamIntercats.total = res.total;
        this.receiveIntercatList = res.rows;
      });
    }
  }
};
</script>
