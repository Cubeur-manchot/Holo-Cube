"use strict";

// Represents the information on one colored side of one piece.

class Sticker {
	constructor(color) {
		this.color = color;
	};
	clone() {
		return new Sticker(this.color);
	};
}
