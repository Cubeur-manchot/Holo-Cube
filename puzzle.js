"use strict";

// Represents the information of a twisty puzzle.
// Every puzzle class inherits a "blank" puzzle class, which contains no orbit.

class TwistyPuzzle {
	constructor(run) {
		this.run = run;
		this.run.logger.debugLog("Creating new Puzzle.");
		this.fullName = this.run.puzzle.fullName;
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
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new Cube.");
		this.shape = Cube.shape;
	};
	static shape = "cube";
}

class BlankCube1x1x1 extends Cube {
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new BlankCube1x1x1.");
		this.puzzleSize = 1;
		this.orbitTypes = [CenterCubeOrbit.type];
	};
}

class Cube1x1x1 extends BlankCube1x1x1 {
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new Cube1x1x1.");
		this.addOrbit(new CenterCubeOrbit(this.run));
	};
}

class BlankCube2x2x2 extends Cube {
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new BlankCube2x2x2.");
		this.puzzleSize = 2;
		this.orbitTypes = [CornerCubeOrbit.type];
	};
}

class Cube2x2x2 extends BlankCube2x2x2 {
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new Cube2x2x2.");
		this.addOrbit(new CornerCubeOrbit(this.run));
	};
}

class BlankCube3x3x3 extends Cube {
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new BlankCube3x3x3.");
		this.puzzleSize = 3;
		this.orbitTypes = [CenterCubeOrbit.type, MidgeCubeOrbit.type, CornerCubeOrbit.type];
	};
}

class Cube3x3x3 extends BlankCube3x3x3 {
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new Cube3x3x3.");
		this.addOrbit(new CenterCubeOrbit(this.run));
		this.addOrbit(new MidgeCubeOrbit(this.run));
		this.addOrbit(new CornerCubeOrbit(this.run));
	};
}

class BlankCubeBig extends Cube {
	constructor(run) {
		super(run);
		this.puzzleSize = this.run.puzzle.size;
		this.run.logger.debugLog(`Creating new BlankCubeBig (puzzleSize = ${this.puzzleSize}).`);
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
	constructor(run) {
		super(run);
		this.run.logger.generalLog(`Creating new CubeBig (puzzleSize = ${this.puzzleSize}).`);
		this.addOrbit(new CornerCubeOrbit(this.run));
		if (this.puzzleSize % 2) { // puzzle is odd
			this.addOrbit(new MidgeCubeOrbit(this.run));
			this.addOrbit(new CenterCubeOrbit(this.run));
		}
		for (let wingRank = 1; wingRank <= this.maxRankWithoutMiddle; wingRank++) {
			this.addOrbit(new WingCubeOrbit(this.run, wingRank));
		}
		for (let centerFirstRank = 1; centerFirstRank <= this.maxRankWithoutMiddle; centerFirstRank++) {
			for (let centerSecondRank = 1; centerSecondRank <= this.maxRankWithMiddle; centerSecondRank++) {
				this.addOrbit(new CenterBigCubeOrbit(this.run, [centerFirstRank, centerSecondRank]));
			}
		}
	};
}

class Pyramid extends TwistyPuzzle {
	constructor(run) {
		super(run);
		this.shape = Pyramid.shape;
	};
	static shape = "pyramid";
}

class Dodecahedron extends TwistyPuzzle {
	constructor(run) {
		super(run);
		this.shape = Dodecahedron.shape;
	};
	static shape = "dodecahedron";
}
