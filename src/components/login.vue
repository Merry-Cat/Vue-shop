<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form  label-width="0px" class="login_form" :model="form" :rules="rules" ref="loginFormRef">
        <!--账号  -->
        <el-form-item  prop="username">
          <el-input prefix-icon="iconfont icon-yonghu" v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码-->
        <el-form-item  prop="password">
          <el-input prefix-icon="iconfont icon-mima" v-model="form.password" type="password"></el-input>
        </el-form-item>
        <!-- 登录按钮-->
        <el-form-item style="text-align:center;">
           <el-button type="primary" :plain="true" @click="login">登录</el-button>
           <el-button type="warning"  @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      loginflag:false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在3到6个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在6到16个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录验证
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('login', { username: this.form.username, password: this.form.password })
          if(res.meta.status == 200)
          {
            this.$message({
              message:'登录成功',
              type:'success'
            })
            window.sessionStorage.setItem("token",res.data.token);
            this.$router.push({path:'/home'})
          }
          else{
            this.$message({
              message:res.meta.msg,
              type:'error'
            })
          }
        }

      })
    },
    // 重置
    resetLoginForm () {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container{
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_box{
    width:400px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -150px;
    .avatar_box{
      height: 130px;
      width: 130px;
      border-radius: 50%;
      border:1px solid #eee;
      overflow: hidden;
      padding:10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      margin-left: -75px;
      margin-top: -65px;
      background-color: #fff;
      img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form{
    position: absolute;
    bottom: 0px;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box;
  }
</style>
