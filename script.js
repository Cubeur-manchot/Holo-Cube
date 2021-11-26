"use strict";

const log = message => {
	document.querySelector("div#logs").innerHTML += message + "<br/>";
};

const createCube = () => {
	let options = new Options({
		puzzle: "cube1x1x1",
		puzzleType: "cube",
		colorScheme: undefined
	});
	let cube1x1x1 = new Cube1x1x1(options);
	log(cube1x1x1.getOrbitList()[0].getSlotList()[4].getContent().getColor());
};

const applySequence = () => {
	let options = new Options({
		puzzle: "cube1x1x1",
		puzzleType: "cube",
		colorScheme: undefined
	});
	let cube1x1x1 = new Cube1x1x1(options);
	let moveSequenceStringList = document.querySelector("input[type=text]#moveSequence").value.split(" ").filter(move => move !== "");
	log(moveSequenceStringList);
	log(cube1x1x1.getOrbitList()[0].getSlotList()[4].getContent().getColor());
	let xMove1x1x1 = new Move([new Cycle([0, 4, 3, 1], "centerCubeOrbit")]);
	xMove1x1x1.applyOnPuzzle(cube1x1x1);
	log(cube1x1x1.getOrbitList()[0].getSlotList()[4].getContent().getColor());
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
