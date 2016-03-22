/*eslint-env node, es6 */
/*eslint-disable no-magic-numbers */

"use strict";

const Docker = require("docker-modem");

module.exports = class DockerDaemonEvents {
    constructor(opts) {
        this.docker = new Docker(opts);
        this.lastCheck = null;
    }

    getEvents(cb) {
        const self = this;
        const tm = Math.floor(Date.now() / 1000);

        if (this.lastCheck === null) {
            this.lastCheck = tm - 60;
        }

        const opts = {
            path: "/events?",
            method: "GET",
            options: {
                since: tm - (tm - this.lastCheck),
                until: tm/*,
                filters: {
                    type: [ "container", "image" ]
                }*/
            },
            statusCodes: {
                200: true,
                500: "server error"
            }
        };

        this.docker.dial(opts, (err, data) => {
            if (err) {
                return cb(err);
            }

            self.lastCheck = tm;

            try {
                const eventList = data.split("\n").
                    filter((eventItem) => {
                        return eventItem.length > 0;
                    }).
                    map((eventItem) => {
                        return JSON.parse(eventItem);
                    });

                const currEvents = {
                    num_events: eventList.length //eslint-disable-line camelcase
                };

                for (let i = 0; i < eventList.length; i++) {
                    const eventItem = eventList[i];
                    const metricName = `${eventItem.Type}\`${eventItem.Action}`;

                    if (!currEvents.hasOwnProperty(metricName)) {
                        currEvents[metricName] = 0;
                    }
                    currEvents[metricName]++;
                }
                return cb(null, currEvents);
            } catch (err2) {
                return cb(err2);
            }
        });
    }
};
