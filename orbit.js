"use strict";

// Represents the state of one type of pieces
class Orbit {
	constructor(slots, type) {
		if (!slots) {
			throw "Error : Initializing Orbit with no content.";
		}
		if (!slots.length) {
			throw "Error : Initializing Orbit with empty slot list.";
		}
		this.slotList = slots;
		this.type = type;
	};
	getType = () => {
		return this.type;
	};
	getSlotList = () => {
		return this.slotList;
	};
	getSize = () => {
		return this.getSlotList()?.length ?? 0;
	};
}
