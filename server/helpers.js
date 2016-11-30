'use strict';

const _ = require('lodash');

// Should not allow `.file` or `file.` or `fi..le` or `fi--le` or `file___`
const INVALID_FILENAME = /^\.|\.$|\.{2,}|([^a-z0-9\.\_\-])|^\-|\-$|\-{2,}|\_{3,}/ig;

// Make sure filename meets `*.*` file naming standards
const VALID_FILENAME_FORMAT = /.\.[a-z0-9]+$/i;


// File whitelist for images, videos, documents
const FILE_WHITELIST = {
    images: [
        'png',
        'jpeg',
        'gif',
        'jpg'
    ],
    videos: [],
    documents: [],
    graphics: [],

}


const internals = {

    // Base URL for images to be sourced
    base_url: '/assets/images/',

    // Root filepath to store images
    root_url: 'public/images/',

    // Upload errors
    errors: [
        'File uploaded with success',
        'File name missing or invalid',
        'File type not allowed',
        'File by that name already exists',
        'File cannot exceed 5MB',
        'File was only partially uploaded',
        'No file was uploaded',
        'Missing a temporary folder',
        'Failed to write file to disk.',
    ],

    // Attach errors to results for editor feedback
    error_handler: function (results, errno) {
        results.error = errno;
        results.msg.push(internals.errors[errno]);
    },

    // Request returns files in `request.payload` vs `request.files`
    // This function extracts them
    get_payload_files: function (payload) {
        const files = {};

        _.each(payload, (file, key) => {
            if (/^(images|files)\[\d+\]/.test(key)) {
                var filename = internals.sanitize_filename(file.hapi.filename);
                files[filename] = file;
            }
        })

        return files;
    },

    // Removes special characters
    // Turns spaces into dashes
    sanitize_filename: (filename) => {
        INVALID_FILENAME.lastIndex = 0;
        return filename.trim().replace(/\s/g, '-').replace(INVALID_FILENAME, '');
    },

    // Checks to see if filename is invalid
    valid_filename: (filename) => {
        INVALID_FILENAME.lastIndex = 0;
        return INVALID_FILENAME.test(filename);
    },

    // Checks to see if filename has a normal format
    // EG: filename.extension
    is_file: function (filename) {
        return VALID_FILENAME_FORMAT.test(filename);
    },

    // Make sure file type is whitelisted
    // Defaults to `FILE_WHITELIST.images`
    is_whitelisted: (filename, list) => {
        return FILE_WHITELIST[list || 'images'].filter((type) => {
            return (new RegExp(`\.${type}$`, 'i')).test(filename);
        }).length > 0;
    }


};

module.exports = internals;
