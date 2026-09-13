<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="城市选择" prop="xqname" size="mini" label-width="80px">
        <el-select v-model="cityCode" placeholder="请选择" v-if="userCityState" @change="handleChange">
          <el-option
            v-for="item in userCities"
            :label="item.cityName"
            :value="item.cityId"
            :key="item.cityId"
          >
          </el-option>
        </el-select>
        <el-cascader v-else
          v-model="regioncode"
          :options="ssqldList"
          :disabled="cityState"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader>
      </el-form-item>

      <el-form-item label="电话" prop="phonenumber">
        <el-input v-model="queryParams.phonenumber" placeholder="请输入联系电话" type="number"></el-input>
      </el-form-item>
      <el-form-item label="浏览类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="租或买" clearable style="width:140px">
          <el-option label="买" value="1"></el-option>
          <el-option label="租" value="2"></el-option>
          <el-option label="租买同时存在" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围" label-width="90px">
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
        <el-button size="mini" @click="setDateRange('today')">本日</el-button>
        <el-button size="mini" @click="setDateRange('week')">本周</el-button>
        <el-button size="mini" @click="setDateRange('month')">本月</el-button>
        <el-dropdown size="mini" @command="setDateRange" style="margin-left:5px;">
          <el-button size="mini">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="lastMonth">上个月</el-dropdown-item>
            <el-dropdown-item command="quarter">本季度</el-dropdown-item>
            <el-dropdown-item command="lastQuarter">上季度</el-dropdown-item>
            <el-dropdown-item command="year">本年</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['views:views:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="viewsList">
      <el-table-column label="用户手机号" align="center" prop="sysUser.phonenumber" >
        <template slot-scope="scope">
          <div v-if="scope.row.phonenumber !== ''">
            <div v-if="scope.row.myHouses.length>0 || scope.row.tfwSourceTourists.length>0">
              {{ phoneNumberParts(scope.row.sysUser.phonenumber)}}
            </div>
            <div v-else>
              {{scope.row.sysUser.phonenumber}}
            </div>
            <div v-if="scope.row.params">
              {{scope.row.params.phoneRegionCode}}
            </div>
            <div v-if="scope.row.tfwSourceTourists.length>0">
              <div v-for="(item,index) in scope.row.tfwSourceTourists" :key="index">
                 {{item.nickName}}
                <div v-for="(item1,index1) in JSON.parse(item.customer) " :key="index1">
                  {{item1.name}}
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            未授权用户
          </div>
        </template>
      </el-table-column>
      <el-table-column label="客户类型" align="center" width="180">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.sysUser.remark">{{scope.row.sysUser.remark}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="浏览分类" align="center" width="180">
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.queryType" :key="item.id">
            <span v-if="index> 0"> / </span>
            <span v-if="item === '1'" style="color: red">买</span>
            <span v-else>租</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="领取人" align="center" width="180">
        <template slot-scope="scope">
          <span v-if="scope.row.tfwSourceTourists.length>0">
            <el-tag>{{nickNameParts(scope.row.tfwSourceTourists[0].nickName)}}</el-tag>
          </span>
          <span v-if="scope.row.myHouses.length>0">
            <el-tag>{{nickNameParts(scope.row.myHouses[0].createByName)}}(业主)</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="浏览时间" align="center" prop="viewTime" width="180">
        <template slot-scope="scope">
          <span>{{ format(scope.row.viewTime, 'yyyy-MM-dd') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日/总浏览" align="center" width="180" prop="userViews.length">
        <template slot-scope="scope">
          <span>{{ scope.row.userViews.length }} / {{scope.row.total}} 套</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览详情" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="showDetails(scope.row)"
          >看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="showInteract(scope.row)"
          >沟通</el-button>
          <el-button
            v-if="scope.row.tfwSourceTourists.length===0"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="showGuest(scope.row)"
          >领私客</el-button>
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

    <!-- 查看浏览历史对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="70%">
      <el-table :data="viewData" v-loading="loading">
        <el-table-column label="小区名称" align="center" prop="tfwHouse.xqname" />
        <el-table-column label="房号" align="center">
          <template slot-scope="scope">
            {{scope.row.tfwHouse.building}}-*-{{scope.row.tfwHouse.floor}}-*
          </template>
        </el-table-column>
        <el-table-column label="户型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.tfwLoupanHuxing.bedRoomNum">
              {{scope.row.tfwLoupanHuxing.bedRoomNum}}室{{scope.row.tfwLoupanHuxing.livingRoomNum}}厅{{scope.row.tfwLoupanHuxing.bathroomNum}}卫
            </span>
            <span v-else>未知</span>
          </template>
        </el-table-column>

        <el-table-column label="浏览类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '1'">买房</span>
            <span v-else>租房</span>
          </template>
        </el-table-column>

        <el-table-column label="价格" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '1' && scope.row.tfwHouse.sellingPrice > 0">
              {{scope.row.tfwHouse.sellingPrice}}万
            </span>
            <span v-else>
              {{scope.row.tfwHouse.rental}}元
            </span>
          </template>
        </el-table-column>
        <el-table-column label="浏览时间" align="center" width="180" prop="viewTime">
        </el-table-column>
      </el-table>
      <pagination
        v-show="viewQuery.total>0"
        :total="viewQuery.total"
        :page.sync="viewQuery.pageNum"
        :limit.sync="viewQuery.pageSize"
        @pagination="getViews"
      />
    </el-dialog>
    <el-dialog width="80%" title="沟通历史" :visible.sync="showRemark1">
      <el-dialog width="40%" title="添加沟通" :visible.sync="showRemark2" append-to-body>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item>
            <el-select v-model="form.user.remark">
              <el-option value="客户">客户</el-option>
              <el-option value="中介">中介</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="沟通情况">
            <el-input type="textarea"  maxlength="200" v-model="form.interact" :rows="4"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">立即创建</el-button>
            <el-button @click="showRemark2 = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <div>
        <el-row class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" @click="showRemark2 = true">添加沟通</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="remarkList">
          <el-table-column label="编号" align="center" prop="id" width="50px" />
          <el-table-column label="沟通人" align="center" prop="user.nickName" width="150px"/>
          <el-table-column label="沟通时间" align="center" prop="interactDate" width="250px" />
          <el-table-column label="沟通内容" align="center" prop="interact" />
        </el-table>
        <pagination
          v-show="remarkQuery.total>0"
          :total="remarkQuery.total"
          :page.sync="remarkQuery.pageNum"
          :limit.sync="remarkQuery.pageSize"
          @pagination="getRemarks"
        />
      </div>
    </el-dialog>

    <!-- 领私客 -->
    <el-dialog title="添加私客" :visible.sync="guestOpen" width="900px" append-to-body v-if="guestOpen">
      <el-form ref="guestForm" :model="guestForm" :rules="guestRules" label-width="80px" :inline="true">
        <el-card class="box-card">
          <el-form-item label="需求区域" prop="area">
            <StateCityDistrictStreetSelector v-model="guestForm.area" :ssqldList="cityList" :type="'id'"/>
            <div style="display: flex">
              <el-input placeholder="请输入片区备注" v-model="guestForm.remarks" />
            </div>
          </el-form-item>
          <el-form-item prop="remarks">
          </el-form-item>
          <div slot="header" class="clearfix">
            <span class="cardtitlw">委托信息</span>
          </div>
          <el-form-item label="委托来源" prop="source">
            <el-select v-model="guestForm.source" placeholder="请选择委托来源" size="mini" style="width:150px">
              <el-option v-for="dict in dict.type.tfw_wtly" :key="dict.value" :label="dict.label"  :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="委托求购类型" prop="type" label-width="110px">
            <el-select v-model="guestForm.type" placeholder="请选择求购类型" size="mini" style="width:150px">
              <el-option v-for="    dict    in    dict.type.tfw_wtlx   " :key="dict.value" :label="dict.label"
                         :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房屋用途" prop="purposeOfTheHouse">
            <el-select v-model="guestForm.purposeOfTheHouse" placeholder="请选择房屋用途" size="mini" style="width:150px">
              <el-option v-for="dict in dict.type.tfw_property_type" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="guestForm.type === '1' || guestForm.type === '3'">
            <el-form-item label="购房意向" prop="purchaseIntention">
              <el-input v-model="guestForm.purchaseIntention" placeholder="请输入购房意向" clearable size="mini" />
            </el-form-item>
            <el-col>
              <el-form-item label="购房价格最小值" prop="purchasePriceMin" label-width="110px">
                <el-input v-model="guestForm.purchasePriceMin" placeholder="请输入购房价格最小值" clearable size="mini">
                  <template slot="append">万</template>
                </el-input>
              </el-form-item>
              <el-form-item label="购房价格最大值" prop="purchasePriceMax" label-width="110px">
                <el-input v-model="guestForm.purchasePriceMax" placeholder="请输入购房价格最大值" clearable size="mini">
                  <template slot="append">万</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="购房面积最小值" prop="purchaseAreaMin" label-width="110px">
                <el-input v-model="guestForm.purchaseAreaMin" placeholder="请输入购房面积最小值" clearable size="mini">
                  <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
              <el-form-item label="购房面积最大值" prop="purchaseAreaMax" label-width="110px">
                <el-input v-model="guestForm.purchaseAreaMax" placeholder="请输入购房面积最大值" clearable size="mini">
                  <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
<!--            <el-form-item label="购房需求户型" prop="purchaseRoom">-->
<!--              <el-checkbox-group v-model="guestForm.purchaseRoom" :max="6" size="mini">-->
<!--                <el-checkbox v-for="dict in dict.type.tfw_fuxing" :key="dict.value" :label="dict.value">-->
<!--                  {{ dict.label }}-->
<!--                </el-checkbox>-->
<!--              </el-checkbox-group>-->
<!--            </el-form-item>-->
          </div>
          <div v-if="guestForm.type === '2' || guestForm.type === '3'">
            <el-form-item label="租房意向" prop="rentingIntention">
              <el-input v-model="guestForm.rentingIntention" placeholder="请输入租房意向" clearable size="mini" />
            </el-form-item>
            <el-col>
              <el-form-item label="租房价格最小值" prop="rentingPriceMin" label-width="110px">
                <el-input v-model="guestForm.rentingPriceMin" placeholder="请输入租房价格最小值" clearable size="mini">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="租房价格最大值" prop="rentingPriceMax" label-width="110px">
                <el-input v-model="guestForm.rentingPriceMax" placeholder="请输入租房价格最大值" clearable size="mini">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col>
              <el-form-item label="租房面积最小值" prop="rentingAreaMin" label-width="110px">
                <el-input v-model="guestForm.rentingAreaMin" placeholder="请输入租房价格最小值" clearable size="mini">
                  <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
              <el-form-item label="租房面积最大值" prop="rentingAreaMax" label-width="110px">
                <el-input v-model="guestForm.rentingAreaMax" placeholder="请输入租房面积最大值" clearable size="mini">
                  <template slot="append">㎡</template>
                </el-input>
              </el-form-item>
            </el-col>
<!--            <el-form-item label="租房需求户型" prop="rentingRoom">-->
<!--              <el-checkbox-group v-model="guestForm.rentingRoom" :max="6" size="mini">-->
<!--                <el-checkbox v-for="dict in dict.type.tfw_fuxing" :key="dict.value" :label="dict.value">-->
<!--                  {{ dict.label }}-->
<!--                </el-checkbox>-->
<!--              </el-checkbox-group>-->
<!--            </el-form-item>-->
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardtitlw">客户信息</span>
          </div>
          <el-form-item label="客户类型" prop="publicAndPrivate">
            <el-select v-model="guestForm.publicAndPrivateLable" placeholder="请选择客户类型" size="mini" style="width:150px" disabled>
              <el-option></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="客源状态" prop="state">
            <el-select v-model="guestForm.state" placeholder="请选择客源状态" size="mini" style="width:150px">
              <el-option v-for="dict in dict.type.tfw_source_state" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等级" prop="grade">
            <el-select v-model="guestForm.grade" placeholder="请选择等级" size="mini" style="width:150px">
              <el-option v-for="dict in dict.type.tfw_wtdj" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="addDomain" type="primary" size="mini">新增联系人</el-button>
          <br />
          <el-form-item v-for="(domain, index) in customercopy" :label="'联系人' + (index + 1)"
                        :key="domain.key" :prop="'customercopy.' + index">
            <el-form :model="domain" ref="domain">
              <el-form-item prop="type">
                <el-select v-model="domain.sex" placeholder="请选择性别" size="mini" style="width:120px;padding-right:10px ;">
                  <el-option v-for="dict in dict.type.sys_user_sex" :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="name">
                <el-input v-model="domain.name" style="width:120px;padding-right:10px ;" placeholder="请输入姓名" size="mini"></el-input>
              </el-form-item>
              <el-form-item prop="value">
                <el-input v-model="domain.value" style="width:120px;padding-right:10px ;" placeholder="请输入电话" size="mini"></el-input>
              </el-form-item>
              <el-button v-if="!domain.value2flag" @click.prevent="value2flag(domain)" type="danger" size="mini">手机号二</el-button>
              <div>
                <el-form-item prop="value" v-if="domain.value2flag">
                  <el-input v-model="domain.value2" style="width:120px;padding-right:10px ;" placeholder="请输入电话2"  size="mini"></el-input>
                </el-form-item>
              </div>
              <el-button @click.prevent="removeDomain(domain)" type="danger" size="mini">删除</el-button>
            </el-form>
          </el-form-item>
        </el-card>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="guestSubmitForm">确 定</el-button>
        <el-button @click="guestCancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listViews, delViews, listPhoneData } from '@/api/views/views'
import {listViewsRemark, addViewsRemark} from '@/api/views/viewsRemark'
import { format, phoneNumberParts, nickNameParts } from '@/utils/activiti/myUtil';
import { addTourists } from "@/api/source/tourists";
import Dict from '@/views/system/dict/index.vue'
import { getlist } from '@/api/province'
export default {
  dicts: ['tfw_wtly','tfw_wtdj', 'tfw_property_type', 'tfw_wtlx', 'sys_user_sex', 'tfw_fuxing', 'tfw_source_state'],
  name: "Views",
  components: {
    Dict
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
      showSearch: true,
      // 总条数
      total: 0,
      // 用户浏览历史表格数据
      viewsList: [],
      // 日期范围
      dateRange: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        userId: null,
        pageId: null,
        type: null,
        beginTime: null,
        endTime: null,
        phonenumber: null,
        cityCode: 510100,
      },
      // 表单参数
      form: {
        user: {remark: '客户'}
      },
      // 表单校验
      rules: {
      },
      viewData: null,
      showRemark1: false, //备注
      showRemark2: false, //备注
      viewQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userId: null,
        phonenumber: '',
      },
      remarkList: null,
      remarkQuery: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        useUserId: null,
      },
      //城市查询
      regioncode: [510000, 510100],
      ssqldList: [],
      cityList: [],
      cityState: true,

      //领私客
      guestOpen: false,
      guestForm: {
        area: null, //需求区域
        remarks: null, //区域备注
        source: null, //委托来源
        type: null, //委托求购类型
        purposeOfTheHouse: null, //房屋用途
        purchaseIntention: null, //购房意向
        purchasePriceMin: null, //购房价最小
        purchasePriceMax: null, //购房价最大
        purchaseAreaMin: null, //购房面积最小
        purchaseAreaMax: null, //购房面积最大
        purchaseRoom: null, //购房需求户型
        rentingIntention: null, //租房意向
        rentingPriceMin: null, //租房价最小
        rentingPriceMax: null, //租房价最大
        rentingAreaMin: null, //租房面积最小
        rentingAreaMax: null, //租房面积最大
        rentingRoom: null, //租房户型
        publicAndPrivateLable: '私客',
        publicAndPrivate: 2,
        state: null, //客源状态
        grade: null, //可以等级
      },
      customercopy: [{
        sex: '',
        value: '',
        name: '',
        value2flag: false,
        value2: ''
      }],
      // 表单校验
      guestRules: {
      },
      defaultParams: {
        value: 'id',
        label: 'extName',
        children: "children",
      },

      //多负责城市处理
      userCityState: false,
      userCities: [],
      cityCode: null
    };
  },
  created() {
    if(this.$store.state.user.userid === 1 || this.$store.state.user.userid === 116) this.cityState = false
    this.regioncode = [this.$store.state.user.provinceCode, this.$store.state.user.cityCode];
    if(this.$store.getters.userCities.length > 0) {
      this.userCityState = true;
      this.queryParams.cityCode = this.$store.getters.userCities[0].cityId;
      this.cityCode = this.queryParams.cityCode;
      this.userCities = this.$store.getters.userCities;
    } else {
      this.cityCode = this.$store.state.user.cityCode;
      this.queryParams.cityCode = this.$store.state.user.cityCode;
    }
    let monthRange = this.getMonthStartAndEnd(
      this.parseTime(new Date(), "{y}-{m}")
    );
    this.dateRange = [monthRange.startDate, monthRange.endDate];
    this.queryParams.beginTime = this.dateRange[0];
    this.queryParams.endTime = this.dateRange[1];
    localStorage.setItem("citycode", JSON.stringify(this.citycode));
    getlist(2).then(response => {
      const options = response.data.map(option => ({
        ...option,
        label: option.extName, // 如果 extName 不存在，则回退到 name
        value: option.id
      }));
      this.ssqldList = this.handleTree(options, "id", "parentId");
    })

    getlist(3).then(response => {
      this.cityList = this.handleTree(response.data, "id", "parentId");
    })
    this.getList();
  },
  methods: {
    format,phoneNumberParts,nickNameParts,
    /** 城市查询 */
    handleChange(value) {
      if(this.userCityState) {
        this.queryParams.cityCode = this.cityCode;
      } else {
        this.queryParams.cityCode = value[1];
      }
    },
    /** 查询用户浏览历史列表 */
    getList() {
      this.loading = true;
      this.viewsList = [];
      listViews(this.queryParams).then(response => {
        this.viewsList = response.rows;
        console.log(this.viewsList)
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        pageId: null,
        type: null,
        viewTime: null
      };
      this.resetForm("form");
    },
    /** 快捷日期选择 */
    setDateRange(command) {
      const now = new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      const start = (d) => { const s = new Date(d); s.setHours(0,0,0,0); return this.parseTime(s, '{y}-{m}-{d}'); };
      const end = (d) => { const e = new Date(d); e.setHours(23,59,59,999); return this.parseTime(e, '{y}-{m}-{d}'); };
      let s, e;
      switch (command) {
        case 'today':
          s = e = now;
          break;
        case 'week': {
          const day = now.getDay();
          const diff = day === 0 ? 6 : day - 1;
          s = new Date(now.getFullYear(), now.getMonth(), now.getDate() - diff);
          e = new Date(s.getFullYear(), s.getMonth(), s.getDate() + 6);
          break;
        }
        case 'month':
          s = new Date(y, m, 1);
          e = new Date(y, m + 1, 0);
          break;
        case 'lastMonth':
          s = new Date(y, m - 1, 1);
          e = new Date(y, m, 0);
          break;
        case 'quarter': {
          const q = Math.floor(m / 3) * 3;
          s = new Date(y, q, 1);
          e = new Date(y, q + 3, 0);
          break;
        }
        case 'lastQuarter': {
          const lq = Math.floor(m / 3) * 3 - 3;
          s = new Date(y, lq, 1);
          e = new Date(y, lq + 3, 0);
          break;
        }
        case 'year':
          s = new Date(y, 0, 1);
          e = new Date(y, 11, 31);
          break;
      }
      this.dateRange = [start(s), end(e)];
      this.handleQuery();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      if(this.dateRange != null && this.dateRange.length > 0){
       this.queryParams.beginTime = this.dateRange[0];
        this.queryParams.endTime = this.dateRange[1];
      } else {
        this.queryParams.beginTime = null;
        this.queryParams.endTime = null;
      }
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.queryParams.beginTime = null;
      this.queryParams.endTime = null;
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 显示查询 */
    showDetails(row) {
      this.viewQuery.phonenumber = row.phonenumber;
      this.viewQuery.userId = row.userId;
      this.getViews();
      this.open = true
    },
    getViews() {
      this.loading = true
      listPhoneData(this.viewQuery).then(res => {
        this.loading = false
        this.viewData = res.rows;
        this.viewQuery.total = res.total
      });
    },
    /** 添加沟通 */
    showInteract(row) {
      this.loading = true
      this.showRemark1 = true;
      this.form.useUserId = row.userId;
      this.remarkQuery.useUserId = row.userId
      this.getRemarks()
    },
    getRemarks() {
      listViewsRemark(this.remarkQuery).then(res => {
        this.remarkList = res.rows
        this.remarkQuery.total = res.total
        this.loading = false
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          addViewsRemark(this.form).then(res => {
            this.$modal.msgSuccess("添加沟通成功");
            this.showRemark2 = false;
            this.getRemarks();
          })
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除用户浏览历史编号为"' + ids + '"的数据项？').then(function() {
        return delViews(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('views/views/export', {
        ...this.queryParams
      }, `views_${new Date().getTime()}.xlsx`)
    },
    openXq(house) {
      console.log(house, 'house')
    },

    /** 添加私客 */
    //
    showGuest(row) {
      listViewsRemark({
        pageNum: 1,
        pageSize: 10,
        total: 0,
        userId: this.$store.state.user.userid,
        useUserId: row.userId
      }).then(res => {
        console.log(res)
        if(res.total > 0) {
          this.guestOpen = true;
          this.customercopy[0].value = row.phonenumber
        } else {
          this.$message.error('请沟通后再领取');
        }
      });
    },

    //手机号表格删除
    removeDomain(item) {
      var index = this.customercopy.indexOf(item)
      if (index !== -1) {
        this.customercopy.splice(index, 1)
      }
    },
    //手机号表格新增
    addDomain() {
      this.customercopy.push({
        sex: '',
        value: '',
        name: '',
        value2flag: false,
        value2: ''
      });
    },
    /** 提交按钮 */
    guestSubmitForm() {
      console.log(this.guestForm, "rrrrrrrrrrrrrrrrrrrrrrrrrrrr")
      // if(this.guestForm.rentingRoom != null)  this.guestForm.rentingRoom = this.guestForm.rentingRoom.join(",");
      // if(this.guestForm.purchaseRoom != null) this.guestForm.purchaseRoom = this.guestForm.purchaseRoom.join(",");
      // if(this.guestForm.area != null) this.guestForm.area = this.guestForm.area.join(",");
      // this.guestForm.customer = JSON.stringify(this.customercopy)
      console.log("结束")

      if(this.guestForm.rentingRoom)
        this.guestForm.rentingRoom = this.guestForm.rentingRoom.join(",");
      if(this.guestForm.purchaseRoom)
        this.guestForm.purchaseRoom = this.guestForm.purchaseRoom.join(",");
      if(this.guestForm.area.length > 0) {
        this.guestForm.province = this.guestForm.area[0]
        this.guestForm.city = this.guestForm.area[1]
        this.guestForm.zone = this.guestForm.area[2]
        this.guestForm.area = null
      } else {
        this.$modal.alertWarning("请填写完整省市区信息");
        return
      }
      this.guestForm.customer = JSON.stringify(this.customercopy)


      if (this.guestForm.eId != null) {
        // updateTourists(this.form).then(response => {
        //   this.$modal.msgSuccess("修改成功");
          console.log(this.guestForm, "22222222222222222222222222");
        //   this.open = false;
        // });
      } else {
        addTourists(this.guestForm).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.guestOpen = false;
          this.getList();
        });
      }
    },
    guestCancel() {
      this.guestOpen = false;
      this.guestReset();
    },
    guestReset() {
      this.customercopy = [{
        sex: '',
        value: '',
        name: '',
        value2flag: false,
        value2: ''
      }];
      this.resetForm("guestForm");
    },
    getMonthStartAndEnd(yyyyMM) {
      // 解析字符串为年份和月份
      const [year, month] = yyyyMM.split("-").map(Number);
      // 获取月份的第一天
      const startDate = new Date(year, month - 1, 1);
      const formattedStartDate = this.formatDate(startDate);
      // 获取月份的最后一天
      const endDate = new Date(year, month, 0);
      const formattedEndDate = this.formatDate(endDate);
      return {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      };
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
  }
};
</script>
