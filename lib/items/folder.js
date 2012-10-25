var fs = require('fs');
var path = require('path');

var check = function (source, _path) {
  return fs.existsSync(path.join(source, _path));
};

exports.check = function (source, callback) {
  var results = ['doc', 'lib', 'test'].map(function (_path) {
    return [_path, check(source, _path)];
  });
  var passed = results.filter(function (result) {
    return result[1];
  });
  var unpassed = results.filter(function (result) {
    return !result[1];
  });
  var info = unpassed.map(function (folder) {
    return 'folder `' + folder[0] + '` is missing';
  });
  return callback(null, {score: passed.length * 10, info: info});
};
