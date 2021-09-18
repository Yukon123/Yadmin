const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports = {
  configureWebpack: (config) => {
    return {
      externals: {
        'element-plus': 'ElementPlus',
        vue: 'Vue',
        echarts: 'echarts',
      },
      plugins: [new BundleAnalyzerPlugin()],
    }
  },
}
