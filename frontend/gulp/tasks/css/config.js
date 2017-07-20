var path = require('./path');

var config = {
   pretty   : true,
   basedir  : path.base,

   language : {
      extensions : ['.scss', '.sass'],
      matcher    : /^(?:@import).*/,
      comments   : {
         start  : '//',
         end    : ''
      },
      indentBased: true
   }
};

module.exports = config;
