<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {
      echartOptions: {},
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
    }
  },
  watch: {},
  computed: {},
  methods: {
    initEcharts() {
      console.log(echartOptions)
      let myChart = echarts.init(document.getElementById('main'))
      // 绘制图表
      myChart.setOption(echartOptions)
    },
    async getEchartList() {
      let { data: res } = await axios.get('reports/type/1')
      console.log(res)
      if (res.meta.status !== 200) {
        return ElMessage.error('获取报表失败')
      } else {
        echartOptions = res.data
        _.merge(echartOptions, options)
      }
    },
  },
  created() {},
  async mounted() {
    await getEchartList()
    initEcharts()
  },
}
</script>
<style scoped></style>
