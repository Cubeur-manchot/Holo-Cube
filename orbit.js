"use strict";

// Represents the state of one type of pieces.

class Orbit {
	constructor(run) {
		this.run = run;
		this.run.log("Creating new Orbit.", 3);
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
	static type = "unknown";
}

class CubeOrbit extends Orbit {
	constructor (run) {
		super(run);
		this.run.log("Creating new CubeOrbit.", 3);
	};
}

class CenterCubeOrbit extends CubeOrbit {
	constructor(run) {
		super(run);
		this.run.log("Creating new CenterCubeOrbit.", 2);
		this.slotList = this.buildSlotList(1);
		this.type = CenterCubeOrbit.type;
	};
	static type = "centerCubeOrbit";
}

class CornerCubeOrbit extends CubeOrbit {
	constructor(run) {
		super(run);
		this.run.log("Creating new CornerCubeOrbit.", 2);
		this.slotList = this.buildSlotList(4);
		this.type = CornerCubeOrbit.type;
	};
	static type = "cornerCubeOrbit";
}

class MidgeCubeOrbit extends CubeOrbit {
	constructor(run) {
		super(run);
		this.run.log("Creating new MidgeCubeOrbit.", 2);
		this.slotList = this.buildSlotList(4);
		this.type = MidgeCubeOrbit.type;
	};
	static type = "midgeCubeOrbit";
}

class WingCubeOrbit extends CubeOrbit {
	constructor(run, rank) {
		super(run);
		this.run.log(`Creating new WingCubeOrbit (rank = ${rank}).`, 2);
		this.slotList = this.buildSlotList(8);
		this.rank = rank;
		this.type = WingCubeOrbit.type;
	};
	static type = "wingCubeOrbit";
}

class CenterBigCubeOrbit extends CubeOrbit {
	constructor(run, ranks) {
		super(run);
		this.run.log(`Creating new CenterBigCubeOrbit (ranks = [${ranks.join(", ")}]).`, 2);
		this.slotList = this.buildSlotList(4);
		this.ranks = ranks;
		this.type = CenterBigCubeOrbit.type;
	};
	static type = "centerBigCubeOrbit";
}
