<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="所属人" prop="nickName">
        <el-input v-model="queryParams.nickName" placeholder="请输入所属人" clearable style="width:150px" />
      </el-form-item>
      <el-form-item label="房屋用途" prop="purposeOfTheHouse">
        <el-select v-model="queryParams.purposeOfTheHouse" placeholder="请选择房屋用途" clearable style="width:150px">
          <el-option v-for="dict in dict.type.tfw_property_type" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属部门" prop="deptId">
        <el-select v-model="queryParams.deptId" placeholder="请选择部门" clearable style="width:180px">
          <el-option v-for="item in deptOptions" :key="item.deptId" :label="item.deptName" :value="item.deptId" />
        </el-select>
      </el-form-item>
      <el-form-item label="是否离职">
        <el-select v-model="queryParams['params.userStatus']" placeholder="请选择" style="width:120px">
          <el-option label="离职" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-sort" size="mini" @click="handleTransfer"
          v-hasPermi="['system:tourists:edit']" :disabled="multiple">客户转移</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="touristsList" @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="客户信息" align="center" prop="customer" min-width="130">
        <template slot-scope="scope">
          <div v-for="item in (scope.row.customer ? JSON.parse(scope.row.customer) : [])" :key="item.value">
            <i :class="item.sex == 0 ? 'el-icon-male' : 'el-icon-female'" style="font-size:14px;">
              {{ item.name || '--' }}
            </i>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="委托类型" align="center" min-width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_wtlx" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="紧迫情况" align="center" min-width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_wtdj" :value="scope.row.grade" />
        </template>
      </el-table-column>
      <el-table-column label="房屋用途" align="center" min-width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_property_type" :value="scope.row.purposeOfTheHouse" />
        </template>
      </el-table-column>
      <el-table-column label="所属人" align="center" min-width="100">
        <template slot-scope="scope">
          {{ scope.row.nickName }}
        </template>
      </el-table-column>
      <el-table-column label="所属部门" align="center" min-width="160">
        <template slot-scope="scope">
          {{ scope.row.deptName }}
        </template>
      </el-table-column>
      <el-table-column label="在职状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="'danger'" size="small">离职</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-view" @click="handparticulars(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 客户转移对话框 -->
    <el-dialog :title="'客户转移（已选' + ids.length + '条）'" :visible.sync="transferOpen" width="500px" append-to-body>
      <el-form ref="transferForm" label-width="100px">
        <el-form-item label="转移方式">
          <el-radio-group v-model="transferType">
            <el-radio label="public">转为公客</el-radio>
            <el-radio label="user">转给他人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标用户" v-if="transferType === 'user'">
          <el-select v-model="targetUserId" placeholder="请输入姓名搜索" filterable remote
            :remote-method="queryUser" style="width:100%">
            <el-option v-for="item in userList" :key="item.userId" :label="item.nickName + ' (' + item.phonenumber + ')'"
              :value="item.userId">
              <span>{{ item.nickName }}</span>
              <span style="float:right;color:#8492a6;font-size:12px">{{ item.dept ? item.dept.deptName : '' }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTransfer">确 定</el-button>
        <el-button @click="transferOpen = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 客户详情对话框 -->
    <el-dialog title="客户详情" :visible.sync="detailOpen" width="600px" append-to-body>
      <el-descriptions border :column="2" v-if="detailData">
        <el-descriptions-item label="委托来源" :span="2">
          <dict-tag :options="dict.type.tfw_wtly" :value="detailData.source" />
        </el-descriptions-item>
        <el-descriptions-item label="客户信息" :span="2">
          <div v-for="item in (detailData.customer ? JSON.parse(detailData.customer) : [])" :key="item.value">
            {{ item.name }}（{{ item.value }}）
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="委托类型">
          <dict-tag :options="dict.type.tfw_wtlx" :value="detailData.type" />
        </el-descriptions-item>
        <el-descriptions-item label="等级">
          <dict-tag :options="dict.type.tfw_wtdj" :value="detailData.grade" />
        </el-descriptions-item>
        <el-descriptions-item label="房屋用途">
          <dict-tag :options="dict.type.tfw_property_type" :value="detailData.purposeOfTheHouse" />
        </el-descriptions-item>
        <el-descriptions-item label="所属人">{{ detailData.nickName }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ detailData.deptName }}</el-descriptions-item>
        <el-descriptions-item label="购房需求" :span="2" v-if="detailData.type == 1 || detailData.type == 3">
          价格：{{ detailData.purchasePriceMin || '-' }}万 - {{ detailData.purchasePriceMax || '-' }}万，
          面积：{{ detailData.purchaseAreaMin || '-' }}㎡ - {{ detailData.purchaseAreaMax || '-' }}㎡
        </el-descriptions-item>
        <el-descriptions-item label="租房需求" :span="2" v-if="detailData.type == 2 || detailData.type == 3">
          价格：{{ detailData.rentingPriceMin || '-' }}元 - {{ detailData.rentingPriceMax || '-' }}元，
          面积：{{ detailData.rentingAreaMin || '-' }}㎡ - {{ detailData.rentingAreaMax || '-' }}㎡
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ detailData.remarks || '暂无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>
<script>
import { guestList, transferTourists, getTourists } from "@/api/source/tourists";
import { listUserByDeptAndChild } from "@/api/system/user";
import { listDept } from "@/api/system/dept";

