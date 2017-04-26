'use strict';

function Task (taskFn) {
	this.fn  = taskFn;
	this.ctx = taskFn.ctx || null;
}

const proto = Task.prototype;

proto.go = function (caller, ...params) {

};


proto.error = function (err) {
	this.owner.error(err);
};

proto.done = function (passData) {
	this.owner.taskDone(passData);
};

module.exports = Task;
