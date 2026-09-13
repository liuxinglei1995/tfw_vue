<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="spanSize1" :xs="24" v-if="deptOptions.length > 0 && deptTreeShow">
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
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item v-if="deptOptions.length > 0">
            <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
          </el-form-item>
          <el-form-item label="用户名称" prop="uname">
            <el-input v-model="queryParams.uname" placeholder="请输入用户名称" clearable style="width: 240px"
              @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="打卡日期范围" label-width="120px">
            <el-date-picker v-model="dateRange" style="width: 240px" value-format="yyyy-MM-dd" type="daterange"
              range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="importshuju">考勤情况</el-button>
          </el-form-item>
        </el-form>

        <!-- 展示打卡记录 -->
        <el-dialog title="提示" :visible.sync="cardshow" width="50%">
          <el-table v-loading="loading" :data="cardlist" v-if="cardlist" height="450">
            <el-table-column label="名字" align="center" prop="nickName" />
            <el-table-column label="出勤次数" align="center" prop="presentCount" />
            <el-table-column label="缺勤次数" align="center" prop="absentCount" />
            <el-table-column label="早退次数" align="center" prop="earlyLeavingCount" />
            <el-table-column label="迟到次数" align="center" prop="lateCount" />
            <el-table-column label="请假" align="center" prop="askForLeaveCount" />
            <el-table-column label="年假" align="center" prop="annualLeaveCount" />
            <el-table-column label="正常休假" align="center" prop="normalCount" />
          </el-table>

          <span slot="footer" class="dialog-footer">
            <el-button @click="cardshow = false">取 消</el-button>
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport2">导出考勤表</el-button>
          </span>
        </el-dialog>


        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
              v-hasPermi="['chockln:chockln:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
              v-hasPermi="['chockln:chockln:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
              v-hasPermi="['chockln:chockln:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
              v-hasPermi="['chockln:chockln:export']">导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
        <el-table v-loading="loading" :data="chocklnList" @selection-change="handleSelectionChange" v-if="chocklnList">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="日期" align="center" prop="date" width="100">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="昵称" align="center" prop="uname"/>
          <el-table-column label="签到类型" align="center"
            prop="signInImg,signOutImg,signInTime,signOutTime,signInRemark,signOutRemark"
            :width="flexColumnWidth('单位', 'signInRemark')">
            <template slot-scope="scope">
              <div v-if="scope.row.type == 1">
                <!-- 签到 -->
                <div v-if="scope.row.signInTime"  style="display: flex;justify-content: space-around;align-items: center;margin-bottom: 10px;">
                  <div >
                    <dict-tag :options="dict.type.tfw_daka" :value="(JSON.parse(scope.row.signInRemark)).status" />
                    {{ JSON.parse(scope.row.signInRemark).type }}
                    {{ JSON.parse(scope.row.signInRemark).msg ? JSON.parse(scope.row.signInRemark).msg + "分钟" : "" }}
                  </div>
                  <el-button type="primary" plain @click="showImage(scope.row.signInImg)" size="mini">查看图片</el-button>
                </div>
                <el-button type="danger" plain v-else size="mini">未签到</el-button>
                <el-button type="danger" plain v-if="!scope.row.signOutTime" size="mini">未签退</el-button>
                <!-- 签退 -->
                <div style="display: flex;justify-content: space-around;align-items: center;" v-else>
                  <div>
                    <dict-tag :options="dict.type.tfw_daka" :value="JSON.parse(scope.row.signOutRemark).status" />
                    <div>{{ JSON.parse(scope.row.signOutRemark).type }}{{ JSON.parse(scope.row.signOutRemark).msg ?
                        JSON.parse(scope.row.signOutRemark).msg + "分钟" : "" }}</div>
                  </div>

                  <el-button type="primary" plain @click="showImage(scope.row.signOutImg)" size="mini">查看图片</el-button>
                </div>
              </div>
              <div v-else>
                <dict-tag :options="dict.type.tfw_qqlx" :value="scope.row.type" />
                <div>备注:{{ scope.row.askForLeave }}</div>
              </div>
              <el-image-viewer v-if="showphotos1" :on-close="closeViewer" :url-list="imglist"></el-image-viewer>
            </template>
          </el-table-column>
          <el-table-column label="时间" align="center" prop="signInTime,signOutTime"
            :width="flexColumnWidth('单位', 'signInTime', 'askForLeaveTime')">
            <template slot-scope="scope">
              <div style="" v-if="scope.row.type == 1">
                <div>签到时间</div>
                <div v-if="scope.row.signInTime">{{ scope.row.signInTime }}</div>
                <el-button type="danger" plain v-else size="mini">未签到</el-button>
                <el-button type="danger" plain v-if="!scope.row.signOutTime" size="mini">未签退</el-button>
                <div v-else>签退时间</div>
                <div>{{ scope.row.signOutTime }}</div>
              </div>
              <div v-else>
                {{ scope.row.askForLeaveTime }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="总时长" align="center" prop="totalHours" width="80">
            <template slot-scope="scope">
              <div style=" " v-if="scope.row.type == 1">
                <el-button type="danger" plain v-if="!scope.row.signInTime" size="mini">未签到</el-button>
                <el-button type="danger" plain v-if="!scope.row.totalHours" size="mini">未签退</el-button>
                <div v-if="scope.row.signInTime && scope.row.totalHours ">{{ toHourMinute(scope.row.totalHours) }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="打卡位置" align="center" prop="signInLocation"
            :width="flexColumnWidth('单位', 'signInLocation')">
            <template slot-scope="scope">
              <div v-if="scope.row.type == 1">
                <div>{{ scope.row.signInLocation }}</div>
                <div>{{ scope.row.signOutLocation }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="外勤签到" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.tfwChocklnOutsides.length }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" icon="el-icon-tickets" @click="showOutsides(scope.row)"
                         >外勤查看</el-button>
              <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                v-hasPermi="['chockln:chockln:edit']">修改</el-button>
              <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
                v-hasPermi="['chockln:chockln:remove']">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
      </el-col>
    </el-row>

    <!-- 添加或修改考勤对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="日期" prop="date">
          <el-date-picker clearable v-model="form.date" type="date" value-format="yyyy-MM-dd" placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门id" prop="deptId">
          <el-input v-model="form.deptId" placeholder="请输入部门id" />
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id" />
        </el-form-item>
        <el-form-item label="用户昵称" prop="uname">
          <el-input v-model="form.uname" placeholder="请输入用户昵称" />
        </el-form-item>
        <el-form-item label="签到图片" prop="signInImg">
          <el-input v-model="form.signInImg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="签退图片" prop="signOutImg">
          <el-input v-model="form.signOutImg" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="签到时间" prop="signInTime">
          <el-time-picker v-model="form.signInTime" placeholder="任意时间点" format='HH:mm:ss' value-format='HH:mm:ss'>
          </el-time-picker>
        </el-form-item>
        <el-form-item label="签退时间" prop="signOutTime">
          <el-time-picker v-model="form.signOutTime" placeholder="任意时间点" format='HH:mm:ss' value-format='HH:mm:ss'>
          </el-time-picker>
        </el-form-item>
        <el-form-item label="签到备注" prop="signInRemark">
          <el-input v-model="form.signInRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="签退备注" prop="signOutRemark">
          <el-input v-model="form.signOutRemark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="总时长" prop="totalHours">
          <el-input v-model="form.totalHours" placeholder="请输入总时长" />
        </el-form-item>
        <el-form-item label="签到位置" prop="signInLocation">
          <el-input v-model="form.signInLocation" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="签退位置" prop="signOutLocation">
          <el-input v-model="form.signOutLocation" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="请假提交日期" prop="askForLeaveTime">
          <el-date-picker clearable v-model="form.askForLeaveTime" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择请假提交日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请假备注" prop="askForLeave">
          <el-input v-model="form.askForLeave" placeholder="请输入请假备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改考勤对话框 -->
    <el-dialog title="外勤详情" :visible.sync="showSides" width="700px">
      <el-table
        :data="tfwChocklnOutsides"
        border
        style="width: 100%">
        <el-table-column prop="outsideTime"  label="外勤时间"  width="100">
        </el-table-column>
        <el-table-column  prop="outsideLocation"  label="外勤地址" width="350">
        </el-table-column>
        <el-table-column label="外勤图片" width="180">
          <template slot-scope="scope">
            <el-button type="primary" plain @click="showImage(scope.row.outsideImg)" size="mini">查看图片</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { deptTreeSelect, myCompanyTreeSelect } from "@/api/system/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listChockln, getChockln, delChockln, addChockln, updateChockln, statistics } from "@/api/chockln/chockln";
// 导入组件
import ElImageViewer from "element-ui/packages/image/src/image-viewer";

export default {
  name: "User",
  dicts: ['tfw_qqlx','tfw_daka'],
  components: { Treeselect, ElImageViewer },
  data() {
    return {
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
      // 用户表格数据
      chocklnList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        date: null,
        uname: null,
        signInImg: null,
        signOutImg: null,
        signInTime: null,
        signOutTime: null,
        signInRemark: null,
        signOutRemark: null,
        totalHours: null,
        signInLocation: null,
        signOutLocation: null,
        type: null,
        askForLeaveTime: null,
        askForLeave: null,
      },
      rules: {
        date: [
          { required: true, message: "日期不能为空", trigger: "blur" }
        ],
      },
      showphotos1: false,
      imglist: [],
      cardshow: false,
      cardlist: [],

      tfwChocklnOutsides: null,
      showSides: false,

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
    this.getDeptTree();
    this.getList();
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
    // 一建生成打卡数据
    importshuju() {
      statistics(this.addDateRange(this.queryParams, this.dateRange)).then(res => {
        this.cardshow = true;
        this.cardlist = res.rows;
      })
    },
    /**
    * 遍历列的所有内容，获取最宽一列的宽度
    * @param arr
    */
    getMaxLength(arr) {
      return arr.reduce((acc, item) => {
        if (item) {
          const calcLen = this.getTextWidth(item)
          if (acc < calcLen) {
            acc = calcLen
          }
        }
        return acc
      }, 0)
    },
    /**
     * 使用span标签包裹内容，然后计算span的宽度 width： px
     * @param valArr
     */
    getTextWidth(str) {
      let width = 0
      const html = document.createElement('span')
      html.innerText = str
      html.className = 'getTextWidth'
      document.querySelector('body').appendChild(html)
      width = document.querySelector('.getTextWidth').offsetWidth
      document.querySelector('.getTextWidth').remove()
      return width
    },
    /**
     * el-table-column 自适应列宽
     * @param prop_label: 表名
     * @param table_data: 表格数据
     *
     */
    flexColumnWidth(label, prop, a) {
      const arr = this.chocklnList.map(x => x[a])
      let flag=false
      for (const arrElement of arr) {
        if (arrElement !=null){
            flag=true
        }
      }
      if (flag) {
        arr.push(label) // 把每列的表头也加进去算
        // console.log(arr)
        // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
        return (this.getMaxLength(arr) + 25) + 'px'
      } else {
        // 1.获取该列的所有数据
        const arr = this.chocklnList.map(x => x[prop])
        arr.push(label) // 把每列的表头也加进去算
        // console.log(arr)
        // 2.计算每列内容最大的宽度 + 表格的内间距（依据实际情况而定）
        return (this.getMaxLength(arr) + 25) + 'px'
      }

    },
    // 计算时间
    toHourMinute(minutes) {

      return Math.floor(minutes / 60) + "小时" + (minutes % 60) + "分";
    },
    // 查看图片
    showImage(path) {
      this.imglist = [];
      this.imglist.push(path);
      this.showphotos1 = true;
    },
    // 关闭查看器
    closeViewer() {
      this.showphotos1 = false;
    },

    getList() {
      this.loading = true;
      listChockln(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.chocklnList = response.rows;
        this.total = response.total;
        console.log(this.chocklnList, "6666666666666");
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      myCompanyTreeSelect().then(response => {
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

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        date: null,
        uname: null,
        signInImg: null,
        signOutImg: null,
        signInTime: null,
        signOutTime: null,
        signInRemark: null,
        signOutRemark: null,
        totalHours: null,
        signInLocation: null,
        signOutLocation: null,
        type: null,
        askForLeaveTime: null,
        askForLeave: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
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
      this.title = "添加考勤";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getChockln(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改考勤";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateChockln(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChockln(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
              console.log(response, "1221212");
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除考勤编号为"' + ids + '"的数据项？').then(function () {
        return delChockln(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 查看外勤信息 */
    showOutsides(row) {
      this.tfwChocklnOutsides = row.tfwChocklnOutsides;
      this.showSides = true;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('chockln/chockln/export', {
        ...this.queryParams
      }, `chockln_${new Date().getTime()}.xlsx`)
    },
    handleExport2() {
      let excelName = new Date().getTime()
      if (this.dateRange.length != 0) {
        excelName = this.dateRange[0] + "至" + this.dateRange[1]
      }
      this.download('chockln/chockln/statisticsExport', {
        ...this.queryParams
      }, `${excelName}.xlsx`)
    },
  }
};
</script>

<style scoped></style>
