"use strict";

class TwistyPuzzle {
	constructor(orbitList) {
		log("Creating new puzzle.");
		if (orbitList) {
			this.orbitList = orbitList;
		} else {
			this.orbitList = [];
		}
	};
	getOrbitList = () => {
		return this.orbitList;
	};
}

class Cube extends TwistyPuzzle {
	constructor(orbitList) {
		super(orbitList);
	};
	static getDefaultColorScheme = () => {
		return ["w", "g", "r", "y", "b", "o"];
	};
}

class Cube1x1x1 extends Cube {
	constructor () {
		let slotList = [];
		for (let color of Cube.getDefaultColorScheme()) {
			slotList.push(new Slot(new Sticker(color)));
		}
		super([new Orbit(slotList, "cubeCenter")]);
	};
}
