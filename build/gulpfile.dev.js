/**
 * 开发环境
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
// gulp dev
const dev = () => {

    // html文件处理
    gulp.task('html:dev', () => {
        return gulp.src(global.html.src)
        .pipe($.plumber())
        .pipe($.fileInclude({
            prefix: '@@',
            basepath: './src/modules/',
            indent: false
        }))
        .pipe($.repath({
            verMode: 'param',
            hashName: '{origin}-{hash}',
            baseMap: {'src': './src'},
            element: ['script', 'style', 'image'],
            excludeFile: [],
            replace: {'@path/': './'}
        }))
        .pipe(gulp.dest(global.html.dist))
        .pipe($.connect.reload());
    });

    // scss文件处理
    gulp.task('scss:dev', () => {
        return gulp.src(global.scss.src)
        .pipe($.plumber())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe($.autoprefixer('last 2 version'))
        .pipe($.px2remPlugin({'width_design': 500}))
        .pipe(gulp.dest(global.scss.dist))
        .pipe($.connect.reload());
    });

    // js文件处理
    gulp.task('js:dev', () => {
        return gulp.src(global.js.src)
        .pipe($.plumber())
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
        .pipe(gulp.dest(global.js.dist))
        .pipe($.connect.reload());
    });

    // img文件处理
    gulp.task('img:dev', () => {
        return gulp.src(global.img.src)
        .pipe(gulp.dest(global.img.dist))
        .pipe($.connect.reload());
    });

    // 本地服务
    gulp.task('server', () => {
        $.connect.server({
            root: global.dist,
            livereload: true,
            port: 86
        });
    });

    // 监测文件变化
    gulp.task('watch', () => {
        gulp.watch(global.html.src, gulp.series('html:dev'));
        gulp.watch(global.scss.src, gulp.series('scss:dev'));
        gulp.watch(global.js.src, gulp.series('js:dev'));
        gulp.watch(global.js.src, gulp.series('img:dev'));
    });

    // 运行
    gulp.task('dev', gulp.series(gulp.parallel('html:dev', 'scss:dev', 'js:dev', 'img:dev', 'server', 'watch')));

}

module.exports = dev;
