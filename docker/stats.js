"use strict";

const Stats = require("./stats");

let config = {};
try {
	config = require("/opt/circonus/etc/docker-stats.json");
} catch (err) {
	if (err.code !== "MODULE_NOT_FOUND") {
		console.error(err);
		return;
	}
}

module.exports.stats = function() {};

stats.prototype.run = function run(d, cb, req, args, instance) {
	const containerStats = new Stats(config);
	containerStats.getStats((err, metrics) => {
		cb(d, metrics, instance);
		d.running = false;
	});
};
