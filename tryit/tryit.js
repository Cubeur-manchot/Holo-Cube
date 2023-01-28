"use strict";

const defaultColorScheme = [
	{face: "U", color: "white"},
	{face: "F", color: "green"},
	{face: "R", color: "red"},
	{face: "D", color: "blue"},
	{face: "B", color: "orange"},
	{face: "L", color: "yellow"}
];

const defaultColorScheme2 = {
	U: "white",
	F: "green",
	R: "red",
	D: "yellow",
	B: "blue",
	L: "orange"
};

const createColorPickers = () => {
	let colorPickerPlaceholders = document.querySelectorAll("div.colorPicker");
	for (let colorPickerPlaceholder of colorPickerPlaceholders) {
		let face = colorPickerPlaceholder.getAttribute("data-face");
		let parentNode = colorPickerPlaceholder.parentNode;
		let colorPickerId = colorPickerPlaceholder.getAttribute("data-colorPickerId");
		let hexColor = new Color(face ? defaultColorScheme2[face] : colorPickerPlaceholder.getAttribute("data-color")).getRgbHex();
		Pickr.create({
			el: `div.colorPicker[data-colorPickerId=${colorPickerId}`,
			theme: 'classic',
			default: hexColor,
			swatches: Object.keys(ColorCollection).map(colorName => new Color(colorName).getRgbHex()),
			components: {
				preview: true,
				opacity: true,
				hue: true,
				interaction: {
					hex: true,
					rgba: true,
					hsla: false,
					hsva: false,
					cmyk: false,
					input: true,
					clear: false,
					save: true
				}
			}
		}).on('save', (color, instance) => {
			let colorHexa = color.toHEXA();
			let colorPickerId = instance.options.el.getAttribute("data-colorPickerId");
			let colorPicker = document.querySelector(`div.pickr[data-colorPickerId=${colorPickerId}`);
			applyColorToColorPicker("#"
				+ colorHexa[0]
				+ colorHexa[1]
				+ colorHexa[2]
				+ (Utils.isString(colorHexa[3]) ? colorHexa[3] : ""),
				colorPicker);
			updateResults();
		}).on("init", () => {
			let colorPicker = parentNode.querySelector("div.pickr:not([data-colorPickerId])");
			colorPicker.setAttribute("data-colorPickerId", colorPickerPlaceholder.getAttribute("data-colorPickerId"));
			if (face !== null) {
				colorPicker.querySelector("button.pcr-button").setAttribute("data-face", face);
			}
			applyColorToColorPicker(hexColor, colorPicker);
			if (document.querySelectorAll("div.pickr[data-colorPickerId][data-color]").length === colorPickerPlaceholders.length) {
				updateResults();
			}
		});
	}
};

const applyColorToColorPicker = (hexColor, colorPicker) => {
	let color = new Color(hexColor);
	colorPicker.setAttribute("data-color", hexColor);
	let fontColor = ((color.r * 0.299 + color.g * 0.587 + color.b * 0.114) * color.a + 255 * (1 - color.a) > 186)
		? "black"
		: "white";
	colorPicker.setAttribute("data-fontColor", fontColor);
	colorPicker.querySelector("button.pcr-button").setAttribute("data-fontColor", fontColor);
};

const getColorForInput = (colorRgbHex6, opacityString) => {
	if (opacityString === "0") {
		return "transparent";
	} else if (opacityString === "1") {
		return Color.getKnownColorString(colorRgbHex6) ?? colorRgbHex6;
	} else {
		let color = new Color(colorRgbHex6);
		color.a = parseFloat(opacityString);
		return color.getRgba();
	}
};

