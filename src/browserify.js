'use strict';

var deasync = require('deasync');
var browserify = require('browserify');
var debowerify = require('debowerify');
var detective = require('detective');
var path = require('path');
var fs = require('fs');

var babelify = require('babelify'); // es2015 babel 转码
var embed = require('./embed'); // fis3内置语法处理

module.exports = function (file, settings) {
    var realpath = file.realpath; // 文件的真实路径
    var dirname = file.dirname; // 文件的目录名
    var browerifyOpts = settings.browserify || {};
    var content = '';
    var isDone = false;

    var bundler = browserify(realpath, browerifyOpts);

    if(settings.es2015 && settings.es2015.enable) {
        bundler.transform(babelify.configure({presets: settings.es2015.presets}));
    }

    bundler.transform(embed(file));

    bundler.transform(debowerify);

    // when find dependecy files
    bundler.on('file', function (depFilePath) {
        var depFileDirname = fis.util.pathinfo(depFilePath).dirname;
        var depFileContent = fs.readFileSync(depFilePath);
        var tmpl = detective(depFileContent, {word: '__inline'})[0];
        // template cache
        if(!!tmpl) {
            var tmplRealPath = path.resolve(depFileDirname, tmpl);
            file.cache.addDeps(tmplRealPath);
        }
        // js cache
        if (depFilePath !== file.realpath) {
            file.cache.addDeps(depFilePath);
        }
    });

    bundler.bundle(function (err, buf) {
        if (err) {
            content = 'console.error(' + JSON.stringify(err.message) + ');' +
                        'console.error(' + JSON.stringify(err.annotated) + ');';
        } else {
            content = buf.toString();
        }
        isDone = true;
    });

    // 使用 deasync 让 browserify 同步输出到 content
    deasync.loopWhile(function (){
        return !isDone;
    });

    return content;
}