<template>
    <div>
        <!-- 修改房源草稿框 -->
        <el-dialog :title="title" :visible.sync="open2" width="1000px" append-to-body :close-on-click-modal="false"
            :show-close="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" label-width="90px" :inline="true">
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="基本信息" name="first">
                        <el-col :span="24">
                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="cardtitlw">核心信息</span>
                                </div>
                                <el-form-item label="小区名称" prop="xqname" size="mini">
                                    <el-autocomplete v-model="form.xqname" :fetch-suggestions="querySearchAsync"
                                        placeholder="请输入小区名称" @select="handleSelect" ref="autocompleteRef" :debounce=500
                                        style="width:130px">
                                    </el-autocomplete>
                                    <el-button type="primary" size="mini" icon="el-icon-edit" v-if="isShowmessage"
                                        @click="goadd">没有小区去添加
                                    </el-button>
                                </el-form-item>
                                <el-form-item prop="building" size="mini" style="width:110px">
                                    <el-input v-model="form.building" placeholder="几" size="mini">
                                        <template slot="append">栋</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="unit" style="width:120px" size="small">
                                    <el-input v-model="form.unit" placeholder="几" size="mini">
                                        <template slot="append">单元</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="floor" style="width:110px" size="small">
                                    <el-input v-model="form.floor" placeholder="几" size="mini">
                                        <template slot="append">层</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="roomNum" style="width:100px" size="small">
                                    <el-input v-model="form.roomNum" placeholder="几" size="mini">
                                        <template slot="append">号</template>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="物业类型" prop="propertyType" size="small">
                                    <el-checkbox-group v-model="form.propertyType" :max="1" v-if="form.propertyType">
                                        <el-checkbox v-for="     dict      in      dict.type.tfw_property_type   "
                                            :key="dict.value" :label="dict.value">
                                            {{ dict.label }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>

                                <el-card class="box-card" v-if="this.form.propertyType.includes('4')">
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

                                <el-tabs v-model="form.type">
                                    <el-tab-pane :name="dict.value" v-for="   dict    in      dict.type.tfw_rent_sale     "
                                        :key="dict.value" :label="dict.label">
                                        <!-- 售卖 -->
                                        <el-form-item label="买方佣金" prop="commission" size="mini" v-if="dict.value === '1'"
                                            :rules="'1' === form.type ? [
                                                { required: true, message: '买方佣金不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-input v-model="form.commission" placeholder="请输入买方佣金">
                                                <i slot="suffix" style="font-style:normal;margin-right: 20px;">%</i>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="售价" prop="sellingPrice" size="mini" v-if="dict.value === '1'"
                                            :rules="'1' === form.type ? [
                                                { required: true, message: '售价不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-input v-model="form.sellingPrice" placeholder="请输入售价">
                                                <i slot="suffix" style="font-style:normal;margin-right: 20px;">万</i>
                                            </el-input>
                                        </el-form-item>
                                        <!-- 出租 -->
                                        <el-form-item label="租金" prop="rental" size="mini" v-if="dict.value === '2'" :rules="'2' === form.type ? [
                                            { required: true, message: '租金不能为空', trigger: 'blur' }] : [
                                            { required: false }]
                                            ">
                                            <el-input v-model="form.rental" placeholder="请输入租金" style="width:120px" />
                                        </el-form-item>
                                        <el-form-item label="出租方式" prop="rentalMethod" size="mini" v-if="dict.value === '2'"
                                            :rules="'2' === form.type ? [
                                                { required: true, message: '出租方式不能为空', trigger: 'change' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.rentalMethod" placeholder="出租方式" style="width:150px">
                                                <el-option v-for="     item      in      czlist     " :key="item.value"
                                                    :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="最短租期" prop="shortestRentalPeriod" size="mini"
                                            v-if="dict.value === '2'" :rules="'2' === form.type ? [
                                                { required: true, message: '租期不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.shortestRentalPeriod" placeholder="最短租期">
                                                <el-option v-for="     dict      in      zqlist     " :key="dict.value"
                                                    :label="dict.label" :value="dict.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="免租时间" prop="rentFreeTime" size="mini" v-if="dict.value === '2'"
                                            :rules="'2' === form.type ? [
                                                { required: true, message: '免租时间不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.rentFreeTime" placeholder="请选择免租时间">
                                                <el-option v-for="     dict      in      mzlist     " :key="dict.value"
                                                    :label="dict.label" :value="dict.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="付款方式" prop="paymentMethod" size="mini"
                                            v-if="dict.value === '2'" :rules="'2' === form.type ? [
                                                { required: true, message: '付款方式不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.paymentMethod" placeholder="请输入付款方式">
                                                <el-option v-for="     dict      in      fklist     " :key="dict.value"
                                                    :label="dict.label" :value="dict.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 租售同步 -->
                                        <el-form-item label="佣金" prop="commission" size="mini" v-if="dict.label === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '佣金不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-input v-model="form.commission" placeholder="请输入佣金" />
                                        </el-form-item>
                                        <el-form-item label="租金" prop="rental" size="mini" v-if="dict.value === '3'" :rules="'3' === form.type ? [
                                            { required: true, message: '租金不能为空', trigger: 'blur' }] : [
                                            { required: false }]
                                            ">
                                            <el-input v-model="form.rental" placeholder="请输入租金" />
                                        </el-form-item>
                                        <el-form-item label="售价" prop="sellingPrice" size="mini" v-if="dict.value === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '售价不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-input v-model="form.sellingPrice" placeholder="请输入售价" />
                                        </el-form-item>
                                        <el-form-item label="付款方式" prop="paymentMethod" size="mini"
                                            v-if="dict.value === '3'" :rules="'3' === form.type ? [
                                                { required: true, message: '付款方式不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.paymentMethod" placeholder="付款方式">
                                                <el-option v-for="     dict      in      fklist     " :key="dict.value"
                                                    :label="dict.label" :value="dict.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="出租方式" prop="rentalMethod" size="mini" v-if="dict.value === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '出租方式不能为空', trigger: 'change' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.rentalMethod" placeholder="出租方式">
                                                <el-option v-for="     item      in      czlist     " :key="item.value"
                                                    :label="item.label" :value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="最短租期" prop="shortestRentalPeriod" size="mini"
                                            v-if="dict.value === '3'" :rules="'3' === form.type ? [
                                                { required: true, message: '租期不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.shortestRentalPeriod" placeholder="最短租期">
                                                <el-option v-for="     dict      in      zqlist     " :key="dict.value"
                                                    :label="dict.label" :value="dict.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="免租时间" prop="rentFreeTime" size="mini" v-if="dict.value === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '免租时间不能为空', trigger: 'blur' }] : [
                                                { required: false }]
                                                ">
                                            <el-select v-model="form.rentFreeTime" placeholder="免租时间">
                                                <el-option v-for="     dict      in      mzlist     " :key="dict.value"
                                                    :label="dict.label" :value="dict.value"></el-option>
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
                                <el-form-item v-for="(   domain, index   ) in    form.phoneNumber   "
                                    :label="'业主' + (index + 1)" :key="domain.key" :prop="'phoneNumber.' + index + '.value'">
                                    <el-form :model="domain" :rules=rules.phoneNumber ref="domain">
                                        <el-form-item prop="type">
                                            <el-select v-model="domain.type" placeholder="请选择关系" size="mini"
                                                style="width:150px;padding-right:10px ;">
                                                <el-option v-for="    dict    in    dict.type.tfw_yzgx   " :key="dict.value"
                                                    :label="dict.label" :value="dict.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item prop="name">
                                            <el-input v-model="domain.name" style="width:150px;padding-right:10px ;"
                                                placeholder="请输入姓名" size="mini"></el-input>
                                        </el-form-item>
                                        <el-form-item prop="value">
                                            <el-input v-model="domain.value" style="width:150px;padding-right:10px ;"
                                                placeholder="请输入电话" size="mini"></el-input>
                                        </el-form-item>
                                        <el-button @click.prevent="removeDomain(domain)" type="danger"
                                            size="mini">删除</el-button>
                                    </el-form>
                                </el-form-item>
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
                                    <el-select v-model="form.huxingId" placeholder="请选择户型图" filterable
                                        @click.native="clickhx" ref="input">
                                        <el-option v-for="   item    in    options   " :key="item.id" :label="item.title"
                                            :value="item.id">
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
                                                        <el-option
                                                            v-for="   dict    in    dict.type.tfw_housing_orientation   "
                                                            :key="dict.value" :label="dict.label" :value="dict.value">
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
                                    <image-upload v-model="form.coverfile" :limit=3 />
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
                                            <el-checkbox v-for="   dict    in    dict.type.tfw_featured_tags   "
                                                :key="dict.value" :label="dict.value">
                                                {{ dict.label }}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-col>
                                <el-form-item label="是否新房" prop="ifNewHouse" size="small">
                                    <el-select v-model="form.ifNewHouse" placeholder="请选择是否新房">
                                        <el-option v-for="    dict    in    dict.type.tfw_new_old   " :key="dict.value"
                                            :label="dict.label" :value="dict.value"></el-option>
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
                                    <el-option v-for="     dict      in      dict.type.tfw_property_ownership     "
                                        :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="产权日期" prop="titleDeedDate" size="mini">
                                <el-date-picker clearable v-model="form.titleDeedDate" type="date" value-format="yyyy-MM-dd"
                                    placeholder="请选择产权日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="产权年限" prop="ownershipYears" size="mini">
                                <el-select v-model="form.ownershipYears" placeholder="请选择产权年限">
                                    <el-option v-for="     dict      in      dict.type.tfw_property_rights     "
                                        :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
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
                                    <el-select v-model="form.heating" placeholder="请选择供暖">
                                        <el-option v-for="     dict      in      dict.type.tfw_heating_type     "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="朝向" prop="orientation" size="mini">
                                    <el-select v-model="form.orientation" placeholder="请选择朝向">
                                        <el-option v-for="     dict      in      dict.type.tfw_housing_orientation     "
                                            :key="dict.value" :label="dict.label" :value="parseInt(dict.value)"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item prop="totalFloor" size="mini" label="总楼层">
                                    <el-input v-model="form.totalFloor" placeholder="请输入总楼层">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="房屋结构" prop="structure" size="mini">
                                    <el-select v-model="form.structure" placeholder="请选择房屋结构">
                                        <el-option v-for="     dict      in      dict.type.tfw_house_structure     "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="房源评级" prop="grade" size="mini">
                                    <el-select v-model="form.grade" placeholder="请选择房源评级">
                                        <el-option v-for="     dict      in      dict.type.tfw_ecommendation_level     "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="电梯情况" prop="lift" size="mini">
                                    <el-select v-model="form.lift" placeholder="请选择电梯情况">
                                        <el-option v-for="     dict      in      dict.type.tfw_elevator_situation     "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
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
                                        <el-option v-for="     dict      in      dict.type.tfw_decoration_situation     "
                                            :key="dict.value" :label="dict.label" :value="parseInt(dict.value)">
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
                                <el-form-item label="是否唯一" prop="ifOnly" size="mini">
                                    <el-select v-model="form.ifOnly" placeholder="是否唯一">
                                        <el-option v-for="     dict      in      dict.type.tfw_sfwy     " :key="dict.value"
                                            :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="公司注册" prop="ifIncorporation" size="mini">
                                    <el-input v-model="form.ifIncorporation" placeholder="请输入公司注册" />
                                </el-form-item>
                                <el-form-item label="是否公盘" prop="ifPublic" size="mini">
                                    <el-select v-model="form.ifPublic" placeholder="是否公盘">
                                        <el-option v-for="     dict      in      dict.type.twf_sfgp     " :key="dict.value"
                                            :label="dict.label" :value="parseInt(dict.value)">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-card>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span class="cardtitlw">委托与看房</span>
                            </div>
                            <el-form-item label="委托方式" prop="entrustmentMethod" size="mini">
                                <el-select v-model="form.entrustmentMethod" placeholder="请选择委托方式">
                                    <el-option v-for="     dict      in      dict.type.tfw_entrustment_method     "
                                        :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="委托来源" prop="entrustmentSource" size="mini">
                                <el-select v-model="form.entrustmentSource" placeholder="请选择委托来源">
                                    <el-option v-for="     dict      in      dict.type.tfw_source_commission     "
                                        :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                </el-select>
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
                                <el-input v-model="form.topSort" placeholder="请输入置顶序号" style="width:60px" />
                            </el-form-item>
                            <el-form-item label="是否为平台租房" prop="ifPlatform" size="mini" label-width="120px">
                                <el-select v-model="form.ifPlatform" placeholder="是否为平台租房" style="width:80px">
                                    <el-option v-for="     dict      in      dict.type.tfw_ptjf     " :key="dict.value"
                                        :label="dict.label" :value="parseInt(dict.value)">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否全站推荐" prop="ifRecommend" size="mini" label-width="100px">
                                <el-input v-model="form.ifRecommend" placeholder="请输入是否全站推荐" style="width:140px" />
                            </el-form-item>
                        </el-card>
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span class="cardtitlw">详情与推荐</span>
                            </div>
                            <el-col :span="24">
                                <el-form-item label="房源详情" prop="detailed" size="mini">
                                    <el-input v-model="form.detailed" type="textarea" placeholder="请输入内容" maxlength="300"
                                        show-word-limit :autosize="{ minRows: 4, maxRows: 6 }" style="width: 600px" />
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="房源特色" prop="features" size="mini">
                                    <el-input v-model="form.features" placeholder="请输入房源特色" maxlength="60" show-word-limit
                                        :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" style="width: 600px" />
                                </el-form-item>
                            </el-col>
                        </el-card>
                        <div class="footerbox">
                            <el-button type="primary" @click="submitaudit">提交审核</el-button>
                            <el-button type="primary" @click="nextthird">下一步</el-button>
                            <el-button type="primary" @click="savedraftsbox">保存信息</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
                    </el-tab-pane>
                    <!--房源照片  -->
                    <el-tab-pane label="房源照片" name="fourth" v-if="showphone">
                        <housephotos></housephotos>
                        <div class="footerbox">
                            <el-button type="primary" @click="submitaudit">提交审核</el-button>
                            <el-button type="primary" @click="savedraftsbox">保存信息</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            open2: false,
            activeName: 'first',
            form: {
                propertyType: [],
            },
        }
    }
}
</script>

<style lang="less" scoped></style>
