"use strict";

// Represents a location of one colored side of a piece.

class Slot {
	constructor(sticker) {
		this.content = sticker;
	};
	clone = () => {
		let clone = Object.create(this.constructor.prototype);
		Object.assign(clone, this);
		clone.content = this.content.clone();
		return clone;
	};
}
