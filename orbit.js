"use strict";

// Represents the state of one type of pieces.

class Orbit {
	static type = "unknown";
	constructor(run) {
		this.run = run;
		this.run.logger.debugLog("Creating new Orbit.");
		this.slotList = undefined;
		this.type = Orbit.type;
	};
	getSize = () => {
		return this.slotList?.length ?? null;
	};
	buildSlotList(slotsPerColor) {
		let slotList = [];
		for (let color of this.run.puzzle.colorScheme) {
			for (let slotIndexForColor = 0; slotIndexForColor < slotsPerColor; slotIndexForColor++) {
				slotList.push(new Slot(new Sticker(color)));
			}
		}
		return slotList;
	};
}

class CubeOrbit extends Orbit {
	constructor (run) {
		super(run);
		this.run.logger.debugLog("Creating new CubeOrbit.");
	};
}

class CenterCubeOrbit extends CubeOrbit {
	static type = "centerCubeOrbit";
	constructor(run) {
		super(run);
		this.run.logger.detailedLog("Creating new CenterCubeOrbit.");
		this.slotList = this.buildSlotList(1);
		this.type = CenterCubeOrbit.type;
	};
}

class CornerCubeOrbit extends CubeOrbit {
	static type = "cornerCubeOrbit";
	constructor(run) {
		super(run);
		this.run.logger.detailedLog("Creating new CornerCubeOrbit.");
		this.slotList = this.buildSlotList(4);
		this.type = CornerCubeOrbit.type;
	};
}

class MidgeCubeOrbit extends CubeOrbit {
	static type = "midgeCubeOrbit";
	constructor(run) {
		super(run);
		this.run.logger.detailedLog("Creating new MidgeCubeOrbit.");
		this.slotList = this.buildSlotList(4);
		this.type = MidgeCubeOrbit.type;
	};
}

class WingCubeOrbit extends CubeOrbit {
	static type = "wingCubeOrbit";
	constructor(run, rank) {
		super(run);
		this.run.logger.detailedLog(`Creating new WingCubeOrbit (rank = ${rank}).`);
		this.slotList = this.buildSlotList(8);
		this.rank = rank;
		this.type = WingCubeOrbit.type;
	};
}

class CenterBigCubeOrbit extends CubeOrbit {
	static type = "centerBigCubeOrbit";
	constructor(run, ranks) {
		super(run);
		this.run.logger.detailedLog(`Creating new CenterBigCubeOrbit (ranks = [${ranks.join(", ")}]).`);
		this.slotList = this.buildSlotList(4);
		this.ranks = ranks;
		this.type = CenterBigCubeOrbit.type;
	};
}
