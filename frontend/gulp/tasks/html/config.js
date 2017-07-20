var path = require('./path');

var config = {
	pretty   : true,
	basedir  : path.pug,

  language : {
    extensions : ['.pug'],
    matcher    : /(?:include|extends):?.*\s+(.*.pug)/,
    comments   : {
      start  : '^//',
      end    : ''
    },
    indentBased: true
}
};

module.exports = config;
