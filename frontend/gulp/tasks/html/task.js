var gulp        = require('gulp'),
    config      = require('./config'),
    fn          = require('./functions'),
    path        = require('./path'),

    argv        = require('yargs').argv,
    pug         = require('gulp-pug'),
    pugLint     = require('gulp-pug-lint'),
    pugNative   = require('pug'),
    gulpHtmlMin = require('gulp-htmlmin'),
    gulpIf      = require('gulp-if'),
    rename      = require('gulp-rename'),
    read        = require('read-file');


function compileHtml(){
   config.pug    = fn.pugAdapter(pugNative);
   config.locals = {fs_read : read};

   return gulp.src(path.source, {base : path.pug})
   .pipe(pugLint())
   .pipe(pug(config))
   .pipe(rename({ extname: ".html" }))
   .pipe(gulpIf(argv.production, gulpHtmlMin({collapseWhitespace: true})))
   .pipe(gulp.dest(path.dest))
   .on('end', function() {
      console.log("Compiled: ",path.source);
   });
}

gulp.task('html', ['clean:html'], function(p){
  return compileHtml();
});

gulp.task('html:watch', function () {
  gulp.watch(path.sourceWatch).on('change', function(file) {
     return compileHtml();
  });
});
