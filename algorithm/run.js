"use strict";
// todo remove this test line
// Represents the information of a run (input, working, output). This is the entry point for everything related to Holo-Cube.

/*
Object structure to give to Run class :
{
	puzzle: {
		fullName: string,
		stage: string, // stage to show (OLL, PLL, CMLL, F2L, ...)
		colorScheme: array of colors
	},
	moveSequence: string or array of strings, // sequence to apply on one puzzle
	moveSequenceList: array of strings // sequences to apply, each one on a different puzzle
	drawingOptions: {
		imageHeight: number, // height of the image in px, default value is 100
		imageWidth: number, // width of the image in px, default value is 100
		imageScale: number, // scale to apply to both height and width of the image, default is 1
		imageBackgroundColor: color, // background color of the image (white, transparent, ...)
		puzzleHeight: number, // height of the puzzle in px, default value is 100
		puzzleWidth: number, // width of the puzzle in px, default value is 100
		puzzleScale: number, // scale to apply to both height and width of the puzzle, default is 1
		puzzleColor: color // color of the cube, excluding the stickers, (black, primary, stickerless, transparent, ...)
		view: string // view of the puzzle ("plan"|"isometric"|"net"), default value is "plan"
	},
	logger: {
		verbosity: int, // level of verbosity for the logs (-1 = no logs, 0 = errors only, 1 = general and warnings, 2 = advanced, 3 = debug), default value is 1
		mode: string, // how the logs will be written ("console"|"result"|"htmlTag"), default value is "console"
		htmlTagSelector: string // selector to find the HTML tag in which to write, when "htmlTag" logger mode is selected
	}
}

puzzle.fullName is mandatory
moveSequence XOR moveSequenceList is mandatory
other inputs are optional
*/

