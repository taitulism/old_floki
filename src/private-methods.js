module.exports.createRC = createRC;

function remoteControl (err, data) {
	this.next(err, data);
}

function createRC (flow) {
	const RC = remoteControl.bind(flow);

	RC.flow = true;

	return RC;
}