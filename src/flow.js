'use strict';

function flow (tasks, len) {
	const _flow = new Flow(tasks, len);

	return function (params, callback) {
		const cbType = typeof callback;
		
		if (cbType === 'function') {
			_flow.callback = callback;
			_flow.next(null, params);
		}
		else if (cbType === 'object') {
			console.log('object!!!');
		}
		else {
			throw new Error('callback should be a function')
		}
	};
}

function Flow (tasks, len, owner) {
	this.err   = null;
	this.index = -1;

	this.tasks = tasks;
	this.len   = len;
	this.owner = owner || null;

	this.RC   = createRC(this);
	this.data = owner ? owner.data : Object.create(null);
}

const proto = Flow.prototype;

proto.checkError = function (err) {
	if (!err || this.err) return;

	this.err = err;
	
	this.callback(err);
};

proto.next = function (err, data) {
	this.checkError(err);
	
	if (this.err) return;

	this.index++;

	const {tasks, index} = this;

	const nextTask = tasks[index];

	if (nextTask && typeof nextTask === 'function') {
		nextTask(data, this.RC);
	}
	else if (this.owner) {
		this.owner.done(data);
	}
	else {
		this.callback(null, data);
	}
};

module.exports = flow;

function remoteControl (err, data) {
	this.next(err, data);
}

function createRC (flow) {
	const RC = remoteControl.bind(flow);

	RC.flow = true;

	return RC;
}