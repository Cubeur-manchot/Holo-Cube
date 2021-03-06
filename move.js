"use strict";

// Represents the information of a move sequence.

class MoveSequence {
	constructor(moves, run) {
		this.run = run;
		this.run.log("Creating new MoveSequence.", 1);
		this.moveList = moves ?? [];
	};
	appendMove = move => {
		this.moveList.push(move);
	};
	applyOnPuzzle = puzzle => {
		this.run.log(`Applying move sequence on puzzle "${puzzle.fullName}".`, 1);
		this.moveList.forEach(move => move.applyOnPuzzle(puzzle));
	};
};

// Represent the permutation induced by a move in terms of cycles.

class Move {
	constructor(run) {
		this.run = run;
		this.run.log("Creating new Move.", 3);
		this.cycles = [];
	};
	getCycleList = () => {
		return this.cycles;
	};
	pushCycles = (cycles, orbitType, rankOrRanks) => {
		for (let slotList of cycles) {
			this.cycles.push(new Cycle(slotList, orbitType, this.run, rankOrRanks));
		}
	};
	applyOnPuzzle = puzzle => {
		this.run.log(`Applying move on puzzle "${puzzle.fullName}".`, 1);
		for (let cycle of this.getCycleList()) {
			for (let orbit of puzzle.orbitList) {
				if (cycle.orbitType === orbit.type) {
					cycle.applyOnOrbit(orbit);
				}
			}
		}
	};
}

class CubeMove extends Move {
	static externalMode = "external";
	static internalMode = "internal";
	static semiExternalMode = "semiExternal";
	static elementaryCycles = {
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
				D: [[], [[ 6, 10, 18, 22], [ 7, 11, 19, 23]], [[ 6, 18], [ 7, 19], [10, 22], [11, 23]], [[ 6, 22, 18, 10], [ 7, 23, 19, 11]]],
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
	constructor({face, sliceBegin, sliceEnd, turnCount, run}) {
		super(run);
		this.run.log("Creating new CubeMove.", 1);
		this.face = face;
		this.sliceBegin = sliceBegin;
		this.sliceEnd = sliceEnd;
		this.turnCount = turnCount;
		this.cube = this.run.blankPuzzle;
		let isBigCube = this.cube instanceof CubeBig;
		if (this.sliceBegin < 1) {
			this.run.throwError("Creating move with sliceBegin < 1.");
		}
		if (this.sliceEnd > this.cube.puzzleSize) {
			this.run.throwError("Creating move with sliceEnd > cube size.");
		}
		if (this.sliceBegin > this.sliceEnd) {
			this.run.throwError("Creating move with sliceBegin > sliceEnd.");
		}
		if (this.sliceBegin === 1) { // first layer
			this.treatFirstLayer(isBigCube); // todo fix bug : 1x1 might not be working
		}
		if (isBigCube && this.sliceEnd > 1) { // between first layer and middle layer
			this.treatBetweenFirstAndMiddleLayer(Math.max(1, this.sliceBegin - 1), Math.min(this.sliceEnd - 1, this.cube.maxRankWithoutMiddle));
		}
		if ((this.cube.puzzleSize === 3 && this.sliceBegin <= 2 && this.sliceEnd >= 2)
			|| (this.cube.middleSlice && this.sliceBegin <= this.cube.middleSlice && this.sliceEnd >= this.cube.middleSlice)) { // middle layer
			this.treatMiddleLayer(isBigCube);
		}
		if (isBigCube && this.sliceEnd > this.cube.maxRankWithMiddle + 1) { // between middle layer and last layer
			this.treatBetweenMiddleAndLastLayer(Math.max(1, this.cube.puzzleSize - this.sliceEnd),
				Math.min(this.cube.puzzleSize - this.sliceBegin, this.cube.maxRankWithoutMiddle));
		}
		if (this.sliceEnd === this.cube.puzzleSize) { // last layer
			this.treatLastLayer();
		}
	};
	treatFirstLayer = isBigCube => {
		this.addCornerElementaryCycles();
		this.addMidgeElementaryCycles(CubeMove.externalMode);
		if (isBigCube) {
			for (let firstRank = 1; firstRank <= this.cube.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank);
				for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
					this.addCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
				}
			}
		}
	};
	treatBetweenFirstAndMiddleLayer = (firstRankBegin, firstRankEnd) => {
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) { // between first layer and middle layer
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank);
			for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
				this.addCenterBigCubeElementaryCycles(CubeMove.internalMode, [firstRank, secondRank]);
			}
		}
	};
	treatMiddleLayer = isBigCube => {
		this.addCenterElementaryCycles();
		this.addMidgeElementaryCycles(CubeMove.externalMode);
		if (isBigCube) {
			for (let centerRank = 1; centerRank <= this.cube.maxRankWithoutMiddle; centerRank++) {
				this.addCenterBigCubeElementaryCycles(CubeMove.internalMode, [centerRank, this.middleSlice - 1]);
			}
		}
	};
	treatBetweenMiddleAndLastLayer = (firstRankBegin, firstRankEnd) => {
		let oppositeTurnCount = this.run.moveSequenceParser.moveParser.cleanTurnCount(-this.turnCount);
		let oppositeFace = this.run.moveSequenceParser.moveParser.getOppositeFace(this.face);
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) {
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank, oppositeFace, oppositeTurnCount);
			for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
				this.addCenterBigCubeElementaryCycles(CubeMove.internalMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
			}
		}
	};
	treatLastLayer = isBigCube => {
		let oppositeTurnCount = this.run.moveSequenceParser.moveParser.cleanTurnCount(-this.turnCount);
		let oppositeFace = this.run.moveSequenceParser.moveParser.getOppositeFace(this.face);
		this.addCornerElementaryCycles(oppositeFace, oppositeTurnCount);
		this.addMidgeElementaryCycles(CubeMove.externalMode, oppositeFace, oppositeTurnCount);
		if (isBigCube) {
			for (let firstRank = 1; firstRank <= this.cube.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank, oppositeFace, oppositeTurnCount);
				for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
					this.addCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
				}
			}
		}
	};
	addCornerElementaryCycles = (face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(CornerCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.externalMode][face][turnCount], CornerCubeOrbit.type);
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], CornerCubeOrbit.type);
		}
	};
	addCenterElementaryCycles = () => {
		if (this.cube.hasOrbitType(CenterCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CenterCubeOrbit.type][CubeMove.internalMode][this.face][this.turnCount], CenterCubeOrbit.type);
		}
	};
	addMidgeElementaryCycles = (midgeMode, face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(MidgeCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][midgeMode][face][turnCount], MidgeCubeOrbit.type);
			if (midgeMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], MidgeCubeOrbit.type);
			}
		}
	};
	addWingElementaryCycles = (wingMode, wingRank, face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(WingCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][wingMode][face][turnCount], WingCubeOrbit.type, wingRank);
			if (wingMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], WingCubeOrbit.type, wingRank);
			}	
		}
	};
	addCenterBigCubeElementaryCycles = (centerMode, centerRanks, face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(CenterBigCubeOrbit.type)) {
			if (centerMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][CubeMove.externalMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
			} else if (centerMode === CubeMove.internalMode) {
				this.pushCycles(
					centerRanks[0] === centerRanks[1] ? CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount]
					: centerRanks[0] > centerRanks[1] ? CubeMove.elementaryCycles[MidgeCubeOrbit.type][CubeMove.internalMode][face][turnCount]
					: CubeMove.elementaryCycles[MidgeCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount],
					CenterBigCubeOrbit.type, centerRanks);
			}
		}
	};
}