class Run {
	constructor(inputObject) {
		this.setLogger(inputObject);
		this.logger.generalLog("Creating new Run.");
		this.setPuzzle(inputObject);
		this.setMoveSequenceList(inputObject);
		this.setDrawingOptions(inputObject);
		this.setPuzzleClass();
		this.setBlankPuzzle();
		this.setMoveSequenceParser();
		this.setPuzzleDrawer();
		this.logger.generalLog("End of initialization phase.");
	};
	run = () => {
		this.logger.generalLog("Beginning of execution phase.");
		let result = {
			svgList: []
		};
		for (let moveSequence of this.moveSequenceList) {
			let puzzle = new this.puzzleClass(this);
			this.moveSequenceParser.parseMoveSequence(moveSequence).applyOnPuzzle(puzzle);
			this.logger.generalLog("Adding image to output.");
			result.svgList.push(this.puzzleDrawer.drawPuzzle(puzzle));
		}
		if (this.logger.mode === "result") {
			result.logs = this.logs;
		}
		this.logger.generalLog("End of execution phase.");
		return result;
	};
	throwError = message => {
		let errorMessage = `[ERROR] ${message}`;
		Logger.consoleLog(errorMessage); // always display errors in the console
		if (this.logger && this.logger.mode !== "console") {
			this.logger.errorLog(message);
		}
		throw errorMessage;
	};
	setLogger = inputObject => {
		let verbosity = 1; // default value
		let mode = "console"; // default value
		let htmlTag = undefined;
		if (![undefined, null].includes(inputObject.logger)) {
			if (![undefined, null].includes(inputObject.logger.verbosity)) { // check verbosity
				if (typeof inputObject.logger.verbosity !== "number") {
					this.throwError("Property verbosity must be a number.");
				} else if (![-1, 0, 1, 2, 3].includes(inputObject.logger.verbosity)) {
					this.throwError(`Property verbosity only accept values -1, 0, 1, 2 and 3 (received value = ${inputObject.logger.verbosity}).`);
				}
				verbosity = inputObject.logger.verbosity;
			}
			if (verbosity !== -1 && ![undefined, null].includes(inputObject.logger.mode)) { // check mode
				if (typeof inputObject.logger.mode !== "string") {
					this.throwError("Property mode must be a string.");
				} else if (!["console", "result", "htmlTag", "off"].includes(inputObject.logger.mode)) {
					this.throwError(`Property mode only accept values "console", "result" and "htmlTag" (received value = ${inputObject.logger.mode}).`);
				}
				mode = inputObject.logger.mode;
				if (mode === "htmlTag") { // htmlTag mode is chosen, the HTML tag is required
					if ([undefined, null].includes(inputObject.logger.htmlTagSelector)) {
						this.throwError("Property logger.htmlTagSelector is required when mode is \"htmlTag\".");
					} else if (typeof inputObject.logger.htmlTagSelector !== "string") {
						this.throwError("Property htmlTagSelector must be a string.");
					}
					htmlTag = document.querySelector(inputObject.logger.htmlTagSelector);
					if (htmlTag === null) {
						this.throwError(`No HTML tag was found with selector ${inputObject.logger.htmlTagSelector}.`);
					}
				}
			}
		}
		this.logger = new (this.getLoggerClass(verbosity))(mode, this, htmlTag);
		this.logger.detailedLog("Logger is created.");
	};
	setPuzzle = inputObject => {
		this.logger.detailedLog("Reading input : puzzle.");
		this.puzzle = new PuzzleRunInput(inputObject.puzzle, this);
	};
	setMoveSequenceList = inputObject => {
		this.logger.detailedLog("Reading input : move sequence(s).");
		let isMoveSequenceDefined = ![undefined, null].includes(inputObject.moveSequence);
		let isMoveSequenceListDefined = ![undefined, null].includes(inputObject.moveSequenceList);
		if (isMoveSequenceDefined) {
			if (isMoveSequenceListDefined) {
				this.throwError("Both properties moveSequence and moveSequenceList were provided, please set one of them to null or undefined.");
			}
			if (typeof inputObject.moveSequence !== "string") {
				this.throwError("Property moveSequence must of a string.");
			}
			this.moveSequenceList = [inputObject.moveSequence];
		} else {
			if (!isMoveSequenceListDefined) {
				this.throwError("Property moveSequence or moveSequenceList must be provided.");
			}
			if (typeof inputObject.moveSequenceList !== "object") {
				this.throwError("Property moveSequenceList must be an array of strings.");
			} else {
				for (let moveSequence of inputObject.moveSequenceList) {
					if (typeof moveSequence !== "string") {
						this.throwError("Each move sequence in property moveSequenceList must be a string.");
					}
				}
			}
			this.moveSequenceList = inputObject.moveSequenceList;
		}
	};
	setDrawingOptions = inputObject => {
		this.logger.detailedLog("Reading input : drawingOptions.");
		this.drawingOptions = new DrawingOptionsRunInput(inputObject.drawingOptions, this);
	};
	setPuzzleClass = () => {
		this.logger.debugLog("Setting puzzle class.");
		switch(this.puzzle.shape) {
			case "cube": switch(this.puzzle.fullName) {
				case "cube1x1x1": this.puzzleClass = Cube1x1x1; break;
				case "cube2x2x2": this.puzzleClass = Cube2x2x2; break;
				case "cube3x3x3": this.puzzleClass = Cube3x3x3; break;
				default: this.puzzleClass = CubeBig;
			}; break;
			default: this.throwError("Getting puzzle class for a non-cubic shaped puzzle.");
		}
	};
	setBlankPuzzle = () => { // blank puzzle is an instance of the blank parent class, which has the same structure without the orbits
		this.logger.debugLog("Creating blank puzzle.");
		this.blankPuzzle = new (TwistyPuzzle.getBlankParentClass(this.puzzleClass))(this);
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
		switch(this.puzzle.shape) {
			case "cube": switch(this.drawingOptions.view) {
				case "plan": return CubePlanDrawer;
				case "isometric": return CubeIsometricDrawer;
				case "net": return CubeNetDrawer;
			}
			default: this.throwError("Getting puzzle drawer class for a non-cubic shaped puzzle.");
		}
	};
	getLoggerClass = verbosity => {
		switch(verbosity) {
			case -1: return Logger;
			case 0: return ErrorLogger;
			case 1: return GeneralLogger;
			case 2: return DetailedLogger;
			case 3: return DebugLogger;
		}
	};
}

// Represents the information of a puzzle as an input of a run.

