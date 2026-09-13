<template>
  <div class="app-container">
    <el-form :model="from" ref="queryForm" size="small" :inline="true">
      <el-form-item label="到访人" prop="roleName">
        <el-input
          v-model="from.nickName"
          placeholder="请输入申请人"
          clearable
          style="width: 240px"
        />
      </el-form-item>
      <el-form-item label="小区名称">
        <el-autocomplete
          class="inline-input"
          v-model="from.xqName"
          placeholder="请输入小区名称"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select
          v-model="from.state"
          placeholder="访问类型"
          clearable
          style="width: 240px"
        >
          <el-option
            v-for="state in states"
            :key="state.value"
            :label="state.label"
            :value="state.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 领取人列表 -->
    <el-table :data="receiveData" style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column prop="xqName" label="小区" ></el-table-column>
      <el-table-column prop="nickName" label="申请人" ></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.state === 1">审核中</span>
          <span v-else-if="scope.row.state === 100">已通过</span>
          <span v-else-if="scope.row.state === 99">驳回</span>
          <span v-else>其他情况</span>
        </template>
      </el-table-column>
      <el-table-column prop="reviewerName" label="审核人" ></el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteReceive(scope.row)" v-if="scope.row.state === 1 || scope.row.state === 99">取消领取
          </el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleApply(scope.row)" v-if="scope.row.state === 1">审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="from.pageNum"
      :limit.sync="from.pageSize"
      @pagination="getReceive"
    />

    <!-- 添加或修改补卡申请对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="reviewForm" :model="reviewForm" :rules="rules" label-width="80px">
        <el-form-item label="审批" prop="state">
          <el-radio v-for="item in states2" v-model="reviewForm.state" :label="item.value">{{item.label}}</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deleteReceiveById, selectReceiveByXqId,updateReceiveByXqId } from '@/api/tfw/xqRcevie'
export default {
  name: 'index',
  data() {
    return {
      loading: false,
      receiveData: [],
      states: [{
        label: '审核中',
        value: 1,
      },{
        label: '已通过',
        value: 100,
      },{
        label: '驳回',
        value: 99,
      }],
      from: {
        pageNum: 1,
        pageSize: 10,
        xqName: null,
        nickName: null,
        state: 1,
      },
      total: 0,
      open: false,
      title: '',
      reviewForm: {},
      states2: [{
        label: '同意1',
        value: 100,
      },{
        label: '驳回',
        value: 99,
      }],
      // 表单校验
      rules: {
        state: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ]
      }
    }

  },
  created() {
    this.getReceive()
  },
  watch: {
  },
  methods: {
    getReceive() {
      this.loading = true
      selectReceiveByXqId(this.from).then(res => {
        this.receiveData = res.rows;
        this.total = res.total;
        this.loading = false
        console.log(this.receiveData)
      });
    },
    handleDeleteReceive(row){
      this.loading = true
      deleteReceiveById([row.id]).then(res => {
        this.$modal.msgSuccess('取消删除成功！')
        this.getReceive();
        this.loading = false
      });
    },
    handleQuery() {
      this.getReceive();
    },
    resetQuery() {
      this.from = {
        xq: {
          title: null,
        },
        user: {
          nickName: null,
        },
        state: 1,
      }
      this.getReceive();
    },
    handleApply(row) {
      this.reset();
      this.reviewForm.id = row.id;
      this.open = true;
      this.title = "审核小区领取申请";
    },
    /** 提交按钮 */
    submitForm() {
      this.reviewForm.reviewer = this.$store.state.user.userid
      this.$refs["reviewForm"].validate(valid => {
        this.reviewForm.state = 100
        console.log(this.reviewForm, 'reviewForm')
        if (valid) {
          if (this.reviewForm.id != null) {
            updateReceiveByXqId(this.reviewForm).then(response => {
              this.$modal.msgSuccess("审批成功");
              this.open = false;
              this.getReceive();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.reviewForm = {
        id: null,
        state: null,
        reviewer: this.$store.state.user.userid,
      };
      this.resetForm("reviewForm");
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
