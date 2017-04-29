'use strict';

const {
	createRC,
	checkError,
	runAllTasks,
	isArrayOfFns,
} = require('./private-methods');


module.exports = function createCluster (...tasks) {
	const len = tasks.length;

	isArrayOfFns(tasks);

	const cluster = new Cluster(tasks, len);
	
	return function (params, callback) {
		cluster.callback = callback;
		runAllTasks(cluster, params);
	};
};


function Cluster (tasks, len) {
	this.err   = null;
	this.tasks = tasks;
	this.len   = len;
	this.RC    = createRC(this);
}


Cluster.prototype.next = function (err, data) {
	checkError(this, err);
	
	if (this.err) return;

	this.len--;

	const isDone = (this.len === 0);

	if (isDone) {
		this.callback(err, data);
	}
};
