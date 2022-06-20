"use strict";

const test = () => {
	let svg = SVG.createSvgRootNode(100, 100);
	let rect = SVG.createRectNode(-50, -50, 100, 100, new Color("black"), 10, "rectangle");
	svg.appendChild(rect);
	document.querySelector("div#svgResults").appendChild(svg);
};

const runHoloCube = () => {
	if (checkJsonFormatting()) {
		let run = new Run(JSON.parse(document.querySelector("textarea#jsonInput").value));
		let svgList = run.run();
		showSvgResults(svgList);
	}
};

const checkJsonFormatting = () => {
	let textareaTag = document.querySelector("textarea#jsonInput");
	try {
		JSON.parse(textareaTag.value);
		inputIsOk(textareaTag);
		return true;
	} catch (exception) {
		inputIsKo(textareaTag, exception);
		return false;
	}
};

const inputIsOk = textareaTag => {
	let applyButtonTag = document.querySelector("input[type=button]#apply");
	textareaTag.style.borderColor = "green";
	applyButtonTag.disabled = false;
};

const inputIsKo = (textareaTag, exception) => {
	let applyButtonTag = document.querySelector("input[type=button]#apply");
	let divLogs = document.querySelector("div#logs");
	divLogs.innerHTML += `[${new Date().toTimeString().substring(0,8)}] Bad json formatting (${exception.toString().split("\n")[0]}).<br/>`;
	divLogs.scrollTop = divLogs.scrollHeight;
	textareaTag.style.borderColor = "red";
	applyButtonTag.disabled = true;
};

const prefillWithExample = () => {
	let textareaTag = document.querySelector("textarea#jsonInput");
	textareaTag.innerHTML = '{\n    "puzzle": {\n        "fullName": "cube3x3x3"\n    },\n    "moveSequence": "R U R\' U\'"\n}';
	inputIsOk(textareaTag);
};

const showSvgResults = svgList => {
	let svgResultsTag = document.querySelector("div#svgResults");
	for (let svg of svgList) {
		svgResultsTag.appendChild(svg);
	}
};
