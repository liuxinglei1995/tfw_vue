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

      <!-- 展示打卡记录 -->
      <el-dialog title="提示" :visible.sync="cardshow" width="50%">
        <el-table v-loading="loading" :data="cardList" height="450">
          <el-table-column label="名字" align="center" prop="nickName" />
          <el-table-column label="出勤次数" align="center" prop="presentCount" />
          <el-table-column label="缺勤次数" align="center" prop="absentCount" />
          <el-table-column label="早退次数" align="center" prop="earlyLeavingCount" />
          <el-table-column label="迟到次数" align="center" prop="lateCount" />
          <el-table-column label="请假" align="center" prop="askForLeaveCount" />
          <el-table-column label="年假" align="center" prop="annualLeaveCount" />
          <el-table-column label="正常休假" align="center" prop="normalCount" />
          <el-table-column label="总薪资" align="center" prop="normalCount" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cardshow = false">取 消</el-button>
        </span>
      </el-dialog>


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
          <el-form-item label="薪资记录" label-width="120px">
            <el-date-picker v-model="queryParams.params.thisdate" type="month" placeholder="选择月"
                    value-format="yyyy-MM" style="width: 240px" @change="pickertime">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <div>上下班打卡照片仅限于物业中心或门岗照片，其他照片无效;</div>
        <el-table v-loading="loading" :data="chocklnList"  stripe
                  show-summary :summary-method="getSummaries"
                  v-if="chocklnList">
          <el-table-column label="员工名称" align="center" prop="type" fixed>
            <template slot-scope="scope">
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div>{{scope.row.nickName}}</div>
                <div class="jbxx" v-if="scope.row.status === '0'">
                  <div>在职</div>
                </div>
                <div class="jbxx" v-else style="background-color:#ffeded;color: #ff9292">
                  <div>离职</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :label="'全勤考核\n'+valueDetails.click" align="center" prop="fullAttendance">
            <template slot-scope="scope">
              <div>{{ scope.row.params.fullAttendance }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="'敬业金 \n'+valueDetails.click" align="center" prop="dedicationFee" width="60">
            <template slot-scope="scope">
              <div v-if="scope.row.salaryType === 0">{{ scope.row.params.fullAttendance }}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column :label="'每日报表\n'+valueDetails.reportPrice" align="center" prop="dedicationFee">
            <template slot-scope="scope">
              <div v-if="scope.row.params.usrDaikyReports < scope.row.params.days ">{{ scope.row.params.usrDaikyReports * (valueDetails.reportPrice/scope.row.params.days) }}</div>
              <div v-else>{{ valueDetails.reportPrice  }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="'录入出售\n'+valueDetails.bonuses" align="center" prop="sellProperties">
            <template slot-scope="scope">
              <div>{{ scope.row.params.bonuses - scope.row.params.sellProperties }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="'录入求购\n'+valueDetails.bonuses" align="center" prop="purchasingCustomer">
            <template slot-scope="scope">
              <div>{{ scope.row.params.bonuses - scope.row.params.purchasingCustomer }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="'带看求购\n'+valueDetails.bonuses" align="center" prop="lookPurchasingCustomer">
            <template slot-scope="scope">
              <div>{{ scope.row.params.bonuses - scope.row.params.lookPurchasingCustomer }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="'带看求租\n'+valueDetails.bonuses" align="center" prop="lookRentalClients">
            <template slot-scope="scope">
              <div v-if="scope.row.salaryType === 0 && scope.row.params.lookRentalClients > 0">{{ scope.row.params.bonuses - scope.row.params.lookRentalClients }}</div>
              <div v-else-if="scope.row.salaryType === 0 && scope.row.params.lookRentalClients <= 0">{{ scope.row.params.bonuses }}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column :label="'房源跟进\n'+valueDetails.houseFollowPrice" align="center" prop="houseFollow">
            <template slot-scope="scope">
              <div v-if="scope.row.params.houseFollow > 0">{{ scope.row.params.housefollowprice - scope.row.params.houseFollow }}</div>
              <div v-else> {{scope.row.params.housefollowprice}} </div>
            </template>
          </el-table-column>
          <el-table-column :label="'客源跟进\n'+valueDetails.customersource" align="center" prop="touristsFollow">
            <template slot-scope="scope">
              <div v-if="scope.row.params.touristsFollow > 0">{{ scope.row.params.customersource - scope.row.params.touristsFollow }}</div>
              <div v-else>{{ scope.row.params.customersource }}</div>
            </template>
          </el-table-column>
          <el-table-column :label="'照片视频上传\n'+valueDetails.photoPrice" align="center" prop="type">
            <template>
              <div>暂未统计</div>
<!--              <div v-if="scope.row.params.lookRentalClients">{{ valueDetails.photoPrice - scope.row.params.lookRentalClients }}</div>-->
            </template>
          </el-table-column>
          <el-table-column :label="'上传产权证/身份证\n'+valueDetails.idCardPrice" align="center" prop="type">
            <template>
              <div>暂未统计</div>
<!--              <div>{{ scope.row.params.bonuses - scope.row.params.lookRentalClients }}</div>-->
            </template>
          </el-table-column>
          <el-table-column :label="'自看租售\n'+valueDetails.salePrice" align="center" prop="type">
            <template>
              <div>暂未统计</div>
<!--              <div>{{ scope.row.params.bonuses - scope.row.params.lookRentalClients }}</div>-->
            </template>
          </el-table-column>

          <el-table-column :label="'房客企业微信\n'+valueDetails.monopolize" align="center" prop="type">
            <template slot-scope="scope">
              <el-input v-if="scope.row.diskHouseSelected" v-model="scope.row.params.salary.diskHouse"
                        @focus="focusEvent(scope.row,scope.$index,scope.column)"
                        @blur="blurEvent(scope.row,scope.$index,scope.column)" v-focus></el-input>
              <p @click="cellClick(scope.row, scope.column)" v-else>{{scope.row.params.salary.diskHouse}}</p>
            </template>
          </el-table-column>

          <el-table-column label="实收业绩" align="center" prop="type">
            <template slot-scope="scope">
              <el-input v-if="scope.row.performanceSelected" v-model="scope.row.params.salary.performance"
                        @focus="focusEvent(scope.row,scope.$index,scope.column)"
                        @blur="blurEvent(scope.row,scope.$index,scope.column)" v-focus></el-input>
              <p @click="cellClick(scope.row, scope.column)" v-else>{{scope.row.params.salary.performance}}</p>
            </template>
          </el-table-column>

          <el-table-column label="绩效" align="center" prop="type">
            <template slot-scope="scope">
              <el-input v-if="scope.row.meritsSelected" v-model="scope.row.params.salary.merits"
                        @focus="focusEvent(scope.row,scope.$index,scope.column)"
                        @blur="blurEvent(scope.row,scope.$index,scope.column)" v-focus></el-input>
              <p @click="cellClick(scope.row, scope.column)" v-else>{{scope.row.params.salary.merits}}</p>
            </template>
          </el-table-column>

          <el-table-column label="个人提成" align="center" prop="type">
            <template slot-scope="scope">
              <el-input v-if="scope.row.personSelected" v-model="scope.row.params.salary.person"
                        @focus="focusEvent(scope.row,scope.$index,scope.column)"
                        @blur="blurEvent(scope.row,scope.$index,scope.column)" v-focus></el-input>
              <p @click="cellClick(scope.row, scope.column)" v-else>{{scope.row.params.salary.person}}</p>
            </template>
          </el-table-column>

          <el-table-column label="团队提成" align="center" prop="type">
            <template slot-scope="scope">
              <el-input v-if="scope.row.teamSelected" v-model="scope.row.params.salary.team"
                        @focus="focusEvent(scope.row,scope.$index,scope.column)"
                        @blur="blurEvent(scope.row,scope.$index,scope.column)" v-focus></el-input>
              <p @click="cellClick(scope.row, scope.column)" v-else>{{scope.row.params.salary.team}}</p>
            </template>
          </el-table-column>

          <el-table-column :label="'本月合计\n'+comeValue" align="center" prop="uname" fixed="right">
            <template slot-scope="scope">
                    {{ toNumbers(scope.row) }}
            </template>
          </el-table-column>

          <el-table-column label="是否确认"  align="center" prop="uname" fixed="right">
            <template slot-scope="scope">
              <el-tag effect="dark" v-if="scope.row.params.salary.remark != null && scope.row.params.salary.remark != ''"> {{ scope.row.params.salary.remark }} </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handlescoped(scope.row)">考勤详情</el-button>
              <el-button size="mini" type="text" icon="el-icon-s-data" @click="handleContract(scope.row)">销售明细</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize" @pagination="getList" />
      </el-col>
    </el-row>
    <!-- 展示个人合同签约记录记录 -->
    <el-dialog title="提示" :visible.sync="contractShow" width="85%" style="overflow-y: auto">
      <el-table style='z-index: 999' v-loading="chockInShow" :data="contractData" height="400" show-summary stripe
                highlight-current-row @current-change="selectedContract" >
        <el-table-column label="合同编号" align="center" prop="no" />
        <el-table-column label="合同名称" align="center" prop="title" />
        <el-table-column label="创建人" align="center" prop="nickName" />
        <el-table-column label="业主" align="center" prop="trilateralInformation.a_name" />
        <el-table-column label="租/买 方" align="center" prop="trilateralInformation.b_name" />
        <el-table-column label="合同类型" align="center" prop="type">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.tfw_contract" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createtime" width="100">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createtime, '{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价格与成交(元)" align="center" prop="field104">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === contractRow.userId">
              <span v-if="scope.row.type === '1'">{{ scope.row.pricesDeals.add_money }} </span>
              <span v-else-if="scope.row.type === '5'">{{ scope.row.pricesDeals.money }} </span>
              <span v-else>{{ scope.row.pricesDeals.field104 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="增值服务费(元)">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === contractRow.userId">
              <span>{{scope.row.tfwContractSpecial.valueAdded}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="应收业绩(元)" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === contractRow.userId">
              <span> {{scope.row.receivable }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物业奖励(元)">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === contractRow.userId">
              <span>{{scope.row.tfwContractSpecial.wyCommission}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="房源支收(元)">
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: column;" v-if="scope.row.userId === contractRow.userId || contractRow.userId === scope.row.tfwContractSpecial.fyUserId">
              <span>{{scope.row.tfwContractSpecial.fyUserName}}</span>
              <span>{{scope.row.tfwContractSpecial.fyCommission}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="客源支收(元)">
          <template slot-scope="scope">
            <div style="display: flex;flex-direction: column;" v-if="scope.row.userId === contractRow.userId || contractRow.userId === scope.row.tfwContractSpecial.kyUserId">
              <span>{{scope.row.tfwContractSpecial.kyUserName}}</span>
              <span>{{scope.row.tfwContractSpecial.kyCommission}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="实收业绩(元)">
          <template slot-scope="scope">
            <div v-if="scope.row.userId === contractRow.userId">
              <span>{{ scope.row.receivable - scope.row.tfwContractSpecial.wyCommission - scope.row.tfwContractSpecial.fyCommission - scope.row.tfwContractSpecial.kyCommission}}</span>
            </div>
            <div v-else>
              <span v-if="contractRow.userId === scope.row.tfwContractSpecial.fyUserId && contractRow.userId === scope.row.tfwContractSpecial.kyUserId">{{scope.row.tfwContractSpecial.fyCommission + scope.row.tfwContractSpecial.kyCommission}}</span>
              <span v-else-if="contractRow.userId === scope.row.tfwContractSpecial.fyUserId">{{scope.row.tfwContractSpecial.fyCommission}}</span>
              <span v-else-if="contractRow.userId === scope.row.tfwContractSpecial.kyUserId">{{scope.row.tfwContractSpecial.kyCommission}}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div>
        合计：总成交金额 {{amounts.deals}}元， 总应收业绩 {{amounts.achievements}}元， 总实收业绩 {{amounts.receipts}}元
      </div>
      <div>
        当前计算含税，实际金额按照财务核算为主
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="innerVisible = true" :disabled="contractSpecial === null">编 辑</el-button>
        <el-button @click="generate()">生 成</el-button>
        <el-button @click="contractShow = false">取 消</el-button>
      </span>

      <el-dialog  width="30%"  :title="innerTitle" :visible.sync="innerVisible" append-to-body>
        <el-form ref="form" v-if="contractSpecial" :model="contractSpecial" label-width="150px" label-position="left">
          <el-form-item label="增值服务费(元)">
            <el-input v-model.number="contractSpecial.valueAdded"></el-input>
          </el-form-item>
          <el-form-item label="物业奖励(元)">
            <el-input v-model.number="contractSpecial.wyCommission"></el-input>
          </el-form-item>
          <el-row :gutter="12">
            <el-col :span="contractSpecial.fyUserName ? 12 : 24">
              <el-form-item label="房源来源">
                <el-autocomplete
                  class="inline-input"
                  v-model="contractSpecial.fyUserName"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容后选择"
                  :trigger-on-focus="false"
                  @select="handleSelect1"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="contractSpecial.fyUserName">
              <el-form-item label="房源分成">
                <el-input v-model.number="contractSpecial.fyBilling"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="房源支出">
            <el-input v-model.number="contractSpecial.fyCommission"></el-input>
          </el-form-item>
          <el-row :gutter="12">
            <el-col :span="contractSpecial.kyUserName ? 12 : 24">
              <el-form-item label="客源来源">
                <el-autocomplete
                  class="inline-input"
                  v-model="contractSpecial.kyUserName"
                  :fetch-suggestions="querySearch"
                  placeholder="请输入内容后选择"
                  :trigger-on-focus="false"
                  @select="handleSelect2"
                ></el-autocomplete>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="contractSpecial.kyUserName">
              <el-form-item label="客源分成">
                <el-input v-model.number="contractSpecial.kyBilling"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="客源支出">
            <el-input v-model.number="contractSpecial.kyCommission"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { remunerationlist, deptTreeSelect, myDeptTreeSelect } from '@/api/system/user'
import { updateSalary } from "@/api/system/personalSalary";
import {listPost} from  "@/api/system/post";
import { listContract} from "@/api/contract/contract";
import { reserveNumber, initNumber, splitStringByMinusOrPlus } from '@/utils/activiti/myUtil'
import { updateContractSpecial } from '@/api/contract/contractSpecial'
import { selectMyBrokerage } from '@/api/brokerage/confirm'
import {listUser2} from '@/api/system/user'
import { getChockln, listChockln, statistics } from '@/api/chockln/chockln'
import Decimal from '@/utils/decimal';
// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import item from '@/layout/components/Sidebar/Item.vue'

export default {
  name: "User",
  computed: {
    item() {
      return item
    }
  },
  dicts: ['tfw_qqlx', 'tfw_daka', 'tfw_contract', 'tfw_contract'],
  components: { Treeselect, ElImageViewer },
  data() {
    return {
      percentage: 0, //平台服务费
      percentageLabel: '',
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
      cardshow: false,
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
      cardList: [],
      //岗位
      postList: [],
      //
      valueDetails: {
        click: 0
      },
      comeValue: 0,
      //个人合同展示
      contractShow: false,
      contractData: null,
      contractQuery: {},
      amounts: {
        deals: 0,
        achievements: 0,
        receipts: 0
      },
      contractIndex: 0,
      contractRow: null, //选中的数据
      myBrokerage: null,
      //弹框
      innerVisible: false,
      innerTitle: '合同详情',
      contractSpecial: null,
      userList: [],
      chockInShow: false,
      params: {},
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
    this.getConfigKey("platform_commission").then(response => {
      this.percentage = response.msg;
      this.percentageLabel = '平台费('+initNumber(this.percentage) * 100+'%)(元)'
    });
    this.getinfo();
    //获取员工基础数据
    listUser2({
      userType: '00',
      status: "0",
    }).then(response => {
      let datas = [];
      response.data.forEach(function(item, index) {
        let value = {
          value: item.nickName,
          id: item.userId
        }
        datas.push(value);
      });
      this.userList = datas
    });
    let nowDate = new Date();
    let month = nowDate.getMonth() + 1
    if(month < 10) month = '0'+month;
    const result = this.getMonthStartAndEnd(nowDate.getFullYear() + "-" + month);
    this.params = {
      beginTime: result.startDate,
      endTime: result.endDate,
    }
  },
  methods: {
    toNumbers(nums) {
      let amount = 0
      //全勤
      amount = Decimal.add(amount, nums.params.fullAttendance);
      //敬业金
      amount = Decimal.add(amount, nums.params.fullAttendance);
      //报表
      if (nums.params.usrDaikyReports < nums.params.days) {
        let usrDaikyReports = Decimal.mul(nums.params.usrDaikyReports, (this.valueDetails.reportPrice / nums.params.days))
        amount = Decimal.add(amount , usrDaikyReports)
      } else {
        amount = Decimal.add(amount, this.valueDetails.reportPrice)
      }
      //录入出售
      amount = Decimal.add(amount ,nums.params.bonuses)
      amount = Decimal.sub(amount, nums.params.sellProperties)
      //录入求购
      amount = Decimal.add(amount ,nums.params.bonuses)
      amount = Decimal.sub(amount, nums.params.purchasingCustomer)
      //带看求购
      amount = Decimal.add(amount ,nums.params.bonuses)
      amount = Decimal.sub(amount, nums.params.lookPurchasingCustomer)
      //带看求租
      if (nums.salaryType === 0 && nums.params.lookRentalClients > 0) {
        amount = Decimal.add(amount ,nums.params.bonuses)
        amount = Decimal.sub(amount, nums.params.lookRentalClients)
      } else if (nums.salaryType === 0 && nums.params.lookRentalClients <= 0) {
        amount = Decimal.add(amount ,nums.params.bonuses)
      }
      //房源跟进
      if (nums.params.houseFollow > 0) {
        amount = Decimal.add(amount ,nums.params.housefollowprice)
        amount = Decimal.sub(amount, nums.params.houseFollow)
      } else {
        amount = Decimal.add(amount ,nums.params.housefollowprice)
      }
      //客源跟进
      if (nums.params.touristsFollow > 0) {
        amount = Decimal.add(amount ,nums.params.customersource)
        amount = Decimal.sub(amount, nums.params.touristsFollow)
      } else {
        amount = Decimal.add(amount ,nums.params.customersource)
      }
      //专盘房源
      amount = Decimal.add(amount ,nums.params.salary.diskHouse)
      //个人提成
      amount = Decimal.add(amount ,nums.params.salary.person)
      //团队提成
      amount = Decimal.add(amount ,nums.params.salary.team)
      return amount.toFixed()
    },
    initNumber,
    reserveNumber,
    handleDeptTree() {
      if (this.deptTreeShow) {
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
      await this.getConfig();
      await this.getDeptTree();
      await this.nowtime();
      await this.getList();
      await this.getPost();
    },
    // 考勤详细
    handlescoped(row) {
      this.cardshow = true;
      statistics({
        userId: row.userId,
        params: this.params
      }).then(response => {
        this.cardList = response.rows
      });
    },
    handleContract(row) {
      this.contractShow = true;
      this.contractRow = row;
      this.contractSpecial = null
      this.initContract();
    },
    initContract() {
      this.chockInShow = true
      selectMyBrokerage({
        userId: this.contractRow.userId
      }).then(res => {
        this.myBrokerage = null;
        if(res.data.brokerageId !== null) {
          this.myBrokerage = res.data.tfwBrokerage;
        }
      });
      this.contractQuery.special = 1;
      this.contractQuery.kpiQuery = 1;
      this.contractQuery.userId = this.contractRow.userId;
      this.contractQuery.queryDate = this.queryParams.params.thisdate
      this.listContract();
    },
    listContract() {
      this.amounts = {
        deals: 0,
        achievements: 0,
        receipts: 0
      };
      let that = this;
      listContract(this.contractQuery).then(res => {
        this.contractData = res.rows
        this.contractData.forEach(function(item, index) {
          if (item.trilateralInformation) {
            item.trilateralInformation = JSON.parse(item.trilateralInformation)
          }
          if (item.otherInformation) {
            item.otherInformation = JSON.parse(item.otherInformation)
          }
          if (item.pricesDeals) {
            item.pricesDeals = JSON.parse(item.pricesDeals)
          }
          //计算应收业绩
          item.receivable = 0
          if (item.type === '1' && item.otherInformation != null) {
            item.receivable += initNumber(item.otherInformation.a_service_fee)
            item.receivable += initNumber(item.otherInformation.b_service_fee)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else if (item.type === '2' && item.otherInformation != null) {
            item.receivable += initNumber(item.pricesDeals.field112)
            item.receivable += initNumber(item.pricesDeals.field113)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else if (item.type === '3' && item.otherInformation != null) {
            item.receivable += initNumber(item.otherInformation.field102)
            item.receivable += initNumber(item.otherInformation.field103)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else if (item.type === '5' && item.otherInformation != null) {
            item.receivable += initNumber(item.otherInformation.a_service_fee)
            item.receivable += initNumber(item.otherInformation.b_service_fee)
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          } else {
            if(item.pricesDeals != null) {
              item.receivable += initNumber(item.pricesDeals.field112)
              item.receivable += initNumber(item.pricesDeals.field113)
            }
            item.receivable += initNumber(item.tfwContractSpecial.valueAdded)
          }
          //总成交金额
          if (item.userId === that.contractRow.userId) {
            if(item.pricesDeals != null) {
              if (item.type === '1') {
                that.amounts.deals += initNumber(item.pricesDeals.add_money)
              } else if (item.type === '5') {
                that.amounts.deals += initNumber(item.pricesDeals.money)
              } else {
                that.amounts.deals += initNumber(item.pricesDeals.field104)
              }
            }
            that.amounts.receipts += (item.receivable - item.tfwContractSpecial.wyCommission - item.tfwContractSpecial.fyCommission - item.tfwContractSpecial.kyCommission)
          } else {
            if(that.contractRow.userId === item.tfwContractSpecial.fyUserId && that.contractRow.userId === item.tfwContractSpecial.kyUserId) {
              that.amounts.receipts += item.tfwContractSpecial.fyCommission + item.tfwContractSpecial.kyCommission
            } else if(that.contractRow.userId === item.tfwContractSpecial.kyUserId) {
              that.amounts.receipts += item.tfwContractSpecial.fyCommission
            } else if(that.contractRow.userId === item.tfwContractSpecial.kyUserId) {
              that.amounts.receipts += item.tfwContractSpecial.kyCommission
            }
          }
          //总应收业绩
          that.amounts.achievements += item.receivable
        })
        this.chockInShow = false
      });
    },
    /**
     * 遍历列的所有内容，获取最宽一列的宽度
     * @param arr
     */
    getMaxLength(arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          const calcLen = this.getTextWidth(item)
          if (acc < calcLen) {
            acc = calcLen
          }
        }
        return acc
      }, 0)
    },
    /**
     * 使用span标签包裹内容，然后计算span的宽度 width： px
     * @param valArr
     */
    getTextWidth(str) {
      let width = 0
      const html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },
    /**
     * el-table-column 自适应列宽
     * @param prop_label: 表名
     * @param table_data: 表格数据
     *
     */
    flexColumnWidth(label, prop, a) {
      const arr = this.chocklnList.map(x => x[a])
      let flag = false
      for (const arrElement of arr) {
        if (arrElement != null) {
          flag = true
        }
      }
      if (flag) {
        arr.push(label) // 把每列的表头也加进去算
        // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
        return (this.getMaxLength(arr) + 25) + 'px'
      } else {
        // 1.获取该列的所有数据
        const arr = this.chocklnList.map(x => x[prop])
        arr.push(label) // 把每列的表头也加进去算
        // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
        return (this.getMaxLength(arr) + 25) + 'px'
      }
    },
    nowtime() {
      let nowDate = new Date();
      let month = nowDate.getMonth() + 1
      if(month < 10) month = '0'+month;
      let date = {
        // 获取当前年份
        year: nowDate.getFullYear(),
        //获取当前月份
        month: month,
      };
      //拼接
      this.queryParams.params.thisdate = date.year + "-" + date.month;
    },
    pickertime(value) {
      this.queryParams.params.thisdate = value
      let result = this.getMonthStartAndEnd(value);
      this.params.beginTime = result.startDate
      this.params.endTime = result.endDate
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
      remunerationlist(this.queryParams).then(response => {
        this.chocklnList = response.rows;
        this.total = response.total;
        this.chocklnList = this.chocklnList.map((item) => {
          return { ...item, diskHouseSelected: false, performanceSelected: false, meritsSelected: false, personSelected: false, teamSelected: false }
        });
        console.log(this.chocklnList)
        this.loading = false;
      });
    },
    getPost() {
      listPost().then(res => {
        this.postList = res.rows;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      myDeptTreeSelect().then(response => {
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

    //点击显示输入框
    //点击输入框聚焦，存储当前值
    focusEvent(row, index, column) {
      if (column.label === '专盘房源\n'+this.valueDetails.monopolize) {
        row.params.salary.oldDiskHouse = row.params.salary.diskHouse
      } else if (column.label === '实收业绩') {
        row.params.salary.oldPerformance = row.params.salary.performance
      } else if (column.label === '绩效') {
        row.params.salary.oldMerits = row.params.salary.merits
      } else if (column.label === '个人提成') {
        row.params.salary.oldPerson = row.params.salary.person
      } else if (column.label === '团队提成') {
        row.params.salary.oldTeam = row.params.salary.team
      }
    },

    //输入框失去焦点触发,此处用提示框提示修改
    blurEvent(row, curIndex, column) {
      if (column.label === '专盘房源\n'+this.valueDetails.monopolize) {
        row.diskHouseSelected = !row.diskHouseSelected
        if (row.params.salary.diskHouse !== row.params.salary.oldDiskHouse) {
          updateSalary(row.params.salary).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000,
            })
          });
        }
      } else if (column.label === '实收业绩') {
        row.performanceSelected = !row.performanceSelected
        if (row.params.salary.performance !== row.params.salary.oldPerformance) {
          updateSalary(row.params.salary).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000,
            })
          });
        }
      } else if (column.label === '绩效') {
        row.meritsSelected = !row.meritsSelected
        if (row.params.salary.merits !== row.params.salary.oldMerits) {
          updateSalary(row.params.salary).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000,
            })
          });
        }
      } else if (column.label === '个人提成') {
        row.personSelected = !row.personSelected
        if (row.params.salary.person !== row.params.salary.oldPerson) {
          updateSalary(row.params.salary).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000,
            })
          });
        }
      } else if (column.label === '团队提成') {
        row.teamSelected = !row.teamSelected
        if (row.params.salary.team !== row.params.salary.oldTeam) {
          updateSalary(row.params.salary).then(res => {
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000,
            })
          });
        }
      }
    },
    //点击文本触发，显示input框，隐藏p标签
    cellClick(row, column) {
      if (column.label === '专盘房源\n'+this.valueDetails.monopolize) {
        row.diskHouseSelected = !row.diskHouseSelected
      } else if (column.label === '实收业绩') {
        row.performanceSelected = !row.performanceSelected
      } else if (column.label === '绩效') {
        row.meritsSelected = !row.meritsSelected
      } else if (column.label === '个人提成') {
        row.personSelected = !row.personSelected
      } else if (column.label === '团队提成') {
        row.teamSelected = !row.teamSelected
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总合';
        } else if(index === 14) {
          sums[index] = 0;
          data.forEach((item, itemIndex) => {
            sums[index] += Number(item.params.salary.performance)
          });
        } else if(index === 18) {
          sums[18] = 0;
          let sun = 0;
          data.forEach((item, itemIndex) => {
            sun = Decimal.add(sun, this.toNumbers(item));
          });
          sums[index] = sun.toFixed()
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },
    generate() {
      let that = this;
      //根据他的内容内容生成提成内容
      if(this.myBrokerage === undefined) {
          this.$message({
            message: '该员工未选择薪资方案！',
            type: 'error',
            duration: 1000,
          })
        return false
      }
      let person = initNumber(0);
      let items = this.myBrokerage.brokerageRulesList;
      //计算核算金额
      let receipts = this.amounts.receipts;
      if(this.myBrokerage.ilk === 1) {
        //固定额度
        receipts = receipts - this.myBrokerage.amount;
      } else {
        //百分比
        receipts = receipts - receipts*(this.myBrokerage.amount/100);
      }
      receipts = initNumber(receipts);
      items.forEach(function(item, index) {
        if(item.commissionType === '个人') {
          if(item.phaseType === '区间') {
            if(receipts > item.endAmount) {
              if(item.startAmount > 0) person += initNumber(Decimal.mul((item.endAmount - item.startAmount), initNumber(item.ruleDetails)/100))
              else person += initNumber(Decimal.mul(item.endAmount, initNumber(item.ruleDetails)/100))
            } else if (receipts >= item.startAmount && receipts < item.endAmount) {
              if(item.startAmount > 0) person += initNumber(Decimal.mul((receipts - item.startAmount), initNumber(item.ruleDetails)/100))
              else person += initNumber(Decimal.mul(receipts, initNumber(item.ruleDetails)/100))
            }
          } else {
            if(receipts > item.startAmount) person += initNumber(Decimal.mul(receipts, initNumber(item.ruleDetails)/100))
          }
        }
      });
      person = reserveNumber(person,1,2)
      if(person < 0) person = 0
      this.contractRow.params.salary.performance = this.amounts.receipts ;
      this.contractRow.params.salary.person = person;
      updateSalary(this.contractRow.params.salary).then(res => {
        this.$message({
          message: '生成成功！',
          type: 'success',
          duration: 1000,
        })
        this.contractShow = false
        this.getList();
      });
    },
    //选中
    selectedContract(val) {
      this.contractSpecial = val.tfwContractSpecial;
    },
    submitForm() {
      updateContractSpecial(this.contractSpecial).then(res => {
        this.$message({
          message: '保存成功！',
          type: 'success',
          duration: 1000,
        });
        this.innerVisible = false
        this.contractSpecial = null
        this.initContract();
      })
    },
    querySearch(queryString, cb) {
      var userList = this.userList;
      var results = queryString ? userList.filter(this.createFilter(queryString)) : userList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (userList) => {
        return (userList.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect1(item) {
      this.contractSpecial.fyUserId = item.id
    },
    handleSelect2(item) {
      this.contractSpecial.kyUserId = item.id
    },
    getConfig() {
      //录入出售、求购总奖金
      this.getConfigKey('house.selling.bonuses').then(response => {
        this.valueDetails.bonuses = response.msg
        this.comeValue += Number(response.msg)
        this.comeValue += Number(response.msg)
        this.comeValue += Number(response.msg)
        this.comeValue += Number(response.msg)
      })
      //打卡敬业
      this.getConfigKey('clock.in').then(response => {
        this.valueDetails.click = response.msg
        this.comeValue += Number(response.msg)
        this.comeValue += Number(response.msg)
      });
      //考核天数
      this.getConfigKey("assessment.days").then(response => {
        this.valueDetails.days = response.msg;
      });
      //每月房源跟进总奖励
      this.getConfigKey("house.follow.reward").then(response => {
        this.valueDetails.houseFollowPrice = response.msg;
        this.comeValue += Number(response.msg)
      });
      //每月客源跟进总奖励
      this.getConfigKey("tourists.follow.reward").then(response => {
        this.valueDetails.customersource = response.msg;
        this.comeValue += Number(response.msg)
      });
      //客源跟进单价
      this.getConfigKey("tourists.follow.price").then(response => {
        this.valueDetails.followprice = response.msg;
      });
      //房源跟进单价
      this.getConfigKey("house.follow.price").then(response => {
        this.valueDetails.houseprice = response.msg;
      });
      //出售/求购/带看求购/带看求租 每月有效个数
      this.getConfigKey("house.selling.bonuses.num").then(response => {
        this.valueDetails.sellingBonuses = response.msg;
      });
      //用户每日费用
      this.getConfigKey("tfw.user.daily.fee").then(response => {
        this.valueDetails.dayfree = response.msg;
      });
      //试岗期日工资
      this.getConfigKey("tfw.shigangqi").then(response => {
        this.valueDetails.shigangqi = response.msg;
      });
      //2个月综合业绩考核
      this.getConfigKey("performanceappraisal").then(response => {
        this.valueDetails.performanceappraisal = response.msg;
      });
      //照片视频上传个数
      this.getConfigKey("tfw.photo.upload").then(response => {
        this.valueDetails.detail.photoUpload = response.msg;
      });
      //照片视频上传总价
      this.getConfigKey("tfw.photo.price").then(response => {
        this.valueDetails.photoPrice = response.msg;
        this.comeValue += Number(response.msg)
      });
      //照片视频上传单次个数
      this.getConfigKey("tfw.photo.count").then(response => {
        this.valueDetails.photoCount = response.msg;
      });
      //上传产权证/身份证 个数
      this.getConfigKey("tfw.idCard.upload").then(response => {
        this.valueDetails.idCardUpload = response.msg;
      });
      //上传产权证/身份证 总价
      this.getConfigKey("tfw.idCard.price").then(response => {
        this.valueDetails.idCardPrice = response.msg;
        this.comeValue += Number(response.msg)
      });
      //自看租售个数
      this.getConfigKey("tfw.sale.self").then(response => {
        this.valueDetails.saleSelf = response.msg;
      });
      //自看租售总价
      this.getConfigKey("tfw.sale.price").then(response => {
        this.valueDetails.salePrice = response.msg;
        this.comeValue += Number(response.msg)
      });
      //自看租售
      this.getConfigKey("tfw.sale.photo").then(response => {
        this.valueDetails.salePhoto = response.msg;
      });
      //报表总价
      this.getConfigKey("tfw.report.price").then(response => {
        this.valueDetails.reportPrice = response.msg;
        this.comeValue += Number(response.msg)
      });
      //专盘房源占比95%
      this.getConfigKey("tfw.monopolize").then(response => {
        this.valueDetails.monopolize = response.msg;
        this.comeValue += Number(response.msg)
      });
    },
    getMonthStartAndEnd(yyyyMM) {
      // 解析字符串为年份和月份
      const [year, month] = yyyyMM.split('-').map(Number);
      // 获取月份的第一天
      const startDate = new Date(year, month - 1, 1);
      const formattedStartDate = this.formatDate(startDate);
      // 获取月份的最后一天
      const endDate = new Date(year, month, 0);
      const formattedEndDate = this.formatDate(endDate);
      return {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
        el.querySelector('input').select()
      },
    },
  },
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
