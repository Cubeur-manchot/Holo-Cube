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
	static offVerbosityLevel = -1;
	static errorVerbosityLevel = 0;
	static generalVerbosityLevel = 1;
	static detailedVerbosityLevel = 2;
	static debugVerbosityLevel = 3;
	static verbosityLevels = [
		Logger.offVerbosityLevel,
		Logger.errorVerbosityLevel,
		Logger.generalVerbosityLevel,
		Logger.detailedVerbosityLevel,
		Logger.debugVerbosityLevel
	];
	static defaultOptions = {
		mode: Logger.consoleLoggerMode,
		verbosityLevel: Logger.generalVerbosityLevel,
		inOutput: false
	};
	static consoleLog = console.log;
	resultLog = message => {
		this.runner.logs += message + "\n";
	};
	static offLog = () => {};
	htmlLog = message => {
		this.logHtmlTag.innerHTML += message + "<br/>";
	};
	constructor (mode, runner, inOutput, htmlTag) {
		this.runner = runner;
		this.mode = mode;
		this.inOutput = inOutput;
		let logMethod;
		switch (mode) {
			case Logger.consoleLoggerMode: logMethod = Logger.consoleLog; break;
			case Logger.htmlTagLoggerMode: this.logHtmlTag = htmlTag; logMethod = this.htmlLog; break;
			case Logger.offLoggerMode: logMethod = Logger.offLog; break;
			default: this.runner.throwError(`Invalid log mode ${mode}.`);
			// todo probably add Google Sheet cell as a mode
		}
		if (inOutput) {
			this.log = message => {
				logMethod(message);
				this.resultLog(message);
			};
			this.runner.logs = {
				all: "",
				partial: ""
			};
		} else {
			this.log = logMethod;
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
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	static buildErrorMessage = message => {
		return `[Error] ${message}`;
	};
	errorLog = message => {
		this.log(`[Error] ${message}`);
	};
}

class GeneralLogger extends ErrorLogger { // writes general informative logs
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	generalLog = this.log;
}

class DetailedLogger extends GeneralLogger { // writes detailed informative logs and warning logs
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	detailedLog = this.log;
}

class DebugLogger extends DetailedLogger { // writes all logs for debug
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	debugLog = this.log;
}
