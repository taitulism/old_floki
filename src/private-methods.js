
module.exports.createDone   = createRC;
module.exports.checkError   = checkError;
module.exports.isArrayOfFns = isArrayOfFns;


function isArrayOfFns (tasks) {
	if (!Array.isArray(tasks)) {
		throw new TypeError('"tasks" should be an array of functions');
	}
	tasks.forEach((task) => {
		if (typeof task !== 'function')  {
			throw new TypeError('"task" should be a function');
		}
	});
}


function checkError (flow, err) {
	if (!err || flow.err) return;

	flow.err = err;
	
	flow.callback(err);
}


function createRC (flow) {
	const RC = remoteControl.bind(flow);

	RC.flow = true;

	return RC;
}


function remoteControl (err, data) {
	this.next(err, data);
}