export default {
  name: "CustomerTransfer",
  dicts: ['tfw_wtly', 'tfw_khlx', 'tfw_wtdj', 'tfw_property_type', 'tfw_wtlx'],
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      showSearch: true,
      total: 0,
      touristsList: [],
      deptOptions: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: null,
        deptId: null,
        purposeOfTheHouse: null,
        'params.userStatus': '1',
        publicAndPrivate: '2',
      },
      transferOpen: false,
      transferType: 'public',
      targetUserId: null,
      userList: [],
      detailOpen: false,
      detailData: null,
    };
  },
  created() {
    this.getList();
    listDept().then(response => {
      this.deptOptions = response.data;
    });
  },
  methods: {
    getList() {
      this.loading = true;
      guestList(this.queryParams).then(response => {
        this.touristsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.eId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        nickName: null,
        deptId: null,
        purposeOfTheHouse: null,
        'params.userStatus': '1',
        publicAndPrivate: '2',
      };
      this.handleQuery();
    },
    handleTransfer() {
      if (this.ids.length === 0) {
        this.$modal.msgWarning("请先选择要转移的客户");
        return;
      }
      this.transferOpen = true;
      this.transferType = 'public';
      this.targetUserId = null;
      this.userList = [];
    },
    handparticulars(row) {
      getTourists(row.eId).then(res => {
        this.detailData = res.data;
        this.detailOpen = true;
      });
    },
    queryUser(query) {
      if (query !== '') {
        listUserByDeptAndChild({ pageNum: 1, pageSize: 20, nickName: query, status: 1 }).then(response => {
          this.userList = response.rows;
        });
      }
    },
    submitTransfer() {
      if (this.transferType === 'user' && !this.targetUserId) {
        this.$modal.msgWarning("请选择目标用户");
        return;
      }
      const data = { touristIds: this.ids, type: this.transferType };
      if (this.transferType === 'user') {
        const user = this.userList.find(u => u.userId === this.targetUserId);
        data.targetUserId = this.targetUserId;
        data.targetDeptId = user ? user.deptId : null;
      }
      this.$modal.confirm('确定将选中的' + this.ids.length + '位客户' + (this.transferType === 'public' ? '转为公客' : '转给所选用户') + '？').then(() => {
        return transferTourists(data);
      }).then(() => {
        this.$modal.msgSuccess("转移成功");
        this.transferOpen = false;
        this.getList();
      }).catch(() => {});
    },
  }
};
</script>
