// jshint node:true

'use strict';

var apache = function() {
};

var fs = require('fs'),
    util = require('util');

//
// default config
//
var config = {
    http_opt: {
        host: '127.0.0.1',
        port: 80,
        path: '/server-status?auto'
    },
    ssl: false,
    metrics: [
        'ReqPerSec',
        'BytesPerSec',
        'BytesPerReq',
        'BusyWorkers',
        'IdleWorkers'
    ]
};

var http_client;

function read_config(config) {
    var config_file = '/opt/circonus/etc/apache-conf.js';
    try {
        if (fs.statSync(config_file) !== null) {
            var cfg = require(config_file);
            ['host','port','auth'].map( function(option) {
                if (cfg.hasOwnProperty(option)) {
                    config.http_opt[option] = cfg[option];
                }
            });
        }
    } catch(e) {
        if (e.code === 'ENOENT') {
            // config not found: log, ignore, and use default
            console.log(util.inspect(e));
        } else {
            throw e;
        }
    }
}

apache.prototype.run = function run(d, cb, req, args, instance) {
    var metrics = {};
    try {
        http_client.get(config.http_opt, function(resp) {
            var body = '';
            resp.on('data', function(chunk) { body += chunk; });
            resp.on('end', function() {
                body.split(/\n/).map(function(line) {
                    var kv = line.split(/:/,2);
                    if (config.metrics.indexOf(kv[0]) !== -1) {
                        metrics[kv[0]] = Number(kv[1]);
                    }
                });
                cb(d, metrics, instance);
                d.running = false;
            });
        });
    } catch(e) {
        console.log(util.inspect(e));
        if (e.code !== 'ECONNREFUSED') {
            throw e;
        }
    }
};

read_config(config);

if (config.ssl) {
    http_client = require('https');
} else {
    http_client = require('http');
}

module.exports = apache;

// END
