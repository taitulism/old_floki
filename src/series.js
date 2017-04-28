'use strict';

const Ctrl = require('./ctrl');


function series (...tasks) {
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