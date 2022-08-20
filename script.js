"use strict";

const test = () => {
	alert("Prout.");
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
	textareaTag.innerHTML = '{\n    "puzzle": {\n        "fullName": "cube4x4x4"\n    },\n    "moveSequence": "Fw"\n,    "verbosity": 1\n}';
	inputIsOk(textareaTag);
};

const showSvgResults = svgList => {
	let svgResultsTag = document.querySelector("div#svgResults");
	for (let svg of svgList) {
		svgResultsTag.appendChild(svg);
	}
};
