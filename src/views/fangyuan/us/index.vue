<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="60px" label-position="right">
      <el-form-item label="小区名称" prop="xqname" size="mini" label-width="80px">
        <el-autocomplete v-model="queryParams.xqname" :fetch-suggestions="querySearchAsync" placeholder="请输入小区名称"
          @select="handleSelect" ref="autocompleteRef" :debounce=1500 size="mini" class="w200"
          :popper-append-to-body="false">
        </el-autocomplete>
      </el-form-item>
      <el-form-item prop="building" size="mini">
        <el-input v-model="queryParams.building" placeholder="栋" clearable style="width:60px" />
      </el-form-item>
      <el-form-item prop="unit" size="mini">
        <el-input v-model="queryParams.unit" placeholder="单元" clearable style="width:75px" />
      </el-form-item>
      <el-form-item prop="floor" size="mini">
        <el-input v-model="queryParams.floor" placeholder="楼层" clearable style="width:75px" />
      </el-form-item>
      <el-form-item prop="roomNum" size="mini">
        <el-input v-model="queryParams.roomNum" placeholder="房号" clearable style="width:75px" />
      </el-form-item>
      <el-form-item label="编号/手机号/业主姓名" prop="idPhoneName" size="mini" label-width="150px">
        <el-input v-model="queryParams.idPhoneName" placeholder="请输入信息" clearable style="width:170px" />
      </el-form-item>
      <el-row>
        <el-form-item label="是否新房" prop="ifNewHouse" size="mini" label-width="80px">
          <el-select v-model="queryParams.ifNewHouse" clearable placeholder="请选择" style="width:120px">
            <el-option v-for=" dict in dict.type.tfw_new_old" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房源状态" prop="state" size="mini" label-width="80px">
          <el-select v-model="queryParams.state" placeholder="请选择房源状态" style="width:130px">
            <el-option v-for="  dict   in   dict.type.tfw_state_2  " :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="装修" prop="state" size="mini" label-width="80px">
          <el-select v-model="queryParams.decorationIds" multiple placeholder="请选择装修情况" >
            <el-option v-for="dict in dict.type.tfw_decoration_situation"
                       :key="dict.value" :label="dict.label" :value="parseInt(dict.value)">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="上架状态" prop="lift" label-width="80px">
          <el-radio-group v-model="queryParams.statusList" size="mini">
            <el-radio-button v-for="dict in statusList" :key="dict.value" :label="dict.value"
                             size="medium">{{ dict.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <!-- <el-form-item label="未跟进天数" prop="roomNum" size="mini" label-width="90px">
        <el-input placeholder="请输入天数" clearable style="width:120px" />
      </el-form-item> -->
      <!-- <el-form-item label="地铁房" prop="roomNum" size="mini">
        <el-input v-model="queryParams.roomNum" placeholder="地铁线路" clearable style="width:120px" />
      </el-form-item> -->
      <div class="row" style="justify-content: start;">
        <div style="display: flex;align-items: center;margin-right: 10px;">
          <div class="name">梯步: </div>
          <div class="content">
            <el-form-item prop="lift" style="margin-bottom: 0px;">
              <el-radio-group v-model="queryParams.lift" size="mini">
                <el-radio-button v-for="dict in dict.type.tfw_elevator_situation" :key="dict.value" :label="dict.value"
                  size="medium" @click.native="pickLift($event)">{{ dict.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex;align-items: center;">
          <div class="name">租售类型：</div>
          <div class="content">
            <el-form-item prop="type" style="margin-bottom: 0px;">
              <el-radio-group v-model="queryParams.type" size="mini">
                <el-radio-button v-for="dict in tfw_rent_sale" :key="dict.value" :label="dict.value" size="medium">{{
      dict.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex;align-items: center;margin-left: 10px;">
          <div class="name">户型: </div>
          <div class="content">
            <el-form-item prop="huxingId" style="margin-bottom: 0px;">
              <el-radio-group v-model="queryParams.huxingId" size="mini">
                <el-radio-button v-for="dict in dict.type.tfw_fuxing" :key="dict.value" :label="dict.value"
                  size="medium" @click.native="pickHuxing($event)">{{ dict.label }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="name">楼层: </div>
        <div class="content">
          <el-form-item prop="params.floor" style="margin-bottom: 0px;">
            <el-input v-model="queryParams.params.floorMin" placeholder="请输入最小值" clearable style="width:120px;"
              size="mini" />
            <i class="el-icon-minus"></i>
            <el-input v-model="queryParams.params.floorMax" placeholder="请输入最大值" clearable
              style="width:120px;margin-right: 30px;" size="mini" />
            <el-radio-group v-model="queryParams.params.floor" size="mini">
              <el-radio-button label="1" @click.native="pickFloor($event)">楼层从低到高</el-radio-button>
              <el-radio-button label="2" @click.native="pickFloor($event)">楼层从高到低</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
      <div class="row">
        <div class="name">面积: </div>
        <div class="content">
          <el-form-item prop="propertyArea" style="margin-bottom: 0px;">
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
        </div>
      </div>
      <div class="row">
        <div class="name">价格: </div>
        <div class="content">
          <el-form-item prop="sellingPrice" style="margin-bottom: 0px;">
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
            <el-radio v-model="queryParams.params.sort" label="1" border @click.native="pickSort($event)">售价从低到高</el-radio>
            <el-radio v-model="queryParams.params.sort" label="2" border @click.native="pickSort($event)">售价从高到低</el-radio>
          </el-form-item>
        </div>
      </div>
      <div class="row">
        <div class="name">物业类型： </div>
        <div class="content">
          <el-form-item prop="propertyType" style="margin-bottom: 0px;">
            <el-radio-group v-model="queryParams.propertyType" size="mini">
              <el-radio v-for="dict in dict.type.tfw_property_type" :key="dict.value" :label="dict.value"
                size="medium" @click.native="pickProperty($event)">{{ dict.label }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <!-- 增删改导出 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:house:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:house:edit']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:house:remove']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:house:export']">导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="userhouse"
          v-hasPermi="['tfw:house:user']">房源转移
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery()">重置</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-switch v-model="detailsflag" active-text="展示房源信息" inactive-text="隐藏房源信息">
        </el-switch>
      </el-col>
    </el-row>
    <!-- 显示列表 -->
    <el-table size="mini" v-loading="loading" :data="fangyuanList" @selection-change="handleSelectionChange"
      @row-click="handlerowlist">
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column width="360px" label="基本信息" align="center" prop="coverfile,xqname,type,createdAt,status,id">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center">
            <ImagePreviewHouse :coverfile="scope.row.coverfile" :housephotos="scope.row.housePhotos"
              :huxing="scope.row.loupanHuxing" :height="70" :width="80" />
            <!-- <imagePreviewindex :src="scope.row.coverfile" :width="80" :height="70" :text="scope.row.housePhotos" /> -->
            <!-- <el-image
              :preview-src-list="scope.row.housePhotos"
              :src="'https://static.tianfucd.com/' + scope.row.coverfile"></el-image> -->
            <div
              style="display: flex;flex-direction: column;justify-content: space-around;flex: 1;margin-left: 10px;text-align: left">
              <div style="font-size:14px;">房源编号:{{ scope.row.id }}</div>
              <span>已录入 {{ getDiffDay(scope.row.createdAt) }}天</span>
              <div>
                <sapn style="color: #ccc;">小区名称:</sapn> <strong>{{ scope.row.xqname }}</strong>
              </div>
              <div style="display: flex;flex-wrap: wrap">
                <div :class="[scope.row.type == 1 ? 'one' : 'two', scope.row.type == 3 ? 'three' : '']">
                  <dict-tag :options="dict.type.tfw_rent_sale" :value="scope.row.type" />
                </div>
                <div class="jbxx">
                  {{ getfivenear(scope.row.titleDeedDate) }}
                </div>
                <div class="jbxx">
                  <dict-tag :options="dict.type.tfw_status" :value="scope.row.status" />
                </div>
                <div class="jbxx">
                  <dict-tag :options="dict.type.tfw_state" :value="scope.row.state" />
                </div>
                <div class="jbxx" v-if="scope.row.titleDeeds">
                  <div>已上传产权证</div>
                </div>
                <div class="jbxx" v-else style="background-color:#ffeded;color: #ff9292">
                  <div>未上传产权证</div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="户型" align="center" prop="huXTitle">
        <template slot-scope="scope">
          <div>
            {{ scope.row.loupanHuxing ? scope.row.loupanHuxing.bedRoomNum : "--" }}室{{
      scope.row.loupanHuxing ? scope.row.loupanHuxing.livingRoomNum : '--'
    }}厅{{
        scope.row.loupanHuxing ? scope.row.loupanHuxing.bathroomNum : '--'
      }}卫
          </div>
          <dict-tag :options="dict.type.tfw_ecommendation_level" :value="scope.row.grade" />
        </template>
      </el-table-column>
      <el-table-column label="面积" header-align="center" align="center" prop="propertyArea" width="110">
        <template slot-scope="scope">
          <div style="font-weight: 800;">
            产权 {{ scope.row.propertyArea ? scope.row.propertyArea : "-" }}㎡
          </div>
          <div>
            套内 {{ scope.row.usableArea ? scope.row.usableArea : "-" }}㎡
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="floor,totalFloor" header-align="center" align="center" label="楼层/总高">
        <template slot-scope="scope">
          <div style="display: flex; flex-direction: column;">
            <div>
              {{ scope.row.floor }}
              <span>/</span>
              {{ scope.row.totalFloor }}F
            </div>
            <el-button size="mini" type="text" icon="el-icon-price-tag"
              @click.stop="looksellingPrice(scope.row.id)">调价记录
            </el-button>
          </div>
        </template>
      </el-table-column>

      <!--      这里有个自适应-->
      <!--      <el-table-column label="小区名称" align="center" prop="xqname" :width="flexColumnWidth('单位', 'xqname')" />-->
      <el-table-column prop="building,unit,floor,roomNum,houseFollow" header-align="center" align="center"
        label="栋/单元/层/号" width="150">
        <template slot-scope="scope">
          <div v-if="detailsflag">
            <div style="display:flex; justify-content: center;" v-if="scope.row.propertyType == 6">
              <div>{{ scope.row.building }}</div>
              <span>-</span>
              <div v-if="scope.row.floor > 0"> {{ scope.row.floor }}</div>
              <div v-if="scope.row.floor < 0" style="font-weight:700;font-size:16px"> {{ scope.row.floor }}</div>
              <span>-</span>
              <div v-if="scope.row.ifUpdate">{{ scope.row.carNum }}</div>
            </div>
            <div style="display:flex; justify-content: center;" v-else>
              <div>{{ scope.row.building }}</div>
              <span>-</span>
              <div v-if="scope.row.ifUpdate">
                {{ scope.row.unit }}
              </div>
              <div v-else>
                *
              </div>
              <span>-</span>
              <div v-if="scope.row.floor > 0"> {{ scope.row.floor }}</div>
              <div v-if="scope.row.floor < 0" style="font-weight:700;font-size:16px"> {{ scope.row.floor }}</div>
              <span>-</span>
              <div v-if="scope.row.ifUpdate">
                {{ scope.row.roomNum }}
              </div>
              <div v-else>
                *
              </div>
            </div>
          </div>
          <div v-else>
            * - * - * - *
          </div>
          <div style="color:#FF7200;margin-bottom:5px">{{ scope.row.houseFollow ?
      getDiffDay(scope.row.houseFollow.createdAt) + "天未跟进" : "暂无跟进" }}</div>
        </template>
      </el-table-column>

      <el-table-column label="总价" header-align="center" align="center" prop="sellingPrice,propertyArea" width="180px">
        <template slot-scope="scope">

          <div v-if="scope.row.tfwHousePrice">
            <div class="d1" v-if="scope.row.tfwHousePrice.type == 1">
              <sapn class="d2">涨价</sapn>{{ scope.row.tfwHousePrice ? scope.row.tfwHousePrice.reason : "--" }}万
            </div>
            <div class="d3" v-if="scope.row.tfwHousePrice.type == 2">
              <sapn class="d4">降价</sapn>{{ scope.row.tfwHousePrice ? scope.row.tfwHousePrice.reason : "--" }}万
            </div>
          </div>
          <div v-if="scope.row.type == 1 || scope.row.type == 3">
            <span class="span1">{{ scope.row.sellingPrice ? scope.row.sellingPrice : "-" }}万</span>
            <br />
            <span>
              {{ scope.row.sellingPrice && scope.row.propertyArea ?
      Math.round(scope.row.sellingPrice * 10000 / scope.row.propertyArea) : "-" }}元/㎡
            </span>
          </div>
          <div v-if="scope.row.type == 2 || scope.row.type == 3">
            <span class="span1">
              {{ scope.row.rental }}元/月
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="维护人" align="center" prop="nickName">
        <template slot-scope="scope">
          <div>
            {{ scope.row.sysUser.nickName ? scope.row.sysUser.nickName : "--" }}
          </div>
          <div v-if="scope.row.status == 2">
            已上架: {{ scope.row.groundingTime ? getDiffDay(scope.row.groundingTime) : "--" }}天
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="decoration" header-align="center" align="center" label="装修情况">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_decoration_situation" :value="scope.row.decoration" />
        </template>
      </el-table-column>
      <el-table-column prop="decoration" header-align="center" align="center" label="房屋类型">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_property_type" :value="scope.row.propertyType" />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click.stop="handleUpdate(scope.row)"
            v-hasPermi="['system:house:edit']" v-if="scope.row.ifUpdate">修改
          </el-button>

          <el-button size="mini" type="text" icon="el-icon-position" @click.stop="handlegenjin(scope.row)"
            v-hasPermi="['system:follow:query']">跟进
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-price-tag" v-hasPermi="['system:house:edit']"
            @click.stop="handlerowlist(scope.row)">详情
          </el-button>
          <el-link @click.stop.native :underline="false" v-hasPermi="['system:house:edit']" size="mini"
            icon="el-icon-price-tag" :href="'/poster?id=' + scope.row.id + '&type=' + scope.row.type" target="_blank"
            type="primary">水牌</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />

    <!-- 添加房源对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body :close-on-click-modal="false"
      :show-close="false" :close-on-press-escape="false" v-if="open">
      <el-form ref="form" :model="form" label-width="80px" :inline="true" :rules="rules">
        <el-col :span="24">
          <el-form-item label="小区名称" prop="xqname">
            <el-select
              v-model="form.xqname"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              @change="handleSelect"
              :loading="xqLoading">
              <el-option
                v-for="item in xqList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-edit" v-if="isShowmessage" @click="goadd" size="mini">没有小区去添加
            </el-button>
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="form.title" placeholder="请输入标题" size="mini" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div>
            例如 1栋 1单元 1层 1号
          </div>
          <el-form-item prop="building">
            <el-input v-model="form.building" placeholder="请输入几栋" size="mini" style="width:150px">
              <template slot="append">栋</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="unit" v-if="form.propertyType != 6">
            <el-input v-model="form.unit" placeholder="请输入位于几单元" size="mini" style="width:200px">
              <template slot="append">单元</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="floor">
            <el-input v-model="form.floor" placeholder="请输入第几层" size="mini" style="width:160px">
              <template slot="append">层</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="roomNum" v-if="form.propertyType != 6">
            <el-input v-model="form.roomNum" placeholder="请输入房号" size="mini" style="width:150px">
              <template slot="append">号</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="carNum" v-if="form.propertyType == 6">
            <el-input v-model="form.carNum" placeholder="请输入车位号" size="mini" style="width:170px">
              <template slot="append">号</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-button @click="addDomain" type="primary" size="mini">新增业主</el-button>
          <br />
          <el-form-item v-for="(   domain, index   ) in    phoneNumbercopy   " :label="'业主' + (index + 1)"
            :key="domain.key">
            <el-form :model="domain" :rules=rules.phoneNumber ref="domain">
              <el-form-item prop="type">
                <el-select v-model="domain.type" placeholder="请选择关系" size="mini"
                  style="width:150px;padding-right:10px ;">
                  <el-option v-for="    dict    in    dict.type.tfw_yzgx   " :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="name">
                <el-input v-model="domain.name" style="width:150px;padding-right:10px ;" placeholder="请输入姓名"
                  size="mini"></el-input>
              </el-form-item>
              <el-form-item prop="value">
                <el-input v-model="domain.value" style="width:150px;padding-right:10px ;" placeholder="请输入电话"
                  size="mini"></el-input>
              </el-form-item>
              <el-button @click.prevent="removeDomain(domain)" type="danger" size="mini">删除</el-button>
            </el-form>
          </el-form-item>
        </el-col>
        <el-form-item label="物业类型" prop="propertyType">
          <el-checkbox-group v-model="form.propertyType" :max="1" v-if="form.propertyType">
            <el-checkbox v-for="     dict      in      dict.type.tfw_property_type   " :key="dict.value"
              :label="dict.value">
              {{ dict.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否新房" prop="ifNewHouse">
          <el-select v-model="form.ifNewHouse" placeholder="请选择是否新房" size="mini">
            <el-option v-for="    dict    in    dict.type.tfw_new_old   " :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租售类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择租售类型" size="mini">
            <el-option v-for="    dict    in    dict.type.tfw_rent_sale   " :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addnew" :disabled="isShowmessage">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 抽屉详情 -->
    <div v-if="showdialog">
      <el-drawer title="房源详情" :before-close="handleCloseDrawer" :visible.sync="showdialog" direction="rtl"
        custom-class="demo-drawer" ref="drawer" size="48%" :destroy-on-close="true">
        <el-tabs v-model="activeName2" type="card">
          <el-tab-pane label="基本信息" name="first">
            <div class="messagebox">
              <div class="leftmessagebox">
                <!-- <img :src="'https://static.tianfucd.com/' + form.coverfile" alt=""> -->
                <!-- <imagePreviewindex :src="form.coverfile" :width="120" :height="100" :text="form.housePhotos" /> -->
                <ImagePreviewHouse :coverfile="form.coverfile" :housephotos="form.housePhotos"
                  :huxing="form.loupanHuxing" :height="110" :width="120" />
              </div>
              <div class="rightmessagebox">
                <div>
                  <span class="price" v-if="form.type == 1 || form.type == 3">{{ form.sellingPrice }}万</span>
                  <span style="  color: #888a8e; font-size: 18px;font-weight: 900;margin: 0;"
                    v-if="form.type == 2 || form.type == 3">{{ form.rental }}元/月</span>
                  <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="updataxq(form)"></el-button>
                  <el-button size="mini" type="text" icon="el-icon-s-marketing"
                    @click="looksellingPrice(form.id)">查看价格调价记录
                  </el-button>
                </div>
                <p class="xqname" v-if="form.loupanXq">{{ form.xqname }} {{ form.loupanXq.address }}</p>
                <p class="adress" style="display: flex; align-items: center;">地址:{{ formatAddressValue(form.building) }}栋{{
      formatAddressValue(form.unit)
        }}单元{{ formatAddressValue(form.floor) }}层{{ formatAddressValue(form.roomNum) }}号
                  <img :src="addressVisible ? require('@/assets/image/closeeyes.png') : require('@/assets/image/openeyes.png')" alt="" style="width: 20px;height: 20px;cursor: pointer;margin-left: 5px;" @click="toggleAddressVisible">
                </p>
                <p class="recommend">房屋状态:
                  <dict-tag :options="dict.type.twf_fwxz" :value="form.statusQuo" />
                </p>
              </div>
            </div>
            <el-row :gutter="20" class="listtitle">
              <div style="position: absolute; top: -20px; font-size: 12px; color: red;">(以下数据双击数据可修改,修改后回车或点击修改选项)</div>
              <el-col :span="6">
                <el-card shadow="hover">
                  <p class="hoversize">户型</p>
                  <div v-if="showshishi" @dblclick="shishiClick(form.id)">{{ form.loupanHuxing ?
      form.loupanHuxing.bedRoomNum : "--" }}室{{
      form.loupanHuxing ? form.loupanHuxing.livingRoomNum : '--'
    }}厅{{ form.loupanHuxing ? form.loupanHuxing.bathroomNum : '--'
                    }}卫</div>
                  <el-select v-model="form2.huXTitle" placeholder="请选择户型图" filterable @click.native="clickhx"
                    ref="input" v-if="closexq" @change="enterclick()">
                    <el-option v-for="   item    in    options   " :key="item.id" :label="item.title" :value="item.id">
                      <el-row type="flex" :gutter="20" justify="center">
                        <el-col :span="4">
                          <image-preview :src="item.img" width="30px" height="30px" />
                        </el-col>
                        <el-col :span="16">
                          <span>{{ item.title }}</span>
                        </el-col>
                      </el-row>
                    </el-option>
                  </el-select>
                </el-card>
              </el-col>
              <el-col :span="6">
                <el-card shadow="hover">
                  <p class="hoversize">产权面积</p>
                  <div v-if="showshishi" @dblclick="shishiClick(form.id)">{{ form.propertyArea }}㎡</div>
                  <el-input v-model="form2.propertyArea" placeholder="请输入产权面积" v-if="closexq"
                    @keyup.enter.native="enterclick()">
                    <i slot="suffix" style="font-style:normal;margin-right: 10px;">㎡</i>
                  </el-input>
                </el-card>
              </el-col>

              <el-col :span="6">
                <el-card shadow="hover">
                  <div @dblclick="shishiClick(form.id)">
                    <p class="hoversize">朝向</p>
                    <dict-tag :options="dict.type.tfw_housing_orientation" :value="form.orientation"
                      v-if="showshishi" />
                    <el-select v-model="form2.orientation" placeholder="请选择朝向" v-if="closexq" @change="enterclick()">
                      <el-option v-for="     dict      in      dict.type.tfw_housing_orientation     " :key="dict.value"
                        :label="dict.label" :value="parseInt(dict.value)"></el-option>
                    </el-select>
                  </div>
                </el-card>
              </el-col>

              <el-col :span="6">
                <el-card shadow="hover">
                  <div @dblclick="shishiClick(form.id)">
                    <p class="hoversize">装修</p>
                    <dict-tag :options="dict.type.tfw_decoration_situation" :value="form.decoration"
                      v-if="showshishi" />
                    <el-select v-model="form2.decoration" placeholder="请选择装修" v-if="closexq" @change="enterclick()">
                      <el-option v-for="dict in dict.type.tfw_decoration_situation     "
                        :key="dict.value" :label="dict.label" :value="parseInt(dict.value)">
                      </el-option>
                    </el-select>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-descriptions title="小区信息" border :column="3" style="padding-right:20px; padding-bottom: 10px;">
              <el-descriptions-item label="小区名字">{{ form.xqname
                }}</el-descriptions-item>
              <el-descriptions-item label="开发商" v-if="form.loupanXq">{{ form.loupanXq.developer
                }}</el-descriptions-item>
              <el-descriptions-item label="物业公司" v-if="form.loupanXq">{{ form.loupanXq.pmc }}</el-descriptions-item>
              <el-descriptions-item label="物业类型">
                <dict-tag :options="dict.type.tfw_property_type" :value="form.propertyType" />
              </el-descriptions-item>
              <el-descriptions-item label="物业费" v-if="form.loupanXq">{{ form.loupanXq.serviceCharge
                }}元</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="业主信息" border :column="3" style="padding-right:20px;">
              <el-descriptions-item label="业主">
                <div v-for="(   item, index   ) in    form.phoneNumber   " :key="index"
                  style="display:flex;justify-content:space-around">
                  <dict-tag :options="dict.type.tfw_yzgx" :value="item.type" />
                  <div>姓名：{{ cardBool
      ? item.name.replace(
        /^([^\x00-\xff])([^\x00-\xff]{0,})([^\x00-\xff])/g,
        "$1*"
      )
      : item.name
                    }}
                  </div>
                  <div>手机号：
                    {{ cardBool ? item.value.replace(
      /^(.{3})(?:\w+)(.{3})$/,
      "\$1*******\$2"
    )
      : item.value
                    }}
                  </div>
                </div>
                <el-button @click="hideNumber" v-if="cardBool">展示</el-button>
                <el-button @click="hideNumber" v-else>隐藏</el-button>
              </el-descriptions-item>
              <el-descriptions-item label="房号">
                {{ cardBool ? '***' : (form.building || '-') }}栋
                {{ cardBool ? '***' : (form.unit || '-') }}单元
                {{ cardBool ? '***' : (form.floor || '-') }}层
                {{ cardBool ? '***' : (form.roomNum || '-') }}号
              </el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="委托信息" border :column="3" style="padding-right:20px;">
              <el-descriptions-item label="委托来源" :labelStyle="{ 'width': '100px' }" :contentStyle="{ 'width': '80px' }">
                <dict-tag :options="dict.type.tfw_source_commission" :value="form.entrustmentSource" />
              </el-descriptions-item>
              <el-descriptions-item label="委托方式" :labelStyle="{ 'width': '100px' }" :contentStyle="{ 'width': '80px' }">
                <dict-tag :options="dict.type.tfw_entrustment_method" :value="form.entrustmentMethod" />
              </el-descriptions-item>
              <el-descriptions-item label="归属人信息">{{ form.sysUser ? form.sysUser.dept.deptName : "--" }} {{
      form.sysUser ? form.sysUser.nickName : "--" }} {{
      form.sysUser ? form.sysUser.phonenumber : "--" }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="房源信息" border :column="3" style="padding-right:20px;">
              <el-descriptions-item label="套内面积">{{ form.usableArea }}㎡</el-descriptions-item>
              <el-descriptions-item label="赠送面积">{{ form.giveAwayArea }}㎡</el-descriptions-item>
              <el-descriptions-item label="户型">{{ form.loupanHuxing ? form.loupanHuxing.bedRoomNum : "--" }}室{{
      form.loupanHuxing ? form.loupanHuxing.livingRoomNum : '--'
    }}厅{{ form.loupanHuxing ? form.loupanHuxing.bathroomNum : '--'
                }}卫</el-descriptions-item>
              <el-descriptions-item label="楼层">{{ form.floor }}/{{ form.totalFloor }}F</el-descriptions-item>
              <el-descriptions-item label="层高">{{ form.loupanXq ? form.loupanXq.floorHigh : "--"
                }}</el-descriptions-item>
              <el-descriptions-item label="房屋结构">
                <dict-tag :options="dict.type.tfw_house_structure" :value="form.structure" />
              </el-descriptions-item>
              <el-descriptions-item label="电梯">
                <dict-tag :options="dict.type.tfw_elevator_situation" :value="form.lift" />
              </el-descriptions-item>
              <el-descriptions-item label="学校">{{ form.loupanXq ? ellipsis(form.loupanXq.schoolDistrict) : "--"
                }}</el-descriptions-item>
              <el-descriptions-item label="产权年限">
                <dict-tag :options="dict.type.tfw_property_rights" :value="form.ownershipYears" />
              </el-descriptions-item>
              <el-descriptions-item label="是否唯一">
                <dict-tag :options="dict.type.tfw_sfwy" :value="form.ifOnly" />
              </el-descriptions-item>
              <el-descriptions-item label="是否满五">{{ getfivenear(form.titleDeedDate) }}</el-descriptions-item>
              <el-descriptions-item label="房源特色">{{ form.features }}</el-descriptions-item>
            </el-descriptions>
            <el-descriptions title="房源转移情况" border :column="1" style="padding-right:20px;">
              <el-descriptions-item label="原持有人">转移时间</el-descriptions-item>
              <el-descriptions-item v-for="item in transferList" :label="item.nickName">{{ formatDate(item.transferTime) }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <!-- 详细介绍 -->
          <el-tab-pane label="跟进" name="second">
            <genjin :floow="genjinid" v-if="showdialog"></genjin>
          </el-tab-pane>
          <el-tab-pane label="房源相册" name="image">
            <div style="padding:10px 40px;box-sizing: border-box;">
              <el-popover placement="right" title="扫码上传图片" width="200" trigger="manual" v-model="visible">
                <vue-qr :logoSrc="imageUrl" :text="qrcode" :size="150"></vue-qr>
                <el-button slot="reference" @click="qrcodeclick()">生成扫码上传图片二维码</el-button>
              </el-popover>
              <list-image-upload :data="form" :limit="10" :titleDeeds="form.titleDeeds" :dialogImageUrl="form.video"
                :isType="1" :superiorId="form.id" :huxingimg="form.loupanHuxing" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="带看历史" name="look">
            <looklog :customerId="form.id" :type="2" />
          </el-tab-pane>
          <el-tab-pane label="上架详情" name="shelf">
<!--            <looklog :customerId="form.id" :type="2" />-->
            <el-form label-position="left" class="demo-table-expand">-->
              <el-form-item label="看房类型">
                <!-- <dict-tag :options="dict.type.tfw_kffs" :value="props.row.kfang" /> -->
                <el-select v-model="shelfData.kfang" placeholder="请选择看房类型" size="mini"
                  style="width:150px;padding-right:10px ;" @change="changeSelect(shelfData, 3)">
                  <el-option v-for="    dict    in    dict.type.tfw_kffs   " :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房源评级" align="grade">
                <el-select v-model="shelfData.grade" placeholder="请选择房源评级" size="mini"
                  style="width:150px;padding-right:10px ;" @change="changeSelect(shelfData, 4)">
                  <el-option v-for="    dict    in    dict.type.tfw_ecommendation_level   " :key="dict.value"
                    :label="dict.label" :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房屋类型">
                <!-- <dict-tag :options="dict.type.tfw_property_type"
                  :value="shelfData.propertyType ? shelfData.propertyType.split(',') : []" /> -->
                <el-select v-model="shelfData.propertyType" placeholder="请选择房屋类型" size="mini"
                  style="width:150px;padding-right:10px ;" @change="changeSelect(shelfData, 2)">
                  <el-option v-for="    dict    in    dict.type.tfw_property_type   " :key="dict.value"
                    :label="dict.label" :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="房源状态">
                <!-- <dict-tag :options="dict.type.tfw_state" :value="shelfData.state" /> -->
                <el-select v-model="shelfData.state" placeholder="请选择房源状态" size="mini"
                  style="width:150px;padding-right:10px ;" @change="changeSelect(shelfData, 1)">
                  <el-option v-for="    dict    in    dict.type.tfw_state   " :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上架状态" v-if="shelfData.status == 1 || shelfData.status == 2">
                <el-switch style="display: block" v-model="shelfData.status" active-color="#13ce66"
                  inactive-color="#ff4949" active-text="上架外网" inactive-text="下架外网" :active-value="2" :inactive-value="1"
                  @change="changestatus(shelfData.status, shelfData.id)">
                </el-switch>
              </el-form-item>
              <el-form-item label="生成房源验证链接" v-if="shelfData.ifUpdate">
                <el-link :href="'https://new.tianfucd.com/testing?id=' + shelfData.id" target="_blank"
                  v-if="shelfData.ownerType == 1">业主已验真房源</el-link>
                <el-link :href="'https://new.tianfucd.com/testing?id=' + shelfData.id" target="_blank"
                  v-else>房源验证链接</el-link>
                <el-button @click="copyText(shelfData.id)"> 复制房源链接</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-drawer>

    </div>
    <!-- 调价记录 -->
    <el-dialog title="调价记录" :visible.sync="lookpricefalg" v-if="lookpricefalg">
      <!-- <linechart :chart-data="lineChartData"></linechart> -->
      <lookprice :priceid="priceid" :type="2"></lookprice>
    </el-dialog>
    <!-- 详情修改 -->
    <el-dialog title="修改" :visible.sync="openxqbox">
      <el-form :model="formxq" :inline="true">
        <div v-if="form.ifUpdate">
          <el-form-item prop="building" size="mini" style="width:110px">
            <el-input v-model="formxq.building" placeholder="几" size="mini">
              <template slot="append">栋</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="unit" style="width:120px" size="small">
            <el-input v-model="formxq.unit" placeholder="几" size="mini">
              <template slot="append">单元</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="floor" style="width:110px" size="small">
            <el-input v-model="formxq.floor" placeholder="几" size="mini">
              <template slot="append">层</template>
            </el-input>
          </el-form-item>
          <el-form-item prop="roomNum" style="width:100px" size="small">
            <el-input v-model="formxq.roomNum" placeholder="几" size="mini">
              <template slot="append">号</template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="房屋现况" prop="statusQuo" size="mini">
          <el-select v-model="formxq.statusQuo" placeholder="请选择房屋现状">
            <el-option v-for="dict in dict.type.twf_fwxz" :key="dict.value" :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="售价" prop="sellingPrice" size="mini" v-if="formxq.type == 1 || formxq.type == 3">
          <el-input v-model="formxq.sellingPrice" placeholder="请输入售价">
            <i slot="suffix" style="font-style:normal;margin-right: 20px;">万</i>
          </el-input>
        </el-form-item>
        <el-form-item label="租金" prop="rental" size="mini" v-if="formxq.type == 2 || formxq.type == 3">
          <el-input v-model="formxq.rental" placeholder="请输入租金">
            <i slot="suffix" style="font-style:normal;margin-right: 20px;">元</i>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closexqs()">取 消</el-button>
        <el-button type="primary" @click="undataxq()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改房源草稿框 -->
    <el-dialog :title="title" :visible.sync="open2" width="1000px" append-to-body :close-on-click-modal="false"
      :show-close="false" :close-on-press-escape="false" v-if="open2">
      <el-form ref="form2" :model="form" label-width="90px" :inline="true" :rules="rules">
        <el-tabs v-model="activeName" type="card">
          <el-tab-pane label="基本信息" name="first">
            <el-col :span="24">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="cardtitlw">核心信息</span>
                </div>
                <el-form-item label="小区名称" prop="xqname" size="mini">
                  <el-select
                    v-model="form.xqname"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    @change="handleSelect"
                    :loading="xqLoading">
                    <el-option
                      v-for="item in xqList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <el-button type="primary" size="mini" icon="el-icon-edit" v-if="isShowmessage" @click="goadd">没有小区去添加
                  </el-button>
                </el-form-item>

                <el-form-item prop="building" size="mini" style="width:110px">
                  <el-input v-model="form.building" placeholder="几" size="mini">
                    <template slot="append">栋</template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="unit" style="width:120px" size="small" v-if="form.propertyType != 6">
                  <el-input v-model="form.unit" placeholder="几" size="mini">
                    <template slot="append">单元</template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="floor" style="width:110px" size="small">
                  <el-input v-model="form.floor" placeholder="几" size="mini">
                    <template slot="append">层</template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="roomNum" style="width:100px" size="small" v-if="form.propertyType != 6">
                  <el-input v-model="form.roomNum" placeholder="几" size="mini">
                    <template slot="append">号</template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="carNum" v-if="form.propertyType == 6">
                  <el-input v-model="form.carNum" placeholder="请输入车位号" size="mini" style="width:170px">
                    <template slot="append">号</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="物业类型" prop="propertyType" size="small">
                  <el-checkbox-group v-model="form.propertyType" :max="1">
                    <el-checkbox v-for="     dict      in      dict.type.tfw_property_type   " :key="dict.value"
                      :label="dict.value">
                      {{ dict.label }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>

                <el-card class="box-card" v-if="include()">
                  <div slot="header" class="clearfix">
                    <span class="cardtitlw">商铺信息</span>
                  </div>
                  <el-form-item label="商铺" prop="businessLevel" size="mini">
                    <el-input v-model="form.businessLevel" placeholder="请输入商铺" />
                  </el-form-item>
                  <el-form-item label="开间距离" prop="bay" size="mini">
                    <el-input v-model="form.bay" placeholder="请输入开间距离" />
                  </el-form-item>
                  <el-form-item label="近身距离(商铺)" prop="depth" size="mini" label-width="120px">
                    <el-input v-model="form.depth" placeholder="请输入近身距离(商铺)" style="width:160px" />
                  </el-form-item>
                </el-card>

                <el-tabs v-model="form.type" v-if="form.type">
                  <el-tab-pane :name="dictitem.value" v-for="   dictitem    in      dict.type.tfw_rent_sale     "
                    :key="dictitem.value" :label="dictitem.label">
                    <!-- 售卖 -->
                    <el-form-item label="买方佣金" prop="commission" size="mini" v-if="dictitem.value === '1'" :rules="'1' === form.type ? [
      { required: true, message: '佣金不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-input v-model="form.commission" placeholder="请输入佣金">
                        <i slot="suffix" style="font-style:normal;margin-right: 20px;">%</i>
                      </el-input>
                    </el-form-item>
                    <el-form-item label="售价" prop="sellingPrice" size="mini" v-if="dictitem.value === '1'" :rules="'1' === form.type ? [
      { required: true, message: '售价不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-input v-model="form.sellingPrice" placeholder="请输入售价">
                        <i slot="suffix" style="font-style:normal;margin-right: 20px;">万</i>
                      </el-input>
                    </el-form-item>
                    <!-- 出租 -->
                    <el-form-item label="租金" prop="rental" size="mini" v-if="dictitem.value === '2'" :rules="'2' === form.type ? [
      { required: true, message: '租金不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-input v-model="form.rental" placeholder="请输入租金" style="width:120px" />
                    </el-form-item>
                    <el-form-item label="承租佣金" prop="commissionMethod" size="mini" v-if="dictitem.value === '2'" :rules="'2' === form.type ? [
      { required: true, message: '承租佣金不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.commissionMethod" placeholder="请选承租佣金">
                        <el-option v-for="     dict      in      dict.type.tfw_house_commission_method"
                          :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                      </el-select>

                    </el-form-item>
                    <el-form-item label="出租方式" prop="rentalMethod" size="mini" v-if="dictitem.value === '2'" :rules="'2' === form.type ? [
      { required: true, message: '出租方式不能为空', trigger: 'change' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.rentalMethod" placeholder="出租方式" style="width:150px">
                        <el-option v-for="     item      in      czlist     " :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="最短租期" prop="shortestRentalPeriod" size="mini" v-if="dictitem.value === '2'"
                      :rules="'2' === form.type ? [
      { required: true, message: '租期不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.shortestRentalPeriod" placeholder="最短租期">
                        <el-option v-for="     dict      in      zqlist     " :key="dict.value" :label="dict.label"
                          :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="免租时间" prop="rentFreeTime" size="mini" v-if="dictitem.value === '2'" :rules="'2' === form.type ? [
      { required: true, message: '免租时间不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.rentFreeTime" placeholder="请选择免租时间">
                        <el-option v-for="     dict      in      mzlist     " :key="dict.value" :label="dict.label"
                          :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="付款方式" prop="paymentMethod" size="mini" v-if="dictitem.value === '2'" :rules="'2' === form.type ? [
      { required: true, message: '付款方式不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.paymentMethod" placeholder="请输入付款方式">
                        <el-option v-for="     dict      in      fklist     " :key="dict.value" :label="dict.label"
                          :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <!-- 租售同步 -->

                    <el-form-item label="出租佣金" prop="commissionMethod" size="mini" v-if="dictitem.value === '3'" :rules="'3' === form.type ? [
      { required: true, message: '出租佣金不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.commissionMethod" placeholder="请选出租佣金">
                        <el-option v-for="     dict      in      dict.type.tfw_house_commission_method"
                          :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="买方佣金" prop="commission" size="mini" v-if="dictitem.value === '3'" :rules="'3' === form.type ? [
      { required: true, message: '佣金不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-input v-model="form.commission" placeholder="请输入佣金" />
                    </el-form-item>
                    <el-form-item label="租金" prop="rental" size="mini" v-if="dictitem.value === '3'" :rules="'3' === form.type ? [
      { required: true, message: '租金不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-input v-model="form.rental" placeholder="请输入租金" />
                    </el-form-item>
                    <el-form-item label="售价" prop="sellingPrice" size="mini" v-if="dictitem.value === '3'" :rules="'3' === form.type ? [
      { required: true, message: '售价不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-input v-model="form.sellingPrice" placeholder="请输入售价" />
                    </el-form-item>
                    <el-form-item label="付款方式" prop="paymentMethod" size="mini" v-if="dictitem.value === '3'" :rules="'3' === form.type ? [
      { required: true, message: '付款方式不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.paymentMethod" placeholder="付款方式">
                        <el-option v-for="     dict      in      fklist     " :key="dict.value" :label="dict.label"
                          :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="出租方式" prop="rentalMethod" size="mini" v-if="dictitem.value === '3'" :rules="'3' === form.type ? [
      { required: true, message: '出租方式不能为空', trigger: 'change' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.rentalMethod" placeholder="出租方式">
                        <el-option v-for="     item      in      czlist     " :key="item.value" :label="item.label"
                          :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="最短租期" prop="shortestRentalPeriod" size="mini" v-if="dictitem.value === '3'"
                      :rules="'3' === form.type ? [
      { required: true, message: '租期不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.shortestRentalPeriod" placeholder="最短租期">
                        <el-option v-for="     dict      in      zqlist     " :key="dict.value" :label="dict.label"
                          :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="免租时间" prop="rentFreeTime" size="mini" v-if="dictitem.value === '3'" :rules="'3' === form.type ? [
      { required: true, message: '免租时间不能为空', trigger: 'blur' }] : [
      { required: false }]
      ">
                      <el-select v-model="form.rentFreeTime" placeholder="免租时间">
                        <el-option v-for="     dict      in      mzlist     " :key="dict.value" :label="dict.label"
                          :value="dict.value"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-tab-pane>
                </el-tabs>
              </el-card>
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="cardtitlw">业主信息</span>
                </div>
                <el-button @click="addDomain" type="primary" size="mini">新增业主</el-button>
                <br />
                <div v-if="phoneNumbercopy">
                  <el-form-item v-for="(   domain, index   ) in    phoneNumbercopy   " :label="'业主' + (index + 1)"
                    :key="domain.key" :required="index === 0">
                    <el-form :model="domain" :rules=rules.phoneNumber ref="domain">
                      <el-form-item prop="type">
                        <el-select v-model="domain.type" placeholder="请选择关系" size="mini"
                          style="width:150px;padding-right:10px ;">
                          <el-option v-for="    dict    in    dict.type.tfw_yzgx   " :key="dict.value"
                            :label="dict.label" :value="dict.value"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item prop="name">
                        <el-input v-model="domain.name" style="width:150px;padding-right:10px ;" placeholder="请输入姓名"
                          size="mini"></el-input>
                      </el-form-item>
                      <el-form-item prop="value">
                        <el-input v-model="domain.value" style="width:150px;padding-right:10px ;" placeholder="请输入电话"
                          size="mini"></el-input>
                      </el-form-item>
                      <el-button v-if="phoneNumbercopy.length > 1" @click.prevent="removeDomain(domain)" type="danger" size="mini">删除</el-button>
                    </el-form>
                  </el-form-item>
                </div>

              </el-card>
            </el-col>
            <el-col :span="24">
              <el-card class="box-card">
                <div slot="header" class="clearfix">
                  <span class="cardtitlw">房源信息</span>
                </div>
                <el-form-item label="标题" prop="title" size="small">
                  <el-input v-model="form.title" placeholder="请输入标题" style="width:150px" />
                </el-form-item>
                <el-form-item label="原户型ID" prop="oldHuxingId" size="small">
                  <el-input v-model="form.oldHuxingId" placeholder="请输入原户型ID" style="width:150px" />
                </el-form-item>
                <el-form-item label="户型图" prop="huxingId" size="small">
                  <el-select v-model="form.huxingId" placeholder="请选择户型图" filterable @click.native="clickhx"
                    ref="input">
                    <el-option v-for="   item    in    options   " :key="item.id" :label="item.title" :value="item.id">
                      <el-row type="flex" :gutter="15" justify="center">
                        <el-col :span="4">
                          <image-preview :src="item.img" width="30px" height="30px" />
                        </el-col>
                        <el-col :span="10">
                          <span>{{ item.title }}</span>
                        </el-col>
                        <el-col :span="4">
                          <span>{{ item.habitableSpace }}㎡</span>
                        </el-col>
                      </el-row>
                    </el-option>
                  </el-select>
                  <!-- 新增户型图 -->
                  <el-popover width="700" placement="top-start" trigger="click" ref="popoverRef">
                    <el-form ref="huxing" :model="huxing" label-width="80px" :inline="true">
                      <el-form-item label="户型图片" prop="img">
                        <image-upload v-model="huxing.img" />
                      </el-form-item>
                      <el-col :span="24">
                        <el-form-item label="面积" prop="habitableSpace">
                          <el-input v-model="huxing.habitableSpace" placeholder="请输入面积" />
                        </el-form-item>
                        <el-form-item label="卧室数量" prop="bedRoomNum">
                          <el-input-number v-model="huxing.bedRoomNum" :min="0" :max="100">
                          </el-input-number>
                        </el-form-item>
                        <el-form-item label="餐厅数量" prop="livingRoomNum">
                          <el-input-number v-model="huxing.livingRoomNum" :min="0" :max="100">
                          </el-input-number>
                        </el-form-item>
                        <el-form-item label="厨房数量" prop="kitchenNum">
                          <el-input-number v-model="huxing.kitchenNum" :min="0" :max="100">
                          </el-input-number>
                        </el-form-item>
                        <el-form-item label="卫生间数量" prop="bathroomNum" label-width="100px">
                          <el-input-number v-model="huxing.bathroomNum" :min="0" :max="100">
                          </el-input-number>
                        </el-form-item>
                        <el-form-item label="阳台数量" prop="balconyNum">
                          <el-input-number v-model="huxing.balconyNum" :min="0" :max="100">
                          </el-input-number>
                        </el-form-item>
                        <el-form-item label="朝向" prop="towards">
                          <el-select v-model="huxing.towards" placeholder="请选择">
                            <el-option v-for="   dict    in    dict.type.tfw_housing_orientation   " :key="dict.value"
                              :label="dict.label" :value="dict.value">
                            </el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="备注" prop="remark">
                          <el-input v-model="huxing.remark" placeholder="请输入备注" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-button type="primary" @click="submithuxing">确 定</el-button>
                        <el-button @click="canceladdnewphotos">取 消</el-button>
                      </el-col>
                    </el-form>
                    <el-button type="primary" icon="el-icon-edit" slot="reference" round
                      style="margin-left: 30px;">新增户型</el-button>
                  </el-popover>
                </el-form-item>
                <el-form-item label="产权面积" prop="propertyArea" size="small">
                  <el-input v-model="form.propertyArea" placeholder="请输入产权面积" style="width:170px">
                    <i slot="suffix" style="font-style:normal;margin-right: 10px;">㎡</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="套内面积" prop="usableArea" size="small">
                  <el-input v-model="form.usableArea" placeholder="请输入套内面积" style="width:170px">
                    <i slot="suffix" style="font-style:normal;margin-right: 10px;">㎡</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="赠送面积" prop="giveAwayArea" size="small">
                  <el-input v-model="form.giveAwayArea" placeholder="请输入赠送面积" style="width:170px">
                    <i slot="suffix" style="font-style:normal;margin-right: 10px;">㎡</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="封面图" prop="coverfile" size="small">
                  <image-upload v-model="form.coverfile" :limit=1 />
                </el-form-item>
                <el-form-item label="产权证图片" prop="titleDeeds" size="small">
                  <image-upload v-model="form.titleDeeds" :limit=1 />
                </el-form-item>
                <el-form-item label="房屋视频" prop="video" size="small">
                  <videoUpload v-model="form.video" />
                </el-form-item>
                <el-col :span="24">
                  <el-form-item label="店铺标签" prop="featuredTags" size="small">
                    <el-checkbox-group v-model="form.featuredTags" :max="3" v-if="form.featuredTags">
                      <el-checkbox v-for="   dict    in    dict.type.tfw_featured_tags   " :key="dict.value"
                        :label="dict.value">
                        {{ dict.label }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-form-item label="是否新房" prop="ifNewHouse" size="small">
                  <el-select v-model="form.ifNewHouse" placeholder="请选择是否新房">
                    <el-option v-for="    dict    in    dict.type.tfw_new_old   " :key="dict.value" :label="dict.label"
                      :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
              </el-card>
            </el-col>
            <div class="footerbox">
              <el-button type="primary" @click="submitaudit">提交审核</el-button>
              <el-button type="primary" @click="savedraftsbox">保存信息</el-button>
              <el-button type="primary" @click="nextfn">下一页</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-tab-pane>
          <!-- 详细信息 -->
          <el-tab-pane label="详细信息" name="second">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">产权信息</span>
              </div>
              <el-form-item label="产权所有" prop="equityOwnership" size="mini">
                <el-select v-model="form.equityOwnership" placeholder="请选择产权所有">
                  <el-option v-for="     dict      in      dict.type.tfw_property_ownership     " :key="dict.value"
                    :label="dict.label" :value="parseInt(dict.value)"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="产权日期" prop="titleDeedDate" size="mini">
                <el-date-picker clearable v-model="form.titleDeedDate" type="date" value-format="yyyy-MM-dd"
                  placeholder="请选择产权日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="产权年限" prop="ownershipYears" size="mini">
                <el-select v-model="form.ownershipYears" placeholder="请选择产权年限">
                  <el-option v-for="     dict      in      dict.type.tfw_property_rights     " :key="dict.value"
                    :label="dict.label" :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="国土证日期" prop="housingPeriod" size="mini">
                <el-date-picker clearable v-model="form.housingPeriod" type="date" value-format="yyyy-MM-dd"
                  placeholder="请选择国土证日期">
                </el-date-picker>
              </el-form-item>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">详细信息</span>
              </div>
              <el-col :span="24">
                <el-form-item label="供暖" prop="heating" size="mini">
                  <el-select v-model="form.heating" placeholder="请选择供暖" style="width:200px">
                    <el-option v-for="     dict      in      dict.type.tfw_heating_type     " :key="dict.value"
                      :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="朝向" prop="orientation" size="mini">
                  <el-select v-model="form.orientation" placeholder="请选择朝向" style="width:200px">
                    <el-option v-for="     dict      in      dict.type.tfw_housing_orientation     " :key="dict.value"
                      :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="梯户比" prop="elevator" size="mini">
                  <el-input v-model="form.elevator" placeholder="几梯" size="mini" style="width:100px">
                  </el-input>
                  <el-input v-model="form.suites" placeholder="几户" size="mini" style="width:100px">
                  </el-input>
                </el-form-item>
                <el-form-item prop="totalFloor" size="mini" label="总楼层">
                  <el-input v-model="form.totalFloor" placeholder="请输入总楼层" style="width:200px">
                  </el-input>
                </el-form-item>
                <el-form-item label="房屋结构" prop="structure" size="mini">
                  <el-select v-model="form.structure" placeholder="请选择房屋结构">
                    <el-option v-for="     dict      in      dict.type.tfw_house_structure     " :key="dict.value"
                      :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房源评级" prop="grade" size="mini">
                  <el-select v-model="form.grade" placeholder="请选择房源评级">
                    <el-option v-for="     dict      in      dict.type.tfw_ecommendation_level     " :key="dict.value"
                      :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="电梯情况" prop="lift" size="mini">
                  <el-select v-model="form.lift" placeholder="请选择电梯情况">
                    <el-option v-for="     dict      in      dict.type.tfw_elevator_situation     " :key="dict.value"
                      :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="用电类型" prop="powerType" size="mini">
                  <el-select v-model="form.powerType" placeholder="请选择用电类型">
                    <el-option v-for="     dict      in      dict.type.tfw_electricity_consumption     "
                      :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="装修情况" prop="decoration" size="mini">
                  <el-select v-model="form.decoration" placeholder="请选择装修">
                    <el-option v-for="     dict      in      dict.type.tfw_decoration_situation     " :key="dict.value"
                      :label="dict.label" :value="parseInt(dict.value)">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房屋现况" prop="statusQuo" size="mini">
                  <el-select v-model="form.statusQuo" placeholder="请选择房屋现状">
                    <el-option v-for="     dict      in      dict.type.twf_fwxz     " :key="dict.value"
                      :label="dict.label" :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房源状态" prop="state" size="mini">
                  <el-select v-model="form.state" placeholder="请选择房源状态">
                    <el-option v-for="  dict   in   dict.type.tfw_state  " :key="dict.value" :label="dict.label"
                      :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否唯一" prop="ifOnly" size="mini">
                  <el-select v-model="form.ifOnly" placeholder="是否唯一">
                    <el-option v-for="     dict      in      dict.type.tfw_sfwy     " :key="dict.value"
                      :label="dict.label" :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!--                <el-form-item label="公司注册" prop="ifIncorporation" size="mini">-->
                <!--                  <el-input v-model="form.ifIncorporation" placeholder="请输入公司注册" />-->
                <!--                </el-form-item>-->

                <!-- <el-form-item prop="suites" size="mini" style="width:110px">

                </el-form-item> -->
                <el-form-item label="是否公盘" prop="ifPublic" size="mini">
                  <el-select v-model="form.ifPublic" placeholder="是否公盘">
                    <el-option v-for="     dict      in      dict.type.twf_sfgp     " :key="dict.value"
                      :label="dict.label" :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否贷款" prop="collateral" size="mini">
                  <el-select v-model="form.collateral" placeholder="是否贷款">
                    <el-option v-for="     dict      in      dict.type.tfw_mortgage_situation     " :key="dict.value"
                      :label="dict.label" :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="交易权属" prop="transactionOwnership" size="mini">
                  <el-select v-model="form.transactionOwnership" placeholder="交易权属">
                    <el-option v-for="     dict      in      dict.type.tfw_tosp     " :key="dict.value"
                      :label="dict.label" :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="房源核验码" prop="ifIncorporation" size="mini">
                  <el-input v-model="form.ifIncorporation" placeholder="请输入总楼层" style="width:200px">
                  </el-input>
                </el-form-item>
              </el-col>

            </el-card>
            <!--           <el-form-item label="总单元数" prop="totalUnit">-->
            <!--                <el-input v-model="form.totalUnit" placeholder="请输入总单元数" />-->
            <!--              </el-form-item>-->
            <!--              <el-form-item label="共几层" prop="totalFloor">-->
            <!--                <el-input v-model="form.totalFloor" placeholder="请输入共几层" />-->
            <!--              </el-form-item>-->


            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">委托与看房</span>
              </div>
              <el-form-item label="委托方式" prop="entrustmentMethod" size="mini">
                <el-select v-model="form.entrustmentMethod" placeholder="请选择委托方式">
                  <el-option v-for="     dict      in      dict.type.tfw_entrustment_method     " :key="dict.value"
                    :label="dict.label" :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="委托来源" prop="entrustmentSource" size="mini">
                <el-select v-model="form.entrustmentSource" placeholder="请选择委托来源">
                  <el-option v-for="     dict      in      dict.type.tfw_source_commission     " :key="dict.value"
                    :label="dict.label" :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="推荐人" prop="params.person" size="mini">
                <el-input v-model="form.params.person" placeholder="请输入推荐人" style="width:120px" />
              </el-form-item>
              <el-form-item label="看房方式" prop="kfang" size="mini">
                <el-select v-model="form.kfang" placeholder="看房方式">
                  <el-option v-for="     dict      in      dict.type.tfw_kffs     " :key="dict.value"
                    :label="dict.label" :value="dict.value">
                  </el-option>
                </el-select>
              </el-form-item>

            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">置顶与推荐</span>
              </div>
              <el-form-item label="置顶序号" prop="topSort" size="mini">
                <el-input v-model="form.topSort" placeholder="请输入置顶序号" style="width:120px" />
              </el-form-item>
              <!-- <el-form-item label="置顶到期时间" prop="topExpiryTime" size="mini" label-width="100px">
                <el-date-picker clearable v-model="form.topExpiryTime" type="date" value-format="yyyy-MM-dd"
                  placeholder="请选择置顶到期时间" style="width:140px">
                </el-date-picker>
              </el-form-item> -->
              <el-form-item label="是否为平台租房" prop="ifPlatform" size="mini" label-width="120px">
                <el-select v-model="form.ifPlatform" placeholder="是否为平台租房" style="width:150px">
                  <el-option v-for="     dict      in      dict.type.tfw_ptjf     " :key="dict.value"
                    :label="dict.label" :value="parseInt(dict.value)">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否全站推荐" prop="ifRecommend" size="mini" label-width="100px">
                <el-input v-model="form.ifRecommend" placeholder="请输入是否全站推荐" style="width:140px" />
              </el-form-item>
            </el-card>
            <!-- <el-form-item label="是否重复房源" prop="ifRepeat">
                <el-input v-model="form.ifRepeat" placeholder="请输入是否重复房源" />
              </el-form-item> -->
            <!-- <el-form-item label="是否为该小区最低价房源" prop="ifCheapest">
                <el-input v-model="form.ifCheapest" placeholder="请输入是否为该小区最低价房源" />
              </el-form-item> -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">详情与推荐</span>
              </div>
              <!--              <el-col :span="24">-->
              <!--                <el-form-item label="房源详情" prop="detailed" size="mini">-->
              <!--                  &lt;!&ndash; <el-input v-model="form.detailed" type="textarea" placeholder="请输入内容" maxlength="300" show-word-limit-->
              <!--                            :autosize="{ minRows: 4, maxRows: 6 }" style="width: 600px" /> &ndash;&gt;-->
              <!--                  <Editor v-model="form.detailed" :minHeight="200" />-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
              <el-col :span="24">
                <el-form-item label="房源特色" prop="features" size="mini">
                  <!-- <el-input v-model="form.features" placeholder="请输入房源特色" maxlength="60" show-word-limit
                    :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" style="width: 600px" /> -->
                  <Editor v-model="form.features" :minHeight="200" />
                </el-form-item>
              </el-col>
            </el-card>
            <div class="footerbox">
              <el-button type="primary" @click="submitaudit">提交审核</el-button>
              <el-button type="primary" @click="nextthird">下一页</el-button>
              <el-button type="primary" @click="savedraftsbox">保存信息</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-tab-pane>
          <!-- 房源跟踪 -->
          <!-- <el-tab-pane label="房源跟踪" name="third" v-if="showfollow">
            <foollow></foollow>
            <div class="footerbox" v-if="this.title === '修改房源'">
              <el-button type="primary" @click="submitaudit">提交审核</el-button>
              <el-button type="primary" @click="savedraftsbox">保存信息</el-button>
              <el-button type="primary" @click="nextfouth">下一步</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-tab-pane> -->
          <!--房源照片  -->
          <el-tab-pane label="房源照片" name="fourth" v-if="showphone">
            <list-image-upload :data="form" :limit="10" :titleDeeds="form.titleDeeds" :dialogImageUrl="form.video"
              :isType="1" :superiorId="form.id" :huxingimg="form.loupanHuxing" />
            <el-popover placement="right" title="扫码上传图片" width="220" trigger="manual" v-model="visible">
              <vue-qr :logoSrc="imageUrl" :text="qrcode" :size="200"></vue-qr>
              <el-button slot="reference" @click="qrcodeclick()">生成扫码上传图片二维码</el-button>
            </el-popover>
            <!--            <housephotos></housephotos>-->
            <div class="footerbox">
              <el-button type="primary" @click="submitaudit">提交审核</el-button>
              <el-button type="primary" @click="savedraftsbox">保存信息</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-form>

    </el-dialog>

    <!-- 被转移人名单 -->
    <el-dialog title="被转移人名单" :visible.sync="dialogTableVisible">
      <el-table size="mini" height="500px" :data="newuserhouseopenlist">
        <el-table-column prop="userId" label="编号" width="180"></el-table-column>
        <el-table-column prop="nickName" label="姓名" width="180"></el-table-column>
        <el-table-column prop="dept.deptName" label="地址"></el-table-column>
        <el-table-column fixed="right" label="操作" width="120">

          <template slot-scope="scope">
            <el-button @click.native.prevent="transferto(scope.row)" type="text" size="small">
              转移
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="dataquery.total > 0" :total="dataquery.total" :page.sync="dataquery.pageNum"
                  :limit.sync="dataquery.pageSize" @pagination="transfersother()" />
    </el-dialog>
  </div>
</template>
<script>

import {
  listFangyuan,
  getFangyuan,
  delFangyuan,
  addFangyuan,
  updateFangyuan,
  fuzzyqueries2,
  listHuxing,
  ifFangYuan, updateUserHouse, getuserHouseList
} from '@/api/fangyuan/fangyuan'
import {
  getTransferList
} from '@/api/fangyuan/transfer'
import { listPhotos, getPhotos, delPhotos, addPhotos, updatePhotos, qrcode } from "@/api/housephotos/photos";
import {
  getlist,
  getprovincelist1
} from '@/api/province'
import { addHuxing, } from '@/api/huxing/huxing'
import foollow from '../follow/index.vue'
import province from '../../components/Province.vue'
import housephotos from '../housephotos/photos/index.vue'
import genjin from '../genjin/genjin.vue'
import lookprice from '@/views/fangyuan/fangyuan/lookprice.vue'
import looklog from '@/views/source/looklog'
import ImagePreviewHouse from '../ImagePreviewHouse'

import { createLogger, mapMutations } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

import { deptTreeSelect } from '@/api/system/user'

export default {
  components: {
    Treeselect,
    foollow,
    housephotos,
    province,
    genjin,
    lookprice,
    looklog,
    ImagePreviewHouse,
  },
  name: 'Fangyuan',
  dicts: ['tfw_state_2', 'tfw_house_commission_method', 'tfw_rent_sale', 'tfw_status', 'tfw_ecommendation_level', 'tfw_entrustment_method', 'tfw_source_commission', 'tfw_housing_orientation', 'tfw_electricity_consumption', 'tfw_featured_tags', 'tfw_house_structure', 'tfw_mortgage_situation', 'tfw_new_old', 'tfw_property_type', 'tfw_property_ownership', 'tfw_heating_type', 'tfw_elevator_situation', 'tfw_czlx', 'tfw_mzsj', 'tfw_zdzq', 'tfw_czr', 'tfw_fkfs', 'tfw_cqnx', 'tfw_decoration_situation', 'tfw_state', 'twf_fwxz', 'tfw_sfwy', 'tfw_kffs', 'twf_sfgp', 'tfw_ptjf', 'tfw_property_rights', 'tfw_arear', 'tfw_prices', 'tfw_fuxing', 'tfw_yzgx', 'tfw_tosp'],
  inheritAttrs: false,
  data() {
    return {
      tfw_rent_sale: [
        {
          value: "5",
          label: "售卖"
        },
        {
          value: "4",
          label: "出租"
        },
        {
          value: "3",
          label: "租售同步"
        },
      ],
      // 部门树选项
      deptOptions: undefined,
      detailsflag: false,
      cardBool: true,
      addressVisible: false,
      visible: false,
      qrcode: "",
      imageUrl: require("../../../assets/logo/logo.png"),
      closexq: false,
      showshishi: true,  //双击
      PlatformVar: "全部",  // 表示当前选中的平台
      TypeVar: "全部",      // 表示当前选中的类型
      ConditionVar: "全部", // 表示当前选中的成色
      showfollow: false,
      showphone: false,
      activeName: 'first',
      activeName2: "first",
      zushou: '售卖',
      chuzu: '出租',
      zstb: '租售同步',
      value2: 1,
      // 详情抽屉
      showdialog: false,
      transferList: null,
      phoneNumbercopy: [{
        type: '',
        value: '',
        name: ''
      }],
      //出租类型
      czlist: [
        {
          value: 1,
          label: '整租'
        },
        {
          value: 2,
          label: '合租'
        },
        {
          value: 3,
          label: '单间'
        },
        {
          value: 4,
          label: '青年公寓'
        }
      ],
      //上架类型
      statusList: [{
        value: [1,3,4,5],
        label: '未上架'
      }, {
        value: [2],
        label: '已上架'
      }],
      zqlist: [
        {
          value: 0,
          label: '半年'
        },
        {
          value: 1,
          label: '一年'
        },
        {
          value: 2,
          label: '协商'
        }
      ],
      mzlist: [
        {
          value: 0,
          label: '半月'
        },
        {
          value: 1,
          label: '一月'
        },
        {
          value: 2,
          label: '两月'
        },
        {
          value: 3,
          label: '协商'
        }
        ,
        {
          value: 4,
          label: '无'
        },
        {
          value: 5,
          label: '有'
        },
      ],
      czrlist: [
        {
          value: 0,
          label: '业主租'
        },
        {
          value: 1,
          label: '包租公司租'
        },
        {
          value: 2,
          label: '其他租'
        }
      ],
      fklist: [
        {
          value: 0,
          label: '押一付三'
        },
        {
          value: 1,
          label: '押一付一'
        },
        {
          value: 2,
          label: '押一付二'
        },
        {
          value: 3,
          label: '押二付一'
        },
        {
          value: 4,
          label: '年付不押'
        },
        {
          value: 5,
          label: '半年付不押'
        },
        {
          value: 6,
          label: '面议'
        },
        {
          value: 7,
          label: '半年付押一'
        },
        {
          value: 8,
          label: '年付押一'
        },
      ],
      //没有小区显示
      isShowmessage: true,
      // 模糊查询
      restaurants: [],//后端获取的数据
      state: '', //输入框输入的双向绑定的数据
      //户型数据
      options: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 房源表格数据
      fangyuanList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      open2: false,
      openxqbox: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        no: null,
        xqId: null,
        title: null,
        huxingId: null,
        oldHuxingId: null,
        video: null,
        coverfile: null,
        titleDeeds: null,
        featuredTags: null,
        ifNewHouse: "2",
        type: null,
        commission: null,
        sellingPrice: null,
        expectedRent: null,
        rental: null,
        priceUnits: null,
        rentalMethod: null,
        paymentMethod: null,
        shortestRentalPeriod: null,
        rentFreeTime: null,
        transactionOwnership: null,
        propertyType: null,
        propertyArea: null,
        usableArea: null,
        giveAwayArea: null,
        equityOwnership: null,
        titleDeedDate: null,
        ownershipYears: null,
        housingPeriod: null,
        building: null,
        totalUnit: null,
        unit: null,
        totalFloor: null,
        floor: null,
        roomNum: null,
        floorHigh: null,
        elevator: null,
        suites: null,
        grade: null,
        structure: null,
        entrustmentMethod: null,
        entrustmentSource: null,
        lift: null,
        heating: null,
        powerType: null,
        orientation: null,
        decoration: null,
        statusQuo: null,
        collateral: null,
        ifOnly: null,
        kfang: null,
        features: null,
        detailed: null,
        hits: null,
        industryType: null,
        businessType: null,
        businessLevel: null,
        bay: null,
        depth: null,
        topSort: null,
        topExpiryTime: null,
        ifIncorporation: null,
        ifPublic: null,
        ifPlatform: null,
        ifRecommend: null,
        ifRepeat: null,
        ifCheapest: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        deletedState: null,
        createByName: null,
        updateByName: null,
        homeowner: null,
        phoneNumber: null,
        idPhoneName: null,
        areaCode: null,
        cityCode: null,
        deptId: null,
        state: "1",
        decorationIds: [], //装修类型
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
        userId: null,

        statusList: [1,3,4,5],
      },
      //区域列表
      cityCode: 510100,
      townList: null,
      //跟进id
      genjinid: null,
      // 表单参数
      form: {
        propertyType: [],
      },
      formxq: {
        id: null,
        building: null,
        unit: null,
        floor: null,
        roomNum: null,
        statusQuo: null,
        sellingPrice: null,
        rental: null,
        type: null,
        params: {
          oldPrice: null,
        },
      },
      form2: {
        id: null,
        huxingId: null,
        propertyArea: null,
        orientation: null,
        decoration: null
      },
      //户型图表单
      huxing: {},
      //当前用户id
      thisuserid: null,
      //调价记录
      lookpricefalg: false,
      priceid: null,
      // 表单校验
      rules: {
        xqname: [
          { required: true, message: "小区名称不能为空", trigger: "change" },
        ],
        commission: [
          { required: true, message: "买方佣金不能为空", trigger: "blur" },
        ],
        sellingPrice: [
          { required: true, message: "售价不能为空", trigger: "blur" },
        ],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        huxingId: [
          { required: true, message: "户型图不能为空", trigger: "blur" },
        ],
        oldHuxingId: [
          { required: false, message: "原户型ID不能为空", trigger: "blur" },
        ],
        coverfile: [
          { required: false, message: "封面图不能为空", trigger: "blur" },
        ],
        featuredTags: [
          {
            required: false,
            message: "店铺推荐标签不能为空",
            trigger: "change",
          },
        ],
        ifNewHouse: [
          { required: true, message: "是否新房不能为空", trigger: "change" },
        ],
        type: [
          { required: true, message: "租售类型不能为空", trigger: "change" },
        ],
        propertyType: [
          { required: false, message: "物业类型不能为空", trigger: "change" },
        ],
        propertyArea: [
          { required: true, message: "产权面积不能为空", trigger: "blur" },
        ],
        usableArea: [
          { required: false, message: "套内面积不能为空", trigger: "blur" },
        ],
        giveAwayArea: [
          { required: false, message: "赠送面积不能为空", trigger: "blur" },
        ],
        equityOwnership: [
          { required: true, message: "产权所有不能为空", trigger: "change" },
        ],
        titleDeedDate: [
          { required: true, message: "产权日期不能为空", trigger: "blur" },
        ],
        ownershipYears: [
          { required: true, message: "产权年限不能为空", trigger: "blur" },
        ],
        housingPeriod: [
          { required: false, message: "国土证日期不能为空", trigger: "blur" },
        ],
        building: [
          { required: true, message: "几栋不能为空", trigger: "blur" },
        ],
        totalUnit: [
          { required: true, message: "总单元数不能为空", trigger: "blur" },
        ],
        unit: [
          { required: true, message: "位于哪个单元不能为空", trigger: "blur" },
        ],
        grade: [
          { required: true, message: "房源评级不能为空", trigger: "change" },
        ],
        structure: [
          { required: true, message: "房屋结构不能为空", trigger: "change" },
        ],
        entrustmentMethod: [
          { required: true, message: "委托方式不能为空", trigger: "change" },
        ],
        entrustmentSource: [
          { required: true, message: "委托来源不能为空", trigger: "change" },
        ],
        lift: [
          { required: true, message: "电梯情况不能为空", trigger: "change" },
        ],
        heating: [
          { required: true, message: "供暖不能为空", trigger: "change" },
        ],
        powerType: [
          { required: true, message: "用电类型不能为空", trigger: "change" },
        ],
        orientation: [
          { required: true, message: "朝向不能为空", trigger: "change" },
        ],
        decoration: [
          { required: true, message: "装修情况不能为空", trigger: "change" },
        ],
        ifOnly: [
          { required: true, message: "是否唯一不能为空", trigger: "change" },
        ],
        kfang: [
          { required: true, message: "看房方式不能为空", trigger: "change" },
        ],
        features: [
          { required: false, message: "房源特色不能为空", trigger: "change" },
        ],
        detailed: [
          { required: true, message: "房源详情不能为空", trigger: "blur" },
        ],
        industryType: [
          { required: true, message: "行业类型不能为空", trigger: "change" },
        ],
        ifIncorporation: [
          { required: false, message: "公司注册不能为空", trigger: "blur" },
        ],
        floor: [
          { required: true, message: "第几层不能为空", trigger: "blur" },
        ],
        roomNum: [
          { required: true, message: "房号不能为空", trigger: "blur" },
        ],
        totalFloor: [
          { required: true, message: "总楼层不能为空", trigger: "blur" },
        ],
        suites: [
          { required: true, message: "厅数不能为空", trigger: "blur" },
        ],
        carNum: [
          { required: true, message: "车位号不能为空", trigger: "blur" },
        ],
        elevator: [
          { required: true, message: "电梯不能为空", trigger: "change" },
        ],
        statusQuo: [
          { required: true, message: "房屋现状不能为空", trigger: "change" },
        ],
        collateral: [
          { required: true, message: "抵押情况不能为空", trigger: "change" },
        ],
        commissionMethod: [
          { required: true, message: "佣金方式不能为空", trigger: "change" },
        ],
        transactionOwnership: [
          { required: true, message: "交易权属不能为空", trigger: "change" },
        ],
        video: [
          { required: false, message: "房屋视频不能为空", trigger: "blur" },
        ],
        titleDeeds: [
          { required: false, message: "产权证图片不能为空", trigger: "change" },
        ],
        rental: [
          { required: true, message: "租金不能为空", trigger: "blur" },
        ],
        rentalMethod: [
          { required: true, message: "出租方式不能为空", trigger: "change" },
        ],
        paymentMethod: [
          { required: true, message: "付款方式不能为空", trigger: "change" },
        ],
        shortestRentalPeriod: [
          { required: true, message: "最短租期不能为空", trigger: "change" },
        ],
        rentFreeTime: [
          { required: true, message: "免租时间不能为空", trigger: "change" },
        ],
        balconyNum: [
          { required: true, message: "阳台数不能为空", trigger: "blur" },
        ],
        bathroomNum: [
          { required: true, message: "卫生间数不能为空", trigger: "blur" },
        ],
        bedRoomNum: [
          { required: true, message: "卧室数不能为空", trigger: "blur" },
        ],
        kitchenNum: [
          { required: true, message: "厨房数不能为空", trigger: "blur" },
        ],
        livingRoomNum: [
          { required: true, message: "客厅数不能为空", trigger: "blur" },
        ],
        habitableSpace: [
          { required: true, message: "可用面积不能为空", trigger: "blur" },
        ],
        towards: [
          { required: true, message: "朝向不能为空", trigger: "change" },
        ],
        bay: [
          { required: true, message: "面宽不能为空", trigger: "blur" },
        ],
        depth: [
          { required: true, message: "进深不能为空", trigger: "blur" },
        ],
        businessLevel: [
          { required: true, message: "经营等级不能为空", trigger: "change" },
        ],
        ifPublic: [
          { required: true, message: "是否公开不能为空", trigger: "change" },
        ],
        ifPlatform: [
          { required: false, message: "是否平台房源不能为空", trigger: "change" },
        ],
        ifRecommend: [
          { required: false, message: "是否推荐不能为空", trigger: "change" },
        ],
        ifRepeat: [
          { required: true, message: "是否重复不能为空", trigger: "change" },
        ],
        ifCheapest: [
          { required: true, message: "是否最便宜不能为空", trigger: "change" },
        ],
        topSort: [
          { required: false, message: "置顶排序不能为空", trigger: "blur" },
        ],
        topExpiryTime: [
          { required: true, message: "置顶到期时间不能为空", trigger: "blur" },
        ],
        img: [
          { required: true, message: "户型图片不能为空", trigger: "change" },
        ],
        phoneNumber: {
          value: [
            {
              required: true,
              message: "请输入手机号码",
              trigger: "blur",
            },
            {
              validator: function (rule, value, callback) {
                if (/^1[345789]\d{9}$/.test(value) == false) {
                  callback(new Error("手机号格式错误"));
                } else {
                  callback();
                }
              },
              trigger: "blur",
            },
          ],
          type: [
            { required: true, message: "关系不能为空", trigger: "change" },
          ],
          name: [
            { required: true, message: "业主姓名不能为空", trigger: "blur" },
          ],
        },
      },
      //房源转移相关
      dialogTableVisible: false,
      newuserhouseopenlist: null,
      dataquery: {
        total: 0,
        pageSize: 10,
        pageNum: 1,
      },
      //城市选择
      shelfData: null,
      //小区列表
      xqList: [],
      xqLoading: false,
    }
  },
  created() {
    this.queryParams.userId = this.$store.state.user.userid;
    this.getList()
    this.getDeptTree();
    this.thisuserid = this.$store.state.user.userid;
  },

  methods: {
    ...mapMutations('datatools', ['getfangyuanid']),
    remoteMethod(query) {
      if (query !== '') {
        this.xqLoading = true;
        fuzzyqueries2(query, this.cityCode).then(response => {
          this.restaurants = response.rows
          var arestaurants = this.restaurants.map((terminal) => {
            return {
              label: terminal.title,
              value: terminal.id+""
            }
          })
          this.xqList = arestaurants.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
          this.xqLoading = false;
        })
      } else {
        this.xqList = [];
      }
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then(response => {
        this.deptOptions = response.data;
      });
    },
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    onCreated2(editor2) {
      this.editor2 = Object.seal(editor2) // 一定要用 Object.seal() ，否则会报错
    },
    qrcodeclick() {
      if (!this.visible) {
        // 生成二维码锁
        qrcode({ houseId: this.form.id }).then(res => {
          this.qrcode = "https://new.tianfucd.com/imageupload?id=" + this.form.id + "&isType=1"
          this.$message.success(res.msg)
        })
      }
      this.visible = !this.visible
    },
    // 快捷修改
    changeSelect(val, type) {
      let dataform = {
        id: val.id,
        state: type === 1 ? val.state : null,
        propertyType: type === 2 ? val.propertyType : null,
        kfang: type === 3 ? val.kfang : null,
        grade: type === 4 ? val.grade : null,
      };
      if (dataform.grade == 3) {
        let isok = true
        window.location.href =
          "https://new.tianfucd.com/testing?isashow=" +
          isok +
          "&id=" +
          val.id;
      } else {
        updateFangyuan(dataform).then(res => {
          this.$message.success('修改成功')
          this.getList()
        })
      }
    },
    // 限制详情学区展示
    ellipsis(value) {
      if (!value) return '';
      if (value.length > 5) {
        return value.slice(0, 5) + '...'
      }
      return value
    },
    //隐藏身份证 姓名
    hideNumber() {
      this.cardBool = !this.cardBool;
    },
    // 地址信息显隐切换
    toggleAddressVisible() {
      this.addressVisible = !this.addressVisible;
    },
    formatAddressValue(value) {
      if (this.addressVisible) {
        return value ? value : "-";
      }
      return "*";
    },
    include() {
      if (this.form.propertyType) {
        return this.form.propertyType.includes('4')
      }
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
     */
    flexColumnWidth(label, prop) {
      // 1.获取该列的所有数据
      const arr = this.fangyuanList.map(x => x[prop])
      arr.push(label) // 把每列的表头也加进去算
      // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
      return (this.getMaxLength(arr) + 25) + 'px'
    },
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
    // 计算满五
    getfivenear(date_1) {
      // 计算两个日期之间的差值
      let totalDays, diffDate
      let myDate_1 = Date.parse(date_1)
      let date_2 = new Date()
      let myDate_2 = Date.parse(date_2)
      // 将两个日期都转换为毫秒格式，然后做差
      diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
      totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
      let result;
      if (totalDays >= 365 * 5) { result = "满五"; }
      else if (totalDays >= 365 * 2) { result = "满二"; }
      else { result = "不满二"; }
      return result;
    },
    // 下一步
    nextfn() {
      this.activeName = 'second'
      console.log("点击1")
    },
    nextthird() {
      this.activeName = 'fourth'
    },
    // 查看调价记录
    looksellingPrice(e) {
      this.priceid = e;
      this.lookpricefalg = true;
    },
    /** 查询房源列表 */
    getList() {
      this.loading = true
      listFangyuan(this.queryParams).then(response => {
        this.fangyuanList = response.rows
        console.log(this.fangyuanList, 'fangyuanList')
        this.total = response.total
        this.loading = false
      })
    },
    // 房源转移
    userhouse(row) {
      const ids = row.id || this.ids
      if(ids.length > 0) {
        this.dialogTableVisible = true;
        this.getTransferList();
      } else {
        this.$modal.msgSuccess('请选择房源！')
      }
      // this.$modal.confirm('是否确认删除房源编号为"' + ids + '"的数据项？').then(function () {
      //   return delFangyuan(ids)
      // }).then(() => {
      //   this.getList()
      //   this.$modal.msgSuccess('删除成功')
      // }).catch(() => {
      // })
      // this.$router.push('/fangyuan/transfers')
    },
    //复制到剪切板
    copyText(e) {
      let inputDom = document.createElement('textarea') // js创建一个文本框
      document.body.appendChild(inputDom) //将文本框暂时创建到实例里面
      inputDom.value = 'https://new.tianfucd.com/testing?id=' + e //将需要复制的内容赋值到创建的文本框中
      inputDom.select() //选中文本框中的内容
      inputDom.focus()
      document.execCommand('copy') //执行复制操作
      document.body.removeChild(inputDom) //最后移出
      this.$message.success('复制成功')

    },
    // 模糊查询
    querySearchAsync(queryString, cb) {
      if (queryString) {
        console.log(queryString)
        console.log(this.cityCode, 'citycode')
        fuzzyqueries2(queryString, this.cityCode).then(response => {
          this.restaurants = response.rows
          var restaurants = this.restaurants.map((terminal) => {
            return {
              value: terminal.title,
              name: terminal.id
            }
          })
          var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
          if (results.length > 0) {
            for (let index = 0; index < results.length; index++) {
              if (results[index].value == this.form.xqname) {
                this.isShowmessage = false
                break

              } else {
                this.isShowmessage = true
              }

            }
          } else {
            this.isShowmessage = true
          }
          cb(results)
        })
      }

    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1)
      }
    },
    handleSelect(item) {
      if(item) {
        this.isShowmessage = false
        this.form.xqId = item
      }
    },
    // 详情
    handlerowlist(row) {
      this.shelfData = row;
      this.cardBool = true
      this.genjinid = row.id
      this.getfangyuanid(row.id)
      const id = row.id || this.ids
      getFangyuan(id).then(response => {
        this.form = response.data
        this.formxq.params.oldPrice = response.data.sellingPrice
        if (this.form.featuredTags) {
          this.form.featuredTags = this.form.featuredTags.split(',')
        } else {
          this.form.featuredTags = []
        }
        if (this.form.propertyType) {
          this.form.propertyType = this.form.propertyType.split(',')
        } else {
          this.form.propertyType = []
        }
        if (this.form.phoneNumber) {
          this.form.phoneNumber = JSON.parse(this.form.phoneNumber)
        }
        //查询房源转移情况
        getTransferList(id).then(res => {
          this.transferList = res.rows;
        });
        this.showdialog = true
        console.log(this.form)
      })
    },
    //修改详情
    updataxq(data) {
      this.formxq.id = data.id
      if (data.ifUpdate) {
        this.formxq.building = data.building
        this.formxq.unit = data.unit
        this.formxq.floor = data.floor
        this.formxq.roomNum = data.roomNum
      }
      this.formxq.statusQuo = data.statusQuo
      this.formxq.sellingPrice = data.sellingPrice
      this.formxq.rental = data.rental
      this.formxq.type = data.type
      this.openxqbox = true
    },
    //提交修改详情
    undataxq() {
      updateFangyuan(this.formxq).then(res => {
        this.$modal.msgSuccess('保存成功')
        getFangyuan(this.formxq.id).then(response => {
          this.form = response.data
          if (this.form.featuredTags) {
            this.form.featuredTags = this.form.featuredTags.split(',')
          } else {
            this.form.featuredTags = []
          }
          if (this.form.featuredTags) {
            this.form.propertyType = this.form.propertyType.split(',')
          } else {
            this.form.propertyType = []
          }
          this.form.phoneNumber = JSON.parse(this.form.phoneNumber)
          this.formxq.params.oldPrice = response.data.sellingPrice
          this.openxqbox = false
        })
      })
    },
    //取消修改详情
    closexqs() {
      this.openxqbox = false
    },
    //双击修改
    shishiClick() {
      this.showshishi = false;
      this.closexq = true
      this.form2.id = this.form.id
      this.form2.huXTitle = this.form.huXTitle
      this.form2.propertyArea = this.form.propertyArea
      this.form2.orientation = this.form.orientation
      this.form2.decoration = this.form.decoration
    },
    //点击确定
    enterclick() {
      updateFangyuan(this.form2).then(res => {
        this.$modal.msgSuccess('修改成功')
        getFangyuan(this.form2.id).then(response => {
          this.form = response.data
          if (this.form.featuredTags) {
            this.form.featuredTags = this.form.featuredTags.split(',')
          } else {
            this.form.featuredTags = []
          }
          if (this.form.featuredTags) {
            this.form.propertyType = this.form.propertyType.split(',')
          } else {
            this.form.propertyType = []
          }
          this.form.phoneNumber = JSON.parse(this.form.phoneNumber)
        })
      })
      this.closexq = false;
      this.showshishi = true;
    },
    // 水牌
    goposter(row) {
      const id = row.id || this.ids
      this.$router.push('/poster?id=' + id + '&type=' + row.type)
    },
    handleCloseDrawer(done) {
      this.showshishi = true;
      this.closexq = false
      this.showdialog = false
      this.showphone = false
      this.activeName2 = 'first'
      this.reset()
      this.getList()
    },
    // 关闭详情
    handleClose() {
      this.showshishi = true;
      this.closexq = false
      this.showdialog = false
      this.showphone = false
      this.activeName2 = 'first'
      this.reset()
      this.getList()
    },
    //跟进
    handlegenjin(row) {
      this.genjinid = row.id
      getFangyuan(this.genjinid).then(response => {
        this.form = response.data
        if (this.form.featuredTags) {
          this.form.featuredTags = this.form.featuredTags.split(',')
        } else {
          this.form.featuredTags = []
        }
        if (this.form.featuredTags) {
          this.form.propertyType = this.form.propertyType.split(',')
        } else {
          this.form.propertyType = []
        }
        this.form.phoneNumber = JSON.parse(this.form.phoneNumber)
        this.showdialog = true
        this.showphone = true
        this.activeName2 = 'second'
      })

    },
    clickhx() {
      this.gethxlist()
    },
    //去添加小区
    goadd() {
      this.reset()
      this.open = false
      this.$router.push('/loupan/lpxq')
    },
    // 表单重置
    resethuxing() {
      this.huxing = {
        id: null,
        xqId: this.id,
        title: null,
        img: null,
        habitableSpace: null,
        price: null,
        bedRoomNum: 0,
        livingRoomNum: 0,
        kitchenNum: null,
        bathroomNum: 0,
        balconyNum: null,
        towards: null,
        fitment: null,
        buildingType: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        remark: null,
        createByName: null,
        updateByName: null
      }
      this.resetForm('huxing')
    },
    // 添加户型
    submithuxing() {
      this.huxing.xqId = this.form.xqId
      addHuxing(this.huxing).then(response => {
        this.$modal.msgSuccess("新增成功");
        this.resethuxing();
        this.$refs.popoverRef.doClose()
      });
    },
    //取消新增户型图
    canceladdnewphotos() {
      this.resethuxing();
      this.$refs.popoverRef.doClose()
    },
    // 获取户型数据
    gethxlist() {
      if (this.form.xqId) {
        listHuxing({ xqId: this.form.xqId }).then(response => {
          this.options = response.rows
        })
      }

    },
    // 取消按钮
    cancel() {
      this.getList()
      this.open = false;
      this.open2 = false
      this.showfollow = false
      this.showphone = false;
      this.isShowmessage = false;
      this.reset()
      this.activeName = "first"
    },
    // 表单重置
    reset() {
      this.qrcode = null
      this.visible = false
      this.form = {
        commissionMethod: null,
        id: null,
        carNum: null,
        no: null,
        xqId: null,
        xqname: null,
        title: null,
        huxingId: null,
        oldHuxingId: null,
        video: null,
        coverfile: null,
        titleDeeds: null,
        featuredTags: null,
        ifNewHouse: null,
        type: '1',
        commission: 0.8,
        sellingPrice: null,
        expectedRent: null,
        rental: null,
        priceUnits: null,
        rentalMethod: null,
        paymentMethod: null,
        shortestRentalPeriod: null,
        rentFreeTime: null,
        transactionOwnership: null,
        propertyType: [],
        propertyArea: null,
        usableArea: null,
        giveAwayArea: null,
        equityOwnership: null,
        titleDeedDate: null,
        ownershipYears: null,
        housingPeriod: null,
        building: null,
        totalUnit: null,
        unit: null,
        totalFloor: null,
        floor: null,
        roomNum: null,
        floorHigh: null,
        elevator: null,
        suites: null,
        grade: null,
        structure: null,
        entrustmentMethod: null,
        entrustmentSource: null,
        lift: null,
        heating: null,
        powerType: null,
        orientation: null,
        decoration: null,
        statusQuo: null,
        collateral: null,
        ifOnly: null,
        kfang: null,
        features: null,
        detailed: null,
        hits: null,
        industryType: null,
        businessType: null,
        businessLevel: null,
        bay: null,
        depth: null,
        topSort: null,
        topExpiryTime: null,
        ifIncorporation: null,
        ifPublic: null,
        ifPlatform: null,
        ifRecommend: null,
        ifRepeat: null,
        ifCheapest: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        remark: null,
        deletedState: null,
        createByName: null,
        updateByName: null,
        homeowner: null,
        state: null,
        phoneNumber: [{
          type: '',
          value: '',
          name: ''
        }],
        phoneNumbercopy: [{
          type: '',
          value: '',
          name: ''
        }],

      }
      this.phoneNumbercopy = [{
        type: '',
        value: '',
        name: ''
      }]

      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.userId = this.thisuserid
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.params = {
        propertyAreaMin: null,
        propertyAreaMax: null,
        sellingPriceMin: null,
        sellingPriceMax: null,
        sort: 0,
        floor: 0,
        person: null
      }
      this.queryParams.statusList = [1,3,4,5];
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.isShowmessage = true;
      this.title = '添加房源'
    },
    //新增草稿
    async addnew() {
      if (!this.validateOwnerInfo()) return
      const valid = await this.validateFormRules()
      if (!valid) return
      this.form.propertyType = this.form.propertyType.join(',');
      this.form.phoneNumber = JSON.stringify(this.phoneNumbercopy);
      this.form.state = 1;
      ifFangYuan({
        xqId: this.form.xqId,
        building: this.form.building,
        unit: this.form.unit,
        floor: this.form.floor,
        roomNum: this.form.roomNum,
      }).then(res => {
        if (res.total === 0) {
          this.form.status = 3
          addFangyuan(this.form).then(response => {
            this.$modal.msgSuccess('新增成功')
            this.getList()
            this.open = false
          })
          this.form.propertyType = this.form.propertyType.split(',')
        } else if(res.rows[0].deletedState === 1) {
          this.form.id = res.rows[0].id
          this.form.deletedState = 0;
          this.form.userId = this.$store.state.user.userid;
          // this.form
          updateFangyuan(this.form).then(response => {
            this.$modal.msgSuccess('新增成功')
            this.getList()
            this.open = false
          })
        } else {
          this.form.propertyType = this.form.propertyType.split(',')
          this.$message.error('该房源已存在或录入信息不全')
        }
      })

    },
    //手机号表格删除
    removeDomain(item) {
      var index = this.phoneNumbercopy.indexOf(item)
      if (index !== -1) {
        this.phoneNumbercopy.splice(index, 1)
      }
    },
    //手机号表格新增
    addDomain() {
      this.phoneNumbercopy.push({
        type: '',
        value: '',
        name: ''
      });
    },

    //保存草稿箱
    validateOwnerInfo() {
      if (!this.phoneNumbercopy || this.phoneNumbercopy.length === 0) {
        this.$message.error("请填写业主信息")
        return false
      }
      const first = this.phoneNumbercopy[0]
      if (!first.name || !first.name.trim()) {
        this.$message.error("请填写业主姓名")
        return false
      }
      if (!first.value || !first.value.trim()) {
        this.$message.error("请填写业主电话")
        return false
      }
      return true
    },
    //校验标*号的必填字段（手动同步校验，避免表单卡住）
    //自动校验（Element UI），失败提示并阻止保存
    validateFormRules() {
      return new Promise((resolve) => {
        try {
          const form = this.open2 ? this.$refs.form2 : this.$refs.form;
          if (!form || !form.validate) return resolve(true);
          form.validate((valid) => {
            if (!valid) {
              this.$message.error("请填写完标*号的必填信息");
              resolve(false);
            } else {
              resolve(true);
            }
          });
        } catch (e) {
          console.error("校验异常:", e);
          resolve(false);
        }
      });
    },
    async savedraftsbox() {
      if (!this.validateOwnerInfo()) return
      const valid = await this.validateFormRules()
      if (!valid) return
      if (this.form.featuredTags) {
        this.form.featuredTags = this.form.featuredTags.join(',')
      } else {
        this.form.featuredTags = []
      }
      this.form.phoneNumber = JSON.stringify(this.phoneNumbercopy)
      this.form.propertyType = this.form.propertyType.join(',')
      console.log(this.form)
      updateFangyuan(this.form).then(response => {
        this.$modal.msgSuccess('保存成功')
        getFangyuan(this.form.id).then(response => {
          this.form = response.data
          if (this.form.featuredTags) {
            this.form.featuredTags = this.form.featuredTags.split(',')
          } else {
            this.form.featuredTags = []
          }
          this.form.propertyType = this.form.propertyType.split(',')
          this.form.phoneNumber = JSON.parse(this.form.phoneNumber)
        })
      })
    },
    //上架
    changestatus(status, id) {
      updateFangyuan({ id: id, status: status }).then(res => {
        this.$modal.msgSuccess('修改状态成功')
      })
    },
    //提交审核
    async submitaudit() {
      if (!this.validateOwnerInfo()) return
      const valid = await this.validateFormRules()
      if (!valid) return
      this.form.featuredTags = this.form.featuredTags.join(',')
      this.form.propertyType = this.form.propertyType.join(',')
      this.form.phoneNumber = JSON.stringify(this.phoneNumbercopy)
      this.form.status = 4
      updateFangyuan(this.form).then(response => {
        // console.log(response, "status= 4")
        this.$modal.msgSuccess('提交审核成功，请耐心等待审核。。。')
        this.open2 = false
        this.activeName = "first";
        this.form.propertyType = this.form.propertyType.split(',')
        this.form.phoneNumber = JSON.parse(this.form.phoneNumber)
        // Object.assign(this.$data, this.$options.data())
        this.getList()
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.activeName = 'first'
      this.isShowmessage = false
      this.getfangyuanid(row.id)
      const id = row.id || this.ids
      getFangyuan(id).then(response => {
        this.form = response.data
        if(this.form.params === undefined) this.form.params = {person: ''}
        if (response.data.phoneNumber) {
          this.phoneNumbercopy = JSON.parse(response.data.phoneNumber)
        }
        if (this.form.featuredTags) {
          this.form.featuredTags = this.form.featuredTags.split(',')
        } else {
          this.form.featuredTags = []
        }
        if (this.form.propertyType) {
          this.form.propertyType = this.form.propertyType.split(',')
        } else {
          this.form.propertyType = []
        }
        console.log(this.form, 'this.form')
        this.open2 = true
        this.showfollow = true
        this.showphone = true
        this.title = '修改房源'
      })

    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除房源编号为"' + ids + '"的数据项？').then(function () {
        return delFangyuan(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('fangyuan/fangyuan/export', {
        ...this.queryParams
      }, `fangyuan_${new Date().getTime()}.xlsx`)
    },
    //上架状态取消选中
    // pickStatus(event) {
    //     if (event.target.tagName === "INPUT") {
    //       let data = event.target.value
    //       if (this.queryParams.lift === data) {
    //         this.queryParams.lift = undefined
    //       }
    //     }
    // },
    //梯步取消选中
    pickLift(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.lift === id) {
          this.queryParams.lift = undefined
        }
      }
    },
    //户型取消选中
    pickHuxing(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.huxingId === id) {
          this.queryParams.huxingId = undefined
        }
      }
    },
    //楼层排序取消选中
    pickFloor(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.params.floor === id) {
          this.queryParams.params.floor = undefined
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
    //价格取消选中
    pickPrice(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.sellingPrice === id) {
          this.queryParams.sellingPrice = undefined
        }
      }
    },
    //价格排序
    pickSort(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.params.sort === id) {
          this.queryParams.params.sort = undefined
        }
      }
    },
    //物业类型取消选中
    pickProperty(event) {
      if (event.target.tagName === "INPUT") {
        let id = event.target.value
        if (this.queryParams.propertyType === id) {
          this.queryParams.propertyType = undefined
        }
      }
    },
    getTransferList() {
      this.loading = true;
      this.dataquery.status = 1;
      getuserHouseList(this.dataquery).then(response => {
        this.newuserhouseopenlist = response.rows
        this.dataquery.total = response.total
        this.loading = false;
      })
    },
    //转移
    transferto(row) {
      updateUserHouse(this.ids, { newUserId: row.userId }).then(res => {
        this.dialogTableVisible = false;
        this.getList();
      })
    },
    transfersother() {
      this.getTransferList();
    },
    formatDate(time) {
      let date = new Date(time)
      function padZero(num) {
        return num < 10 ? '0' + num : num;
      }
      let year = date.getFullYear();
      let month = padZero(date.getMonth() + 1); // 月份是从0开始的
      let day = padZero(date.getDate());
      let hours = padZero(date.getHours());
      let minutes = padZero(date.getMinutes());
      return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
    }
  },

}
</script>
<!--[if lte IE 7]>
<script src="json2.js"></script>
<![endif]-->
<style scoped lang="scss">
.demo-table-expand {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.footerbox {
  text-align: right;
}

.listtitle {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  text-align: center;
}

.hoversize {
  font-size: 18px;
  font-weight: 800;
}

.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}

.messagebox {
  display: flex;
  justify-content: left;
  width: 520px;
  height: 110px;
  box-sizing: border-box;
  padding: 0 20px 0 20px;
  margin-bottom: 20px;
}

.leftmessagebox {
  width: 130px;
  height: 110px;
}

.leftmessagebox img {
  width: 100%;
  height: 100%;
}


.rightmessagebox {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: 10px;
}

.rightmessagebox p {
  margin: 0;
}

.price {
  color: red;
  font-size: 18px;
  font-weight: 900;
  margin: 0;
}

.xqname {
  font-size: 14px;
  font-weight: 500;
}

.adress {
  font-size: 14px;
  font-weight: 500;
}

.recommend {
  display: flex;
  font-size: 14px;
  font-weight: 500;
}

.el-descriptions {
  font-size: 12px;
  box-sizing: border-box;
  padding-left: 20px;
}

.cell .el-tag {
  margin-left: 0px !important;
}

.picDiv {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.imgDiv {
  width: 37px;
  height: 37px;
  position: absolute;
  left: 0;
  top: 0;
}

.el-input__inner {
  background-color: transparent !important;
  border: none !important;
  text-indent: -9999px !important;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}

.cardtitlw {
  font-weight: 800;
  font-size: 18px;
}

.container {
  border-radius: 3px;
}

.CationBox {
  width: 100%;
}

.row {
  width: 100%;
  height: 35px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0px 10px;
  font-size: 14px;
  font-weight: 800;
  box-sizing: border-box;
  color: #606266;
  margin-bottom: 4px;
}


.row .content {
  flex: 1;
  display: flex;
}

.row .content .item {
  border-radius: 3px;
  color: #666;
  padding: 5px 12px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}

.row .content .actvCss {
  background: #39b8ff;
  color: #fff;
}

.ContentBox {
  width: 100%;
  height: 450px;
  overflow: auto;
  padding: 10px;
}

.DataListBox {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}

::-webkit-scrollbar {
  display: none;
  /* Chrome Safari */
}

.DataListBox .item {
  padding: 2px 4px;
  flex-shrink: 0;
  width: 19%;
  height: 60px;
  color: #666;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-right: 1.25%;
  margin-bottom: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.DataListBox .item div {
  font-size: 12px;
}

.DataListBox .item:nth-child(5n) {
  /* 需要一行显示几个商品,nth-child(5n)里的数字就设置成几n */
  margin-right: 0px;
}

.nullCss {
  margin: 60px auto;
  font-size: 14px;
  text-align: center;
  color: #999;
}

.jbxx {
  background: inherit;
  background-color: rgba(226, 255, 221, 1);
  border-radius: 3px;
  font-weight: 400;
  color: #46AE42;
  margin-right: 10px;
}

.one {
  background-color: #f10180;
  color: white;
  margin-right: 10px;
  border-radius: 3px;
}

.two {
  background: #ffdd9a;
  color: #4e2d03;
  margin-right: 10px;
  border-radius: 3px;
}

.three {
  background: #03c8d4;
  margin-right: 10px;
  border-radius: 3px;
}

.d4 {
  border-radius: 10px;
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  // padding: 3px;
  margin-right: 5px;
  color: green;
  transform: rotate(15deg);
  -webkit-transform: rotate(15deg);
}

.d3 {
  display: flex;
  justify-content: center;
  align-content: center;
  color: green;
  font-size: 12px;
  font-weight: 700;
}

.d2 {
  border-radius: 10px;
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  // padding: 3px;
  margin-right: 5px;
  color: red;
  transform: rotate(15deg);
  -webkit-transform: rotate(15deg);
}

.d1 {
  display: flex;
  justify-content: center;
  align-content: center;
  color: red;
  font-size: 12px;
  font-weight: 700;
}

.w200 {
  width: 200px;
}

.span1 {
  font-size: 14px;
  font-weight: 600;
}

::v-deep.el-autocomplete .el-popper {
  width: auto !important;
}
</style>
