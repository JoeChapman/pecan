'use strict';

describe('lib/formatters', sandbox(function () {

    var formatters = require('../../lib/formatters');

    describe('.camelcase(string)', function () {

        it('camel-cases underscore-delimited strings', function () {

            formatters.camelcase('my_file_name')
                .should.equal('myFileName');

        });

        it('uppercases first character if prefixed with an underscore', function () {

            formatters.camelcase('_my_file_name')
                .should.equal('MyFileName');

        });

        it('camel-cases hyphen-delimited strings', function () {

            formatters.camelcase('my-file-name')
                .should.equal('myFileName');

        });

        it('uppercases first character if prefixed with a hyphen', function () {

            formatters.camelcase('-my-file-name')
                .should.equal('MyFileName');

        });

        it('doesn\'t interpret special characters as separators', function () {

            formatters.camelcase('!my@file&name%with/special=characters')
                .should.equal('!my@file&name%with/special=characters');

        });

        it('doesn\'t interpret numbers as separators', function () {

            formatters.camelcase('1my2file3name4with5numbers')
                .should.equal('1my2file3name4with5numbers');

        });

        it('doesn\'t format file extensions', function () {

            formatters.camelcase('my.filename')
                .should.equal('my');

        });

    });

    describe('.underscore(string)', function () {

        it('replaces hyphens with underscores', function () {

            formatters.underscore('my-file-name')
                .should.equal('my_file_name');

        });

        it('replaces whitespace with underscores', function () {

            formatters.underscore('my file name')
                .should.equal('my_file_name');

        });

        it('doesn\'t format file extensions', function () {

            formatters.underscore('my.filename')
                .should.equal('my');

        });

    });

}));
