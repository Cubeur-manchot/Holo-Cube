"use strict";

// Defines all known colors.

class ColorCollection {
	static transparent = {r: 0, g: 0, b: 0, a: 0};
	static white = {r: 255, g: 255, b: 255, a: 1};
	static black = {r: 0, g: 0, b: 0, a: 1};
	static green = {r: 0, g: 216, b: 0, a: 1};
	static red = {r: 255, g: 0, b: 0, a: 1};
	static yellow = {r: 255, g: 255, b: 0, a: 1};
	static orange = {r: 255, g: 127, b: 0, a: 1};
	static blue = {r: 0, g: 0, b: 255, a: 1};
	static grey = {r: 153, g: 153, b: 153};
	static lightGreen = {r: 119, g: 238, b: 0};
	static purple = {r: 136, g: 17, b: 255};
	static lightYellow = {r: 255, g: 255, b: 187};
	static lightBlue = {r: 136, g: 221, b: 255};
	static brown = {r: 255, g: 136, b: 51};
	static pink = {r: 255, g: 153, b: 255};
}

// Represents the information of a color, including opacity.

class Color {
	constructor(colorString) {
		if (Color.isHex6(colorString)) {
			this.r = parseInt(colorString.substr(1, 2), 16);
			this.g = parseInt(colorString.substr(3, 2), 16);
			this.b = parseInt(colorString.substr(5, 2), 16);
			this.a = 1;
		} else if (Color.isHex3(colorString)) {
			this.r = 17 * parseInt(colorString[1]);
			this.g = 17 * parseInt(colorString[2]);
			this.b = 17 * parseInt(colorString[3]);
			this.a = 1;
		} else if (Color.isRgb(colorString)) {
			[this.r, this.g, this.b] = colorString.match(/\d+/g);
			this.a = 1;
		} else if (Color.isRgba(colorString)) {
			let numbers = colorString.replace(/^.*\(/g, "").replace(/\).*$/g, "").replace(/\s+/g, "").split(",");
			this.r = parseInt(numbers[0]);
			this.g = parseInt(numbers[1]);
			this.b = parseInt(numbers[2]);
			this.a = parseFloat(numbers[3]);
		} else if (Color.isKnownColor(colorString)) {
			Object.assign(this, Color.getKnownColor(colorString));
		}
	};
	static checkFormat = colorString => {
		return Color.isHex6(colorString)
			|| Color.isHex3(colorString)
			|| Color.isRgb(colorString)
			|| Color.isRgba(colorString)
			|| Color.isKnownColor(colorString);
	};
	static isHex6 = colorString => {
		return /^#[0-9a-f]{6}$/i.test(colorString);
	};
	static isHex3 = colorString => {
		return /^#[0-9a-f]{3}$/i.test(colorString);
	};
	static isRgb = colorString => {
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
	static isRgba = colorString => {
		if(!/^rgba\( *\d+ *, *\d+ *, *\d+ *, *([0-1]|0?\.\d+) *\)$/.test(colorString)) {
			return false;
		}
		let rgbValues = colorString.replace(/ /g, "").replace(/^.*\(/, "").replace(")", "").split(",");
		for (let rgbIndex of [0, 1, 2]) {
			if (parseInt(rgbValues[rgbIndex]) > 255) {
				return false;
			}
		}
		return true;
	};
	static knownColors = {
		transparent: ColorCollection.transparent,  t: ColorCollection.transparent,
		black:       ColorCollection.black,       bl: ColorCollection.black,
		white:       ColorCollection.white,        w: ColorCollection.white,
		green:       ColorCollection.green,        g: ColorCollection.green,
		red:         ColorCollection.red,          r: ColorCollection.red,
		yellow:      ColorCollection.yellow,       y: ColorCollection.yellow,
		blue:        ColorCollection.blue,         b: ColorCollection.blue,
		orange:      ColorCollection.orange,       o: ColorCollection.orange,
		purple:      ColorCollection.purple,      pu: ColorCollection.purple,
		grey:        ColorCollection.grey,        gy: ColorCollection.grey,
		lightGreen:  ColorCollection.lightGreen,  lg: ColorCollection.lightGreen,
		lightYellow: ColorCollection.lightYellow, ly: ColorCollection.lightYellow,
		lightBlue:   ColorCollection.lightBlue,   lb: ColorCollection.lightBlue,
		brown:       ColorCollection.brown,       br: ColorCollection.brown,
		pink:        ColorCollection.pink,        pi: ColorCollection.pink,
	};
	static isKnownColor = colorString => {
		return Color.knownColors[colorString] !== undefined;
	};
	static getKnownColorString = color => {
		for (let knownColorName in Color.knownColors) {
			let knownColor = Color.knownColors[knownColorName];
			if (color.r === knownColor.r && color.g === knownColor.g && color.b === knownColor.b) {
				return knownColorName;
			}
		}
		return null;
	};
	static getKnownColor = colorString => {
		return Color.knownColors[colorString];
	};
	getRgbHex6 = () => {
		return "#"
			+ (this.r <= 16 ? "0" : "") + this.r.toString(16)
			+ (this.g <= 16 ? "0" : "") + this.g.toString(16)
			+ (this.b <= 16 ? "0" : "") + this.b.toString(16);
	};
	getAlpha = () => {
		return this.a;
	};
	getRgba = () => {
		return `rgba(${this.r ?? 0}, ${this.g ?? 0}, ${this.b ?? 0}, ${this.a ?? 0})`;
	};
}