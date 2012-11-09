var fs = require('fs');
var path = require('path');

exports.rule = "检查README文件的内容，去掉空格后1000字10分。上限30分。";
/**
 * 检查README文件的内容，去掉空格后1000字10分。上限30分。
 * @param {String} source 需要检查的路径
 * @param {Function} callback 回调函数，如果成功，将传递分数和诊断信息
 */
exports.check = function (source, callback) {
  var file = path.join(source, "README.md");
  if (!fs.existsSync(file)) {
    return callback(null, {score: 0, info: 'file `README.md` is missing.'});
  }

  var length = fs.readFileSync(file, 'utf-8').replace(/\t/g, '').length;

  var score = Math.floor(length / 1000) * 10;
  score = score > 30 ? 30 : score;

  if (score == 0) {
    return callback(null, {score: 0, info: 'README is less than 1000 bytes.'});
  }

  return callback(null, {score: score});
};
