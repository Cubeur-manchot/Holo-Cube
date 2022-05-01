"use strict";

class SVG {
	createNode = (type, fields) => {
		let node = document.createElementNS("http://www.w3.org/2000/svg", type);
		for (let property in fields) {
			node.setAttributeNS(null, property, fields[property]);
		}
		return node;
	};
	createSvgRootNode = (height, width, fillingColor) => {
		return createNode("svg", {id: "svgRoot", height: height, width: width, fill: fillingColor});
	};
	createRectNode = (horizontalPosition, verticalPosition, height, width, fillingColor, id) => {
		return createNode("rect", {x: horizontalPosition, y: verticalPosition, height: height, width: width, fill: fillingColor, id: id});
	};
	createGroupNode = id => {
		return createNode("g", {id: id});
	};
}

// Draws puzzle image
class PuzzleDrawer {
	constructor(options) {
		log("Initializing puzzle drawer.", 1);
		this.puzzleColor = options.puzzleColor;
		this.puzzleImageHeight = options.puzzleImageHeight;
		this.puzzleImageWidth = options.puzzleImageWidth;
		this.imageHeight = options.puzzleHeight;
		this.imageWidth = options.imageWidth;
		this.imageBackgroundColor = options.imageBackgroundColor;
		this.currentSvg = null;
		this.faces = null;
	};
	createImage = () => {
		log("Creating puzzle image with background.", 1);
		this.currentSvg = SVG.createSvgRootNode(this.imageHeight, this.imageWidth, this.imageBackgroundColor);
	};
	drawPuzzle = puzzle => {
		log("Drawing puzzle.", 1);
		this.currentSvg.appendChild(SVG.createGroupNode("puzzle"));
	};
}

class CubeDrawer extends PuzzleDrawer {
	constructor(options) {
		super(options);
		this.cubeSize = options.puzzleSize;
	};
	drawPuzzle = cube => {
		this.super(cube);
		this.drawFacesBackground();
		this.drawOrbits();
	};
	drawFacesBackground = () => {
		for (let face of ["U", "F", "R", "D", "B", "L"]) {
			let faceBackground = SVG.createRectNode(0, 0, 100, 100, this.puzzleColor, `FaceBackground_${face}`);
			let svgFace = SVG.createGroupNode(`Face_${face}`);
			svgFace.appendChild(faceBackground);
			this.currentSvg.appendChild(svgFace);
		}
	};
	drawOrbits = () => {
		for (let orbit of cube.getOrbitList()) {
			switch(orbit.type) {
				case "cornerCubeOrbit": this.drawCornerCubeOrbit(orbit); break;
				case "centerCubeOrbit": this.drawCenterCubeOrbit(orbit); break;
				case "midgeCubeOrbit": this.drawMidgeCubeOrbit(orbit); break;
				case "wingCubeOrbit": this.drawWingCubeOrbit(orbit); break;
				case "centerBigCubeOrbit": this.drawCenterBigCubeOrbit(orbit); break;
			}
		}
	};
	/*drawCornerCubeOrbit = orbit => {
		// TODO
		let cubeSize = this.cubeSize;
		let faces = ["U", "F", "R", "D", "B", "L"];
		for (let faceIndex = 0; faceIndex < 6; faceIndex++) {
			this.currentSvg.querySelector("g#Face_orbit.slotList[6 * faceIndex]
		}
	};*/
	drawCenterCubeOrbit = orbit => {
		// TODO
	};
	drawMidgeCubeOrbit = orbit => {
		// TODO
	};
	drawWingCubeOrbit = orbit => {
		// TODO
	};
	drawCenterBigCubeOrbit = orbit => {
		// TODO
	};
}

class CubeIsometricDrawer extends CubeDrawer {
	constructor(options) {
		super();
	};
}

class CubePlanDrawer extends CubeDrawer {
	constructor(options) {
		super();
	};
}

class CubeNetDrawer extends CubeDrawer {
	constructor(options) {
		super();
	};
}