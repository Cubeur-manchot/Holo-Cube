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
	static buildSlotList(colorScheme, slotsPerColor) {
		let slotList = [];
		for (let color of colorScheme) {
			for (let slotIndexForColor = 0; slotIndexForColor < slotsPerColor; slotIndexForColor++) {
				slotList.push(new Slot(new Sticker(color)));
			}
		}
		return slotList;
	};
}

class CubeOrbit extends Orbit {
	constructor () {
		super();
	};
}

class CenterCubeOrbit extends CubeOrbit {
	constructor(colorScheme) {
		super();
		this.slotList = Orbit.buildSlotList(colorScheme, 1);
		this.type = "centerCubeOrbit";
	};
}

class CornerCubeOrbit extends CubeOrbit {
	constructor(colorScheme) {
		super();
		this.slotList = Orbit.buildSlotList(colorScheme, 4);
		this.type = "cornerCubeOrbit";
	};
}

class MidgeCubeOrbit extends CubeOrbit {
	constructor(colorScheme) {
		super();
		this.slotList = Orbit.buildSlotList(colorScheme, 4);
		this.type = "midgeCubeOrbit";
	};
}

class WingCubeOrbit extends CubeOrbit {
	constructor(colorScheme, rank) {
		super();
		this.slotList = Orbit.buildSlotList(colorScheme, 8);
		this.rank = rank;
		this.type = "wingCubeOrbit";
	};
	getRank = () => {
		return this.rank;
	};
}

class CenterBigCubeOrbit extends CubeOrbit {
	constructor(colorScheme, ranks) {
		if (ranks.length !== 2) {
			throw "Error : Initializing CenterBigCubeOrbit with erroneous ranks format.";
		}
		super();
		this.slotList = Orbit.buildSlotList(colorScheme, 4);
		this.ranks = ranks;
	};
	getRanks = () => {
		return this.ranks;
	};
}
