<template>
  <div class="app-container" v-loading="loading" >
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="spanSize1" :xs="24" v-if="deptTreeShow">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small" prefix-icon="el-icon-search"
                    style="margin-bottom: 20px" />
        </div>
        <div class="head-container">
          <el-tree :data="deptOptions" :props="defaultProps" :expand-on-click-node="false"
                   :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                   @node-click="handleNodeClick" />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="spanSize2" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
          <el-form-item>
            <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
          </el-form-item>
          <el-form-item label="姓名" prop="user.nickName">
            <el-input v-model="queryParams.user.nickName" placeholder="请输入姓名" clearable @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="时间 " prop="dateRange">
            <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
                            range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
          </el-col>
        </el-row>

        <el-table :data="dailyList">
          <el-table-column label="汇报人" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.user.nickName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="汇报时间" align="center" width="150">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.updateTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="150">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.state === 1">草稿箱</el-tag>
              <el-tag type="success" v-else>完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-if="scope.row.state === 1 && userId === scope.row.userId" size="mini" type="text" icon="el-icon-edit"
                         @click="handleUpdate(scope.row)" >填写</el-button>
              <el-button v-if="scope.row.state === 1 && userId === scope.row.userId" size="mini" type="text" icon="el-icon-delete"
                         @click="handleDelete(scope.row)" >删除</el-button>
              <el-button v-if="scope.row.state === 2 && userId === scope.row.userId" size="mini" type="text" icon="el-icon-notebook-2" @click="showContent(scope.row)">查看</el-button>
              <el-button v-if="userId !== scope.row.userId" size="mini" type="text" icon="el-icon-notebook-2" @click="showContent(scope.row)">查看</el-button>
              <el-button v-if="scope.row.state === 1 && userId === scope.row.userId" size="mini" type="text" icon="el-icon-delete"
                         @click="handleDelete(scope.row)" v-hasPermi="['daily:daily:delete']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 合同模态框 -->
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
                    @pagination="getDataList" />

        <el-dialog :title="dailyTitle" :visible.sync="dailyFromSyn" width="50%" append-to-body :before-close="handleClose">
          <div style="overflow-x: auto; height: 450px;">
            <el-row v-for="item in dailyFrom">
              <el-col :span="18" style="margin-bottom: 10px"> <!-- 占据12栅格，即一半宽度 -->
                <div style="font-size: larger; font-weight: bolder;margin-left: 20px">
                  {{ item.stencilContent.text }}
                </div>
                <div style="display: flex;margin-top: 10px">
                  <ImagePreview v-if="item.stencilImage1" :coverFile="item.stencilImage1"  :height="70" :width="80" style="margin-left: 20px;"/>
                  <ImagePreview v-if="item.stencilImage2" :coverFile="item.stencilImage2"  :height="70" :width="80" style="margin-left: 20px;"/>
                </div>
              </el-col>
              <el-col :span="6" style="margin-bottom: 10px"> <!-- 占据12栅格，即一半宽度 -->
              </el-col>
              <el-col :span="18" style="margin-bottom: 10px"> <!-- 占据12栅格，即一半宽度 -->
                <div style="font-size: larger; font-weight: bolder;margin-left: 20px;">
                  <el-input v-if="show" type="textarea" v-model="item.text" placeholder="请填写汇报内容"
                            :autosize="{ minRows: 5, maxRows: 5}" maxlength="250" show-word-limit/>
                  <el-card v-else>
                    {{item.text}}
                  </el-card>
                </div>
              </el-col>
              <el-col :span="6" style="margin-bottom: 10px"> <!-- 占据12栅格，即一半宽度 -->
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18">
                <div style="margin-left: 20px;">
                  <el-button v-if="show" v-loading.fullscreen.lock="loading" @click="saveDailyContent('submit')">提交</el-button>
                  <el-button v-if="show" v-loading.fullscreen.lock="loading" @click="saveDailyContent('save')">保存</el-button>
                  <el-button v-if="show" @click="dailyFromSyn = false">取消</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import { listDaily, insertDaily, delDaily, updateDaily } from '@/api/daily/daily'
import { listStencilContentByUser } from "@/api/daily/stencilRole";
import { deptTreeSelect } from '@/api/system/user'

