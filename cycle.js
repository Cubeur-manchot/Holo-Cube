"use strict";

// Represents one cycle of permutation on an orbit
class Cycle {
	constructor(cycle, orbitType) {
		this.slotIndexList = cycle;
		this.orbitType = orbitType;
	};
	getOrbitType = () => {
		return this.orbitType;
	};
	getSlotIndexList = () => {
		return this.slotIndexList;
	};
	getLength = () => {
		return this.getSlotIndexList()?.length ?? 0;
	};
	getLastSlot = () => {
		let slotList = this.getSlotIndexList();
		return slotList[this.getLength() - 1];
	};
	applyOnOrbit = orbit => {
		if (!this.getLength()) {
			throw "Error : Applying cycle of length 0.";
		}
		if (this.getLength() === 1) {
			log("Ignoring cycle of length 1.");
			return;
		}
		if (!orbit) {
			throw "Error : Applying cycle on undefined orbit.";
		}
		if (this.getOrbitType() !== orbit.getType()) {
			log(`Ignoring cycle because type cycle orbit type and orbit type are different (${this.getOrbitType()}, ${orbit.getType()}).`);
			return;
		}
		if (!orbit.getSize()) {
			throw "Error : Applying cycle on orbit of size 0.";
		}
		let orbitSlotList = orbit.getSlotList();
		if (!orbitSlotList) {
			throw "Error : Applying cycle on a cycle with no slot list.";
		}
		log(`Applying cycle of length ${this.getLength()} on orbit type ${this.getOrbitType()}.`);
		let cycleSlotIndexList = this.getSlotIndexList();
		let cycleEndSlotContent = orbitSlotList[this.getLastSlot()];
		for (let cycleElementIndex = this.getLength() - 1; cycleElementIndex > 0; cycleElementIndex--) {
			orbitSlotList[cycleSlotIndexList[cycleElementIndex]].setContent(orbitSlotList[cycleSlotIndexList[cycleElementIndex - 1]].getContent());
		}
		orbitSlotList[cycleSlotIndexList[0]].setContent(cycleEndSlotContent);
	};
}
