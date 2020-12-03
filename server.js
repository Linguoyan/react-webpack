const path = require('path');
const express = require('express'); // express服务器端框架
const webpack = require('webpack'); // webpack核心
const env = process.env.NODE_ENV; // 模式（dev开发环境，production生产环境）
const bodyParser = require('body-parser'); //node.js 请求参数解析中间件
const webpackDevMiddleware = require('webpack-dev-middleware'); // webpack服务器
const webpackHotMiddleware = require('webpack-hot-middleware'); // HMR热更新中间件
const { createProxyMiddleware } = require('http-proxy-middleware'); // 跨域配置 需要跨域请打开注释即可

const app = express(); // 实例化express服务
const webpackConfig = require('./webpack.dev.js'); // webpack开发环境的配置文件

// 跨域设置 需要跨域请打开注释,自己设置对应的域名
app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://127.0.0.0:8888', // 目标域名
    changeOrigin: true,
    ws: false,
    pathRewrite: {
      '^/api': '',
    },
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (env === 'production') {
  // 如果是生产环境，则运行dist文件夹中的代码
  app.use(express.static('dist'));
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const compiler = webpack(webpackConfig); //  实例化webpack
  // 将 webpack-dev-middleware 配置到 express 中
  app.use(
    // 挂载webpack小型服务器
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath, // 对应webpack配置中的publicPath
      quiet: true, // 是否不输出启动时的相关信息
      stats: {
        colors: true, // 不同信息不同颜色
        timings: true, // 输出各步骤消耗的时间
      },
    })
  );
  // 挂载HMR热更新中间件
  app.use(webpackHotMiddleware(compiler));
  app.get('/status', (req, res) => {
    res.send('Hello world');
  });
}

// 启动服务 -- 监听 port 端口
app.listen('8888', () => {
  console.log('本地服务启动地址: http://localhost:8888');
});
