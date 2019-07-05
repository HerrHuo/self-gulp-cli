const gulp = require('gulp'),                         		// gulp库
	$ = require('gulp-load-plugins')({						// 依赖自动加载
		pattern: '*',										// gulp-load-plugins匹配gulp之外插件
	}),
    Config = require('./gulpfile.config.js'),       		// config
	repathConfig = {										// repathConfig
		verMode: 'param',  // origin, hash, param
		hashName: '{origin}-{hash}',
		baseMap: {'src': './src'},
		element: ['script', 'style', 'image'],
		excludeFile: [],
		replace: {
			'@path/': '//localhost:86/dist/'
		}
	};
// gulp build 打包资源配置
function prod() {
	// del处理
	gulp.task('clean:prod', () => {
		return $.del(['dist']);
	});
	
    // html处理
    gulp.task('html:prod', ['clean:prod'], () => {
        return gulp.src(Config.html.src)
		.pipe($.fileInclude({
            prefix: '@@',
            basepath: './src/include/',
            indent: true
        }))
		.pipe($.repath(repathConfig))
		.pipe($.minifyHtml())
		.pipe(gulp.dest(Config.html.dist));
    });

    // assets文件夹下的所有文件处理
    gulp.task('assets:prod', ['clean:prod'], () => {
        return gulp.src(Config.assets.src)
		.pipe(gulp.dest(Config.assets.dist));
    });

    // less样式处理
    gulp.task('less:prod', ['clean:prod'], () => {
        return gulp.src(Config.less.src)
		.pipe($.autoprefixer('last 2 version'))
		.pipe($.less())
		.pipe($.cleanCss())
		.pipe($.repath(repathConfig))
		.pipe(gulp.dest(Config.css.dist));
    });

    // js处理
    gulp.task('js:prod', ['clean:prod'], () => {
        return gulp.src(Config.js.src)
		.pipe($.babel())
		.pipe($.uglify())
		.pipe(gulp.dest(Config.js.dist));
    });

    // 合并所有js文件并做压缩处理
    /*
	gulp.task('js-concat:prod', ['clean:prod'], () => {
        return gulp.src(Config.js.src)
		.pipe($.babel())
		.pipe($.concat(Config.js.build_name))
		.pipe($.uglify())
		.pipe(gulp.dest(Config.js.dist));
    });
	*/

    // images处理
    gulp.task('images:prod', ['clean:prod'], () => {
        return gulp.src(Config.img.src)
		.pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
		.pipe(gulp.dest(Config.img.dist));
    });

    gulp.task('build', ['clean:prod', 'html:prod', 'assets:prod', 'less:prod', 'js:prod', /*'js-concat:prod',*/ 'images:prod']);
}
module.exports = prod;