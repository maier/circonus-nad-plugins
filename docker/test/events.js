/*eslint-env node, es6 */
/*eslint-disable global-require */

"use strict";

const Events = require("../lib/events");

let config = null;

try {
    config = require("/opt/circonus/etc/docker.json");
} catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
        console.error(err);
        process.exit(1);
    }
}

const dockerevents = new Events(config);

dockerevents.getEvents((err, metrics) => {
    if (err) {
        console.error("Events ERROR", err);
        process.exit(1);
    }
    console.dir(metrics);
});
