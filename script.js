"use strict";

const log = message => {
	let divLogs = document.querySelector("div#logs");
	divLogs.innerHTML += message + "<br/>";
	divLogs.scrollTop = divLogs.scrollHeight;
};

const getClassFromPuzzle = puzzle => {
	switch(puzzle) {
		case "cube1x1x1": return Cube1x1x1;
		case "cube2x2x2": return Cube2x2x2;
		case "cube3x3x3": return Cube3x3x3;
		default: return CubeBig;
	}
};

const getOptionsFromInputs = () => {
	let puzzleShape = document.querySelector("select#puzzleShape").value;
	let puzzleSize = parseInt(document.querySelector("input[type=text]#puzzleSize").value);
	if (puzzleShape !== "cube") {
		throw "Error : Non-cubic puzzles are not supported.";
	}
	return new Options({
		puzzle: `cube${puzzleSize}x${puzzleSize}x${puzzleSize}`,
		puzzleType: puzzleShape,
		puzzleSize: puzzleSize,
		colorScheme: undefined
	});
};

const getMoveSequenceFromInputs = puzzle => {
	return new MoveSequenceParser(puzzle).parseMoveSequenceString(document.querySelector("input[type=text]#moveSequence").value);
};

const applySequence = () => {
	log("----------------------");
	let options = getOptionsFromInputs();
	let cube = new (getClassFromPuzzle(options.getPuzzle()))(options);
	let moveSequence = getMoveSequenceFromInputs(cube);
	for (let move of moveSequence) {
		move.applyOnPuzzle(cube);
	}
};

const createSvg = () => {
	let containerTag = document.querySelector("div#container");
	let svg = createSvgNode("svg");
	let rect = createSvgNode("rect", { x: 10, y: 10, width: 100, height: 20, fill:'#ff00ff', id:'rect2' });
	svg.appendChild(rect);
	containerTag.appendChild(svg);
};

const createSvgNode = (type, fields) => {
	let node = document.createElementNS("http://www.w3.org/2000/svg", type);
	for (let property in fields) {
		node.setAttributeNS(null, property, fields[property]);
	}
	return node;
};