import { initNumber, isTimeExceeded } from '@/utils/activiti/myUtil'
import { listDailyContent } from '@/api/daily/dailyContent'
import ImagePreview from '@/views/daily/img/index.vue'
export default {
  dicts: ['contract_process'],
  components: {
    ImagePreview,
  },
  name: "Contract",
  data() {
    return {
      userId: null,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptOptions: undefined,
      // 表单参数
      form: {},
      //部门结构
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 总条数
      total: 0,
      // 日报数据
      dailyList: [],
      queryParams: {
        user: {
          nickName: null,
        },
        deptId: null,
        beginTime: null,
        endTime: null,
        pageSize: 10,
        pageNum: 1,
      },
      // 日期范围
      dateRange: [],
      //填写日报信息
      dailyLoading: true,
      dailyFromSyn: false,
      dailyTitle: "",
      dailyFrom: [],
      stencilId: null,
      dailyId: null,
      state: 1,
      show: true,


      // 外部合同填写规则
      contract: {},
      //合同流程
      processShow: false,

      deptTreeName: '显示部门树',
      deptTreeShow: false,
      spanSize1: 0,
      spanSize2: 24,
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.userId = this.$store.state.user.userid;
    this.getCurrentMonthRange()
    this.getDeptTree();
    this.getDataList();
  },
  methods: {
    initNumber,
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
    //获取当前月的开始时间与结束时间
    getCurrentMonthRange() {
      const now = new Date();
      // 获取当前月的第一天
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      // 获取当前月的最后一天
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      // 格式化日期为YYYY-MM-DD
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      this.queryParams.beginTime = formatDate(startDate)
      this.queryParams.endTime = formatDate(endDate)
      this.dateRange = [
        formatDate(startDate),
        formatDate(endDate)
      ];
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

    getDataList() {
      this.loading = true
      listDaily(this.queryParams).then(res => {
        this.dailyList = res.rows;
        this.total = res.total;
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
      this.resetForm("queryForm");
      this.queryParams = {
        user: {
          nickName: null,
        },
        deptId: null,
        beginTime: null,
        endTime: null,
        pageSize: 10,
        pageNum: 1,
      }
      this.getCurrentMonthRange()
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.show = true
      this.dailyTitle = "填写日报";
      //获取日报模板
      this.listStencilContent();
    },
    /** 获取我需填写的日报模板 */
    listStencilContent() {
      this.loading = true
      this.stencilId = null;
      this.state = 0;
      this.dailyFrom = []
      listStencilContentByUser().then(res => {
        this.loading = false
        if(res.msg === "400") {
          this.$modal.msgSuccess("暂未分配日报模板！");
          return false
        }
        this.dailyFromSyn = true;
        this.stencilId = res.data.id;
        //填写日报格式
        for (let content of res.data.contentList) {
          let remark = JSON.parse(content.remark)
          let value = {
            stencilContent: content,
            stencilImage1: remark.image1,
            stencilImage2: remark.image2,
            stencilContentId: content.id,
            text: '',
            remark: ""
          }
          this.dailyFrom.push(value)
        }
      })
    },

    //保存外部合同
    saveDailyContent(model) {
      this.loading = true
      let massage = '保存成功'
      let state = 1;
      if(model === 'submit') {
        //需校验是否全部填写
        for (let dailyContent of this.dailyFrom) {
          if(dailyContent.text.trim() === '') {
            this.$alert('未填写'+dailyContent.stencilContent.text, '警告', {
              confirmButtonText: '确定',
              callback: action => {
                this.loading = false;
                return false;
              }
            });
            return false;
          }
        }
        massage = '提交成功'
        state = 2
      }
      if(this.state === 0) {
        insertDaily({
          stencilId: this.stencilId,
          state: state,
          contentList: this.dailyFrom
        }).then(res =>{
          if(res.msg === "400") {
            this.loading = false
            this.dailyFromSyn = false;
            this.$message({
              type: 'info',
              message: "今天已有日报，无法重复创建"
            });
            return false
          }
          this.loading = false
          this.dailyFromSyn = false;
          this.getDataList();
          this.$message({
            type: 'success',
            message: massage
          });
        })
      } else {
        updateDaily({
          id: this.dailyId,
          state: state,
          contentList: this.dailyFrom
        }).then(res => {
          this.dailyFromSyn = false;
          this.loading = false
          this.$message({
            type: 'success',
            message: massage
          });
          this.getDataList();
        })
      }
    },
    handleUpdate(row) {
      this.show = true;
      this.loading = true
      this.dailyId = row.id;
      listDailyContent({ id: row.id }).then(res => {
        this.dailyFrom = res.rows;
        //填写日报格式
        for (let content of this.dailyFrom) {
          let remark = JSON.parse(content.stencilContent.remark)
          content.stencilImage1 = remark.image1;
          content.stencilImage2 = remark.image2;
        }
        this.loading = false;
        this.dailyTitle = "填写日报";
        this.dailyFromSyn = true;
        this.state = 1;
      })
    },

    showContent(row) {
      this.loading = true
      this.dailyId = row.id;
      listDailyContent({ id: row.id }).then(res => {
        this.show = false;
        this.dailyFrom = res.rows;
        this.loading = false;
        this.dailyTitle = "查看日报";
        this.dailyFromSyn = true;
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除"' + this.parseTime(row.date, '{y}-{m}-{d}') + '"的日报').then(function() {
        return delDaily(row.id);
      }).then(() => {
        this.getDataList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },

    handleClose(done) {
      if(!this.show) {
        this.dailyFromSyn = false
      } else {
        this.$confirm('确认关闭？').then(_ => {
          this.saveDailyContent()
          done();
        }).catch(_ => {});
      }
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
