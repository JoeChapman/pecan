'use strict';

describe('lib/mkdir-recursive', sandbox(function () {

    var fsNode = require('node-fs'),
        mkdirRecursive = require('../../lib/mkdir-recursive');

    beforeEach(function () {
        sandbox.stub(fsNode, 'mkdirSync');
    });

    it('calls fs.mkdirSync once with the path argument', function () {

        mkdirRecursive('non/existent/path/');

        fsNode.mkdirSync
            .should.have.been.calledOnce;

        fsNode.mkdirSync
            .should.have.been.calledWith('non/existent/path/', '0777', true);

    });

    it('removes filenames from the path argument', function () {

        mkdirRecursive('non/existent/path/file.ext');

        fsNode.mkdirSync
            .should.have.been.calledOnce;

        fsNode.mkdirSync
            .should.have.been.calledWith('non/existent/path', '0777', true);

    });

    it('returns the path argument', function () {

        mkdirRecursive('non/existent/path/file.ext')
            .should.equal('non/existent/path/file.ext');

    });

}));
