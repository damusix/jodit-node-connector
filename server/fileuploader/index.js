const path              = require('path');
const fs                = require('fs');
const _                 = require('lodash');

const UploadObject      = require('./object');
const helpers           = require('../helpers');


module.exports = function (request, reply) {

    const root_url  = path.resolve(helpers.root_url)+'/';
    const relPath   = request.payload.path;

    var $path        = root_url + relPath;

    const results = new UploadObject;

    const error_handler = helpers.error_handler.bind({}, results);

    // Put the files in a `{filename: file}` object for handling
    const files = helpers.get_payload_files(request.payload);

    if (Object.keys(files).length) {
        _.each(files, (file, filename) => {

            // File must have a valid name
            if (!filename) {
                error_handler(1);
            }

            // File must be whitelisted
            if (!helpers.is_whitelisted(filename, 'images')) {
                error_handler(2);
            }

            var filepath = $path+filename;

            // File must not exist
            try {
                var fsstat = fs.lstatSync(filepath);
                error_handler(3);
            } catch (e) {

                // Write to filesystem
                file.pipe(fs.createWriteStream(filepath));
                results.files.push(filename);
            }

        });

        error_handler(0);
    } else {
        error_handler(5);
    }

    reply(results);
}
