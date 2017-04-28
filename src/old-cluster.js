'use strict';

// const Ctrl = require('./ctrl');

function Ctrl (tasks, len, owner) {
	this.index = -1;

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
	const noMoreTasks = Boolean(this.index === this.len);

	if (noMoreTasks) {
		this.owner.done(this.data);
	}
};


function remoteControl (err, data) {
	if (err) {
		return this.error(err);
	}

	this.done(data);
}

function createRC (flow) {
	const RC = remoteControl.bind(flow);

	RC.flow = true;

	return RC;
}



function cluster (...tasks) {
	const len = tasks.length;
	
	return function (params, owner) {
		const ctrl = new Ctrl(tasks, len, owner);

		runTasks(params, createRC(owner));
	};
}

function runTasks (params, ctrl) {
	ctrl.index++;

	ctrl.tasks.forEach((task) => {
		task(params, ctrl);
	});
}






function asyncFn1 (path, cb) {
	setTimeout(() => {
		console.log(1);
		cb(null, 'asyncFn1')
	}, 101);
}

function asyncFn2 (content, cb) {
	setTimeout(() => {
		console.log(2);
		cb(null, 'asyncFn2')
	}, 500);
}

function asyncFn3 (content, cb) {
	setTimeout(() => {
		console.log(3);
		cb(null, 'asyncFn3')
	}, 100);
}


function wrapper1 (params, task) {
	asyncFn1(params, (err, data) => {
		if (err) task.error(err);
		task.data.a = 1;
		task.done(data)
	})
}

function wrapper2 (params, task) {
	asyncFn2(params, (err, data) => {
		if (err) task.error(err);

		task.done(data)
	})
}

function wrapper3 (params, task) {
	asyncFn3(params, (err, data) => {
		if (err) task.error(err);

		task.done(data)
	})
}



const buildCSS = cluster(wrapper1, wrapper2, wrapper3)

// buildCSS({params}, owner)
buildCSS({p1:11, p2:22, p3:33}, {
	ctx:true, 
	error: function (err) {
		console.log('err:', err);
	},
	done: function (data) {
		console.log('data:', data);
	}
})


module.exports = cluster;