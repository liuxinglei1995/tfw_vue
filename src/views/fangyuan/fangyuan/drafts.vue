<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
                    v-hasPermi="['system:follow:add']">新增</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
                    v-hasPermi="['system:follow:edit']">修改</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
                    v-hasPermi="['system:follow:remove']">删除</el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
                    v-hasPermi="['system:follow:export']">导出</el-button>
            </el-col>
        </el-row>
        <!-- 展示列表 -->
        <el-table v-loading="loading" :data="fangyuanList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="编号" align="center" prop="id" />
            <el-table-column label="审核状态" align="center" prop="status">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.tfw_status" :value="scope.row.status" />
                </template>
            </el-table-column>
            <el-table-column label="几栋" align="center" prop="building" />
            <el-table-column label="位于哪个单元" align="center" prop="unit" />
            <el-table-column label="第几层" align="center" prop="floor" />
            <el-table-column label="房号" align="center" prop="roomNum" />
            <el-table-column label="租售类型" align="center" prop="type">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.tfw_rent_sale" :value="scope.row.type" />
                </template>
            </el-table-column>
            <el-table-column label="是否新房" align="center" prop="ifNewHouse">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.tfw_new_old" :value="scope.row.ifNewHouse" />
                </template>
            </el-table-column>
            <el-table-column label="物业类型" align="center" prop="propertyType">
                <template slot-scope="scope">
                    <dict-tag :options="dict.type.tfw_property_type"
                        :value="scope.row.propertyType ? scope.row.propertyType.split(',') : []" />
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                        v-hasPermi="['system:follow:edit']">修改</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:follow:remove']">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />

        <!-- 添加房源草稿箱对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false"
            :show-close="false" :close-on-press-escape="false">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="小区名称" prop="xqname">
                    <el-autocomplete v-model="form.xqname" :fetch-suggestions="querySearchAsync" placeholder="请输入小区名称"
                        @select="handleSelect" ref="autocompleteRef" :debounce=500>
                    </el-autocomplete>
                    <el-button type="primary" icon="el-icon-edit" v-if="isShowmessage" @click="goadd">没有小区去添加
                    </el-button>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题" />
                </el-form-item>
                <el-form-item label="几栋" prop="building">
                    <el-input v-model="form.building" placeholder="请输入几栋">
                        <template slot="append">栋</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="几单元" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入位于哪个单元">
                        <template slot="append">单元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="几层" prop="floor">
                    <el-input v-model="form.floor" placeholder="请输入第几层">
                        <template slot="append">层</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="几号" prop="roomNum">
                    <el-input v-model="form.roomNum" placeholder="请输入房号">
                        <template slot="append">号</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="业主姓名" prop="homeowner">
                    <el-input v-model="form.homeowner" placeholder="请输入业主姓名">
                    </el-input>
                </el-form-item>
                <el-form-item label="业主电话" prop="phoneNumber">
                    <el-input v-model="form.phoneNumber" placeholder="请输入业主电话">
                    </el-input>
                </el-form-item>
                <el-form-item label="物业类型" prop="propertyType">
                    <el-checkbox-group v-model="form.propertyType" :max="3">
                        <el-checkbox v-for="  dict   in   dict.type.tfw_property_type" :key="dict.value"
                            :label="dict.value">
                            {{ dict.label }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="是否新房" prop="ifNewHouse">
                    <el-select v-model="form.ifNewHouse" placeholder="请选择是否新房">
                        <el-option v-for=" dict in dict.type.tfw_new_old" :key="dict.value" :label="dict.label"
                            :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="租售类型" prop="type">
                    <el-select v-model="form.type" placeholder="请选择租售类型">
                        <el-option v-for=" dict in dict.type.tfw_rent_sale" :key="dict.value" :label="dict.label"
                            :value="dict.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitForm" :disabled="isShowmessage">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

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
                                    <el-checkbox-group v-model="form.propertyType" :max="3">
                                        <el-checkbox v-for="  dict   in   dict.type.tfw_property_type" :key="dict.value"
                                            :label="dict.value">
                                            {{ dict.label }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-tabs v-model="form.type">
                                    <el-tab-pane :name="dict.value" v-for="dict in   dict.type.tfw_rent_sale  "
                                        :key="dict.value" :label="dict.label">
                                        <!-- 售卖 -->
                                        <el-form-item label="佣金" prop="commission" size="mini" v-if="dict.value === '1'"
                                            :rules="'1' === form.type ? [
                                                { required: true, message: '佣金不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-input v-model="form.commission" placeholder="请输入佣金">
                                                <i slot="suffix" style="font-style:normal;margin-right: 20px;">%</i>
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item label="售价" prop="sellingPrice" size="mini" v-if="dict.value === '1'"
                                            :rules="'1' === form.type ? [
                                                { required: true, message: '售价不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-input v-model="form.sellingPrice" placeholder="请输入售价">
                                                <i slot="suffix" style="font-style:normal;margin-right: 20px;">万</i>
                                            </el-input>
                                        </el-form-item>
                                        <!-- 出租 -->
                                        <el-form-item label="租金" prop="rental" size="mini" v-if="dict.value === '2'" :rules="'2' === form.type ? [
                                            { required: true, message: '租金不能为空', trigger: 'blur' }] : [
                                            { required: false }]">
                                            <el-input v-model="form.rental" placeholder="请输入租金" style="width:120px" />
                                        </el-form-item>
                                        <el-form-item label="出租方式" prop="rentalMethod" size="mini" v-if="dict.value === '2'"
                                            :rules="'2' === form.type ? [
                                                { required: true, message: '出租方式不能为空', trigger: 'change' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.rentalMethod" placeholder="出租方式" style="width:150px">
                                                <el-option v-for="  dict   in   czlist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="最短租期" prop="shortestRentalPeriod" size="mini"
                                            v-if="dict.value === '2'" :rules="'2' === form.type ? [
                                                { required: true, message: '租期不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.shortestRentalPeriod" placeholder="最短租期">
                                                <el-option v-for="  dict   in   zqlist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="免租时间" prop="rentFreeTime" size="mini" v-if="dict.value === '2'"
                                            :rules="'2' === form.type ? [
                                                { required: true, message: '免租时间不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.rentFreeTime" placeholder="请选择免租时间">
                                                <el-option v-for="  dict   in   mzlist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="付款方式" prop="paymentMethod" size="mini"
                                            v-if="dict.value === '2'" :rules="'2' === form.type ? [
                                                { required: true, message: '付款方式不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.paymentMethod" placeholder="请输入付款方式">
                                                <el-option v-for="  dict   in   fklist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <!-- 租售同步 -->
                                        <el-form-item label="佣金" prop="commission" size="mini" v-if="dict.label === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '佣金不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-input v-model="form.commission" placeholder="请输入佣金" />
                                        </el-form-item>
                                        <el-form-item label="租金" prop="rental" size="mini" v-if="dict.value === '3'" :rules="'3' === form.type ? [
                                            { required: true, message: '租金不能为空', trigger: 'blur' }] : [
                                            { required: false }]">
                                            <el-input v-model="form.rental" placeholder="请输入租金" />
                                        </el-form-item>
                                        <el-form-item label="售价" prop="sellingPrice" size="mini" v-if="dict.value === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '售价不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-input v-model="form.sellingPrice" placeholder="请输入售价" />
                                        </el-form-item>
                                        <el-form-item label="付款方式" prop="paymentMethod" size="mini"
                                            v-if="dict.value === '3'" :rules="'3' === form.type ? [
                                                { required: true, message: '付款方式不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.paymentMethod" placeholder="付款方式">
                                                <el-option v-for="  dict   in   fklist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="出租方式" prop="rentalMethod" size="mini" v-if="dict.value === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '出租方式不能为空', trigger: 'change' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.rentalMethod" placeholder="出租方式">
                                                <el-option v-for="  dict   in   czlist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="最短租期" prop="shortestRentalPeriod" size="mini"
                                            v-if="dict.value === '3'" :rules="'3' === form.type ? [
                                                { required: true, message: '租期不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.shortestRentalPeriod" placeholder="最短租期">
                                                <el-option v-for="  dict   in   zqlist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="免租时间" prop="rentFreeTime" size="mini" v-if="dict.value === '3'"
                                            :rules="'3' === form.type ? [
                                                { required: true, message: '免租时间不能为空', trigger: 'blur' }] : [
                                                { required: false }]">
                                            <el-select v-model="form.rentFreeTime" placeholder="免租时间">
                                                <el-option v-for="  dict   in   mzlist  " :key="dict.value"
                                                    :label="dict.label" :value="dict.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-tab-pane>
                                </el-tabs>
                            </el-card>

                            <el-card class="box-card">
                                <div slot="header" class="clearfix">
                                    <span class="cardtitlw">业主信息</span>
                                </div>
                                <el-form-item prop="homeowner" size="small" label="业主">
                                    <el-input v-model="form.homeowner" placeholder="请输入姓名">
                                    </el-input>
                                </el-form-item>
                                <el-form-item prop="phoneNumber" size="small" label="电话">
                                    <el-input v-model="form.phoneNumber" placeholder="请输入电话">
                                    </el-input>
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
                                        <el-option v-for="item in options" :key="item.id" :label="item.title"
                                            :value="item.id">
                                            <template>
                                                <el-row type="flex" :gutter="20" justify="center">
                                                    <el-col :span="4">
                                                        <image-preview :src="item.img" width="30px" height="30px" />
                                                    </el-col>
                                                    <el-col :span="16">
                                                        <span>{{ item.title }}</span>
                                                    </el-col>
                                                </el-row>
                                            </template>
                                        </el-option>
                                    </el-select>
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
                                <el-form-item label="预估面积" prop="giveAwayArea" size="small">
                                    <el-input v-model="form.giveAwayArea" placeholder="请输入预估面积" style="width:170px">
                                        <i slot="suffix" style="font-style:normal;margin-right: 10px;">㎡</i>
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="封面图" prop="coverfile" size="small">
                                    <image-upload v-model="form.coverfile" />
                                </el-form-item>
                                <el-form-item label="产权证图片" prop="titleDeeds" size="small">
                                    <image-upload v-model="form.titleDeeds" />
                                </el-form-item>
                                <el-form-item label="房屋视频" prop="video" size="small">
                                    <videoUpload v-model="form.video" />
                                </el-form-item>
                                <el-col :span="24">
                                    <el-form-item label="店铺标签" prop="featuredTags" size="small">
                                        <el-checkbox-group v-model="form.featuredTags" :max="3">
                                            <el-checkbox v-for="dict in dict.type.tfw_featured_tags" :key="dict.value"
                                                :label="dict.value">
                                                {{ dict.label }}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </el-col>
                                <el-form-item label="是否新房" prop="ifNewHouse" size="small">
                                    <el-select v-model="form.ifNewHouse" placeholder="请选择是否新房">
                                        <el-option v-for=" dict in dict.type.tfw_new_old" :key="dict.value"
                                            :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-card>
                        </el-col>

                        <div class="footerbox">
                            <el-button type="primary" @click="savedraftsbox">保存草稿箱</el-button>
                            <el-button type="primary" @click="nextfn">下一页</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
                    </el-tab-pane>
                    <!-- 详细信息 -->
                    <el-tab-pane label="详细信息" name="second">
                        <!-- <el-form-item label="交易权属" prop="transactionOwnership">
                <el-input v-model="form.transactionOwnership" placeholder="请输入交易权属" />
              </el-form-item> -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span class="cardtitlw">产权信息</span>
                            </div>
                            <el-form-item label="产权所有" prop="equityOwnership" size="mini">
                                <el-select v-model="form.equityOwnership" placeholder="请选择产权所有">
                                    <el-option v-for="  dict   in   dict.type.tfw_property_ownership  " :key="dict.value"
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
                                    <el-option v-for="  dict   in   dict.type.tfw_property_rights  " :key="dict.value"
                                        :label="dict.label" :value="dict.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="拿证日期" prop="housingPeriod" size="mini">
                                <el-date-picker clearable v-model="form.housingPeriod" type="date" value-format="yyyy-MM-dd"
                                    placeholder="请选择拿证日期">
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
                                        <el-option v-for="  dict   in   dict.type.tfw_heating_type  " :key="dict.value"
                                            :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="朝向" prop="orientation" size="mini">
                                    <el-select v-model="form.orientation" placeholder="请选择朝向">
                                        <el-option v-for="  dict   in   dict.type.tfw_housing_orientation  "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="房屋结构" prop="structure" size="mini">
                                    <el-select v-model="form.structure" placeholder="请选择房屋结构">
                                        <el-option v-for="  dict   in   dict.type.tfw_house_structure  " :key="dict.value"
                                            :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="房源评级" prop="grade" size="mini">
                                    <el-select v-model="form.grade" placeholder="请选择房源评级">
                                        <el-option v-for="  dict   in   dict.type.tfw_ecommendation_level  "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="电梯情况" prop="lift" size="mini">
                                    <el-select v-model="form.lift" placeholder="请选择电梯情况">
                                        <el-option v-for="  dict   in   dict.type.tfw_elevator_situation  "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="用电类型" prop="powerType" size="mini">
                                    <el-select v-model="form.powerType" placeholder="请选择用电类型">
                                        <el-option v-for="  dict   in   dict.type.tfw_electricity_consumption  "
                                            :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="装修情况" prop="decoration" size="mini">
                                    <el-select v-model="form.decoration" placeholder="请选择朝向">
                                        <el-option v-for="  dict   in   dict.type.tfw_decoration_situation  "
                                            :key="dict.value" :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="房屋现况" prop="statusQuo" size="mini">
                                    <el-select v-model="form.statusQuo" placeholder="请选择房屋现状">
                                        <el-option v-for="  dict   in   dict.type.twf_fwxz  " :key="dict.value"
                                            :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="是否唯一" prop="ifOnly" size="mini">
                                    <el-select v-model="form.ifOnly" placeholder="是否唯一">
                                        <el-option v-for="  dict   in   dict.type.tfw_sfwy  " :key="dict.value"
                                            :label="dict.label" :value="dict.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="公司注册" prop="ifIncorporation" size="mini">
                                    <el-input v-model="form.ifIncorporation" placeholder="请输入公司注册" />
                                </el-form-item>
                                <el-form-item label="是否公盘" prop="ifPublic" size="mini">
                                    <el-select v-model="form.ifPublic" placeholder="是否公盘">
                                        <el-option v-for="  dict   in   dict.type.twf_sfgp  " :key="dict.value"
                                            :label="dict.label" :value="parseInt(dict.value)">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-card>

                        <!-- <el-form-item label="总单元数" prop="totalUnit">
                <el-input v-model="form.totalUnit" placeholder="请输入总单元数" />
              </el-form-item>
              <el-form-item label="共几层" prop="totalFloor">
                <el-input v-model="form.totalFloor" placeholder="请输入共几层" />
              </el-form-item>
              <el-form-item label="楼层高" prop="floorHigh">
                <el-input v-model="form.floorHigh" placeholder="请输入楼层高" />
              </el-form-item>
              <el-form-item label="梯" prop="elevator">
                <el-input v-model="form.elevator" placeholder="请输入梯" />
              </el-form-item>
              <el-form-item label="户" prop="suites">
                <el-input v-model="form.suites" placeholder="请输入户" />
              </el-form-item> -->

                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span class="cardtitlw">委托与看房</span>
                            </div>
                            <el-form-item label="委托方式" prop="entrustmentMethod" size="mini">
                                <el-select v-model="form.entrustmentMethod" placeholder="请选择委托方式">
                                    <el-option v-for="  dict   in   dict.type.tfw_entrustment_method  " :key="dict.value"
                                        :label="dict.label" :value="dict.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="委托来源" prop="entrustmentSource" size="mini">
                                <el-select v-model="form.entrustmentSource" placeholder="请选择委托来源">
                                    <el-option v-for="  dict   in   dict.type.tfw_source_commission  " :key="dict.value"
                                        :label="dict.label" :value="dict.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="看房方式" prop="kfang" size="mini">
                                <el-select v-model="form.kfang" placeholder="看房方式">
                                    <el-option v-for="  dict   in   dict.type.tfw_kffs  " :key="dict.value"
                                        :label="dict.label" :value="dict.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-card>

                        <!-- <el-form-item label="房源点击量" prop="hits">
                <el-input v-model="form.hits" placeholder="请输入房源点击量" />
              </el-form-item> -->
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span class="cardtitlw">商铺信息</span>
                            </div>
                            <el-form-item label="商铺" prop="businessLevel" size="mini">
                                <el-input v-model="form.businessLevel" placeholder="请输入商铺" />
                            </el-form-item>
                            <el-form-item label="开间距离" prop="bay" size="mini">
                                <el-input v-model="form.bay" placeholder="请输入开间距离" />
                            </el-form-item>
                            <el-form-item label="近身距离(商铺)" prop="depth" size="mini">
                                <el-input v-model="form.depth" placeholder="请输入近身距离(商铺)" />
                            </el-form-item>
                        </el-card>

                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span class="cardtitlw">置顶与推荐</span>
                            </div>
                            <el-form-item label="置顶序号" prop="topSort" size="mini">
                                <el-input v-model="form.topSort" placeholder="请输入置顶序号" />
                            </el-form-item>
                            <el-form-item label="置顶到期时间" prop="topExpiryTime" size="mini">
                                <el-date-picker clearable v-model="form.topExpiryTime" type="date" value-format="yyyy-MM-dd"
                                    placeholder="请选择置顶到期时间">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="是否为平台租房" prop="ifPlatform" size="mini">
                                <el-select v-model="form.ifPlatform" placeholder="是否为平台租房">
                                    <el-option v-for="  dict   in   dict.type.tfw_ptjf  " :key="dict.value"
                                        :label="dict.label" :value="parseInt(dict.value)">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="是否全站推荐" prop="ifRecommend" size="mini">
                                <el-input v-model="form.ifRecommend" placeholder="请输入是否全站推荐" />
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
                            <el-button type="primary" @click="savedraftsbox">保存草稿箱</el-button>
                            <el-button @click="cancel">取 消</el-button>
                        </div>
                    </el-tab-pane>

                </el-tabs>
            </el-form>

        </el-dialog>
    </div>
</template>


<script>
import {
    getdraftsList,
    addFangyuan,
    updateFangyuan,
    fuzzyqueries,
    listFangyuan,
    getFangyuan,
    listHuxing,
    delFangyuan
} from '@/api/fangyuan/fangyuan'

export default {
    name: "Follow",
    dicts: ['tfw_rent_sale', 'tfw_ecommendation_level', 'tfw_entrustment_method', 'tfw_source_commission', 'tfw_housing_orientation', 'tfw_electricity_consumption', 'tfw_featured_tags', 'tfw_house_structure', 'tfw_mortgage_situation', 'tfw_new_old', 'tfw_property_type', 'tfw_property_ownership', 'tfw_heating_type', 'tfw_elevator_situation', 'tfw_czlx', 'tfw_mzsj', 'tfw_zdzq', 'tfw_czr', 'tfw_fkfs', 'tfw_cqnx', 'tfw_decoration_situation', 'twf_fwxz', 'tfw_sfwy', 'tfw_kffs', 'twf_sfgp', 'tfw_ptjf', 'tfw_property_rights', "tfw_arear", "tfw_prices", "tfw_fuxing", "tfw_status"],
    data() {
        return {
            showfollow: false,
            showphone: false,
            activeName: 'first',
            zushou: '售卖',
            chuzu: '出租',
            zstb: '租售同步',
            //出租类型
            czlist: [
                {
                    value: 0,
                    label: '整租'
                },
                {
                    value: 1,
                    label: '单租'
                },
                {
                    value: 2,
                    label: '分租'
                }
            ],
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
                    label: '季度'
                },
                {
                    value: 1,
                    label: '半年'
                },
                {
                    value: 2,
                    label: '年付'
                }
            ],
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
            // 显示搜索条件
            showSearch: false,
            // 总条数
            total: 0,
            // 房源表格数据
            fangyuanList: [],
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            open2: false,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                status: 6,
            },
            //没有小区显示
            isShowmessage: true,
            // 表单参数
            form: {},
            // 表单校验
            rules: {

            },
            // 提交审核表单验证
            // 表单校验
            rules2: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                // commission: [
                //   { required: true, message: "佣金不能为空", trigger: "blur" }
                // ],
                huxingId: [
                    { required: true, message: '户型ID不能为空', trigger: 'blur' }
                ],
                oldHuxingId: [
                    { required: true, message: '原户型ID不能为空', trigger: 'blur' }
                ],
                coverfile: [
                    { required: true, message: '封面图不能为空', trigger: 'blur' }
                ],
                featuredTags: [
                    { required: true, message: '店铺推荐标签不能为空', trigger: 'change' }
                ],
                ifNewHouse: [
                    { required: true, message: '是否新房不能为空', trigger: 'change' }
                ],
                type: [
                    { required: true, message: '租售类型不能为空', trigger: 'change' }
                ],
                propertyType: [
                    { required: true, message: '物业类型不能为空', trigger: 'change' }
                ],
                propertyArea: [
                    { required: true, message: '产权面积不能为空', trigger: 'blur' }
                ],
                usableArea: [
                    { required: true, message: '套内面积不能为空', trigger: 'blur' }
                ],
                giveAwayArea: [
                    { required: true, message: '赠送面积不能为空', trigger: 'blur' }
                ],
                equityOwnership: [
                    { required: true, message: '产权所有不能为空', trigger: 'change' }
                ],
                titleDeedDate: [
                    { required: true, message: '产权日期不能为空', trigger: 'blur' }
                ],
                ownershipYears: [
                    { required: true, message: '产权年限不能为空', trigger: 'blur' }
                ],
                housingPeriod: [
                    { required: true, message: '拿证日期不能为空', trigger: 'blur' }
                ],
                building: [
                    { required: true, message: '几栋不能为空', trigger: 'blur' }
                ],
                totalUnit: [
                    { required: true, message: '总单元数不能为空', trigger: 'blur' }
                ],
                unit: [
                    { required: true, message: '位于哪个单元不能为空', trigger: 'blur' }
                ],
                grade: [
                    { required: true, message: '房源评级不能为空', trigger: 'change' }
                ],
                structure: [
                    { required: true, message: '房屋结构不能为空', trigger: 'change' }
                ],
                entrustmentMethod: [
                    { required: true, message: '委托方式不能为空', trigger: 'change' }
                ],
                entrustmentSource: [
                    { required: true, message: '委托来源不能为空', trigger: 'change' }
                ],
                lift: [
                    { required: true, message: '电梯情况不能为空', trigger: 'change' }
                ],
                heating: [
                    { required: true, message: '供暖不能为空', trigger: 'change' }
                ],
                powerType: [
                    { required: true, message: '用电类型不能为空', trigger: 'change' }
                ],
                orientation: [
                    { required: true, message: '朝向不能为空', trigger: 'change' }
                ],
                decoration: [
                    { required: true, message: '装修情况不能为空', trigger: 'change' }
                ],
                ifOnly: [
                    { required: true, message: '是否唯一不能为空', trigger: 'change' }
                ],
                kfang: [
                    { required: true, message: '看房方式不能为空', trigger: 'change' }
                ],
                features: [
                    { required: true, message: '房源特色不能为空', trigger: 'change' }
                ],
                detailed: [
                    { required: true, message: '房源详情不能为空', trigger: 'blur' }
                ],
                industryType: [
                    { required: true, message: '行业类型不能为空', trigger: 'change' }
                ],
                ifIncorporation: [
                    { required: true, message: '公司注册不能为空', trigger: 'blur' }
                ],

            }
        };
    },
    created() {
        this.getList()
    },
    methods: {
        // 下一步
        nextfn() {
            this.activeName = "second"
        },
        //提交审核
        submitaudit() {

            this.$refs["form"].validate(valid => {
                if (valid) {
                    this.form.featuredTags = this.form.featuredTags.join(',')
                    this.form.propertyType = this.form.propertyType.join(',')
                    this.form.status = 4
                    updateFangyuan(this.form).then(response => {
                        this.$modal.msgSuccess('提交审核成功，请耐心等待审核。。。')
                        this.open2 = false
                        Object.assign(this.$data, this.$options.data())
                        this.getList()
                    })
                } else {
                    this.$message.error('请填写完必填信息')
                }
            });

        },
        //保存草稿箱
        savedraftsbox() {
            this.form.featuredTags = this.form.featuredTags.join(',')
            this.form.propertyType = this.form.propertyType.join(',')
            updateFangyuan(this.form).then(response => {
                this.$modal.msgSuccess('保存成功')
                this.open2 = false
                Object.assign(this.$data, this.$options.data())
                this.getList()
            })

        },
        clickhx() {
            this.gethxlist()
        },
        // 获取户型数据
        gethxlist() {
            listHuxing(this.form).then(response => {
                this.options = response.rows
            })
        },
        /** 查询草稿箱列表 */
        getList() {
            this.loading = true
            getdraftsList(this.queryParams).then(response => {
                this.fangyuanList = response.rows
                this.total = response.total
                this.loading = false
            })
        },
        // 取消按钮
        cancel() {
            this.open = false;
            this.reset();
            Object.assign(this.$data, this.$options.data())
            this.getList()
        },
        // 表单重置
        reset() {
            this.form = {
                id: null,
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
                phoneNumber: null,
            };
            this.resetForm("form");
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        /** 新增按钮操作 */
        handleAdd() {
            this.reset();
            this.open = true;
            this.title = "添加房源草稿箱";
        },
        /** 修改按钮操作 */
        handleUpdate(row) {
            this.reset();
            this.isShowmessage = false
            const id = row.id || this.ids
            getFangyuan(id).then(response => {
                this.form = response.data
                if (this.form.featuredTags) {
                    this.form.featuredTags = this.form.featuredTags.split(',')
                } else {
                    this.form.featuredTags = []
                }
                this.form.propertyType = this.form.propertyType.split(',')
                this.open2 = true
                this.title = '修改房源草稿'
            })
        },
        //去添加小区
        goadd() {
            this.open = false
            this.reset()
            Object.assign(this.$data, this.$options.data())
            this.$router.push('/loupan/lpxq')
        },
        handleSelect(item) {
            this.isShowmessage = false
            this.form.xqId = item.name
            this.form.xqname = item.value
            // this.$nextTick(() => {
            //     this.$refs.autocompleteRef.$refs.input.focus()
            // })
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
            }
        },
        // 模糊查询
        querySearchAsync(queryString, cb) {
            if (queryString) {

                fuzzyqueries(queryString).then(response => {
                    if (response.total > 0) {
                        this.form.xqId = response.rows[0].id
                    } else {
                        this.isShowmessage = true
                    }
                    this.restaurants = response.rows;
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
                                break;

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
        /** 提交按钮 */
        submitForm() {
            if (this.form.id != null) {
                updateFangyuan(this.form).then(response => {
                    this.$modal.msgSuccess('修改成功')
                    this.open = false
                    Object.assign(this.$data, this.$options.data())
                    this.getList()
                })
            } else {



            }


        },
        /** 删除按钮操作 */
        handleDelete(row) {
            const ids = row.id || this.ids;
            this.$modal.confirm('是否确认删除房源跟进编号为"' + ids + '"的数据项？').then(function () {
                return delFangyuan(ids);
            }).then(() => {
                this.getList();
                this.$modal.msgSuccess("删除成功");
            }).catch(() => { });
        },
        /** 导出按钮操作 */
        handleExport() {
            this.download('system/follow/export', {
                ...this.queryParams
            }, `follow_${new Date().getTime()}.xlsx`)
        }
    }
};
</script>

<style scoped>
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
</style>
