var gulp     = require('gulp'),
	config   = require('./config'),
	path     = require('./path'),

	svgmin   = require('gulp-svgmin'),
	clean 	 = require('gulp-rimraf');

gulp.task('clean:images', function () {
	return gulp
	.src(path.sourceImages, config.src)
	.pipe(clean(config.clean));
});

gulp.task('clean:css', function () {
	return gulp
	.src(path.sourceCss, config.src)
	.pipe(clean(config.clean));
});

gulp.task('clean:html', function () {
	return gulp
	.src(path.sourcehtml, config.src)
	.pipe(clean(config.clean));
});