const updateResults = () => { // update code and Holo-Cube results
	let runnerCodeContainer = document.querySelector("pre#runnerCode code");
	let runnerErrorsContainer = document.querySelector("pre#runnerErrorsContainer code");
	let executionCodeContainer = document.querySelector("pre#execution code");
	let svgResultsContainer = document.querySelector("div#svgResultsContainer");
	let outputContainer = document.querySelector("pre#output code");
	let logsContainer = document.querySelector("pre#logs code");
	// empty old results
	runnerCodeContainer.textContent = "";
	runnerErrorsContainer.textContent = "";
	executionCodeContainer.textContent = "";
	svgResultsContainer.textContent = "";
	outputContainer.textContent = "";
	logsContainer.textContent = "";
	// Puzzle section, mandatory
	let puzzleSize = document.querySelector("input#puzzleSize").value;
	if (puzzleSize === "") { // input is incomplete, calling function should not update the view
		return;
	}
	let puzzle = {
		fullName: document.querySelector("select#puzzleShape").value.toLowerCase()
		+ puzzleSize + "x" + puzzleSize + "x" + puzzleSize
	};
	// Puzzle color scheme, optional
	let colorScheme = [];
	for (let face in defaultColorScheme2) {
		let color = document.querySelector(`div.pickr[data-colorPickerId=colorScheme${face}Face]`).getAttribute("data-color");
		colorScheme.push(getColorFieldDefault(color, defaultColorScheme2[face])
			?? defaultColorScheme2[face]);
	}
	if (Object.values(defaultColorScheme2).map((color, index) => colorScheme[index] === color).includes(false)) {
		puzzle.colorScheme = colorScheme;
	}
	// Create input
	let input = {
		puzzle: puzzle
	};
	// Drawing options section, optional
	let drawingOptions = {};
	let drawingOptionsProperties = [
		{name: "imageHeight", type: "number"},
		{name: "imageWidth", type: "number"},
		{name: "imageScale", type: "number"},
		{name: "imageBackgroundColor", type: "color"},
		{name: "puzzleHeight", type: "number"},
		{name: "puzzleWidth", type: "number"},
		{name: "puzzleScale", type: "number"},
		{name: "puzzleColor", type: "color"}
	];
	for (let property of drawingOptionsProperties) {
		let fieldValueNotDefault;
		switch (property.type) {
			case "number":
				fieldValueNotDefault = getNumericFieldDefault(
					document.querySelector(`input#${property.name}`).value,
					DrawingOptionsRunnerInput.defaultDrawingOptions[property.name]
				);
				break;
			case "color":
				fieldValueNotDefault = getColorFieldDefault(
					document.querySelector(`div.pickr[data-colorPickerId=${property.name}]`).getAttribute("data-color"),
					DrawingOptionsRunnerInput.defaultDrawingOptions[property.name]
				);
		}
		if (fieldValueNotDefault) { // append the property only if value is different from default value
			drawingOptions[property.name] = fieldValueNotDefault;
		}
	}
	if (Object.keys(drawingOptions).length !== 0) { // append drawing options if at least one field is non-default
		input.drawingOptions = drawingOptions;
	}
	// Logger section, optional
	let logger = {};
	let loggerMode = getStringFieldDefault(
		document.querySelector("select#loggerMode").value,
		Logger.defaultOptions.mode
	);
	if (loggerMode) {
		logger.mode = loggerMode;
		if (loggerMode === Logger.htmlTagLoggerMode) {
			logger.htmlTagSelector = document.querySelector("input#htmlTagSelector").value;
		}
	}
	let verbosity = getNumericFieldDefault(
		document.querySelector("select#verbosity").value,
		Logger.defaultOptions.verbosityLevel
	);
	if (verbosity !== null) {
		logger.verbosity = verbosity;
	}
	let inOutput = getBooleanFieldDefault(
		document.querySelector("select#inOutput").value,
		Logger.defaultOptions.inOutput
	)
	if (inOutput !== null) {
		logger.inOutput = inOutput;
	}
	if (Object.keys(logger).length !== 0) { // append logger if at least one field is non-default
		input.logger = logger;
	}
	// write runner code
	runnerCodeContainer.textContent = `let runner = new Runner(${JSON.stringify(input, null, 4).replace(/"(?=.*:)/g, "")});`;
	// instanciate the runner
	let runner;
	try {
		runner = new Runner(input);
	} catch (exception) {
		runnerErrorsContainer.textContent = exception;
		hljs.highlightAll();
		return;
	}
	// move sequences
	let moveSequences = document.querySelector("textarea#moveSequences").value.split("\n");
	// write execution code
	executionCodeContainer.textContent =
		moveSequences.length === 1
			? `let result = runner.run("${moveSequences[0]}");`
			: `let result = runner.run([\n    "${moveSequences.join('",\n    "')}"\n);`;
	// execute Holo-Cube
	let result;
	try {
		result = runner.run(moveSequences.length === 1 ? moveSequences[0] : moveSequences);
	} catch (exception) {
		console.error(exception);
		hljs.highlightAll();
		return;
	}
	// append SVG results
	if (moveSequences.length === 1) {
		appendSvgResult(result, svgResultsContainer);
	} else {
		for (let individualResult of result.results) {
			appendSvgResult(individualResult, svgResultsContainer);
		}
	}
	// write output
	outputContainer.textContent =
		JSON.stringify(result, null, 4)
		.replace(/(?<!".*".*)"(?=.*:)/g, "")
		.replace(/(?<=svg: ){}/g, "{svg object (see \"SVG results\" section)}");
	// write logs
	if (runner.logger.inOutput) {
		logsContainer.textContent = result.logs.all;
	}
	// highlight the code
	hljs.highlightAll();
};

const appendSvgResult = (result, svgResultsContainer) => {
	if (result.status === Runner.successStatus) {
		svgResultsContainer.appendChild(result.svg);
	} else {
		let svgNotAvailableTag = document.createElement("div");
		svgNotAvailableTag.classList.add("svgNotAvailable");
		svgResultsContainer.appendChild(svgNotAvailableTag);
	}
};

const getStringFieldDefault = (value, defaultValue) => {
	return value === defaultValue ? null : value;
};

const getNumericFieldDefault = (value, defaultValue) => {
	if (value === "") {
		return null;
	}
	let floatValue = parseFloat(value);
	return floatValue === defaultValue ? null : floatValue;
};

const getBooleanFieldDefault = (value, defaultValue) => {
	let booleanValue;
	switch (value) {
		case "true":
				booleanValue = true;
				break;
		case "false":
			booleanValue = false;
			break;
	}
	return booleanValue === defaultValue ? null : booleanValue;
};

const getColorFieldDefault = (value, defaultValue) => {
	let colorValue = new Color(value);
	let colorDefaultValue = new Color(defaultValue);
	if (colorValue.getRgbHex() === colorDefaultValue.getRgbHex()) { // same non-transparent
		return null;
	}
	if (colorValue.getAlpha() === 0 && colorDefaultValue.getAlpha() === 0) { // same transparent
		return null;
	}
	return colorValue.getAlpha() === 0 ? "transparent" : value;
};
