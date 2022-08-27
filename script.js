"use strict";

const test = () => {
	alert("Attention ! Derrière toi !");
};

const runHoloCube = () => {
	if (checkJsonFormatting()) {
		let run = new Run(JSON.parse(document.querySelector("textarea#jsonInput").value));
		let runResult = run.run();
		showSvgResults(runResult.svgList);
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
	let inputContainerTag = document.querySelector("div#inputContainer");
	let textareaTag = document.querySelector("textarea#jsonInput");
	inputContainerTag.removeChild(textareaTag);
	let newTextAreaTag = document.createElement("textarea");
	inputContainerTag.appendChild(newTextAreaTag);
	newTextAreaTag.id = "jsonInput";
	newTextAreaTag.innerHTML =
		  '{\n'
		+ '    "puzzle": {\n'
		+ '        "fullName": "cube4x4x4",\n'
		+ '        "stage": "tralala"\n'
		+ '    },\n'
		+ '    "moveSequence": "Rw F",\n'
		+ '    "drawingOptions": {\n'
		+ '        "imageHeight": 100,\n'
		+ '        "view": "isometric"\n'
		+ '    },\n'
		+ '    "logger": {\n'
		+ '        "mode": "htmlTag",\n'
		+ '        "htmlTagSelector": "div#logs"\n'
		+ '    }\n'
		+ '}';
	checkJsonFormatting();
	newTextAreaTag.addEventListener("change", checkJsonFormatting);
};

const showSvgResults = svgList => {
	let svgResultsTag = document.querySelector("div#svgResults");
	for (let svg of svgList) {
		svgResultsTag.appendChild(svg);
	}
};
