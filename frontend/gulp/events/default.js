var gulp        = require('gulp'),
    runSequence = require('run-sequence');

gulp.task('default', function(){
  runSequence(
   ['copy:images'],
   ['css', 'html']
  );
});
