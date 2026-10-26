"use strict";

const loadScript = async url => new Promise((resolve, reject) => {
	const script = document.createElement("script");
	script.src = url;
	script.onload = resolve;
	script.onerror = () => reject(new Error(`Failed to load script "${url}".`));
	document.head.appendChild(script);
});

const loadHoloCubeAlgorithm = async () => {
	if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
		const scriptUrls = [
			"../algorithm/color.js",
			"../algorithm/cycle.js",
			"../algorithm/drawer.js",
			"../algorithm/logger.js",
			"../algorithm/move.js",
			"../algorithm/moveParser.js",
			"../algorithm/orbit.js",
			"../algorithm/puzzle.js",
			"../algorithm/runner.js",
			"../algorithm/slot.js",
			"../algorithm/sticker.js",
			"../algorithm/utils.js"
		];
		for (const scriptUrl of scriptUrls) {
			await loadScript(scriptUrl);
		}
	} else {
		await loadScript("https://cubeur-manchot.github.io/Holo-Cube/bundles/holo-cube-algorithm.classic.js");
	}
};

loadHoloCubeAlgorithm();