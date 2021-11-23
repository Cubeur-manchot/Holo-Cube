"use strict";

// Represent the permutation induced by a move
class Move {
	constructor(cycleList) {
		this.cycles = cycleList;
	};
	getCycleList = () => {
		return this.cycles;
	};
	applyOnPuzzle = puzzle => {
		log("Applying move on puzzle.");
		let puzzleOrbitList = puzzle.getOrbitList();
		for (let cycle of this.getCycleList()) {
			for (let orbit of puzzleOrbitList) {
				if (cycle.getOrbitType() === orbit.getType()) {
					cycle.applyOnOrbit(orbit);
				}
			}
		}
	};
}
