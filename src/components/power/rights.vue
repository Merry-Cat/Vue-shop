<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 权限列表-->
      <template>
        <el-table :data="rightlist" border stripe style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="authName" label="权限名称"></el-table-column>
          <el-table-column prop="path" label="路径"></el-table-column>
          <el-table-column prop="level" label="权限等级">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.level === '0'" >一级</el-tag>
              <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
              <el-tag v-else type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        rightlist:[]
      }
    },
    methods:{
      async initData(){
        const {data:res} = await this.$http.get('rights/list')
        if (res.meta.status == 200)
        this.rightlist = res.data
        else
        this.$message.error(res.meta.msg)
      }
    },
    created(){
      this.initData()
    }
  }
</script>

<style>
</style>
