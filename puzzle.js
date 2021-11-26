"use strict";

class TwistyPuzzle {
	constructor() {
		log("Creating new puzzle.");
		this.orbitList = [];
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
	constructor(options) {
		log("Creating 1x1.");
		super();
		this.orbitList = [new CenterCubeOrbit(options.getColorScheme())];
	};
}

class Cube2x2x2 extends Cube {
	constructor(options) {
		log("Creating 2x2.");
		super();
		this.orbitList = [new CornerCubeOrbit(options.getColorScheme())];
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
	};
}

class CubeBig extends Cube {
	constructor(options) {
		log("Creating big cube.");
		super();
		this.orbitList = [
			new CornerCubeOrbit(options.getColorScheme())
			// todo wings
			// todo midges
			// todo centercube
			// todo centerbigcube
		];
	};
}
