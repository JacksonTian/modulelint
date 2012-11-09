var fs = require('fs');
var path = require('path');
var EventProxy = require('eventproxy');

exports.loadChecklist = function () {
  var checklist = [];
  // the acutal commands. read them dynamicaly
  var files = fs.readdirSync(path.join(__dirname, 'checklist'));

  for(var i = 0, ii = files.length; i < ii; i++) {
    if (path.extname(files[i]) === ".js") {
      var name = path.basename(files[i], '.js');
      var checker = require(path.join(__dirname, 'checklist', files[i]));
      checker.name = name;
      checklist.push(checker);
    }
  }
  return checklist;
};

/**
 * In me the tiger sniffe the rose
 * @param {String} source 需要检查的路径
 * @param {Function} callback 回调函数，传递所有检查器的分数和诊断信息
 */
exports.sniffe = function (source, callback) {
  var checklist = exports.loadChecklist();
  var proxy = new EventProxy();
  var length = checklist.length;
  if (!fs.existsSync(source)) {
    var err = new Error('source folder is inexist.');
    callback(err);
    return;
  }

  proxy.after('checked', length, function (results) {
    callback(null, results);
  });
  proxy.on('error', function (err) {
    proxy.unbind();
    callback(err);
  });
  checklist.forEach(function (checker) {
    checker.check(source, function (err, result) {
      if (err) {
        proxy.fire('error', err);
        return;
      }
      result.name = checker.name;
      result.rule = checker.rule;
      proxy.fire('checked', result);
    });
  });
};
