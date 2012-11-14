var path = require('path');
var urllib = require('urllib');

exports.rule = "检查 Travis CI，已关联加10分。passing状态加5分，反之扣5分。";
/**
 * 检查 Travis CI，已关联加10分。passing状态加5分，反之扣5分。
 * @param {String} source 需要检查的路径
 * @param {Function} callback 回调函数，如果成功，将传递分数和诊断信息
 */
exports.check = function (source, callback) {
  var pkgInfo;
  // try to load package.json
  try {
    pkgInfo = require(path.join(source, 'package.json'));
  } catch(e) {
    if (e.code == 'MODULE_NOT_FOUND') {
      return callback(null, {score: 0, info: 'File `package.json` is missing. Skipped checking.'});
    } else {
      return callback(e);
    }
  }

  if (pkgInfo.repository && pkgInfo.repository.type == 'git' && pkgInfo.repository.url) {
    var github;
    var isGithubRepo = [
      /^https\:\/\/github\.com\/(.*?)\/(.*?)\.git$/,
      /^git\@github\.com\:(.*?)\/(.*?)\.git$/,
      /^git\:\/\/github\.com\/(.*?)\/(.*?)\.git$/
    ].some(function(exp) {
      return github = pkgInfo.repository.url.match(exp);
    });

    if (isGithubRepo) {
      urllib.request('https://api.travis-ci.org/repos/' + github[1] + '/' + github[2], { dataType: 'json' }, function (err, repoInfo, res) {
        if (err) {
          return callback(err);
        }
        // not found
        if (repoInfo.file && repoInfo.file == 'not found') {
          return callback(null, {score: 0, info: 'The repository did not associate with Travis CI. Skipped.'});
        }

        if (repoInfo.last_build_status == 0) {
          return callback(null, {score: 15});
        } else {
          return callback(null, {score: 5, info: 'Associated with Travis CI but not in passing status.'});
        }
      });
    } else {
      return callback(null, {score: 0, info: 'Git is not a Github Repository. Skipped checking.'});
    }
  } else {
    return callback(null, {score: 0, info: 'Github url is not specified. Skipped checking.'});
  }

  /**/
};