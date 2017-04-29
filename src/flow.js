'use strict';

const {createRC, checkError} = require('./private-methods');


function Flow (tasks, len, owner) {
	this.err   = null;
	this.index = -1;

	this.tasks = tasks;
	this.len   = len;
	this.owner = owner || null;

	this.RC   = createRC(this);
	this.data = owner ? owner.data : Object.create(null);
}


module.exports = function createFlow (tasks, len) {
	const flow = new Flow(tasks, len);

	return function (params, callback) {
		const cbType = typeof callback;
		
		if (cbType === 'function') {
			flow.callback = callback;
			flow.next(null, params);
		}
		else if (cbType === 'object') {
			console.log('object!!!');
		}
		else {
			throw new Error('callback should be a function');
		}
	};
};


Flow.prototype.next = function (err, data) {
	checkError(this, err);
	
	if (this.err) return;

	this.index++;

	const {tasks, index} = this;

	const nextTask = tasks[index];

	if (nextTask && typeof nextTask === 'function') {
		nextTask(data, this.RC);
	}
	else if (this.owner) {
		this.owner.next(null, data);
	}
	else {
		this.callback(null, data);
	}
};
