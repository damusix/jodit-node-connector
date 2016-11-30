'use strict';
const helpers = require('../helpers');


// Shared across different files
module.exports = function UploadObject (opts) {
    return Object.assign({
        error: 0,
        msg: [],
        files: [],
        baseurl: helpers.base_url,
    }, opts);
}
