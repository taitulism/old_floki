'use strict';

function Ctrl (tasks, len, owner) {
	this.index = 0;

	this.tasks = tasks;
	this.len   = len;
	this.owner = owner;

	this.data = Object.create(null);
}

const proto = Ctrl.prototype;

proto.error = function () {
	this.owner.error(this.err);
};

proto.done = function () {
	const allDone = Boolean(++this.index === this.len);

	if (allDone) {
		this.owner.done(this.data);
	}

	runNextTask (params, this);
};


function series (...tasks) {
	const len = tasks.length;
	
	return function (params, owner) {
		const ctrl = new Ctrl(tasks, len, owner);

		runNextTask(params, ctrl);
	};
}

function runNextTask (params, ctrl) {
	const task = ctrl.tasks[ctrl.index++];

	task(params, ctrl);
}






const buildCSS = series(fn1, fn2, fn3)

buildCSS(params, callback, ctx)