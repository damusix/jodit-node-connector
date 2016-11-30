'use strict';

const path          = require('path');
const Confidence    = require('confidence');

const pack          = require('./package');
const config        = require('./config');

const criteria = {
    env: process.env.NODE_ENV
}

const store = new Confidence.Store({
    $meta: 'Server config',
    server: {
        debug: {
            request: ['error'],
        },
        connections: {
            routes: {
                state: {
                    parse: false,
                    failAction: 'ignore'
                },
                security: false
            }
        }
    },
    connections: [{
        port: config.get('/port/web'),
        labels: ['web']
    }],
    registrations: [
        {
            plugin: {
                register: 'good',
                options: config.get('/good'),
            }
        },
        {
            plugin: {
                register: 'inert',
                options: {},
            }
        },
        {
            plugin: {
                register: 'vision',
                options: {},
            }
        },
        {
            plugin: {
                register: 'visionary',
                options: {
                    engines: { html: 'handlebars' },
                    path: './server'
                }
            }
        },
        {
            plugin: {
                register: 'blipp',
                options: {},
            }
        },

        { plugin: { register: './server/web' }}
    ]

});

module.exports.get = (key) => {
    return store.get(key, criteria);
}

module.exports.meta = (key) => {
    return store.meta(key, criteria);
}
