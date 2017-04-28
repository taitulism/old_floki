'use strict';


function cluster (...tasks) {
	const len = tasks.length;

	tasks.forEach((task) => {
		if (typeof task !== 'function')  {
			throw new Error('task should be a function');
		}
	});

	const _cluster = new Cluster(tasks, len);
	
	return function (params, callback) {
		_cluster.callback = callback;
		_cluster.runAllTasks(params);
	};
}

module.exports = cluster;

function Cluster (tasks, len) {
	this.err   = null;
	this.tasks = tasks;
	this.len   = len;
	this.RC    = createRC(this);
}

const proto = Cluster.prototype;

proto.checkError = function (err) {
	if (!err || this.err) return;

	this.err = err;
	
	this.callback(err);
};

proto.taskDone = function (err, data) {
	this.checkError(err);
	
	if (this.err) return;

	this.len--;

	const isDone = (this.len === 0);

	if (isDone) {
		this.callback(err, data);
	}
};



proto.runAllTasks = function (params) {
	this.tasks.forEach((task) => {
		task(params, this.RC);
	});
}

function remoteControl (err, data) {
	this.taskDone(err, data);
}

function createRC (flow) {
	const RC = remoteControl.bind(flow);

	RC.flow = true;

	return RC;
}