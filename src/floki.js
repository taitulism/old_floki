'use strict';

const flow    = require('./flow');
const cluster = require('./cluster');

function Floki () {
	this.tasks = [];
	this.len   = 0;
}

const proto = Floki.prototype;

proto.run = function (task, ...tasks) {
	addToQ(this, task, ...tasks);
	
	return this;
};

proto.then = function (task, ...tasks) {
	addToQ(this, task, ...tasks);

	return this;
};

proto.flow = function () {
	return flow(this.tasks, this.len);
};





function addToQ (floki, task, ...tasks) {
	if (!tasks.length) {
		floki.tasks.push(task);
	}
	else {
		floki.tasks.push(cluster(task, ...tasks));
	}

	floki.len++;
}

function floki () {
	return new Floki();
}




const myBuilder = floki()
	.run(wrapper1)
	.then(wrapper3, wrapper2)
	.then(wrapper4, wrapper5)
	.then(wrapper3, wrapper2)
	.then(wrapper1)
;

const myFlow = myBuilder.flow();

myFlow(['a','b','c'], (err, data) => {
	console.log('finished:', err, data);
});


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
	}, 500);
}

function asyncFn4 (content, cb) {
	setTimeout(() => {
		console.log(4);
		cb(null, 'asyncFn4')
	}, 200);
}

function asyncFn5 (content, cb) {
	setTimeout(() => {
		console.log(5);
		cb(null, 'asyncFn5')
	}, 100);
}


function wrapper1 (params, callback) {
	asyncFn1(params, callback);
}

function wrapper2 (params, callback) {
	asyncFn2(params, callback);
}

function wrapper3 (params, callback) {
	asyncFn3(params, callback);
}

function wrapper4 (params, callback) {
	asyncFn4(params, callback);
}

function wrapper5 (params, callback) {
	asyncFn5(params, callback);
}



