'use strict';

function Cluster (tasks, len, flow) {
	this.index = -1;

	this.tasks = tasks;
	this.len   = len;
	this.flow = flow;

	this.data = flow.data || Object.create(null);
}

const proto = Cluster.prototype;

proto.error = function (err) {
	this.flow.error(err);
};

proto.done = function (params) {
	this.flow.next(this.data);
};

module.exports = Cluster;
