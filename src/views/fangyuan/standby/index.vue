<template>
    <div class="app-container">
        <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-row :gutter="20">
                <el-col :span="1.5">
                  <el-form-item label="城市选择" prop="xqname" size="mini" label-width="80px">
                    <el-select v-model="cityCode" placeholder="请选择" v-if="userCityState" @change="handleChange">
                      <el-option
                        v-for="item in userCities"
                        :label="item.cityName"
                        :value="item.cityId"
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
                  <el-form-item label="房主电话" prop="phoneNumber">
                    <el-input v-model="queryParams2.phoneNumber" placeholder="请输入房主电话" clearable style="width:150px" />
                  </el-form-item>
                  <el-form-item label="小区名称" prop="xqname">
                      <el-autocomplete v-model="queryParams2.xqname" :fetch-suggestions="querySearchAsync"
                          placeholder="请输入小区名称" @select="handleSelect2" ref="autocompleteRef" :debounce=1500
                          size="mini" style="width: 180px">
                      </el-autocomplete>
                  </el-form-item>
                  <el-form-item prop="building" size="mini">
                      <el-input v-model="queryParams2.building" placeholder="请输入栋" clearable style="width:100px" />
                  </el-form-item>
                  <el-form-item prop="unit" size="mini">
                      <el-input v-model="queryParams2.unit" placeholder="请输入单元" clearable style="width:110px" />
                  </el-form-item>
                  <el-form-item prop="floor" size="mini">
                      <el-input v-model="queryParams2.floor" placeholder="请输入楼层" clearable style="width:110px" />
                  </el-form-item>
                  <el-form-item prop="roomNum" size="mini">
                      <el-input v-model="queryParams2.roomNum" placeholder="请输入房号" clearable style="width:110px" />
                  </el-form-item>
                </el-col>
                <el-col :span="1.5">
                  <el-form-item label="所属人">
                    <el-radio-group size="mini" @change="changeUser" v-model="myType">
                      <el-radio-button v-for="item in mylist" :key="item.value" :label="item.value"  size="medium">{{item.lable }}
                      </el-radio-button>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item prop="propertyArea" style="margin-bottom: 0px;" label="面积">
                      <el-input v-model="queryParams2.params.propertyAreaMin" placeholder="请输入最小值" clearable
                          style="width:120px;" size="mini" />---
                      <el-input v-model="queryParams2.params.propertyAreaMax" placeholder="请输入最大值" clearable
                          style="width:120px;margin-right: 20px;" size="mini" />
                      <!-- <inputNumber :disabled="false" :precision="0" v-model="queryParams2.propertyAreanum"></inputNumber> -->
                      <el-radio-group v-model="queryParams2.propertyArea" size="mini">
                          <el-radio-button v-for="dict in dict.type.tfw_arear" :key="dict.value" :label="dict.value"
                              size="medium">{{ dict.label }}
                          </el-radio-button>
                      </el-radio-group>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                  </el-form-item>
                </el-col>
            </el-row>


        </el-form>
        <el-row :gutter="20">
            <el-row :gutter="10" class="mb8">
                <el-col :span="1.5">
                    <el-button type="info" plain icon="el-icon-upload2" size="mini" @click="handleImport"
                        v-hasPermi="['house:receive:import']">导入</el-button>
                </el-col>
