**A work in progress...**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/floki.svg?branch=master)](https://travis-ci.org/taitulism/floki)

Floki
=====
Flow control for Node js.

```js
const floki = require('floki');

function myStandardAsyncFn (pathToFile, callback) {
	setTimeout(() => {
		callback(null, 'asyncFn5');
	}, 100);
}

function taskWrapper (params, callback) {
	myStandardAsyncFn(params.pathToFile, callback);
}

// build queue
const queue = floki()
	.run(taskWrapper)
	.then(taskWrapper, taskWrapper) // <-- 2 in parallel
	.then(taskWrapper)

// one queue for multiple calls (run)
const flow = queue.flow();

// run flow
flow(params, callback);
```











