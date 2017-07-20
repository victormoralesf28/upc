var gulp        = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('developer', function(){
	runSequence(
		['css', 'html'],
		"watch"
	);
});