class PuzzleRunInput {
	constructor(puzzle, run) {
		this.run = run;
		this.run.logger.debugLog("Creating new PuzzleRunInput");
		if ([undefined, null].includes(puzzle)) {
			this.run.throwError("Property puzzle is required.");
		} else if (typeof puzzle !== "object") {
			this.run.throwError("Property puzzle must be an object.");
		}
		this.setPuzzleGeneral(puzzle);
		this.setStage(puzzle);
		this.setColorScheme(puzzle);
	};
	setPuzzleGeneral = puzzle => {
		if ([undefined, null].includes(puzzle.fullName)) {
			this.run.throwError("Property puzzle.fullName is required.");
		} else if (typeof puzzle.fullName !== "string") {
			this.run.throwError("Property puzzle.fullName must be a string.");
		} else if (!puzzle.fullName.startsWith("cube")) {
			this.run.throwError("Wrong value for puzzle.fullName : only cubes are supported for now.");
		} else if (!/^cube\d+x\d+x\d+$/.test(puzzle.fullName) || new Set(puzzle.fullName.substring(4).split("x")).size !== 1) {
			this.run.throwError("Unrecognized or unsupported puzzle name. Available names are of the form cubeNxNxN, where N has to be replaced with the cube size.");
		}
		this.fullName = puzzle.fullName;
		this.shape = "cube";
		this.size = parseInt(puzzle.fullName.match(/\d+$/)[0]);
		if (this.size === 0) {
			this.run.throwError(`Creating cube with no layer.`);
		} else if (this.size > 13) {
			this.run.logger.warningLog(`Creating cube with large number of layers (${this.size}).`);
		}
	};
	setStage = puzzle => {
		if (![undefined, null].includes(puzzle.stage)) {
			if (typeof puzzle.stage !== "string") {
				this.run.throwError("Property puzzle.stage must be a string.");
			} else {
				this.run.logger.warningLog("Stage option is not yet supported, current mode shows all stickers.");
				this.stage = puzzle.stage;
			}
		}
		this.stage = puzzle.stage ?? "full";
	};
	setColorScheme = puzzle => {
		this.colorScheme = [];
		if ([undefined, null].includes(puzzle.colorScheme)) {
			for (let color of this.getDefaultColorSchemeFromShape(this.shape)) {
				this.colorScheme.push(new Color(color));
			}
		} else {
			if (typeof puzzle.colorScheme !== "object") {
				this.run.throwError("Property puzzle.colorScheme must be an array of strings.");
			} else if (puzzle.colorScheme.length !== this.getColorSchemeLengthFromShape(this.shape)) {
				this.run.throwError("Property puzzle.colorScheme doesn't have the correct number of values "
					+ `(expected value = ${this.getColorSchemeLengthFromShape(puzzleShape)} because puzzle shape is ${this.puzzle.shape},`
					+ `actual = ${puzzle.colorScheme.length}).`);
			} else {
				for (let color of puzzle.colorScheme) {
					if (typeof color !== "string") {
						this.run.throwError("Each color in property puzzle.colorScheme must be a string.");
					} else if (!Color.checkFormat(color)) {
						this.run.throwError(`Invalid or unrecognized color in puzzle.colorScheme property : ${color}.`);
					}
					this.colorScheme.push(new Color(color));
				}
			}
		}
	};
	getDefaultColorSchemeFromShape = puzzleShape => {
		switch (puzzleShape) {
			case Cube.shape: return ["w", "g", "r", "y", "b", "o"]; // respectively for U, F, R, D, B, L faces
			case Pyramid.shape: return ["g", "b", "r", "y"]; // respectively for F, BR, BL, D faces
			case Dodecahedron.shape: return ["w", "g", "r", "b", "y", "pu", "gy", "lg", "o", "lb", "ly", "pi"]; // respectively for U, F, R, BR, BL, L, D, DB, DL, DFL, DFR, DR
			default: this.run.throwError(`Getting default color scheme from invalid puzzle shape ${puzzleShape}.`);
		}
	};
	getColorSchemeLengthFromShape = puzzleShape => {
		try {
			return this.getDefaultColorSchemeFromShape(puzzleShape).length;
		} catch {
			this.run.throwError(`Getting length of color scheme from invalid puzzle shape ${puzzleShape}.`);
		}
	};
}

// Represent the drawing options as an input of a run.

