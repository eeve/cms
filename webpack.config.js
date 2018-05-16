/**
 * Created by eeve on 16/1/26.
 */
var webpack = require('webpack');
var path = require('path');
var env = process.env.NODE_ENV || 'production';
var debug = false;
var host = '127.0.0.1';
var port = '3001';
if(env==='development'){ debug = true; }

//兼容 Windows 环境
//path.resolve(__dirname, "app/folder")

var definePlugin = new webpack.DefinePlugin({
  __DEV__: debug
});
console.log(JSON.stringify(env || 'true'));
//var providePlugin = new webpack.ProvidePlugin({
//  $: "jquery",
//  jQuery: "jquery",
//  "window.jQuery": "jquery"
//});
//var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js');
//var HtmlWebpackPlugin = require('html-webpack-plugin');

var embedFileSize = 65536;
var assetsLoaders = [
  { test: /\.css$/, loader: 'style!css?sourceMap' },//https://github.com/halhenke/jade-react-loader
  { test: /\.svg$/, loader: 'url?limit=' + embedFileSize + '&mimetype=image/svg+xml' },
  { test: /\.png$/, loader: 'url?limit=' + embedFileSize + '&mimetype=image/png' },
  { test: /\.jpg$/, loader: 'url?limit=' + embedFileSize + '&mimetype=image/jpeg' },
  { test: /\.gif$/, loader: 'url?limit=' + embedFileSize + '&mimetype=image/gif' },
  { test: /\.(otf|eot|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url?limit=' + embedFileSize + '&name=[path][name].[ext]' },
  { test: /\.scss$/, loader: 'style!css?sourceMap!sass?sourceMap' },
  { test: /\.html$/, loader: 'html' }
];

var defaultPlugins = [
  definePlugin,
  //providePlugin,
  //commonsPlugin,
  new webpack.BannerPlugin('This file is created by eeve.'),
  new webpack.NoErrorsPlugin(),
  //new HtmlWebpackPlugin({
  //  template: 'src/views/index.jade',
  //  filename: '../index.html',
  //  chunks: ['vendors', 'index'],
  //  inject:'body'
  //})
]

var config = {
  entry: './app/app.js',
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath:'/',
    filename: 'js/app.js'
  },
  plugins: debug ?
    defaultPlugins : [
      // https://github.com/webpack/docs/wiki/optimization
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.DedupePlugin()
    ].concat(defaultPlugins),
  module:{
    loaders:assetsLoaders.concat([
      { test: /\.js$/, loader: 'babel' ,query: { presets: [ 'es2015' ] } },
      { test: /\.jade$/, loaders: ['jade'] }
    ])
  },
  resolve: {
    // 开启后缀自动补全功能,意味着我们require模块可以省略不写后缀名
    extensions: ['', '.js', '.json', '.jade', '.scss']
  },
  //模块别名定义，方便后续直接引用别名，无须多写长长的地址
  alias:{},
  devServer:{
    hot:true,
    proxy: {
      //"*": "http://0.0.0.0:8083"
    }
  }
};

module.exports = config;
