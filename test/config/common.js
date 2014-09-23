'use strict';

global.sinon = require('sinon');
require('chai').use(require('sinon-chai'));
global.should = require('chai').should();

global.passErrorToCallback = function (cb, fn) {
    return function () {
        try { fn.apply(this, arguments); } catch (e) { cb(e); }
    };
};
