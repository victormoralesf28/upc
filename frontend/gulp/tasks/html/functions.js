var config  = require('./config'),
    path    = require('./path'),
    fs      = require('fs'),
    readdir = require("readdir-enhanced");

var language   = config.language;
var storage    = [];
var viewActive = "";
var obj        = [];

var fn = {
	pugAdapter(pug){
		pug.runtime.attr = function(key, val, escaped, terse){
			if (key == "__") {
				return ' ' + val;
			}
			if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
				return '';
			}
			if (val === true) {
				return ' ' + (terse ? key : key + '="' + key + '"');
			}
			if (typeof val.toJSON === 'function') {
				val = val.toJSON();
			}
			if (typeof val !== 'string') {
				val = JSON.stringify(val);
				if (!escaped && val.indexOf('"') !== -1) {
					return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
				}
			}
			if (escaped) val = pug.runtime.escape(val);
			return ' ' + key + '="' + val + '"';
		};
		return pug;
	},
  getDependencies(content){
    var dependencies   = [];
    var reCommentStart = new RegExp(language.comments.start);
    var lineStart      = /^(\s*)/;
    var lines          = content.split('\n');

    var keyword;
    var comment;
    var lengthSpaceTemp = 0;
    var activeComment = false;

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (language.comments && line.trim().length > 0){
        var hasSpace    = line.match(/ + {1}/g);
        var lengthSpace = 0;

        if (hasSpace) {
          lengthSpace = line.match(/ + {1}/g).toString().length;
        }

        if (activeComment && lengthSpaceTemp < lengthSpace) {
          continue;
        }
        comment = reCommentStart.exec(line.trim());
        if (comment) {
          lengthSpaceTemp = lengthSpace;
          activeComment   = true;
          continue;
        }

        activeComment = false;
        keyword       = language.matcher.exec(line);

        if (keyword) {
          var filepath = keyword[1].trim();
          dependencies.push(filepath);
        }
      }
    }
    return dependencies;
  },
  recursiveDependencies(file, isView){
    viewActive       = isView? file: viewActive;
    var dependencies = storage[file];

    for (var i = 0; i < dependencies.length; i++) {
      var dependency = dependencies[i].slice(1);
      if (!obj[dependency]) {
        obj[dependency] = [];
      }
      obj[dependency].push(path.pugflux + "/" + viewActive);
      if(storage[dependency].length > 0){
        fn.recursiveDependencies(dependency, false);
      }
    }
  },
  getViewToCompile(callback){
    storage = [];
    obj     = [];
    return readdir.readdirStreamStat(path.pugflux, {
        deep: 50
      })
      .on('data', function(stat) {})
      .on('file', function(stat) {
        var buffer         = fs.readFileSync(path.pugflux + "/" + stat.path);
        storage[stat.path] = fn.getDependencies(buffer.toString());
      })
      .on('directory', function(stat) {})
      .on('symlink', function(stat) {})
      .on('end', function() {
        for (view in storage) {
          if(/^modules/.test(view)){
            var dependencies = storage[view];
            if (dependencies.length > 0){
              fn.recursiveDependencies(view, true);
            }
          }
        }
        callback(obj);
      });
  }
}

module.exports = fn;
