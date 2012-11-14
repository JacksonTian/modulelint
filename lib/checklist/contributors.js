exports.rule = "项目协作加分。贡献者的数量从2个开始每多一个加10分。";

/**
 * 项目协作加分。贡献者的数量从2个开始每多一个加10分。
 * @param {String} source 需要检查的路径
 * @param {Function} callback 回调函数，如果成功，将传递分数和诊断信息
 */
exports.check = function (source, callback) {
  require('child_process').exec('git log --format=%cn', { cwd: source }, function(error, stdout, stderr) {
    if (error) {
      return callback(error);
    }

    // 去除重复和空白
    var commiters = stdout.split("\n").filter(function(item, index, arr) {
      return (item && arr.lastIndexOf(item) == index);
    });

    if (commiters.length > 2) {
      return callback(null, { score: ((commiters.length - 2) * 10) });
    } else {
      return callback(null, { score: 0 });
    }
  });
};
