const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PUBLIC_URL': JSON.stringify('')
    }),
    new CopyPlugin({
      patterns: [
        {
          to({ context, absoluteFilename }) {
            return `./${path.relative(context, absoluteFilename)}`;
          },
          from: 'public',
          globOptions: {
            ignore: ['**/index.html']
          }
        }
      ]
    }),
    new MiniCssExtractPlugin()
  ]
});
