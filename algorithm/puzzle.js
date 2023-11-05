"use strict";

// Represents the information of a twisty puzzle.

class TwistyPuzzle {
	static orbitTypes = [];
	static hasOrbitType(orbitType) {
		return this.orbitTypes[orbitType];
	};
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Puzzle.");
		this.orbitList = [];
	};
	addOrbits = orbitList => {
		this.orbitList = orbitList.map(orbit => orbit.clone());
	};
	hasOrbitType = orbitType => {
		return this.constructor.orbitTypes[orbitType];
	};
	getOrbitMask = orbitType => {
		return this.runner.puzzle.masks.find(orbitMask => orbitMask.orbitType === orbitType);
	};
}

class Cube extends TwistyPuzzle {
	static shape = "cube";
	static buildCustomClass = (runner, puzzleSize, colorScheme, mask) => {
		let className = `Cube${Array(3).fill(puzzleSize).join("x")}`;
		runner.logger.debugLog(`Building dynamic class ${className}.`);
		let orbitList = [];
		let orbitTypes = {};
		let pushOrbit = orbit => {
			orbitList.push(orbit);
			orbitTypes[orbit.getType()] = true;
		};
		let middleSlice = null;
		let maxRankWithMiddle = null;
		let maxRankWithoutMiddle = null;
		if (puzzleSize % 2 === 1) {
			middleSlice = (puzzleSize + 1) / 2;
			maxRankWithoutMiddle = (puzzleSize - 3) / 2;
			maxRankWithMiddle = (puzzleSize - 1) / 2;
			pushOrbit(new CenterCubeOrbit(runner, colorScheme, mask));
			if (puzzleSize >= 3) {
				pushOrbit(new MidgeCubeOrbit(runner, colorScheme, mask));
			}
		} else {
			maxRankWithoutMiddle = puzzleSize / 2 - 1;
			maxRankWithMiddle = puzzleSize / 2 - 1;
		}
		if (puzzleSize >= 2) {
			pushOrbit(new CornerCubeOrbit(runner, colorScheme, mask));
		}
		for (let wingRank = 1; wingRank <= maxRankWithoutMiddle; wingRank++) {
			pushOrbit(new WingCubeOrbit(runner, wingRank, colorScheme, mask));
		}
		for (let centerFirstRank = 1; centerFirstRank <= maxRankWithoutMiddle; centerFirstRank++) {
			for (let centerSecondRank = 1; centerSecondRank <= maxRankWithMiddle; centerSecondRank++) {
				pushOrbit(new CenterBigCubeOrbit(runner, [centerFirstRank, centerSecondRank], colorScheme, mask));
			}
		}
		return class CustomCubeClass extends Cube {
			static className = className;
			static puzzleSize = puzzleSize;
			static orbitList = orbitList;
			static orbitTypes = orbitTypes;
			static middleSlice = middleSlice;
			static maxRankWithMiddle = maxRankWithMiddle;
			static maxRankWithoutMiddle = maxRankWithoutMiddle;
			constructor(runner) {
				super(runner);
				this.runner.logger.generalLog(`Creating new ${this.constructor.className}.`);
				this.addOrbits(this.constructor.orbitList);
			};
		};
	};
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new Cube.");
		this.shape = Cube.shape;
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
