var gulp        = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('watch', function(){
	runSequence(
		['css:watch', 'html:watch']
	);
});
