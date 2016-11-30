'use-strict';

const pack = require('../package');

const browseHandler = require('./filebrowser');
const uploadHandler = require('./fileuploader');

module.exports = (server, options, next) => {

    // File browser handler
    server.route({
        method: 'POST',
        path: '/api/files',
        handler: browseHandler
    });

    // File upload handler
    server.route({
        method: 'POST',
        path: '/api/uploads',
        config: {
            payload: {
                maxBytes: 209715200,
                output: 'stream',
                parse: true
            },
            handler: uploadHandler
        }
    });


    // Front end for testing jodit
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply) => {
            reply.view('web.html').code(200);
        }
    });

    // Access files in frontend
    server.route({
        method: 'GET',
        path: '/assets/{file*}',
        handler: (request, reply) => {
            return reply.file('./public/'+request.params.file);
        }
    });




    next();
};

module.exports.attributes = {
    name: 'uploader-paths',
    version: pack.version,
}
