var gulp        = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('init', function(){
	runSequence(
		['copy:images']
	);
});
