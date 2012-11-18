// 
var fs = require("fs");
var path = require("path");

/**
 * 规则描述
 */
exports.rule = "文档。doc目录下每个文档加5分。每个文档去空格后，不应少于500字。";

fs.existsSync = fs.existsSync || path.existsSync;
/**
 * 检查项
 * @param {String} source 检查的目录
 * @param {Function} callback 返回数据的回调函数
 */
exports.check = function (source, callback) {
  // 不对你用同步或异步方法做任何限制，但是为了兼容两种情况，结果请用callback传递返回
  var result = {score : 0, info : []},
      err,
      docpath = path.join(source,'doc'), 
      isExistDoc = fs.existsSync(docpath);
  if (isExistDoc) {
    // 遍历doc目录下文件
    var processDir = function(tmp_path) {
      var filelist = fs.readdirSync(tmp_path);
      for (var i = 0, len = filelist.length; i < len; i++) {
        var filepath = path.join(tmp_path, filelist[i]),
            stat = fs.lstatSync(filepath);    
        if (stat.isFile()) {
          // md或者.markdown后缀
          // 对于特定格式的文档，无法统计字数， 比如doc。 
          if (/(\.md|\.markdown)$/i.test(path.extname(filelist[i]))) {
            var sum, content = fs.readFileSync(filepath, 'utf-8');
            sum = content.replace(/\s+/g,'').length;
            if (sum > 500) {
              result.score += 5;
            } else {
              result.info.push('doc "' + filepath +  '" number of words: ' + sum+ ' < 500.');   
            }
          }    
        } else if (stat.isDirectory()) {
          processDir(filepath);
        } else {
          return;         
        }    
      } 
    }
    processDir(docpath);
  } else {
    result = {score : 0, info : ['doc folder not exist!']};            
  }
    
  if (err) {
    callback(err);
  } else {
    // 返回的结果包含两个属性。分数和纠错信息
    //result = {score: 10, info: somereason};
    callback(null, result);
  }
};