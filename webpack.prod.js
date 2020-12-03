const path = require('path');
const webpack = require('webpack'); //webpack 核心
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 生成html
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); //webpack 打包大小体积分析
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 每次打包前清除旧的build文件夹
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 为了单独打包css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩CSS
const TerserPlugin = require('terser-webpack-plugin'); //多线程/多实例-并行压缩js
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); //仅报错时日志提示
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin'); //为模块提供中间缓存，第二次构建速度提升
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin'); // 使用day.js替代antd中的moment.js
const WebpackBar = require('webpackbar'); //进度条

module.exports = {
  mode: 'production',
  entry: {
    app: './src/index.js',
    vendor: ['react', 'react-dom'],
  },
  output: {
    filename: '[name].[chunkhash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        // .js .jsx用babel解析
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'), //只解析src下的模块
        use: [
          {
            loader: 'thread-loader', //多进程/多实例的构建
            options: { workers: 3 },
          },
          'babel-loader?cacheDirectory=true', //babel-loader 开启缓存，结合 TerserPlugin、HardSourceWebpackPlugin 提升二次构建速度
        ],
      },
      {
        // .css 解析
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        // .less 解析
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: { lessOptions: { javascriptEnabled: true } },
          },
        ],
      },
      {
        // 文件解析
        test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
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
        // 图片解析
        test: /\.(png|jpg|jpeg|gif)$/i,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'url-loader',
            options: {
              //限制图片大小 8192B，小于限制会将图片转换为 base64格式
              limit: 8192,
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
    /* 体积分析 */
    // new BundleAnalyzerPlugin(),

    /* 自动生成HTML，并注入各参数 */
    new HtmlWebpackPlugin({
      filename: 'index.html', // 生成的html存放路径，相对于 output.path
      template: './public/index.html', // html模板路径
      inject: true, // 是否将js放在body的末尾
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),

    /* 提取CSS等样式生成单独的CSS文件 */
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css', // 生成的文件名
    }),
    new AntdDayjsWebpackPlugin(), // dayjs 替代 momentjs

    /* 打包进度条展示 */
    new WebpackBar(),

    /* 缓存机制，第二次构建速度提升 */
    new HardSourceWebpackPlugin(),

    /* 构建日志提示优化 */
    new FriendlyErrorsWebpackPlugin(),

    /* 打包前删除上一次打包留下的旧代码（根据output.path） */
    new CleanWebpackPlugin(),
  ],
  // 优化打包配置
  optimization: {
    //设置为 true, 一个chunk打包后就是一个文件，一个chunk对应`一些js css 图片`等，利用浏览器缓存，减少文件更新频率
    runtimeChunk: {
      name: 'runtime',
    },
    minimizer: [
      new TerserPlugin({
        //并行压缩js
        parallel: true, // 多线程并行构建
        terserOptions: {
          compress: {
            warnings: false, // 删除无用代码时是否给出警告
            drop_debugger: true, // 删除所有的debugger
            pure_funcs: ['console.log'], // 删除所有的console.log
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({}),
    ],
    splitChunks: {
      chunks: 'all', // 默认entry的chunk不会被拆分 配置成all 便全部拆分了
    },
  },
  stats: {
    warningsFilter: (warning) => /Conflicting order/gm.test(warning), // 不输出一些警告，多为因CSS引入顺序不同导致的警告
    children: false, // 不输出子模块的打包信息
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.less', '.css', '.wasm'], //后缀名自动补全
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  performance: {
    hints: false, // 性能设置,文件打包过大时，不报错和警告，只做提示
    maxEntrypointSize: 400000,
  },
};
