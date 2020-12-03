/** postcss-loader 解析器所需的配置文件 **/
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 2 versions', '> 1%'],
    }),
  ],
};
