/* jshint esnext:true, globalstrict:true */
/* global require, module, exports, console, __dirname */

"use strict";

/* global exports:true*/
exports = module.exports = {
	cronRoute: cronRoute,
};

function cronRoute(options) {
	var times = [];
	if( options instanceof Array) {
		times = options;
		times.reverse();
	} else if ( typeof options === "object") {
		times.push(options);
	}
	return function (req,res,next) {
		console.log(times);
		for(let i = times.length-1; i>=0; i--) {
			let now = new Date();
			if(test(times[i].match, now)) {
				times[i].route(req,res,next);
				return;
			}
		}
		next();
	};
}

function test_range(range, value) {
	console.log('testing: ',range,value);
	if(range.from !== undefined && range.to !== undefined) {
		console.log('ok',(range.from <= value && value <= range.to));
		return (range.from <= value && value <= range.to);
	}
	else return range === value;
}

function test(match, date) {
	if(match.from !== undefined && match.to !== undefined) {
		return (match.from <= date.getTime() <= match.to);
	} else {
		return (
			(!match.year || test_range(match.year, date.getFullYear())) &&
			(!match.month || test_range(match.month, date.getMonth())) &&
			(!match.date || test_range(match.date, date.getDate())) &&
			(!match.day || test_range(match.day, date.getDay())) && 
			(!match.hours || test_range(match.hour, date.getHours())) &&
			(!match.minutes || test_range(match.minute, date.getMinutes()))
		);
	}
}