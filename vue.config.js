const path = require('path')
const webpack = require('webpack')
const testIP = 'http://121.43.101.72:18080'
const mockIP = 'https://easy-mock.com/mock/5d4a906dce7a9c788b234b70/example/'
const resolve = function (dir) { return path.join(__dirname, dir) }
// const selectIP = process.env.VUE_APP_CURRENTMODE === 'mock' ? mockIP : testIP
let selectIP = 'testIP'
if (process.env.NODE_ENV === 'development') {
  selectIP = testIP
  if (process.env.VUE_APP_CURRENTMODE === 'mock') {
    selectIP = mockIP
  }
}
module.exports = {
  chainWebpack: (config) => {
    config.resolve.alias.set('@', resolve('src'))
  },
  devServer: {
    port: selectIP === testIP ? 8095 : 8096,
    proxy: {
      '/api': {
        target: selectIP,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
          '^/api/': '/'
        }
      },
    }
  },
  configureWebpack: {
    plugins: [
      // 解决moment打包的时候把所有的语言都打包进去的问题
      new webpack.ContextReplacementPlugin(/moment[\\/]locale$/, /(zh-cn)\.js/)
    ]
  },
}
