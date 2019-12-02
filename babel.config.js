const prodPlugins = []
//如果是产品上线
if(process.env.NODE_ENV === 'production'){
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  'presets': [
    '@vue/cli-plugin-babel/preset'
  ],
  'plugins': [
    [
      'component',
      {
        'libraryName': 'element-ui',
        'styleLibraryName': 'theme-chalk'
      }
    ],
    //发布产品时候需要的插件数组
    ...prodPlugins,
    "@babel/plugin-syntax-dynamic-import"
  ]
}
