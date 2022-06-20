"use strict";

// Represent the information of an SVG object.

class SVG {
	static createNode = (type, fields) => {
		let node = document.createElementNS("http://www.w3.org/2000/svg", type);
		for (let property in fields) {
			node.setAttributeNS(null, property, fields[property]);
		}
		return node;
	};
	static createSvgRootNode = (height, width) => {
		return SVG.createNode("svg", {
			id: "svgRoot",
			height: height,
			width: width,
			viewbox: `${-width/2} ${-height/2} ${width} ${height}`
		});
	};
	static createRectNode = (horizontalPosition, verticalPosition, height, width, fillingColor, borderRadius, id) => {
		return SVG.createNode("rect", {
			id: id,
			x: horizontalPosition,
			y: verticalPosition,
			height: height,
			width: width,
			rx: borderRadius,
			ry: borderRadius,
			fill: fillingColor.getRgbHex6(),
			"fill-opacity": fillingColor.getAlpha()
		});
	};
	static createPathNode = () => {
		//todo
	};
	static createGroupNode = properties => {
		return SVG.createNode("g", properties);
	};
	static clone = svgNode => {
		return svgNode.cloneNode(true);
	};
}

// Represents the information of a puzzle image drawer.

class TwistyPuzzleDrawer {
	constructor(run) {
		this.run = run;
		this.run.log("Creating puzzle drawer.", 1);
		this.options = this.run.drawingOptions;
		for (let drawingOptionColorProperty of ["puzzleColor", "imageBackgroundColor"]) {
			if (!this.options[drawingOptionColorProperty] instanceof Color) {
				if ([null, undefined].includes(this.options[drawingOptionColorProperty])) {
					this.run.throwError(`Creating TwistyPuzzleDrawer with no property ${drawingOptionColorProperty}.`);
				} else {
					this.run.throwError(`Creating TwistyPuzzleDrawer with erroneous ${drawingOptionColorProperty}.`);
				}
			}
		}
		for (let drawingOptionNumericProperty of ["puzzleHeight", "puzzleWidth", "imageHeight", "imageWidth"]) {
			if (typeof this.options[drawingOptionNumericProperty] !== "number") {
				if (this.options[drawingOptionNumericProperty]) {
					this.run.throwError(`Creating TwistyPuzzleDrawer with erroneous ${drawingOptionNumericProperty}.`);
				} else {
					this.run.throwError(`Creating TwistyPuzzleDrawer with no property ${drawingOptionNumericProperty}.`);
				}
			}
		}
	};
}

class CubeDrawer extends TwistyPuzzleDrawer {
	constructor(run) {
		super(run);
		this.blankPuzzle = this.run.blankPuzzle;
		this.cubeSize = this.run.puzzle.size;
	};
}

class CubeIsometricDrawer extends CubeDrawer {
	constructor(run) {
		super(run);
	};
	createSvgSkeletton = () => { // todo
		this.run.log("CubeIsometricDrawer skeletton", 3);
	};
}

class CubePlanDrawer extends CubeDrawer {
	constructor(run) {
		super(run);
	};
	createSvgSkeletton = () => {
		this.run.log("CubePlanDrawer skeletton", 3);
		let svg = SVG.createSvgRootNode(this.options.imageHeight, this.options.imageWidth);
		let background = SVG.createRectNode(
			-this.options.imageHeight / 2,
			-this.options.imageWidth / 2,
			this.options.imageHeight,
			this.options.imageWidth,
			this.options.imageBackgroundColor,
			0,
			"background");
		svg.appendChild(background);
		let puzzleGroup = SVG.createGroupNode({
			id: "puzzle",
			transform: `scale(${this.options.puzzleWidth / 100}, ${this.options.puzzleHeight / 100})` // scale from (100, 100) to desired puzzle dimensions
		});
		
		
		puzzleGroup.appendChild(this.createSvgUFaceSkeletton());
		/*svg.appendChild(this.createSvgAdjacentFaceSkeletton("F", "", 4));
		svg.appendChild(this.createSvgAdjacentFaceSkeletton("R", "rotate(-90 0 0)", 8));
		svg.appendChild(this.createSvgAdjacentFaceSkeletton("B", "rotate(180 0 0)", 16));
		svg.appendChild(this.createSvgAdjacentFaceSkeletton("L", "rotate(90 0 0)", 20));*/
		
		
		svg.appendChild(puzzleGroup);
		this.skeletton = svg;
	};
	createSvgUFaceSkeletton = () => {
		let svgFace = SVG.createGroupNode({id: "face_U", transform: `scale(0.8, 0.8)`}); // todo scale should depend on puzzle size
		if (this.blankPuzzle.hasOrbitType(CenterCubeOrbit.type)) {
			//svgFace.appendChild(SVG.createRectNode(0, 0, 100, 100
		}
		//svgFace.appendChild(SVG.createRectNode(0, 0, 100, 100, this.options.puzzleColor, 5, "face_U_background"));
		svgFace.appendChild(SVG.createRectNode(
			-this.options.puzzleWidth / 2, -this.options.puzzleHeight / 2,
			this.options.puzzleWidth, this.options.puzzleHeight,
			this.options.puzzleColor, 5, "face_U_background"));
		return svgFace;
	};
	createSvgAdjacentFaceSkeletton = (faceName, transform, indexStart) => {
		let svgFaceContainer = SVG.createGroupNode({id: "face_" + faceName + "_container", style: "perspective: 100px"})
		let svgFace = SVG.createGroupNode({id: "face_" + faceName, transform: "rotateX(45deg)"});
		svgFace.appendChild(SVG.createRectNode(0, 0, 30, 100, this.options.puzzleColor, 5, `face_${faceName}_background`));
		// todo add stickers depending on orbit types
		svgFaceContainer.appendChild(svgFace);
		return svgFaceContainer;
	};
	drawPuzzle = puzzle => {
		let svg = SVG.clone(this.skeletton);
		// todo simply apply colors on stickers
		return svg;
	};
}

class CubeNetDrawer extends CubeDrawer {
	constructor(run) {
		super(run);
	};
	createSvgSkeletton = () => { // todo
		this.run.log("CubeNetDrawer skeletton", 3);
	};
}
