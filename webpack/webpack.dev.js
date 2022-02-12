const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
module.exports = {
  module: "development",
  devtool: "cheap-module-source-map",
  devServer: {
    hot: true,
    open: true
  },
  plugins: [new ReactRefreshWebpackPlugin()]
}