import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home.vue'
import Welcome from './components/welcom.vue'
import Users from './components/user/users.vue'
import Rights from './components/power/rights.vue'
import Roles from './components/power/roles.vue'
import Cate from './components/goods/cate.vue'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router =  new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home',component: Home,redirect:'/welcome',children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:Users},
      {path:'/rights',component:Rights},
      {path:'/roles',component:Roles},
      {path:'/categories',component:Cate}
    ] }
  ]
})
//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  //to表示想要访问的路径
  //from 表示从哪个路径来
  //next表示放行.
  if(to.path == "/login"){
    return next()
  }
  const tokenStr = window.sessionStorage.getItem("token")
  if(!tokenStr){
    return next("/login")
  }
  if(tokenStr&&to.path == "/welcome"){
    window.sessionStorage.setItem("activepath",to.path)
    return next()
  }
  next()
})
export default router
