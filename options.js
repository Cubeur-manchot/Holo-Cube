"use strict";

class Options {
	constructor(optionsObject) {
		if (!optionsObject) {
			throw "Error : Initializing Options with undefined object.";
		}
		this.puzzle = optionsObject.puzzle;
		this.puzzleType = optionsObject.puzzleType;
		this.puzzleSize = optionsObject.puzzleSize;
		this.colorScheme = optionsObject.colorScheme ?? defaultColorSchemeFromPuzzleType[optionsObject.puzzleType];
	};
	getPuzzle = () => {
		return this.puzzle;
	};
	getPuzzleType = () => {
		return this.puzzleType;
	};
	getColorScheme = () => {
		return this.colorScheme;
	};
	getPuzzleSize = () => {
		return this.puzzleSize;
	};
}

const defaultColorSchemeFromPuzzleType = {
	cube: ["w", "g", "r", "y", "b", "o"], // respectively for U, F, R, D, B, L faces
	pyramid: ["g", "b", "r", "y"], // respectively for F, BR, BL, D faces
	dodecahedron: ["w", "g", "r", "b", "y", "pu", "gy", "lg", "o", "lb", "ly", "pi"] // respectively for U, F, R, BR, BL, L, D, DB, DL, DFL, DFR, DR
};
