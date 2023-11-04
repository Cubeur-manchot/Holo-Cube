"use strict";

// Represents the information of a runner (input, working, output). This is the entry point for everything related to Holo-Cube.

/*
Object structure to give to Runner class :
{
	puzzle: {
		fullName: string,
		colorScheme: array of colors,
		mask: {
			stage: string, // stage to show (OLL, PLL, CMLL, F2L, ...)
			custom: [
				{
					orbitType: string, // type of the orbit
					stickers: array of bools // tells for each individual sticker if it must be shown or not
				}
			]
		}
	},
	drawingOptions: {
		imageHeight: number, // height of the image in px, default value is 100
		imageWidth: number, // width of the image in px, default value is 100
		imageScale: number, // scale to apply to both height and width of the image, default is 1
		imageBackgroundColor: color, // background color of the image (white, transparent, ...)
		puzzleHeight: number, // height of the puzzle in px, default value is 100
		puzzleWidth: number, // width of the puzzle in px, default value is 100
		puzzleScale: number, // scale to apply to both height and width of the puzzle, default is 1
		puzzleColor: color, // color of the cube, excluding the stickers, (black, primary, stickerless, transparent, ...)
		view: string, // view of the puzzle ("plan"|"isometric"|"net"), default value is "plan"
		document: object // document implementation, default value is the document calling the script
	},
	logger: {
		verbosity: int, // level of verbosity for the logs (0 = no logs, 1 = errors only, 2 = general and warnings, 3 = detailed, 4 = debug), default value is 2
		mode: string, // how the logs will be written ("console"|"htmlTag"|"none"), default value is "console"
		inOutput: bool, // tells if the output must contain the logs, default value is false
		htmlTagSelector: string // selector to find the HTML tag in which to write, when "htmlTag" logger mode is selected
	}
}

puzzle.fullName is mandatory, other inputs are optional
*/

