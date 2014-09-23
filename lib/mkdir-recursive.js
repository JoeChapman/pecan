'use strict';

var fs = require('node-fs'),
    pathUtil = require('path');

module.exports = function mkdirRecursive(pathName) {
    var dirName = pathName;
    if (pathUtil.extname(pathName)) {
        // remove filename
        dirName = pathUtil.dirname(pathName);
    }
    if (!fs.exists(dirName)) {
        // make directory
        fs.mkdirSync(dirName, '0777', true);
    }
    // return original path
    return pathName;
};
