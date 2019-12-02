<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width: 800px;height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
  import echarts from 'echarts'
  export default{
    data(){
      return {
        options:{}//数据报表数据
      }
    },
    methods:{
      getChartData(){

      }
    },
    created(){
      //this.getChartData()
      //console.log(this.options)
    },
    async mounted(){
      const {data:res} = await this.$http.get('reports/type/1')
      console.log(res)
      if(res.meta.status == 200){
        this.options = res.data
      }
      else{
        return this.$message.error(res.meta.msg)
      }
      var Chart1 = echarts.init(document.getElementById("main"))
      var option = {
        title:{
          text:'数据报表'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        legend:this.options.legend,
        xAxis:this.options.xAxis,
        yAxis:this.options.yAxis,
        series:this.options.series,
        
      }
      console.log(option)
      Chart1.setOption(option)
      }
    }
</script>

<style>
</style>
