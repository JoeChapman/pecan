'use strict';

describe('Pecan', sandbox(function () {

    var Pecan = require('../'),
        fs = require('fs'),
        jade = require('jade'),
        pathUtil = require('path'),
        EventEmitter = require('events').EventEmitter,
        compiler;

    describe('when instantiated', function () {

        describe('without both paths', function () {

            it('throws "jsPath and tmplPath are required arguments" if no arguments are supplied', function () {
                (function () {
                    compiler = Pecan.create();
                }).should.throw('jsPath and tmplPath are required arguments');
            });

            it('throws "jsPath and tmplPath are required arguments" if no paths are supplied', function () {
                (function () {
                    compiler = Pecan.create({ namespace: 'myTemplates' });
                }).should.throw('jsPath and tmplPath are required arguments');
            });

            it('throws "jsPath and tmplPath are required arguments" if jsPath is not supplied', function () {
                (function () {
                    compiler = Pecan.create({ tmplPath: '/template/path' });
                }).should.throw('jsPath and tmplPath are required arguments');
            });

            it('throws "jsPath and tmplPath are required arguments" if tmplPath is not supplied', function () {
                (function () {
                    compiler = Pecan.create({ jsPath: '/javascript/path' });
                }).should.throw('jsPath and tmplPath are required arguments');
            });

            it('throws "jsPath and tmplPath are required arguments" if either path is an empty string', function () {
                (function () {
                    compiler = Pecan.create({ jsPath: '', tmplPath: '' });
                }).should.throw('jsPath and tmplPath are required arguments');
            });

        });

        describe('with paths', function () {

            beforeEach(function () {
                compiler = Pecan.create({
                    jsPath: '/javascript/path',
                    tmplPath: '/template/path'
                });
            });

            it('returns an instance of Pecan', function () {

                compiler
                    .should.be.an.instanceof(Pecan);

            });

            it('has paths and next, namespace, compilerFunction and format default properties', function () {

                compiler.paths
                    .should.eql({
                        jsPath: '/javascript/path',
                        tmplPath: '/template/path'
                    });

                Object.keys(compiler)
                    .should.eql(['paths', 'next', 'basedir', 'namespace', 'format', 'compilerFunction']);

                compiler.namespace
                    .should.equal('templates');

                compiler.format
                    .should.equal('underscore');

                compiler.compilerFunction
                    .should.equal(jade.compileClient);

            });

            it('default next throws if called with an argument', function () {

                (function () {
                    compiler.next('error');
                }).should.throw('error');

            });

        });

        describe('with options', function () {

            var options,
                compilerFunction,
                next;

            beforeEach(function () {

                compilerFunction = sandbox.stub();
                next = sandbox.stub();

                options = {
                    namespace: 'myNamespace',
                    format: 'camelcase',
                    compilerFunction: compilerFunction,
                    next: next
                };

                compiler = Pecan.create({
                    jsPath: '/javascript/path',
                    tmplPath: '/template/path'
                }, options);
            });

            it('overrides default own properties', function () {

                compiler.namespace
                    .should.equal('myNamespace');

                compiler.format
                    .should.equal('camelcase');

                compiler.next
                    .should.equal(next);

                compiler.compilerFunction
                    .should.equal(compilerFunction);

            });

            it('uses default format \'underscore\' if the optional format is unsupported', function () {

                compiler = Pecan.create({
                    jsPath: '/javascript/path',
                    tmplPath: '/template/path'
                }, {
                    format: 'unsupported'
                });

                compiler.format
                    .should.equal('underscore');

            });

        });

    });

    describe('.compile()', function () {

        var paths = {
            jsPath: __dirname + '/dummyDestination/t1.js',
            tmplPath: __dirname + '/dummySource/t1.jade'
        };

        beforeEach(function () {
            // Stop compiler building destination folder
            sandbox.stub(Pecan.prototype, 'makeDestination').returns(paths.jsPath);
            compiler = Pecan.create(paths);
        });

        it('calls compilerFunction with tmplString and filename option', function (done) {

            sandbox.spy(compiler, 'compilerFunction');

            sandbox.stub(fs, 'readFile', function (path, string, callback) {

                callback(null, 'test');

                compiler.compilerFunction
                    .should.have.been.calledOnce;

                compiler.compilerFunction.args[0][0]
                    .should.equal('test');

                compiler.compilerFunction.args[0][1].filename
                    .should.equal(paths.tmplPath);

                compiler.compilerFunction.args[0][1].basedir
                    .should.equal(pathUtil.dirname(paths.tmplPath));

                done();
            });

            compiler.compile();

        });

        it('calls next with error if readFile returns an error', function (done) {

            sandbox.stub(compiler, 'next');

            sandbox.spy(compiler, 'compilerFunction');

            sandbox.spy(compiler, 'error');

            sandbox.stub(fs, 'readFile', function (path, string, callback) {

                callback('error');

                compiler.compilerFunction
                    .should.not.have.been.calledOnce;

                compiler.error
                    .should.have.been.calledWith('error');

                done();
            });

            compiler.compile();

        });

        it('writes the compiled jade to the jsPath with a callback function', function (done) {

            sandbox.stub(fs, 'writeFile', function (path, string, callback) {

                path.should.equal(paths.jsPath);

                string.should.not.be.undefined;

                callback.should.be.an.instanceof(Function);

                fs.writeFile
                    .should.have.been.calledWith(path, string, callback);

                done();
            });

            compiler.compile();

        });

        it('calls next with error if writeFile returns an error', function (done) {

            sandbox.spy(EventEmitter.prototype, 'emit');

            sandbox.stub(compiler, 'next');

            sandbox.spy(compiler, 'error');

            sandbox.stub(fs, 'writeFile', function (path, string, callback) {

                callback('error');

                EventEmitter.prototype.emit
                    .should.not.have.been.calledWith('end');

                compiler.error
                    .should.have.been.calledWith('error');

                done();
            });

            compiler.compile();

        });

        it('emits \'end\' on this instance of EventEmitter when the callback is invoked', function (done) {

            sandbox.spy(EventEmitter.prototype, 'emit');

            sandbox.stub(fs, 'writeFile', function (path, string, callback) {

                callback();

                EventEmitter.prototype.emit
                    .should.have.been.calledWith('end');

                done();
            });

            compiler.compile();

        });

        it('invokes next when the callback is invoked', function (done) {

            sandbox.spy(compiler, 'next');

            sandbox.stub(fs, 'writeFile', function (path, string, callback) {

                callback();

                compiler.next
                    .should.have.been.calledOnce;

                done();
            });

            compiler.compile();

        });

    });

}));
