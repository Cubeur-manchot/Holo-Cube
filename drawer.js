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
			viewBox: `${-width/2} ${-height/2} ${width} ${height}`
		});
	};
	static createSquareNode = (id, horizontalPosition, verticalPosition, size, cornerRadius, fillingColor) => {
		return SVG.createRectNode(id, horizontalPosition, verticalPosition, size, size, cornerRadius, fillingColor);
	};
	static createRectNode = (id, horizontalPosition, verticalPosition, height, width, borderRadius, fillingColor) => {
		let rectObject = {
			id: id,
			x: horizontalPosition,
			y: verticalPosition,
			height: height,
			width: width,
			rx: borderRadius,
			ry: borderRadius
		};
		if (fillingColor) {
			rectObject.fill = fillingColor.getRgbHex6();
			let alpha = fillingColor.getAlpha();
			if (alpha !== 1) {
				rectObject["fill-opacity"] = alpha;
			}
		}
		return SVG.createNode("rect", rectObject);
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
		this.options.faceCornerRadius = 30 / this.cubeSize;
		this.options.stickerSize = 90 / this.cubeSize;
		this.options.stickerCornerRadius = 20 / this.cubeSize;
		let stickerMargin = 10 / (this.cubeSize + 1);
		this.options.startingValues = [];
		for (let rank = 0; rank < this.cubeSize; rank++) {
			this.options.startingValues.push(- 50 + stickerMargin + rank * (this.options.stickerSize + stickerMargin));
		}
		
	};
	createSvgSkeletton = () => {
		this.run.log("CubePlanDrawer skeletton", 3);
		let svg = SVG.createSvgRootNode(this.options.imageHeight, this.options.imageWidth);
		let background = SVG.createRectNode(
			"background",
			-this.options.imageHeight / 2,
			-this.options.imageWidth / 2,
			this.options.imageHeight,
			this.options.imageWidth,
			0,
			this.options.imageBackgroundColor);
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
	createUFaceSticker = (id, gridStartingX, gridStartingY) => {
		return SVG.createSquareNode(
			id,
			this.options.startingValues[gridStartingX],
			this.options.startingValues[gridStartingY],
			this.options.stickerSize,
			this.options.stickerCornerRadius,
			new Color("white"));
	};
	createSvgUFaceSkeletton = () => {
		let svgFace = SVG.createGroupNode({id: "face_U", transform: `scale(0.8, 0.8)`}); // todo scale should depend on puzzle size
		svgFace.appendChild(SVG.createSquareNode( // face background
			"face_U_background",
			-50,
			-50,
			100,
			this.options.faceCornerRadius,
			this.options.puzzleColor));
		
		if (this.blankPuzzle.hasOrbitType(CenterCubeOrbit.type)) { // sticker of type CenterCubeOrbit
			let startingValueIndex = (this.cubeSize - 1) / 2;
			svgFace.appendChild(this.createUFaceSticker(`sticker_${CenterCubeOrbit.type}_0`, startingValueIndex, startingValueIndex));
		}
		if (this.blankPuzzle.hasOrbitType(CornerCubeOrbit.type)) { // stickers of type CornerCubeOrbit
			let highIndex = this.cubeSize - 1;
			let idBegin = `sticker_${CornerCubeOrbit.type}_`;
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}0`, 0, 0));
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}1`, highIndex, 0));
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}2`, highIndex, highIndex));
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}3`, 0, highIndex));
		}
		if (this.blankPuzzle.hasOrbitType(MidgeCubeOrbit.type)) { // stickers of type MidgeCubeOrbit
			let middleIndex = (this.cubeSize - 1) / 2;
			let highIndex = this.cubeSize - 1;
			let idBegin = `sticker_${MidgeCubeOrbit.type}_`;
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}0`, middleIndex, 0));
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}1`, highIndex, middleIndex));
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}2`, middleIndex, highIndex));
			svgFace.appendChild(this.createUFaceSticker(`${idBegin}3`, 0, middleIndex));
		}
		if (this.blankPuzzle.hasOrbitType(WingCubeOrbit.type)) { // stickers of type WingCubeOrbit
			let lowValue = this.options.startingValues[0];
			let highIndex = this.cubeSize - 1;
			let highValue = this.options.startingValues[this.cubeSize - 1];
			let wingMaxIndex = this.blankPuzzle.maxRankWithoutMiddle;
			for (let wingRank = 1; wingRank <= wingMaxIndex; wingRank++) {
				let idBegin = `sticker_${WingCubeOrbit.type}_${wingRank}_`;
				let middleComplementaryIndex = this.cubeSize - wingRank - 1;
				
				
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}0`, wingRank, 0));
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}1`, middleComplementaryIndex, 0));
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}2`, highIndex, wingRank));
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}3`, highIndex, middleComplementaryIndex));
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}4`, middleComplementaryIndex, highIndex));
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}5`, wingRank, highIndex));
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}6`, 0, wingRank));
				svgFace.appendChild(this.createUFaceSticker(`${idBegin}7`, 0, middleComplementaryIndex));
			}
		}
		if (this.blankPuzzle.hasOrbitType(CenterBigCubeOrbit.type)) { // stickers of type CenterBigCubeOrbit
			for (let firstRank = 1; firstRank <= this.blankPuzzle.maxRankWithoutMiddle; firstRank++) {
				let firstComplementaryIndex = this.cubeSize - firstRank - 1;
				for (let secondRank = 1; secondRank <= this.blankPuzzle.maxRankWithMiddle; secondRank++) {
					let idBegin = `sticker_${CenterBigCubeOrbit.type}_${firstRank}_${secondRank}_`;
					let secondComplementaryIndex = this.cubeSize - secondRank - 1;
					svgFace.appendChild(this.createUFaceSticker(`${idBegin}0`, secondRank, firstRank));
					svgFace.appendChild(this.createUFaceSticker(`${idBegin}0`, firstComplementaryIndex, secondRank));
					svgFace.appendChild(this.createUFaceSticker(`${idBegin}0`, secondComplementaryIndex, firstComplementaryIndex));
					svgFace.appendChild(this.createUFaceSticker(`${idBegin}0`, firstRank, secondComplementaryIndex));
				}
			}
		}
		return svgFace;
	};
	createSvgAdjacentFaceSkeletton = (faceName, transform, indexStart) => {
		let svgFaceContainer = SVG.createGroupNode({id: "face_" + faceName + "_container", style: "perspective: 100px"})
		let svgFace = SVG.createGroupNode({id: "face_" + faceName, transform: "rotateX(45deg)"});
		svgFace.appendChild(SVG.createRectNode(`face_${faceName}_background`, 0, 0, 30, 100, 5, this.options.puzzleColor));
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
