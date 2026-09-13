<!-- 折线图堆叠 -->
<template>
  <div ref="chartDom" class="echarts-container"></div>
</template>
<script>
export default {
  name: 'StackedLineChart',
  data() {
    return {
      chart: null,
      seriesData: {},
      legendData: [],
    }
  },
  props: {
    titleName: {}, //图表名称
    xAxisData: {}, //图表X轴内容
    serveData: {},
    housephotos:{},
    huxing:{},
    width: {
      type: [Number, String],
      default: ""
    },
    height: {
      type: [Number, String],
      default: ""
    }
  },
  created() {
    this.beforeUnmount()
  },
  watch: {
    titleName: {
      handler() {
        console.log(this.titleName, 'titleName')
      },
      deep: true // 深度监听父组件传过来对象变化
    },
    xAxisData: {
      handler() {
        console.log(this.xAxisData, 'xAxisData')
        this.beforeUnmount();
        this.initData();
      },
      deep: true // 深度监听父组件传过来对象变化
    },
    serveData: {
      handler() {
        //传输格式为 {'name1':[],'name2':[]} 格式
        console.log(this.serveData, 'serveData')
        this.beforeUnmount();
        this.initData();
      },
      deep: true // 深度监听父组件传过来对象变化
    }
  },
  mounted() {
    //检查是否已加载
    if (typeof this.$echarts === 'undefined') {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js'
      script.onload = () => this.initData()
      document.head.appendChild(script)
    } else {
      this.initData()
    }
  },
  methods: {
    initData() {
      //处理内容
      try {
        this.seriesData = Object.entries(this.serveData).map(([key, value]) => ({
          name: key,
          type: 'line',
          stack: 'Total',
          smooth: true,
          data: value
        }));
        this.legendData = Object.keys(this.serveData);
      } finally {

      }
      this.initChart();
    },
    initChart(){
      // 1. 初始化图表实例
      const echarts = this.$echarts.init(this.$refs.chartDom);
      // 2. 配置图表数据
      const option = {
        title: {
          top:'0%',
          text: this.titleName
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top:'8%',
          data: this.legendData
          // data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
        },
        grid: {
          top:'18%',
          left: '3%',
          right: '4%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series: this.seriesData
        // series: [
        //   {
        //     name: 'Email',
        //     type: 'line',
        //     stack: 'Total',
        //     smooth: true,
        //     data: [120, 132, 101, 134, 90, 230, 210]
        //   },
        //   {
        //     name: 'Union Ads',
        //     type: 'line',
        //     stack: 'Total',
        //     smooth: true,
        //     data: [220, 182, 191, 234, 290, 330, 310]
        //   },
        //   {
        //     name: 'Video Ads',
        //     type: 'line',
        //     stack: 'Total',
        //     smooth: true,
        //     data: [150, 232, 201, 154, 190, 330, 410]
        //   },
        //   {
        //     name: 'Direct',
        //     type: 'line',
        //     stack: 'Total',
        //     smooth: true,
        //     data: [320, 332, 301, 334, 390, 330, 320]
        //   },
        //   {
        //     name: 'Search Engine',
        //     type: 'line',
        //     stack: 'Total',
        //     smooth: true,
        //     data: [820, 932, 901, 934, 1290, 1330, 1320]
        //   }
        // ]
      };
      // 3. 渲染图表
      echarts.setOption(option);
      // 4. 响应式适配（核心方案）
      const resizeObserver = new ResizeObserver(() => {
        echarts.resize();
      });
      resizeObserver.observe(this.$refs.chartDom);
      // 5. 保存实例到组件实例
      this.chart = echarts;
    },
    beforeUnmount() {
      // 组件销毁时清理资源
      if (this.chart) {
        this.chart.dispose(); // 销毁实例
        this.chart = null;
      }
    }
  }
}
</script>
<style scoped>

</style>
