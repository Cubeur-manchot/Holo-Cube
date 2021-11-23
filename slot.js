"use strict";

// Represents a location of one colored side of a piece
class Slot {
	constructor(sticker) {
		if (sticker) {
			this.content = sticker;
		} else {
			this.content = undefined;
		}
	};
	getContent = () => {
		return this.content;
	};
	setContent = sticker => {
		this.content = sticker;
	};
}
