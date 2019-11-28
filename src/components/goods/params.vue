<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert type="warning" :closable="false"><i class="el-icon-warning"></i>注意:只允许为第三级分类设置相关参数</el-alert>
      <span class="right-dis">选择商品分类:</span>
      <el-cascader
        class="Topdis"
        v-model="selectedgetKeys"
        :options="cateListtotal"
        :props="cateprops"
        @change="SelectedCateChanged"
        clearable
        ></el-cascader>
        <!-- 菜单导航-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="many" :disabled="isBtnDisabled">
              <!-- 添加参数按钮-->
              <el-button type="primary" class="btn-opt" @click="showAddParamDialog" :disabled="isBtnDisabled">添加参数</el-button>
              <el-table border :data="manyTableData" style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag  closable @close="removeTag(i,scope.row)" v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
                      <el-input
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        class="input-new-tag"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"

                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit"  @click="editParams(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态属性" name="only" :disabled="isBtnDisabled">
              <el-button type="primary" class="btn-opt" @click="addParamsdialogVisible = true" :disabled="isBtnDisabled">添加参数</el-button>
              <el-table border :data="onlyTableData" style="width: 100%">
                <!-- 展开行-->
                <el-table-column type="expand">
                  <template slot-scope="scope">
                    <el-tag  closable v-for="(item,i) in scope.row.attr_vals" :key="i">{{item}}</el-tag>
                    <el-input
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      class="input-new-tag"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    
                    >
                    </el-input>
                    <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                  </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name">
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit"  @click="editParams(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" @click="delParams(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <!-- 添加动态参数对话框-->
          <el-dialog
            :title="'添加'+titleText"
            :visible.sync="addParamsdialogVisible"
            width="40%"
            @close="addParamsClose">
            <el-form :model="addParamsData" ref="addParamsRef" :rules="addParamsRules" label-width="100px">
              <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="addParamsData.attr_name" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addParamsdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addParamsSubmit">确 定</el-button>
            </span>
          </el-dialog>
          <!-- 修改参数对话框-->
          <el-dialog
            :title="'修改'+titleText"
            :visible.sync="editParamsdialogVisible"
            width="40%"
            @close="editParamsClose">
            <el-form :model="editParamsData" ref="editParamsRef" :rules="editParamsRules" label-width="100px">
              <el-form-item :label="titleText" prop="attr_name">
                <el-input v-model="editParamsData.attr_name" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="editParamsdialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="editParamsSubmit">确 定</el-button>
            </span>
          </el-dialog>

    </el-card>
  </div>
</template>

<script>
  export default{
    data(){
      return{
        cateListtotal:[],
        cateprops:{
          label:'cat_name',
          value:'cat_id',
          children:'children'
        },
        //选择框双向绑定的数组
        selectedgetKeys:[],
        //被激活的页签的名称
        activeName:'many',
        addParamsData:{
          attr_name:'',
        },
        editParamsData:{
          attr_name:'',
        },
        manyTableData:[],//动态参数列表
        onlyTableData:[],//静态参数列表
        addParamsdialogVisible:false,//添加动态参数对话框
        editParamsdialogVisible:false,//修改参数对话框
        addParamsRules:{
          attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        },
        editParamsRules:{
          attr_name:[{required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        }
      }
    },
    methods:{
      async initCateList(){
        const {data:res} = await this.$http.get('categories')
        if(res.meta.status == 200){
          console.log(res.data)
          this.cateListtotal = res.data
        }
        else{
          this.$message.error(res.meta.msg)
        }
      },
      SelectedCateChanged(){
       this.getParamsDate()
      },
      //tab点击事件
      handleClick(){
        this.getParamsDate()
      },
      //添加动态参数弹出事件
      showAddParamDialog(){
        this.addParamsdialogVisible = true

      },
      //添加参数弹窗关闭事件
      addParamsClose(){
        this.$refs.addParamsRef.resetFields()
      },
      //获取参数的数据列表
      async getParamsDate(){
        //console.log(this.activeName)
        //根据所选ID请求获取面板参数
        if(this.selectedgetKeys.length!==3)
        {
          this.selectedgetKeys = [];
          this.manyTableData = []
          this.onlyTableData = []
          return
        }
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
        ///console.log(res.data)
        //遍历展开行字符串，改变成数组
       res.data.forEach(item=>{
          item.attr_vals  = item.attr_vals?item.attr_vals.split(','):[]
          item.inputVisible = false//控制文本框的显示
          item.inputValue = ''
        })
        if(res.meta.status == 200){
          if(this.activeName == 'many'){
            this.manyTableData = res.data
          }
          else{
            this.onlyTableData = res.data
          }
        }
        else{
           return this.$message.error(res.meta.status)
        }

      },
      //提交参数绑定
      addParamsSubmit(){
        this.$refs.addParamsRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addParamsData.attr_name,attr_sel:this.activeName})
          if(res.meta.status == 201){
            this.$message.success(res.meta.msg)
            this.addParamsdialogVisible = false
            this.getParamsDate()
          }
          else{
            this.$message.error(res.meta.msg)
          }
        })
      },
      //编辑参数
      async editParams(attr_id){
        this.editParamsdialogVisible = true;
        const {data : res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
        if (res.meta.status == 200){
          this.editParamsData = res.data
        }
        else{
          return this.$message.error(res.meta.msg)
        }
      },
      //删除参数
      delParams(attr_id){
        this.$confirm('是否删除参数?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async () => {
            const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
            console.log(res)
            if(res.meta.status == 200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getParamsDate()
            }
            else{
              return this.$message.error(res.meta.msg)
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      //关闭添加动态参数弹窗后执行的函数
      editParamsClose(){
        this.$refs.editParamsRef.resetFields()
      },
      editParamsSubmit(){
        this.$refs.editParamsRef.validate(async valid=>{
          if(!valid) return
          const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsData.attr_id}`,
          {attr_name:this.editParamsData.attr_name,attr_sel:this.activeName})
          if(res.meta.status == 200){
            this.$message.success(res.meta.msg)
          }
          else{
            this.$message.error(res.meta.msg)
          }
          this.editParamsdialogVisible = false
          this.getParamsDate()

        })
      },
      handleInputConfirm(row){
        if(row.inputValue.trim().length === 0){
          row.inputValue = ''
          row.inputVisible=false
          return
        }
        row.attr_vals.push(row.inputValue)
        this.saveAttrValues(row)
        row.inputValue = ''
        row.inputVisible=false
      },
      async saveAttrValues(row){
        const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name:row.attr_name,
          attr_sel:row.attr_sel,
          attr_vals:row.attr_vals.join(',')
        })
        //console.log(res)
        if(res.meta.status == 200){
          this.$message.success(res.meta.msg)
        }
        else{
          this.$message.error(res.meta.msg)
        }
      },
      showInput(params){
        params.inputVisible=true
        //点击加号之后自动获取文本框焦点
        //$nextTick页面重新渲染后会执行的方法
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除对应项
      removeTag(i,row){
       row.attr_vals.splice(i,1);
       this.saveAttrValues(row)
      }
    },
    created(){
      this.initCateList()
    },
    computed:{
      isBtnDisabled(){
        if(this.selectedgetKeys.length!==3){
          return true
        }else{
          return false
        }
      },
      cateId(){
        if(this.selectedgetKeys.length===3){
          return this.selectedgetKeys[2]
        }else{
          return null
        }
      },
      titleText(){
        if(this.activeName==="many")
        return "动态参数"
        else
        return "静态属性"
      }
    }
  }
</script>

<style scoped="scoped" lang="less">
  .Topdis{
    margin-top: 15px;
  }
  .right-dis{
    margin-right: 15px;
    display: inline-block;
  }
  .btn-opt{
    margin-top: 15px;
  }
  .el-tag{
    margin:5px;
  }
  .el-tag + .el-tag {
      margin-left: 10px;
    }
    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
</style>
