<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">

      <el-form-item label="方案名称">
        <el-autocomplete
          class="inline-input"
          v-model="queryParams.title"
          placeholder="请输入方案名称"
        ></el-autocomplete>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
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
          v-hasPermi="['brokerage:brokerage:add']"
        >新增</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleDelete"
          v-hasPermi="['brokerage:brokerage:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="brokerageList"
              highlight-current-row
              @current-change="handleCurrentChange"
    >
      <el-table-column label="id" prop="id" width="50" />
      <el-table-column label="方案名称" prop="title" :show-overflow-tooltip="true"/>
      <el-table-column label="最后更新时间" prop="updateTime" :show-overflow-tooltip="true"/>
      <el-table-column label="抽成类型" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.ilk === 1">固定额</span>
          <span v-else>抽成</span>
        </template>
      </el-table-column>
      <el-table-column label="抽成金额" :show-overflow-tooltip="true" width="120">
        <template slot-scope="scope">
          {{scope.row.amount}}
          <span v-if="scope.row.ilk === 1">元</span>
          <span v-else>%</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark" :show-overflow-tooltip="true"/>
      <el-table-column label="创建人" prop="user.nickName" :show-overflow-tooltip="true"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state === 1"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInt(scope.row, 2)"
            v-hasPermi="['brokerage:brokerage:edit']"
          >设为初始方案</el-button>
          <el-button v-if="scope.row.state === 2"
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInt(scope.row, 1)"
            v-hasPermi="['brokerage:brokerage:edit']"
          >取消设置</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleReceiveRules(scope.row, true)"
          >预览</el-button>

          <el-button
            v-if="scope.row.type !== 1"
            size="mini"
            type="text"
            icon="el-icon-s-operation"
            @click="handleReceiveRules(scope.row, false)"
            v-hasPermi="['brokerage:rules:edit']"
          >编辑细则</el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-more-outline"
            @click="handleReceiveInsert(scope.row)"
            v-hasPermi="['brokerage:brokerage:edit']"
          >重命名</el-button>
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

    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-form ref="form" label-position="left" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="方案名称" prop="title">
          <el-input v-model="form.title" placeholder="请输入方案名称" />
        </el-form-item>
        <el-form-item label="抽成方式">
          <el-select v-model="form.ilk" placeholder="请选择" style="width: 100px">
            <el-option
              v-for="item in ilkTypes"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <span style="margin-left: 20px; margin-right: 10px">平台抽成金额</span>
          <span v-if="form.ilk === 1"><el-input v-model="form.amount" style="width: 100px;"/>元</span>
          <span v-else><el-input v-model="form.amount" style="width: 100px;"/>%</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark"/>
        </el-form-item>
      </el-form>
      <el-button @click="submit()">确定</el-button>
    </el-dialog>

    <el-dialog :title="title2" :visible.sync="open2" width="40%" append-to-body>
      <el-form ref="form" label-position="left" label-width="80px">
        <el-form-item label-position="left"
          v-for="(rule, index) in dynamicValidateForm.brokerageRules"
          :label="'提成情况' + (index+1)"
          :key="rule.key"
          :prop="'brokerageRules.' + index + '.title'"
        >
          <div>
            <div style="display: flex">
              <div>
                <span>提成类型</span>
                <el-select v-model="rule.commissionType" placeholder="请选择" style="width: 100px" :disabled="disShow">
                  <el-option
                    v-for="item in commissionTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="margin-left: 25px">
                <span>提成阶段</span>
                <el-select v-model="rule.phaseType" placeholder="请选择" style="width: 100px" :disabled="disShow">
                  <el-option
                    v-for="item in phaseTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div style="margin-top: 10px" v-if="rule.phaseType === '区间'">
              <el-input v-model="rule.startAmount" style="width: 20%;" :disabled="disShow"></el-input>元 —
              <el-input v-model="rule.endAmount" style="width: 20%;" :disabled="disShow"></el-input>元
              <span style="margin-left: 5px">提成比例：</span><el-input v-model="rule.ruleDetails" style="width: 20%;" :disabled="disShow"></el-input>%
            </div>
            <div style="margin-top: 10px" v-else>
              <el-input v-model="rule.startAmount" style="width: 20%;" :disabled="disShow"></el-input><span>元以上</span>
              <span style="margin-left: 5px">提成比例：</span><el-input v-model="rule.ruleDetails" style="width: 20%;" :disabled="disShow"></el-input>%
            </div>
            <el-button v-if="!disShow" :disabled="disShow" @click.prevent="removeDomain(rule)" style="margin-left: 5px">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          {{dynamicValidateForm.remark}}
        </el-form-item>
        <el-form-item v-if="!disShow">
          <el-button :disabled="disShow" @click="addDomain">新增方案条</el-button>
          <el-button :disabled="disShow" type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listBrokerage, addBrokerage, updateBrokerage, delBrokerage } from "@/api/brokerage/brokerage";
