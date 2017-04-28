'use strict';

const flow    = require('./flow');
const cluster = require('./cluster');

function Floki () {
	this.tasks = [];
	this.len   = 0;
}

function floki () {
	return new Floki();
}

module.exports = floki;


const proto = Floki.prototype;

proto.run = function (task, ...tasks) {
	addToQ(this, task, ...tasks);
	
	return this;
};

proto.then = function (task, ...tasks) {
	addToQ(this, task, ...tasks);

	return this;
};

proto.flow = function () {
	return flow(this.tasks, this.len);
};


function addToQ (floki, task, ...tasks) {
	if (!tasks.length) {
		floki.tasks.push(task);
	}
	else {
		floki.tasks.push(cluster(task, ...tasks));
	}

	floki.len++;
}