<!--                <el-col :span="1.5">-->
<!--                    <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"-->
<!--                        v-hasPermi="['house:receive:export']">导出</el-button>-->
<!--                </el-col>-->
                <el-col :span="1.5">
                    <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handledict"
                        v-hasPermi="['house:receive:remove']">批量删除</el-button>
                </el-col>
            </el-row>
        </el-row>
        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
            <el-form :model="queryParams3" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                label-width="68px">
                <el-form-item label="名称" prop="title">
                    <el-autocomplete v-model="queryParams3.title" :fetch-suggestions="querySearchAsync"
                        placeholder="请输入小区名称" @select="handleSelect3" ref="autocompleteRef" :debounce=500 size="mini">
                    </el-autocomplete>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini"
                        @click="handleClosecheck()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="编号" align="center" prop="id">
            <template slot-scope="scope">
              <div style="display: flex;flex-direction: column;">
                <span>{{ scope.row.id }}</span>
                <span v-if="scope.row.companyDept">{{ scope.row.companyDept.deptName }}</span>
              </div>
            </template>
          </el-table-column>
            <el-table-column label="小区名称" align="center" prop="xqname" />
            <el-table-column label="栋" align="center" prop="building" />
            <el-table-column label="单元" align="center" prop="unit" />
            <el-table-column label="层" align="center" prop="floor" />
            <el-table-column label="房号" align="center" prop="roomNum" />
            <el-table-column label="面积" align="center" prop="propertyArea" />
            <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="picklisting(scope.row)"
                        v-if="scope.row.ifUpdate !== true">领取房源</el-button>
                    <el-button size="mini" type="text" icon="el-icon-edit" @click="particulars(scope.row, 'first')"
                        v-else>详情</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete"
                        @click="particulars(scope.row, 'second')">跟进</el-button>
                    <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                        v-hasPermi="['system:house:remove']">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams2.pageNum"
            :limit.sync="queryParams2.pageSize" @pagination="getList" />
        <!-- 详情抽屉 -->
        <el-drawer title="备用房源详情" :visible.sync="drawer" :direction="direction" :before-close="handleClose" size="40%"
            v-if="drawer">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="详情" name="first" v-if="drawerdata.ifUpdate">
                    <el-descriptions class="margin-top" title="" :column="3" :size="size" border>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-user"></i>
                                小区名称
                            </template>
                            {{ drawerdata.xqname }}
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-mobile-phone"></i>
                                业主信息
                            </template>
                            <div v-for="(item, index) in drawerdata.phoneNumber" :key="index">
                                {{ item.name }}<br>{{ item.value }}
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-location-outline"></i>
                                居住地
                            </template>
                            {{ drawerdata.building }}栋-{{ drawerdata.unit }}单元-{{ drawerdata.floor }}层-{{
            drawerdata.roomNum
        }}号
                        </el-descriptions-item>
                        <el-descriptions-item>
                            <template slot="label">
                                <i class="el-icon-tickets"></i>
                                备注
                            </template>
                            {{ drawerdata.remarkString }}
                        </el-descriptions-item>
                    </el-descriptions>
                    <el-button type="primary" plain
                        @click="Conversiontoofficialpremises(drawerdata.id)">转为正式房源</el-button>
                </el-tab-pane>
                <el-tab-pane label="跟进" name="second">
                    <genjin :floow="genjinid"></genjin>
                </el-tab-pane>
            </el-tabs>

        </el-drawer>

        <!-- 导入选择列表 -->
        <el-dialog :title="'选择你导入的小区'" :visible.sync="loupanlistshow" width="800px" append-to-body>
            <el-form :model="queryParams2" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                label-width="68px">
                <el-form-item label="名称" prop="title">
                    <el-autocomplete v-model="queryParams2.title" :fetch-suggestions="querySearchAsync"
                        placeholder="请输入小区名称" @select="handleSelect2" ref="autocompleteRef" :debounce=500 size="mini">
                    </el-autocomplete>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" size="mini" @click="checklp()">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 用户导入对话框 -->
        <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body
            v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在上传中 请稍等">
            <el-upload ref="upload" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
                :action="upload.url + '?updateSupport=' + upload.updateSupport + '&xqId=' + this.searchtitle"
                :disabled="upload.isUploading" :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess"
                :auto-upload="false" drag>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip text-center" slot="tip">
                    <!-- <div class="el-upload__tip" slot="tip">
                        <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
                    </div> -->
                    <span>仅允许导入xls、xlsx格式文件。</span>
                    <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                        @click="importTemplate">下载模板</el-link>
                    <div>你导入的小区是{{ this.xqname }}</div>
                </div>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFileForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import { stanbylist, fuzzyqueries2, receiveById, getFangyuan, delFangyuan, updateFangyuan, removeByXqId } from '@/api/fangyuan/fangyuan'
