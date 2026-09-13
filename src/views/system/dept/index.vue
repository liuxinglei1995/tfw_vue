<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="queryParams.deptName" placeholder="请输入部门名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
          <el-option v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:dept:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId" :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="deptName" label="部门名称" width="400">
        <template slot-scope="scope">
          <span v-if="scope.row.company === '1' && scope.row.fullName !== ''"> {{ scope.row.fullName }} </span>
          <span v-else> {{ scope.row.deptName }} </span>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="150"></el-table-column>
      <el-table-column prop="status" label="类型" width="100">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.company === '1'" :content="scope.row.deptName" placement="top">
            <el-tag effect="dark">公司</el-tag>
          </el-tooltip>
          <el-tag effect="dark" type="info" v-if="scope.row.company === '2'">部门</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:dept:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-plus" @click="handleAdd(scope.row)"
            v-hasPermi="['system:dept:add']">新增</el-button>
          <el-button v-if="scope.row.parentId != 0" size="mini" type="text" icon="el-icon-delete"
            @click="handleDelete(scope.row)" v-hasPermi="['system:dept:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button @click="mapshow = true" type="primary">选择打卡地点</el-button>
              <div>
                经度<el-input v-model="form.lon" placeholder="经度" />
                纬度<el-input v-model="form.lat" placeholder="纬度" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="company">
              <el-select v-model="form.company" clearable placeholder="请选择">
                <el-option
                  v-for="item in companyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.company === '1'">
            <el-form-item label="公司全称" prop="fullName">
              <el-input  v-model="form.fullName"  placeholder="请填写公司全称">
              </el-input>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="省级" prop="provinceCode">
              <el-select v-model="form.provinceCode" @change="getCityList" placeholder="请选择">
                <el-option v-for="c in provinceList" :key="c.id" :value="c.id" :label="c.extName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="市级" prop="cityCode" v-if="cityflag">
              <el-select v-model="form.cityCode" placeholder="请选择">
                <el-option v-for="c in cityList" :key="c.id" :value="c.id" :label="c.extName"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="具体位置" prop="location" >
                <el-input v-model="form.location" placeholder="请输入具体位置" maxlength="20" />
            </el-form-item>
            <el-form-item label="部门类型" prop="type" >
              <el-select v-model="form.type" placeholder="请选择部门类型" >
                <el-option v-for=" dict in dict.type.tfw_dept_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="email">
              <el-input v-model="form.email" placeholder="请输入身份证号" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{ dict.label
                }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--    地图-->
    <mapsearch v-if="mapshow" @comfig="choosemap" @cancel="cancelmap"></mapsearch>

  </div>
</template>

<script>
// import mapsearch from "../../../components/mapsearch/index.vue"
import mapsearch from "../../../components/mapsearch/tianIndex.vue"


import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/system/dept";
import { getprovincelist1, getprovincelist2, getprovincelist3 } from '@/api/province.js'
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  dicts: ['sys_normal_disable','tfw_dept_type'],
  components: { Treeselect, mapsearch },
  data() {
    return {
      mapshow: false,
      drawer: false,
      direction: 'rtl',
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      provinceList: [],
      cityList: [],
      cityflag: false,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
        ],
        deptName: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        orderNum: [
          { required: true, message: "显示排序不能为空", trigger: "blur" }
        ],
        email: [
          {
            pattern: /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            message: "请输入正确的身份证号",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ],
      },
      companyOptions: [{
          label: '无',
          value: '0',
        },{
          label: '公司',
          value: '1',
        },{
          label: '部门',
          value: '2',
        }]
    };
  },
  created() {
    this.queryParams.companyId = this.$store.state.user.companyDept.deptId
    this.getList();
  },
  watch: {
    'form.provinceCode': {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
        if (newVal != null && this.form.cityCode != null) {
          getprovincelist2(newVal).then(response => {
            this.cityList = response.rows
            this.cityflag = true
          })
        }
      },
      deep: true,
      immediate: true
    },

  },
  methods: {
    getProList() {
      getprovincelist1(0).then(response => {
        this.provinceList = response.rows
        console.log(this.provinceList, "111111");
      })
    },
    getCityList() {
      this.form.cityCode = null
      if (this.form.provinceCode != null) {
        getprovincelist2(this.form.provinceCode).then(response => {
          this.cityList = response.rows
          this.cityflag = true
        })
      }
    },

    //选择地图
    choosemap(e) {
      console.log(e);
      this.form.lat = e.location.lat;
      this.form.lon = e.location.lng;
      this.form.address = e.address
      this.mapshow = false
    },
    //关闭地图
    cancelmap(e) {
      this.mapshow = e
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },

    // 选择打卡地点
    lonandlat() {
      console.log("打卡地点")
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      listDept(this.queryParams).then(response => {
        this.deptList = this.handleTree(response.data, "deptId");
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        location:undefined,
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        type: undefined,
        lon: undefined,
        lat: undefined,
        status: "0",
        provinceCode: null,
        cityCode: null,
      };
      this.provinceList = []
      this.cityList = []
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getProList()
      if (row != undefined) {
        this.form.parentId = row.deptId;
      }
      this.open = true;
      this.title = "添加部门";
      listDept().then(response => {
        this.deptOptions = this.handleTree(response.data, "deptId");
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getProList()
      getDept(row.deptId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门";
        listDeptExcludeChild(row.deptId).then(response => {
          this.deptOptions = this.handleTree(response.data, "deptId");
          if (this.deptOptions.length == 0) {
            const noResultsOptions = { deptId: this.form.parentId, deptName: this.form.parentName, children: [] };
            this.deptOptions.push(noResultsOptions);
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.loading = true
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            updateDept(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.cityflag = false;
              this.loading = false
              this.getList();
            });
          } else {
            addDept(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.cityflag = false;
              this.loading = false
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(function () {
        return delDept(row.deptId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    }
  }
};
</script>
