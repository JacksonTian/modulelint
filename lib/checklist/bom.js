var walk = require("walkdo");
var fs = require("fs");

var checkBOM = function (source) {
  try {
    var buffer = fs.readFileSync(source);
    if (buffer.readUInt8(0) == 0xef &&
      buffer.readUInt8(1) == 0xbb &&
      buffer.readUInt8(2) == 0xbf){
      return true;
    }
  } catch (e) {
  }
  return false;
};
var blackList = /\/doc\/|\.git\/|\.svn\//;

exports.check = function (source, callback) {
  var score = 0;
  var info = [];
  walk(source, function(file, next, context){
    if (!blackList.test(file)) {
      if (checkBOM(file)) {
        score -= 5;
        info.push("file:" + file.replace(source, "") + " has utf-8 BOM, please remove it !");
      }
    }
    next.call(context);
  }, null, true);
  return callback(null, {
    score: score, 
    info: info
  });
};
