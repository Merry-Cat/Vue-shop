<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域-->
      <template>
        <el-table :data="userlist" border style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              {{scope.col}}
              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>

              <el-tooltip effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-s-tools" circle size="mini"></el-button>
              </el-tooltip>
            </template>
           </el-table-column>
        </el-table>
        <!-- 页码区域-->
        <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="query.pagenum"
              :page-sizes="[1, 2, 5, 10]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
      </template>
    </el-card>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        query:{
          query:'',
          pagenum:1,
          pagesize:2//当前每页显示多少条
        },
        userlist:[],
        total:0
      }
    },
    methods:{
       async getUserList(){
         const {data:res} = await this.$http.get('users',{params:this.query})
         if(res.meta.status == 200){
           //console.log(res)
           this.userlist = res.data.users
           this.total = res.data.total
         }
         else{
           this.$message.error(res.meta.msg)
         }
      },
      //每页多少条数据
      handleSizeChange(newSize){
        //console.log(newSize)
        this.query.pagesize =newSize
        this.getUserList();
      },
      handleCurrentChange(newPage){
        //console.log(newPage)
        this.query.pagenum = newPage
        this.getUserList()
      }
    },
    created(){
      this.getUserList()
    }
  }
</script>

<style lang="less" scoped>
  .block{
    margin-top: 15px;
  }
</style>
