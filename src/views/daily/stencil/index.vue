<template>
  <div class="app-container" v-loading="loading" >

    <el-form ref="queryForm" :model="queryParams" size="small" :inline="true" label-width="68px">
      <el-form-item label="模板名称" prop="company">
        <el-input v-model="queryParams.title" placeholder="请输入模板名称" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="" prop="state" oninput="">
        <el-radio-group v-model="queryParams.state">
          <el-radio-button label="1">未删除</el-radio-button>
          <el-radio-button label="2">已删除</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleStencilAdd(null)"
                   v-hasPermi="['stencil:stencil:insert']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
      </el-col>
    </el-row>

    <el-table :data="stencilList">
      <el-table-column label="日报模板名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.user.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-notebook-2" @click="handleContent(scope.row)">查看</el-button>
          <el-button size="mini" type="text" icon="el-icon-setting"
                     @click="handleStencilAdd(scope.row)">编辑</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['stencil:stencil:edit']"
                     @click="handleStencilDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                @pagination="getDataList" />

    <!-- 编辑日报模板 -->
    <el-dialog :title="stencilTitle" :visible.sync="stencilSync" width="50%" append-to-body :before-close="handleClose">
      <el-form label-position="left" label-width="130px"  ref="stencilForm" :model="stencilForm" :rules="stencilRules" style="font-family: initial;">
        <el-form-item label="模板名称" prop="title">
          <el-input v-model="stencilForm.title" placeholder="请输入日报模板名称" style="width: 99%"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="saveStencil()">确定</el-button>
          <el-button @click="stencilSync = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

<!--    编辑日报模板内容-->
    <el-dialog width="50%" append-to-body :visible.sync="contentSync">
      <div style="overflow-x: auto; height: 450px;">
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleContentEdit(null)"
                       v-hasPermi="['stencil:stencil:insert']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
          </el-col>
        </el-row>
        <el-table :data="contentList" >
          <el-table-column label="日报模板名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.text }}</span>
            </template>
          </el-table-column>
          <el-table-column label="模板图1" align="center" width="150">
            <template slot-scope="scope">
              <ImagePreview :coverFile="scope.row.remark.image1"  :height="70" :width="80" />
            </template>
          </el-table-column>
          <el-table-column label="模板图2" align="center" width="150">
            <template slot-scope="scope">
              <ImagePreview :coverFile="scope.row.remark.image2"  :height="70" :width="80" />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-setting"
                         @click="handleContentEdit(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" v-hasPermi="['stencil:stencil:edit']"
                         @click="handleContentDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="contentParams.total > 0" :total="contentParams.total" :page.sync="contentParams.pageNum" :limit.sync="contentParams.pageSize"
                    @pagination="getContentDataList" />
      </div>
      <div>
        <el-button @click="contentSync = false">取消</el-button>
      </div>
      <!-- 编辑日报模板 -->
      <el-dialog :title="contentTitle" :visible.sync="contentFromSync" width="50%" append-to-body :before-close="handleClose">
        <el-form label-position="left" label-width="130px"  ref="contentFrom" :model="contentFrom" :rules="contentRules" style="font-family: initial;">
          <el-form-item label="模板名称" prop="text">
            <el-input v-model="contentFrom.text" placeholder="请输入日报模板名称" style="width: 99%"/>
          </el-form-item>
          <el-form-item label="模板内容图片" prop="image">
            <div style="display: flex;justify-content: space-between;">
              <stencilUpload v-model="contentFrom.remark.image1" :limit="1" />
              <stencilUpload v-model="contentFrom.remark.image2" :limit="1"/>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="saveContent()">确定</el-button>
            <el-button @click="contentFromSync = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>

import { listStencil, addStencil, updateStencil, delStencil } from '@/api/daily/stencil'
import { listStencilContent, addStencilContent, updateStencilContent, delStencilContent } from '@/api/daily/stencilContent'

import { initNumber, isTimeExceeded } from '@/utils/activiti/myUtil'
import stencilUpload from '@/views/daily/stencil/upload/index.vue'
import ImagePreview from '@/views/daily/img/index.vue'

