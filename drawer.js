"use strict";

// Represent the information of an SVG object.

class SVG {
	static pathElementMoveTo = "moveTo";
	static pathElementLineTo = "lineTo";
	static pathElementHorizontalLineTo = "horizontalLineTo";
	static pathElementVerticalLineTo = "verticalLineTo";
	static pathElementArc = "arc";
	static pathElementClose = "close";
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
		return SVG.createRectNode(id, horizontalPosition, verticalPosition, size, size, cornerRadius, cornerRadius, fillingColor);
	};
	static createRectNode = (id, horizontalPosition, verticalPosition, width, height, cornerRadiusX, cornerRadiusY, fillingColor) => {
		let rectObject = {
			id: id,
			x: horizontalPosition,
			y: verticalPosition,
			height: height,
			width: width
		};
		if (cornerRadiusX) {
			rectObject.rx = cornerRadiusX;
		}
		if (cornerRadiusY) {
			rectObject.ry = cornerRadiusY;
		}
		let svgRectTag = SVG.createNode("rect", rectObject);
		if (fillingColor) {
			SVG.fill(svgRectTag, fillingColor);
		}
		return svgRectTag;
	};
	static createPathNode = (id, pathElements, fillingColor) => {
		let dElements = [];
		for (let pathElement of pathElements) {
			switch (pathElement.type) {
				case SVG.pathElementMoveTo:
					dElements.push(`M ${pathElement.x} ${pathElement.y}`); break;
				case SVG.pathElementLineTo:
					dElements.push(`L ${pathElement.x} ${pathElement.y}`); break;
				case SVG.pathElementHorizontalLineTo:
					dElements.push(`H ${pathElement.x}`); break;
				case SVG.pathElementVerticalLineTo:
					dElements.push(`V ${pathElement.y}`); break;
				case SVG.pathElementArc:
					dElements.push(`A ${pathElement.rx} ${pathElement.ry} ${pathElement.rotation ?? 0} ${pathElement.large ? 1 : 0} ${pathElement.sweep} ${pathElement.x} ${pathElement.y}`); break;
				case SVG.pathElementClose:
					dElements.push("Z"); break;
				default: this.run.throwError(`Unknown path element type ${pathElement.type}.`);
			}
		}
		let pathTag = SVG.createNode("path", {id: id, d: dElements.join(" ")});
		SVG.fill(pathTag, fillingColor);
		return pathTag;
	};
	static createGroupNode = properties => {
		return SVG.createNode("g", properties);
	};
	static clone = svgNode => {
		return svgNode.cloneNode(true);
	};
	static fill = (svgElement, fillingColor) => {
		svgElement.setAttribute("fill", fillingColor.getRgbHex6());
		let alpha = fillingColor.getAlpha();
		if (alpha !== 1) {
			svgElement.setAttribute(["fill-opacity"], alpha);
		}
	};
}

// Represents the information of a puzzle image drawer.

class TwistyPuzzleDrawer {
	constructor(run) {
		this.run = run;
		this.run.logger.debugLog("Creating new TwistyPuzzleDrawer.");
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
		this.run.logger.debugLog("Creating new CubeDrawer.");
		this.blankPuzzle = this.run.blankPuzzle;
		this.cubeSize = this.run.puzzle.size;
	};
}

class CubeIsometricDrawer extends CubeDrawer {
	constructor(run) {
		super(run);
	};
	createSvgSkeletton = () => { // todo
	};
}

