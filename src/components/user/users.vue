<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="query.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary"  @click="dialogFormVisible = true">添加用户</el-button>
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
              <el-switch v-model="scope.row.mg_state" @change="changetype(scope.row.id,scope.row.mg_state)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini" @click="update(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deldialog(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-s-tools" circle size="mini" @click="setRole(scope.row)"></el-button>
              </el-tooltip>
            </template>
           </el-table-column>
        </el-table>
        <!-- 分配角色弹窗-->
        <el-dialog title="分配角色" :visible="setRoleDialogVisible" width="500px" @close="closeAlert">
          <el-form ref="setRoleRef">
            <div>
              <p>当前用户：{{userInfo.username}}</p>
              <p>当前角色：{{userInfo.role_name}}</p>
              <p><template>
                <el-select v-model="selectedRoleId" clearable placeholder="请选择">
                  <el-option
                    v-for="item in roleList"
                    :key="item.value"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
              </p>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="setRoleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="setRolesubmit">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 修改弹窗用户-->
       <el-dialog title="修改用户" :visible.sync="updatedialogFormVisible" width="500px" @close="closeRef">
          <el-form :model="updateUser" :rules="checkTelAndEmailrules" ref="closeRef" >
            <el-form-item label="用户名" :label-width="formLabelWidth" >
              <el-input v-model="updateUser.username" autocomplete="off" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="updateUser.email" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="updateUser.mobile" autocomplete="off" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="updatedialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editInfo">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 添加用户区域-->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="500px" @close="close">
          <el-form :model="form" :rules="rules" ref="addRef" >
            <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
              <el-input v-model="form.username" autocomplete="off"  ></el-input>
            </el-form-item>
            <el-form-item label="用户密码"  prop="password" :label-width="formLabelWidth">
              <el-input v-model="form.password"  autocomplete="off" type="password" ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
              <el-input v-model="form.email" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
              <el-input v-model="form.mobile" autocomplete="off" ></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="adduser">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 删除操作的弹窗-->
        <el-dialog
          title="提示"
          :visible.sync="deldialogVisible"
          width="30%"
          >
          <span>确定删除用户吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="danger" @click="deluser">删除</el-button>
          </span>
        </el-dialog>
        <!-- 页码区域-->
        <div class="block">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="query.pagenum"
              :page-sizes="[5, 10, 20, 50]"
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
      var checkEmail = (rules,value,cb)=>{
        const regEmail =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value))
         {
           return cb()
         }
         else
         {
           return cb(new Error('请输入合法的邮箱'))
         }
      }
      var checkTel = (rules,value,cb)=>{
        const regTel = /^1+[3-8]+[0-9]{9}$/
        if(regTel.test(value))
        {
          return cb()
        }
        else
        {
          return cb( new Error("请输入合法手机号"))
        }
      }
      return{
        query:{
          query:'',
          pagenum:1,
          pagesize:5//当前每页显示多少条
        },
        userlist:[],
        total:0,//数据总条数
        delId:0,
        dialogTableVisible: false,
        dialogFormVisible: false,
        updatedialogFormVisible:false,
        deldialogVisible:false,
        setRoleDialogVisible:false,
        formLabelWidth:"80px",
        form:{
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        checkTelAndEmailrules:{
          mobile:[
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator:checkTel,trigger:'blur' }
          ],
          email:[
            { required: true, message: '请输入正确的邮箱', trigger: 'blur' },
            { validator:checkEmail,trigger:'blur' }
          ]
        },
        updateUser:{},//更新用户状态需要的数据
        userInfo:{},//要更新权限的用户数据
        roleList:[],//分配角色数据
        selectedRoleId:'',
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在3到6个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail,trigger:'blur'}
          ],
          mobile:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: checkTel,trigger:'blur'}
          ]
        }
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
      },
      //修改用户状态
      async changetype(uId,type){
        //console.log(uId)
        const {data:res} = await this.$http.put(`users/${uId}/state/${type}`)
        if (res.meta.status == 200){
          this.$message.success("修改成功！")
        }
        else{
          return this.$message.error(res.meta.msg)
        }
      },
      async update(id){
        this.updatedialogFormVisible = true
        const {data:res} = await this.$http.get(`users/${id}`)
        if(res.meta.status ==200){
          //console.log(res.data)
          this.updateUser = res.data
        }
        else{
          return this.$message.error(res.meta.msg)
        }
      },
      //修改用户数据并提交
      editInfo(){
        this.$refs.closeRef.validate( async valid=>{
          if (!valid){ return}
            const {data:res} = await this.$http.put('users/'+this.updateUser.id,{email:this.updateUser.email,
            mobile:this.updateUser.mobile
            })
            console.log(res)
            if(res.meta.status == 200)
            {
              this.$message.success(res.meta.msg)
            }
            else{
              this.$message.error(res.meta.msg)
            }
            this.updatedialogFormVisible = false
        })
      },
      //新增用户
       adduser(){
         this.$refs.addRef.validate(async valid=>{
           //console.log(valid)
           if (!valid)return
             const {data:res} = await this.$http.post('users',this.form)
             if(res.meta.status == 201)
             {
               this.$message.success(res.meta.msg)
             }
             else{
               this.$message.error(res.meta.msg)
             }
            this.dialogFormVisible = false
         })
      },
      //删除用户数据
      deldialog(id){
        this.deldialogVisible = true
        this.delId=id
      },
      async deluser(){
        const {data:res} = await this.$http.delete('users/'+this.delId)
        if(res.meta.status == 200){
          this.$message.success(res.meta.msg)
        }
        else{
          this.$message.success(res.meta.msg)
        }
        this.deldialogVisible = false
        this.getUserList()
      },
      async setRole(userInfo){
        this.userInfo = userInfo
        const {data:res} = await this.$http.get('roles')
        if(res.meta.status == 200){
          this.roleList = res.data;
        }
        else{
          this.$message.error(res.meta.msg)
        }
        this.setRoleDialogVisible = true
      },
      //关闭创建用户的回调函数
      close(){
        this.$refs.addRef.resetFields()
        this.getUserList();
      },
      closeRef(){
        this.$refs.closeRef.resetFields()
        this.getUserList();
      },
      closeAlert(){
        this.$refs.setRoleRef.resetFields()
        this.getUserList();
      },
      //提交设置角色
      async setRolesubmit(){
        if (!this.selectedRoleId){
          return this.$message.error("未选择任何参数")
        }
        else{
         const {data:res} = await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectedRoleId})
         if(res.meta.status == 200){
              this.$message.success(res.meta.msg)
              this.setRoleDialogVisible = false
              }
          else
              return this.$message.error(res.meta.msg)
         }
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
