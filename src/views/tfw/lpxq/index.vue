<template v-loading="receiveLoading">
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">

      <el-form-item label="城市选择" prop="xqname" size="mini" label-width="80px">
        <el-select v-model="tCityCode" placeholder="请选择" v-if="userCityState" @change="handleChange">
          <el-option
            v-for="item in userCities"
            :key="item.cityId"
            :label="item.cityName"
            :value="item.cityId"
          >
          </el-option>
        </el-select>
        <el-cascader v-else
          v-model="defaultCode"
          :options="citysList"
          :disabled="cityState"
          :props="{ expandTrigger: 'hover' }"
          @change="handleChange"></el-cascader>
      </el-form-item>
      <el-form-item label="区域选择" prop="areaCode" size="mini" label-width="80px">
        <el-select v-model="queryParams.areaCode" clearable placeholder="请选择" style="width:120px">
          <el-option v-for="c in areaList" :key="c.id" :value="c.id" :label="c.extName"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名称" prop="title">
        <el-autocomplete v-model="queryParams.title" :fetch-suggestions="querySearchAsync" placeholder="请输入小区名称"
          @select="handleSelect2" ref="autocompleteRef" :debounce=500 size="mini" style="width: 180px">
        </el-autocomplete>
      </el-form-item>
<!--      <el-form-item label="地区筛选" prop="areaCode">-->
<!--        <StateCityDistrictStreetSelector :placeholder="'地区筛选'" v-model="queryParams.areaCode"-->
<!--          :ssqldList="ssqldListIndex" :type="'id'" :value="queryParams.areaCode" />-->
<!--      </el-form-item>-->
      <el-form-item label="小区类型" prop="type" size="mini" label-width="80px">
        <el-select v-model="queryParams.type" placeholder="请选择" style="width:120px">
          <el-option v-for=" dict in dict.type.tfw_new_old" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="物业类型" prop="propertyType" size="mini" label-width="80px">
        <el-select v-model="queryParams.propertyType" placeholder="请选择" style="width:120px">
          <el-option v-for=" dict in dict.type.tfw_property_type" :key="dict.value" :label="dict.label"
            :value="dict.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 四个按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['tfw:lpxq:add']">新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['tfw:lpxq:edit']">修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['tfw:lpxq:remove']">删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['tfw:lpxq:export']">导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!-- 展示列表 -->
    <el-table v-loading="loading" :data="lpxqList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="名称" align="center" prop="title" />
      <el-table-column label="封面图" align="center" prop="coverfile" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.coverfile" :width="50" :height="50" />
        </template>
      </el-table-column>
      <el-table-column label="参考均价" align="center" prop="refPrice" width="120">
        <template slot-scope="scope">
          <!--          <el-button size="mini" type="text" icon="el-icon-s-marketing"-->
          <!--            @click="looksellingPrice(scope.row.id)">查看均价历史记录</el-button>-->
          <el-button size="mini" type="text" icon="el-icon-s-marketing" @click="looksellingPrice(scope.row.id)">查看均价历史记录（有问题在处理）</el-button>
          <div>{{ scope.row.refPrice }}</div>
        </template>
      </el-table-column>
      <el-table-column label="物业类型" align="center" prop="propertyType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_property_type"
            :value="scope.row.propertyType ? scope.row.propertyType.split(',') : []" />
        </template>
      </el-table-column>
      <el-table-column label="特色标签" align="center" prop="featuredTags">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_featured_tags"
            :value="scope.row.featuredTags ? scope.row.featuredTags.split(',') : []" />
        </template>
      </el-table-column>
      <el-table-column label="置业顾问" align="center" prop="realEstateConsultant" />
      <el-table-column label="推荐等级" align="center" prop="recommend">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_ecommendation_level" :value="scope.row.recommend" />
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_new_old" :value="scope.row.type" />
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="shelve">
        <template slot-scope="scope">
          <el-switch :options="dict.type.tfw_listing_status" :value="scope.row.shelve" active-value="0"
            inactive-value="1" />
        </template>
      </el-table-column>
      <el-table-column label="楼盘状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tfw_property_status" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建者" align="center" prop="createByName" />
      <el-table-column label="更新者" align="center" prop="updateByName" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['tfw:lpxq:edit']">修改
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['tfw:lpxq:remove']">删除
          </el-button>
          <add-look v-if="scope.row.type == 1" :loupandata="scope.row" />
          <el-button size="mini" type="text" icon="el-icon-price-tag"
            @click="handleList(scope.row)">详情
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" v-hasPermi="['tfw:lpxq:receiveins']"
                     @click="insertReceive(scope.row)">小区领取
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-tickets" v-hasPermi="['tfw:lpxq:receivelist']"
                     @click="receiveList(scope.row)">领取人员
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    <!-- 均价历史 -->
    <el-dialog title="均价历史" :visible.sync="lookpricefalg" v-if="lookpricefalg">
      <lookprice :priceid="priceid" :type="1"></lookprice>
    </el-dialog>
    <!-- 详情抽屉 -->
    <el-drawer title="小区详情" :wrapperClosable=false :visible.sync="dialog" direction="rtl" custom-class="demo-drawer"
      ref="drawer" size="45%" :destroy-on-close="true" :before-close="handleClose">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <div class="messagebox">
            <div class="leftmessagebox">
              <el-image :src="'https://static.tianfucd.com/' + form.coverfile">
              </el-image>
              <!--              <img  alt="">-->
            </div>
            <div class="rightmessagebox">
              <p class="price">{{ form.refPrice }}元/平米</p>
              <p class="xqname">{{ form.title }}</p>
              <p class="adress">所在地:{{ form.provinceName ? form.provinceName : '' }}{{
      form.cityName ? form.cityName : ''
    }}{{ form.areaName ? form.areaName : '' }}{{ form.streetName ? form.streetName : '' }}</p>
              <p v-if="form.zoneCode">片区:{{ form.zoneCode }}</p>
              <p class="adress">地址:{{ form.address }}</p>
              <p class="recommend">推荐等级:
                <el-rate v-model="form.recommend" show-text :max=3 :texts="['一般', '精良', '优质']">
                </el-rate>
              </p>
            </div>
          </div>
          <el-row :gutter="24" class="listtitle">
            <el-col :span="6">
              <el-card shadow="hover">
                <p class="">总户数</p>
                <div>{{ form.totalHouseholds }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover">
                <p>绿化率</p>
                <div>{{ form.forestationRate }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover">
                <p>容积率</p>
                <div>{{ form.plotRatio }}</div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card shadow="hover">
                <p>总栋数</p>
                <div>{{ form.totalBuilding ? form.totalBuilding : '--' }}</div>
              </el-card>
            </el-col>
          </el-row>

          <el-descriptions title="小区信息">
            <el-descriptions-item label="楼盘名称" v-model="form.title">{{ form.title }}</el-descriptions-item>
            <el-descriptions-item label="开发商">{{ form.developer }}</el-descriptions-item>
            <el-descriptions-item label="物业公司">{{ form.pmc }}</el-descriptions-item>
            <el-descriptions-item label="物业类型">
              <dict-tag :options="dict.type.tfw_property_type" :value="form.propertyType" />
            </el-descriptions-item>
            <el-descriptions-item label="物业费">{{ form.serviceCharge }}元/㎡/月</el-descriptions-item>
            <el-descriptions-item label="小区分类">
              <dict-tag :options="dict.type.tfw_new_old" :value="form.type" />
            </el-descriptions-item>
            <el-descriptions-item label="所有权" v-model="form.propertyRights">
              <dict-tag :options="dict.type.tfw_loupan_propertyrights" :value="form.propertyRights"
                v-if="form.propertyType" />
            </el-descriptions-item>
            <el-descriptions-item label="公摊比例">{{
      form.shareRatio ? form.shareRatio : '--'
    }}%
            </el-descriptions-item>
            <el-descriptions-item label="年限">
              <dict-tag :options="dict.type.tfw_property_rights" :value="form.sort" />
            </el-descriptions-item>
            <el-descriptions-item label="楼盘状态">
              <dict-tag :options="dict.type.tfw_property_status" :value="form.status" />
            </el-descriptions-item>
            <el-descriptions-item label="占地面积">{{ form.landArea }}亩</el-descriptions-item>
            <el-descriptions-item label="建筑面积">{{ form.buildingArea }}平米</el-descriptions-item>
            <el-descriptions-item label="预售证编号">{{
      form.presalePermitNo ?
        form.presalePermitNo : '---'
    }}
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
        <el-tab-pane v-if="dialog" label="楼盘相册" name="image">
          <list-image-upload :limit="10" :isType="2" :superiorId="form.id" />
          <el-popover placement="right" title="扫码上传图片" width="220" trigger="manual" v-model="visible">
            <vue-qr :logoSrc="imageUrl" :text="qrcode" :size="200"></vue-qr>
            <el-button slot="reference" @click="qrcodeclick()">生成扫码上传图片二维码</el-button>
          </el-popover>
        </el-tab-pane>
        <el-tab-pane label="带看历史" name="look" v-if="dialog">
          <looklog :customerId="form.id" :type="3" />
        </el-tab-pane>
        <el-tab-pane label="合作商" name="cooperate" v-if="dialog">
          <cooperate :type="4" ></cooperate>
        </el-tab-pane>

        <el-tab-pane label="小区信息" name="xqInfo" v-if="dialog">
          <xqInfo :type="5" :id="form.id"></xqInfo>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <!-- 添加或修改楼盘小区对话框 -->
    <el-dialog v-if="open" :title="title" :visible.sync="open" width="1000px" append-to-body
      :close-on-click-modal="false" :show-close="false">
      <el-form ref="form" :model="form" label-width="80px" :inline="true">

        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <!-- 封面 -->
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">基本信息</span>
              </div>
              <el-col :span="24">
                <div style="display: flex;">
                  <el-form-item label="封面图" prop="coverfile">
                    <image-upload v-model="form.coverfile" :limit="1" />
                  </el-form-item>
                  <div style="display: flex; flex-direction: column;">
                    <el-form-item label="审核" prop="shelve" v-hasPermi="['tfw:admin:operate ']">
                      <el-switch v-model="form.shelve" active-text="通过" inactive-text="不同过" active-value="0"
                        inactive-value="1">
                      </el-switch>
                    </el-form-item>
                    <el-form-item label="楼盘状态" prop="status">
                      <el-radio-group v-model="form.status">
                        <el-radio v-for="dict in dict.type.tfw_property_status" :key="dict.value"
                          :label="parseInt(dict.value)">{{ dict.label }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="推荐等级" prop="recommend">
                      <el-rate v-model="form.recommend" show-text :max=3 :texts="['一般', '精良', '优质']">
                      </el-rate>
                    </el-form-item>
                  </div>
                </div>

              </el-col>
              <el-col :span="24">
                <el-form-item label="分类" prop="type">
                  <el-select v-model="form.type" placeholder="请选择">
                    <el-option v-for="dict in dict.type.tfw_new_old" :key="dict.value" :label="dict.label"
                      :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="楼盘名称" prop="title">
                  <el-autocomplete v-model="form.title" :fetch-suggestions="querySearchAsync" placeholder="请输入小区名"
                    @select="handleSelect" :debounce=500>
                  </el-autocomplete>
                  <el-tag type="danger" v-if="isShowmessage">已有小区</el-tag>
                </el-form-item>
                <el-form-item label="参考均价" prop="refPrice">
                  <el-input v-model="form.refPrice" placeholder="请输入参考均价">
                    <i slot="suffix" style="font-style:normal;margin-right: 20px;">万</i>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-card>

            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">地址信息</span>
              </div>
              <el-col :span="24">
                <el-form-item label="省市区街道" prop="">
                  <StateCityDistrictStreetSelector :placeholder="'请选择省市区街道'" v-model="regioncode" :ssqldList="ssqldList"
                    :type="'id'" :value="regioncode" />
                </el-form-item>

                <el-form-item label="片区备注" prop="zoneCode">
                  <el-input v-model="form.zoneCode" placeholder="片区备注" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="楼盘详细地址" prop="lon">
                  <el-input v-model="form.address" placeholder="请输入经度" />
                </el-form-item>

                <el-form-item label="经度" prop="lon">
                  <el-input v-model="form.lon" placeholder="请输入经度" />
                </el-form-item>
                <el-form-item label="纬度" prop="lat">
                  <el-input v-model="form.lat" placeholder="请输入纬度" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="mapsearch">选择经纬度</el-button>
                </el-form-item>
                <mapsearch v-if="mapshow" @comfig="choosemap" @cancel="cancelmap"></mapsearch>
              </el-col>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">小区信息</span>
              </div>
              <el-col :span="24">
                <el-form-item label="总户数" prop="totalHouseholds">
                  <el-input v-model="form.totalHouseholds" placeholder="请输入总户数" />
                </el-form-item>
                <el-form-item label="总栋数" prop="totalBuilding">
                  <el-input v-model="form.totalBuilding" placeholder="请输入总栋数" />
                </el-form-item>
                <el-form-item label="容积率" prop="plotRatio">
                  <el-input v-model="form.plotRatio" placeholder="请输入容积率">
                    <i slot="suffix" style="font-style:normal;margin-right: 20px;">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="绿化率" prop="forestationRate">
                  <el-input v-model="form.forestationRate" placeholder="请输入绿化率">
                    <i slot="suffix" style="font-style:normal;margin-right: 20px;">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="停车位" prop="parkingPlace">
                  <el-input v-model="form.parkingPlace" placeholder="请输入停车位个数">
                    <i slot="suffix" style="font-style:normal;margin-right: 20px;">个</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="层高" prop="floorHigh">
                  <el-input v-model="form.floorHigh" placeholder="请输入楼层高" />
                </el-form-item>
                <el-form-item label="停车月费" prop="monthlyParkingFee">
                  <el-input v-model="form.monthlyParkingFee" placeholder="请输入停车月费">
                    <i slot="suffix" style="font-style:normal;margin-right: 20px;">元</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="物业费" prop="serviceCharge">
                  <el-input v-model="form.serviceCharge" placeholder="请输入物业费">
                    <i slot="suffix" style="font-style:normal;margin-right: 20px;">元/每平米</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="预售编号" prop="presalePermitNo">
                  <el-input v-model="form.presalePermitNo" placeholder="请输入预售证编号" />
                </el-form-item>
                <el-form-item label="建成年代" prop="completed">
                  <el-date-picker v-model="form.completed" type="year" placeholder="选择年">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="开盘时间" prop="openDate">
                  <el-date-picker v-model="form.openDate" type="year" placeholder="选择年">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.sort" label="年限" prop="sort">
                  <el-checkbox-group v-model="form.sort">
                    <el-checkbox v-for="dict in dict.type.tfw_property_rights" :key="dict.value" :label="dict.value"> {{
      dict.label
    }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>

              <el-col :span="24">
                <el-form-item v-if="form.propertyType" label="物业类型" prop="propertyType">
                  <el-checkbox-group v-model="form.propertyType" :max=3>
                    <el-checkbox v-for="dict in dict.type.tfw_property_type" :key="dict.value" :label="dict.value"> {{
      dict.label
    }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item v-if="form.featuredTags" label="特色标签" prop="featuredTags">
                  <el-checkbox-group v-model="form.featuredTags" :max=3>
                    <el-checkbox v-for="dict in dict.type.tfw_featured_tags" :key="dict.value" :label="dict.value"> {{
      dict.label
    }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-card>

          </el-tab-pane>
          <!-- 详细介绍 -->
          <el-tab-pane label="详细介绍" name="second">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">开发信息</span>
              </div>
              <el-col :span="24">
                <el-form-item label="所有权" prop="propertyRights">
                  <el-select v-model="form.propertyRights" placeholder="请选择">
                    <el-option v-for="dict in dict.type.tfw_loupan_propertyrights" :key="dict.value" :label="dict.label"
                      :value="dict.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="公摊比例" prop="shareRatio">
                  <el-input v-model="form.shareRatio" placeholder="请输入公摊比例">
                    <i slot="suffix" style="font-style:normal;margin-right: 20px;">%</i>
                  </el-input>
                </el-form-item>
                <el-form-item label="开发商" prop="developer">
                  <el-input v-model="form.developer" placeholder="请输入开发商" />
                </el-form-item>
                <el-form-item label="物业公司" prop="pmc">
                  <el-input v-model="form.pmc" placeholder="请输入物业公司" />
                </el-form-item>
                <el-form-item label="占地面积" prop="landArea">
                  <el-input v-model="form.landArea" placeholder="请输入占地面积">
                    <el-select v-model="form.landAreaType" slot="append" style="width:80px;">
                      <el-option label="亩" value="1">亩</el-option>
                      <el-option label="面积" value="2">面积</el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
                <el-form-item label="建筑面积" prop="buildingArea">
                  <el-input v-model="form.buildingArea" placeholder="请输入建筑面积" />
                </el-form-item>
              </el-col>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span class="cardtitlw">周边和配套</span>
              </div>
              <el-row>
                <el-form-item label="学区" prop="schoolDistrict">
                  <el-input v-model="form.schoolDistrict" placeholder="请输入学区" type="textarea" autosiz  rows="5"/>
                </el-form-item>
                <el-form-item label="周边" prop="periphery">
                  <el-input v-model="form.periphery" placeholder="请输入内容" type="textarea" autosiz rows="5"/>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="详情" prop="detail">
                  <el-input v-model="form.detail" placeholder="请输入内容" type="textarea" autosiz rows="5"/>
                </el-form-item>
                <el-form-item label="交通状况" prop="transportation">
                  <el-input v-model="form.transportation" placeholder="请输入内容" type="textarea" autosiz rows="5"/>
                </el-form-item>
              </el-row>
            </el-card>

          </el-tab-pane>
          <!-- 楼盘户型 -->
          <el-tab-pane label="楼盘户型" name="third" v-if="showhx">
            <huxing></huxing>
          </el-tab-pane>

          <!-- 楼盘合作商 -->
          <el-tab-pane label="合作商" name="fourth" v-if="showCooperate">
            <cooperate :type="4"></cooperate>
          </el-tab-pane>

          <!-- 楼盘相册 -->
          <el-tab-pane label="楼盘相册" name="fifth" v-if="showphone">
            <list-image-upload :limit="9" :isType="2" :superiorId="form.id" />
            <el-popover placement="right" title="扫码上传图片" width="220" trigger="manual" v-model="visible">
              <vue-qr :logoSrc="imageUrl" :text="qrcode" :size="200"></vue-qr>
              <el-button slot="reference" @click="qrcodeclick()">生成扫码上传图片二维码</el-button>
            </el-popover>
            <!--            <loupanxc></loupanxc>-->
          </el-tab-pane>

        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 领取人列表 -->
    <el-drawer title="领取人详情" :wrapperClosable=false :visible.sync="receiveDialog" direction="rtl" custom-class="demo-drawer"
               ref="drawer" size="45%" :destroy-on-close="true" :before-close="handleCloseReceive">
      <el-table :data="receiveData.rows" style="width: 100%" v-loading="reLoading">
        <el-table-column prop="id" label="编号" width="180"></el-table-column>
        <el-table-column prop="nickName" label="领取人" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.state === 1">审核中</span>
            <span v-else-if="scope.row.state === 100">已通过</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteReceive(scope.row)"
                       v-hasPermi="['tfw:lpxq:receivedel']">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-drawer>
  </div>
</template>

<script>
import { listLpxq, getLpxq, delLpxq, addLpxq, updateLpxq, getsubway } from '@/api/tfw/lpxq'
import { fuzzyqueries2} from '@/api/fangyuan/fangyuan'
import { qrcode } from '@/api/loupanxiangce/loupanxiangce'
import { insertReceive, deleteReceiveById, selectReceiveByXqId } from '@/api/tfw/xqRcevie'
import { getlist, getprovincelist1} from '@/api/province'
import loupanxc from '../loupanxiangce/index.vue'
import huxing from '../huxing/index.vue'
import cooperate from '/src/views/tfw/cooperate/index.vue'
import xqInfo from '/src/views/tfw/info/index.vue'
import { mapMutations } from 'vuex'
import mapsearch from '../../../components/mapsearch/tianIndex.vue'
import lookprice from '@/views/fangyuan/fangyuan/lookprice'
import looklog from '@/views/source/looklog'
import AddLook from '@/views/tfw/lpxq/addLook';
import { allCitys } from '@/utils/citysUtil'

let pcas = require('../../../assets/json/pca-code.json')
export default {
  components: {
    looklog,
    loupanxc,
    huxing,
    cooperate,
    mapsearch,
    lookprice,
    AddLook,
    xqInfo
  },
  name: 'Lpxq',
  dicts: ['tfw_property_type', 'tfw_featured_tags', 'tfw_property_status', 'tfw_ecommendation_level', 'tfw_listing_status', 'tfw_new_old', 'tfw_loupan_propertyrights', 'tfw_property_rights'],
  data() {
    return {
      regioncode: [],
      ssqldList: [],
      ssqldListIndex: [],
      imageUrl: require("../../../assets/logo/logo.png"),
      qrcode: '',
      visible: false,
      mapshow: false,
      select: '',
      // 抽屉显示
      dialog: false,
      //小区重复显示
      isShowmessage: false,
      // 模糊查询
      restaurants: [],//后端获取的数据
      state: '', //输入框输入的双向绑定的数据
      // 省市区数据
      provencrobj: 0,
      city: 0,
      area: 0,
      stree: 0,
      options: pcas,
      // 控制显示
      selectedOptions: [],
      showhx: false,
      showCooperate: false,
      showphone: false,
      showInfo: false,
      value: [],
      activeName: 'first',
      //四级联动
      cityList: [],
      provinceList: [],
      townList: [],
      streetList: [],
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
      // 楼盘小区表格数据
      lpxqList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        no: null,
        title: null,
        coverfile: null,
        video: null,
        lon: null,
        lat: null,
        scalingLevel: null,
        cityCode: null,
        provinceCode: null,
        areaCode: null,
        zoneCode: null,
        streetCode: null,
        address: null,
        refPrice: null,
        propertyType: null,
        featuredTags: null,
        propertyRights: null,
        landArea: null,
        landAreaType: null,
        buildingArea: null,
        buildingAreaType: null,
        developer: null,
        totalHouseholds: null,
        plotRatio: null,
        forestationRate: null,
        serviceCharge: null,
        pmc: null,
        parkingPlace: null,
        monthlyParkingFee: null,
        periphery: null,
        detail: null,
        schoolDistrict: null,
        subway: null,
        bus: null,
        transportation: null,
        sdp: null,
        sda: null,
        openDate: null,
        deliveryDate: null,
        presalePermitNo: null,
        realEstateConsultant: null,
        totalBuilding: null,
        shareRatio: null,
        PSR: null,
        hits: null,
        recommend: null,
        sort: null,
        shelve: null,
        type: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        createByName: null,
        completed: null,
        updateByName: null
      },
      // 表单参数
      form: {},
      //地铁列表
      subwaylist: null,
      fromlist: {},
      //搜索
      searchtitle: null,
      // 表单校验
      rules: {
        title: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        coverfile: [
          { required: true, message: '封面图不能为空', trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: '省级行政代码不能为空', trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: '市级行政代码不能为空', trigger: 'change' }
        ],
        areaCode: [
          { required: true, message: '地区行政代码不能为空', trigger: 'change' }
        ],
        zoneCode: [
          { required: true, message: '片区编码不能为空', trigger: 'change' }
        ],
        streetCode: [
          { required: true, message: '街道编码不能为空', trigger: 'change' }
        ],
        refPrice: [
          { required: true, message: '参考均价不能为空', trigger: 'blur' }
        ],
        propertyType: [
          { required: true, message: '物业类型不能为空', trigger: 'change' }
        ],
        featuredTags: [
          { required: true, message: '特色标签不能为空', trigger: 'change' }
        ],
        propertyRights: [
          { required: true, message: '所有权不能为空', trigger: 'change' }
        ],
        developer: [
          { required: true, message: '开发商不能为空', trigger: 'blur' }
        ],
        // shelve: [
        //   { required: true, message: "上架状态不能为空", trigger: "change" }
        // ],
        type: [
          { required: true, message: '分类不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '楼盘状态不能为空', trigger: 'change' }
        ]
      },
      lookpricefalg: false,
      priceid: null,
      receiveData: [],
      receiveDialog: false,
      receiveLoading: false,

      //地区选择相关
      cityState: true,
      citysList: [],
      defaultCode: [510000, 510100],
      tCityCode: '510100',
      areaList: [],
      //多负责城市处理
      userCityState: false,
      userCities: [],
      reLoading: false,
    }

  },
  created() {
    if(this.$store.state.user.userid === 1 || this.$store.state.user.userid === 116) this.cityState = false
    this.defaultCode = [this.$store.state.user.provinceCode, this.$store.state.user.cityCode];
    if(this.$store.getters.userCities.length > 0) {
      this.userCityState = true;
      this.queryParams.cityCode = this.$store.getters.userCities[0].cityId;
      this.tCityCode = this.queryParams.cityCode;
      this.userCities = this.$store.getters.userCities;
    } else {
      this.tCityCode = this.$store.state.user.cityCode;
      this.queryParams.cityCode = this.$store.state.user.cityCode;
    }

    this.getList()
    if (this.$route.query.id) {
      this.getphotos()
    }

    getlist(2).then(response => {
      const options = response.data.map(option => ({
        ...option,
        label: option.extName, // 如果 extName 不存在，则回退到 name
        value: option.id
      }));
      this.citysList = this.handleTree(options, "id", "parentId");
    })
    this.getAreaList();
    console.log(allCitys)
    this.ssqldList = this.handleTree(allCitys, "id", "parentId");
    // getlist(4).then(response => {
    //   this.ssqldList = this.handleTree(response.data, "id", "parentId");
    // })
    getlist(3).then(response => {
      this.ssqldListIndex = this.handleTree(response.data, "id", "parentId");
    })
  },
  watch: {


  },
  methods: {
    ...mapMutations('datatools', ['getid']),
    mapsearch() {
      this.mapshow = true
    },
    // 查看历史调价记录
    looksellingPrice(e) {
      this.priceid = e;
      this.lookpricefalg = true;
    },
    // 生成二维码方法
    qrcodeclick() {
      if (!this.visible) {
        // 生成二维码锁
        qrcode({ xqId: this.form.id }).then(res => {
          this.qrcode = "https://new.tianfucd.com/imageupload?id=" + this.form.id + "&isType=2"
          this.$message.success(res.msg)
        })
      }
      this.visible = !this.visible
    },
    //接受参数
    getphotos() {
      this.reset()
      this.getid(this.$route.query.id)
      getLpxq(this.$route.query.id).then(response => {
        this.form = response.data
        this.getCityList()
        this.getTownList()
        this.getStreetList()
        this.getsubwaylist()
        // 存取旧的数据
        this.provencrobj = this.form.provinceCode
        this.city = this.form.cityCode
        this.area = this.form.areaCode
        this.stree = this.form.streetCode
        // 让code被字覆盖
        this.form.streetCode = this.form.streetName
        this.form.provinceCode = this.form.provinceName
        this.form.cityCode = this.form.cityName
        this.form.areaCode = this.form.areaName
        this.form.propertyType = this.form.propertyType ? this.form.propertyType.split(',') : []
        this.form.featuredTags = this.form.featuredTags ? this.form.featuredTags.split(',') : []
        this.form.subway = this.form.subway.split(',')
        this.form.sort = this.form.sort.split(',')
        this.open = true
        this.showhx = true
        this.showCooperate = true
        this.showphone = true
        this.title = '修改楼盘小区'
        this.activeName = 'third'
      })

    },
    //选择地图
    choosemap(e) {

      this.form.lat = e.location.lat
      this.form.lon = e.location.lng
      this.form.address = e.address
      this.mapshow = false
    },
    //关闭地图
    cancelmap(e) {
      this.mapshow = e
    },
    handleClick(tab, event) {

    },
    handleChange(value) {
      this.queryParams.areaCode = null;
      if(this.userCityState) {
        this.queryParams.cityCode = this.tCityCode;
      } else {
        this.tCityCode = value[1];
        this.queryParams.cityCode = value[1];
      }

      this.getAreaList();
    },
    // 关闭详情
    handleClose() {
      this.dialog = false
      this.showhx = false
      this.showCooperate = false
      this.showphone = false
      // Object.assign(this.$data, this.$options.data());
      this.getList()
      this.getProList()
    },
    // 详情
    handleList(row) {
      this.activeName = "first"
      // this.reset();
      this.getid(row.id)
      const id = row.id || this.ids
      // 根据vuex的id来获取这行的数据
      getLpxq(id).then(response => {
        this.form = response.data

        // if (response.data.provinceCode != null) {
        //   getprovincelist2(response.data.provinceCode).then(response => {
        //     this.cityList = response.rows
        //   })
        // }
        // if (response.data.cityCode != null) {
        //
        //   getprovincelist3(response.data.cityCode).then(response => {
        //     this.townList = response.rows
        //   })
        // }
        // if (response.data.areaCode && response.data.areaCode != 0) {
        //   getstreetList(response.data.areaCode).then(response => {
        //     this.streetList = response.rows
        //   })
        // }


        this.form.propertyType = this.form.propertyType ? this.form.propertyType.split(',') : []
        this.form.featuredTags = this.form.featuredTags ? this.form.featuredTags.split(',') : []
        this.form.subway = this.form.subway.split(',')
        this.form.sort = this.form.sort.split(',')
        this.showhx = true
        this.showCooperate = true
        this.showphone = true
        this.dialog = true

      })


    },
    // 模糊查询
    querySearchAsync(queryString, cb) {
      if (queryString) {
        fuzzyqueries2(queryString, this.tCityCode).then(response => {
          this.restaurants = response.rows
          var restaurants = this.restaurants.map((terminal) => {
            return {
              value: terminal.title,
              name: terminal.id
            }
          })
          var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants
          if (results.length > 0) {
            results.forEach((obj) => {
              if (obj.value === this.form.title) {
                this.isShowmessage = true
              } else {
                this.isShowmessage = false
              }
            })
          } else {
            this.isShowmessage = false
          }
          cb(results)
        })
      }
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
      }
    },
    handleSelect(item) {
      this.form.title = item.value

    },
    handleSelect2(item) {
      this.searchtitle = item.value
    },
    //获取地铁列表
    getsubwaylist() {
      getsubway().then(res => {
        this.subwaylist = res.rows
      })
    },
    /** 查询楼盘小区列表 */
    getList() {
      this.loading = true
      this.lpxqList = []
      listLpxq(this.queryParams).then(response => {
        this.lpxqList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.activeName = 'first'
      this.reset()
      this.open = false
      this.showhx = false
      this.showCooperate = false
      this.showphone = false
      this.getList()
    },
    // 表单重置
    reset() {
      this.regioncode = []
      this.visible = false
      this.provinceList = []
      this.cityList = []
      this.townList = []
      this.streetList = []
      this.form = {
        id: null,
        no: null,
        title: null,
        coverfile: null,
        video: null,
        lon: null,
        lat: null,
        scalingLevel: null,
        provinceCode: null,
        cityCode: null,
        areaCode: null,
        zoneCode: null,
        streetCode: null,
        address: null,
        refPrice: null,
        propertyType: [],
        featuredTags: [],
        propertyRights: null,
        landArea: null,
        landAreaType: null,
        buildingArea: null,
        buildingAreaType: null,
        developer: null,
        totalHouseholds: null,
        plotRatio: null,
        forestationRate: null,
        serviceCharge: null,
        pmc: null,
        parkingPlace: null,
        monthlyParkingFee: null,
        periphery: null,
        detail: null,
        schoolDistrict: null,
        subway: [],
        bus: null,
        transportation: null,
        sdp: null,
        sda: null,
        openDate: null,
        deliveryDate: null,
        presalePermitNo: null,
        realEstateConsultant: null,
        totalBuilding: null,
        shareRatio: null,
        PSR: null,
        hits: null,
        recommend: null,
        sort: [],
        shelve: null,
        type: null,
        status: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null,
        deletedAt: null,
        remark: null,
        nickName: null,
        streetName: null,
        provinceName: null,
        cityName: null,
        areaName: null,
        completed: null,
        floorHigh: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      if (this.searchtitle) {
        this.queryParams.title = this.searchtitle
      }
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.searchtitle = null
      this.resetForm('queryForm')
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
      // Object.assign(this.$data, this.$options.data());
      this.reset()
      this.getsubwaylist()
      this.open = true
      this.title = '添加楼盘小区'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getid(row.id)
      const id = row.id || this.ids
      // 根据vuex的id来获取这行的数据
      getLpxq(id).then(response => {
        this.form = response.data
        this.regioncode = [response.data.provinceCode, response.data.cityCode, response.data.areaCode];
        if (response.data.streetCode) {
          this.regioncode.push(response.data.streetCode)
        }
        if (this.form.propertyType) {
          this.form.propertyType = this.form.propertyType.split(',')
        } else {
          this.form.propertyType = new Array()
        }
        if (this.form.featuredTags) {

          this.form.featuredTags = this.form.featuredTags.split(',')
        } else {
          this.form.featuredTags = []
        }
        if (this.form.subway) {
          this.form.subway = this.form.subway.split(',')
        } else {
          this.form.subway = []
        }
        if (this.form.sort) {
          this.form.sort = this.form.sort.split(',')
        } else {
          this.form.sort = []
        }
        this.open = true
        this.showhx = true
        this.showCooperate = true
        this.showphone = true
        this.title = '修改楼盘小区'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (this.regioncode.length === 3) {
          this.form.params = {
            streetCode: true
          }
        }
        if (this.regioncode.length === 0) {
          this.$modal.alertWarning("请填写完整省区市街道信息");
          return
        }
        if (valid) {
          this.form.propertyType = this.form.propertyType.join(',')
          this.form.featuredTags = this.form.featuredTags.join(',')
          this.form.subway = this.form.subway.join(',')
          this.form.sort = this.form.sort.join(',')
          this.form.provinceCode = this.regioncode[0]
          this.form.cityCode = this.regioncode[1]
          this.form.areaCode = this.regioncode[2]
          this.form.streetCode = this.regioncode[3]
          console.log(this.regioncode, "this.regioncode");
          console.log(this.form, "this.form");
          if (this.form.id != null) {
            updateLpxq(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.showhx = false
              this.showCooperate = false
              this.showphone = false
              // Object.assign(this.$data, this.$options.data());
              this.activeName = 'first'
              this.getList()
              this.getProList()
              this.getsubwaylist()
            })
          } else {
            addLpxq(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.showhx = false
              this.showCooperate =false
              this.showphone = false
              // 清空数据
              // Object.assign(this.$data, this.$options.data());
              // 重新获取列表
              this.getList()
              this.getProList()
              this.getsubwaylist()
            }).catch(() => {
              this.form.propertyType = this.form.propertyType.split(',')
              this.form.featuredTags = this.form.featuredTags.split(',')
              this.form.subway = this.form.subway.split(',')
              this.form.sort = this.form.sort.split(',')
            })
          }
        }
      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除楼盘小区编号为"' + ids + '"的数据项？并删除楼盘相关数据', { type: 'error' }).then(function () {
        return delLpxq(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tfw/lpxq/export', {
        ...this.queryParams
      }, `lpxq_${new Date().getTime()}.xlsx`)
    },
    //小区领取
    insertReceive(row) {
      this.receiveLoading = true
      insertReceive({
        xqId: row.id,
        state: 1,
      }).then(res => {
        this.receiveLoading = false
        this.$modal.msgSuccess(res.msg)
      });
    },
    getReceive(xqId) {
      this.reLoading = true
      selectReceiveByXqId({
        xqId: xqId
      }).then(res => {
        this.receiveData = res;
        this.reLoading = false
      });
    },
    //小区领取人员列表
    receiveList(row) {
      this.getReceive(row.id);
      this.receiveDialog = true
    },
    handleDeleteReceive(row){
      this.reLoading = true
      deleteReceiveById([row.id]).then(res => {
        this.getReceive(row.xqId);
        this.reLoading = false
      });
    },
    // 关闭详情
    handleCloseReceive() {
      this.receiveDialog = false
    },

    //获取区域列表
    getAreaList() {
      console.log("进入获取区域列表")
      getprovincelist1(this.tCityCode).then(response => {
        this.areaList = response.rows;
      });
    },
  }
}

</script>
<style>
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
  padding: 5px 20px 0 20px;
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
  font-size: 14px;
  font-weight: 500;
}

.el-descriptions {
  font-size: 12px;
  box-sizing: border-box;
  padding-left: 20px;
}

.el-input.is-disabled .el-input__inner {
  color: #010101 !important;
}

.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: black !important;
}

.el-radio__input.is-disabled.is-checked .el-radio__inner::after {
  background-color: #010101 !important;
}

.cell .el-tag {
  margin-left: 0px !important;
}

label {
  font-weight: 400;
}

.address_select {
  width: 500px;
  margin: 0 auto;
}

.address_select .select_div {
  width: 32%;
  float: left;
  margin: 10px 0;
}

.address_select .select_div:nth-child(2) {
  margin: 10px 2%;
}

.address_select select {
  height: 32px;
  width: 100%;
  margin: 0;
  display: inline-block;
  text-align: center;
}

.address_select input {
  box-sizing: border-box;
  display: inline-block;
  height: 32px;
  width: 100%;
  margin: 10px 0;
  text-align: center;
}

.el-form-item--medium .el-form-item__label {
  padding: 0 10px 0 0 !important;
}

.cardtitlw {
  font-weight: 800;
  font-size: 18px;
}

.box-card {
  width: 100%;
  margin-bottom: 20px;
}
</style>
