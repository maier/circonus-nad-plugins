"use strict";

const Events = require("./events/index.js");

let config = {
	docker: null,
	circonus: {
		checkURL: "https://trap.noit.circonus.net/module/httptrap/5f92b33c-5d53-4695-ab4b-555f0da1e833/c900cb759ab3caa4"
	}
};
try {
	config = require("/opt/circonus/etc/docker-events.json");
} catch (err) {
	if (err.code !== "MODULE_NOT_FOUND") {
		console.error(err);
		return;
	}
}


function fetch(opts) {
    const events = new Events(opts.docker);
    events.getEvents((err, data) => {
        if (err) {
            console.error(err);
			return;
        }

        const list = data.split('\n').
			filter((item) => {
				return item.length > 0;
			}).
			map((item) => {
				return JSON.parse(item);
			});

		let numEvents = 0;
        const metrics = [];

        for (const item of list) {
            metrics.push({[`docker.${item.Type}.${item.Action}`]:`${item.Actor.Attributes.name}${item.Actor.Attributes.image ? ", image "+item.Actor.Attributes.image : ""}`});
			numEvents++;
        }

		metrics.push({"docker.num_events": list.length});
        send(opts, metrics);
    });
}

function send(opts, metrics) {
    console.dir(metrics);
	console.log(opts.circonus.checkURL);
    // post to circonus httptrap check
}

fetch(config);
