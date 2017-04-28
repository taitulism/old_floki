'use strict';

const Ctrl = require('./ctrl');

function remoteControl (err, data) {
	if (err) {
		return flow.error(err);
	}

	flow.done(data);
}

function createRC (flow) {
	const RC = remoteControl.bind(flow);

	RC.flow = true;

	return RC;
}

function addToQ (flow, rawTasks) {
	const tasks = rawTasks.map((rawTask) => new Task(rawTask, flow));
	
	flow.q.push(tasks);
}

function Flow (flow) {
	this.index = null;

	this.q    = [];
	this.len  = 0;
	this.flow = flow || null;

	this.data = flow.data || Object.create(null);
}

const proto = Flow.prototype;

proto.error = function (err) {
	this.err = err;
	// stop flow?
};

proto.done = function (...passArgs) {
	this.next(...passArgs);
};

proto.run = function (...tasks) {
	addToQ(this, tasks);

	return this;
};

proto.then = function (...tasks) {
	addToQ(this, tasks);

	return this;
};

proto.end = function (...tasks) {
	this.index = -1;
};

proto.go = function (...args) {
	this.RC  = createRC(this);
	const RC = args.pop();

	this.next(...args, this.RC);
};

proto.next = function (...args) {
	const nextTask = ctrl.tasks[++ctrl.index]; // ctrl.index++;

	if (nextTask && typeof nextTask === 'function') {
		this.next(...args, this.RC);
	}
	else if (this.owner) {
		this.owner.done(this.data);
	}
	else {
		this.callback(this.err, this.data);
	}
};


function flow (...tasks) {
	const len = tasks.length;
	
	return function (params, owner) {
		const ctrl = new Ctrl(tasks, len, owner);

		next(params, ctrl);
	};
}






function asyncFn1 (path, cb) {
	setTimeout(() => {
		console.log(1);
		cb(null, 'asyncFn1')
	}, 1000);
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


const flow = new Flow()
const buildCSS = series(wrapper1, wrapper2, wrapper3)

buildCSS({p1:11, p2:22, p3:33}, {
	ctx:true, 
	error: function (err) {
		console.log('err:', err);
	},
	done: function (data) {
		console.log('data:', data);
	}
})