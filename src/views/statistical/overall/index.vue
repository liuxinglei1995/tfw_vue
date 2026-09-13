<template>
  <div class="app-container" style="height: 100%">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="spanSize1" :xs="24" v-if="deptOptions.length > 0 && deptTreeShow" style="height: 100%">
        <div class="head-container">
          <el-input v-model="deptName" placeholder="请输入部门名称" clearable size="small"
                    prefix-icon="el-icon-search" style="margin-bottom: 10px" />
        </div>
        <div class="head-container" style="height: 670px;overflow-y: auto">
          <el-tree :data="deptOptions" :expand-on-click-node="true"
                   :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current
                   @node-click="handleNodeClick" />
        </div>
      </el-col>
      <el-col :span="spanSize2" :xs="24" >
        <div style="width: 99.8%;height: 100%;">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true"
                   label-width="68px">
            <el-form-item v-if="deptOptions.length > 0">
              <el-button type="primary" size="mini" @click="handleDeptTree">{{ deptTreeName }}</el-button>
            </el-form-item>
<!--            <el-form-item label="薪资记录" label-width="120px">-->
<!--              <el-date-picker v-model="queryParams.params.thisdate" type="month" placeholder="选择月"-->
<!--                              value-format="yyyy-MM" style="width: 240px" @change="pickerTime">-->
<!--              </el-date-picker>-->
<!--            </el-form-item>-->
            <el-form-item label="时间选择" label-width="120px">
              <el-select v-model="queryParams.type" placeholder="请选择">
                <el-option
                  v-for="item in timeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <div style="height: 680px;overflow-y: auto">
            <!--           必须设置明确尺寸-->
            <!--          <div ref="chartDom" class="echarts-container"></div>-->
            <StackedLineChart :title-name="titleChart1" :x-axis-data="xAxisData" :serve-data="serveData1"></StackedLineChart>
            <StackedLineChart :title-name="titleChart2" :x-axis-data="xAxisData" :serve-data="serveData2"></StackedLineChart>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { myDeptTreeSelect } from '@/api/system/user'
import StackedLineChart from '@/views/utils/echarts/StackedLineChart.vue'
import { deptAllList } from '@/api/echarts/echarts'

export default {
  components: {
    StackedLineChart,
  },
  data() {
    return {
      spanSize1: 6,
      spanSize2: 18,
      //部门相关
      defaultProps: {
        children: "children",
        label: "label"
      },
      deptOptions: [],// 部门树选项
      deptName: undefined,// 部门名称
      deptTreeName: '显示部门树',
      deptTreeShow: true,
      timeOptions: [{
        value: 1,
        label: '近3月'
      },{
        value: 2,
        label: '近半年'
      },{
        value: 3,
        label: '近1年'
      }],
      //查询内容
      queryParams: {
        nickName: "",
        deptId: null,
        type: 1,
        salesType: null,
        choice: 1,
        params: { thisdate: null }
      },
      params: {},
      //图表内容x轴
      xAxisData:['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      //图表内容，独立
      titleChart1: '',
      serveData1: {
        '张飞': [120, 132, 101, 134, 90, 230, 210],
        '关羽': [220, 182, 191, 234, 290, 330, 310],
      },
      titleChart2: '',
      serveData2: {
        '张飞2': [12, 13, 10, 13, 9, 23, 21],
        '关3': [22, 18, 19, 23, 29, 33, 31],
      },
    }
  },
  created() {
    this.queryParams.deptId = this.$store.state.user.deptId
    this.getInfo()
    let nowDate = new Date();
    let month = nowDate.getMonth() + 1
    if(month < 10) month = '0'+month;
    const result = this.getMonthStartAndEnd(nowDate.getFullYear() + "-" + month);
    this.params = {
      beginTime: result.startDate,
      endTime: result.endDate,
    }
    this.initChart1();
    this.initChart2();
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    async getInfo() {
      await this.getDeptTree();
      await this.nowTime();
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      myDeptTreeSelect().then(response => {
        console.log(response)
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
    //显示/隐藏搜索条件
    handleDeptTree() {
      if (this.deptTreeShow) {
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
    /** 时间插件 */
    nowTime() {
      let nowDate = new Date();
      let month = nowDate.getMonth() + 1
      if(month < 10) month = '0'+month;
      let date = {
        // 获取当前年份
        year: nowDate.getFullYear(),
        //获取当前月份
        month: month,
      };
      //拼接
      this.queryParams.params.thisdate = date.year + "-" + date.month;
    },
    pickerTime(value) {
      this.queryParams.params.thisdate = value
      let result = this.getMonthStartAndEnd(value);
      this.params.beginTime = result.startDate
      this.params.endTime = result.endDate
    },
    getMonthStartAndEnd(yyyyMM) {
      // 解析字符串为年份和月份
      const [year, month] = yyyyMM.split('-').map(Number);
      // 获取月份的第一天
      const startDate = new Date(year, month - 1, 1);
      const formattedStartDate = this.formatDate(startDate);
      // 获取月份的最后一天
      const endDate = new Date(year, month, 0);
      const formattedEndDate = this.formatDate(endDate);
      return {
        startDate: formattedStartDate,
        endDate: formattedEndDate
      };
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.initChart1();
      this.initChart2();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.time = "";
      this.resetForm("queryForm");
      this.queryParams.deptId = undefined;
      this.queryParams.status = "1";
      this.$refs.tree.setCurrentKey(null);
      this.queryParams.postIds = null;
      this.handleQuery();
    },

    /** 查询 */
    initChart1() {
      let queryParams1 = this.queryParams
      queryParams1.salesType = 1
      console.log(queryParams1, 'queryParams1()')
      deptAllList(queryParams1).then(res => {
        this.titleChart1 = "最近统计图"
        this.xAxisData = res.months
        this.serveData1 = res.serve
        console.log(res, 'res')
      })
    },
    initChart2() {
      let queryParams2 = this.queryParams
      queryParams2.salesType = 2
      console.log(queryParams2, 'queryParams1()')
      deptAllList(queryParams2).then(res => {
        this.titleChart1 = "最近统计图详情"
        this.xAxisData = res.months
        this.serveData2 = res.serve
        console.log(res, 'res')
      })
    },
  },
};
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 500px; /* 必须明确高度 */
  min-height: 300px; /* 防止内容塌陷 */
}
</style>