import { getToken } from "@/utils/auth";
import genjin from '../genjin/genjin.vue'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getlist, getprovincelist1 } from '@/api/province'
export default {
    components: {
        genjin
    },
    name: "User",
    dicts: ['tfw_arear'],
    data() {
        return {
            fullscreenLoading: false,
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
            // 导入房源列表
            userList: null,
            // 弹出层标题
            title: "",
            // 是否显示弹出层
            open: false,
            // 表单参数
            form: {},
            defaultProps: {
                children: "children",
                label: "label"
            },
            // 用户导入参数
            upload: {
                // 是否显示弹出层（用户导入）
                open: false,
                // 弹出层标题（用户导入）
                title: "",
                // 是否禁用上传
                isUploading: false,
                // 是否更新已经存在的用户数据
                updateSupport: 0,
                // 设置上传的请求头部
                headers: { Authorization: "Bearer " + getToken() },
                // 上传的地址
                url: process.env.VUE_APP_BASE_API + "/fangyuan/fangyuan/excel/importData"
            },
            //选择楼盘
            loupanlistshow: false,
            // 查询参数
            queryParams2: {
                pageNum: 1,
                pageSize: 10,
                userId: null,
                phoneNumber: null,
                xqname: null,
                building: null,
                unit: null,
                floor: null,
                roomNum: null,
                propertyArea: null,
                params: {
                    propertyAreaMin: null,
                    propertyAreaMax: null,
                },
                status: 6,
            },
            queryParams3: {
                pageNum: 1,
                pageSize: 10,
                userId: null,
                xqname: null,
                building: null,
                unit: null,
                floor: null,
                roomNum: null,
                propertyArea: null,
                params: {
                    propertyAreaMin: null,
                    propertyAreaMax: null,
                },
                status: 6,
            },
            //搜索
            searchtitle: null,
            //小区名称
            xqname: null,
            deledate: null,
            deledataname: null,
            //筛选列表
            mylist: [
                {
                    lable: "公司",
                    value: 0
                },
                {
                    lable: "我的",
                    value: 1
                }
            ],
          myType: 0,
            //抽屉
            drawer: false,
            direction: 'rtl',
            size: '60%',
            drawerdata: null,
            activeName: "",
            genjinid: null,
            centerDialogVisible: false,
          //城市选择
          regioncode: [510000, 510100],
          ssqldList: [],
          cityState: true,
          cityCode: 510100,

          //多负责城市处理
          userCityState: false,
          userCities: [],
        };
    },

    created() {
      this.queryParams2.deptId = this.$store.state.user.companyDept.deptId;
      if(this.$store.state.user.userid === 1 || this.$store.state.user.userid === 116) this.cityState = false
      this.regioncode = [this.$store.state.user.provinceCode, this.$store.state.user.cityCode];
      if(this.$store.getters.userCities.length > 0) {
        this.userCityState = true;
        this.cityCode = this.$store.getters.userCities[0].cityId;
        this.userCities = this.$store.getters.userCities;
      }
      this.queryParams2.cityCode = this.cityCode;
      this.getList();
      localStorage.setItem("citycode", JSON.stringify(this.citycode));
      getlist(2).then(response => {
        const options = response.data.map(option => ({
          ...option,
          label: option.extName, // 如果 extName 不存在，则回退到 name
          value: option.id
        }));
        this.ssqldList = this.handleTree(options, "id", "parentId");
      })
    },
    methods: {
      handleChange(value) {
        if(!this.userCityState) {
          this.cityCode = value[1];
        }
      },
        //批量删除
        handledict() {
            this.centerDialogVisible = true
        },
        //转为正式房源
        Conversiontoofficialpremises(e) {
            updateFangyuan({
                id: e, status: 3, propertyType: "", featuredTags: "", type: "1", params: {
                    formal: true, status: 3
                }, info: 1
            }).then(res => {
                this.$modal.msgSuccess('转移成功,请前往正式房源修改数据')
                this.drawer = false;
                this.$router.push({ path: "/fangyuan/fangyuan" });
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
        /** 查询用户列表 */
        getList() {
          this.loading = true;
          stanbylist(this.queryParams2).then(response => {
                this.userList = response.rows;
                this.total = response.total;
                this.loading = false;
            }
            );
        },
        // 取消按钮
        cancel() {
            this.upload.open = false;
            this.open = false;
            this.reset();
            this.queryParams2.title = ""
        },
        // 表单重置
        reset() {
            this.form = {
                userId: undefined,
                deptId: undefined,
                userName: undefined,
                nickName: undefined,
                password: undefined,
                phonenumber: undefined,
                email: undefined,
                sex: undefined,
                status: "0",
                remark: null,
                eductaion: "",
                entryTime: "",
                departTime: "",
                education: "",
                utel: "",
                workExperience: "",
                introducer: "",
                residence: "",
                emergencyComtact: "",
                emergencyPhone: "",
                homeAddress: "",
                postIds: [],
                roleIds: []
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams2.cityCode = this.cityCode;
            this.queryParams2.pageNum = 1;
            this.getList();
        },
        changeUser(e) {
          if(e === 0) this.queryParams2.userId = null
          if(e === 1) this.queryParams2.userId = this.$store.state.user.userid
          this.getList()
        },
        /** 重置按钮操作 */
        resetQuery() {
          this.resetForm("queryForm2");
          this.queryParams2.cityCode = null
          this.queryParams2.deptId = this.$store.state.user.companyDept.deptId;
          this.handleQuery();
        },
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.userId);
            this.single = selection.length != 1;
            this.multiple = !selection.length;
        },
        handleClose(done) {
            this.drawer = false;
        },
        /** 领取房源 */
        picklisting(row) {
            receiveById({ id: row.id }).then(res => {
                if (res.code === 200) {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                }
                else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'success'
                    });
                }
                this.getList();
            })
        },
        // 详情
        particulars(row, show) {
            this.activeName = show;
            this.genjinid = row.id
            getFangyuan(row.id).then(response => {
                this.drawerdata = response.data;
                this.drawerdata.phoneNumber = JSON.parse(this.drawerdata.phoneNumber)
            });
            this.drawer = true;
        },

        /** 导出按钮操作 */
        handleExport() {
            this.download('system/user/export', {
                ...this.queryParams
            }, `user_${new Date().getTime()}.xlsx`)
        },
        /** 导入按钮操作 */
        handleImport() {
            this.loupanlistshow = true;
        },
        checklp() {
            this.loupanlistshow = false;
            this.upload.title = "备用房源导入";
            this.upload.open = true;
        },
        // 模糊查询
        querySearchAsync(queryString, cb) {
            if (queryString) {
                fuzzyqueries2(queryString, this.cityCode).then(response => {
                    this.restaurants = response.rows
                    var restaurants = this.restaurants.map((terminal) => {
                        return {
                            value: terminal.title,
                            name: terminal.id,
                        };
                    });
                    var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
                    if (results.length > 0) {
                        results.forEach((obj) => {
                            if (obj.value === this.form.title) {
                                this.isShowmessage = true
                                this.deledate = obj.name
                            } else {
                                this.isShowmessage = false
                            }
                        });
                    } else {
                        this.isShowmessage = false;
                    }
                    cb(results);
                })
            }
        },
        createStateFilter(queryString) {
            return (state) => {
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
            };
        },
        handleSelect2(item) {
            this.searchtitle = item.name;
            this.xqname = item.value;
        },

        handleSelect3(item) {
            this.deledate = item.name
            this.deledataname = item.value
        },
        //确定删除
        handleClosecheck() {
            this.$confirm('确认删除这个小区吗？此操作不可逆')
                .then(_ => {
                    removeByXqId({ xqId: this.deledate }).then(res => {
                        this.centerDialogVisible = false;
                        this.getList();
                    })
                })
                .catch(_ => { });
        },

        /** 下载模板操作 */
        importTemplate() {
            this.download('fangyuan/fangyuan/excel/importTemplate', {
            }, `${this.xqname + '_' + new Date().getTime()}.xlsx`)
        },
        // 文件上传中处理
        handleFileUploadProgress(event, file, fileList) {
            this.upload.isUploading = true;
        },
        // 文件上传成功处理
        handleFileSuccess(response, file, fileList) {
            this.upload.open = false;
            this.upload.isUploading = false;
            this.queryParams2.title = "";
            this.$refs.upload.clearFiles();
            this.fullscreenLoading = false;
            this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
            this.getList();
        },
        // 提交上传文件
        submitFileForm() {
            this.fullscreenLoading = true;
            this.$refs.upload.submit();
            this.reset();
        }

    }
};
</script>
