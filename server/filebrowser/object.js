'use strict';

const helpers = require('../helpers');

// Shared across different files
module.exports = function BrowserObject (opts) {
    return Object.assign({
        error: 0,
        msg: [],
        files: [],
        baseurl: helpers.base_url,
        path: ''
    }, opts);
}
