'use strict';

const Task = require('./task');

function addToQ (flow, taskFn) {
	if (typeof taskFn !== 'function') {
		throw new Error('addToQ called with a non-function argument');
	}

	const taskObj = new Task(taskFn, flow);

	return flow.q.push(taskObj);
}

function Flow () {
	this.q     = [];
	this.err   = null;
	this.index = 0;
	this.data  = Object.create(null);
}

module.exports = Flow;

const proto = Flow.prototype;


proto.run = function (task) {
	addToQ(this, task);

	return this;
};

proto.then = function (task) {
	addToQ(this, task);

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

	this.runNextTask(passData);
};

proto.moveIndex = function () {
	this.index += 1;

	if (this.index <= this.q.length) {
		return true;
	}

	return false;
};

proto.runNextTask = function (passData) {
	const task = this.q[this.index];

	if (!task) {
		return this.final(this.err, this.data);
	}
	
	if (this.moveIndex()) {
		const {fn, ctx} = task;
		
		fn.call(ctx, task, passData);	
	}
	else {
		this.final(this.err, this.data);
	}
};

proto.taskDone = function (passData) {
	this.runNextTask(passData);
};











proto.whois = 'Floki';




proto.end = function (cb) {
	if (typeof cb === 'function') {
		this.finalCallback = cb;
		
		return this;
	}

	throw new Error('floki must have a final callback function. called .end('+ typeof cb +')')
};


proto.runAll = function (...tasks) {
	let counter = tasks.length;

	tasks.forEach((task, i) => {
		const taskType = typeof task;
		
		if (taskType !== 'function' && taskType !== 'object') {
			throw new Error('flow callback is not a function.')
		}

		callTask(task, taskType, this)

		counter -= 1;

		if (counter === 0) {
			cb(this.err, this.data);
		}
	});	
};


function callTask (task, taskType, ctx) {
	if (taskType === 'function') {
		task.call(ctx);
	}
	else if (taskType === 'object' && task.whois === 'Floki') {
		task.go(this.data, this.taskDone)
	}
}