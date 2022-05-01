"use strict";

// Represents a location of one colored side of a piece.

class Slot {
	constructor(sticker) {
		this.content = sticker;
	};
	getContent = () => {
		return this.content;
	};
	setContent = sticker => {
		this.content = sticker;
	};
}