class CubePlanDrawer extends CubeDrawer {
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new CubePlanDrawer.");
		this.run.logger.debugLog("Initializing dimensions.");
		this.options.faceCornerRadius = 20 / this.cubeSize;
		this.options.stickerSize = 90 / this.cubeSize;
		this.options.stickerCornerRadius = 20 / this.cubeSize;
		this.options.uFaceStickerMargin = 10 / (this.cubeSize + 1);
		this.options.adjacentFaceStickerMargin = 2.5 / this.cubeSize;
		this.options.startingValues = [];
		for (let rank = 0; rank < this.cubeSize; rank++) {
			this.options.startingValues.push(- 50 + this.options.uFaceStickerMargin + rank * (this.options.stickerSize + this.options.uFaceStickerMargin));
		}
	};
	createSvgSkeletton = () => {
		this.run.logger.debugLog("Creating puzzle image skeletton");
		let svg = SVG.createSvgRootNode(this.options.imageHeight, this.options.imageWidth);
		let background = SVG.createRectNode(
			"background",
			-this.options.imageWidth / 2,
			-this.options.imageHeight / 2,
			this.options.imageWidth,
			this.options.imageHeight,
			0,
			0,
			this.options.imageBackgroundColor);
		svg.appendChild(background);
		let puzzleGroup = SVG.createGroupNode({
			id: "puzzle",
			transform: `scale(${this.options.puzzleWidth / 100}, ${this.options.puzzleHeight / 100})` // scale from (100, 100) to desired puzzle dimensions
		});
		this.run.logger.debugLog("Creating faces skeletton.");
		let scale = this.cubeSize / (this.cubeSize + 1);
		let uFace = SVG.createGroupNode({id: "face_U", transform: `scale(${scale}, ${scale})`});
		uFace.appendChild(SVG.createSquareNode( // face background
			"face_U_background",
			-50,
			-50,
			100,
			0,
			this.options.puzzleColor
		));
		let fFace = SVG.createGroupNode({id: "face_F", transform: `scale(${scale}, ${scale})`});
		fFace.appendChild(this.createAdjacentFaceBackground("F"));
		let rFace = SVG.createGroupNode({id: "face_R", transform: `scale(${scale}, ${scale}) rotate(-90 0 0)`});
		rFace.appendChild(this.createAdjacentFaceBackground("R"));
		let bFace = SVG.createGroupNode({id: "face_B", transform: `scale(${scale}, ${scale}) rotate(180 0 0)`});
		bFace.appendChild(this.createAdjacentFaceBackground("B"));
		let lFace = SVG.createGroupNode({id: "face_L", transform: `scale(${scale}, ${scale}) rotate(90 0 0)`});
		lFace.appendChild(this.createAdjacentFaceBackground("L"));
		if (this.blankPuzzle.hasOrbitType(CenterCubeOrbit.type)) { // sticker of type CenterCubeOrbit
			this.run.logger.debugLog("Creating centers stickers skeletton.");
			let startingValueIndex = (this.cubeSize - 1) / 2;
			let idBegin = `sticker_${CenterCubeOrbit.type}_`;
			uFace.appendChild(this.createUFaceSticker(`${idBegin}0`, startingValueIndex, startingValueIndex));
			if (this.blankPuzzle instanceof BlankCube1x1x1) {
				fFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}1`, 0));
				rFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}2`, 0));
				bFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}4`, 0));
				lFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}5`, 0));
			}
		}
		if (this.blankPuzzle.hasOrbitType(CornerCubeOrbit.type)) { // stickers of type CornerCubeOrbit
			this.run.logger.debugLog("Creating corners stickers skeletton.");
			let highIndex = this.cubeSize - 1;
			let idBegin = `sticker_${CornerCubeOrbit.type}_`;
			uFace.appendChild(this.createUFaceSticker(`${idBegin}0`, 0, 0));
			uFace.appendChild(this.createUFaceSticker(`${idBegin}1`, highIndex, 0));
			uFace.appendChild(this.createUFaceSticker(`${idBegin}2`, highIndex, highIndex));
			uFace.appendChild(this.createUFaceSticker(`${idBegin}3`, 0, highIndex));
			fFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}4`, 0));
			fFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}5`, highIndex));
			rFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}8`, 0));
			rFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}9`, highIndex));
			bFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}16`, 0));
			bFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}17`, highIndex));
			lFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}20`, 0));
			lFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}21`, highIndex));
		}
		if (this.blankPuzzle.hasOrbitType(MidgeCubeOrbit.type)) { // stickers of type MidgeCubeOrbit
			this.run.logger.debugLog("Creating midges stickers skeletton.");
			let middleIndex = (this.cubeSize - 1) / 2;
			let highIndex = this.cubeSize - 1;
			let idBegin = `sticker_${MidgeCubeOrbit.type}_`;
			uFace.appendChild(this.createUFaceSticker(`${idBegin}0`, middleIndex, 0));
			uFace.appendChild(this.createUFaceSticker(`${idBegin}1`, highIndex, middleIndex));
			uFace.appendChild(this.createUFaceSticker(`${idBegin}2`, middleIndex, highIndex));
			uFace.appendChild(this.createUFaceSticker(`${idBegin}3`, 0, middleIndex));
			fFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}4`, middleIndex));
			rFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}8`, middleIndex));
			bFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}16`, middleIndex));
			lFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}20`, middleIndex));
		}
		if (this.blankPuzzle.hasOrbitType(WingCubeOrbit.type)) { // stickers of type WingCubeOrbit
			this.run.logger.debugLog("Creating wings stickers skeletton.");
			let lowValue = this.options.startingValues[0];
			let highIndex = this.cubeSize - 1;
			let highValue = this.options.startingValues[this.cubeSize - 1];
			let wingMaxIndex = this.blankPuzzle.maxRankWithoutMiddle;
			for (let wingRank = 1; wingRank <= wingMaxIndex; wingRank++) {
				let idBegin = `sticker_${WingCubeOrbit.type}_${wingRank}_`;
				let middleComplementaryIndex = this.cubeSize - wingRank - 1;
				uFace.appendChild(this.createUFaceSticker(`${idBegin}0`, wingRank, 0));
				uFace.appendChild(this.createUFaceSticker(`${idBegin}1`, middleComplementaryIndex, 0));
				uFace.appendChild(this.createUFaceSticker(`${idBegin}2`, highIndex, wingRank));
				uFace.appendChild(this.createUFaceSticker(`${idBegin}3`, highIndex, middleComplementaryIndex));
				uFace.appendChild(this.createUFaceSticker(`${idBegin}4`, middleComplementaryIndex, highIndex));
				uFace.appendChild(this.createUFaceSticker(`${idBegin}5`, wingRank, highIndex));
				uFace.appendChild(this.createUFaceSticker(`${idBegin}6`, 0, middleComplementaryIndex));
				uFace.appendChild(this.createUFaceSticker(`${idBegin}7`, 0, wingRank));
				fFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}8`, wingRank));
				fFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}9`, middleComplementaryIndex));
				rFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}16`, wingRank));
				rFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}17`, middleComplementaryIndex));
				bFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}32`, wingRank));
				bFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}33`, middleComplementaryIndex));
				lFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}40`, wingRank));
				lFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}41`, middleComplementaryIndex));
			}
		}
		if (this.blankPuzzle.hasOrbitType(CenterBigCubeOrbit.type)) { // stickers of type CenterBigCubeOrbit
			this.run.logger.debugLog("Creating big cube centers stickers skeletton.");
			for (let firstRank = 1; firstRank <= this.blankPuzzle.maxRankWithoutMiddle; firstRank++) {
				let firstComplementaryIndex = this.cubeSize - firstRank - 1;
				for (let secondRank = 1; secondRank <= this.blankPuzzle.maxRankWithMiddle; secondRank++) {
					let idBegin = `sticker_${CenterBigCubeOrbit.type}_${firstRank}_${secondRank}_`;
					let secondComplementaryIndex = this.cubeSize - secondRank - 1;
					if (firstRank <= secondRank) {
						uFace.appendChild(this.createUFaceSticker(`${idBegin}0`, secondRank, firstRank));
						uFace.appendChild(this.createUFaceSticker(`${idBegin}1`, firstComplementaryIndex, secondRank));
						uFace.appendChild(this.createUFaceSticker(`${idBegin}2`, secondComplementaryIndex, firstComplementaryIndex));
						uFace.appendChild(this.createUFaceSticker(`${idBegin}3`, firstRank, secondComplementaryIndex));
					} else {
						uFace.appendChild(this.createUFaceSticker(`${idBegin}3`, secondRank, firstRank));
						uFace.appendChild(this.createUFaceSticker(`${idBegin}0`, firstComplementaryIndex, secondRank));
						uFace.appendChild(this.createUFaceSticker(`${idBegin}1`, secondComplementaryIndex, firstComplementaryIndex));
						uFace.appendChild(this.createUFaceSticker(`${idBegin}2`, firstRank, secondComplementaryIndex));
					}
				}
			}
		}
		puzzleGroup.appendChild(uFace);
		puzzleGroup.appendChild(fFace);
		puzzleGroup.appendChild(rFace);
		puzzleGroup.appendChild(bFace);
		puzzleGroup.appendChild(lFace);
		svg.appendChild(puzzleGroup);
		this.skeletton = svg;
	};
	createUFaceSticker = (id, gridStartingX, gridStartingY) => {
		return SVG.createSquareNode(
			id,
			this.options.startingValues[gridStartingX],
			this.options.startingValues[gridStartingY],
			this.options.stickerSize,
			this.options.stickerCornerRadius
		);
	};
	createAdjacentFaceBackground = faceName => {
		this.options.faceCornerRadius
		return SVG.createPathNode(`face_${faceName}_background`,
			[
				{type: SVG.pathElementMoveTo, x: -50, y: 50},
				{type: SVG.pathElementVerticalLineTo, y: 50 + 50 / this.cubeSize - this.options.faceCornerRadius / 2},
				{type: SVG.pathElementArc, x: - 50 + this.options.faceCornerRadius, y: 50 + 50 / this.cubeSize, rx: this.options.faceCornerRadius, ry: this.options.faceCornerRadius / 2, sweep: 0, large: false},
				{type: SVG.pathElementHorizontalLineTo, x: 50 - this.options.faceCornerRadius},
				{type: SVG.pathElementArc, x: 50, y: 50 + 50 / this.cubeSize - this.options.faceCornerRadius / 2, rx: this.options.faceCornerRadius, ry: this.options.faceCornerRadius / 2, sweep: 0, large: false},
				{type: SVG.pathElementVerticalLineTo, y: 50},
				{type: SVG.pathElementClose}
			],
			this.options.puzzleColor);
	};
	createAdjacentFaceSticker = (id, gridStarting) => {
		return SVG.createRectNode(
			id,
			this.options.startingValues[gridStarting],
			50 + this.options.adjacentFaceStickerMargin,
			this.options.stickerSize,
			this.options.stickerSize / 2,
			this.options.stickerCornerRadius,
			this.options.stickerCornerRadius / 2
		);
	};
	drawPuzzle = puzzle => { // clone skeletton and apply colors on each displayed sticker
		this.run.logger.generalLog("Drawing puzzle.");
		this.run.logger.debugLog("Cloning skeletton.");
		let svg = SVG.clone(this.skeletton);
		for (let orbit of puzzle.orbitList) {
			this.run.logger.detailedLog(`Coloring stickers of orbit type ${orbit.type}`
				+ (orbit.type === WingCubeOrbit.type ? ` (rank = ${orbit.rank})` : "")
				+ (orbit.type === CenterBigCubeOrbit.type ? ` (ranks = [${orbit.ranks.join(", ")}])` : "")
				+ ".");
			let slotIndexList = [];
			let selectorBegin = `rect#sticker_${orbit.type}_`;
			switch (orbit.type) {
				case CornerCubeOrbit.type: slotIndexList = [0, 1, 2, 3, 4, 5, 8, 9, 16, 17, 20, 21]; break;
				case MidgeCubeOrbit.type: slotIndexList = [0, 1, 2, 3, 4, 8, 16, 20]; break;
				case CenterCubeOrbit.type: slotIndexList = this.blankPuzzle instanceof BlankCube1x1x1 ? [0, 1, 2, 4, 5] : [0]; break;
				case WingCubeOrbit.type:
					slotIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 32, 33, 40, 41];
					selectorBegin += `${orbit.rank}_`;
					break;
				case CenterBigCubeOrbit.type:
					slotIndexList = [0, 1, 2, 3];
					selectorBegin += `${orbit.ranks[0]}_${orbit.ranks[1]}_`;
					break;
				default:
					this.run.throwError(`Unknown cube orbit type "${orbit.type}"`);
			}
			for (let slotIndex of slotIndexList) {
				SVG.fill(svg.querySelector(`${selectorBegin}${slotIndex}`),
					orbit.slotList[slotIndex].getContent().color);
			}
		}
		return svg;
	};
}

class CubeNetDrawer extends CubeDrawer {
	constructor(run) {
		super(run);
	};
	createSvgSkeletton = () => { // todo
	};
}
