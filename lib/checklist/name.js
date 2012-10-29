var fs = require('fs');
var path = require('path');
exports.check = function (source, callback) {
  var score = 0;
  var info = "module name length should be shorter than 10"
  if (fs.existsSync(source+"/package.json")) {
    var packageInfo = require(source+"/package.json");
    if (packageInfo.name && packageInfo.name.length < 10) {
      score = 5;
      info = "";
    }
  }
  return callback(null, {
    score: score, 
    info: info
  });
};