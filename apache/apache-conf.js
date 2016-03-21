// jshint node:true

'use strict';

var config = {};

// to use:
//
// cp apache-conf.js /opt/circonus/etc
//
// --- edit and update variables ---
// vi /opt/circonus/etc/apache-conf.js
//
// --- if nad daemon runs as 'nobody', do not leave world-readable ---
// chgrp nobody /opt/circonus/etc/apache-conf.js
// chmod 640 /opt/circonus/etc/apache-conf.js

// Options, uncomment and set accordingly:

// config.host = '127.0.0.1';

// config.port = 80;

// is SSL required for this request
// config.ssl = false;

// config.auth = 'user:password';

/*
config.metrics = [
    'ReqPerSec',
    'BytesPerSec',
    'BytesPerReq',
    'BusyWorkers',
    'IdleWorkers'
];
*/

module.exports = config;

// END
