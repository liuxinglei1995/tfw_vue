<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
        <el-col :span="spanSize1" :xs="24" v-if="deptOptions.length > 0 && deptTreeShow">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small"
                    prefix-icon="el-icon-search" style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                   :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                   @node-click="handleNodeClick" />
        </div>
      </el-col>

      <!--用户数据-->
      <el-col :span="spanSize2" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item v-if="deptOptions.length > 0">
            <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
          </el-form-item>
          <el-form-item label="员工名称" prop="nickName">
            <el-input v-model="queryParams.nickName" placeholder="请输入用户名称" clearable style="width: 240px"
                      @keyup.enter.native="handleQuery" />
          </el-form-item>

          <el-form-item label="职位" prop="status">
            <el-select v-model="queryParams.postIds" placeholder="员工职位" clearable style="width: 240px">
              <el-option v-for="item in postList" :key="item.postId" :label="item.postName"
                         :value="item.postId" />
            </el-select>
          </el-form-item>

          <el-form-item label="在职情况" prop="type">
            <el-checkbox-group v-model="status">
              <el-checkbox label="在职"></el-checkbox>
              <el-checkbox label="离职"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="chocklnList"
                  v-if="chocklnList">
          <el-table-column label="员工名称" align="center" prop="type" fixed>
            <template slot-scope="scope">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div>{{scope.row.user.nickName}}</div>
                <div class="jbxx" v-if="scope.row.user.status === '0'">
                  <div>在职</div>
                </div>
                <div class="jbxx" v-else style="background-color:#ffeded;color: #ff9292">
                  <div>离职</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="员工薪酬方案" align="center" prop="type" fixed>
            <template slot-scope="scope">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div v-if="scope.row.tfwBrokerage">
                  <a  @click="handleReceiveRules(scope.row.tfwBrokerage, true)">{{scope.row.tfwBrokerage.title}}</a>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="scope.row.tfwBrokerage" size="mini" type="text" icon="el-icon-edit" @click="openBrokerage(scope.row,true)"
                         v-hasPermi="['brokerage:confirm:edit']">变更薪酬方案</el-button>
              <el-button v-else size="mini" type="text" icon="el-icon-edit" @click="openBrokerage(scope.row,false)"
                         v-hasPermi="['brokerage:confirm:edit']">指定薪酬方案</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="brokerageHistory(scope.row)"
                         >操作历史</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-table v-loading="loading" :data="brokerageList" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="id" prop="id" width="120" />
        <el-table-column label="方案名称" prop="title" :show-overflow-tooltip="true"/>
        <el-table-column label="最后更新时间" prop="updateTime" :show-overflow-tooltip="true"/>
        <el-table-column label="创建人" prop="user.nickName" :show-overflow-tooltip="true"/>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="handleReceiveRules(scope.row, true)"
            >预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="brokerageList.length > 0" :total="brokerageQuery.total" :page.sync="brokerageQuery.pageNum"
                  :limit.sync="brokerageQuery.pageSize" @pagination="getBrokerageList" />
      <el-button @click="save()">确认</el-button>
    </el-dialog>

    <el-dialog :title="title2" :visible.sync="open2" width="40%" append-to-body>
      <table border="1" cellspacing="0">
        <tr>
          <td colspan="3">
            个人提成参考 阶段提成 <br> 减去平台费减去推荐奖励后 以实收核算
            <br> 实收业绩 - 外拆平台费(
            <span v-if="brokerage.ilk === 1" style="color: red;font-weight: bold;">{{brokerage.amount}}元</span>
            <span v-else-if="brokerage.ilk === 2" style="color: red;font-weight: bold;">{{brokerage.amount}}%</span>
            <span v-else style="color: red;font-weight: bold;">未设置</span>
            ) - 推荐奖 = 个人实收业绩
          </td>
        </tr>
        <tr><td>业绩类型</td><td>实收业绩</td><td>提成比例</td></tr>
        <tr v-for="(item, index) in brokerage.brokerageRulesList">
          <td>{{ item.commissionType }} </td>
          <td v-if="item.phaseType === '以上'">{{ item.startAmount }} 元以上</td>
          <td v-else>{{ item.startAmount }}元 — {{item.endAmount}}元</td>
          <td>{{ item.ruleDetails }} %</td>
        </tr>
      </table>
      <span style="margin-top: 20px;">{{brokerage.remark}}</span>
    </el-dialog>

    <el-dialog :title="title3" :visible.sync="open3" width="40%" append-to-body>
      <div class="block">
        <el-timeline :reverse="false">
          <el-timeline-item
            v-for="(item, index) in histories"
            :key="index"
            :timestamp="initDate(item.dateTime)">
            {{initMassage(item)}}
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { remunerationlist, deptTreeSelect, getUser } from '@/api/system/user'
import { format } from "@/utils/activiti/myUtil";
import {listPost} from  "@/api/system/post";

// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import item from '@/layout/components/Sidebar/Item.vue'
import { listUserBrokerage, updateUserBrokerage } from '@/api/brokerage/confirm'
import { listBrokerage } from '@/api/brokerage/brokerage'
import { listConfirmHistory } from '@/api/brokerage/history'

export default {
  name: "User",
  computed: {
    item() {
      return item
    }
  },
  dicts: ['tfw_qqlx', 'tfw_daka'],
  components: { Treeselect, ElImageViewer },
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
      // 用户表格数据
      chocklnList: [],
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      pageNum: 1,
      pageSize: 10,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: "",
        status: "",
        postId: [],
        params: { thisdate: null }
      },
      status: ['在职'],
      //打卡记录
      //岗位
      postList: [],
      //
      valueDetails: {
        click: 0
      },
      comeValue: 0,

      //弹框
      open: false,
      open2: false,
      open3: false,
      title: '',
      title2: '',
      title3: '',
      brokerageList: [],
      brokerageQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      disShow: true,
      brokerageId: '',
      brokerage: '',
      userBrokerage: '',
      histories: [],

      deptTreeName: '显示部门树',
      deptTreeShow: false,
      spanSize1: 0,
      spanSize2: 24,
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getinfo();
    this.getPost();
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

    async getinfo() {
      await this.getDeptTree();
      await this.getList();
    },
    getList() {
      this.loading = true;
      if(this.status.length > 1 || this.status.length === 0) {
        this.queryParams.status = "";
      } else if(this.status[0] === "在职"){
        this.queryParams.status = "0";
      } else if(this.status[0] === "离职"){
        this.queryParams.status = "1";
      } else {
        this.queryParams.status = "";
      }
      listUserBrokerage(this.queryParams).then(res => {
        this.chocklnList = res.rows;
        this.total = res.total;
        this.loading = false;
      })
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
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
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        date: null,
        uname: null,
        signInImg: null,
        signOutImg: null,
        signInTime: null,
        signOutTime: null,
        signInRemark: null,
        signOutRemark: null,
        totalHours: null,
        signInLocation: null,
        signOutLocation: null,
        type: null,
        askForLeaveTime: null,
        askForLeave: null
      };
      this.resetForm("form");
    },
    getPost() {
      listPost().then(res => {
        this.postList = res.rows;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();

    },
    /** 重置按钮操作 */
    resetQuery() {
      this.time = "";
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.queryParams.status = "1";
      this.status = ['在职'];
      this.$refs.tree.setCurrentKey(null);
      this.queryParams.postIds = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    save() {
      if(this.ids.length === 0) {
        this.$message({
            showClose: true,
            message: '请选择推送的薪资方案！',
            type: 'error'
          });
        return false
      }
      this.userBrokerage.remark = this.ids.toString()
      if(this.title) {
        this.userBrokerage.historyType = 2
      } else {
        this.userBrokerage.historyType = 3
      }
      updateUserBrokerage(this.userBrokerage).then(res => {
        this.$message({
          showClose: true,
          message: '推送成功！',
          type: 'success'
        });
        this.open = false;
      });
    },
    //变更薪资表
    openBrokerage(row, title) {
      this.userBrokerage = row;
      this.open = true;
      if(title) {
        this.title = '变更薪酬方案';
      } else {
        this.title = '指定薪酬方案';
      }
     this.getBrokerageList()
    },
    getBrokerageList() {
      this.loading = true;
      listBrokerage(this.brokerageQuery).then(res => {
        this.brokerageList = res.rows;
        this.brokerageQuery.total = res.total
        this.loading = false;
      });
    },
    //操作历史
    brokerageHistory(row){
      listConfirmHistory(row.user).then(res => {
        this.histories = res.rows;
        this.title3 = '操作记录';
        this.open3 = true
      });
    },
    handleReceiveRules(row, falg) {
      this.brokerage = row;
      this.title2 = "编辑方案条约";
      this.open2 = true;
      this.disShow = falg
    },
    initDate(dateTime) {
      return format(dateTime, 'yyyy-MM-dd HH:mm:ss')
    },
    initMassage(data) {
      let massage = data.user.nickName;
      if(data.type === 1) massage += ' 确定方案: '
      else if(data.type === 2) massage += ' 对 '+ data.useUser.nickName +' 推送方案: '
      else massage += ' 对 ' + data.useUser.nickName + ' 指定方案: '
      let br = '';
      for(let bro of data.brokerageList) {
        if(br !== '') br += '、';
        br += bro.title
      }
      massage += br
      return massage
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
        el.querySelector('input').select()
      },
    },
  }
};
</script>

<style scoped>
.jbxx {
  background: inherit;
  background-color: rgba(226, 255, 221, 1);
  border-radius: 3px;
  font-weight: 400;
  color: #46AE42;
  font-size: 10px;
}
.el-table .cell {
  white-space: pre-line;
}
</style>