import { addBrokerageRules } from "@/api/brokerage/rules";
import brokerage from '@/views/brokerage/brokerage/index.vue'
export default {
  name: "Role",
  computed: {
    brokerage() {
      return brokerage
    }
  },
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 方案数据
      brokerageList: [],
      // 弹出层标题
      title: "",
      title2: "",
      // 是否显示弹出层
      open: false,
      open2: false,
      // 查询参数
      queryParams: {
        title: '', //小区名称
        pageNum: 1, //第几页
        pageSize: 10, //页面条数
      },
      // 表单参数
      form: {
        title: null,
        ilk: null,
        amount: null,
        remark: null
      },
      ilkTypes:  [{
        value: 1,
        label: '固额'
      }, {
        value: 2,
        label: '百分比'
      }],
      commissionTypes:  [{
        value: '个人',
        label: '个人'
      }, {
        value: '团队',
        label: '团队'
      }],
      phaseTypes:  [{
        value: '区间',
        label: '区间'
      }, {
        value: '以上',
        label: '以上'
      }],
      currentRow: null,
      // 表单校验
      rules: {
        title: [
          { required: true, message: "薪资方案名称不能为空！", trigger: "blur" }
        ],
      },
      disShow: true,
      brokerageId: '',
      dynamicValidateForm: {
        brokerageRules: [{
          title: '',
          ruleDetails: '',
          brokerageId: ''
        }],
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {
  },
  methods: {
    getList() {
      this.loading = true;
      listBrokerage(this.queryParams).then(res => {
        this.brokerageList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.title = undefined;
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.form = {
        title: null,
        ilk: 1,
        amount: null,
        remark: null
      };
      this.open = true;
      this.title = "新增方案";
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    /** 修改按钮操作 */
    handleReceiveInsert(row) {
      this.form.id = row.id;
      this.form.title = row.title;
      this.form.ilk = row.ilk;
      this.form.amount = row.amount;
      this.form.remark = row.remark;
      this.open = true;
      this.title = "编辑方案";
    },
    /** 删除按钮操作 */
    handleDelete() {
      if(this.currentRow !== null) {
        this.$confirm('此操作将删除薪资方案', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delBrokerage(this.currentRow.id).then(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.getList();
          });
        }).catch(() => {
        });
      } else {
        this.$message({
          message: '请选中薪资方案',
          type: 'error'
        });
      }
    },
    handleInt(row, index) {
      row.state = index
      updateBrokerage(row).then(res => {
        this.$message({
          message: '设置成功！',
          type: 'success'
        });
        this.getList();
      })
    },

    submit() {
      if(this.form.id != null) {
        updateBrokerage(this.form).then(res => {
          this.open = false;
          this.$message({
            message: '编辑成功！',
            type: 'success'
          });
          this.getList();
        })
      } else {
        addBrokerage(this.form).then(res => {
          this.open = false;
          this.$message({
            message: '添加成功！',
            type: 'success'
          });
          this.getList();
        })
      }

    },
    handleReceiveRules(row, falg) {
      if(row.brokerageRulesList.length > 0) {
        this.dynamicValidateForm.brokerageRules = row.brokerageRulesList;
        this.brokerageId = row.id;
      } else {
        this.brokerageId = row.id;
        this.dynamicValidateForm = {
          brokerageRules: [{
            commissionType: '个人',
            phaseType: '区间',
            title: '',
            startAmount: '',
            endAmount: '',
            ruleDetails: '',
            brokerageId: this.brokerageId
          }],
        }
      }
      this.dynamicValidateForm.remark = row.remark
      this.title2 = "编辑方案条约";
      this.open2 = true;
      this.disShow = falg;
    },

    submitForm() {
      addBrokerageRules({
        brokerageRulesList: this.dynamicValidateForm.brokerageRules,
        id: this.brokerageId
      }).then(res => {
        this.open2 = false;
        this.$message({
          message: '编辑成功！',
          type: 'success'
        });
        this.getList();
      });
    },
    removeDomain(item) {
      let index = this.dynamicValidateForm.brokerageRules.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.brokerageRules.splice(index, 1)
      }
    },
    addDomain() {
      this.dynamicValidateForm.brokerageRules.push({
        commissionType: '个人',
        phaseType: '区间',
        title: '',
        startAmount: '',
        endAmount: '',
        ruleDetails: '',
        brokerageId: this.brokerageId,
        key: Date.now()
      });
    }
  }
};
</script>
