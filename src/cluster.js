
const {
	createDone,
	checkError,
	isArrayOfFns,
} = require('./private-methods');


module.exports = function createCluster (...tasks) {
	const len = tasks.length;

	isArrayOfFns(tasks);

	const cluster = new Cluster(tasks, len);
	
	return function runCluster (cfg, callback) {
		cluster.callback = callback;
		runAllTasks(cluster, cfg);
	};
};


function Cluster (tasks, len) {
	this.err   = null;
	this.tasks = tasks;
	this.len   = len;
	this.done  = createDone(this);
}


Cluster.prototype.next = function (err, data) {
	checkError(this, err);
	
	if (this.err) return;

	this.len--;

	const isDone = (this.len === 0);

	if (isDone) {
		this.callback(err, data);
	}
};


function runAllTasks (cluster, cfg) {
	const {tasks, data, done} = cluster;

	tasks.forEach((task) => {
		task(cfg, data, done);
	});
}
