"use strict";

// Represents the state of one type of pieces.

class Orbit {
	static type = "unknown";
	static slotsCountPerColor = null;
	static getType = orbit => orbit.constructor.type;
	static buildSlotList(colorScheme, mask) {
		let orbitType = this.type;
		let slotsCountPerColor = this.slotsCountPerColor;
		let matchingOrbitMask = mask.find(orbitMask => orbitMask.orbitType === orbitType);
		let slotList = [];
		if (matchingOrbitMask) {
			for (let colorIndex in colorScheme) {
				for (let slotIndexForColor = 0; slotIndexForColor < slotsCountPerColor; slotIndexForColor++) {
					slotList.push(new Slot(new Sticker(
						matchingOrbitMask.stickers[colorIndex * slotsCountPerColor + slotIndexForColor]
							? colorScheme[colorIndex]
							: Color.blank
					)));
				}
			}
		} else {
			for (let color of colorScheme) {
				for (let slotIndexForColor = 0; slotIndexForColor < slotsCountPerColor; slotIndexForColor++) {
					slotList.push(new Slot(new Sticker(color)));
				}
			}
		}
		return slotList;
	};
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Orbit.");
		this.slotList = undefined;
	};
	clone() {
		this.runner.logger.debugLog(`Cloning orbit of type ${Orbit.getType(this)}.`);
		let clone = Object.create(this.constructor.prototype);
		Object.assign(clone, this);
		clone.slotList = this.slotList.map(slot => slot.clone());
		return clone;
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
	static slotsCountPerColor = 1;
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CenterCubeOrbit.");
		this.slotList = this.constructor.buildSlotList(colorScheme, mask);
	};
}

class CornerCubeOrbit extends CubeOrbit {
	static type = "cornerCubeOrbit";
	static slotsCountPerColor = 4;
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CornerCubeOrbit.");
		this.slotList = this.constructor.buildSlotList(colorScheme, mask);
	};
}

class MidgeCubeOrbit extends CubeOrbit {
	static type = "midgeCubeOrbit";
	static slotsCountPerColor = 4;
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new MidgeCubeOrbit.");
		this.slotList = this.constructor.buildSlotList(colorScheme, mask);
	};
}

class WingCubeOrbit extends CubeOrbit {
	static type = "wingCubeOrbit";
	static slotsCountPerColor = 8;
	constructor(runner, rank, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog(`Creating new WingCubeOrbit (rank = ${rank}).`);
		this.rank = rank;
		this.slotList = this.constructor.buildSlotList(colorScheme, mask);
	};
}

class CenterBigCubeOrbit extends CubeOrbit {
	static type = "centerBigCubeOrbit";
	static slotsCountPerColor = 4;
	constructor(runner, ranks, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog(`Creating new CenterBigCubeOrbit (ranks = [${ranks.join(", ")}]).`);
		this.ranks = ranks;
		this.slotList = this.constructor.buildSlotList(colorScheme, mask);
	};
}
