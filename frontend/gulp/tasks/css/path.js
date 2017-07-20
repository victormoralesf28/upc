var path = {
	base        : './sass',
	source      : './sass/modules/**/*.sass',
	dest        : './../public/css/',

   sourceEmail : './sass/modules/mailing/**/*.sass',
	destEmail   : './../public/css/mailing/',

	sourceWatch : './sass/**/*.{sass,scss}',
};

module.exports = path;
