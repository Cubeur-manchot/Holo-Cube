"use strict";

const runHoloCube = () => {
	let cubeSize = document.querySelector("input[type=text]#puzzleSize").value;
	let moveSequenceStringList = document.querySelector("input[type=text]#moveSequence").value.split(",");
	let moveSequence = undefined, moveSequenceList = undefined;
	if (moveSequenceStringList.length === 1) {
		moveSequence = moveSequenceStringList[0];
	} else {
		moveSequenceList = moveSequenceStringList;
	}
	return new Run({
		puzzle: {
			fullName: `cube${cubeSize}x${cubeSize}x${cubeSize}`,
			stage: undefined,
			colorScheme: undefined
		},
		moveSequence: moveSequence,
		moveSequenceList: moveSequenceList,
		drawingOptions: {
			imageHeight: undefined,
			imageWidth: undefined,
			imageScale: undefined,
			imageBackgroundColor: undefined,
			puzzleHeight: undefined,
			puzzleWidth: undefined,
			puzzleScale: undefined,
			puzzleColor: undefined
		},
		verbosity: 1
	}).run();
};
