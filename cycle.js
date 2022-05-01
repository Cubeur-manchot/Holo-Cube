"use strict";

// Represents one cycle of permutation on an orbit.

class Cycle {
	constructor(cycle, orbitType, run, orbitRankOrRanks) {
		this.run = run;
		this.slotIndexList = cycle;
		this.orbitType = orbitType;
		if (typeof orbitRankOrRanks === "number") {
			this.orbitRank = orbitRankOrRanks;
		} else if (orbitRankOrRanks?.length) {
			this.orbitRanks = orbitRankOrRanks;
		}
	};
	getLength = () => {
		return this.slotIndexList?.length ?? 0;
	};
	getLastSlot = () => {
		return this.slotIndexList[this.slotIndexList.length - 1];
	};
	applyOnOrbit = orbit => {
		if (!this.getLength()) {
			throwError("Applying cycle of length 0.");
		}
		if (this.getLength() === 1) {
			log("Ignoring cycle of length 1.", 2);
			return;
		}
		if (!orbit) {
			throwError("Applying cycle on undefined orbit.");
		}
		if (!this.checkOrbitTypeAndRanks(orbit)) {
			log("Ignoring cycle because type cycle orbit type and orbit type are different ("
				+ this.orbitType
					+ (this.orbitRank ? ` (rank = ${this.orbitRank})` : "")
					+ (this.orbitRanks ? ` (ranks = [${this.orbitRanks.join(", ")}])` : "")
				+ ", " + orbit.type
					+ (orbit.rank ? ` (rank = ${orbit.orbitRank})` : "")
					+ (orbit.ranks ? ` (ranks = [${orbit.orbitRanks.join(", ")}])` : "")
				+ ").", 2);
			return;
		}
		if (!orbit.getSize()) {
			throwError("Applying cycle on orbit of size 0.");
		}
		if (!orbit.slotList) {
			throwError("Applying cycle on a cycle with no slot list.");
		}
		this.run.log(`Applying cycle of length ${this.getLength()} on orbit type ${this.orbitType}`
			+ (orbit.rank ? ` (rank = ${orbit.rank})` : "")
			+ (orbit.ranks ? ` (ranks = [${orbit.ranks}])` : "")
			+ ".", 2);
		let cycleSlotIndexList = this.slotIndexList;
		let cycleEndSlotContent = orbit.slotList[this.getLastSlot()];
		for (let cycleElementIndex = this.getLength() - 1; cycleElementIndex > 0; cycleElementIndex--) {
			orbit.slotList[cycleSlotIndexList[cycleElementIndex]].setContent(orbit.slotList[cycleSlotIndexList[cycleElementIndex - 1]].getContent());
		}
		orbit.slotList[cycleSlotIndexList[0]].setContent(cycleEndSlotContent);
	};
	checkOrbitTypeAndRanks = orbit => {
		if (this.orbitType !== orbit.type) {
			return false;
		} else if (orbit instanceof WingCubeOrbit) { 
			return this.orbitRank === orbit.rank;
		} else if (orbit instanceof CenterBigCubeOrbit) {
			return this.orbitRanks[0] === orbit.ranks[0] && this.orbitRanks[1] === orbit.ranks[1];
		} else {
			return true;
		}
	};
}
