const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist')
    },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
        inlineSource: '.(js|css)$' , 
      template: 'src/index.html'
    }),
    new HtmlWebpackInlineSourcePlugin(),
  ] .concat(
    process.env.SHOW_BUNDLE ? [new BundleAnalyzerPlugin()]:[]),

   devServer: {
    compress: true,
    disableHostCheck: true,   
   }   
};  