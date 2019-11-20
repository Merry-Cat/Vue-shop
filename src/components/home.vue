<template>
	  <el-container class="home-container">
      <!-- 头部区域-->
	    <el-header>
        <div class="header-left">
          <img class="imglogo" src="../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <el-button class="logout" type="info" @click="logout">退出</el-button>
      </el-header>
	    <el-container>
        <!-- 左侧-->
	      <el-aside :width="isFold?'64px':'200px'">
          <div class="toggle-button" @click="toggleMenu">|||</div>
              <el-menu
                :default-active="activepath"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409bff"
                unique-opened :collapse="isFold" router>
                <el-submenu :index="'/'+item.path" v-for="item in menulist" :key="item.id">
                  <!-- 一级导航-->
                  <template slot="title">
                    <i :class="iconsobj[item.id]" style="padding-right: 5px;"></i>
                    <span>{{item.authName}}</span>
                  </template>
                  <!-- 二级导航-->
                    <el-menu-item :index="'/'+item.path" v-for="item in item.children" :key="item.id" @click="getPath('/'+item.path)">
                      <template slot="title">
                        <i class="el-icon-menu" style="padding-right: 5px;"></i>
                        <span>{{item.authName}}</span>
                      </template>
                    </el-menu-item>
                </el-submenu>
              </el-menu>
        </el-aside>
        <!-- 主体-->
	      <el-main>
          <router-view></router-view>
        </el-main>
	    </el-container>
	  </el-container>
</template>

<script>
  export default{
    data(){
      return {
        isFold:false,
        menulist:[],
        activepath:'',
        iconsobj:{
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao',
        }
      }
    },
    created(){
      this.getMenuList();
      this.activepath = window.sessionStorage.getItem("activepath")
    },
    methods:{
      logout(){
        window.sessionStorage.clear();
        this.$router.push('/login')
      },
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
      },
      getPath(path){
        window.sessionStorage.setItem("activepath",path)
        this.activepath = path;
      },
      //获取所有的菜单
      async getMenuList(){
        const {data:res} = await this.$http.get('menus')
        if(res.meta.status !=200){
          return this.$message.error(res.meta.msg)
        }
        else{
          this.menulist = res.data
          console.log(this.menulist)
        }
      },
      //菜单栏的隐藏与显示
      toggleMenu(){
        this.isFold = !this.isFold;
      }
    }
  }
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;
  }
  .toggle-button{
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-submenu{
    text-align: left;
  }
  .el-menu{
    border-right: 0px;
  }
  .el-header, .el-footer {
      background-color: #373d41;
      color: #333;
      text-align: center;
      line-height: 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .header-left{
        display: flex;
        align-items: center;
         span{
           color:#fff;
           padding-left: 20px;
           font-size: 18px;
         }
         .imglogo{
           line-height: 60px;
           border-radius: 50%;
           width: 60px;
         }
         .logout{
         }
      }
    }

    .el-aside {
      background-color: #333744;
      color: #333;
      text-align: center;
      line-height: 200px;
    }

    .el-main {
      background-color: #eaedf1;
      color: #333;
      text-align: center;
      //line-height: 160px;
    }

    body > .el-container {
      margin-bottom: 40px;
    }
    .el-menu-item-group{
      text-align: left;
    }
</style>
