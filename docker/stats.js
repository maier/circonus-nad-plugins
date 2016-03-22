/*eslint-env node, es6 */
/*eslint-disable global-require, callback-return, no-param-reassign */

"use strict";

const Stats = require("./lib/stats");

class DockerStats {
    constructor() {
        this.config = null;

        try {
            this.config = require("/opt/circonus/etc/docker.json");
        } catch (err) {
            if (err.code !== "MODULE_NOT_FOUND") {
                console.error(err);
                return;
            }
        }
    }

    run(d, cb, req, args, instance) {
        const containerStats = new Stats(this.config);

        containerStats.getStats((err, metrics) => {
            if (err) {
                cb(d, { "docker`api.error": `${err}` });
                d.runnint = false;
                console.error(err);
                return;
            }

            cb(d, metrics, instance);
            d.running = false;
            return;
        });
    }
}

module.exports = DockerStats;
