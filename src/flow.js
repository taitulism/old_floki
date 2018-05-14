
const {createDone, checkError} = require('./private-methods');


function Flow (tasks, len, owner) {
	this.err   = null;
	this.index = -1;

	this.tasks = tasks;
	this.len   = len;
	this.owner = owner || null;

	this.done = createDone(this);
	this.data = owner ? owner.data : Object.create(null);
}


module.exports = function createFlow (tasks, len) {
	const flow = new Flow(tasks, len);

	return function runFlow (cfg, data, callback) {
		const cbType = typeof callback;
		
		if (cbType === 'function') {
			flow.callback = callback;
			flow.data = data;
			flow.next(null, cfg);
		}
		else {
			throw new TypeError('callback should be a function');
		}
	};
};


Flow.prototype.next = function (err, cfg) {
	checkError(this, err);
	
	if (this.err) return;

	this.index++;

	const {tasks, index} = this;

	const nextTask = tasks[index];

	if (nextTask && typeof nextTask === 'function') {
		nextTask(cfg, this.data, this.done);
	}
	else if (this.owner) {
		this.owner.next(null, this.data);
	}
	else {
		this.callback(null, this.data);
	}
};
