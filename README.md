> Update:
> 1.0.6 模板加入缓存中，以便livereload监听模板的修改

## 安装
### 局部安装
```bash
npm install fis3-preprocessor-browserify --save-dev
```
### 全局安装
```bash
npm install fis3-preprocessor-browserify -g
```

## 使用
```javascript
//fis-conf.js 
 
fis.match('main.js', {
    preprocessor: fis.plugin('browserify', {
        browserify: {
            debug: true
        },
        es2015: {
            enable: true,
            presets: ['es2015', 'stage-2']
        }        
    })
});
```

>   支持fis3的`__inline()`、`__uri()`等内置语法。

## Todo
[] 多文件打包


