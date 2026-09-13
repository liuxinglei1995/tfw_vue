<template>
  <div class="app-container">
    <!-- 领取人列表 -->
    <el-table :data="receiveData" style="width: 100%" v-loading="receiveLoading">
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column prop="xqName" label="小区" ></el-table-column>
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
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDeleteReceive(scope.row)">取消领取
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
  </div>
</template>

<script>
import { deleteReceiveById, selectReceiveByXqId } from '@/api/tfw/xqRcevie'
export default {
  name: 'index',
  data() {
    return {
      receiveData: [],
      receiveLoading: false,
      from: {
        pageNum: 1,
        pageSize: 10,
        userId: this.$store.state.user.userid
      },
      total: 0,
    }
  },
  created() {
    this.getReceive()
  },
  watch: {
  },
  methods: {
    getReceive() {
      this.receiveLoading = true
      selectReceiveByXqId(this.from).then(res => {
        this.receiveData = res.rows;
        this.total = res.total;
        this.receiveLoading = false
      });
    },
    //小区领取人员列表
    receiveList() {
      this.getReceive();
    },
    handleDeleteReceive(row){
      this.receiveLoading = true
      deleteReceiveById([row.id]).then(res => {
        this.$modal.msgSuccess('取消领取成功！')
        this.getReceive();
        this.receiveLoading = false
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
