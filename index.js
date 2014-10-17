'use strict';

var mkdirRecursive = require('./lib/mkdir-recursive'),
    formatters = require('./lib/formatters'),
    EventEmitter = require('events').EventEmitter,
    fs = require('fs'),
    jade = require('jade'),
    pathUtil = require('path'),
    Pecan;

function pathException(paths) {
    if ((!paths || !paths.jsPath) || (!paths || !paths.tmplPath)) {
        throw new Error('jsPath and tmplPath are required arguments');
    }
}

function nextFunction(options) {
    // if next not defined throw on err
    return options.next || function (err) {
        if (err) {
            throw new Error(err);
        }
    };
}

module.exports = Pecan = function Pecan(paths, options) {
    pathException(paths);
    this.paths = paths;

    options = options || {};

    this.next = nextFunction(options);
    // to allow absolute include paths defined basedir
    this.basedir = options.basedir || pathUtil.dirname(this.paths.tmplPath);
    this.namespace = options.namespace || 'templates';
    this.format = formatters[options.format] ? options.format : 'underscore';
    this.compilerFunction = options.compilerFunction || jade.compileClient;
};

// Static queue hash
Pecan.queue = {};

Pecan.prototype = {

    getStartStr: function getStartStr() {
        return '(function (window) { \n';
    },

    getNamespaceStr: function getStartStr() {
        return 'window.' + this.namespace + ' = window.' +
            this.namespace + ' || {}; \n' + 'window.' +
            this.namespace + '.';
    },

    getEndStr: function getEndStr() {
        return '}(window));';
    },

    error: function error(err) {
        this.next('ENOENT' === err.code ? null : err);
    },

    makeDestination: function makeDestination(path) {
        return mkdirRecursive(path);
    },

    compile: function compile() {

        // create a new event emitter with this template path
        Pecan.queue[this.paths.tmplPath] = new EventEmitter();

        fs.readFile(this.paths.tmplPath, 'utf8', function (err, tmplString) {
            if (err) {
                return this.error(err);
            }

            // compile string (filename passed in to enable Jade to properly extend)
            var script = this.compilerFunction(tmplString, { filename: this.paths.tmplPath, basedir: this.basedir }),
                // format name according to the format option
                name = formatters[this.format](pathUtil.basename(this.paths.tmplPath).match(/^[^.]+/)[0]),
                // put it all together
                jsString = this.getStartStr() + this.getNamespaceStr() + (name + ' = ' + script) + this.getEndStr();

            // Write the compiled function to the jsPath, creating the path if it doesn't exist
            fs.writeFile(this.makeDestination(this.paths.jsPath), jsString, function (err) {
                if (err) {
                    return this.error(err);
                }

                if (Pecan.queue[this.paths.tmplPath]) {
                    var queueItem = Pecan.queue[this.paths.tmplPath];
                    // by remving this item, consumers can inspect the remaining files to be compiled
                    delete Pecan.queue[this.paths.tmplPath];
                    // emit end to any consumer listening
                    queueItem.emit('end');
                }

                this.next();

            }.bind(this));

        }.bind(this));

    }

};

module.exports.create = function create(paths, options) {
    return new Pecan(paths, options);
};
