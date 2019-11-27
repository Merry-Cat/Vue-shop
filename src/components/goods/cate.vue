<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showcatelog">添加分类</el-button>
        </el-col>
      </el-row>
        <tree-table class="treeTable" :data = "catelist" :show-index="true" border index-text="#" :columns="columns" :selection-type="false" :expand-type="false">
            <template slot="isok" slot-scope="scope">
              <!-- {{scope.row}} -->
              <i class="el-icon-success" v-if="scope.row.cat_deleted == false" style="color:lightgreen"></i>
              <i class="el-icon-error" v-else style="color:red"></i>
            </template>
            <template slot="order" slot-scope="scope">
              <el-tag v-if="scope.row.cat_level == 0 " size="mini">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.cat_level == 1" size="mini">二级</el-tag>
              <el-tag type="warning" v-else size="mini">三级</el-tag>
            </template>
            <template slot="opt" slot-scope="scope">
              {{scope.col}}
               <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
        </tree-table>
        <!-- 页码区域-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[5,10,20,50]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
    </el-card>
    <!-- 添加分类-->
    <el-dialog
    title="提示"
      :visible.sync="addcatdialogVisible"
      width="500px"
      @close="closeAddCateDialog"
    >
      <el-form label-width="80px" :model="addcateForm" :rules="addcateFormRules" ref="addcateFormRef">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addcateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentcatelist"
              :props="catelistprops"
              @change="parentCateChanged"
              clearable
              :change-on-select="true"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcatdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcatesubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default{
    data(){
      return {
        catelist:[],//商品分类数据列表
        queryInfo:{//请求参数
          type:3,
          pagenum:1,
          pagesize:5
        },
        addcatdialogVisible:false,//控制添加分类弹窗的显示隐藏
        addcateForm:{
          cat_name:'',
          //分类id
          cat_pid:0,
          //分类等级
          cat_level:0
        },//添加分类的表单数据对象
        total:0,//商品总数
        columns:[{
          label:'分类名称',
          prop:'cat_name'
        },
        {
          label:'是否有效',
          type:'template',//表示当前这一列要是用的模板名称
          template:'isok'
        },
        {
          label:'排序',
          type:'template',
          template:'order'
        },
        {
          label:'操作',
          type:'template',
          template:'opt'
        }
        ],
        addcateFormRules:{
           cat_name:[
              { required: true, message: '请输入分类名称', trigger: 'blur' }
           ]
        },
        parentcatelist:[],//父级分类的列表
        //指定渲染分级列表的方式
        catelistprops:{
          expandTrigger:'hover',
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
        //选中的选项的id
        selectedKeys:[]
      }
    },
    methods:{
      async initcatelist(){
        const {data:res} = await this.$http.get('categories',{params:this.queryInfo});
        console.log(res)
        if(res.meta.status == 200){
          this.catelist = res.data.result;
          //console.log(res.data.result)
          this.total = res.data.total
        }else{
          this.$message.error(res.meta.msg)
        }
      },
      //获取父级分类的数据列表
      async getParentCateList(){
          const {data:res} = await this.$http.get('categories',{params:{ type:2}})
          //console.log(res)
          if(res.meta.status == 200){
            this.parentcatelist = res.data
            //console.log(this.parentcatelist)
          }
          else{
            this.$message.error(res.meta.msg)
          }
      },
      //监听父级选项的变化
      parentCateChanged(){
        console.log(this.selectedKeys)
        if(this.selectedKeys.length>0){
          this.addcateForm.cat_id = this.selectedKeys[this.selectedKeys.length-1]
          this.addcateForm.cat_level = this.selectedKeys.length;
          return
        }
        else{
          this.addcateForm.cat_id = 0;
          this.addcateForm.cat_level=0
        }
      },
      //监听添加分类对话框的关闭
      closeAddCateDialog(){
        this.$refs['addcateFormRef'].resetFields();
        this.selectedKeys = []
        this.addcateForm.cat_pid = 0
        this.addcateForm.cat_level = 0
      },
      //提交添加分类表单数据
      addcatesubmit(){
        this.$refs['addcateFormRef'].validate(async valid=>{
          if(!valid) return
          else{
           const {data:res} = await this.$http.post('categories',this.addcateForm)
           if(res.meta.status == 201){
             console.log(res)
             this.$message.success(res.meta.msg)
             this.initcatelist()
           }
           else{
             this.$message.error(res.meta.status)
           }
           this.addcatdialogVisible = false
          }
        })
      },
      //展示添加分类弹窗
      showcatelog(){
        //先获父级分类数据列表再展示对话框
        this.getParentCateList()
        this.addcatdialogVisible = true;

      },
      //监听pagesize改变
      handleSizeChange(newPagesiz){
          this.queryInfo.pagesize = newPagesiz
          this.initcatelist()
      },
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage;
        this.initcatelist()
      }
    },
    created(){
      this.initcatelist()
    }
  }
</script>

<style lang="less" scoped>
  .treeTable{
    margin-top: 15px;
  }
</style>
