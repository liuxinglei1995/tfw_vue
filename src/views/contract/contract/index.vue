<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item
        label="城市选择"
        prop="xqname"
        size="mini"
        label-width="80px"
      >
        <el-select
          v-model="tCityCode"
          placeholder="请选择"
          v-if="userCityState"
          @change="handleChange"
        >
          <el-option
            v-for="item in userCities"
            :key="item.id"
            :label="item.cityName"
            :value="item.cityId"
          >
          </el-option>
        </el-select>
        <el-cascader
          v-else
          v-model="defaultCode"
          :options="citysList"
          :disabled="cityState"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="合同编号" prop="no">
        <el-input
          v-model="queryParams.no"
          placeholder="请输入合同编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="买卖双方信息" prop="trilateralInformation">
        <el-input
          v-model="queryParams.trilateralInformation"
          placeholder="请输入买卖双方信息"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="合同类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择类型"
          size="mini"
          clearable
          @change="handleQuery"
        >
          <el-option
            v-for="dict in dict.type.tfw_contract"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          ></el-option>
        </el-select>
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
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
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
          v-hasPermi="['contract:contract:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['contract:contract:edit']"
          >填写</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['contract:contract:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['contract:contract:export']"
          >导出</el-button
        >
      </el-col>
      <el-col :span="1.5" v-if="canChangeCreator">
        <el-button
          type="primary"
          plain
          icon="el-icon-user"
          size="mini"
          @click="handleChangeCreator"
          v-hasPermi="['contract:contract:edit']"
          >修改创建人</el-button
        >
      </el-col>

      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="contractList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="合同编号" align="center" prop="no" />
      <el-table-column label="合同名称" align="center" prop="title" />
      <el-table-column label="房屋信息" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.house">
            <span> {{ scope.row.house.xqname }}</span>
            <span v-if="scope.row.house.propertyType === '6'">
              {{ scope.row.house.building }}- {{ scope.row.house.floor }}-
              {{ scope.row.house.carNum }}
            </span>
            <span v-else>
              {{ scope.row.house.building }}- {{ scope.row.house.unit }}-
              {{ scope.row.house.floor }}-
              {{ scope.row.house.roomNum }}
            </span>
            <span>{{ initHouseType(scope.row.house.propertyType) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="nickName" />
      <el-table-column label="甲方姓名" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.trilateralInformation">{{
            scope.row.trilateralInformation.a_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="乙方姓名" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.trilateralInformation">{{
            scope.row.trilateralInformation.b_name
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_contract" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="成交价格(元)" align="center" prop="type">
        <template slot-scope="scope">
          <div v-if="scope.row.pricesDeals">
            <span v-if="scope.row.type === '1'"
              >{{ scope.row.pricesDeals.add_money }}
            </span>
            <span v-else-if="scope.row.type === '5'"
              >{{ scope.row.pricesDeals.money }}
            </span>
            <span v-else>{{ scope.row.pricesDeals.field104 }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createtime"
        width="180"
      >
        <template slot-scope="scope">
          <div style="display: flex;flex-direction: column;">
          <span>{{ parseTime(scope.row.createtime, "{y}-{m}-{d}") }}</span>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="queryDownload(scope.row)"
            >下载记录查询</el-button>
          </div>
          
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.edit"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['contract:contract:edit']"
            >填写</el-button
          >
          <el-button
            v-if="scope.row.editType === 0"
            size="mini"
            type="text"
            icon="el-icon-folder-checked"
            @click="overBilling(scope.row)"
            v-hasPermi="['contract:contract:edit']"
            >完成</el-button
          >
          <el-link
            v-if="scope.row.trilateralInformation"
            type="primary"
            :href="
              '/ifram?id=' +
              scope.row.id +
              '&type=' +
              scope.row.type +
              '&aname=' +
              scope.row.trilateralInformation.a_name +
              '&bname=' +
              scope.row.trilateralInformation.b_name
            "
            target="_blank"
            ><i class="el-icon-view el-icon--right"></i
            ><span style="font-size: 12px">合同预览</span></el-link
          >
          <el-button
            v-if="scope.row.type === '1' || scope.row.type === '3'"
            size="mini"
            type="text"
            icon="el-icon-notebook-2"
            @click="processRecord(scope.row)"
            >合同流程情况</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 合同模态框 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!--    添加和头对话框-->
    <el-dialog
      :title="title"
      :visible.sync="newopen"
      width="40%"
      append-to-body
    >
      <el-form
        ref="form"
        label-position="top"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item
          label="合同名称：小区名-房号 如 世纪金沙-101"
          prop="title"
        >
          <el-input v-model="form.title" placeholder="请输入合同名称" />
        </el-form-item>
        <el-form-item label="类型" prop="ifNewHouse">
          <el-select v-model="form.type" placeholder="请选择类型" size="mini">
            <el-option
              v-for="dict in dict.type.tfw_contract"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <el-input
              placeholder="请选择房屋"
              v-model="form.houseName"
              :disabled="true"
            >
            </el-input>
            <el-button
              type="primary"
              style="margin-left: 10px"
              @click="openHouses"
              >选择房屋</el-button
            >
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>

      <el-dialog
        width="80%"
        title="房屋列表"
        :visible.sync="innerVisible"
        append-to-body
      >
        <el-form
          :model="houseQueryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-width="60px"
          label-position="right"
        >
          <el-form-item
            label="小区名称"
            prop="xqname"
            size="mini"
            label-width="80px"
          >
            <el-autocomplete
              v-model="houseQueryParams.xqname"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入小区名称"
              @select="handleSelect"
              ref="autocompleteRef"
              :debounce="1500"
              size="mini"
              class="w200"
              :popper-append-to-body="false"
            >
            </el-autocomplete>
          </el-form-item>
          <el-form-item prop="building" size="mini">
            <el-input
              v-model="houseQueryParams.building"
              placeholder="栋"
              clearable
              style="width: 60px"
            />
          </el-form-item>
          <el-form-item prop="unit" size="mini">
            <el-input
              v-model="houseQueryParams.unit"
              placeholder="单元"
              clearable
              style="width: 75px"
            />
          </el-form-item>
          <el-form-item prop="floor" size="mini">
            <el-input
              v-model="houseQueryParams.floor"
              placeholder="楼层"
              clearable
              style="width: 75px"
            />
          </el-form-item>
          <el-form-item prop="roomNum" size="mini">
            <el-input
              v-model="houseQueryParams.roomNum"
              placeholder="房号"
              clearable
              style="width: 75px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleHouseQuery"
              >搜索</el-button
            >
            <el-button
              icon="el-icon-refresh"
              size="mini"
              @click="resetHouseQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
        <el-table
          size="mini"
          v-loading="loading"
          :data="fangyuanList"
          @current-change="handleCurrentChange"
          highlight-current-row
        >
          <el-table-column
            width="360px"
            label="基本信息"
            align="center"
            prop="coverfile,xqname,type,createdAt,status,id"
          >
            <template slot-scope="scope">
              <div style="display: flex; align-items: center">
                <ImagePreviewHouse
                  :coverfile="scope.row.coverfile"
                  :housephotos="scope.row.housePhotos"
                  :huxing="scope.row.loupanHuxing"
                  :height="70"
                  :width="80"
                />
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    flex: 1;
                    margin-left: 10px;
                    text-align: left;
                  "
                >
                  <div style="font-size: 14px">房源编号:{{ scope.row.id }}</div>
                  <div>
                    <sapn style="color: #ccc">小区名称:</sapn>
                    <strong>{{ scope.row.xqname }}</strong>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="户型" align="center" prop="huXTitle">
            <template slot-scope="scope">
              <div>
                {{
                  scope.row.loupanHuxing
                    ? scope.row.loupanHuxing.bedRoomNum
                    : "--"
                }}室{{
                  scope.row.loupanHuxing
                    ? scope.row.loupanHuxing.livingRoomNum
                    : "--"
                }}厅{{
                  scope.row.loupanHuxing
                    ? scope.row.loupanHuxing.bathroomNum
                    : "--"
                }}卫
              </div>
              <dict-tag
                :options="dict.type.tfw_ecommendation_level"
                :value="scope.row.grade"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="面积"
            header-align="center"
            align="center"
            prop="propertyArea"
            width="110"
          >
            <template slot-scope="scope">
              <div style="font-weight: 800">
                产权
                {{ scope.row.propertyArea ? scope.row.propertyArea : "-" }}㎡
              </div>
              <div>
                套内 {{ scope.row.usableArea ? scope.row.usableArea : "-" }}㎡
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="floor,totalFloor"
            header-align="center"
            align="center"
            label="楼层/总高"
          >
            <template slot-scope="scope">
              <div style="display: flex; flex-direction: column">
                <div>
                  {{ scope.row.floor }}
                  <span>/</span>
                  {{ scope.row.totalFloor }}F
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="building,unit,floor,roomNum,houseFollow"
            header-align="center"
            align="center"
            label="栋/单元/层/号"
            width="150"
          >
            <template slot-scope="scope">
              <div
                style="display: flex; justify-content: center"
                v-if="scope.row.propertyType === 6"
              >
                <div>{{ scope.row.building }}</div>
                <span>-</span>
                <div v-if="scope.row.floor > 0">{{ scope.row.floor }}</div>
                <div
                  v-if="scope.row.floor < 0"
                  style="font-weight: 700; font-size: 16px"
                >
                  {{ scope.row.floor }}
                </div>
                <span>-</span>
                <div v-if="scope.row.ifUpdate">{{ scope.row.carNum }}</div>
              </div>
              <div style="display: flex; justify-content: center" v-else>
                <div>{{ scope.row.building }}</div>
                <span>-</span>
                <div v-if="scope.row.ifUpdate">
                  {{ scope.row.unit }}
                </div>
                <div v-else>*</div>
                <span>-</span>
                <div v-if="scope.row.floor > 0">{{ scope.row.floor }}</div>
                <div
                  v-if="scope.row.floor < 0"
                  style="font-weight: 700; font-size: 16px"
                >
                  {{ scope.row.floor }}
                </div>
                <span>-</span>
                <div v-if="scope.row.ifUpdate">
                  {{ scope.row.roomNum }}
                </div>
                <div v-else>*</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="总价"
            header-align="center"
            align="center"
            prop="sellingPrice,propertyArea"
            width="180px"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.type == 1 || scope.row.type == 3">
                <span class="span1"
                  >{{
                    scope.row.sellingPrice ? scope.row.sellingPrice : "-"
                  }}万</span
                >
                <br />
                <span>
                  {{
                    scope.row.sellingPrice && scope.row.propertyArea
                      ? Math.round(
                          (scope.row.sellingPrice * 10000) /
                            scope.row.propertyArea
                        )
                      : "-"
                  }}元/㎡
                </span>
              </div>
              <div v-if="scope.row.type == 2 || scope.row.type == 3">
                <span class="span1"> {{ scope.row.rental }}元/月 </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="decoration"
            header-align="center"
            align="center"
            label="房屋类型"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.tfw_property_type"
                :value="scope.row.propertyType"
              />
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="houseQueryParams.total > 0"
          :total="houseQueryParams.total"
          :page.sync="houseQueryParams.pageNum"
          :limit.sync="houseQueryParams.pageSize"
          @pagination="getFangyuanList"
        />
        <div>
          <el-button @click="saveHouse">确定</el-button>
          <el-button @click="innerVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <!-- 修改合同对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="90%"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="三方信息" name="first">
            <trilateralInformation
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>

          <el-tab-pane
            label="房屋信息"
            name="second"
            v-if="form.type === '1' || form.type === '5'"
          >
            <contractedithouse
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>
          <el-tab-pane
            label="价格&成交"
            name="third"
            v-if="form.type === '1' || form.type === '5'"
          >
            <contracteditprice
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>
          <el-tab-pane
            label="其他"
            name="fourth"
            v-if="form.type === '1' || form.type === '5'"
          >
            <contracteditother
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>

          <!-- 租房 -->
          <el-tab-pane
            label="房屋信息"
            name="five"
            v-if="form.type === '2' || form.type === '6'"
          >
            <saleinformation
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>
          <el-tab-pane
            label="价格&成交"
            name="six"
            v-if="form.type === '2' || form.type === '6'"
          >
            <rentprice
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            ></rentprice>
          </el-tab-pane>
          <el-tab-pane
            label="其他"
            name="seven"
            v-if="form.type === '2' || form.type === '6'"
          >
            <rentalother
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            ></rentalother>
          </el-tab-pane>

          <!-- 车位买卖 -->
          <el-tab-pane label="车位信息" name="eight" v-if="form.type === '3'">
            <carparkinginformation
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>
          <el-tab-pane label="车位价格" name="nine" v-if="form.type === '3'">
            <carparkingfee
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>
          <el-tab-pane label="其他" name="ten" v-if="form.type === '3'">
            <carparksother
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            >
            </carparksother>
          </el-tab-pane>

          <!-- 车位租赁 -->
          <el-tab-pane label="车位信息" name="eight" v-if="form.type === '4'">
            <carInformation
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>
          <el-tab-pane label="车位价格" name="nine" v-if="form.type === '4'">
            <carparkrentalprice
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            />
          </el-tab-pane>
          <el-tab-pane label="其他" name="ten" v-if="form.type === '4'">
            <carparkother
              @flag="closeMain"
              :id="contractid"
              :submitFormFlag="submitFormFlag"
              :data="form"
            >
            </carparkother>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormAll"
          >提交全部信息</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 展示合同下载人员列表 -->
    <el-dialog
      title="合同下载人员"
      :visible.sync="downloadShow"
      width="50%"
      style="height: 95%"
    >
      <el-table ref="multipleTable" v-loading="loading" :data="downloadList">
        <el-table-column
          label="下载人"
          prop="userName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="下载时间"
          prop="downloadTime"
          :show-overflow-tooltip="true"
        />
      </el-table>
      <pagination
        v-show="downloadParams.total > 0"
        :total="downloadParams.total"
        :page.sync="downloadParams.pageNum"
        :limit.sync="downloadParams.pageSize"
        @pagination="getDownloadList"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="downloadShow = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 展示合同流程情况 -->

    <el-dialog
      title="合同流程"
      :visible.sync="processShow"
      width="50%"
      style="height: 95%"
    >
      <procedure
        @flag="closeMain2"
        :id="contract.id"
        :data="contract"
        :dialogFlag="processShow"
      ></procedure>
    </el-dialog>
    <!-- 修改创建人对话框 -->
    <el-dialog title="修改创建人" :visible.sync="changeCreatorOpen" width="500px" append-to-body>
      <el-form label-width="100px">
        <el-form-item label="当前创建人">
          <span>{{ selectedRow ? selectedRow.nickName : '' }}</span>
        </el-form-item>
        <el-form-item label="新的创建人">
          <el-select
            v-model="newCreatorId"
            placeholder="请输入姓名搜索"
            filterable
            remote
            :remote-method="queryCreatorUser"
            style="width: 100%"
          >
            <el-option
              v-for="item in creatorUserList"
              :key="item.userId"
              :label="item.nickName + ' (' + item.phonenumber + ')'"
              :value="item.userId"
            >
              <span>{{ item.nickName }}</span>
              <span style="float: right; color: #8492a6; font-size: 12px">{{
                item.dept ? item.dept.deptName : ''
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitChangeCreator">确 定</el-button>
        <el-button @click="changeCreatorOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import trilateralInformation from "./trilateralInformation";
import contractedithouse from "../housesale/contractedithouse";
import contracteditprice from "../housesale/contracteditprice";
import contracteditother from "../housesale/contracteditother";
import saleinformation from "../rentalhousing/saleinformation";
import rentprice from "../rentalhousing/rentprice";
import rentalother from "../rentalhousing/rentalother";
import carparkinginformation from "../unloadingpoint/carparkinginformation";
import carparkingfee from "../unloadingpoint/carparkingfee";
import carparksother from "../unloadingpoint/carparksother";
import carInformation from "../carparkrental/carInformation";
import carparkother from "../carparkrental/carparkother";
import carparkrentalprice from "../carparkrental/carparkrentalprice";

import {
  listContract,
  getContract,
  delContract,
  addContract,
  changeContractCreator,
  checkContractCreatorSuperior
} from "@/api/contract/contract";
import { listUserByDeptAndChild } from "@/api/system/user";
import { listContractDownload } from "@/api/contract/contractDownload";
import { fuzzyqueries, listFangyuan } from "@/api/fangyuan/fangyuan";
import ImagePreviewHouse from "@/views/fangyuan/ImagePreviewHouse/index.vue";
import {
  initHouseType,
  initNumber,
  isTimeExceeded,
} from "@/utils/activiti/myUtil";
import { addUserBilling } from "@/api/contract/billingUser";
import {
  listContractProcess,
  addContractProcess,
  updateContractProcess,
} from "@/api/contract/contractProcess";
import { getlist } from "@/api/province";
import procedure from "@/views/contract/procedure/index.vue";

function changeFrameHeight() {
  var iframe = document.getElementById("iframe");
  iframe.height = document.documentElement.clientHeight;
}
//onresize属性可以用来获取或设置当前窗口的resize事件的事件处理函数
//onresize事件会在窗口或框架被调整大小时发生
window.onresize = function () {
  changeFrameHeight();
};
export default {
  dicts: [
    "tfw_contract",
    "tfw_ecommendation_level",
    "tfw_property_type",
    "tfw_state",
    "contract_process",
  ],
  components: {
    procedure,
    ImagePreviewHouse,
    trilateralInformation,
    contractedithouse,
    contracteditprice,
    contracteditother,
    saleinformation,
    rentprice,
    rentalother,
    carparkinginformation,
    carparkingfee,
    carparksother,
    carInformation,
    carparkother,
    carparkrentalprice,
  },
  name: "Contract",
  data() {
    return {
      //编辑天数
      centerDialogVisible: false,
      // 合同预览id
      contractPreviewid: null,
      submitFormFlag: false,
      // 添加合同
      newopen: false,
      // 合同id
      contractid: null,
      activeName: "first",
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 选中的合同行
      selectedRow: null,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 修改创建人弹窗
      changeCreatorOpen: false,
      newCreatorId: null,
      creatorUserList: [],
      // 是否显示修改创建人按钮
      canChangeCreator: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 合同表格数据
      contractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        cityCode: null,
        pageNum: 1,
        pageSize: 10,
        userId: null,
        no: null,
        title: null,
        company: null,
        type: null,
        partyAStatus: null,
        partyBStatus: null,
        trilateralInformation: null,
        houseInformation: null,
        otherInformation: null,
        pricesDeals: null,
        createtime: null,
        beginTime: null,
        endTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      downloadShow: false,
      downloadList: [],
      downloadParams: {
        total: undefined,
        pageNum: undefined,
        pageSize: 10,
      },
      innerVisible: false, //内层弹框
      //房屋查询
      houseQueryParams: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      xqFrom: {
        xqId: "",
        xqname: "",
      },
      fangyuanList: null,
      pitchHouse: null,
      //用户id
      userId: null,
      //合同流程
      processShow: false,
      contract: {},

      //城市选择
      //地区选择相关
      cityState: true,
      citysList: [],
      defaultCode: [510000, 510100],
      tCityCode: "510100",
      areaList: [],
      //多负责城市处理
      userCityState: false,
      userCities: [],
    };
  },
  created() {
    if (
      this.$store.state.user.userid === 1 ||
      this.$store.state.user.userid === 116
    )
      this.cityState = false;
    this.userId = this.$store.state.user.userid;
    this.defaultCode = [
      this.$store.state.user.provinceCode,
      this.$store.state.user.cityCode,
    ];
    if (this.$store.getters.userCities.length > 0) {
      this.userCityState = true;
      this.queryParams.cityCode = this.$store.getters.userCities[0].cityId;
      this.tCityCode = this.queryParams.cityCode;
      this.userCities = this.$store.getters.userCities;
    } else {
      this.tCityCode = this.$store.state.user.cityCode;
      this.queryParams.cityCode = this.$store.state.user.cityCode;
    }
    getlist(2).then((response) => {
      const options = response.data.map((option) => ({
        ...option,
        label: option.extName, // 如果 extName 不存在，则回退到 name
        value: option.id,
      }));
      this.citysList = this.handleTree(options, "id", "parentId");
    });
    let monthRange = this.getMonthStartAndEnd(
      this.parseTime(new Date(), "{y}-{m}")
    );
    this.dateRange = [monthRange.startDate, monthRange.endDate];
    this.queryParams.beginTime = this.dateRange[0];
    this.queryParams.endTime = this.dateRange[1];
    if (this.userId !== 1 && this.userId !== 116)
      this.queryParams.userId = this.userId;
    this.getConfigKey("contract_edit_data").then((response) => {
      this.contractEditData = initNumber(response.msg);
      this.getList();
    });
  },
  methods: {
    initHouseType,
    isTimeExceeded,
    // 提交全部信息
    submitFormAll() {
      this.submitFormFlag = true;
    },
    closeMain(val) {
      this.submitFormFlag = val;
    },
    handleChange(value) {
      this.queryParams.areaCode = null;
      if (this.userCityState) {
        this.queryParams.cityCode = this.tCityCode;
      } else {
        this.tCityCode = value[1];
        this.queryParams.cityCode = value[1];
      }
      this.getList();
    },
    /** 查询合同列表 */
    getList() {
      let that = this;
      let editData = that.contractEditData;
      that.loading = true;
      that.queryParams.state = 1;
      that.queryParams.roleQuery = 1;
      listContract(that.queryParams).then((response) => {
        that.contractList = response.rows;
        that.contractList.forEach(function (item, index) {
          if (item.pricesDeals) {
            item.pricesDeals = JSON.parse(item.pricesDeals);
          }
          if (item.trilateralInformation) {
            item.trilateralInformation = JSON.parse(item.trilateralInformation);
          } else {
            item.trilateralInformation = null;
          }
          //判断创建时间在指定天数内可编辑
          item.edit = isTimeExceeded(item.createtime, editData);
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
      this.getList();
      this.newopen = false;
    },
    // 表单重置
    reset() {
      this.form = {
        cityCode: this.tCityCode,
        id: null,
        no: null,
        title: null,
        company: null,
        partyAStatus: null,
        partyBStatus: null,
        trilateralInformation: null,
        houseInformation: null,
        otherInformation: null,
        pricesDeals: null,
        createtime: null,
        type: null,
        params: { id: 30 },
      };
      this.resetForm("form");
      this.activeName = "first";
    },
    handleClick(tab, event) {
      // taps 事件
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
      let monthRange = this.getMonthStartAndEnd(
        this.parseTime(new Date(), "{y}-{m}")
      );
      this.dateRange = [monthRange.startDate, monthRange.endDate];
      this.queryParams.beginTime = this.dateRange[0];
      this.queryParams.endTime = this.dateRange[1];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
      this.selectedRow = selection.length === 1 ? selection[0] : null;
      this.canChangeCreator = false;
      // 只有选中一行时，调用后端判断是否为创建人的上级
      if (selection.length === 1) {
        this.checkSuperior(selection[0].id);
      }
    },
    // 调用后端判断是否为创建人的上级
    checkSuperior(contractId) {
      checkContractCreatorSuperior(contractId).then((response) => {
        this.canChangeCreator = response.code === 200 && response.data === true;
      }).catch(() => {
        this.canChangeCreator = false;
      });
    },
    // 打开修改创建人弹窗
    handleChangeCreator() {
      if (!this.canChangeCreator) {
        this.$modal.msgWarning("只有创建人的上级才能修改创建人");
        return;
      }
      this.changeCreatorOpen = true;
      this.newCreatorId = null;
      this.creatorUserList = [];
    },
    // 搜索目标创建人（当前登录用户子部门用户）
    queryCreatorUser(query) {
      if (query !== '') {
        listUserByDeptAndChild({ pageNum: 1, pageSize: 20, nickName: query }).then((response) => {
          this.creatorUserList = response.rows;
        });
      }
    },
    // 提交修改创建人
    submitChangeCreator() {
      if (!this.newCreatorId) {
        this.$modal.msgWarning("请选择新的创建人");
        return;
      }
      const data = { contractId: this.selectedRow.id, newUserId: this.newCreatorId };
      this.$modal.confirm('确定将该合同的创建人修改为所选用户？').then(() => {
        return changeContractCreator(data);
      }).then(() => {
        this.$modal.msgSuccess("修改成功");
        this.changeCreatorOpen = false;
        this.getList();
      }).catch(() => {});
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.newopen = true;
      this.loading = false;
      this.title = "新增合同";
    },
    submitForm() {
      console.log(this.form);
       this.loading = true;
       this.$refs["form"].validate((valid) => {
        if (valid) {
          if(this.form.title == null || this.form.title.trim() === ""){
            this.$modal.msgError("请输入合同名称");
            this.loading = false;
            return false;
          }
          if(this.form.type == null){
            this.$modal.msgError("请选择合同类型");
            this.loading = false;
            return false;
          }
          addContract(this.form).then(() => {
            this.open = false;
            this.newopen = false;
            this.getList();
            this.$modal.msgSuccess("添加成功");
          }).catch(() => {
            his.$modal.msgError("添加失败");
            this.loading = false;
          });
          
        } else {
          return false;
        }
      });
    },
    // 合同预览
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.contractid = row.id || this.ids[0];
      const id = row.id || this.ids[0];
      getContract(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改合同";
      });
    },
 /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.contractid = row.id || this.ids[0];
      const id = row.id || this.ids[0];
      getContract(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改合同";
      });
    },
    /** 完成按钮 */
    overBilling(contract) {
      let billingUser = {
        userId: contract.userId,
        contractId: contract.id,
        billing: 1,
      };
      addUserBilling(billingUser).then(() => {
        this.$modal.msgSuccess("操作成功");
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除合同编号为"' + ids + '"的数据项？')
        .then(function () {
          return delContract(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "contract/contract/export",
        {
          ...this.queryParams,
        },
        `contract_${new Date().getTime()}.xlsx`
      );
    },
    //合同下载记录
    queryDownload(row) {
      this.downloadParams.contractId = row.id;
      this.getDownloadList();
      this.downloadShow = true;
    },
    getDownloadList() {
      this.loading = true;
      listContractDownload(this.downloadParams).then((res) => {
        this.downloadList = res.rows;
        this.downloadParams.total = res.total;
        this.loading = false;
      });
    },

    openHouses() {
      this.innerVisible = true;
      this.getFangyuanList();
    },
    getFangyuanList() {
      this.loading = true;
      listFangyuan(this.houseQueryParams).then((response) => {
        this.fangyuanList = response.rows;
        this.houseQueryParams.total = response.total;
        this.loading = false;
      });
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
        );
      };
    },
    querySearchAsync(queryString, cb) {
      if (queryString) {
        fuzzyqueries(queryString).then((response) => {
          this.restaurants = response.rows;
          var restaurants = this.restaurants.map((terminal) => {
            return {
              value: terminal.title,
              name: terminal.id,
            };
          });
          var results = queryString
            ? restaurants.filter(this.createStateFilter(queryString))
            : restaurants;
          cb(results);
        });
      }
    },
    handleSelect(item) {
      this.xqFrom.xqId = item.name;
      this.xqFrom.xqname = item.value;
    },
    handleCurrentChange(val) {
      this.pitchHouse = val;
    },
    //房号查询
    handleHouseQuery() {
      this.getFangyuanList();
    },
    resetHouseQuery() {
      this.houseQueryParams = {};
      this.getFangyuanList();
    },
    saveHouse() {
      this.innerVisible = false;
      this.form.houseId = this.pitchHouse.id;
      this.form.houseName = this.pitchHouse.xqname;
      if (this.pitchHouse.propertyType === "6") {
        this.form.houseName +=
          " " +
          this.pitchHouse.building +
          "-" +
          this.pitchHouse.floor +
          "-" +
          this.pitchHouse.carNum;
      } else {
        this.form.houseName +=
          " " +
          this.pitchHouse.building +
          "-" +
          this.pitchHouse.unit +
          "-" +
          this.pitchHouse.floor +
          "-" +
          this.pitchHouse.roomNum;
      }
      this.form.houseName +=
        " (" + initHouseType(this.pitchHouse.propertyType) + ")";
    },
    //合同流程记录
    processRecord(row) {
      this.contract = row;
      this.processShow = true;
    },
    closeMain2(val) {
      this.processShow = val;
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
  },
};
</script>
<style scoped>
.custom-div {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
