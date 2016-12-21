'use strict';
var Transform = require('stream').Transform;

// 支持fis3内置语法
module.exports = function (sourceFilePath) {
    return function(inputFileRealPath) {
        var _transform = function(chunk, encoding, cb){
            cb && cb();
        };

        var _flush = function(cb){
            var depFile = fis.file.wrap(inputFileRealPath);
            fis.compile(depFile); 
            var contents = depFile.getContent();
            this.push(contents);

            cb();
        };

        var tr = new Transform({
            transform: _transform,
            flush: _flush
        });

        return tr;
    }
};