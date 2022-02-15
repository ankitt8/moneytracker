const { merge } = require('webpack-merge');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: "cheap-module-source-map",
  devServer: {
    hot: true,
    port: 3000,
    liveReload: false,
    compress: false
  },
  plugins: [
    ...common.plugins,
    new ReactRefreshWebpackPlugin()
  ]
});