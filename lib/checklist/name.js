var fs = require('fs');
exports.check = function (source, callback) {
  var score = 0;
  var info = ["module name length should be shorter than 10"]
  try {
    var packageInfo = require(source+"/package.json");
    if (packageInfo.name && packageInfo.name.length < 10) {
      score = 5;
      info = [];
    }
  } catch (e) {
    
  }
  
  return callback(null, {
    score: score, 
    info: info
  });
};