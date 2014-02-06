var Walker = require("iwalk");
var fs = require("fs");
var Bagpipe = require('bagpipe');
var piper = new Bagpipe(20);

var checkBOM = function (source, callback) {
  fs.open(source, "r", function (err, fd) {
    if (err) {
      return callback(err);
    }
    var buffer = new Buffer(3);
    fs.read(fd, buffer, 0, 3, 0, function (err, bytesRead, buffer) {
      if (err) {
        return callback(err);
      }
      // 读取buffer的前三位，读不到会跳出try，读到BOM则返回true，其他情况都会返回false
      var isBOM = (buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf);
      // 记得关闭
      fs.close(fd, function (err) {
        callback(err, isBOM);
      });
    });
  });
};

//黑名单
var ignores = [
  "doc",
  ".git",
  ".svn",
  "node_modules"
];

exports.rule = "文件utf-8 without BOM检测。查出非utf8 without BOM，每个文件扣5分";
exports.check = function (source, callback) {
  var score = 0;
  var info = [];
  var counter = 0;
  //遍历源目录，忽略黑名单，挨个检测BOM。
  var walker = new Walker({
    filterDir: ignores,
    limit: 10
  });
  walker.walk(source);
  walker.on('file', function (filename) {
    counter++;
    piper.push(checkBOM, filename, function (err, isBOM) {
      if (isBOM) {
        score -= 5;
        info.push("file:" + filename.replace(source, "") + " has utf-8 BOM, please remove it !");
      }
      counter--;
      if (counter === 0) {
        callback(null, {
          score: score,
          info: info
        });
      }
    });
  });
  walker.on('end', function (totalFile) {
    if (totalFile === 0) {
      callback(null, {
        score: score,
        info: info
      });
    }
  });
};
