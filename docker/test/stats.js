/*eslint-env node, es6 */
/*eslint-disable global-require */

"use strict";

const Stats = require("../lib/stats");

let config = null;

try {
    config = require("/opt/circonus/etc/docker.json");
} catch (err) {
    if (err.code !== "MODULE_NOT_FOUND") {
        console.error(err);
        process.exit(1);
    }
}

const stats = new Stats(config);

stats.getStats((err, metrics) => {
    if (err) {
        console.error("Stats ERROR", err);
        process.exit(1);
    }
    console.dir(metrics);
});
