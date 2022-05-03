"use strict";

const checkJsonFormatting = () => {
	let textareaTag = document.querySelector("textarea#jsonInput");
	let buttonTag = document.querySelector("input[type=button]");
	try {
		JSON.parse(textareaTag.value);
		textareaTag.style.borderColor = "green";
		buttonTag.disabled = false;
		return true;
	} catch (exception) {
		let divLogs = document.querySelector("div#logs");
		let exceptionString = exception.toString().split("\n")[0];
		divLogs.innerHTML += `[${new Date().toTimeString().substring(0,8)}] Bad json formatting (${exceptionString}).<br/>`;
		divLogs.scrollTop = divLogs.scrollHeight;
		textareaTag.style.borderColor = "red";
		buttonTag.disabled = true;
		return false;
	}
};

const runHoloCube = () => {
	if (checkJsonFormatting()) {
		return new Run(JSON.parse(document.querySelector("textarea#jsonInput").value)).run();
	}
}
