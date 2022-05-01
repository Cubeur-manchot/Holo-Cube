"use strict";

// Represents the information of a color, including opacity.

class Color {
	constructor(colorString) { // todo
		
	};
	checkFormat = colorString => {
		return isHex6(colorString)
			|| isHex3(colorString)
			|| isRgb(colorString)
			|| isRgba(colorString)
			|| isKnownColor(colorString);
	};
	isHex6 = colorString => {
		return /^#[0-9a-f]{6}$/i.test(colorString);
	};
	isHex3 = colorString => {
		return /^#[0-9a-f]{3}$/i.test(colorString);
	};
	isRgb = colorString => {
		if(!/^rgb\( *\d+ *, *\d+ *, *\d+ *\)$/.test(colorString)) {
			return false;
		}
		for (let rgbValue of colorString.match(/\d+/)) {
			if (parseInt(rgbValue) > 255) {
				return false;
			}
		}
		return true;
	};
	isRgba = colorString => {
		if(!/^rgb\( *\d+ *, *\d+ *, *\d+ *, *([0-1]\.?|0?\.\d+)\) *\)$/.test(colorString)) {
			return false;
		}
		let rgbaValues = colorString.replace(/ /g, "").replace(/^.*\(/, "").replace(")", "").split(",");
		for (let rgbIndex of [0, 1, 2]) {
			if (parseInt(rgbValues[rgbIndex]) > 255) {
				return false;
			}
		}
		return true;
	};
	isKnownColor = colorString => { // todo include more colors
		return ["black", "white", "green", "red", "yellow", "orange", "blue", "transparent"].includes(colorString);
	};
}
