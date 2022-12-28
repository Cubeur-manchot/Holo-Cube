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
			this.run.throwError("Applying cycle of length 0.");
		}
		if (this.getLength() === 1) {
			this.run.logger.debugLog("Ignoring cycle of length 1.");
			return;
		}
		if (!orbit) {
			this.run.throwError("Applying cycle on undefined orbit.");
		}
		if (this.orbitType !== orbit.type) {
		this.run.logger.debugLog(`Ignoring cycle because cycle orbit type (${this.orbitType}) and orbit type ({orbit.type}) are different.`);
			return;
		}
		if (orbit instanceof WingCubeOrbit && this.orbitRank !== orbit.rank) {
			this.run.logger.debugLog(`Ignoring cycle because cyle orbit rank (${this.orbitRank}) and orbit rank (${orbit.rank}) are different.`);
			return;
		}
		if (orbit instanceof CenterBigCubeOrbit && !(this.orbitRanks[0] === orbit.ranks[0] && this.orbitRanks[1] === orbit.ranks[1])) {
			this.run.logger.debugLog(`Ignoring cycle because cyle orbit ranks (${this.orbitRanks.join(", ")}) and orbit rank (${orbit.ranks.join(", ")}) are different.`);
			return;
		}
		if (!orbit.getSize()) {
			this.run.throwError("Applying cycle on orbit of size 0.");
		}
		if (!orbit.slotList) {
			this.run.throwError("Applying cycle on a cycle with no slot list.");
		}
		this.run.logger.debugLog(`Applying cycle of length ${this.getLength()} on orbit type ${this.orbitType}`
			+ (orbit.rank ? ` (rank = ${orbit.rank})` : "")
			+ (orbit.ranks ? ` (ranks = [${orbit.ranks}])` : "")
			+ ".");
		let cycleEndSlotContent = orbit.slotList[this.getLastSlot()].getContent();
		for (let cycleElementIndex = this.getLength() - 1; cycleElementIndex > 0; cycleElementIndex--) {
			orbit.slotList[this.slotIndexList[cycleElementIndex]].setContent(orbit.slotList[this.slotIndexList[cycleElementIndex - 1]].getContent());
		}
		orbit.slotList[this.slotIndexList[0]].setContent(cycleEndSlotContent);
	};
}
