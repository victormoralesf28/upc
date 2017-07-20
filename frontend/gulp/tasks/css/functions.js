var config  = require('./config'),
    path    = require('./path'),
    fs      = require('fs'),
    readdir = require("readdir-enhanced");

var language   = config.language;
var storage    = [];
var viewActive = "";
var obj        = [];

var fn = {
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

        comment = reCommentStart.exec(line);
        if (comment) {
          lengthSpaceTemp = lengthSpace;
          activeComment   = true;
          continue;
        }

        activeComment = false;
        keyword       = language.matcher.exec(line);

        if (keyword) {
           var filepath = (/(\'|\").*.(\'|\")/.exec(line)[0]).replace(/(\'|\")/g, "").replace(/\.(sass|scss)/, "");

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
      var dependency = dependencies[i];
      if (!obj[dependency]) {
        obj[dependency] = [];
      }
      obj[dependency].push(path.base + "/" + viewActive);
      if(storage[dependency].length > 0){
        fn.recursiveDependencies(dependency, false);
      }
    }
  },
  getViewToCompile(callback){
    storage = [];
    obj     = [];
    return readdir.readdirStreamStat(path.base, {
        deep: 50
      })
      .on('data', function(stat) {})
      .on('file', function(stat) {
        var buffer         = fs.readFileSync(path.base + "/" + stat.path);
        var pathClean = stat.path.replace(/\.(sass|scss)/, "");
        storage[pathClean] = fn.getDependencies(buffer.toString());
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
