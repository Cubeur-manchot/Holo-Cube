"use strict";

// Draws puzzle image
class PuzzleDrawer {
	constructor(){
	};
	static drawPuzzle = (puzzle, options) => {
		log("Drawing puzzle.");
	};
}

class CubeDrawer extends PuzzleDrawer {
	static drawPuzzle = (cube, options) => {
		PuzzleDrawer.drawPuzzle(cube, options);
		
	};
}

class CubeIsometricDrawer extends CubeDrawer {
	drawPuzzle = (cube, options) => {
	}
}

class CubePlanDrawer extends CubeDrawer {
}

class CubePatronDrawer extends CubeDrawer { // TODO rename
}