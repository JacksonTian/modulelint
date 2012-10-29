var walk = require("walkdo");
var fs = require("fs");

var checkBOM = function (source) {
  try {
    var buffer = fs.readFileSync(source);
    //读取buffer的前三位，读不到会跳出try，读到BOM则返回true，其他情况都会返回false
    if (buffer.readUInt8(0) == 0xef &&
      buffer.readUInt8(1) == 0xbb &&
      buffer.readUInt8(2) == 0xbf){
      return true;
    }
  } catch (e) {
  }
  return false;
};
//黑名单
var blackList = /\/doc\/|\.git\/|\.svn\//;
//文件utf-8 without BOM检测。查出非utf8 without BOM，每个文件扣5分
exports.check = function (source, callback) {
  var score = 0;
  var info = [];
  //遍历源目录，忽略黑名单，挨个检测BOM。
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
