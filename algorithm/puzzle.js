"use strict";

// Represents the information of a twisty puzzle.
// Every puzzle class inherits a "blank" puzzle class, which contains no orbit.

class TwistyPuzzle {
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Puzzle.");
		this.fullName = this.runner.puzzle.fullName;
		this.orbitList = [];
		this.orbitTypes = [];
	};
	addOrbit = orbit => {
		this.orbitList.push(orbit);
	};
	hasOrbitType = orbitType => {
		return this.orbitTypes.includes(orbitType);
	};
	static getBlankParentClass = childClass => {
		return Object.getPrototypeOf(childClass);
	};
}

class Cube extends TwistyPuzzle {
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new Cube.");
		this.shape = Cube.shape;
	};
	static shape = "cube";
}

class BlankCube1x1x1 extends Cube {
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new BlankCube1x1x1.");
		this.puzzleSize = 1;
		this.orbitTypes = [CenterCubeOrbit.type];
	};
}

class Cube1x1x1 extends BlankCube1x1x1 {
	constructor(runner) {
		super(runner);
		this.runner.logger.generalLog("Creating new Cube1x1x1.");
		this.addOrbit(new CenterCubeOrbit(this.runner));
	};
}

class BlankCube2x2x2 extends Cube {
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new BlankCube2x2x2.");
		this.puzzleSize = 2;
		this.orbitTypes = [CornerCubeOrbit.type];
	};
}

class Cube2x2x2 extends BlankCube2x2x2 {
	constructor(runner) {
		super(runner);
		this.runner.logger.generalLog("Creating new Cube2x2x2.");
		this.addOrbit(new CornerCubeOrbit(this.runner));
	};
}

class BlankCube3x3x3 extends Cube {
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new BlankCube3x3x3.");
		this.puzzleSize = 3;
		this.orbitTypes = [CenterCubeOrbit.type, MidgeCubeOrbit.type, CornerCubeOrbit.type];
	};
}

class Cube3x3x3 extends BlankCube3x3x3 {
	constructor(runner) {
		super(runner);
		this.runner.logger.generalLog("Creating new Cube3x3x3.");
		this.addOrbit(new CenterCubeOrbit(this.runner));
		this.addOrbit(new MidgeCubeOrbit(this.runner));
		this.addOrbit(new CornerCubeOrbit(this.runner));
	};
}

class BlankCubeBig extends Cube {
	constructor(runner) {
		super(runner);
		this.puzzleSize = this.runner.puzzle.size;
		this.runner.logger.debugLog(`Creating new BlankCubeBig (puzzleSize = ${this.puzzleSize}).`);
		this.orbitTypes = [CornerCubeOrbit.type, WingCubeOrbit.type, CenterBigCubeOrbit.type];
		if (this.puzzleSize % 2) { // puzzle is odd
			this.middleSlice = (this.puzzleSize + 1) / 2;
			this.maxRankWithoutMiddle = (this.puzzleSize - 3) / 2;
			this.maxRankWithMiddle = (this.puzzleSize - 1) / 2;
			this.orbitTypes.push(MidgeCubeOrbit.type);
			this.orbitTypes.push(CenterCubeOrbit.type);
		} else { // puzzle is even
			this.middleSlice = null;
			this.maxRankWithoutMiddle = this.puzzleSize / 2 - 1;
			this.maxRankWithMiddle = this.puzzleSize / 2 - 1;
		}
	};
}

class CubeBig extends BlankCubeBig {
	constructor(runner) {
		super(runner);
		this.runner.logger.generalLog(`Creating new CubeBig (puzzleSize = ${this.puzzleSize}).`);
		this.addOrbit(new CornerCubeOrbit(this.runner));
		if (this.puzzleSize % 2) { // puzzle is odd
			this.addOrbit(new MidgeCubeOrbit(this.runner));
			this.addOrbit(new CenterCubeOrbit(this.runner));
		}
		for (let wingRank = 1; wingRank <= this.maxRankWithoutMiddle; wingRank++) {
			this.addOrbit(new WingCubeOrbit(this.runner, wingRank));
		}
		for (let centerFirstRank = 1; centerFirstRank <= this.maxRankWithoutMiddle; centerFirstRank++) {
			for (let centerSecondRank = 1; centerSecondRank <= this.maxRankWithMiddle; centerSecondRank++) {
				this.addOrbit(new CenterBigCubeOrbit(this.runner, [centerFirstRank, centerSecondRank]));
			}
		}
	};
}

class Pyramid extends TwistyPuzzle {
	constructor(runner) {
		super(runner);
		this.shape = Pyramid.shape;
	};
	static shape = "pyramid";
}

class Dodecahedron extends TwistyPuzzle {
	constructor(runner) {
		super(runner);
		this.shape = Dodecahedron.shape;
	};
	static shape = "dodecahedron";
}
