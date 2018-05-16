'use strict';

var gulp = require('gulp');
var $ = {};
$.gutil = require('gulp-util');
$.jade = require('gulp-jade');
$.sass = require('gulp-sass');
$.copy = require('gulp-copy');
$.changed = require('gulp-changed');
$.plumber = require('gulp-plumber');
$.autoprefixer = require('gulp-autoprefixer');
$.csso = require('gulp-csso');
$.rename = require('gulp-rename');
$.size = require('gulp-size');
$.imagemin = require('gulp-imagemin');
$.cache = require('gulp-cache');
$.uncss = require('gulp-uncss');
$.zip = require('gulp-zip');


var del = require('del');
var runSequence = require('run-sequence');

var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

// 错误处理 防止任务中断
var errorHandle = {
  errorHandler: function (err) {
    console.log(err);
    this.emit('end');
  }
};

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

function makeConf() {
  var config = {
    src:{
      base:'app',
      js:'app/**/*.js',
      img:'app/img/**/*',
      css:'app/css/*.scss',
      jade:'app/views/**/*.jade'
    },
    output:{
      base:'dist',
      js:'dist/js',
      img:'dist/img',
      css:'dist/css',
      jade:'dist'
    }
  };

  gulp.task('copy', function(){
    return gulp.src(config.src.base+'/css/font/*')
      .pipe($.copy(config.output.css+'/font',{prefix:4}))

  });

  gulp.task("webpack", function(callback) {
    var wbConfig = Object.create(webpackConfig);
    webpack(
      wbConfig, function(err, stats) {
        if(err) throw new $.gutil.PluginError("webpack", err);
        //$.gutil.log("[webpack]", stats.toString());
        callback();
      });
  });

  // 编译Jade
  gulp.task('templates', function() {
    gulp.src(
      [config.src.jade,'!src/views/_partial/**/*'])
      .pipe($.jade())
      .pipe(gulp.dest(config.output.jade));
  });

  // 编译 Sass，添加浏览器前缀
  gulp.task('styles', function() {
    return gulp.src([config.src.css])
      .pipe($.changed('styles', {extension: '.scss'}))
      .pipe($.plumber(errorHandle))
      .pipe($.sass())
      .on('error', $.sass.logError)
      .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
      //.pipe(gulp.dest(config.output.css))
      .pipe($.csso())
      .pipe($.rename({suffix: '.min'}))
      .pipe(gulp.dest(config.output.css))
      .pipe($.size({title: 'styles'}));
  });

  // 图片优化
  gulp.task('images', function() {
    return gulp.src(config.src.img)
      .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
      })))
      .pipe(gulp.dest(config.output.img))
      .pipe($.size({title: 'i'}));
  });

  // 监视源文件变化自动cd编译
  gulp.task('watch', function() {
    gulp.watch(config.src.jade, ['templates']);
    gulp.watch(config.src.css, ['styles']);
    gulp.watch(config.src.img, ['images']);
  });

  // 洗刷刷
  gulp.task('clean', function() {
    return del([config.output.base+'/*'], {dot: true});
  });

  // 清空 gulp-cache 缓存
  gulp.task('clearCache', function(cb) {
    return $.cache.clearAll(cb);
  });

  // 默认任务
  gulp.task('default', function(cb) {
    runSequence('clean',
      ['templates','styles','images','copy','webpack'], 'watch', cb);
  });

  // 构建任务
  gulp.task('prod', function (cb) {
    runSequence('clean',
      ['templates','styles','images','copy','webpack'], cb);
  })

  gulp.task('tarball', function () {
    return gulp.src('dist/**/*')
      .pipe($.zip('archive.zip'))
      .pipe(gulp.dest('dist'));
  });
}

module.exports = makeConf();
