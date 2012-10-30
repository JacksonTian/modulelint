var path = require('path');

exports.rule = "模块名字短于10个字母，加5分";
exports.check = function (source, callback) {
  var score = 0;
  var info = [];
  try {
    var packageInfo = require(path.join(source, "package.json"));
    if (packageInfo.name && packageInfo.name.length < 10) {
      score = 5;
    } else {
      info.push("module name length should be shorter than 10");
    }
  } catch (e) {
    callback(e);
  }
  return callback(null, {
    score: score,
    info: info
  });
};