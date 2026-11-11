import hljs from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/es/core.min.js";
import javascriptLanguage from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/es/languages/javascript.min.js";
import xmlLanguage from "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.12.0/es/languages/xml.min.js";

hljs.registerLanguage("javascript", javascriptLanguage);
hljs.registerLanguage("xml", xmlLanguage); // used for HTML

const createCodeBlock = () => {
	const codeBlock = document.createElement("div");
	codeBlock.className = "code-block";
	return codeBlock;
};

const createCopyButton = () => {
	const button = document.createElement("button");
	button.type = "button";
	button.className = "copy-button";
	button.dataset.tooltipCopy = "Copy to clipboard";
	button.dataset.tooltipSuccess = "Copied";
	button.dataset.tooltipFailed = "An error occurred";
	button.addEventListener("click", async event => {
		const button = event.currentTarget;
		resetButtonFeedback(button);
		try {
			await navigator.clipboard.writeText(button.parentElement.querySelector("code").textContent);
			button.classList.add("success");
		} catch (error) {
			console.error("Failed to copy text to clipboard: ", error);
			button.classList.add("failed");
		}
		button.timeout = setTimeout(() => resetButtonFeedback(button), resetDelay);
	});
	return button;
};

const resetButtonFeedback = button => {
	clearTimeout(button.timeout);
	button.classList = ["copy-button"];
}

const resetDelay = 2000;

document.querySelectorAll("pre:has(code)").forEach(pre => {
	const codeBlock = createCodeBlock();
	pre.before(codeBlock);
	codeBlock.appendChild(pre);
	const button = createCopyButton();
	codeBlock.appendChild(button);
});

hljs.highlightAll();
