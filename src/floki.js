'use strict';

const cluster = require('./cluster');
const flow    = require('./flow');


module.exports = function floki () {
	return new Floki();
};

function Floki () {
	this.tasks = [];
	this.len   = 0;
}


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
