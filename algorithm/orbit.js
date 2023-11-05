"use strict";

// Represents the state of one type of pieces.

class Orbit {
	static type = "unknown";
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Orbit.");
		this.slotList = undefined;
	};
	getSize = () => {
		return this.slotList?.length ?? null;
	};
	getType = () => {
		return this.constructor.type;
	};
	clone = () => {
		this.runner.logger.debugLog(`Cloning orbit of type ${this.getType()}.`);
		let clone = Object.create(this.constructor.prototype);
		Object.assign(clone, this);
		clone.slotList = this.slotList.map(slot => slot.clone());
		return clone;
	};
	buildSlotList(slotsPerColor, colorScheme, mask) {
		let matchingOrbitMask = mask.find(orbitMask => orbitMask.orbitType === this.getType());
		let slotList = [];
		if (matchingOrbitMask) {
			for (let colorIndex in colorScheme) {
				for (let slotIndexForColor = 0; slotIndexForColor < slotsPerColor; slotIndexForColor++) {
					slotList.push(new Slot(new Sticker(
						matchingOrbitMask.stickers[colorIndex * slotsPerColor + slotIndexForColor]
							? colorScheme[colorIndex]
							: Color.blank
					)));
				}
			}
		} else {
			for (let color of colorScheme) {
				for (let slotIndexForColor = 0; slotIndexForColor < slotsPerColor; slotIndexForColor++) {
					slotList.push(new Slot(new Sticker(color)));
				}
			}
		}
		return slotList;
	};
}

class CubeOrbit extends Orbit {
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new CubeOrbit.");
	};
}

class CenterCubeOrbit extends CubeOrbit {
	static type = "centerCubeOrbit";
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CenterCubeOrbit.");
		this.slotList = this.buildSlotList(1, colorScheme, mask);
	};
}

class CornerCubeOrbit extends CubeOrbit {
	static type = "cornerCubeOrbit";
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CornerCubeOrbit.");
		this.slotList = this.buildSlotList(4, colorScheme, mask);
	};
}

class MidgeCubeOrbit extends CubeOrbit {
	static type = "midgeCubeOrbit";
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new MidgeCubeOrbit.");
		this.slotList = this.buildSlotList(4, colorScheme, mask);
	};
}

class WingCubeOrbit extends CubeOrbit {
	static type = "wingCubeOrbit";
	constructor(runner, rank, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog(`Creating new WingCubeOrbit (rank = ${rank}).`);
		this.rank = rank;
		this.slotList = this.buildSlotList(8, colorScheme, mask);
	};
}

class CenterBigCubeOrbit extends CubeOrbit {
	static type = "centerBigCubeOrbit";
	constructor(runner, ranks, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog(`Creating new CenterBigCubeOrbit (ranks = [${ranks.join(", ")}]).`);
		this.ranks = ranks;
		this.slotList = this.buildSlotList(4, colorScheme, mask);
	};
}
