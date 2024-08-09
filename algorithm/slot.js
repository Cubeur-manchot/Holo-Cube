"use strict";

// Represents a location of one colored side of a piece.

class Slot {
	constructor(sticker) {
		this.content = sticker;
	};
	clone() {
		return new Slot(this.content.clone());
	};
}
