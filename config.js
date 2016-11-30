'use strict';

const Confidence    = require('confidence');

const criteria = {
    env: process.env.NODE_ENV
}

const store = new Confidence.Store({
    $meta: 'App config',

    // App ports
    port: {
        web: {
            $filter: 'env',
            test: process.env.TEST_PORT || 9001,
            $default: process.env.APP_PORT || 9000,
        },
    },

    // `good` plugin options for better logs
    good: {
        ops: {
            interval: 1000
        },
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ log: '*', response: '*' }]
            }, {
                module: 'good-console'
            }, 'stdout'],
            file: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{ ops: '*' }]
            }, {
                module: 'good-squeeze',
                name: 'SafeJson'
            }, {
                module: 'good-file',
                args: ['./logs/file.log']
            }],
            http: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [{ error: '*' }]
                },{
                    module: 'good-http',
                    args: ['http://localhost:8001', {
                        wreck: {
                            headers: { 'x-api-key': 12345 }
                        }
                    }]
                }
            ]
        }
    }
});

module.exports.get = (key) => {
    return store.get(key, criteria);
}

module.exports.meta = (key) => {
    return store.meta(key, criteria);
}
