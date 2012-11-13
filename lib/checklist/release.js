var fs = require('fs');
var path = require('path');
var urllib = require('urllib');

exports.rule = "检查当前模块是否发布，已发布则加5分。";
/**
 * 检查当前模块是否发布，已发布则加5分。
 * @param {String} source 需要检查的路径
 * @param {Function} callback 回调函数，如果成功，将传递分数和诊断信息
 */
exports.check = function (source, callback) {

  // try to load package.json
  try {
    var pkgInfo = require(path.join(source, 'package.json'));
  } catch(e) {
    if (e.code == 'MODULE_NOT_FOUND') {
      return callback(null, {score: 0, info: 'File `package.json` is missing. Skipped checking.'});
    } else {
      return callback(e);
    }
  }

  // request for npm package information
  urllib.request('http://registry.npmjs.org/' + pkgInfo.name, { dataType: 'json' }, function (err, npmInfo, res) {
    if (err) {
      return callback(err);
    }

    // package not found
    if (npmInfo.error && npmInfo.error == 'not_found') {
      return callback(null, {score: 0, info: 'Module `' + pkgInfo.name + '` hasn\'t been published to npm yet.'});
    }

    // package with same name but different author
    if (npmInfo.author.name != pkgInfo.author) {
      return callback(null, {score: 0, info: 'A package named `' + pkgInfo.name + '` is published to npm but may not authored by you.'});
    }

    return callback(null, {score: 5});
  });
};