"use strict";

class TwistyPuzzle {
	constructor() {
		log("Creating new puzzle.");
		this.orbitList = undefined;
	};
	getOrbitList = () => {
		return this.orbitList;
	};
}

class Cube extends TwistyPuzzle {
	constructor() {
		super();
	};
}

class Cube1x1x1 extends Cube {
	constructor (options) {
		super();
		this.orbitList = [new CenterCubeOrbit(options.getColorScheme())];
	};
}
