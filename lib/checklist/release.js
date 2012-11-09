var fs = require('fs');
var path = require('path');

exports.rule = "检查当前模块是否发布，已发布则加5分。";
/**
 * 检查当前模块是否发布，已发布则加5分。
 * @param {String} source 需要检查的路径
 * @param {Function} callback 回调函数，如果成功，将传递分数和诊断信息
 */
exports.check = function (source, callback) {
  // 读取package.json
  try {
    var pkgInfo = require(path.join(source, 'package.json'));

    require('child_process').exec('npm view ' + pkgInfo.name, function(error, stdout, stderr) {
      if (error) {
        return callback(null, {score: 0, info: 'Couldn\'t fetch information from npm, skipped.'});
      }

      var npmInfo = eval('(function(){return ' + stdout.replace(/\n/, '') + ' })()');

      if (npmInfo.author != pkgInfo.author) {
        return callback(null, {score: 0, info: 'A package named `' + pkgInfo.name + '` is released in npm but may not authored by you.'});
      }

      return callback(null, {score: 5});
    });
  } catch(e) {
    if (e.code == 'MODULE_NOT_FOUND') {
      return callback(null, {score: 0, info: 'File `package.json` is missing. Skipped checking.'});
    } else {
      return callback(e);
    }
  }
};
