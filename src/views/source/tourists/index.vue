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
                     :options="citiesList"
                     :disabled="cityState"
                     :props="{ expandTrigger: 'hover' }"
                     @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="区域" prop="zone" label-width="80px">
        <el-select v-model="queryParams.zone" placeholder="请选择区域" clearable style="width:150px" @change="handleQuery">
          <el-option v-for="item in zoneOptions" :key="item.id" :label="item.extName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="委托来源" prop="source">
        <el-select v-model="queryParams.source" placeholder="请选择委托来源" style="width:150px">
          <el-option v-for=" dict in dict.type.tfw_wtly" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="求购类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择房屋用途" style="width:150px">
          <el-option v-for=" dict in dict.type.tfw_wtlx" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名/手机号/备注" prop="customer" label-width="150px">
        <el-input v-model="queryParams.customer" placeholder="请输入姓名/手机号/备注" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="等级" prop="grade">
        <el-select v-model="queryParams.grade" placeholder="请选择等级" style="width:150px">
          <el-option v-for=" dict in dict.type.tfw_wtdj" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房屋用途" prop="purposeOfTheHouse">
        <el-select v-model="queryParams.purposeOfTheHouse" placeholder="请选择房屋用途" style="width:150px">
          <el-option v-for=" dict in dict.type.tfw_featured_tags" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="purchaseRoom" style="margin-bottom: 0px;" label="户型:">
        <el-radio-group v-model="queryParams.purchaseRoom" size="mini">
          <el-radio-button v-for="dict in dict.type.tfw_fuxing" :key="dict.value" :label="dict.value"
                           size="medium" @click.native="pickHuxing($event)">{{ dict.label }}
          </el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item prop="sellingPrice" style="margin-bottom: 0px;" label="价格:">
        <el-radio-group v-model="queryParams.sellingPrice" size="mini">
          <el-radio-button v-for="dict in dict.type.tfw_prices" :key="dict.value" :label="dict.value"
                           size="medium" @click.native="pickPrice($event)">{{ dict.label }}
          </el-radio-button>
        </el-radio-group>
        <el-input v-model="queryParams.params.sellingPriceMin" placeholder="请输入最小值" clearable
                  style="width:120px;margin-left: 20px" size="mini" />
        <i class="el-icon-minus"></i>
        <el-input v-model="queryParams.params.sellingPriceMax" placeholder="请输入最大值" clearable
                  style="width:120px;margin-right: 20px;" size="mini" />
      </el-form-item>

      <el-form-item prop="propertyArea" style="margin-bottom: 0px;" label="面积:">
        <el-radio-group v-model="queryParams.propertyArea" size="mini">
          <el-radio-button v-for="dict in dict.type.tfw_arear" :key="dict.value" :label="dict.value"
                           size="medium" @click.native="pickArea($event)">{{ dict.label }}
          </el-radio-button>
        </el-radio-group>
        <el-input v-model="queryParams.params.propertyAreaMin" placeholder="请输入最小值" clearable
                  style="width:120px;margin-left: 30px" size="mini" />
        <i class="el-icon-minus"></i>
        <el-input v-model="queryParams.params.propertyAreaMax" placeholder="请输入最大值" clearable
                  style="width:120px;margin-right: 20px;" size="mini" />
      </el-form-item>
      <el-form-item label="日期范围" label-width="120px">
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
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:tourists:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:tourists:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="touristsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <!-- <el-table-column label="客源id" align="center" prop="eId" /> -->
      <el-table-column label="客户来源" align="center" prop="source" :width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_wtly" :value="scope.row.source" />
        </template>
      </el-table-column>
      <el-table-column label="客户信息" align="center" prop="customer" :width="120">
        <template slot-scope="scope">
          <div style="display: flex;justify-content:space-between;flex-direction: column; align-items: center;">
            <div v-for="item in scope.row.customer ? JSON.parse(scope.row.customer) : [{}]" :key="item.value"
                 style="display: flex;justify-content: space-around; margin-bottom: 10px;">
              <el-tooltip :content="item.value" placement="bottom">
                <i class="el-icon-male" v-if="item.sex == 0" style="font-size: 14px;"> {{ item.name ? item.name : "--"
                  }}</i>
                <i class="el-icon-female" v-if="item.sex == 1" style="font-size: 14px;"> {{ item.name ? item.name : "--"
                  }}</i>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="委托信息" align="center" prop="state" :width="120">
        <template slot-scope="scope">
          <!-- <dict-tag :options="dict.type.tfw_wtly" :value="scope.row.source" /> -->
          <dict-tag :options="dict.type.tfw_wtlx" :value="scope.row.type" />
          <div style="color:#FF7200;margin-bottom:5px">{{ scope.row.followTime ?
            getDiffDay(scope.row.followTime) + "天未跟进" : "暂无跟进" }}</div>
        </template>
      </el-table-column>
      <el-table-column label="紧迫情况" align="center" prop="customer" :width="120">
        <template slot-scope="scope">
          <div style="display: flex;justify-content:space-between;flex-direction: column; align-items: center;">
            <dict-tag :options="dict.type.tfw_wtdj" :value="scope.row.grade" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="需求房屋类型" align="center" prop="purposeOfTheHouse" :width="130">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: column;">
            <dict-tag :options="dict.type.tfw_property_type" :value="scope.row.purposeOfTheHouse" />
          </div>
          <div style="color:#FF7200;margin-bottom:5px" v-if="scope.row.userViews != null" @click="jumpTo(scope.row.userViews.phonenumber)">
            {{
              scope.row.userViews.viewTime ?
                getDiffDay(scope.row.userViews.viewTime) + "天前浏览" : "暂无浏览"
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="房屋需求" align="left" prop="rentingRoom" :width="220">
        <template slot-scope="scope">
          <div v-if="scope.row.type == 1 || scope.row.type == 3">
            <div>买房面积区间：{{ scope.row.purchaseAreaMin ? scope.row.purchaseAreaMin : "-"
              }}㎡-{{
                scope.row.purchaseAreaMax ? scope.row.purchaseAreaMax : "" }}㎡</div>
            <div>买房价格区间：{{ scope.row.purchasePriceMin ? scope.row.purchasePriceMin : "-"
              }}万-{{
                scope.row.purchasePriceMax ? scope.row.purchasePriceMax : "" }}万</div>
          </div>
          <div v-if="scope.row.type == 2 || scope.row.type == 3">
            <div>租房面积区间：{{ scope.row.rentingAreaMin ? scope.row.rentingAreaMin : "-"
              }}㎡-{{
                scope.row.rentingAreaMax ? scope.row.rentingAreaMax : "" }}㎡</div>
            <div>租房价格区间：{{ scope.row.rentingPriceMin ? scope.row.rentingPriceMin : "-"
              }}元-{{
                scope.row.rentingPriceMax ? scope.row.rentingPriceMax : "" }}元</div>
          </div>
          <div>
            <div v-if="scope.row.type == 1 || scope.row.type == 3" style="display:flex;">
              购房:<dict-tag :options="dict.type.tfw_fuxing"
                             :value="scope.row.purchaseRoom ? scope.row.purchaseRoom.split(',') : []" />
            </div>

            <div v-if="scope.row.type == 2 || scope.row.type == 3" style="display:flex;">
              租房:<dict-tag :options="dict.type.tfw_fuxing"
                             :value="scope.row.rentingRoom ? scope.row.rentingRoom.split(',') : []" />
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="需求区域" align="center" prop="remarks">
        <template slot-scope="scope">
          {{ scope.row.area }}
          <br>
          {{ scope.row.remarks }}
        </template>
      </el-table-column>
      <el-table-column label="所属人" align="center" :width="150">
        <template>
          公共客户
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"-->
          <!--            v-hasPermi="['system:tourists:edit']">修改</el-button>-->
          <el-button size="mini" type="text" icon="el-icon-share" @click="handparticulars(scope.row)">详情</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:tourists:remove']">删除</el-button>

        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 详情抽屉 -->
    <el-drawer v-if="drawer" title="详情" :visible.sync="drawer" :direction="direction" size="48%"
      :before-close="handleClose">
      <el-button type="primary" plain icon="el-icon-connections" size="mini" @click="handleAddparticulars"
        v-hasPermi="['system:tourists:add']" style="margin-bottom: 20px;">新增跟进</el-button>
      <!--      <el-button type="primary" plain icon="el-icon-connections" size="mini" @click="handleAddlookhouse"-->
      <!--        v-hasPermi="['system:tourists:add']" style="margin-bottom: 20px;">新增看房</el-button>-->
      <el-button type="success" plain icon="el-icon-edit" size="mini" @click="handleUpdate(drawerdata)"
        v-hasPermi="['system:tourists:remove']">修改</el-button>
      <el-button type="primary" plain icon="el-icon-connections" size="mini" @click="handleToPrivate(drawerdata)"
                 style="margin-bottom: 20px;">转为私客</el-button>
      <el-row>
        <el-col :span="12">
          <el-descriptions direction="vertical" :column="4" border v-if="drawerdata">
            <el-descriptions-item label="委托来源">
              <dict-tag :options="dict.type.tfw_wtly"
                :value="drawerdata.source ? drawerdata.source : ''" /></el-descriptions-item>
            <el-descriptions-item label="客户类型">
              <dict-tag :options="dict.type.tfw_khlx"
                :value="drawerdata.publicAndPrivate ? drawerdata.publicAndPrivate : ''" />
            </el-descriptions-item>
            <el-descriptions-item label="客户信息" :span="3">
              <div v-for="( item, index) in customercopy" :key="index">
                <div>姓名：{{ item.name }}</div>
                <div>电话:{{ item.value }}</div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="等级">
              <dict-tag :options="dict.type.tfw_wtdj" :value="drawerdata.grade ? drawerdata.grade : ''" />
            </el-descriptions-item>
            <!-- <el-descriptions-item label="所属人id">{{ drawerdata.userId ? drawerdata.userId : "" }}</el-descriptions-item>
            <el-descriptions-item label="部门id">{{ drawerdata.deptId ? drawerdata.deptId : "" }}</el-descriptions-item> -->
            <el-descriptions-item label="房屋用途" :span="6">
              <dict-tag :options="dict.type.tfw_featured_tags"
                :value="drawerdata.purposeOfTheHouse ? drawerdata.purposeOfTheHouse : ''" />
            </el-descriptions-item>
            <el-descriptions-item label="房屋需求" :span="6">
              <div v-if="drawerdata.type == 1 || drawerdata.type == 3">
                <div>买房面积区间：{{ drawerdata.purchaseAreaMin ? drawerdata.purchaseAreaMin : "--"
                }}㎡--{{
  drawerdata.purchaseAreaMax ? drawerdata.purchaseAreaMax : "--" }}㎡</div>
                <div>买房价格区间：{{ drawerdata.purchasePriceMin ? drawerdata.purchasePriceMin : "--"
                }}万--{{
  drawerdata.purchasePriceMax ? drawerdata.purchasePriceMax : "--" }}万</div>
              </div>
              <div v-if="drawerdata.type == 2 || drawerdata.type == 3">
                <div>租房面积区间：{{ drawerdata.rentingAreaMin ? drawerdata.rentingAreaMin : "--"
                }}㎡--{{
  drawerdata.rentingAreaMax ? drawerdata.rentingAreaMax : "--" }}㎡</div>
                <div>租房价格区间：{{ drawerdata.rentingPriceMin ? drawerdata.rentingPriceMin : "--"
                }}--{{
  drawerdata.rentingPriceMax ? drawerdata.rentingPriceMax : "--" }}</div>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="需求区域" :span="6">
              {{ drawerdata.area ? drawerdata.area : ""}}
              {{ drawerdata.remarks ? drawerdata.remarks : ""}}
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="12">
          <div style=" overflow: auto; height: 700px">
            <el-timeline v-if="followList">
              <div v-for="item in followList" :key="item.fId">
                <el-timeline-item :timestamp="item.createTime ? item.createTime : '尚无跟进时间'" placement="top">
                  <el-card>
                    <h4 v-html="item.content"></h4>
                    <p>{{ item.nickName }} 提交于 {{ item.createTime ? item.createTime : '尚无跟进时间' }}</p>
                  </el-card>
                </el-timeline-item>
              </div>
            </el-timeline>
          </div>

        </el-col>
      </el-row>
    </el-drawer>
    <!-- 添加或修改客源跟进对话框 -->
    <el-dialog :title="title2" :visible.sync="open2" width="500px" append-to-body>
      <el-form ref="form2" :model="form2" label-width="80px">
        <el-form-item label="跟进内容">
          <editor v-model="form2.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="跟进类别" prop="type">
          <el-select v-model="form2.type" placeholder="请选择跟进类别" size="mini">
            <el-option v-for="    dict    in    dict.type.tfw_gjmd   " :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <image-upload v-model="form2.image" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addfollow">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改客源对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body v-if="open">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :inline="true">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardtitlw">委托信息</span>
          </div>
          <el-form-item label="需求区域" prop="area">
            <StateCityDistrictStreetSelector v-model="form.area" :ssqldList="ssqldList" :type="'id'"/>
            <div style="display: flex">
              <el-input placeholder="请输入片区备注" v-model="form.remarks" />
            </div>
          </el-form-item>
          <el-form-item label="委托来源" prop="source">
            <el-select v-model="form.source" placeholder="请选择委托来源" size="mini" style="width:150px">
              <el-option v-for="dict in dict.type.tfw_wtly" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="委托求购类型" prop="type" label-width="110px">
            <el-select v-model="form.type" placeholder="请选择求购类型" size="mini" style="width:150px">
              <el-option v-for="dict in dict.type.tfw_wtlx" :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="房屋用途" prop="purposeOfTheHouse">
            <el-select v-model="form.purposeOfTheHouse" placeholder="请选择房屋用途" size="mini" style="width:150px">
              <el-option v-for="    dict    in    dict.type.tfw_featured_tags   " :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="form.type === '1' || form.type === '3'">
            <el-form-item label="购房意向" prop="purchaseIntention">
              <el-input v-model="form.purchaseIntention" placeholder="请输入购房意向" clearable @keyup.enter.native="handleQuery"
                size="mini" />
            </el-form-item>
            <el-form-item label="购房价格最大值" prop="purchasePriceMax" label-width="110px">
              <el-input v-model="form.purchasePriceMax" placeholder="请输入购房价格最大值" clearable
                @keyup.enter.native="handleQuery" size="mini" />
            </el-form-item>
            <el-form-item label="购房价格最小值" prop="purchasePriceMin" label-width="110px">
              <el-input v-model="form.purchasePriceMin" placeholder="请输入购房价格最小值" clearable
                @keyup.enter.native="handleQuery" size="mini" />
            </el-form-item>
            <el-form-item label="购房面积最大值" prop="purchaseAreaMax" label-width="110px">
              <el-input v-model="form.purchaseAreaMax" placeholder="请输入购房面积最大值" clearable
                @keyup.enter.native="handleQuery" size="mini" />
            </el-form-item>
            <el-form-item label="购房面积最小值" prop="purchaseAreaMin" label-width="110px">
              <el-input v-model="form.purchaseAreaMin" placeholder="请输入购房面积最小值" clearable
                @keyup.enter.native="handleQuery" size="mini" />
            </el-form-item>
            <el-form-item label="购房需求户型" prop="purchaseRoom">
              <el-checkbox-group v-model="form.purchaseRoom" :max="6" size="mini">
                <el-checkbox v-for="     dict      in      dict.type.tfw_fuxing   " :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
          <div v-if="form.type === '2' || form.type === '3'">
            <el-form-item label="租房意向" prop="rentingIntention">
              <el-input v-model="form.rentingIntention" placeholder="请输入租房意向" clearable @keyup.enter.native="handleQuery"
                size="mini" />
            </el-form-item>
            <el-form-item label="租房价格最大值" prop="rentingPriceMax" label-width="110px">
              <el-input v-model="form.rentingPriceMax" placeholder="请输入租房价格最大值" clearable
                @keyup.enter.native="handleQuery" size="mini" />
            </el-form-item>
            <el-form-item label="租房价格最小值" prop="rentingPriceMin" label-width="110px">
              <el-input v-model="form.rentingPriceMin" placeholder="请输入租房价格最小值" clearable
                @keyup.enter.native="handleQuery" size="mini" />
            </el-form-item>
            <el-form-item label="租房面积最大值" prop="rentingAreaMax" label-width="110px">
              <el-input v-model="form.rentingAreaMax" placeholder="请输入租房面积最大值" clearable @keyup.enter.native="handleQuery"
                size="mini" />
            </el-form-item>
            <el-form-item label="租房价格最小值" prop="rentingAreaMin" label-width="110px">
              <el-input v-model="form.rentingAreaMin" placeholder="请输入租房价格最小值" clearable @keyup.enter.native="handleQuery"
                size="mini" />
            </el-form-item>
            <el-form-item label="租房需求户型" prop="rentingRoom">
              <el-checkbox-group v-model="form.rentingRoom" :max="6" size="mini">
                <el-checkbox v-for="     dict      in      dict.type.tfw_fuxing   " :key="dict.value" :label="dict.value">
                  {{ dict.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="cardtitlw">客户信息</span>
          </div>
          <el-form-item label="客户类型" prop="publicAndPrivate">
            <el-select v-model="form.publicAndPrivate" placeholder="请选择客户类型" size="mini" style="width:150px">
              <el-option v-for="    dict    in    dict.type.tfw_khlx   " :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="等级" prop="grade">
            <el-select v-model="form.grade" placeholder="请选择等级" size="mini" style="width:150px">
              <el-option v-for="    dict    in    dict.type.tfw_wtdj   " :key="dict.value" :label="dict.label"
                :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-button @click="addDomain" type="primary" size="mini">新增联系人</el-button>
          <br />
          <el-form-item v-for="(   domain, index   ) in    customercopy   " :label="'联系人' + (index + 1)" :key="domain.key"
            :prop="'customercopy.' + index">
            <el-form :model="domain" ref="domain">
              <el-form-item prop="type">
                <el-select v-model="domain.sex" placeholder="请选择性别" size="mini" style="width:120px;padding-right:10px ;">
                  <el-option v-for="    dict    in    dict.type.sys_user_sex   " :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="name">
                <el-input v-model="domain.name" style="width:120px;padding-right:10px ;" placeholder="请输入姓名"
                  size="mini"></el-input>
              </el-form-item>
              <el-form-item prop="value">
                <el-input v-model="domain.value" style="width:120px;padding-right:10px ;" placeholder="请输入电话"
                  size="mini"></el-input>
              </el-form-item>
              <el-button v-if="!domain.value2flag" @click.prevent="value2flag(domain)" type="danger"
                size="mini">手机号二</el-button>
              <div>
                <el-form-item prop="value" v-if="domain.value2flag">
                  <el-input v-model="domain.value2" style="width:120px;padding-right:10px ;" placeholder="请输入电话2"
                    size="mini"></el-input>
                </el-form-item>
              </div>
              <el-button @click.prevent="removeDomain(domain)" type="danger" size="mini">删除</el-button>
            </el-form>
          </el-form-item>
        </el-card>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listTourists,
  getTourists,
  delTourists,
  addTourists,
  updateTourists,
  editToPrivate
} from '@/api/source/tourists'
import { listFollow, getFollow, delFollow, addFollow, updateFollow } from "@/api/source/follow";
import { getprovincelist1, getlist } from '@/api/province.js'

export default {
  dicts: ['tfw_wtly', 'tfw_khlx', 'tfw_wtdj', 'tfw_featured_tags','tfw_property_type', 'tfw_gjmd', 'tfw_wtlx', 'sys_user_sex', 'tfw_fuxing', 'tfw_prices', 'tfw_arear'],

  name: "Tourists",
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
      // 客源表格数据
      touristsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      ssqldList: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        source: null,
        type: null,
        zone: null,
        publicAndPrivate: 1,
        customer: null,
        grade: null,
        userId: null,
        deptId: null,
        purposeOfTheHouse: null,
        remarks: null,
        createTime: null,
        createBy: null,
        updateBy: null,
        updateTime: null,
        ssqldList: [],
        purchaseRoom: null,
        sellingPrice: null,
        propertyArea: null,
        params: {
          propertyAreaMin: null,
          propertyAreaMax: null,
          sellingPriceMin: null,
          sellingPriceMax: null,
          floorMin: null,
          floorMax: null,
          sort: 0,
          floor: 0,
          person: null,
        },
      },
      customercopy: [{
        sex: '',
        value: '',
        name: '',
        value2flag: false,
        value2: ''
      }],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
      // 详情弹框
      drawer: false,
      direction: 'rtl',
      activeName: "first",
      drawerdata: null,
      followList: null,
      // 跟进弹框
      open2: false,
      title2: "",
      form2: {},
      rowuid: null,

      //多负责城市处理
      //城市查询
      regioncode: [510000, 510100],
      citiesList: [],
      cityState: true,
      zoneOptions: [],
      shelfData: null,
      userCityState: false,
      userCities: [],
      cityCode: null,
      // 日期范围
      dateRange: [],
    };
  },
  created() {
    getlist(3).then(response => {
      this.ssqldList = this.handleTree(response.data, "id", "parentId");
      this.loadZones(this.queryParams.city);
    })
    if(this.$store.state.user.userid === 1 || this.$store.state.user.userid === 116) this.cityState = false
    this.regioncode = [this.$store.state.user.provinceCode, this.$store.state.user.cityCode];
    if(this.$store.getters.userCities.length > 0) {
      this.userCityState = true;
      this.queryParams.city = this.$store.getters.userCities[0].cityId;
      this.cityCode = this.queryParams.city;
      this.userCities = this.$store.getters.userCities;
    } else {
      this.cityCode = this.$store.state.user.cityCode;
      this.queryParams.city = this.$store.state.user.cityCode;
    }
    localStorage.setItem("citycode", JSON.stringify(this.citycode));
    let monthRange = this.getMonthStartAndEnd(
      this.parseTime(new Date(), "{y}-{m}")
    );
    this.dateRange = [monthRange.startDate, monthRange.endDate];
    getlist(2).then(response => {
      const options = response.data.map(option => ({
        ...option,
        label: option.extName, // 如果 extName 不存在，则回退到 name
        value: option.id
      }));
      this.citiesList = this.handleTree(options, "id", "parentId");
    })
    this.getList();
  },
  methods: {
    // 计算两个日期差
    getDiffDay(date_1) {
      // 计算两个日期之间的差值
      let totalDays, diffDate
      let myDate_1 = Date.parse(date_1)
      let date_2 = new Date()
      let myDate_2 = Date.parse(date_2)
      // 将两个日期都转换为毫秒格式，然后做差
      diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
      totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
      return totalDays // 相差的天数
    },
    /** 根据城市加载对应区域下拉 */
    loadZones(cityId) {
      this.zoneOptions = [];
      this.queryParams.zone = null;
      if (!cityId || !this.ssqldList) return;
      const findCity = (nodes) => {
        for (const node of nodes) {
          if (String(node.id) === String(cityId)) return node.children || [];
          if (node.children && node.children.length) {
            const r = findCity(node.children);
            if (r) return r;
          }
        }
        return null;
      };
      const zones = findCity(this.ssqldList);
      this.zoneOptions = zones || [];
    },
    /** 城市查询 */
    handleChange(value) {
      let cityId;
      if(this.userCityState) {
        cityId = this.cityCode;
        this.queryParams.city = cityId;
      } else {
        cityId = value[1];
        this.queryParams.city = cityId;
      }
      this.loadZones(cityId);
    },
    //手机号2
    value2flag(e) {
      e.value2flag = true
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
    /** 查询客源列表 */
    getList() {
      this.loading = true;
      this.queryParams.params.beginTime = this.dateRange && this.dateRange[0] ? this.dateRange[0] : null;
      this.queryParams.params.endTime = this.dateRange && this.dateRange[1] ? this.dateRange[1] : null;
      listTourists(this.queryParams).then(response => {
        this.touristsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.open2 = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.customercopy = [{
        sex: '',
        value: '',
        name: '',
        value2flag: false,
        value2: ''
      }];
      this.form = {
        area:null,
        eId: null,
        source: null,
        type: null,
        publicAndPrivate: null,
        customer: null,
        grade: null,
        userId: null,
        deptId: null,
        purposeOfTheHouse: null,
        purchasePriceMax: null,
        purchasePriceMin: null,
        purchaseAreaMax: null,
        purchaseAreaMin: null,
        purchaseRoom: [],
        purchaseIntention: null,
        rentingPriceMax: null,
        rentingPriceMin: null,
        rentingAreaMax: null,
        rentingAreaMin: null,
        rentingRoom: [],
        rentingIntention: null,
        remarks: null,
        createTime: null,
        createBy: null,
        updateBy: null,
        updateTime: null,

      };
      this.form2 = {
        fId: null,
        type: null,
        content: null,
        userId: null,
        deptId: null,
        image: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        eId: null
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
      this.resetForm("queryForm");
      let monthRange = this.getMonthStartAndEnd(
        this.parseTime(new Date(), "{y}-{m}")
      );
      this.dateRange = [monthRange.startDate, monthRange.endDate];
      this.queryParams.params.sellingPriceMax = null;
      this.queryParams.params.sellingPriceMin = null;
      this.queryParams.params.propertyAreaMin = null;
      this.queryParams.params.propertyAreaMax = null;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.eId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加客源";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const eId = row.eId || this.ids
      getTourists(eId).then(response => {
        this.form = response.data;
        this.form.rentingRoom = this.form.rentingRoom.split(",");
        this.form.purchaseRoom = this.form.purchaseRoom.split(",");
        this.form.area = [this.form.province, this.form.city, this.form.zone]
        this.customercopy = JSON.parse(this.form.customer)
        this.open = true;
        this.title = "修改客源";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.form.rentingRoom = this.form.rentingRoom.join(",");
      this.form.purchaseRoom = this.form.purchaseRoom.join(",");
      this.form.customer = JSON.stringify(this.customercopy)
      if(this.form.area.length > 0) {
        this.form.province = this.form.area[0]
        this.form.city = this.form.area[1]
        this.form.zone = this.form.area[2]
        this.form.area = null
      } else {
        this.$modal.alertWarning("请填写完整省市区信息");
        return
      }
      if (this.form.eId != null) {
        updateTourists(this.form).then(response => {
          this.$modal.msgSuccess("修改成功");
          this.open = false;
          // this.handparticulars(this.form)
          listFollow({ eId: this.form.rowuid }).then(response => {
            this.followList = response.rows;
          });
          getTourists(this.form.eId).then(res => {
            this.drawerdata = res.data
            this.customercopy = JSON.parse(this.drawerdata.customer)
          })
        });
      } else {
        addTourists(this.form).then(response => {
          this.$modal.msgSuccess("新增成功");
          this.open = false;
          this.getList();
        });
      }
    },

    handleToPrivate(row) {
      console.log(row)
      this.loading = true
      editToPrivate(row.eId).then(res => {
        this.$message({
          message: res.msg,
          type: 'success'
        });
        this.loading = false;
        this.getList();
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const eIds = row.eId || this.ids;
      this.$modal.confirm('是否确认删除客源编号为"' + eIds + '"的数据项？').then(function () {
        return delTourists(eIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/tourists/export', {
        ...this.queryParams
      }, `tourists_${new Date().getTime()}.xlsx`)
    },
    // 详情按钮
    handparticulars(row) {
      this.reset();
      this.rowuid = row.eId;
      this.drawer = true
      listFollow({ eId: this.rowuid }).then(response => {
        this.followList = response.rows;
        console.log(this.followList)
      });
      getTourists(row.eId).then(res => {
        this.drawerdata = res.data
        this.customercopy = JSON.parse(this.drawerdata.customer)
      })
    },
    // 关闭详情
    handleClose(done) {
          this.getList()
      this.drawer = false

    },
    // 添加跟进
    handleAddparticulars() {
      this.open2 = true
      this.reset();
      this.form2.eId = this.rowuid
      this.title2 = "添加客源跟进";
    },
    // 新增跟进
    addfollow() {
      addFollow(this.form2).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.open2 = false;
        listFollow({ eId: this.rowuid }).then(response => {
          this.followList = response.rows;
        });
      });
    },
    //跳转
    jumpTo(phone) {

    },
    //户型取消选中
    pickHuxing(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.purchaseRoom === id) {
          this.queryParams.purchaseRoom = undefined
        }
      }
    },
    //价格取消选中
    pickPrice(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.sellingPrice === id) {
          this.queryParams.sellingPrice = undefined
        }
      }
    },
    //面积取消选中
    pickArea(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.propertyArea === id) {
          this.queryParams.propertyArea = undefined
        }
      }
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
<style scoped>
.box-card {
  margin-bottom: 20px;
}

.one {
  height: 20px;
  line-height: 20px;
  padding: 0px 10px;
  box-sizing: border-box;
  font-size: 12px;
  color: #1890ff;
  background-color: #e8f4ff;
  border-color: #d1e9ff;
  border-radius: 4px;
}

.two {
  height: 20px;
  line-height: 20px;
  padding: 0px 10px;
  box-sizing: border-box;
  font-size: 12px;
  color: #e8f4ff;
  background-color: #FF3333;
  border-color: #FF7744;
  border-radius: 4px;
}
</style>
