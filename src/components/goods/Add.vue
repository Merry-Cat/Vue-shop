<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <template>
        <el-alert
            title="添加商品信息"
            type="info"
            show-icon
            center
            :closable="false">
        </el-alert>
        <el-steps :active="active - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <!-- 竖行tab栏-->
        <el-form :rules="TabsFormRules" ref="TabsFormRef" :model="TabsForm" label-width="100px" label-position="top">
        <el-tabs :tab-position="tabPosition" v-model="active" :before-leave="beforeTableLeave" @tab-click="getTabIndex">
            <el-tab-pane label="基本信息" name="0">
               <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="TabsForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                   <el-input v-model="TabsForm.goods_price" type="number"></el-input>
                 </el-form-item>
                 <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="TabsForm.goods_weight" type="number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品数量" prop="goods_number">
                     <el-input v-model="TabsForm.goods_number" type="number"></el-input>
                   </el-form-item>
                   <el-form-item label="商品分类" prop="goods_cat">
                      <el-cascader
                        class="Topdis"
                        v-model="TabsForm.goods_cat"
                        :options="cateListtotal"
                        :props="cateprops"
                        @change="SelectedCateChanged"
                        clearable
                        ></el-cascader>
                    </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" v-for="item in manyTableArr" :key="item.attr_id">
                <template>
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox :label="val" v-for="(val,i) in item.attr_vals" :key="i" border></el-checkbox>
                  </el-checkbox-group>
                </template>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlyTableArr" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <el-upload
                :action="uploadImgUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headerObj"
                :on-success="handlSuccess">
                <el-button size="small" type="primary">点击上传</el-button>

              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器-->
              <quill-editor v-model="TabsForm.goods_introduce"
                              ref="myQuillEditor"
                              >
                </quill-editor>
                <el-button type="primary" class="btn-add" @click="addGoodsSubmit">添加商品</el-button>
            </el-tab-pane>
         </el-tabs>
         </el-form>
         <!-- 图片预览-->
         <el-dialog
           title="预览图片"
           :visible.sync="ImagedialogVisible"
           width="50%"
           :before-close="handleCloseImg">
           <img :src="previewUrl" alt="" class="imgClass">
         </el-dialog>
      </template>
    </el-card>
  </div>
</template>

<script>
  import _ from 'lodash'
  export default{
    data(){
      return{
      active:'0',//tab索引
      tabPosition:'left',//label与input框的相对位置
      cateListtotal:[],//商品分类列表
      TabsForm:{
        goods_name:'',
        goods_price:0,
        goods_number:0,
        goods_weight:0,
        goods_cat:[],
        pics:[],
        goods_introduce:'',
        attrs:[]
      },//添加商品的信息
      TabsFormRules:{
        goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
        goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
        goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
        goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
        goods_cat:[{required:true,message:'请输选择商品分类',trigger:'blur'}],
      },
      manyTableArr:[],//动态参数列表数据
      onlyTableArr:[],//静态参数列表数据
      cateprops:{//渲染
        expandTrigger:'hover',
        label:'cat_name',
        value:'cat_id',
        children:'children'
      },
      previewUrl:'',//预览图片url
      //设置图片上传请求url
      uploadImgUrl:'http://127.0.0.1:8888/api/private/v1/upload',
      //设置图片上传请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem("token")
      },
      ImagedialogVisible:false//图片预览弹窗控制
      }
    },
    methods:{
      async getCateList(){
        const {data:res} = await this.$http.get('categories')
        console.log(res)
        if(res.meta.status == 200){
          this.cateListtotal = res.data;
        }
        else{
          this.$message.error(res.meta.status)
        }
      },
      //监听商品分类选择
      SelectedCateChanged(data){
        if(data.length !== 3){
          this.TabsForm.goods_cat = []
          return
        }
      },
      //Table标签到下一个Table标签的校验
      beforeTableLeave(after,before){
        console.log(before,after)
        if(before==0&&this.TabsForm.goods_cat.length!==3){
          this.$message.error("请先填写商品分类！")
          return false
        }

      },
      //图片预览
      handlePreview(file){
        this.previewUrl=file.response.data.url
        this.ImagedialogVisible  = true
      },
      handleCloseImg(){
        this.ImagedialogVisible = false
      },
      //图片移除
      handleRemove(file){
        //删除图片名字
        console.log(file)
        const filePath = file.response.data.tmp_path;
        //获取删除图片的索引值
        const i = this.TabsForm.pics.findIndex(x=>{x.pic == filePath})
        this.TabsForm.pics.slice(i,1)
      },
      //图片上传成功的返回值
      handlSuccess(response){
        console.log(response)
        const picInfo = {pic:response.data.tmp_path}
        this.TabsForm.pics.push(picInfo)
      },
      async getTabIndex(){
        //console.log(this.active)
        if(this.active == '1'){
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{ sel:'many' }})
          console.log(res)
          if(res.meta.status == 200){
            res.data.forEach(item=>{
              item.attr_vals = item.attr_vals.length==0?[]:item.attr_vals.split(",")
            })
            this.manyTableArr = res.data
          }
          else{
            return this.$message.error("获取列表失败")
          }
        }
        else if(this.active == "2"){
          const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{ sel:'only' }})
          if(res.meta.status == 200){
            console.log(res)
            /* res.data.forEach(item=>{
              item.attr_vals = item.attr_vals.length==0?[]:item.attr_vals.split("")
            }) */
            this.onlyTableArr = res.data
          }
          else{
            this.$message.error(res.meta.msg)
          }
        }
      },
      //商品添加内容提交
      addGoodsSubmit(){
        this.$refs.TabsFormRef.validate(async valid=>{
          if(!valid)return this.$message.error("请填写必填项！")
          const subForm = _.cloneDeep(this.TabsForm)//插件进行深拷贝文件，防止前面数据绑定的good_cat因为改成字符串而报错
          subForm.goods_cat = subForm.goods_cat.join(',')
          //处理动态属性参数
          this.manyTableArr.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}
            this.TabsForm.attrs.push(newInfo)
          })
          //处理静态参数
          this.manyTableArr.forEach(item=>{
            const newInfo = {attr_id:item.attr_id,attr_value:item.attr_vals}
            this.TabsForm.attrs.push(newInfo)
          })
          subForm.attrs = this.TabsForm.attrs
          //console.log(subForm)
          const {data:res} = await this.$http.post('goods',subForm)
          if(res.meta.status == 201){
            this.$message.success(res.meta.msg)
          }
          else{
            return this.$message.error(res.meta.msg)
          }
        })
      }
    },
    created(){
      this.getCateList()
    },
    computed:{
      cateId(){
        if(this.TabsForm.goods_cat.length==3){
          return this.TabsForm.goods_cat[2]
        }
        else{
          return null
        }
      }
    }
  }
</script>

<style lang="less" scoped="scoped">
  .el-checkbox{
    margin:0 15px 5px 0!important
  }
  .imgClass{
    width: 100%;
  }
  .btn-add{
    margin-top: 15px;
  }
</style>
