<template>
  <div :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 6000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    barchatrs: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        title: {
          text: '客户分析',
          x: 'center',
          y: 'bottom',
          textAlign: 'center',
          textStyle: {
            color: 'black',
            fontSize: 18,
            fontWeight: 'bolder',
          },
        },

        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
          }
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天']
        },
        series: [
          {
            name: '新增客户',
            type: 'bar',
            stack: 'total',
            barWidth: 20,//柱图宽度
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [320, 302, 301, 334, 390, 330, 320]
          },
          {
            name: '新增带看',
            type: 'bar',
            stack: 'total',
            barWidth: 20,//柱图宽度
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '今日成交',
            type: 'bar',
            stack: 'total',
            barWidth: 20,//柱图宽度
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: [220, 182, 191, 234, 290, 330, 310],
            itemStyle: {
              barBorderRadius: [0, 12, 12, 0],
            }
          },
        ]
      })
    }
  }
}
</script>