class Runner {
	static successStatus = "success";
	static failStatus = "fail";
	constructor(inputObject) {
		this.setLogger(inputObject);
		this.logger.generalLog("Creating new Runner.");
		this.setPuzzle(inputObject);
		this.setMoveSequenceParser();
		this.setDrawingOptions(inputObject);
		this.setPuzzleDrawer();
		this.logger.generalLog("End of initialization phase.");
		this.closeInitializationPhase();
	};
	run = moveSequenceInput => {
		this.logger.resetPartialLogs(); // partial logs should contain only the logs of run phase
		this.logger.generalLog("Beginning of run phase.");
		let result = {
			status: undefined,
			errors: []
		};
		if (Utils.isUndefinedOrNull(moveSequenceInput)) {
			result.status = Runner.failStatus;
			let errorMessage = "Error : run() method must be called with move sequence or move sequence list as an argument.";
			this.logger.errorLog(errorMessage);
			result.errors.push({
				scope: "general",
				message: errorMessage
			});
		} else if (Utils.isString(moveSequenceInput)) {
			this.logger.generalLog("Running for a single move sequence.");
			this.runForOneMoveSequence(result, moveSequenceInput, undefined);
		} else if (Utils.isArrayOfStrings(moveSequenceInput)) {
			this.logger.generalLog(`Running for a list of move sequences containing ${moveSequenceInput.length} element${moveSequenceInput.length > 1 ? "s" : ""}.`);
			result.results = [];
			for (let moveSequenceIndex = 0; moveSequenceIndex < moveSequenceInput.length; moveSequenceIndex++) {
				this.runForOneMoveSequence(result, moveSequenceInput[moveSequenceIndex], moveSequenceIndex);
			}
		} else {
			let errorMessage = "Error : move sequence must either be a string (single move sequence) or an array of strings (list of move sequences).";
			this.logger.errorLog(errorMessage);
			result.errors.push({
				scope: "general",
				message: errorMessage
			});
		}
		this.logger.generalLog("End of run phase.");
		if (this.logger.inOutput) {
			result.logs = {
				all: this.logs.initializationPhase + "\n" + this.logs.partial,
				initializationPhase: this.logs.initializationPhase,
				runPhase: this.logs.partial
			};
		}
		return result;
	};
	runForOneMoveSequence = (result, moveSequence, moveSequenceIndex) => {
		let isMultiple = !Utils.isUndefinedOrNull(moveSequenceIndex);
		let previousPartialLogs = this.logger.inOutput ? this.logs.partial : null;
		this.logger.resetPartialLogs();
		try {
			let puzzle = new this.puzzle.class(this);
			this.moveSequenceParser.parseMoveSequence(moveSequence).applyOnPuzzle(puzzle);
			let svg = this.puzzleDrawer.drawPuzzle(puzzle);
			if (isMultiple) { // multiple move sequences
				this.logger.generalLog(`Adding result of move sequence ${moveSequenceIndex} to output.`);
				let moveSequenceResult = {
					moveSequenceIndex: moveSequenceIndex,
					status: Runner.successStatus,
					svg: svg,
					errorMessage: null,
				};
				if (this.logger.inOutput) {
					moveSequenceResult.logs = this.logs.partial;
				}
				result.results.push(moveSequenceResult);
				if (!result.status) {
					result.status = Runner.successStatus;
				}
			} else { // single move sequences
				this.logger.generalLog("Adding result of move sequence to output.");
				result.svg = svg;
				result.status = Runner.successStatus;
			}
		} catch (errorMessage) {
			result.status = Runner.failStatus;
			let rootLevelError = {
				message: errorMessage
			};
			if (isMultiple) {
				rootLevelError.scope = `Move sequence ${moveSequenceIndex} (${moveSequence}).`;
				rootLevelError.moveSequenceIndex = moveSequenceIndex;
				let moveSequenceResult = {
					moveSequenceIndex: moveSequenceIndex,
					status: Runner.failStatus,
					svg: null,
					errorMessage: errorMessage
				};
				if (this.logger.inOutput) {
					moveSequenceResult.logs = this.logs.partial;
				}
				result.results.push(moveSequenceResult);
			} else {
				rootLevelError.scope = `Move sequence (${moveSequence}).`;
			}
			result.errors.push(rootLevelError);
		}
		if (this.logger.inOutput) {
			this.logs.partial = previousPartialLogs + "\n" + this.logs.partial;
		}
	};
	throwError = message => {
		let errorMessage = ErrorLogger.buildErrorMessage(message);
		Logger.consoleLog(errorMessage); // always display errors in the console
		if (this.logger && this.logger.mode !== Logger.consoleLoggerMode) {
			this.logger.errorLog(message);
		}
		throw errorMessage;
	};
	setLogger = inputObject => {
		// default values
		let verbosity = Logger.defaultOptions.verbosityLevel;
		let mode = Logger.defaultOptions.mode;
		let inOutput = Logger.defaultOptions.inOutput;
		let htmlTag = undefined;
		// check input and overwrite default values
		if (!Utils.isUndefinedOrNull(inputObject.logger)) {
			if (!Utils.isUndefinedOrNull(inputObject.logger.verbosity)) { // check verbosity
				if (!Utils.isNumber(inputObject.logger.verbosity)) {
					this.throwError("Property verbosity must be a number.");
				} else if (!Logger.verbosityLevels.includes(inputObject.logger.verbosity)) {
					this.throwError(`Property verbosity only accept values ${Logger.verbosityLevels.join(", ")} (received value = ${inputObject.logger.verbosity}).`);
				}
				verbosity = inputObject.logger.verbosity;
			}
			if (verbosity !== Logger.offVerbosityLevel) { // check other logger parameters
				if (!Utils.isUndefinedOrNull(inputObject.logger.mode)) { // check mode
					if (!Utils.isString(inputObject.logger.mode)) {
						this.throwError("Property mode must be a string.");
					} else if (!Logger.loggerModes.includes(inputObject.logger.mode)) {
						this.throwError(`Property mode only accept values ${Logger.loggerModes.join(", ")} (received value = ${inputObject.logger.mode}).`);
					}
					mode = inputObject.logger.mode;
					if (mode === Logger.htmlTagLoggerMode) { // check HTML tag selector if htmlTag mode is chosen
						if (Utils.isUndefinedOrNull(inputObject.logger.htmlTagSelector)) {
							this.throwError(`Property logger.htmlTagSelector is required when mode is "${Logger.htmlTagLoggerMode}".`);
						} else if (!Utils.isString(inputObject.logger.htmlTagSelector)) {
							this.throwError("Property htmlTagSelector must be a string.");
						}
						htmlTag = document.querySelector(inputObject.logger.htmlTagSelector);
						if (htmlTag === null) {
							this.throwError(`No HTML tag was found with selector ${inputObject.logger.htmlTagSelector}.`);
						}
					}
				}
				if (!Utils.isUndefinedOrNull(inputObject.logger.inOutput)) { // check if logs must appear in output
					if (!Utils.isBoolean(inputObject.logger.inOutput)) {
						this.throwError("Property inOutput must be a boolean.");
					}
					inOutput = inputObject.logger.inOutput;
				}
			}
		}
		this.logger = new (this.getLoggerClass(verbosity))(mode, this, inOutput, htmlTag);
		this.logger.detailedLog("Logger is created.");
	};
	closeInitializationPhase = () => {
		if (this.logger.inOutput) {
			this.logs.initializationPhase = this.logs.all;
		}
	};
	setPuzzle = inputObject => {
		this.logger.detailedLog("Reading input : puzzle.");
		this.puzzle = new PuzzleRunnerInput(inputObject.puzzle, this);
	};
	setDrawingOptions = inputObject => {
		this.logger.detailedLog("Reading input : drawingOptions.");
		this.drawingOptions = new DrawingOptionsRunnerInput(inputObject.drawingOptions, this);
	};
	setMoveSequenceParser = () => {
		this.moveSequenceParser = new MoveSequenceParser(this);
	};
	setPuzzleDrawer = () => {
		let puzzleDrawerClass = this.getPuzzleDrawerClass();
		this.puzzleDrawer = new puzzleDrawerClass(this);
		this.puzzleDrawer.createSvgSkeletton();
	};
	getPuzzleDrawerClass = () => {
		switch(this.puzzle.class.shape) {
			case "cube": switch(this.drawingOptions.view) {
				case TwistyPuzzleDrawer.planView: return CubePlanDrawer;
				case TwistyPuzzleDrawer.isometricView: return CubeIsometricDrawer;
				case TwistyPuzzleDrawer.netView: return CubeNetDrawer;
			}
			default: this.throwError("Getting puzzle drawer class for a non-cubic shaped puzzle.");
		}
	};
	getLoggerClass = verbosity => {
		switch(verbosity) {
			case Logger.offVerbosityLevel: return Logger;
			case Logger.errorVerbosityLevel: return ErrorLogger;
			case Logger.generalVerbosityLevel: return GeneralLogger;
			case Logger.detailedVerbosityLevel: return DetailedLogger;
			case Logger.debugVerbosityLevel: return DebugLogger;
		}
	};
}

