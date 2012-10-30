var fs = require('fs');
exports.check = function (source, callback) {
  var score = 0;
  var info = []
  try {
    var packageInfo = require(source + "/package.json");
    if (packageInfo.name && packageInfo.name.length < 10) {
      score = 5;
    } else {
      info.push("module name length should be shorter than 10");
    }
  } catch (e) {
    info.push("check module name error : "+e);
  }
  return callback(null, {
    score: score, 
    info: info
  });
};