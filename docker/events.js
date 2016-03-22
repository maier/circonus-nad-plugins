/*eslint-env node, es6 */
/*eslint-disable global-require, callback-return, no-param-reassign */

"use strict";

const Events = require("./lib/events");

class DockerEvents {
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
        const containerEvents = new Events(this.config);

        containerEvents.getEvents((err, eventMetrics) => {
            if (err) {
                cb(d, { "docker`api.error": `${err}` });
                d.runnint = false;
                console.error(err);
                return;
            }

            cb(d, eventMetrics, instance);
            d.running = false;
            return;
        });
    }
}

module.exports = DockerEvents;
