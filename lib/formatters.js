'use strict';

module.exports = {

    camelcase: function camelcase(str) {
        // Match before extension and camelcase
        return str.match(/^[^.]+/)[0].replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2) {
            if (p2) {
                return p2.toUpperCase();
            }
            return p1.toLowerCase();
        });
    },

    underscore: function underscore(str) {
        // Match before extension and replace whitespace and hyphens with underscores
        return str.match(/^[^.]+/)[0].replace(/[^\w\d$_]/g, '_');
    }

};
