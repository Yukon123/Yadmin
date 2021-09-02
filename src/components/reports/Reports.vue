<template>
  <div class="">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 600px; height: 400px" ref="echartRef"></div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
const axios: any = inject('axios')
const merge = require('lodash.merge')
import * as echarts from 'echarts'

const echartOptions = ref({})

const options = ref({
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
})
const echartRef: any = ref(null)
const initEcharts = () => {
  const myChart = echarts.init(echartRef.value)
  // 绘制图表
  myChart.setOption(echartOptions.value)
}
const getEchartList = async () => {
  let { data: res } = await axios.get('reports/type/1')
  if (res.meta.status !== 200) {
    return ElMessage.error('获取报表失败')
  } else {
    echartOptions.value = res.data

    merge(echartOptions, options)
  }
}

onMounted(async () => {
  await getEchartList()
  initEcharts()
})
</script>
<style scoped></style>
