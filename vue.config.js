module.exports={
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080
   },
   //配置开发环境和发布环境的文件打包入口
   chainWebpack: config => {
     //发布模式
     config.when(process.env.NODE_ENV === 'production', config => {
       config.entry('app').clear().add('./src/main-prod.js')
       config.set('externals', {
         vue: 'Vue',
         'vue-router': 'VueRouter',
         axios: 'axios',
         lodash: '_',
         echarts: 'echarts',
         nprogress: 'NProgress',
         'vue-quill-editor': 'VueQuillEditor'
       })
       config.plugin('html').tap(args=>{
         args[0].isProd = true
         return args
       })
     })
     //开发模式
     config.when(process.env.NODE_ENV === 'development', config => {
       config.entry('app').clear().add('./src/main-dev.js')
       config.plugin('html').tap(args=>{
         args[0].isProd = false
         return args
       })
     })
   }
}
