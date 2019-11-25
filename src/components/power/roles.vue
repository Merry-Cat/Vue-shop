<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="roleadduser">添加角色</el-button>
      <template>
        <el-table :data="rolelist" border stripe style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bottom-line','vertical-pos',i1 === 0? 'top-line':'']">
                <!-- 一级权限-->
                <el-col :span="5">
                  <el-tag closable @close="delTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <!-- 二三级权限-->
                <el-col :span="19">
                  <el-row v-for="(item2,i2) in item1.children" :key="item2.id" :class="[i2===0?'':'top-line','vertical-pos']">
                    <el-col :span="6" >
                      <el-tag type="success" closable @close="delTag(scope.row,item2.id)">{{item2.authName}}</el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18" >
                      <el-tag closable @close="delTag(scope.row,item3.id)" v-for="(item3,i3) in item2.children" :key="item3.id" :class="i3===0?'':'top-line'">{{item3.authName}}</el-tag>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="角色名称" prop="roleName"></el-table-column>
          <el-table-column lable="角色描述" prop="roleDesc"></el-table-column>
          <el-table-column lable="操作" width="350px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit"  size="mini" @click="updaterole(scope.row)">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete"  size="mini" @click="deldialog(scope.row.id)">删除</el-button>
              <el-button type="warning" icon="el-icon-s-tools"  size="mini" @click="setRight(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
    <!-- 分配权限弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="setRightdialogVisible"
      width="50%"
      >
      <template>
        <el-tree
          ref = "treeRef"
          :data="rigitlist"
          :props="treeProps"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="defkeys"
          >
        </el-tree>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加角色弹窗-->
    <el-dialog title="添加角色" :visible.sync="addRoleFormVisible" width="500px" @close="closeDialog">
      <el-form :model="form1" :rules="rules" ref="addroleRef" >
        <el-form-item label="角色名称" prop="rolename" :label-width="formLabelWidth">
          <el-input v-model="form1.rolename" autocomplete="off"  ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="form1.roleDesc"  autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除角色弹窗-->
    <el-dialog
      title="提示"
      :visible.sync="delroledialogVisible"
      width="30%"
      >
      <span>确定删除角色吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delroledialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="delrole">删除</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹窗-->
    <el-dialog title="编辑角色" :visible.sync="editRoleFormVisible" width="500px" @close="editDialog">
      <el-form :model="editform" :rules="editRules" ref="editroleRef" >
        <el-form-item label="角色名称" prop="rolename" :label-width="formLabelWidth">
          <el-input v-model="editform.roleName" autocomplete="off"  ></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="editform.roleDesc"  autocomplete="off" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editRoleFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        rolelist:[],//角色列表数据
        setRightdialogVisible:false,
        addRoleFormVisible:false,//添加角色弹窗控制flag
        delroledialogVisible:false,//删除角色弹窗控制
        rigitlist:[],//所有权限数据
        editRoleFormVisible:false,//编辑角色的弹窗控制
        formLabelWidth:'80px',//表格抬头宽度
        treeProps:{
          label:'authName',
          children:'children'
        },
        defkeys:[],//选中的权限id
        roleId:'',//当前绩即将分配权限的ID
        editform:[],
        editId:'',//要编辑角色的id
        form1:{//添加角色的容器
          rolename:'',
          roleDesc:''
        },
        delroleid:'',
        rules:{
          rolename: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 6, message: '长度在3到6个字符', trigger: 'blur' }
          ],
        },
        editRules:{
          rolename: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 6, message: '长度在2到6个字符', trigger: 'blur' }
          ],
        }
      }
    },
    methods:{
      async initRoledata(){
        const {data: res} = await this.$http.get('roles')
        if(res.meta.status == 200){
          this.rolelist =res.data
        }
        else{
          this.$message.error(res.meta.msg)
        }
      },
      //编辑角色弹窗
      updaterole(info){
        this.editform = info;
        console.log(this.editform)
        this.editRoleFormVisible = true;
      },
      //编辑提交
      async editRolesubmit(){
        const {data:res} = await this.$http.put(`roles/${this.editform.id}`,{roleName:this.editform.roleName,roleDesc:this.editform.roleDesc});
        console.log(res)
        if(res.meta.status == 200){
          this.$message.success(res.meta.msg)
          this.editRoleFormVisible = false
        }
        else{
          this.$message.error(res.meta.msg)
        }
      },
      //关闭编辑弹窗执行的操作
      editDialog(){
        this.$refs.editroleRef.resetFields();
        this.initRoledata();
      },
      //添加角色
      roleadduser(){
        this.addRoleFormVisible = true
      },
      async addRolesubmit(){
        const {data:res} = await this.$http.post('roles',{roleName:this.form1.rolename,roleDesc:this.form1.roleDesc})
        //console.log(res)
        if(res.meta.status == 201){
          this.$message.success(res.meta.msg)
        }
        else{
          this.$message.error(res.meta.msg)
        }
         this.addRoleFormVisible = false
      },
      //添加按钮关闭后清除内容并重新刷新列表
      closeDialog(){
        this.$refs.addroleRef.resetFields()
        this.initRoledata();
      },
      delTag(role,rolesid){
        this.$confirm('确定删除权限?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rolesid}`)
          if(res.meta.status == 200){
          this.$message({
            type: 'success',
            message: '删除权限成功!'
          });
          role.children = res.data
          }
          else{
            this.$message.error(res.meta.msg)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      //初始化修改权限弹窗内的内容
      async setRight(role){
        this.roleId=role.id;
        this.defkeys = [];
        const {data:res} = await this.$http.get('rights/tree')
        if(res.meta.status == 200){
          console.log(res.data)
          this.rigitlist = res.data

        }
        else{
          this.$message.error(res.meta.msg)
        }
        this.getListKey(role,this.defkeys)
        this.setRightdialogVisible =true;
      },
      //获取已有权限的id
      getListKey(Node,arr){
        if(!Node.children){
          return arr.push(Node.id)
        }
        else{
          Node.children.forEach(item=>{
            this.getListKey(item,arr)
          })
        }
      },
      //修改权限
      async allotRights(){
        //console.log(this.roleId)
        const keys = [...this.$refs.treeRef.getCheckedKeys(),...this.$refs.treeRef.getHalfCheckedKeys()]
        const idStr = keys.join(',')
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status == 200){
          this.$message.success(res.meta.msg)
        }
        else{
          this.$message.error(res.meta.msg)
        }
        this.initRoledata()
        this.setRightdialogVisible = false
      },
      //删除角色
      deldialog(id){
        this.delroledialogVisible = true;
        this.delroleid = id
      },
      async delrole(){
        const {data:res} = await this.$http.delete(`roles/${this.delroleid}`)
        if(res.meta.status == 200){
          this.$message.success(res.meta.msg)
          this.initRoledata()
        }
        else{
          this.$message.error(res.meta.msg)
        }
        this.delroledialogVisible = false

      }
    },
    created(){
      this.initRoledata()
    }
  }
</script>

<style lang="less" scoped>
  .el-tag{
    margin:7px;
  }
  .vertical-pos{
    display: flex;
    align-items: center;
  }
  .top-line{
    border-top: 1px solid #eee;
  }
  .bottom-line{
    border-bottom: 1px solid #eee;
  }
</style>
