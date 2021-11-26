"use strict";

// Represents the state of one type of pieces
class Orbit {
	constructor() {
		this.slotList = undefined;
		this.type = "unknown";
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

class CubeOrbit extends Orbit {
	constructor () {
		super();
	};
}

class CornerCubeOrbit extends CubeOrbit {

}

class EdgeCubeOrbit extends CubeOrbit {
	constructor(slots, type, position) {
		if (!position || typeof position !== "number") {
			throw "Error : Initializing CubeOrbit with bad position format.";
		}
		super(slots, type);
		this.position = position;
	};
	getPosition = () => {
		return this.position;
	};
}

class CenterCubeOrbit extends CubeOrbit {
	constructor(colorScheme) {
		super();
		this.slotList = [];
		for (let color of colorScheme) {
			this.slotList.push(new Slot(new Sticker(color)));
		}
		this.type = "centerCubeOrbit";
	};
}

class CenterBigCubeOrbit extends CubeOrbit {
	constructor(slots, type, position) {
		if (!position || position.length !== 2) {
			throw "Error : Initializing CubeOrbit with bad position format.";
		}
		super(slots, type);
		this.position = {x: position[0], y: position[1]};
	};
	getPosition = () => {
		return this.position;
	};
}
