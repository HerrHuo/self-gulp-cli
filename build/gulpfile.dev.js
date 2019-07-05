const gulp = require('gulp'),                         		// gulp库
	$ = require('gulp-load-plugins')({						// 依赖自动加载
		pattern: '*',										// gulp-load-plugins匹配gulp之外插件
	}),
    connect = $.connect,									// 浏览器自动刷新
	reload = connect.reload,                        		// 浏览器自动刷新
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
// gulp dev 开发环境配置
function dev() {
    // html处理
    gulp.task('html:dev', () => {
        return gulp.src(Config.html.src)
		.pipe($.fileInclude({
            prefix: '@@',
            basepath: './src/include/',
            indent: true
        }))
		.pipe($.repath(repathConfig))
		.pipe(gulp.dest(Config.html.dist))
		.pipe(reload());
    });

    // assets文件夹下的所有文件处理
    gulp.task('assets:dev', () => {
        return gulp.src(Config.assets.src)
		.pipe(gulp.dest(Config.assets.dist))
		.pipe(reload());
    });

    // less样式处理
    gulp.task('less:dev', () => {
        return gulp.src(Config.less.src)
		.pipe($.plumber())
		.pipe($.autoprefixer('last 2 version'))
		.pipe($.less())
		.pipe($.repath(repathConfig))
		.pipe(gulp.dest(Config.css.dist))
		.pipe(reload());
    });

    // js处理
    gulp.task('js:dev', () => {
        return gulp.src(Config.js.src)
		.pipe($.babel())
		.pipe(gulp.dest(Config.js.dist))
		.pipe(reload());
    });

    // images处理
    gulp.task('images:dev', () => {
        return gulp.src(Config.img.src)
		.pipe($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
		.pipe(gulp.dest(Config.img.dist))
		.pipe(reload());
    });

    gulp.task('dev', ['html:dev', 'assets:dev', 'less:dev', 'js:dev', 'images:dev'], () => {
        connect.server({
            root: ['./'],
            port: 86,
            livereload: true,
            middleware: (connect, opt) => {
                return [
                    $.httpProxyMiddleware('/hd', {
                        target: 'localhost:86',
                        changeOrigin: true
                    })
                ]
            }
        });

        // Watch .html files
        gulp.watch(Config.html.src, ['html:dev']);
		
		// Watch assets files
		gulp.watch(Config.assets.src, ['assets:dev']);

        // Watch .less files
        gulp.watch(Config.less.src, ['less:dev']);

        // Watch .js files
        gulp.watch(Config.js.src, ['js:dev']);

        // Watch image files
        gulp.watch(Config.img.src, ['images:dev']);

    });
}
module.exports = dev;