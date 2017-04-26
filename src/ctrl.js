'use strict';

function Ctrl (HQ) {
	this.HQ = HQ;

	this.data = Object.create(null);
}

const proto = Ctrl.prototype;

proto.error = function () {
	this.HQ.error(this.err);
};

proto.done = function () {
	const allDone = Boolean(++this.index === this.len);

	if (allDone) {
		this.owner.done(this.data);
	}
};

module.exports = Ctrl;
