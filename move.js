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
	elementaryCycles = {
		centerCubeOrbit: {
			internal: {
				U: [[], [[1, 5, 4, 2]], [[1, 4], [2, 5]], [[1, 2, 4, 5]]],
				F: [[], [[0, 2, 3, 5]], [[0, 3], [2, 5]], [[0, 5, 3, 2]]],
				R: [[], [[0, 4, 3, 1]], [[0, 3], [1, 4]], [[0, 1, 3, 4]]],
				D: [[], [[1, 2, 4, 5]], [[1, 4], [2, 5]], [[1, 5, 4, 2]]],
				B: [[], [[0, 5, 3, 2]], [[0, 3], [2, 5]], [[0, 2, 3, 5]]],
				L: [[], [[0, 1, 3, 4]], [[0, 3], [1, 4]], [[0, 4, 3, 1]]]
			}
		},
		cornerCubeOrbit: {
			external: {
				U: [[], [[ 0,  1,  2,  3]], [[ 0,  2], [ 1,  3]], [[ 0,  3,  2,  1]]],
				F: [[], [[ 2, 11, 12, 21]], [[ 4,  6], [ 5,  7]], [[ 4,  7,  6,  5]]],
				R: [[], [[ 8,  9, 10, 11]], [[ 8, 10], [ 9, 11]], [[ 8, 11, 10,  9]]],
				D: [[], [[12, 13, 14, 15]], [[12, 14], [13, 15]], [[12, 15, 14, 13]]],
				B: [[], [[16, 17, 18, 19]], [[16, 18], [17, 19]], [[16, 19, 18, 17]]],
				L: [[], [[20, 21, 22, 23]], [[20, 22], [21, 23]], [[20, 23, 22, 21]]]
			},
			semiExternal: {
				U: [[], [[ 4, 20, 16,  8], [ 5, 21, 17,  9]], [[ 4, 16], [ 5, 17], [ 8, 20], [ 9, 21]], [[ 4,  8, 16, 20], [ 5,  9, 17, 21]]],
				F: [[], [[ 2, 11, 12, 21], [ 3,  8, 13, 22]], [[ 2, 12], [ 3, 13], [ 8, 22], [11, 21]], [[ 2, 21, 12, 11], [ 3, 22, 13,  8]]],
				R: [[], [[ 1, 19, 13,  5], [ 2, 16, 14,  6]], [[ 1, 13], [ 2, 14], [ 5, 19], [ 6, 16]], [[ 1,  5, 13, 19], [ 2,  6, 14, 16]]],
				D: [[], [[ 6, 22, 18, 10], [ 7, 11, 19, 23]], [[ 6, 18], [ 7, 19], [10, 22], [11, 23]], [[ 6, 10, 18, 22], [ 7, 23, 19, 11]]],
				B: [[], [[ 0, 23, 14,  9], [ 1, 20, 15, 10]], [[ 0, 14], [ 1, 15], [ 9, 23], [10, 20]], [[ 0,  9, 14, 23], [ 1, 10, 15, 20]]],
				L: [[], [[ 0,  4, 12, 17], [ 3,  7, 15, 16]], [[ 0, 12], [ 3, 15], [ 4, 17], [ 7, 16]], [[ 0, 17, 12,  4], [ 3, 16, 15,  7]]]
			}
		},
		midgeCubeOrbit: {
			external: {
				U: [[], [[ 0,  1,  2,  3]], [[ 0,  2], [ 1,  3]], [[ 0,  3,  2,  1]]],
				F: [[], [[ 4,  5,  6,  7]], [[ 4,  6], [ 5,  7]], [[ 4,  7,  6,  5]]],
				R: [[], [[ 8,  9, 10, 11]], [[ 8, 10], [ 9, 11]], [[ 8, 11, 10,  9]]],
				D: [[], [[12, 13, 14, 15]], [[12, 14], [13, 15]], [[12, 15, 14, 13]]],
				B: [[], [[16, 17, 18, 19]], [[16, 18], [17, 19]], [[16, 19, 18, 17]]],
				L: [[], [[20, 21, 22, 23]], [[20, 22], [21, 23]], [[20, 23, 22, 21]]]
			},
			semiExternal: {
				U: [[], [[ 4, 20, 16,  8]], [[ 4, 16], [ 8, 20]], [[ 4,  8, 16, 20]]],
				F: [[], [[ 2, 11, 12, 21]], [[ 2, 12], [11, 21]], [[ 2, 21, 12, 11]]],
				R: [[], [[ 1, 19, 13,  5]], [[ 1, 13], [ 5, 19]], [[ 1,  5, 13, 19]]],
				D: [[], [[ 6, 10, 18, 22]], [[ 6, 18], [10, 22]], [[ 6, 22, 18, 10]]],
				B: [[], [[ 0, 23, 14,  9]], [[ 0, 14], [ 9, 23]], [[ 0,  9, 14, 23]]],
				L: [[], [[ 3,  7, 15, 17]], [[ 3, 15], [ 7, 17]], [[ 3, 17, 15,  7]]]
			},
			internal: {
				U: [[], [[ 5, 21, 17,  9], [ 7, 23, 19, 11]], [[ 5, 17], [ 7, 19], [ 9, 21], [11, 23]], [[ 5,  9, 17, 21], [ 7, 11, 19, 23]]],
				F: [[], [[ 1, 10, 15, 20], [ 3,  8, 13, 22]], [[ 1, 15], [ 3, 13], [ 8, 22], [10, 20]], [[ 1, 20, 15, 10], [ 3, 22, 13,  8]]],
				R: [[], [[ 0, 18, 12,  4], [ 2, 16, 14,  6]], [[ 0, 12], [ 2, 14], [ 4, 18], [ 6, 16]], [[ 0,  4, 12, 18], [ 2,  6, 14, 16]]],
				D: [[], [[ 5,  9, 17, 21], [ 7, 11, 19, 23]], [[ 5, 17], [ 7, 19], [ 9, 21], [11, 23]], [[ 5, 21, 17,  9], [ 7, 23, 19, 11]]],
				B: [[], [[ 1, 20, 15, 10], [ 3, 22, 13,  8]], [[ 1, 15], [ 3, 13], [ 8, 22], [10, 20]], [[ 1, 10, 15, 20], [ 3,  8, 13, 22]]],
				L: [[], [[ 0,  4, 12, 18], [ 2,  6, 14, 16]], [[ 0, 12], [ 2, 14], [ 4, 18], [ 6, 16]], [[ 0, 18, 12,  4], [ 2, 16, 14,  6]]]
			}
		},
		wingCubeOrbit: {
			external: {
				U: [[], [[ 0,  2,  4,  6], [ 1,  3,  5,  7]], [[ 0,  4], [ 1,  5], [ 2,  6], [ 3,  7]], [[ 0,  6,  4,  2], [ 1,  7,  5,  3]]],
				F: [[], [[ 8, 10, 12, 14], [ 9, 11, 13, 15]], [[ 8, 12], [ 9, 13], [10, 14], [11, 15]], [[ 8, 14, 12, 10], [ 9, 15, 13, 11]]],
				R: [[], [[16, 18, 20, 22], [17, 19, 21, 23]], [[16, 20], [17, 21], [18, 22], [19, 23]], [[16, 22, 20, 18], [17, 23, 21, 19]]],
				D: [[], [[24, 26, 28, 30], [25, 27, 29, 31]], [[24, 28], [25, 29], [26, 30], [27, 31]], [[24, 30, 28, 26], [25, 31, 29, 27]]],
				B: [[], [[32, 34, 36, 38], [33, 35, 37, 39]], [[32, 36], [33, 37], [34, 38], [35, 39]], [[32, 38, 36, 34], [33, 39, 37, 35]]],
				L: [[], [[40, 42, 44, 46], [41, 43, 45, 47]], [[40, 44], [41, 45], [42, 46], [43, 47]], [[40, 46, 44, 42], [41, 47, 45, 43]]]
			},
			semiExternal: {
				U: [[], [[ 8, 40, 32, 16], [ 9, 41, 33, 17]], [[ 8, 32], [ 9, 33], [16, 40], [17, 41]], [[ 8, 16, 32, 40], [ 9, 17, 33, 41]]],
				F: [[], [[ 4, 22, 24, 42], [ 5, 23, 25, 43]], [[ 4, 24], [ 5, 25], [22, 42], [23, 43]], [[ 4, 42, 24, 22], [ 5, 43, 25, 23]]],
				R: [[], [[ 2, 38, 26, 10], [ 3, 39, 27, 11]], [[ 2, 26], [ 3, 27], [10, 38], [11, 39]], [[ 2, 10, 26, 38], [ 3, 11, 27, 39]]],
				D: [[], [[12, 20, 36, 44], [13, 21, 37, 45]], [[12, 36], [13, 37], [20, 44], [21, 45]], [[12, 44, 36, 20], [13, 45, 37, 21]]],
				B: [[], [[ 0, 46, 28, 18], [ 1, 47, 29, 19]], [[ 0, 28], [ 1, 29], [18, 46], [19, 47]], [[ 0, 18, 28, 46], [ 1, 19, 29, 47]]],
				L: [[], [[ 6, 14, 30, 34], [ 7, 15, 31, 35]], [[ 6, 30], [ 7, 31], [14, 34], [15, 35]], [[ 6, 34, 30, 14], [ 7, 35, 31, 15]]]
			},
			internal: {
				U: [[], [[10, 42, 34, 18], [15, 47, 39, 23]], [[10, 34], [15, 39], [18, 42], [23, 47]], [[10, 18, 34, 42], [15, 23, 39, 47]]],
				F: [[], [[ 3, 21, 26, 44], [ 6, 16, 31, 41]], [[ 3, 26], [ 6, 31], [16, 41], [21, 44]], [[ 3, 44, 26, 21], [ 6, 41, 31, 16]]],
				R: [[], [[ 1, 37, 25,  9], [ 4, 32, 28, 12]], [[ 1, 25], [ 4, 28], [ 9, 37], [12, 32]], [[ 1,  9, 25, 37], [ 4, 12, 28, 32]]],
				D: [[], [[11, 19, 35, 43], [14, 22, 38, 46]], [[11, 35], [14, 38], [19, 43], [22, 46]], [[11, 43, 35, 19], [14, 46, 38, 22]]],
				B: [[], [[ 2, 40, 30, 20], [ 7, 45, 27, 17]], [[ 2, 30], [ 7, 27], [17, 45], [20, 40]], [[ 2, 20, 30, 40], [ 7, 17, 27, 35]]],
				L: [[], [[ 0,  8, 24, 36], [ 5, 13, 29, 33]], [[ 0, 24], [ 5, 29], [ 8, 36], [13, 33]], [[ 0, 36, 24,  8], [ 5, 33, 29, 13]]]
			}
		}
	};
	constructor({face, sliceBegin, sliceEnd, turnCount, cubeMoveParser, cube}) {
		super();
		this.cube = cube;
		let cubeSize = cube.getPuzzleSize();
		let {maxRankWithoutMiddle, maxRankWithMiddle, middleSlice} = cube.computeSlices();
		let oppositeTurnCount = cubeMoveParser.cleanTurnCount(-turnCount);
		let oppositeFace = cubeMoveParser.getOppositeFace(face);
		if (sliceBegin === 1) { // first layer
			this.addCornerElementaryCycles(face, turnCount);
			this.addMidgeElementaryCycles(face, turnCount, "external");
			for (let firstRank = 1; firstRank <= maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(face, turnCount, "external", firstRank);
				for (let secondRank = 1; secondRank <= maxRankWithMiddle; secondRank++) {
					this.addCenterBigCubeElementaryCycles(face, turnCount, "external", [firstRank, secondRank]);
				}
			}
		}
		for (let firstRank = Math.max(1, sliceBegin - 1); firstRank <= Math.min(sliceEnd - 1, maxRankWithoutMiddle); firstRank++) { // between first layer and middle layer
			this.addWingElementaryCycles(face, turnCount, "internal", firstRank);
			for (let secondRank = 1; secondRank <= maxRankWithMiddle; secondRank++) {
				this.addCenterBigCubeElementaryCycles(face, turnCount, "internal", [firstRank, secondRank]);
			}
		}
		if (middleSlice && sliceBegin <= middleSlice && sliceEnd >= middleSlice) { // middle layer
			this.addCenterElementaryCycles(face, turnCount);
			this.addMidgeElementaryCycles(face, turnCount, "internal");
			for (let centerRank = 1; centerRank <= maxRankWithoutMiddle; centerRank++) {
				this.addCenterBigCubeElementaryCycles(face, turnCount, "internal", [centerRank, middleSlice - 1]);
			}
		}
		for (let firstRank = Math.max(1, cubeSize - sliceEnd); firstRank <= Math.min(cubeSize - sliceBegin, maxRankWithoutMiddle); firstRank++) { // between middle layer and last layer
			this.addWingElementaryCycles(face, turnCount, "internal", firstRank);
			for (let secondRank = 1; secondRank <= maxRankWithMiddle; secondRank++) {
				this.addCenterBigCubeElementaryCycles(face, turnCount, "internal", [firstRank, secondRank]);
			}
		}
		if (sliceEnd === cubeSize) { // last layer
			this.addCornerElementaryCycles(face, turnCount);
			this.addMidgeElementaryCycles(oppositeFace, oppositeTurnCount, "external");
			for (let firstRank = 1; firstRank <= maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(oppositeFace, oppositeTurnCount, "external", firstRank);
				for (let secondRank = 1; secondRank <= maxRankWithMiddle; secondRank++) {
					this.addCenterBigCubeElementaryCycles(oppositeFace, oppositeTurnCount, "external", [firstRank, secondRank]);
				}
			}
		}
	};
	addCornerElementaryCycles = (face, turnCount) => {
		let orbitType = "cornerCubeOrbit";
		if (this.cube.hasOrbitType(orbitType)) {
			this.pushCycles(this.elementaryCycles[orbitType]["external"][face][turnCount], orbitType);
			this.pushCycles(this.elementaryCycles[orbitType]["semiExternal"][face][turnCount], orbitType);
		}
	};
	addCenterElementaryCycles = (face, turnCount) => {
		let orbitType = "centerCubeOrbit";
		if (this.cube.hasOrbitType(orbitType)) {
			this.pushCycles(this.elementaryCycles[orbitType]["internal"][face][turnCount], orbitType);
		}
	};
	addMidgeElementaryCycles = (face, turnCount, midgeMode) => {
		let orbitType = "midgeCubeOrbit";
		if (this.cube.hasOrbitType(orbitType)) {
			this.pushCycles(this.elementaryCycles[orbitType][midgeMode][face][turnCount], orbitType);
			if (midgeMode === "external") {
				this.pushCycles(this.elementaryCycles[orbitType]["semiExternal"][face][turnCount], orbitType);
			}
		}
	};
	addWingElementaryCycles = (face, turnCount, wingMode, wingRank) => {
		let orbitType = "wingCubeOrbit";
		if (this.cube.hasOrbitType(orbitType)) {
			this.pushCycles(this.elementaryCycles[orbitType][wingMode][face][turnCount], orbitType, wingRank);
			if (wingMode === "external") {
				this.pushCycles(this.elementaryCycles[orbitType]["semiExternal"][face][turnCount], orbitType, wingRank);
			}	
		}
	};
	addCenterBigCubeElementaryCycles = (face, turnCount, centerMode, centerRanks) => {
		let orbitType = "centerBigCubeOrbit";
		if (this.cube.hasOrbitType(orbitType)) {
			if (centerMode === "external") {
				if (centerRanks[0] === centerRanks[1]) {
					this.pushCycles(this.elementaryCycles["cornerCubeOrbit"]["external"][face][turnCount], orbitType, centerRanks);
				} else {
					this.pushCycles(this.elementaryCycles["midgeCubeOrbit"]["external"][face][turnCount], orbitType, centerRanks);
				}
			} else if (centerMode === "internal") {
				if (centerRanks[0] === centerRanks[1]) {
					this.pushCycles(this.elementaryCycles["cornerCubeOrbit"]["semiExternal"][face][turnCount], orbitType, centerRanks);
				} else if (centerRanks[0] > centerRanks[1]) {
					this.pushCycles(this.elementaryCycles["midgeCubeOrbit"]["internal"][face][turnCount], orbitType, centerRanks);
				} else {
					this.pushCycles(this.elementaryCycles["midgeCubeOrbit"]["semiExternal"][face][turnCount], orbitType, centerRanks);
				}
			}
		}
	};
	pushCycles = (cycles, orbitType, rankOrRanks) => {
		for (let slotList of cycles) {
			this.cycles.push(new Cycle(slotList, orbitType, rankOrRanks));
		}
	}
}
