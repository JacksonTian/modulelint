modulelint
==========

Module Lint是一款检测模块各种素质的工具。面向Node模块开发人员。

## 初步思路

- 检查模块的目录是否符合CommonJS包规范，每符合一样加10分
  - [√]lib
  - [√]doc
  - [√]test
  - package.json
- 检查README文件的内容，去掉空格后1000字10分。上限30分
- 检查License文件。具备License文件的项目加10分
- 检查测试用例数量。每个case加2分
- 检查测试覆盖率。覆盖率从50%开始，每覆盖5%加5分。高于95%加10分
- 检查Coding Style, 每个文件不超过3个问题的，加2分。没有问题的加5分
- 模块名字少于10个字母的，加5分
- API注释，每个完整的注释加5分
- 文档。doc目录下每个文档加5分。每个文档去空格后，不应少于500字。
- Change log的检查，具备Change log的加5分
- 项目协作。通过'git summary'，查看contributor的数量，从2个开始，每多一个贡献者，加10分
- 通过npm info或registry.npm.org/module接口检查当前模块是否发布，已发布则加5分
- travis-ci加10分。passing状态加5分，反之扣5分
- 文件utf-8 without BOM检测。查出非utf8 without BOM，每个文件扣5分

## 求你帮实现
上面罗列了一些初步的检测项，您也看到了，这是一件复杂的事情。每一项都要去寻找对应的工具来进行分析。所求代码贡献。

### 代码提交指南
目录结构的组织如下

```
├── README.md
├── bin
│   └── modulelint
├── index.js
├── lib
│   ├── checklist // 该目录存放所有的检查项
│   │   └── folder.js // 检查项，必须导出check方法。
│   └── modulelint.js
└── package.json
```

每个提交的检查相都应该存放在checklist目录下。每个检查相都应该导出check方法
```
/**
 * 检查项
 * @param {String} source 检查的目录
 * @param {Function} callback 返回数据的回调函数
 */
exports.check = function (source, callback) {
  // 你的实现
  // 不对你用同步或异步方法做任何限制，但是为了兼容两种情况，结果请用callback传递返回
  if (err) {
    callback(err);
  } else {
    // 返回的结果包含两个属性。分数和纠错信息
    // result = {score: 10, info: somereason};
    callback(null, result);
  }
};
```

## 目标
每个开发者在完成他的模块之后，并不知道他做得好不好。排除掉模块的功能和接口是否优秀和令人感兴趣，至少我们可以从基本功上看开发者是否努力。
高分值也可以让模块开发者得到一点点成就感。  
希望这个指标可以略微量化下开源开发者做出的努力和收获，在推动标准化和提高基本要求方面出一点力。  

## 不算指导的指导
[优秀的JavaScript模块是怎样炼成的](http://www.infoq.com/cn/articles/how-to-create-great-js-module)

## 如何调用？
安装为命令行工具

```
npm install modulelist -g
```

自检一下试试看：

```
modulelist -i ~/git/modulelist
```
结果：

```
项目路径：/Users/jacksontian/git/modulelint
{ score: 10,
  info: [ 'folder `doc` is missing', 'folder `test` is missing' ] }
```
根据指导信息添加`doc`和`test`目录后：

```
项目路径：/Users/jacksontian/git/modulelint
{ score: 30, info: [] }
```
