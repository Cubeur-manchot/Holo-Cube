"use strict";

// Represent the information of a logger.

/* Log mode is one of the following :
- "console" : logs are written in the console (either the browser console or AlgBot's console)
- "result" : logs are written in the json output
- "htmlTag" : logs are written in the specified htmlTag in a web page
*/

class Logger { // doesn't write any log
	static consoleLoggerMode = "console";
	static htmlTagLoggerMode = "htmlTag";
	static offLoggerMode = "off";
	static loggerModes = [
		Logger.consoleLoggerMode,
		Logger.htmlTagLoggerMode,
		Logger.offLoggerMode
	];
	static consoleLog = console.log;
	resultLog = message => {
		this.runner.logs += message + "\n";
	};
	static offLog = () => {};
	htmlLog = message => {
		this.logHtmlTag.innerHTML += message + "<br/>";
	};
	constructor (mode, runner, htmlTag) {
		this.runner = runner;
		this.mode = mode;
		switch (mode) {
			case "console":this.log = Logger.consoleLog; break;
			case "result": this.runner.logs = ""; this.log = this.resultLog; break;
			case "htmlTag": this.logHtmlTag = htmlTag; this.log = this.htmlLog; break;
			case "off": this.log = Logger.offLog; break;
			default: this.runner.throwError(`Invalid log mode ${mode}.`);
			// todo probably add Google Sheet cell as a mode
		}
	};
	errorLog = () => {};
	warningLog = message => {
		this.detailedLog(`[Warning] ${message}`);
	};
	generalLog = () => {};
	detailedLog = () => {};
	debugLog = () => {};
}

class ErrorLogger extends Logger { // writes only error logs
	constructor (mode, runner, htmlTag) {
		super(mode, runner, htmlTag);
	};
	errorLog = message => {
		this.log(`[Error] ${message}`);
	};
}

class GeneralLogger extends ErrorLogger { // writes general informative logs
	constructor (mode, runner, htmlTag) {
		super(mode, runner, htmlTag);
	};
	generalLog = this.log;
}

class DetailedLogger extends GeneralLogger { // writes detailed informative logs and warning logs
	constructor (mode, runner, htmlTag) {
		super(mode, runner, htmlTag);
	};
	detailedLog = this.log;
}

class DebugLogger extends DetailedLogger { // writes all logs for debug
	constructor (mode, runner, htmlTag) {
		super(mode, runner, htmlTag);
	};
	debugLog = this.log;
}
