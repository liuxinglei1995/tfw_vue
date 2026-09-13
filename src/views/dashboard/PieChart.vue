<template>
  <div :class="className" :style="{ height: height, width: width }">
  </div>
</template>

<script>
import * as echarts from 'echarts';
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
      default: '300px'
    },
    num: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      chart: null,
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
  watch: {
    num() {
      this.initChart(); // 数据变化时更新图表
    }
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '房源分析',
          x: 'center',
          y: 'bottom',
          textStyle: {
            color: 'black',
            fontSize: 20,
            fontWeight: 'bolder',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          // bottom: '10',
          top: "5%",
          // data: ['总楼盘', '已录入房源']
        },
        series: [
          {
            name: '小区房源录入情况',
            type: 'pie',
            minAngle: 25,
            radius: ["40", "70"],
            avoidLabelOverlap: false,
            // itemStyle: {
            //   borderRadius: 10,
            //   borderColor: '#fff',
            //   borderWidth: 2
            // },
            lable: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            // center: ['50%', '38%'],
            data: [
              { value: this.num.byfy, name: '备用房源-'+this.num.byfy },
              { value: this.num.sjcs, name: '上架售房-'+ this.num.sjcs},
              { value: this.num.xjzf, name: '下架已租房-'+ this.num.xjzf },

              { value: this.num.xjcs, name: '下架售房-'+ this.num.xjcs },
              { value: this.num.sjzf, name: '上架租房-'+ this.num.sjzf },
              { value: this.num.loupanNum, name: '总楼盘-'+ this.num.loupanNum },
              { value: this.num.pastNum, name: '已录入房源-'+ this.num.pastNum },
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  },
}
</script>
