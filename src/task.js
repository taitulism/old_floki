'use strict';

function Task (taskFn, flow) {
	this.fn   = taskFn;
	this.ctx  = taskFn.ctx || flow;
	this.flow = flow;
	this.data = flow.data;
}

const proto = Task.prototype;

proto.error = function (err) {
	this.flow.error(err);
};

proto.done = function (passData) {
	this.flow.taskDone(passData);
};

module.exports = Task;