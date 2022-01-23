"use strict";

class TwistyPuzzle {
	constructor() {
		log("Creating new puzzle.");
		this.orbitList = [];
	};
	getOrbitList = () => {
		return this.orbitList;
	};
	getPuzzleType = () => {
		return this.puzzleType;
	}; 
	hasOrbitType = orbitType => {
		return false;
	};
}

class Cube extends TwistyPuzzle {
	constructor() {
		super();
		this.puzzleType = "cube";
	};
	getPuzzleSize = () => {
		return this.puzzleSize;
	};
	computeSlices = () => {
		let cubeSize = this.getPuzzleSize();
		return {
			maxRankWithoutMiddle: Math.max(0, Math.floor(cubeSize / 2) - 1),
			maxRankWithMiddle: Math.ceil(cubeSize / 2) - 1,
			middleSlice: cubeSize % 1 ? (cubeSize + 1) / 2 : null
		};
	};
}

class Cube1x1x1 extends Cube {
	constructor(options) {
		log("Creating 1x1.");
		super();
		this.orbitList = [new CenterCubeOrbit(options.getColorScheme())];
		this.puzzleSize = 1;
	};
	hasOrbitType = orbitType => {
		return orbitType === "centerCubeOrbit";
	};
}

class Cube2x2x2 extends Cube {
	constructor(options) {
		log("Creating 2x2.");
		super();
		this.orbitList = [new CornerCubeOrbit(options.getColorScheme())];
		this.puzzleSize = 2;
	};
	hasOrbitType = orbitType => {
		return orbitType === "cornerCubeOrbit";
	};
}

class Cube3x3x3 extends Cube {
	constructor(options) {
		log("Creating 3x3.");
		super();
		this.orbitList = [
			new CenterCubeOrbit(options.getColorScheme()),
			new MidgeCubeOrbit(options.getColorScheme()),
			new CornerCubeOrbit(options.getColorScheme())
		];
		this.puzzleSize = 3;
	};
	hasOrbitType = orbitType => {
		return orbitType === "cornerCubeOrbit"
			|| orbitType === "midgeCubeOrbit"
			|| orbitType === "centerCubeOrbit";
	};
}

class CubeBig extends Cube {
	constructor(options) {
		super();
		let puzzleSize = options.getPuzzleSize();
		log(`Creating big cube (${puzzleSize}x${puzzleSize}).`);
		this.puzzleSize = puzzleSize;
		let {maxRankWithoutMiddle, maxRankWithMiddle} = this.computeSlices();
		this.orbitList = [
			new CornerCubeOrbit(options.getColorScheme())
		];
		if (options.getPuzzleSize() % 1) {
			this.orbitList.push(new MidgeCubeOrbit(options.getColorScheme()));
			this.orbitList.push(new CenterCubeOrbit(options.getColorScheme()));
		}
		for (let wingRank = 1; wingRank <= maxRankWithoutMiddle; wingRank++) {
			this.orbitList.push(new WingCubeOrbit(options.getColorScheme(), wingRank));
		}
		for (let centerRankFirst = 1; centerRankFirst <= maxRankWithoutMiddle; centerRankFirst++) {
			for (let centerRankSecond = 1; centerRankSecond <= maxRankWithMiddle; centerRankSecond++) {
				this.orbitList.push(new CenterBigCubeOrbit(options.getColorScheme(), [centerRankFirst, centerRankSecond]));
			}
		}
	};
	hasOrbitType = orbitType => {
		return orbitType === "cornerCubeOrbit"
			|| orbitType === "wingCubeOrbit"
			|| orbitType === "centerBigCubeOrbit"
			|| this.puzzleSize % 1 && (orbitType === "midgeCubeOrbit" || orbitType === "centerCubeOrbit");
	};
}
