'use strict';

const Flow = require('./flow');

function Floki (...args) {
	return new Flow(...args);
}

module.exports = Floki;
