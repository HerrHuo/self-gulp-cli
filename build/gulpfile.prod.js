/**
 * 生产环境
 * gulp@4.0.2
 * gulp.series|4.0 依赖顺序执行
 * gulp.parallel|4.0 多个并行执行
 */
const gulp = require('gulp');
// 依赖自动加载gulp-load-plugins匹配gulp之外插件
const $ = require('gulp-load-plugins')({ pattern: ['gulp-*', 'gulp.*', '@*/gulp{-,.}*']});
// global
const global = require('./gulpfile.global.js');
// sass
const sass = require('gulp-sass')(require('sass'));
// babel
const babel = require('@rollup/plugin-babel');
// resolve
const resolve = require("@rollup/plugin-node-resolve");
// commonjs
const commonjs = require("@rollup/plugin-commonjs");
// d
const d = new Date();
// year
const year = String(d.getFullYear());
// month
const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : String(d.getMonth() + 1);
// date
const date = d.getDate() < 10 ? `0${d.getDate()}` : String(d.getDate());
// hours
const hours = d.getHours() < 10 ? `0${d.getHours()}` : String(d.getHours());
// minutes
const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : String(d.getMinutes());
// seconds
const seconds = d.getSeconds() < 10 ? `0${d.getSeconds()}` : String(d.getSeconds());
// banner
const banner = `/**\n ` +
  ` * @version v1.0.0\n ` +
  ` * @author hexun\n ` +
  ` * @date ${year}-${month}-${date} ${hours}:${minutes}:${seconds}\n ` +
  `*/\n `;
// gulp prod
const prod = () => {

    // html文件处理
    gulp.task('html:prod', () => {
        return gulp.src(global.html.src)
        .pipe($.fileInclude({
            prefix: '@@',
            basepath: './src/modules/',
            indent: true
        }))
        .pipe($.repath({
            verMode: 'param',
            hashName: '{origin}-{hash}',
            baseMap: {'src': './src'},
            element: ['script', 'style', 'image'],
            excludeFile: [],
            replace: {'@path/': 'https://www.xxxxx.com/'}
        }))
        .pipe($.minifyHtml())
        .pipe(gulp.dest(global.html.dist));
    });

    // scss文件处理
    gulp.task('scss:prod', () => {
        return gulp.src(global.scss.src)
        .pipe($.plumber())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe($.autoprefixer('last 2 version'))
        .pipe($.px2remPlugin({'width_design': 500}))
        .pipe($.cleanCss())
        .pipe($.header(banner))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(global.scss.dist));
    });

    // js文件处理
    gulp.task('js:prod', () => {
        return gulp.src(global.js.src)
        .pipe($.betterRollup(
            {
                plugins:[
                    resolve(),
                    commonjs({include: 'node_modules/**'}),
                    babel({babelHelpers: 'runtime', exclude: 'node_modules/**'})
                ]
            },
            {
                format: 'umd'
            }
        ))
        .pipe($.uglify())
        .pipe($.header(banner))
        .pipe($.rename({suffix: '.min'}))
        .pipe(gulp.dest(global.js.dist));
    });

    // img文件处理
    gulp.task('img:prod', () => {
        return gulp.src(global.img.src)
        .pipe(gulp.dest(global.img.dist))
    });

    // 清理dist
    gulp.task('clean', () => {
        return gulp.src('./dist', { allowEmpty: true, read: false })
        .pipe($.clean());
    });

    // 打包
    gulp.task('build', gulp.series('clean', gulp.parallel('html:prod', 'scss:prod', 'js:prod', 'img:prod')));

}

module.exports = prod;
