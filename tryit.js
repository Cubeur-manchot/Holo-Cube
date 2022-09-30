"use strict";

const updateHtmlTagSelectorVisibility = value => {
	document.querySelector("div#htmlTagContainer").hidden = value !== "htmlTag";
};

const buildJsonInput = () => {
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
		moveSequences: document.querySelector("textarea#moveSequences").value.split("\n")
	};
	// optional puzzle fields : color scheme
	let uColor = document.querySelector("input#colorSchemeUColor").value;
	let fColor = document.querySelector("input#colorSchemeFColor").value;
	let rColor = document.querySelector("input#colorSchemeRColor").value;
	let dColor = document.querySelector("input#colorSchemeDColor").value;
	let bColor = document.querySelector("input#colorSchemeBColor").value;
	let lColor = document.querySelector("input#colorSchemeLColor").value;
	if (uColor !== "#ffffff" || fColor !== "#00d800" || rColor !== "#ff0000" || dColor !== "#ffff00" || bColor !== "#0000ff" || lColor !== "#ff7f00") {
		jsonInput.puzzle.colorScheme = [uColor, fColor, rColor, dColor, bColor, lColor];
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
			jsonInput.drawingOptions.imageBackgroundColor = color.getRgba();
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
	console.log(jsonInputString);
	document.querySelector("pre#jsonInput").textContent = jsonInputString;
	document.querySelector("pre#javascriptObjectInput").textContent = jsonInputString.replace(/"(?=.*:)/g, "");
};
