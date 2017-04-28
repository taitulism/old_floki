'use strict';

const Task = require('./task');
const Ctrl = require('./ctrl');

function addToQ (flow, rawTasks) {
	const tasks = rawTasks.map((rawTask) => new Task(rawTask, flow));
	
	flow.q.push(tasks);
}

function Flow (tasks, len, owner) {
	this.q     = tasks;
	this.err   = null;
	this.index = -1;
	this.len   = len;

	this.flow = owner     || this;
	this.data = flow.data || Object.create(null);

	this.rc = new Ctrl(tasks, len, owner)
}

module.exports = Flow;

const proto = Flow.prototype;

proto.run = function (...tasks) {
	addToQ(this, tasks);

	return this;
};

proto.then = function (...tasks) {
	addToQ(this, tasks);

	return this;
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

	this.runNext(passData);
};

proto.done = function (passData) {
	this.runNext(passData);
};

proto.next = function (data) {
	const nextTask = ctrl.tasks[++ctrl.index]; // ctrl.index++;

	if (nextTask && typeof nextTask === 'function') {
		nextTask(params, this.rc);
	}
	else {
		this.owner.done(this.data);
	}
};

