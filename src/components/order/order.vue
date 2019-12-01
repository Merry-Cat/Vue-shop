<template>
   <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 搜索框-->
        <el-col :span="8">
           <el-input placeholder="请输入搜索内容" v-model="order_id" clearable  @clear="clearSearchData">
              <el-button slot="append" icon="el-icon-search" @click="searchOrdersData"></el-button>
            </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表区域-->
      <el-table border :data="Orderlist" stripe width="100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单ID" prop="order_id" width="100px"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>
        <el-table-column label="是否付款"  width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>
        <el-table-column label="下单时间" width="200px">
          <template slot-scope="scope">
            {{scope.row.create_time|dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editOrder(scope.row.order_number)"></el-button>
            <el-button type="success" icon="el-icon-location" @click="Progress(scope.row.consignee_addr)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码区域-->
      <el-pagination
              class = "dis-page"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="orderQuery.pagenum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="orderQuery.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
    </el-card>
      <!-- 订单地址编辑操作-->
      <el-dialog :visible.sync="orderEditdialogVisible" title="修改地址" width="40%" @close="closeDialog">
         <el-form label-width="100px" :model="CityOption" :rules="CityOptionRules" ref="CityOptionRef">
           <el-form-item label="省市区/县" prop="options">
            <el-cascader :options="citydata"  v-model="CityOption.options" clearable></el-cascader>
           </el-form-item>
           <el-form-item label="详细地址" prop="detail_addr">
             <el-input v-model="CityOption.detail_addr"></el-input>
           </el-form-item>
         </el-form>
         <span slot="footer" class="dialog-footer">
            <el-button @click="orderEditdialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="orderEditdialogVisible = false">确 定</el-button>
          </span>
      </el-dialog>
      <!-- 订单详细页-->
      <el-dialog class="detail" :visible.sync="orderDetaidialogVisible" title="订单详情" width="40%" @close="closedetail">
        <el-row>
          <el-col :span="4">订单ID:</el-col>
          <el-col :span="20">{{searchOrder.order_id}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">订单编号:</el-col>
          <el-col :span="20">{{searchOrder.order_number}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">订单价格:</el-col>
          <el-col :span="20">{{searchOrder.order_price}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">是否发货:</el-col>
          <el-col :span="20">{{searchOrder.is_send}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">支付方式:</el-col>
          <el-col :span="20">
            <el-tag v-if="searchOrder.order_pay==='0'" type="danger">未支付</el-tag>
            <el-tag v-else-if="searchOrder.order_pay==='1'" type="success">支付宝</el-tag>
            <el-tag v-else-if="searchOrder.order_pay==='2'" type="success">微信</el-tag>
            <el-tag v-else-if="searchOrder.order_pay==='3'" type="success">银行卡</el-tag>
            <span v-else></span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">收货地址:</el-col>
          <el-col :span="20">{{searchOrder.consignee_addr}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">支付状态:</el-col>
          <el-col :span="20">
              <el-tag type="danger" v-if="searchOrder.pay_status===0">未支付</el-tag>
              <el-tag type="success" v-lese>已支付</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">商品名:</el-col>
          <el-col :span="20" v-model="searchOrder.goods">
            <template slot-scope="scope">
              {{scope.row}}
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">收货地址:</el-col>
          <el-col :span="20">{{searchOrder.consignee_addr}}</el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
           <el-button @click="orderDetaidialogVisible = false" type="primary">确定</el-button>
         </span>
      </el-dialog>
      <!-- 物流信息-->
      <el-dialog :visible.sync="ProgressDialogVisible" title="物流信息">
        <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in timeLineArr"
              :key="index"
              :color="activity.color"
              :type="activity.type"
              :timestamp="activity.ftime">
              {{activity.context}}
            </el-timeline-item>
          </el-timeline>
      </el-dialog>
   </div>
</template>

<script>
  import citydata from './city_data2017_element.js'
  export default{
    data(){
      return {
       orderQuery:{
         query:'',//查询参数
         pagenum:1,//当前页码
         pagesize:10,//每页显示多少条
         user_id:'',//请求的用户id
         pay_status:'',//订单支付状态
         is_send:'',//是否发货
         order_fapiao_title:'',//发票标题
         order_fapiao_company:'',//发票公司
         order_fapiao_content:'',//发票内容
         consignee_addr:''//收货地址
       },
       order_id:'',//订单id查询
       //省市区联动数据
       citydata:citydata,
       CityOption:{
         options:[],
         detail_addr:''
       },
       total:0,//订单总数
       Orderlist:[],//订单数据存放地址
       orderEditdialogVisible:false,//订单编辑弹窗控制
       orderDetaidialogVisible:false,//订单详细
       ProgressDialogVisible:false,//物流信息
       CityOptionRules:{
         options:[{required:true,trigger:'blur',message:'请选择地区'}],
         detail_addr:[{required:true,trigger:'blur',message:'请填写详细地址'}]
       },
       searchOrder:{},//根据订单id搜索的内容
       timeLineArr:[]//物流时间线数据
      }
    },
    created(){
      this.initOrdersData()
    },
    methods:{
      //初始化订单页面数据
      async initOrdersData(){
        const {data:res} = await this.$http.get('orders',{params:this.orderQuery})
        console.log(res)
        if(res.meta.status == 200){
          this.Orderlist = res.data.goods;
          this.total = res.data.total;
        }
        else{
          return this.$message.error(res.meta.msg)
        }
      },

      //关闭订单详情弹窗
      clearSearchData(){
        this.searchOrder = {}
      },
      closedetail(){
        this.searchOrder = {}
      },
      //物流信息
      async Progress(){
        const {data:res} = await this.$http.get('kuaidi/804909574412544580')//因为只有测试数据就直接写死了。
        console.log(res)
        if(res.meta.status == 200){
          this.timeLineArr = res.data;
          this.timeLineArr[0].color='#0bbd87'
        }
        else{
          return this.$message.error(res.meta.msg)
        }
        this.ProgressDialogVisible = true
      },
      //关闭修改地址弹窗
      closeDialog(){
        this.$refs.CityOptionRef.resetFields()
      },
      //每页条数
      handleSizeChange(newSize){
        //console.log(newSize)
        this.orderQuery.pagesize = newSize
        this.initOrdersData()
      },
      //当前页
      handleCurrentChange(newPage){
        //console.log(newPage)
        this.orderQuery.pagenum = newPage
        this.initOrdersData()
      },
      //根据订单id查询订单情况
      async searchOrdersData(){
        this.orderDetaidialogVisible = true;
        const {data:res} = await this.$http.get(`orders/${this.order_id-0}`)
        console.log(res)
        if(res.meta.status == 200){
          this.searchOrder = res.data
        }
        else{
          return this.$message.error(res.meta.msg)
        }
      },
      editOrder(){
        this.orderEditdialogVisible = true
      },
    }
  }
</script>

<style lang="less" scoped="scoped">
  .dis-page{
    margin-top: 15px;
  }
  .el-cascader{
    width: 100%;
  }
  .detail{
    .el-row{
      line-height: 40px;
    }
  }
</style>
