"use strict";

// Represents the information of a move sequence.

class MoveSequence {
	constructor(moves, runner) {
		this.runner = runner;
		this.runner.logger.generalLog("Creating new MoveSequence.");
		this.moveList = moves ?? [];
	};
	appendMove = move => {
		this.moveList.push(move);
	};
	applyOnPuzzle = puzzle => {
		this.runner.logger.generalLog(`Applying move sequence of length ${this.moveList.length} on a solved puzzle.`);
		this.moveList.forEach(move => move.applyOnPuzzle(puzzle));
	};
};

// Represent the permutation induced by a move in terms of cycles.

class Move {
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Move.");
		this.cycles = [];
	};
	getCycleList = () => {
		return this.cycles;
	};
	pushCycles = (cycles, orbitType, rankOrRanks) => {
		for (let slotList of cycles) {
			this.cycles.push(new Cycle(slotList, orbitType, this.runner, rankOrRanks));
		}
	};
	applyOnPuzzle = puzzle => {
		this.runner.logger.detailedLog("Applying move on puzzle.");
		for (let cycle of this.getCycleList()) {
			for (let orbit of puzzle.orbitList) {
				if (cycle.orbitType === orbit.getType()) {
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
	static internalDirectMode = "internalDirect";
	static internalIndirectMode = "internalIndirect";
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
				F: [[], [[ 4,  5,  6,  7]], [[ 4,  6], [ 5,  7]], [[ 4,  7,  6,  5]]],
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
				L: [[], [[ 0,  4, 12, 18], [ 3,  7, 15, 17]], [[ 0, 12], [ 3, 15], [ 4, 18], [ 7, 17]], [[ 0, 18, 12,  4], [ 3, 17, 15,  7]]]
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
				F: [[], [[ 3, 21, 31, 41], [ 6, 16, 26, 44]], [[ 3, 31], [ 6, 26], [16, 44], [21, 41]], [[ 3, 41, 31, 21], [ 6, 44, 26, 16]]],
				R: [[], [[ 1, 37, 25,  9], [ 4, 32, 28, 12]], [[ 1, 25], [ 4, 28], [ 9, 37], [12, 32]], [[ 1,  9, 25, 37], [ 4, 12, 28, 32]]],
				D: [[], [[11, 19, 35, 43], [14, 22, 38, 46]], [[11, 35], [14, 38], [19, 43], [22, 46]], [[11, 43, 35, 19], [14, 46, 38, 22]]],
				B: [[], [[ 2, 40, 30, 20], [ 7, 45, 27, 17]], [[ 2, 30], [ 7, 27], [17, 45], [20, 40]], [[ 2, 20, 30, 40], [ 7, 17, 27, 45]]],
				L: [[], [[ 0,  8, 24, 36], [ 5, 13, 29, 33]], [[ 0, 24], [ 5, 29], [ 8, 36], [13, 33]], [[ 0, 36, 24,  8], [ 5, 33, 29, 13]]]
			}
		},
		centerBigCubeOrbit: {
			internalDirect: {
				U: [[], [[ 7, 23, 19, 11]], [[ 7, 19], [11, 23]], [[ 7, 11, 19, 23]]],
				F: [[], [[ 1, 10, 15, 20]], [[ 1, 15], [10, 20]], [[ 1, 20, 15, 10]]],
				R: [[], [[ 0, 18, 12,  4]], [[ 0, 12], [ 4, 18]], [[ 0,  4, 12, 18]]],
				D: [[], [[ 5,  9, 17, 21]], [[ 5, 17], [ 9, 21]], [[ 5, 21, 17,  9]]],
				B: [[], [[ 3, 22, 13,  8]], [[ 3, 13], [ 8, 22]], [[ 3,  8, 13, 22]]],
				L: [[], [[ 2,  6, 14, 16]], [[ 2, 14], [ 6, 16]], [[ 2, 16, 14,  6]]]
			},
			internalIndirect: {
				U: [[], [[ 5, 21, 17,  9]], [[ 5, 17], [ 9, 21]], [[ 5,  9, 17, 21]]],
				F: [[], [[ 3,  8, 13, 22]], [[ 3, 13], [ 8, 22]], [[ 3, 22, 13,  8]]],
				R: [[], [[ 2, 16, 14,  6]], [[ 2, 14], [ 6, 16]], [[ 2,  6, 14, 16]]],
				D: [[], [[ 7, 11, 19, 23]], [[ 7, 19], [11, 23]], [[ 7, 23, 19, 11]]],
				B: [[], [[ 1, 20, 15, 10]], [[ 1, 15], [10, 20]], [[ 1, 10, 15, 20]]],
				L: [[], [[ 0,  4, 12, 18]], [[ 0, 12], [ 4, 18]], [[ 0, 18, 12,  4]]]
			}
		}
	};
	constructor({face, sliceBegin, sliceEnd, turnCount, runner}) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CubeMove.");
		this.face = face;
		this.sliceBegin = sliceBegin;
		this.sliceEnd = sliceEnd;
		this.turnCount = turnCount;
		this.puzzleClass = this.runner.puzzle.class;
		let isBigCube = this.puzzleClass.puzzleSize >= 4;
		if (this.sliceBegin < 1) {
			this.runner.throwError("Creating move with sliceBegin < 1.");
		}
		if (this.sliceEnd > this.puzzleClass.puzzleSize) {
			this.runner.throwError("Creating move with sliceEnd > cube size.");
		}
		if (this.sliceBegin > this.sliceEnd) {
			this.runner.throwError("Creating move with sliceBegin > sliceEnd.");
		}
		if (this.sliceBegin === 1) { // first layer
			this.treatFirstLayer(isBigCube);
		}
		if (isBigCube && this.sliceEnd > 1) { // between first layer and middle layer
			this.treatBetweenFirstAndMiddleLayer(Math.max(1, this.sliceBegin - 1), Math.min(this.sliceEnd - 1, this.puzzleClass.maxRankWithoutMiddle));
		}
		if ((this.puzzleClass.puzzleSize === 3 && this.sliceBegin <= 2 && this.sliceEnd >= 2)
			|| (this.puzzleClass.middleSlice && this.sliceBegin <= this.puzzleClass.middleSlice && this.sliceEnd >= this.puzzleClass.middleSlice)) { // middle layer
			this.treatMiddleLayer(isBigCube);
		}
		if (isBigCube && this.sliceEnd > this.puzzleClass.maxRankWithMiddle + 1) { // between middle layer and last layer
			this.treatBetweenMiddleAndLastLayer(Math.max(1, this.puzzleClass.puzzleSize - this.sliceEnd),
				Math.min(this.puzzleClass.puzzleSize - this.sliceBegin, this.puzzleClass.maxRankWithoutMiddle));
		}
		if (this.sliceEnd === this.puzzleClass.puzzleSize) { // last layer
			this.treatLastLayer(isBigCube);
		}
	};
	treatFirstLayer = isBigCube => {
		this.addCornerElementaryCycles();
		this.addMidgeElementaryCycles(CubeMove.externalMode);
		if (isBigCube) {
			for (let firstRank = 1; firstRank <= this.puzzleClass.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank);
				for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
					if (firstRank === secondRank) {
						this.addXCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					} else {
						this.addCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					}
				}
			}
		}
	};
	treatBetweenFirstAndMiddleLayer = (firstRankBegin, firstRankEnd) => {
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) { // between first layer and middle layer
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank);
			for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
				if (firstRank === secondRank) {
					this.addXCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank]);
				} else if (firstRank > secondRank) {
					this.addCenterBigCubeElementaryCycles(CubeMove.internalDirectMode, [firstRank, secondRank]);
					this.addCenterBigCubeElementaryCycles(CubeMove.internalIndirectMode, [secondRank, firstRank]);
				} else {
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank]);
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [secondRank, firstRank]);
				}
			}
		}
	};
	treatMiddleLayer = isBigCube => {
		this.addCenterElementaryCycles();
		this.addMidgeElementaryCycles(CubeMove.internalMode);
		if (isBigCube) {
			for (let centerRank = 1; centerRank <= this.puzzleClass.maxRankWithoutMiddle; centerRank++) {
				this.addCenterBigCubeElementaryCycles(CubeMove.internalDirectMode, [centerRank, this.puzzleClass.middleSlice - 1]);
				this.addCenterBigCubeElementaryCycles(CubeMove.internalIndirectMode, [centerRank, this.puzzleClass.middleSlice - 1]);
			}
		}
	};
	treatBetweenMiddleAndLastLayer = (firstRankBegin, firstRankEnd) => {
		let oppositeTurnCount = CubeMoveParser.cleanTurnCount(-this.turnCount);
		let oppositeFace = CubeMoveParser.getOppositeFace(this.face);
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) {
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank, oppositeFace, oppositeTurnCount);
			for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
				if (firstRank === secondRank) {
					this.addXCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
				} else if (firstRank > secondRank) {
					this.addCenterBigCubeElementaryCycles(CubeMove.internalDirectMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
					this.addCenterBigCubeElementaryCycles(CubeMove.internalIndirectMode, [secondRank, firstRank], oppositeFace, oppositeTurnCount);
				} else {
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [secondRank, firstRank], oppositeFace, oppositeTurnCount);
				}
			}
		}
	};
	treatLastLayer = isBigCube => {
		let oppositeTurnCount = CubeMoveParser.cleanTurnCount(-this.turnCount);
		let oppositeFace = CubeMoveParser.getOppositeFace(this.face);
		this.addCornerElementaryCycles(oppositeFace, oppositeTurnCount);
		this.addMidgeElementaryCycles(CubeMove.externalMode, oppositeFace, oppositeTurnCount);
		if (isBigCube) {
			for (let firstRank = 1; firstRank <= this.puzzleClass.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank, oppositeFace, oppositeTurnCount);
				for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
					if (firstRank === secondRank) {
						this.addXCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					} else {
						this.addCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					}
				}
			}
		}
	};
	addCornerElementaryCycles = (face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(CornerCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.externalMode][face][turnCount], CornerCubeOrbit.type);
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], CornerCubeOrbit.type);
		}
	};
	addCenterElementaryCycles = () => {
		if (this.puzzleClass.hasOrbitType(CenterCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CenterCubeOrbit.type][CubeMove.internalMode][this.face][this.turnCount], CenterCubeOrbit.type);
		}
	};
	addMidgeElementaryCycles = (midgeMode, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(MidgeCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][midgeMode][face][turnCount], MidgeCubeOrbit.type);
			if (midgeMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], MidgeCubeOrbit.type);
			}
		}
	};
	addWingElementaryCycles = (wingMode, wingRank, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(WingCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][wingMode][face][turnCount], WingCubeOrbit.type, wingRank);
			if (wingMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], WingCubeOrbit.type, wingRank);
			}
		}
	};
	addXCenterBigCubeElementaryCycles = (centerMode, centerRanks, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(CenterBigCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][centerMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
		}
	};
	addCenterBigCubeElementaryCycles = (centerMode, centerRanks, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(CenterBigCubeOrbit.type)) {
			if (centerMode === CubeMove.internalDirectMode || centerMode === CubeMove.internalIndirectMode) {
				this.pushCycles(CubeMove.elementaryCycles[CenterBigCubeOrbit.type][centerMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
			} else {
				this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][centerMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
			}
		}
	};
}
