var walk = require("walkdo");
var fs = require("fs");
var path = require("path");
var checkBOM = function (source) {
  var file = fs.openSync(source, "r");
  var buffer = new Buffer(3);
  fs.readSync(file, buffer, 0, 3);
  //读取buffer的前三位，读不到会跳出try，读到BOM则返回true，其他情况都会返回false
  if (buffer[0] == 0xef && buffer[1] == 0xbb && buffer[2] == 0xbf) {
    return true;
  }
  return false;
};
//黑名单
var sep = path.sep;//跨平台
var blackList = [
sep + "doc" + sep,
sep + ".git" + sep,
sep + ".svn" + sep,
sep + "node_modules" + sep
];
var blackListReg = new RegExp(blackList.join("|"));
//文件utf-8 without BOM检测。查出非utf8 without BOM，每个文件扣5分
exports.check = function (source, callback) {
  var score = 0;
  var info = [];
  //遍历源目录，忽略黑名单，挨个检测BOM。
  try {
    walk(source, function (file, next, context) {
      if (!blackListReg.test(file)) {
        if (checkBOM(file)) {
          score -= 5;
          info.push("file:" + file.replace(source, "") + " has utf-8 BOM, please remove it !");
        }
      }
      next.call(context);
    });
  } catch (e) {
    callback(e);
  }
  return callback(null, {
    score: score, 
    info: info
  });
};