class DrawingOptionsRunInput {
	static defaultDrawingOptions = {
		imageHeight: 100,
		imageWidth: 100,
		imageBackgroundColor: "transparent",
		puzzleHeight: 100,
		puzzleWidth: 100,
		puzzleColor: "black",
		view: "plan"
	};
	constructor(drawingOptionsObject, run) {
		this.run = run;
		this.run.logger.debugLog("Creating new DrawingOptionsRunInput");
		if (drawingOptionsObject) {
			let heightWidthList = ["Height", "Width"];
			for (let imageOrPuzzle of ["image", "puzzle"]) {
				for (let heightOrWidth of heightWidthList) {
					let dimensionProperty = imageOrPuzzle + heightOrWidth;
					if (![undefined, null].includes(drawingOptionsObject[dimensionProperty])) {
						this.checkNumberNotZero(drawingOptionsObject[dimensionProperty], dimensionProperty);
						this[dimensionProperty] = drawingOptionsObject[dimensionProperty];
					} else {
						this.setNumericValueFromDefault(dimensionProperty);
					}
				}
				let scaleProperty = imageOrPuzzle + "Scale";
				if (![undefined, null].includes(drawingOptionsObject[scaleProperty])) {
					this.checkNumberNotZero(drawingOptionsObject[scaleProperty], scaleProperty);
					for (let heightOrWidth of heightWidthList) {
						this[imageOrPuzzle + heightOrWidth] *= drawingOptionsObject[scaleProperty];
					}
				}
			}
			if (![undefined, null].includes(drawingOptionsObject.view)) {
				if (typeof drawingOptionsObject.view !== "string") {
					this.run.throwError("Property drawingOptions.view must be a string.");
				} else if (!["plan", "isometric", "net"].includes(drawingOptionsObject.view)) {
					this.run.throwError(`Invalid value for property drawingOptions.view (current = ${drawingOptionsObject.view}, allowed = "plan"|"isometric"|"net").`);
				} else {
					this.run.logger.warningLog("View option is not yet supported, using plan view by default");
					this.view = DrawingOptionsRunInput.defaultDrawingOptions.view; // todo replace with this.view = drawingOptionsObject.view;
				}
			} else {
				this.view = DrawingOptionsRunInput.defaultDrawingOptions.view;
			}
			for (let dimension of ["Height", "Width"]) {
				if (Math.abs(this["puzzle" + dimension]) > Math.abs(this["image" + dimension])) {
					this.run.throwError(`Puzzle is larger than image (puzzle${dimension} = this["puzzle" + dimension], image${dimension} = this["image" + dimension]).`);
				}
				if (Math.abs(this["image" + dimension]) > 2000) {
					this.run.logger.warningLog(`Creating large image (image${dimension} = this["image" + dimension]).`);
				}
			}
			for (let drawingOptionsProperty of ["imageBackgroundColor", "puzzleColor"]) {
				if (drawingOptionsObject[drawingOptionsProperty]) {
					if (typeof drawingOptionsObject[drawingOptionsProperty] !== "string") {
						this.run.throwError(`Property drawingOptions.${drawingOptionsProperty} must be a string.`);
					} else if (!Color.checkFormat(drawingOptionsObject[drawingOptionsProperty])) {
						this.run.throwError(`Invalid or unrecognized color for property drawingOptions.${drawingOptionsProperty} : ${drawingOptionsObject[drawingOptionsProperty]}.`);
					}
					this[drawingOptionsProperty] = new Color(drawingOptionsObject[drawingOptionsProperty]);
				} else {
					this.setColorValueFromDefault(drawingOptionsProperty);
				}
			}
		} else {
			this.setAllValuesFromDefault();
		}
	}; // todo add debug logs when setting values with default values ?
	setAllValuesFromDefault = () => {
		for (let drawingOptionsNumericProperty of ["imageHeight", "imageWidth", "puzzleHeight", "puzzleWidth"]) {
			this.setNumericValueFromDefault(drawingOptionsNumericProperty);
		}
		for (let drawingOptionsColorProperty of ["imageBackgroundColor", "puzzleColor"]) {
			this.setColorValueFromDefault(drawingOptionsColorProperty);
		}
		this.view = DrawingOptionsRunInput.defaultDrawingOptions.view;
	};
	setNumericValueFromDefault = propertyName => {
		this[propertyName] = DrawingOptionsRunInput.defaultDrawingOptions[propertyName];
		this.run.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${this[propertyName]}.`);
	};
	setColorValueFromDefault = propertyName => {
		this[propertyName] = new Color(DrawingOptionsRunInput.defaultDrawingOptions[propertyName]);
		this.run.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${DrawingOptionsRunInput.defaultDrawingOptions[propertyName]}.`);
	};
	checkNumberNotZero = (variableValue, variableName) => {
		if (typeof variableValue !== "number") {
			this.run.throwError(`Property drawingOptions.${variableName} must be a number.`);
		} else if (variableValue === 0) {
			this.run.throwError(`Property drawingOptions.${variableName} cannot be 0.`);
		}
	};
}