// Represents the information of a puzzle as an input of a runner.

class PuzzleRunnerInput {
	constructor(puzzle, runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new PuzzleRunnerInput");
		if (Utils.isUndefinedOrNull(puzzle)) {
			this.runner.throwError("Property puzzle is required.");
		} else if (!Utils.isObject(puzzle)) {
			this.runner.throwError("Property puzzle must be an object.");
		}
		let {puzzleShape, puzzleSize} = this.getPuzzleGeneral(puzzle);
		let mask = this.getMask(puzzle);
		let colorScheme = this.getColorScheme(puzzle, puzzleShape);
		this.class = this.getPuzzleClass(puzzleShape, puzzleSize, colorScheme, mask);
	};
	getPuzzleGeneral = puzzle => {
		if (Utils.isUndefinedOrNull(puzzle.fullName)) {
			this.runner.throwError("Property puzzle.fullName is required.");
		} else if (!Utils.isString(puzzle.fullName)) {
			this.runner.throwError("Property puzzle.fullName must be a string.");
		} else if (!puzzle.fullName.startsWith("cube")) {
			this.runner.throwError("Wrong value for puzzle.fullName : only cubes are supported for now.");
		} else if (!/^cube\d+x\d+x\d+$/.test(puzzle.fullName) || new Set(puzzle.fullName.substring(4).split("x")).size !== 1) {
			this.runner.throwError("Unrecognized or unsupported puzzle name. Available names are of the form cubeNxNxN, where N has to be replaced with the cube size.");
		}
		let puzzleSize = parseInt(puzzle.fullName.match(/\d+$/)[0]);
		if (puzzleSize === 0) {
			this.runner.throwError(`Creating cube with no layer.`);
		} else if (puzzleSize > 13) {
			this.runner.logger.warningLog(`Creating cube with large number of layers (${puzzleSize}).`);
		}
		return {
			puzzleShape: Cube.shape,
			puzzleSize: puzzleSize,
		}
	};
	getMask = puzzle => {
		let mask = [];
		if (!Utils.isUndefinedOrNull(puzzle.mask)) {
			// mask aliases
			if (!Utils.isUndefinedOrNull(puzzle.mask.stage)) {
				if (!Utils.isString(puzzle.mask.stage)) {
					this.runner.throwError("Property puzzle.mask.stage must be a string.");
				} else {
					mask = this.getMaskFromAlias(puzzle.mask.stage);
					if (mask === null) {
						this.runner.throwError(`Invalid or unrecognized value for puzzle.mask.stage : ${puzzle.mask.stage}.`);
					}
				}
			}
			// custom masks
			if (!Utils.isUndefinedOrNull(puzzle.mask.custom)) {
				if (!Utils.isArray(puzzle.mask.custom)) {
					this.runner.throwError("Property puzzle.mask.custom must be an array.");
				}
				for (let orbitMask of puzzle.mask.custom) {
					if (Utils.isUndefinedOrNull(orbitMask.orbitType)) {
						this.runner.throwError("Property orbitType is required to define custom masks.");
					} else if (!Utils.isString(orbitMask.orbitType)) {
						this.runner.throwError("Property orbitType under puzzle.mask.custom is required.");
					}
					let existingMatchingOrbitMask = mask.find(existingOrbitMask => existingOrbitMask.orbitType === orbitMask.orbitType);
					if (existingMatchingOrbitMask) {
						existingMatchingOrbitMask = orbitMask; // replace orbit mask
					} else {
						mask.push(orbitMask); // add orbit mask
					}
				}
			}
		}
		return mask;
	};
	getMaskFromAlias = stage => {
		switch (stage) {
			case "PLL": case "ZBLL": case "ELL": case "1LLL": case "LSE": case "LSEP": case "L4C": case "ZZLL":
				return [];
			case "OLLCP": case "COLL": case "CPEOLL":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "OLL": case "OCLL": case "VLS": case "HLS": case "OLS": case "WV": case "SV": case "MW": case "CLS": case "JTLE":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [true, true, true, true, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "ZBLS": case "EOLS": case "VHLS": case "ELS": case "EOLL":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "LLEF":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}
				];
			case "CLL":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "CMLL":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, false, true, false, true, true, true,
							false, true, false, true, false, true, false, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true,
							false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true]
					}, {
						orbitType: CenterCubeOrbit.type,
						stickers: [false, false, true,
							false, false, true]
					}, {
						orbitType: CenterBigCubeOrbit.type,
						stickers: [false, false, false, false, false, true, false, true, false, true, true, true,
							false, true, false, true, false, true, false, true, false, true, true, true]
					}
				];
			case "EOLR":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, false, true, true, true, true, true,
							true, true, true, true, false, true, false, true, true, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, false, false, true, true, true, true, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, false, false, true, true, true, true, true, true, true, true, true, true]
					}
				];
			case "Cross": case "cross":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, false, false, false, true, false,
							true, true, true, true, false, false, false, true, false, false, false, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false,
							true, true, true, true, true, true, true, true, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false]
					}
				];
			case "FB":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, true, false, false, false, false,
							true, false, false, true, false, false, false, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, true, false, false, false, false,
							false, false, false, true, false, true, false, false, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, true, true, true, true, true]
					}
				];
			case "SB":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, false, true, false, true, true, true,
							false, true, false, true, false, true, false, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true,
							false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "FL":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, false, false, false, true, false,
							true, true, true, true, false, false, false, true, false, false, false, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false,
							true, true, true, true, true, true, true, true, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false]
					}
				];
			case "L2C":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
					}
				];
			case "L2E":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}
				];
			default: return null; // unrecognized alias
		};
	};
	getColorScheme = (puzzle, puzzleShape) => {
		let colorScheme = [];
		let defaultColorScheme = this.getDefaultColorSchemeFromShape(puzzleShape);
		if (Utils.isUndefinedOrNull(puzzle.colorScheme)) {
			for (let color of defaultColorScheme) {
				colorScheme.push(new Color(color));
			}
			this.runner.logger.detailedLog(`Property puzzle.colorScheme was not provided, using default color scheme ["${defaultColorScheme.join('", "')}"].`);
		} else {
			if (!Utils.isArrayOfStrings(puzzle.colorScheme)) {
				this.runner.throwError("Property puzzle.colorScheme must be an array of strings.");
			} else if (puzzle.colorScheme.length !== defaultColorScheme.length) {
				this.runner.throwError("Property puzzle.colorScheme doesn't have the correct number of values "
					+ `(expected value = ${defaultColorScheme.length} because puzzle shape is ${puzzleShape}, `
					+ `actual = ${puzzle.colorScheme.length}).`);
			}
			for (let color of puzzle.colorScheme) {
				if (!Color.checkFormat(color)) {
					this.runner.throwError(`Invalid or unrecognized color in puzzle.colorScheme property : ${color}.`);
				}
				colorScheme.push(new Color(color));
			}
		}
		return colorScheme;
	};
	getDefaultColorSchemeFromShape = puzzleShape => {
		switch (puzzleShape) {
			case Cube.shape:
				return [ // respectively for U, F, R, D, B, L faces
					"white",
					"green",
					"red",
					"yellow",
					"blue",
					"orange"
				];
			case Pyramid.shape:
				return [ // respectively for F, BR, BL, D faces
					"green",
					"blue",
					"red",
					"yellow"
				];
			case Dodecahedron.shape:
				return [ // respectively for U, F, R, BR, BL, L, D, DB, DL, DFL, DFR, DR
					"white",
					"green",
					"red",
					"blue",
					"yellow",
					"purple",
					"grey",
					"lightGreen",
					"orange",
					"lightBlue",
					"lightYellow",
					"pink"
				];
			default:
				this.runner.throwError(`Getting default color scheme from invalid puzzle shape "${puzzleShape}".`);
		}
	};
	getPuzzleClass = (puzzleShape, puzzleSize, colorScheme, mask) => {
		this.runner.logger.debugLog("Getting puzzle class.");
		switch(puzzleShape) {
			case Cube.shape:
				return Cube.buildCustomClass(this.runner, puzzleSize, colorScheme, mask);
			default:
				this.runner.throwError("Getting puzzle class for a non-cubic shaped puzzle.");
		}
	};
}

