"use strict";

const updateHtmlTagSelectorVisibility = value => {
	document.querySelector("div#htmlTagContainer").hidden = value !== "htmlTag";
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

const updateResults = () => { // update input object/json and Holo-Cube results
	// mandatory fields : puzzle and move sequence
	let puzzleSize = document.querySelector("input#puzzleSize").value;
	if (puzzleSize === "") { // input is incomplete, calling function should not update the view
		return;
	}
	let fullName = document.querySelector("select#puzzleShape").value.toLowerCase()
		+ puzzleSize + "x" + puzzleSize + "x" + puzzleSize;
	let jsonInput = {
		puzzle: {
			fullName: fullName
		},
		moveSequenceList: document.querySelector("textarea#moveSequences").value.split("\n")
	};
	// optional puzzle fields : color scheme
	let uColor = document.querySelector("input#colorSchemeUColor").value;
	let uOpacity = document.querySelector("input#colorSchemeUOpacity").value;
	let fColor = document.querySelector("input#colorSchemeFColor").value;
	let fOpacity = document.querySelector("input#colorSchemeFOpacity").value;
	let rColor = document.querySelector("input#colorSchemeRColor").value;
	let rOpacity = document.querySelector("input#colorSchemeROpacity").value;
	let dColor = document.querySelector("input#colorSchemeDColor").value;
	let dOpacity = document.querySelector("input#colorSchemeDOpacity").value;
	let bColor = document.querySelector("input#colorSchemeBColor").value;
	let bOpacity = document.querySelector("input#colorSchemeBOpacity").value;
	let lColor = document.querySelector("input#colorSchemeLColor").value;
	let lOpacity = document.querySelector("input#colorSchemeLOpacity").value;
	if (uColor !== "#ffffff" || uOpacity !== "1" || fColor !== "#00d800" || fOpacity !== "1" || rColor !== "#ff0000" || rOpacity !== "1"
		|| dColor !== "#ffff00" || dOpacity !== "1" || bColor !== "#0000ff" || bOpacity !== "1" || lColor !== "#ff7f00" || lOpacity !== "1") {
		jsonInput.puzzle.colorScheme = [];
		let colorAndOpacityPairs = [
			{color: uColor, opacity: uOpacity},
			{color: fColor, opacity: fOpacity},
			{color: rColor, opacity: rOpacity},
			{color: dColor, opacity: dOpacity},
			{color: bColor, opacity: bOpacity},
			{color: lColor, opacity: lOpacity},
		];
		for (let colorAndOpacity of colorAndOpacityPairs) {
			if (colorAndOpacity.opacity === "1") {
				jsonInput.puzzle.colorScheme.push(colorAndOpacity.color);
			} else {
				let color = new Color(colorAndOpacity.color);
				color.a = parseFloat(colorAndOpacity.opacity);
				jsonInput.puzzle.colorScheme.push(color.getRgba());
			}
		}
	}
	// drawing options
	let imageHeight = document.querySelector("input#imageHeight").value;
	let imageWidth = document.querySelector("input#imageWidth").value;
	let imageScale = document.querySelector("input#imageScale").value;
	let puzzleHeight = document.querySelector("input#puzzleHeight").value;
	let imageBackgroundColor = document.querySelector("input#imageBackgroundColor").value;
	let imageBackgroundOpacity = document.querySelector("input#imageBackgroundOpacity").value;
	let puzzleWidth = document.querySelector("input#puzzleWidth").value;
	let puzzleScale = document.querySelector("input#puzzleScale").value;
	let puzzleColor = document.querySelector("input#puzzleColor").value;
	let puzzleOpacity = document.querySelector("input#puzzleOpacity").value;
	if (imageHeight !== "" || imageWidth !== "" || imageScale !== "" || imageBackgroundOpacity !== "0"
		|| puzzleHeight !== "" || puzzleWidth !== "" || puzzleScale !== "" || puzzleColor !== "#000000" || puzzleOpacity !== "1") {
		jsonInput.drawingOptions = {};
		if (imageHeight !== "") {
			jsonInput.drawingOptions.imageHeight = parseFloat(imageHeight);
		}
		if (imageWidth !== "") {
			jsonInput.drawingOptions.imageWidth = parseFloat(imageWidth);
		}
		if (imageScale !== "") {
			jsonInput.drawingOptions.imageScale = parseFloat(imageScale);
		}
		if (imageBackgroundOpacity !== "0") {
			let color = new Color(imageBackgroundColor);
			color.a = parseFloat(imageBackgroundOpacity);
			if (imageBackgroundOpacity === "1") {
				jsonInput.drawingOptions.imageBackgroundColor = color.getRgbHex6();
			} else {
				jsonInput.drawingOptions.imageBackgroundColor = color.getRgba();
			}
		}
		if (puzzleHeight !== "") {
			jsonInput.drawingOptions.puzzleHeight = parseFloat(puzzleHeight);
		}
		if (puzzleWidth !== "") {
			jsonInput.drawingOptions.puzzleWidth = parseFloat(puzzleWidth);
		}
		if (puzzleScale !== "") {
			jsonInput.drawingOptions.puzzleScale = parseFloat(puzzleScale);
		}
		if (puzzleColor !== "#000000" || puzzleOpacity !== "1") {
			if (puzzleOpacity === "1") {
				jsonInput.drawingOptions.puzzleColor = puzzleColor;
			} else if (puzzleOpacity === "0") {
				jsonInput.drawingOptions.puzzleColor = "transparent";
			} else {
				let color = new Color(puzzleColor);
				color.a = puzzleOpacity;
				jsonInput.drawingOptions.puzzleColor = color.getRgba();
			}
		}
	}
	// logger options
	let loggerMode = document.querySelector("select#loggerMode").value;
	let verbosity = parseInt(document.querySelector("select#verbosity").value);
	if (loggerMode !== "console" || verbosity !== 1) {
		jsonInput.logger = {
			mode: loggerMode,
			verbosity: verbosity
		};
		if (loggerMode === "htmlTag") {
			jsonInput.logger.htmlTagSelector = document.querySelector("input#htmlTagSelector").value;
		}
	}
	let jsonInputString = JSON.stringify(jsonInput, null, 4);
	document.querySelector("pre#jsonInput").textContent = jsonInputString;
	document.querySelector("pre#javascriptObjectInput").textContent = jsonInputString.replace(/"(?=.*:)/g, "");
	// run Holo-Cube
	let svgResultsTag = document.querySelector("div#svgResults");
	svgResultsTag.textContent = "";
	document.querySelector("div#logs").textContent = "";
	let run = new Run(jsonInput);
	let runResults = run.run();
	for (let svg of runResults.svgList) {
		svgResultsTag.appendChild(svg);
	}
};
