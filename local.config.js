/**
 * Created by huangxinxin on 16/11/14.
 */
module.exports = {
  // devServer
  // proxy: Array or Function
  // 当为函数时接受两个形参[server, proxyMiddleware],
  // 当为数组时 `path`的设置参考http://expressjs.com/en/4x/api.html#app.use, `config`的设置参考https://www.npmjs.com/package/http-proxy-middleware
  devServer: {
    host: '127.0.0.1',
    port: 3000,
    proxy: [ {
      path: [ /^\/api/, /^/ ], // 将访问如果在组件里面(具体是PageDemo/index.js)访问的路径是能够匹配上path, 127.0.0.1/3000的代码全部代理到127.0.0.1:8887
      config: {
        target: 'http://127.0.0.1:8887',
        changeOrigin: true,
        logLevel: 'debug',
        ws: true
      }
    } ]
  }
}
