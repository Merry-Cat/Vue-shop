<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <template>
      <el-row>
        <!-- 搜索框-->
        <el-col :span="8">
           <el-input placeholder="请输入搜索内容" v-model="query.query" clearable @clear="initGoodsData">
              <el-button slot="append" icon="el-icon-search" @click="initGoodsData"></el-button>
            </el-input>
        </el-col>
        <!-- 添加按钮-->
        <el-col :span="4" class="dis-left">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表-->
      <el-table :data="goodsData" border style="width: 100%" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name"  label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" width="95px" label="商品价格(元)">
        </el-table-column>
        <el-table-column prop="goods_weight" width="70px" label="商品重量">
        </el-table-column>
        <el-table-column width="160px"  label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" >
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGood(scope.row.goods_id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="delGood(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码-->
      <el-pagination
              class = "dis-page"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="query.pagenum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="query.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
      </template>
    </el-card>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        goodsData:[],//商品列表
        query:{//请求参数
          query:'',
          pagenum:1,//页码
          pagesize:10//每页多少条
        },
        total:0,//商品总数
      }
    },
    methods:{
      async initGoodsData(){
        const {data:res} = await this.$http.get('goods',{params:this.query});
        console.log(res)
        if(res.meta.status == 200){
          this.goodsData = res.data.goods
          this.total = res.data.total
        }
        else{
          return this.$message.error(res.meta.msg)
        }
      },
      //跳转到商品添加页
      goAddpage(){
        this.$router.push('goods/add')
      },
      //每页条数
      handleSizeChange(newSize){
        //console.log(newSize)
        this.query.pagesize = newSize
        this.initGoodsData()
      },
      //当前页
      handleCurrentChange(newPage){
        //console.log(newPage)
        this.query.pagenum = newPage
        this.initGoodsData()
      },
      //删除商品
      delGood(id){
        this.$confirm("确定删除商品吗?","提示",{
          confirmButtonText:'确定',
          cancelButtonText:'取消',
          type:'warning'
        }).then(async ()=>{
          const {data:res} = await this.$http.delete(`goods/${id}`)
          if(res.meta.status == 200){
            this.$message.success(res.meta.msg)
            this.initGoodsData()
          }
          else{
            this.$message.error(res.meta.msg)
          }
        }).catch(()=>{
          this.$message.info('已取消删除！')
        })
      }
    },
    created(){
      this.initGoodsData()
    }
  }
</script>

<style lang="less" scoped>
  .dis-left{
    margin-left: 15px;
  }
  .dis-page{
    margin-top: 15px;
  }
</style>
