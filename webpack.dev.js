const path = require('path'); // 获取绝对路径用
const webpack = require('webpack'); // webpack核心
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 动态生成html插件
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin'); // 使用day.js替代antd中的moment.js
const WebpackBar = require('webpackbar'); // 进度条
// const { getThemeVariables } = require('antd/dist/theme');  //antd 主题

const PUBLIC_PATH = '/'; // 基础路径

module.exports = {
  mode: 'development',
  entry: [
    //  新增入口文件-处理热更新，reload表示没有找到对应热更新时，是否需要刷新页面；
    'webpack-hot-middleware/client?reload=true&path=/__webpack_hmr&timeout=20000',
    './src/index.js',
  ],
  output: {
    path: __dirname + '/', // 将打包好的文件放在此路径下，dev模式中，只会在内存中存在，不会真正的打包到此路径
    publicPath: PUBLIC_PATH, // 文件解析路径，index.html中引用的路径会被设置为相对于此路径，会出现输入路由但不会定位到相应页面
    filename: 'bundle.js', // 编译后的文件名字
  },
  module: {
    rules: [
      {
        // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
        test: /\.js|jsx$/,
        enforce: 'pre',
        use: ['eslint-loader'],
        include: path.resolve(__dirname, 'src'),
        // options: {
        //   fix: true  //是否开启自动修复
        // }
      },
      {
        // .js .jsx 解析
        test: /.(js|jsx)$/,
        use: [
          {
            loader: 'thread-loader', //多进程/多实例的构建
            options: { workers: 3 },
          },
          'babel-loader',
        ],
        include: path.resolve(__dirname, 'src'),
      },
      {
        // .css 解析
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        // .less 解析
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // modifyVars: getThemeVariables({
                //   dark: true, // 开启暗黑模式
                // }),
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
      {
        //图片解析
        test: /\.(png|svg|jpg|gif)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name].[hash:4].[ext]',
              limit: 10240,
            },
          },
        ],
      },
      {
        //文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|mp3|mp4|pdf)(\?|$)/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/[name].[hash:4].[ext]',
            },
          },
        ],
      },
      {
        // wasm文件解析
        test: /\.wasm$/,
        include: path.resolve(__dirname, 'src'),
        type: 'webassembly/experimental',
      },
      {
        // xml文件解析
        test: /\.xml$/,
        include: path.resolve(__dirname, 'src'),
        use: ['xml-loader'],
      },
    ],
  },
  plugins: [
    new WebpackBar(), //进度条
    new webpack.HotModuleReplacementPlugin(), //热更新插件
    new AntdDayjsWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      // 根据模板插入css/js等生成最终HTML
      filename: 'index.html', //生成的html存放路径，相对于 output.path
      // favicon: "./public/favicon.png", // 自动把根目录下的favicon.ico图片加入html
      template: './public/index.html', //html模板路径
      inject: true, // 是否将js放在body的末尾
    }),
  ],
  optimization: {
    runtimeChunk: true,
    splitChunks: {
      chunks: 'all',
    },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less', '.css', '.wasm'], //后缀名自动补全
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  devtool: 'eval-source-map', // 报错的时候在控制台输出哪一行报错
};
