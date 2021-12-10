"use strict";

// Represent the permutation induced by a move
class Move {
	constructor() {
		this.cycles = [];
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

class CubeMove extends Move {
	constructor(face, sliceBegin, sliceEnd, turnCount, cubeSize, cubeMoveParser) {
		// todo check consistency
		super();
		if (cubeSize % 1 && sliceBegin <= ((cubeSize + 1) / 2) && sliceEnd >= ((cubeSize + 1) / 2)) { // innermost centers
			this.addElementaryCycles("centerCubeOrbit", face, turnCount);
		}
		if (cubeSize > 1 && sliceBegin === 1) { // corners
			this.addElementaryCycles("cornerCubeOrbit", face, turnCount);
		}
		if (cubeSize > 1 && sliceEnd === cubeSize) { // corners when rotation
			this.addElementaryCycles("cornerCubeOrbit", cubeMoveParser.getOppositeFace(face), cubeMoveParser.cleanTurnCount(-turnCount));
		}
		// todo other orbit types
	};
	addElementaryCycles = (type, face, turnCount) => {
		CubeMove.getElementaryCycles(type, face, turnCount)
			.forEach(slotList => this.cycles.push(new Cycle(slotList, type)));
	};
	static getElementaryCycles = (type, face, turnCount, edgeMode) => {
		switch(type) {
			case "centerCubeOrbit":
				return {
					U: [[], [[1, 5, 4, 2]], [[1, 4], [2, 5]], [[1, 2, 4, 5]]],
					F: [[], [[0, 2, 3, 5]], [[0, 3], [2, 5]], [[0, 5, 3, 2]]],
					R: [[], [[0, 4, 3, 1]], [[0, 3], [1, 4]], [[0, 1, 3, 4]]],
					D: [[], [[1, 2, 4, 5]], [[1, 4], [2, 5]], [[1, 5, 4, 2]]],
					B: [[], [[0, 5, 3, 2]], [[0, 3], [2, 5]], [[0, 2, 3, 5]]],
					L: [[], [[0, 1, 3, 4]], [[0, 3], [1, 4]], [[0, 4, 3, 1]]]
				}[face][turnCount];
			case "cornerCubeOrbit":
				return {
					U: [[], [[0, 1, 2, 3], [4, 20, 16, 8], [5, 21, 17, 9]], [[0, 2], [1, 3], [4, 16], [5, 17], [8, 20], [9, 21]], [[0, 3, 2, 1], [4, 8, 16, 20], [5, 9, 17, 21]]],
					F: [[], [[2, 11, 12, 21], [3, 8, 13, 22], [4, 5, 6, 7]], [[2, 12], [3, 13], [4, 6], [5, 7], [8, 22], [11, 21]], [[2, 21, 12, 11], [3, 22, 13, 8], [4, 7, 6, 5]]],
					R: [[], [[1, 19, 13, 5], [2, 16, 14, 6], [8, 9, 10, 11]], [[1, 13], [2, 14], [5, 19], [6, 16], [8, 10], [9, 11]], [[1, 5, 13, 19], [2, 6, 14, 16], [8, 11, 10, 9]]],
					D: [[], [[6, 22, 18, 10], [7, 11, 19, 23], [12, 13, 14, 15]], [[6, 18], [7, 19], [10, 22], [11, 23], [12, 14], [13, 15]], [[6, 10, 18, 22], [7, 23, 19, 11], [12, 15, 14, 13]]],
					B: [[], [[0, 23, 14, 9], [1, 20, 15, 10], [16, 17, 18, 19]], [[0, 14], [1, 15], [9, 23], [10, 20], [16, 18], [17, 19]], [[0, 9, 14, 23], [1, 10, 15, 20], [16, 19, 18, 17]]],
					L: [[], [[0, 4, 12, 17], [3, 7, 15, 16], [20, 21, 22, 23]], [[0, 12], [3, 15], [4, 17], [7, 16], [20, 22], [21, 23]], [[0, 17, 12, 4], [3, 16, 15, 7], [20, 23, 22, 21]]]
				}[face][turnCount];
			case "midgeCubeOrbit":
				return edgeMode === "external" ? { // todo

				} : { // internal

				}[face][turnCount];
			case "wingCubeOrbit":
				break; // todo
			case "centerBigCubeOrbit":
				break; // todo
			default:
				break; // todo
		}
	};
}
