/**
 * Bring it all in and start the server
 */

'use strict';


try {
    require('dotenv').config();
} catch (e) {
    console.log("DOTENV IGNORED");
}

const glue          = require('glue');
const path          = require('path');

const pack          = require('./package');
const manifest      = require('./manifest');

const options       = { relativeTo: path.resolve() };
const composer      = glue.compose.bind(glue, manifest.get('/'), options);

composer((err, server) => {

    if (err) throw err;

    // Handle server errors
    server.ext('onPreResponse', (request, reply) => {

        if(request.response.isBoom) {
            var err        = request.response,
                error      = err.output.payload.error,
                code       = err.output.payload.statusCode,
                message    = err.output.payload.message;

            console.log(err);

            return reply({ code, error, message }).code(code);
        }

        reply.continue();
    });


    // Start the server
    server.start(() => {

        console.log(`Started ${pack.name} on ${manifest.get('/connections')[0].port}`);

    });
});