function changeFrameHeight() {
  var iframe = document.getElementById("iframe");
  iframe.height = document.documentElement.clientHeight;
}
window.onresize = function () {
  changeFrameHeight();
}
export default {
  components: {
    ImagePreview,
    stencilUpload
  },
  name: "stencil",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 日报模板数据
      stencilList: [],
      queryParams: {
        title: null,
        state: 1,
        pageNum: 1,
        pageSize: 10,
      },
      //新增日报模板
      stencilSync: false,
      stencilTitle: "",
      stencilForm: {
        title: '',
      },
      stencilRules: {
        title: [
          { required: true, message: '请填写日历模板名称', trigger: 'blur' },
        ],
      },
      //日报模板内容
      contentSync: false,
      contentList: [],
      contentParams: {
        stencilId: null,
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      contentTitle: '',
      contentFromSync: false,
      contentFrom: {
        text: '',
        remark: {
          image1:"",
          image2:"",
        }
      },
      contentRules: {
        text: [
          { required: true, message: '请填写日历模板内容名称', trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
      },
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    initNumber,
    getDataList() {
      this.loading = true
      listStencil(this.queryParams).then(res => {
        this.stencilList = res.rows;
        this.total = res.total;
        this.loading = false
      })
    },
    getContentDataList() {
      this.loading = true
      listStencilContent(this.contentParams).then(res => {
        this.contentList = res.rows;
        this.contentList.forEach(function(item, index) {
          item.remark = JSON.parse(item.remark)
        })
        this.contentParams.total = res.total;
        this.loading = false
      })
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getDataList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        title: null,
        state: 1,
        pageNum: 1,
        pageSize: 10,
      };
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleStencilAdd(row) {
      console.log(row !== null)
      this.reset();
      if(row !== null) {
        this.stencilTitle = "编辑日报模板";
        this.stencilForm = row
      } else {
        this.stencilTitle = "新增日报模板";
      }
      this.stencilSync = true;
      this.loading = false;
    },
    // 表单重置
    reset() {
      this.stencilForm = {
        title: "",
      };
    },
    //保存外部合同
    saveStencil() {
      this.$refs['stencilForm'].validate((valid) => {
        if (valid) {
          if(this.stencilForm.id != null) {
            updateStencil(this.stencilForm).then(res => {
              this.stencilSync = false;
              this.getDataList();
            })
          } else {
            addStencil(this.stencilForm).then(res => {
              this.stencilSync = false;
              this.getDataList();
            })
          }
        } else {
          return false;
        }
      });
    },
    /** 删除按钮操作 */
    handleStencilDelete(row) {
      this.$modal.confirm('是否确认删除合同编号为"' + row.id + '"的数据项？').then(function() {
        return delStencil(row.id);
      }).then(() => {
        this.getDataList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    handleContent(row) {
      this.contentSync = true
      this.contentParams = {
        stencilId: row.id,
        total: 0,
        pageNum: 1,
        pageSize: 10,
      };
      this.contentFrom.stencilId = row.id;
      this.getContentDataList();
    },
    handleContentEdit(row) {

      if(row !== null) {
        this.contentTitle = "编辑日报模板内容";
        this.contentFrom = row
      } else {
        this.contentTitle = "新增日报模板内容";
        this.contentFrom.text = ''
        this.contentFrom.remark = {
          image1:"",
          image2:"",
        }
      }
      this.contentFromSync = true;
      this.loading = false;
    },
    //保存
    saveContent() {
      console.log(this.contentFrom)
      this.$refs['contentFrom'].validate((valid) => {
        if (valid) {
          this.contentFrom.remark = JSON.stringify(this.contentFrom.remark);
          if(this.contentFrom.id != null) {
            updateStencilContent(this.contentFrom).then(res => {
              this.contentFromSync = false;
              this.getContentDataList();
            })
          } else {
            addStencilContent(this.contentFrom).then(res => {
              this.contentFromSync = false;
              this.getContentDataList();
            })
          }
        } else {
          return false;
        }
      });
    },
    /** 删除按钮操作 */
    handleContentDelete(row) {
      this.$modal.confirm('是否确认删除合同编号为"' + row.id + '"的数据项？').then(function() {
        return delStencilContent(row.id);
      }).then(() => {
        this.getDataList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
};
</script>
<style scoped>
.custom-div {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}
</style>
