/*eslint-env node, es6 */
/*eslint-disable no-magic-numbers */

"use strict";

const Docker = require("docker-modem");

module.exports = class Stats {
    constructor(opts) {
        this.docker = new Docker(opts);
    }

    getStats(cb) {
        const self = this;
        const metrics = {};

        this._getContainers((err, containers) => { //eslint-disable-line consistent-return
            if (err) {
                return cb(err);
            }

            if (containers.length === 0) {
                return cb(new Error("No Docker containers running."));
            }

            //for (const container of containers) {
            for (let i = 0; i < containers.length; i++) {
                const container = containers[i];

                const opts = {
                    path: `/containers/${container.Id}/stats?`,
                    method: "GET",
                    options: {
                        stream: false
                    },
                    statusCodes: {
                        200: true,
                        404: "no such container",
                        500: "server error"
                    }
                };

                const netStats = [
                    "rx_bytes",
                    "rx_packets",
                    "rx_errors",
                    "rx_dropped",
                    "tx_bytes",
                    "tx_packets",
                    "tx_errors",
                    "tx_dropped"
                ];

                const metricPrefix = `${container.Names[0].substr(1)}`;

                self.docker.dial(opts, (err2, stats) => {
                    if (err2) {
                        return cb(err2);
                    }

                    // memory
                    metrics[`${metricPrefix}.memory.usage`] = stats.memory_stats.usage;
                    metrics[`${metricPrefix}.memory.max_usage`] = stats.memory_stats.max_usage;

                    // cpu
                    metrics[`${metricPrefix}.cpu.total`] = stats.cpu_stats.cpu_usage.total_usage;
                    metrics[`${metricPrefix}.cpu.kernel`] = stats.cpu_stats.cpu_usage.usage_in_kernelmode;
                    metrics[`${metricPrefix}.cpu.user`] = stats.cpu_stats.cpu_usage.usage_in_usermode;

                    // block io
                    // for (const ioStat in stats.blkio_stats) {
                    const ioStatKeys = Object.keys(stats.blkio_stats);

                    for (let j = 0; j < ioStatKeys.length; j++) {
                        const ioStat = ioStatKeys[j];

                        if (stats.blkio_stats.hasOwnProperty(ioStat)) {
                            const stat = stats.blkio_stats[ioStat];

                            // for (const item of stat) {
                            for (let k = 0; k < stat.length; k++) {
                                const item = stat[k];

                                metrics[`${metricPrefix}.${ioStat}.${item.major}-${item.minor}.${item.op.toLowerCase()}`] = item.value;
                            }
                        }
                    }

                    // network
                    // for (const iface in stats.networks) {
                    const ifaceList = Object.keys(stats.networks);

                    for (let j = 0; j < ifaceList.length; j++) {
                        const iface = ifaceList[j];

                        if (stats.networks.hasOwnProperty(iface)) {
                            const stat = stats.networks[iface];

                            // for (const item of netStats) {
                            for (let k = 0; k < netStats.length; k++) {
                                const item = netStats[k];

                                metrics[`${metricPrefix}.${iface}.${item}`] = stat[item];
                            }
                        }
                    }

                    return cb(null, metrics);

                });
            }
        });
    }

    _getContainers(cb) {
        const opts = {
            path: "/containers/json?",
            method: "GET",
            options: {
                status: "running"
            },
            statusCodes: {
                200: true,
                400: "bad parameter",
                500: "server error"
            }
        };

        this.docker.dial(opts, (err, data) => {
            if (err) {
                return cb(err);
            }
            return cb(null, data);
        });
    }
};
