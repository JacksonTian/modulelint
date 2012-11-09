var fs = require('fs');
var path = require('path');
var http = require('http');

exports.rule = "检查当前模块是否发布，已发布则加5分。";
/**
 * 检查当前模块是否发布，已发布则加5分。
 * @param {String} source 需要检查的路径
 * @param {Function} callback 回调函数，如果成功，将传递分数和诊断信息
 */
exports.check = function (source, callback) {
  try {
    var pkgInfo = require(path.join(source, 'package.json')); // 读取package.json

    http.get('http://registry.npmjs.org/' + pkgInfo.name, function(res) {
      var response = '';

      res.on('data', function(data) {
        response += data;
      });

      res.on('end', function() {
        var npmInfo = JSON.parse(response);

        if (npmInfo.error && npmInfo.error == 'not_found') {
          return callback(null, {score: 0, info: 'Module `' + pkgInfo.name + '` hasn\'t been published to npm yet.'});
        }

        if (npmInfo.author.name != pkgInfo.author) {
          return callback(null, {score: 0, info: 'A package named `' + pkgInfo.name + '` is published to npm but may not authored by you.'});
        }

        return callback(null, {score: 5});
      });
    }).on('error', function(e) {
      return callback(e);
    });
  } catch(e) {
    if (e.code == 'MODULE_NOT_FOUND') {
      return callback(null, {score: 0, info: 'File `package.json` is missing. Skipped checking.'});
    } else {
      return callback(e);
    }
  }
};