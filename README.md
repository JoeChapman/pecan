pecan
=====

Compile your templates to a location that may or may not yet exist.

*Pecan is a depedency of [asparagus](http://joechapman.github.io/asparagus/), extending your nuts in a healthy, flexible wrapper for easy consumption.*

[![Build Status](https://travis-ci.org/JoeChapman/pecan.svg?branch=master)](https://travis-ci.org/JoeChapman/pecan)
[![NPM version](https://badge.fury.io/js/pecan.svg)](http://badge.fury.io/js/pecan) [![Greenkeeper badge](https://badges.greenkeeper.io/JoeChapman/pecan.svg)](https://greenkeeper.io/)

### Install

```
$ npm install pecan
```

#### JavaScript
```
var pecan = require('aspargus');

// A source and destination paths are required

pecan({ jsPath: '/dest/path', tmplPath: '/src/path' }, {
    format: 'camelcase',
    namespace: 'partials',
    basedir: __dirname + '/views/dev'
})
.compile();
```

**Plays nice with Gulp too** simply wrap the above in a gulp task, I.e.,

```
var gulp = require('gulp'),
    pecan = require('pecan');

gulp.task('pecan', function () {

    pecan({ jsPath: '/dest/path', tmplPath: '/src/path' }, {
        format: 'camelcase',
        namespace: 'partials',
        basedir: __dirname + '/views/dev'
    })
    .compile();
});
```

#### Browser
Templates are added to the namespace by the function name corresponding to their filename.
If you are using [Jade](http://jade-lang.com/), you'll need to include [Jade Runtime](https://raw.githubusercontent.com/visionmedia/jade/master/runtime.js) in the browser.
```
window.partials = {
    functionName: function () { ..... }
};
```

### Options
```
[format] {String}
    - The format of each compiled template function name in the namespace, defaults to 'underscore' delimited function names.

[namespace] {String}
    - The namespace object on the `window` object that will store references to the compiled template functions, defaults to 'templates'.

[basedir] {String}
    - allows for absolute include paths, defaults to the value of paths.tmplPath.

```
