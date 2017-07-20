var gulp        = require('gulp'),
	path         = require('./path'),
	fn           = require('./functions'),

   argv         = require('yargs').argv,
	autoprefixer = require('gulp-autoprefixer'),
   gulpIf       = require('gulp-if'),
   cleanCSS     = require('gulp-clean-css'),
	sass         = require('gulp-sass'),
	sassGlob     = require('gulp-sass-glob'),
	preprocess   = require('gulp-preprocess');

function compileCss(){
   return gulp
	.src(path.source, {base : path.base})
	.pipe(sassGlob())
	.pipe(sass({
		includePaths: [path.base]
	})
	.on('error', sass.logError))
	.pipe(preprocess({
		context: {color: 'green'}
	}))
   .pipe(autoprefixer())
   .pipe(gulpIf(argv.production, cleanCSS()))
	.pipe(gulp.dest(path.dest))
   .on('end', function() {
      console.log("Compiled: ",path.source);
   });
}

gulp.task('css', ['clean:css'], function () {
	return compileCss();
});

gulp.task('css:watch', function () {
  gulp.watch(path.sourceWatch).on('change', function(file) {
    return compileCss();
  });
});
