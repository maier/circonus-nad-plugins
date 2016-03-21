"use strict";

const Docker = require("docker-modem");

module.exports = class DockerEvents {
    constructor(opts) {
        this.docker = new Docker(opts);
    }

    getEvents(cb) {
        const tm = Math.floor(Date.now() / 1000);

        const opts = {
            path: `/events?`,
            method: "GET",
            options: {
                since: tm - 3600 * 6, //1458573065,
                until: tm,
                filters: {
                    type: ["container", "image"]
                }
            },
            statusCodes: {
                200: true,
                500: "server error"
            }
        };

        this.docker.dial(opts, (err, events) => {
            if (err) {
                return cb(err);
            }

            return cb(null, events);
        });
    }
};
