<template>
    <div>
        <el-row :gutter="20">
            <!--部门数据-->
            <el-col :span="spanSize1" :xs="24" v-if="deptTreeShow">
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
                  <el-form-item>
                    <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
                  </el-form-item>
                    <el-form-item label="登录账号" prop="userName">
                        <el-input v-model="queryParams.userName" placeholder="请输入用户登录账号" clearable style="width: 150px"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="手机号码" prop="phonenumber">
                        <el-input v-model="queryParams.phonenumber" placeholder="请输入手机号码" clearable style="width: 150px"
                            @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="在职情况" prop="type">
                      <el-checkbox-group v-model="status">
                        <el-checkbox label="在职"></el-checkbox>
                        <el-checkbox label="离职"></el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker v-model="dateRange" style="width: 200px" value-format="yyyy-MM-dd"
                            type="daterange" range-separator="-" start-placeholder="开始日期"
                            end-placeholder="结束日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
                    <el-table-column label="登录账号" align="center" key="userName" prop="userName"
                        v-if="columns[1].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="用户昵称" align="center" key="nickName" prop="nickName"
                        v-if="columns[2].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="部门" align="center" key="deptName" prop="dept.deptName"
                        v-if="columns[3].visible" :show-overflow-tooltip="true" />
                    <el-table-column label="手机号码" align="center" key="phonenumber" prop="phonenumber"
                        v-if="columns[4].visible" width="120" />

                    <el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible"
                        width="160">
                        <template slot-scope="scope">
                            <span>{{ parseTime(scope.row.createTime) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">

                        <template slot-scope="scope" v-if="scope.row.userId !== 1">
                            <el-button size="mini" type="text" icon="el-icon-edit" @click="newUserHouseRow(scope.row)"
                                v-hasPermi="['system:user:edit']">转移</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList" />
            </el-col>
        </el-row>
        <!-- 名下房源 -->
        <el-dialog title="名下房源" :visible.sync="dialogTableVisible1" width="800px">
            <el-form :model="queryParams2" ref="queryForm2" size="small" :inline="true" v-show="dialogTableVisible1"
                label-width="68px">
                <el-row :gutter="20">
                    <el-col :span="1.5">
                        <el-form-item label="小区名称" prop="xqname">
                            <el-autocomplete v-model="queryParams2.xqname" :fetch-suggestions="querySearchAsync"
                                placeholder="请输入小区名称" @select="handleSelect2" ref="autocompleteRef" :debounce=1500
                                size="mini" style="width: 120px">
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item prop="building" size="mini">
                            <el-input v-model="queryParams2.building" placeholder="请输入栋" clearable
                                style="width:100px" />
                        </el-form-item>
                        <el-form-item prop="unit" size="mini">
                            <el-input v-model="queryParams2.unit" placeholder="请输入单元" clearable style="width:110px" />
                        </el-form-item>
                        <el-form-item prop="floor" size="mini">
                            <el-input v-model="queryParams2.floor" placeholder="请输入楼层" clearable style="width:110px" />
                        </el-form-item>
                        <el-form-item prop="roomNum" size="mini">
                            <el-input v-model="queryParams2.roomNum" placeholder="请输入房号" clearable
                                style="width:110px" />
                        </el-form-item>
                        <el-form-item prop="roomNum" size="mini" label="开盘人名字" label-width="85px">
                            <el-input v-model="queryParams2.createByName" placeholder="请输入开盘人名字" clearable
                                style="width:145px" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" size="mini"
                                @click="handleQuery">搜索</el-button>
                            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                            <el-button type="warning" plain icon="el-icon-download" size="mini"
                                v-hasPermi="['system:house:list']" @click="transfersother">房源转移
                            </el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <el-table size="mini" height="350px" :data="myData" @selection-change="handleSelectionChange"
                v-loading="loading">
                <el-table-column type="selection" width="55" align="center" />
                <el-table-column label="编号" align="center" prop="id" :filters="myDatalist" />
                <el-table-column label="封面图" align="center" prop="coverfile" width="100">

                    <template slot-scope="scope">
                        <image-preview :src="scope.row.coverfile" :width="50" :height="50" />
                    </template>
                </el-table-column>
                <el-table-column label="小区名称" align="center" prop="xqname" />
                <el-table-column prop="building,unit,roomNum" header-align="center" align="center" label="栋/单元/号"
                    width="150px">

                    <template slot-scope="scope">
                        {{ scope.row.building }}
                        <span>-</span>
                        {{ scope.row.unit }}
                        <span>-</span>
                        {{ scope.row.roomNum }}
                        <br>
                    </template>
                </el-table-column>
                <el-table-column label="户型" align="center" prop="huXTitle" />
                <el-table-column label="套内面积" header-align="center" align="center" prop="usableArea">

                    <template slot-scope="scope">
                        {{ scope.row.usableArea ? scope.row.usableArea : "-" }}㎡
                    </template>
                </el-table-column>
                <el-table-column label="产权面积" header-align="center" align="center" prop="propertyArea">

                    <template slot-scope="scope">
                        {{ scope.row.propertyArea ? scope.row.propertyArea : "-" }}㎡
                    </template>
                </el-table-column>
                <el-table-column label="总价" header-align="center" align="center" prop="sellingPrice,propertyArea"
                    width="180px">

                    <template slot-scope="scope">
                        <div v-if="scope.row.type == 1">
                            <span>{{ scope.row.sellingPrice ? scope.row.sellingPrice : "-" }}万</span>
                            <br />
                            <span>
                                {{ scope.row.sellingPrice && scope.row.propertyArea ?
            Math.round(scope.row.sellingPrice * 10000 / scope.row.propertyArea) : "-" }}㎡/￥
                            </span>
                        </div>
                        <div v-if="scope.row.type == 2">
                            <span>
                                {{ scope.row.rental }}元/月
                            </span>
                        </div>
                        <div v-if="scope.row.type == 3">
                            <span>{{ scope.row.sellingPrice ? scope.row.sellingPrice : "-" }}万</span>
                            <br />
                            <span>
                                {{ scope.row.sellingPrice && scope.row.propertyArea ?
            Math.round(scope.row.sellingPrice * 10000 / scope.row.propertyArea) : "-" }}㎡/￥
                            </span>
                            <span>
                                {{ scope.row.rental }}元/月
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="floor,totalFloor" header-align="center" align="center" label="楼层/总高">

                    <template slot-scope="scope">
                        {{ scope.row.floor }}
                        <span>/</span>
                        {{ scope.row.totalFloor }}F
                    </template>
                </el-table-column>
                <el-table-column label="开盘人" align="center" prop="createByName" />
                <el-table-column label="开盘时间" align="center" prop="createdAt" width="180">

                    <template slot-scope="scope">
                        <span>已上架 {{ getDiffDay(scope.row.createdAt) }} 天</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" />

            </el-table>
            <pagination v-show="total2 > 0" :total="total2" :page.sync="queryParams2.pageNum"
                :limit.sync="queryParams2.pageSize" @pagination="newUserHouseRow()" />
            <el-button @click="cancel">取 消</el-button>
        </el-dialog>
        <!-- 被转移人名单 -->
        <el-dialog title="被转移人名单" :visible.sync="dialogTableVisible2">
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
            <pagination v-show="total3 > 0" :total="total3" :page.sync="dataquery.pageNum"
                :limit.sync="dataquery.pageSize" @pagination="transfersother()" />
        </el-dialog>
    </div>
</template>

<script>
import {
    getuserHouseList,
    updateUserHouse,
    listFangyuan,
    fuzzyqueries
} from '@/api/fangyuan/fangyuan'
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus, deptTreeSelect } from "@/api/system/user";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
    dicts: ['sys_normal_disable', 'sys_user_sex', 'tfw_degree', 'sys_user_type'],
    components: { Treeselect },
    data() {
        return {
            // 显示搜索条件
            showSearch: true,
            // 总条数
            total: 0,
            total2: 0,
            total3:0,
            // 用户表格数据
            userList: null,
            // 弹出层标题
            title: "",
            // 部门树选项
            deptOptions: undefined,
            // 是否显示弹出层
            open: false,
            // 部门名称
            deptName: undefined,
            // 默认密码
            initPassword: undefined,
            // 日期范围
            dateRange: [],
            // 岗位选项
            postOptions: [],
            // 角色选项
            roleOptions: [],
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
                url: process.env.VUE_APP_BASE_API + "/system/user/importData"
            },
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                userName: undefined,
                phonenumber: undefined,
                status: undefined,
                deptId: undefined,
                userType: '00'
            },
            status: ['在职'],
            // 列信息
            columns: [
                { key: 0, label: `用户编号`, visible: true },
                { key: 1, label: `用户名称`, visible: true },
                { key: 2, label: `用户昵称`, visible: true },
                { key: 3, label: `部门`, visible: true },
                { key: 4, label: `手机号码`, visible: true },
                { key: 5, label: `状态`, visible: true },
                { key: 6, label: `创建时间`, visible: true }
            ],
            // 表单校验
            rules: {
                userName: [
                    { required: true, message: "用户名称不能为空", trigger: "blur" },
                    { min: 2, max: 20, message: '用户名称长度必须介于 2 和 20 之间', trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: "用户昵称不能为空", trigger: "blur" }
                ],
                password: [
                    { required: true, message: "用户密码不能为空", trigger: "blur" },
                    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
                ],
                email: [
                    {
                        pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
                        message: "请输入正确的身份证",
                        trigger: "blur"
                    }
                ],
                phonenumber: [
                    {
                        pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                        message: "请输入正确的手机号码",
                        trigger: "blur"
                    }
                ]
            },
            // 遮罩层
            loading: true,
            //转移人名单
            userhouseopenlist: null,
            // 被转移人
            newuserhouseopenlist: null,
            // 转移人id
            userid: null,
            //名下房源
            myData: [],
            queryParams2: {
                pageNum: 1,
                pageSize: 10,
                userId: null,
                xqname: null,
                building: null,
                unit: null,
                floor: null,
                roomNum: null,
                propertyArea: null,
                createByName: null
            },
            dataquery: {
                pageNum: 1,
                pageSize: 10,
                userId: null,
                deptId: null,
            },
            // 选中数组
            ids: [],
            // 非单个禁用
            single: true,
            // 非多个禁用
            multiple: true,
            //筛选数组
            myDatalist: null,
            //被转移模态框
            dialogTableVisible1: false,
            dialogTableVisible2: false,


          deptTreeName: '显示部门树',
          deptTreeShow: false,
          spanSize1: 0,
          spanSize2: 24,
        }
    },
    watch: {
        // 根据名称筛选部门树
        deptName(val) {
            this.$refs.tree.filter(val);
        }
    },
    created() {
        this.getDeptTree();
        this.getList();
        // this.getConfigKey("sys.user.initPassword").then(response => {
        //     this.initPassword = response.msg;
        // });
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
        /** 查询用户列表 */
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
            listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
                this.userList = response.rows;
                this.total = response.total;
                this.loading = false;
            }
            );
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
        // 多选框选中数据
        handleSelectionChange(selection) {
            this.ids = selection.map(item => item.id)
            this.single = selection.length !== 1
            this.multiple = !selection.length
        },
        // 取消按钮
        cancel() {
            this.dialogTableVisible1 = false
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
            this.queryParams2.pageNum = 1;
            listFangyuan(this.queryParams2).then(res => {
                this.myData = res.rows
            })
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.resetForm("queryForm2");
            this.handleQuery();
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
        // 模糊查询
        querySearchAsync(queryString, cb) {
            if (queryString) {
                fuzzyqueries(queryString).then(response => {
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
                            if (obj.value === this.queryParams2.xqname) {
                                this.isShowmessage = true
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
                return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
            };
        },
        handleSelect2(item) {
            this.searchtitle = item.name;
            this.xqname = item.value;
        },

        //选择转移人
        newUserHouseRow(a, b) {
            if (a) {
                this.userid = a.userId
            }
            this.dialogTableVisible1 = true;
            this.queryParams2.userId = this.userid;
            this.loading = true;
            listFangyuan(this.queryParams2).then(res => {
                this.myData = res.rows
                this.total2 = res.total
                this.loading = false;
            })
        },
        //选择被转移房源
        transfersother(row) {
            if (this.ids.length > 0) {
              console.log(this.$store.state)
              this.dialogTableVisible2 = true
              this.dataquery.userId = this.userid
              this.dataquery.deptId = this.$store.state.user.deptId
              //获取被转移人
              this.dataquery.status = 1;

              getuserHouseList(this.dataquery).then(response => {
                this.newuserhouseopenlist = response.rows
                this.total3 = response.total
                this.loading = false;
              })
            } else {-
                this.$message('请选择转移房源');
            }
        },
        //转移
        transferto(row) {
            updateUserHouse(this.ids, { newUserId: row.userId }).then(res => {
                listFangyuan({ userId: this.userid }).then(res => {
                    this.myData = res.rows
                })
                this.dialogTableVisible2 = false
            })
        },
    }
}
</script>

<style lang="less" scoped></style>