// Represent the drawing options as an input of a runner.

class DrawingOptionsRunnerInput {
	static defaultDrawingOptions = {
		imageHeight: 100,
		imageWidth: 100,
		imageScale: 1,
		imageBackgroundColor: "transparent",
		puzzleHeight: 100,
		puzzleWidth: 100,
		puzzleScale: 1,
		puzzleColor: "black",
		view: "plan"
	};
	constructor(drawingOptionsObject, runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new DrawingOptionsRunnerInput");
		if (drawingOptionsObject) {
			let heightWidthList = ["Height", "Width"];
			for (let imageOrPuzzle of ["image", "puzzle"]) {
				for (let heightOrWidth of heightWidthList) {
					let dimensionProperty = imageOrPuzzle + heightOrWidth;
					if (!Utils.isUndefinedOrNull(drawingOptionsObject[dimensionProperty])) {
						this.checkNumberNotZero(drawingOptionsObject[dimensionProperty], dimensionProperty);
						this[dimensionProperty] = drawingOptionsObject[dimensionProperty];
					} else {
						this.setNumericValueFromDefault(dimensionProperty);
					}
				}
				let scaleProperty = imageOrPuzzle + "Scale";
				if (!Utils.isUndefinedOrNull(drawingOptionsObject[scaleProperty])) {
					this.checkNumberNotZero(drawingOptionsObject[scaleProperty], scaleProperty);
					for (let heightOrWidth of heightWidthList) {
						this[imageOrPuzzle + heightOrWidth] *= drawingOptionsObject[scaleProperty];
					}
				}
			}
			if (!Utils.isUndefinedOrNull(drawingOptionsObject.view)) {
				if (!Utils.isString(drawingOptionsObject.view)) {
					this.runner.throwError("Property drawingOptions.view must be a string.");
				} else if (!TwistyPuzzleDrawer.views.includes(drawingOptionsObject.view)) {
					this.runner.throwError(`Property view only accept values "${TwistyPuzzleDrawer.view.join("\", \"")}" (received value = ${drawingOptionsObject.view}).`);
				} else {
					this.runner.logger.warningLog("View option is not yet supported, using plan view by default");
					this.view = DrawingOptionsRunnerInput.defaultDrawingOptions.view;
				}
			} else {
				this.view = DrawingOptionsRunnerInput.defaultDrawingOptions.view;
			}
			let dimensionIssues = [];
			for (let dimension of ["Height", "Width"]) {
				if (Math.abs(this["puzzle" + dimension]) > Math.abs(this["image" + dimension])) {
					dimensionIssues.push(`puzzle${dimension} = ${this["puzzle" + dimension]}, image${dimension} = ${this["image" + dimension]}`);
				}
				if (Math.abs(this["image" + dimension]) > 2000) {
					this.runner.logger.warningLog(`Creating large image (image${dimension} = ${this["image" + dimension]}).`);
				}
			}
			if (dimensionIssues.length) {
				this.runner.throwError(`Puzzle is larger than image (${dimensionIssues.join(", ")}).`);
			}
			for (let drawingOptionsProperty of ["imageBackgroundColor", "puzzleColor"]) {
				if (drawingOptionsObject[drawingOptionsProperty]) {
					if (!Utils.isString(drawingOptionsObject[drawingOptionsProperty])) {
						this.runner.throwError(`Property drawingOptions.${drawingOptionsProperty} must be a string.`);
					} else if (!Color.checkFormat(drawingOptionsObject[drawingOptionsProperty])) {
						this.runner.throwError(`Invalid or unrecognized color for property drawingOptions.${drawingOptionsProperty} : ${drawingOptionsObject[drawingOptionsProperty]}.`);
					}
					this[drawingOptionsProperty] = new Color(drawingOptionsObject[drawingOptionsProperty]);
				} else {
					this.setColorValueFromDefault(drawingOptionsProperty);
				}
			}
			if (!Utils.isUndefinedOrNull(drawingOptionsObject.document)) {
				if (!Utils.isObject(drawingOptionsObject.document)) {
					this.runner.throwError("Property drawingOptions.document must be an object.");
				} else {
					this.runner.logger.detailedLog("Using specified document for SVG creation.");
					this.document = drawingOptionsObject.document;
				}
			} else {
				this.setDocumentFromDefault();
			}
		} else {
			this.setAllValuesFromDefault();
		}
	};
	setAllValuesFromDefault = () => {
		for (let drawingOptionsNumericProperty of ["imageHeight", "imageWidth", "puzzleHeight", "puzzleWidth"]) {
			this.setNumericValueFromDefault(drawingOptionsNumericProperty);
		}
		for (let drawingOptionsColorProperty of ["imageBackgroundColor", "puzzleColor"]) {
			this.setColorValueFromDefault(drawingOptionsColorProperty);
		}
		this.setDocumentFromDefault();
		this.view = DrawingOptionsRunnerInput.defaultDrawingOptions.view;
	};
	setNumericValueFromDefault = propertyName => {
		this[propertyName] = DrawingOptionsRunnerInput.defaultDrawingOptions[propertyName];
		this.runner.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${this[propertyName]}.`);
	};
	setColorValueFromDefault = propertyName => {
		this[propertyName] = new Color(DrawingOptionsRunnerInput.defaultDrawingOptions[propertyName]);
		this.runner.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${DrawingOptionsRunnerInput.defaultDrawingOptions[propertyName]}.`);
	};
	setDocumentFromDefault = () => {
		if (document) {
			this.runner.logger.detailedLog("Property drawingOptions.document was not provided, using default document for SVG creation.");
			this.document = document;
		} else {
			this.runner.throwError("No document was specified for SVG creation and none is available by default.");
		}
	};
	checkNumberNotZero = (variableValue, variableName) => {
		if (Utils.isNumber(variableValue !== "number")) {
			this.runner.throwError(`Property drawingOptions.${variableName} must be a number.`);
		} else if (variableValue === 0) {
			this.runner.throwError(`Property drawingOptions.${variableName} cannot be 0.`);
		}
	};
}
