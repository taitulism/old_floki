'use strict';

const Task = require('./task');

function createTasks (rawTasks, flow) {
	return rawTasks.map((rawTask) => new Task(rawTask, flow));
}

function Cluster (rawTasks, owner) {
	this.owner   = owner;
	this.data    = owner.data;
	this.counter = rawTasks.length;
	this.tasks   = createTasks(rawTasks, owner);
}

const proto = Cluster.prototype;

proto.error = function (err) {
	this.owner.error(err);
};

proto.done = function (passData) {
	this.counter -= 1;
	
	if (this.counter === 0) {
		this.owner.runNext(passData);
	}
};

proto.go = function (passData, final) {
	if (typeof passData === 'function') {
		final    = passData;
		passData = Object.create(null);
	}

	if (typeof final !== 'function') {
		throw new Error('floki.go() must have a final callback function.');
	}

	this.final = final;

	this.tasks.forEach((task) => {
		const {fn, ctx} = task;

		fn.call(ctx, task, passData);
	});
};

module.exports = Cluster;
