var gulp   = require('gulp'),
	path    = require('./path'),

   argv    = require('yargs').argv,
   gulpIf  = require('gulp-if'),
	uglify  = require('gulp-uglify');

gulp.task('copy:images', ['clean:images'], function(){
	return gulp
	.src(path.sourceImages)
	.pipe(gulp.dest(path.destImages));
});
