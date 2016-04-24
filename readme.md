# cron-router

## About

**Cron-router** is a simple middleware for express which enables routing based on server time. This was initially written to enable a small parasitic art festival to occur on the www.safari.org.au website during the 2016 SafARI festival. The alternative programming hijacked the official website between 9pm to 9am AEST and was different based on the day of the week.

## Usage:

cron-router exposes one function **cronRoute** which takes one argument, and array of Match objects.

Match object should look like this:

```js
var match = {
	match: {
		year: /* optional, number or {from: number, to: number } */
		month: /* optional, number or {from: number, to: number } */
		date: /* optional, number or {from: number, to: number } */
		day: /* optional number or {from: number, to: number } */
		hours: /* optional number or {from: number, to: number } */
		minutes: /* optional number or {from: number, to: number } */
	},
	route: /* an express Router */
}
```

Match properties (year, month, date, etc) accept either an explicit number or a range object {from: x, to: y}. CronRouter compares all the provided match values to the current server date and if equal or within the inclusive range, the request is passed to the provided express router.  

### example:

```js
var express	= require('express');
var cronrouter = require('cron-router');

var app = express();

var route_A = express.Router();
route_A.get('/',(req,res)=>{
	res.send('route A is active between 9pm to midnight on Sundays.');
});)
var route_B = express.Router();
route_B.get('/',(req,res)=>{
	res.send('route B is active between midnight to 9am on Mondays.');
});)

var matches = [
	{
		match: {
			day: 0,
			hours: {from: 9, to: 24}
		},
		route: route_A
	},{
		match: {
			day: 1, //sub
			hours: {from: 0, to: 8}
		},
		route: route_B
	},
];

app.use(cronrouter.cronRoute(matches));

//if no matches it 
app.get('/', (req,res)=> {
	res.send('This is the default if none of the cron-routes are matched.');
});

app.listen(8080, (err, suc)=> {
	if (err) {
		throw err;
	} else {
		console.log('listening');
	}
});
```