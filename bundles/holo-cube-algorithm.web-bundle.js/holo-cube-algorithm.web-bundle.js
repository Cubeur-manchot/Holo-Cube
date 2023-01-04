
// Defines all known colors.

class ColorCollection {
	static transparent = {r: 0, g: 0, b: 0, a: 0};
	static white = {r: 255, g: 255, b: 255, a: 1};
	static black = {r: 0, g: 0, b: 0, a: 1};
	static green = {r: 0, g: 216, b: 0, a: 1};
	static red = {r: 255, g: 0, b: 0, a: 1};
	static yellow = {r: 255, g: 255, b: 0, a: 1};
	static orange = {r: 255, g: 127, b: 0, a: 1};
	static blue = {r: 0, g: 0, b: 255, a: 1};
	static grey = {r: 153, g: 153, b: 153};
	static lightGreen = {r: 119, g: 238, b: 0};
	static purple = {r: 136, g: 17, b: 255};
	static lightYellow = {r: 255, g: 255, b: 187};
	static lightBlue = {r: 136, g: 221, b: 255};
	static brown = {r: 255, g: 136, b: 51};
	static pink = {r: 255, g: 153, b: 255};
}

// Represents the information of a color, including opacity.

class Color {
	constructor(colorString) {
		if (Color.isHex6(colorString)) {
			this.r = parseInt(colorString.substr(1, 2), 16);
			this.g = parseInt(colorString.substr(3, 2), 16);
			this.b = parseInt(colorString.substr(5, 2), 16);
			this.a = 1;
		} else if (Color.isHex3(colorString)) {
			this.r = 17 * parseInt(colorString[1]);
			this.g = 17 * parseInt(colorString[2]);
			this.b = 17 * parseInt(colorString[3]);
			this.a = 1;
		} else if (Color.isRgb(colorString)) {
			[this.r, this.g, this.b] = colorString.match(/\d+/g);
			this.a = 1;
		} else if (Color.isRgba(colorString)) {
			let numbers = colorString.replace(/^.*\(/g, "").replace(/\).*$/g, "").replace(/\s+/g, "").split(",");
			this.r = parseInt(numbers[0]);
			this.g = parseInt(numbers[1]);
			this.b = parseInt(numbers[2]);
			this.a = parseFloat(numbers[3]);
		} else if (Color.isKnownColor(colorString)) {
			Object.assign(this, Color.getKnownColor(colorString));
		}
	};
	static checkFormat = colorString => {
		return Color.isHex6(colorString)
			|| Color.isHex3(colorString)
			|| Color.isRgb(colorString)
			|| Color.isRgba(colorString)
			|| Color.isKnownColor(colorString);
	};
	static isHex6 = colorString => {
		return /^#[0-9a-f]{6}$/i.test(colorString);
	};
	static isHex3 = colorString => {
		return /^#[0-9a-f]{3}$/i.test(colorString);
	};
	static isRgb = colorString => {
		if(!/^rgb\( *\d+ *, *\d+ *, *\d+ *\)$/.test(colorString)) {
			return false;
		}
		for (let rgbValue of colorString.match(/\d+/)) {
			if (parseInt(rgbValue) > 255) {
				return false;
			}
		}
		return true;
	};
	static isRgba = colorString => {
		if(!/^rgba\( *\d+ *, *\d+ *, *\d+ *, *([0-1]|0?\.\d+) *\)$/.test(colorString)) {
			return false;
		}
		let rgbValues = colorString.replace(/ /g, "").replace(/^.*\(/, "").replace(")", "").split(",");
		for (let rgbIndex of [0, 1, 2]) {
			if (parseInt(rgbValues[rgbIndex]) > 255) {
				return false;
			}
		}
		return true;
	};
	static knownColors = {
		transparent: ColorCollection.transparent,  t: ColorCollection.transparent,
		black:       ColorCollection.black,       bl: ColorCollection.black,
		white:       ColorCollection.white,        w: ColorCollection.white,
		green:       ColorCollection.green,        g: ColorCollection.green,
		red:         ColorCollection.red,          r: ColorCollection.red,
		yellow:      ColorCollection.yellow,       y: ColorCollection.yellow,
		blue:        ColorCollection.blue,         b: ColorCollection.blue,
		orange:      ColorCollection.orange,       o: ColorCollection.orange,
		purple:      ColorCollection.purple,      pu: ColorCollection.purple,
		grey:        ColorCollection.grey,        gy: ColorCollection.grey,
		lightGreen:  ColorCollection.lightGreen,  lg: ColorCollection.lightGreen,
		lightYellow: ColorCollection.lightYellow, ly: ColorCollection.lightYellow,
		lightBlue:   ColorCollection.lightBlue,   lb: ColorCollection.lightBlue,
		brown:       ColorCollection.brown,       br: ColorCollection.brown,
		pink:        ColorCollection.pink,        pi: ColorCollection.pink,
	};
	static isKnownColor = colorString => {
		return Color.knownColors[colorString] !== undefined;
	};
	static getKnownColorString = color => {
		for (let knownColorName in Color.knownColors) {
			let knownColor = Color.knownColors[knownColorName];
			if (color.r === knownColor.r && color.g === knownColor.g && color.b === knownColor.b) {
				return knownColorName;
			}
		}
		return null;
	};
	static getKnownColor = colorString => {
		return Color.knownColors[colorString];
	};
	getRgbHex6 = () => {
		return "#"
			+ (this.r <= 16 ? "0" : "") + this.r.toString(16)
			+ (this.g <= 16 ? "0" : "") + this.g.toString(16)
			+ (this.b <= 16 ? "0" : "") + this.b.toString(16);
	};
	getAlpha = () => {
		return this.a;
	};
	getRgba = () => {
		return `rgba(${this.r ?? 0}, ${this.g ?? 0}, ${this.b ?? 0}, ${this.a ?? 0})`;
	};
}

// Represents one cycle of permutation on an orbit.

class Cycle {
	constructor(cycle, orbitType, run, orbitRankOrRanks) {
		this.run = run;
		this.slotIndexList = cycle;
		this.orbitType = orbitType;
		if (typeof orbitRankOrRanks === "number") {
			this.orbitRank = orbitRankOrRanks;
		} else if (orbitRankOrRanks?.length) {
			this.orbitRanks = orbitRankOrRanks;
		}
	};
	getLength = () => {
		return this.slotIndexList?.length ?? 0;
	};
	getLastSlot = () => {
		return this.slotIndexList[this.slotIndexList.length - 1];
	};
	applyOnOrbit = orbit => {
		if (!this.getLength()) {
			this.run.throwError("Applying cycle of length 0.");
		}
		if (this.getLength() === 1) {
			this.run.logger.debugLog("Ignoring cycle of length 1.");
			return;
		}
		if (!orbit) {
			this.run.throwError("Applying cycle on undefined orbit.");
		}
		if (this.orbitType !== orbit.type) {
		this.run.logger.debugLog(`Ignoring cycle because cycle orbit type (${this.orbitType}) and orbit type ({orbit.type}) are different.`);
			return;
		}
		if (orbit instanceof WingCubeOrbit && this.orbitRank !== orbit.rank) {
			this.run.logger.debugLog(`Ignoring cycle because cyle orbit rank (${this.orbitRank}) and orbit rank (${orbit.rank}) are different.`);
			return;
		}
		if (orbit instanceof CenterBigCubeOrbit && !(this.orbitRanks[0] === orbit.ranks[0] && this.orbitRanks[1] === orbit.ranks[1])) {
			this.run.logger.debugLog(`Ignoring cycle because cyle orbit ranks (${this.orbitRanks.join(", ")}) and orbit rank (${orbit.ranks.join(", ")}) are different.`);
			return;
		}
		if (!orbit.getSize()) {
			this.run.throwError("Applying cycle on orbit of size 0.");
		}
		if (!orbit.slotList) {
			this.run.throwError("Applying cycle on a cycle with no slot list.");
		}
		this.run.logger.debugLog(`Applying cycle of length ${this.getLength()} on orbit type ${this.orbitType}`
			+ (orbit.rank ? ` (rank = ${orbit.rank})` : "")
			+ (orbit.ranks ? ` (ranks = [${orbit.ranks}])` : "")
			+ ".");
		let cycleEndSlotContent = orbit.slotList[this.getLastSlot()].getContent();
		for (let cycleElementIndex = this.getLength() - 1; cycleElementIndex > 0; cycleElementIndex--) {
			orbit.slotList[this.slotIndexList[cycleElementIndex]].setContent(orbit.slotList[this.slotIndexList[cycleElementIndex - 1]].getContent());
		}
		orbit.slotList[this.slotIndexList[0]].setContent(cycleEndSlotContent);
	};
}

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

// Represent the information of a logger.

/* Log mode is one of the following :
- "console" : logs are written in the console (either the browser console or AlgBot's console)
- "result" : logs are written in the json output
- "htmlTag" : logs are written in the specified htmlTag in a web page
*/

class Logger { // doesn't write any log
	static consoleLog = console.log;
	resultLog = message => {
		this.run.logs += message + "\n";
	};
	static offLog = () => {};
	htmlLog = message => {
		this.logHtmlTag.innerHTML += message + "<br/>";
	};
	constructor (mode, run, htmlTag) {
		this.run = run;
		this.mode = mode;
		switch (mode) {
			case "console":this.log = Logger.consoleLog; break;
			case "result": this.run.logs = ""; this.log = this.resultLog; break;
			case "htmlTag": this.logHtmlTag = htmlTag; this.log = this.htmlLog; break;
			case "off": this.log = Logger.offLog; break;
			default: this.run.throwError(`Invalid log mode ${mode}.`);
			// todo probably add Google Sheet cell as a mode
		}
	};
	errorLog = () => {};
	warningLog = message => {
		this.detailedLog(`[Warning] ${message}`);
	};
	generalLog = () => {};
	detailedLog = () => {};
	debugLog = () => {};
}

class ErrorLogger extends Logger { // writes only error logs
	constructor (mode, run, htmlTag) {
		super(mode, run, htmlTag);
	};
	errorLog = message => {
		this.log(`[Error] ${message}`);
	};
}

class GeneralLogger extends ErrorLogger { // writes general informative logs
	constructor (mode, run, htmlTag) {
		super(mode, run, htmlTag);
	};
	generalLog = this.log;
}

class DetailedLogger extends GeneralLogger { // writes detailed informative logs and warning logs
	constructor (mode, run, htmlTag) {
		super(mode, run, htmlTag);
	};
	detailedLog = this.log;
}

class DebugLogger extends DetailedLogger { // writes all logs for debug
	constructor (mode, run, htmlTag) {
		super(mode, run, htmlTag);
	};
	debugLog = this.log;
}

// Represents the information of a move sequence.

class MoveSequence {
	constructor(moves, run) {
		this.run = run;
		this.run.logger.generalLog("Creating new MoveSequence.");
		this.moveList = moves ?? [];
	};
	appendMove = move => {
		this.moveList.push(move);
	};
	applyOnPuzzle = puzzle => {
		this.run.logger.generalLog(`Applying move sequence of length ${this.moveList.length} on a solved puzzle.`);
		this.moveList.forEach(move => move.applyOnPuzzle(puzzle));
	};
};

// Represent the permutation induced by a move in terms of cycles.

class Move {
	constructor(run) {
		this.run = run;
		this.run.logger.debugLog("Creating new Move.");
		this.cycles = [];
	};
	getCycleList = () => {
		return this.cycles;
	};
	pushCycles = (cycles, orbitType, rankOrRanks) => {
		for (let slotList of cycles) {
			this.cycles.push(new Cycle(slotList, orbitType, this.run, rankOrRanks));
		}
	};
	applyOnPuzzle = puzzle => {
		this.run.logger.detailedLog("Applying move on puzzle.");
		for (let cycle of this.getCycleList()) {
			for (let orbit of puzzle.orbitList) {
				if (cycle.orbitType === orbit.type) {
					cycle.applyOnOrbit(orbit);
				}
			}
		}
	};
}

class CubeMove extends Move {
	static externalMode = "external";
	static internalMode = "internal";
	static semiExternalMode = "semiExternal";
	static internalDirectMode = "internalDirect";
	static internalIndirectMode = "internalIndirect";
	static elementaryCycles = {
		centerCubeOrbit: {
			internal: {
				U: [[], [[1, 5, 4, 2]], [[1, 4], [2, 5]], [[1, 2, 4, 5]]],
				F: [[], [[0, 2, 3, 5]], [[0, 3], [2, 5]], [[0, 5, 3, 2]]],
				R: [[], [[0, 4, 3, 1]], [[0, 3], [1, 4]], [[0, 1, 3, 4]]],
				D: [[], [[1, 2, 4, 5]], [[1, 4], [2, 5]], [[1, 5, 4, 2]]],
				B: [[], [[0, 5, 3, 2]], [[0, 3], [2, 5]], [[0, 2, 3, 5]]],
				L: [[], [[0, 1, 3, 4]], [[0, 3], [1, 4]], [[0, 4, 3, 1]]]
			}
		},
		cornerCubeOrbit: {
			external: {
				U: [[], [[ 0,  1,  2,  3]], [[ 0,  2], [ 1,  3]], [[ 0,  3,  2,  1]]],
				F: [[], [[ 4,  5,  6,  7]], [[ 4,  6], [ 5,  7]], [[ 4,  7,  6,  5]]],
				R: [[], [[ 8,  9, 10, 11]], [[ 8, 10], [ 9, 11]], [[ 8, 11, 10,  9]]],
				D: [[], [[12, 13, 14, 15]], [[12, 14], [13, 15]], [[12, 15, 14, 13]]],
				B: [[], [[16, 17, 18, 19]], [[16, 18], [17, 19]], [[16, 19, 18, 17]]],
				L: [[], [[20, 21, 22, 23]], [[20, 22], [21, 23]], [[20, 23, 22, 21]]]
			},
			semiExternal: {
				U: [[], [[ 4, 20, 16,  8], [ 5, 21, 17,  9]], [[ 4, 16], [ 5, 17], [ 8, 20], [ 9, 21]], [[ 4,  8, 16, 20], [ 5,  9, 17, 21]]],
				F: [[], [[ 2, 11, 12, 21], [ 3,  8, 13, 22]], [[ 2, 12], [ 3, 13], [ 8, 22], [11, 21]], [[ 2, 21, 12, 11], [ 3, 22, 13,  8]]],
				R: [[], [[ 1, 19, 13,  5], [ 2, 16, 14,  6]], [[ 1, 13], [ 2, 14], [ 5, 19], [ 6, 16]], [[ 1,  5, 13, 19], [ 2,  6, 14, 16]]],
				D: [[], [[ 6, 10, 18, 22], [ 7, 11, 19, 23]], [[ 6, 18], [ 7, 19], [10, 22], [11, 23]], [[ 6, 22, 18, 10], [ 7, 23, 19, 11]]],
				B: [[], [[ 0, 23, 14,  9], [ 1, 20, 15, 10]], [[ 0, 14], [ 1, 15], [ 9, 23], [10, 20]], [[ 0,  9, 14, 23], [ 1, 10, 15, 20]]],
				L: [[], [[ 0,  4, 12, 18], [ 3,  7, 15, 17]], [[ 0, 12], [ 3, 15], [ 4, 18], [ 7, 17]], [[ 0, 18, 12,  4], [ 3, 17, 15,  7]]]
			}
		},
		midgeCubeOrbit: {
			external: {
				U: [[], [[ 0,  1,  2,  3]], [[ 0,  2], [ 1,  3]], [[ 0,  3,  2,  1]]],
				F: [[], [[ 4,  5,  6,  7]], [[ 4,  6], [ 5,  7]], [[ 4,  7,  6,  5]]],
				R: [[], [[ 8,  9, 10, 11]], [[ 8, 10], [ 9, 11]], [[ 8, 11, 10,  9]]],
				D: [[], [[12, 13, 14, 15]], [[12, 14], [13, 15]], [[12, 15, 14, 13]]],
				B: [[], [[16, 17, 18, 19]], [[16, 18], [17, 19]], [[16, 19, 18, 17]]],
				L: [[], [[20, 21, 22, 23]], [[20, 22], [21, 23]], [[20, 23, 22, 21]]]
			},
			semiExternal: {
				U: [[], [[ 4, 20, 16,  8]], [[ 4, 16], [ 8, 20]], [[ 4,  8, 16, 20]]],
				F: [[], [[ 2, 11, 12, 21]], [[ 2, 12], [11, 21]], [[ 2, 21, 12, 11]]],
				R: [[], [[ 1, 19, 13,  5]], [[ 1, 13], [ 5, 19]], [[ 1,  5, 13, 19]]],
				D: [[], [[ 6, 10, 18, 22]], [[ 6, 18], [10, 22]], [[ 6, 22, 18, 10]]],
				B: [[], [[ 0, 23, 14,  9]], [[ 0, 14], [ 9, 23]], [[ 0,  9, 14, 23]]],
				L: [[], [[ 3,  7, 15, 17]], [[ 3, 15], [ 7, 17]], [[ 3, 17, 15,  7]]]
			},
			internal: {
				U: [[], [[ 5, 21, 17,  9], [ 7, 23, 19, 11]], [[ 5, 17], [ 7, 19], [ 9, 21], [11, 23]], [[ 5,  9, 17, 21], [ 7, 11, 19, 23]]],
				F: [[], [[ 1, 10, 15, 20], [ 3,  8, 13, 22]], [[ 1, 15], [ 3, 13], [ 8, 22], [10, 20]], [[ 1, 20, 15, 10], [ 3, 22, 13,  8]]],
				R: [[], [[ 0, 18, 12,  4], [ 2, 16, 14,  6]], [[ 0, 12], [ 2, 14], [ 4, 18], [ 6, 16]], [[ 0,  4, 12, 18], [ 2,  6, 14, 16]]],
				D: [[], [[ 5,  9, 17, 21], [ 7, 11, 19, 23]], [[ 5, 17], [ 7, 19], [ 9, 21], [11, 23]], [[ 5, 21, 17,  9], [ 7, 23, 19, 11]]],
				B: [[], [[ 1, 20, 15, 10], [ 3, 22, 13,  8]], [[ 1, 15], [ 3, 13], [ 8, 22], [10, 20]], [[ 1, 10, 15, 20], [ 3,  8, 13, 22]]],
				L: [[], [[ 0,  4, 12, 18], [ 2,  6, 14, 16]], [[ 0, 12], [ 2, 14], [ 4, 18], [ 6, 16]], [[ 0, 18, 12,  4], [ 2, 16, 14,  6]]]
			}
		},
		wingCubeOrbit: {
			external: {
				U: [[], [[ 0,  2,  4,  6], [ 1,  3,  5,  7]], [[ 0,  4], [ 1,  5], [ 2,  6], [ 3,  7]], [[ 0,  6,  4,  2], [ 1,  7,  5,  3]]],
				F: [[], [[ 8, 10, 12, 14], [ 9, 11, 13, 15]], [[ 8, 12], [ 9, 13], [10, 14], [11, 15]], [[ 8, 14, 12, 10], [ 9, 15, 13, 11]]],
				R: [[], [[16, 18, 20, 22], [17, 19, 21, 23]], [[16, 20], [17, 21], [18, 22], [19, 23]], [[16, 22, 20, 18], [17, 23, 21, 19]]],
				D: [[], [[24, 26, 28, 30], [25, 27, 29, 31]], [[24, 28], [25, 29], [26, 30], [27, 31]], [[24, 30, 28, 26], [25, 31, 29, 27]]],
				B: [[], [[32, 34, 36, 38], [33, 35, 37, 39]], [[32, 36], [33, 37], [34, 38], [35, 39]], [[32, 38, 36, 34], [33, 39, 37, 35]]],
				L: [[], [[40, 42, 44, 46], [41, 43, 45, 47]], [[40, 44], [41, 45], [42, 46], [43, 47]], [[40, 46, 44, 42], [41, 47, 45, 43]]]
			},
			semiExternal: {
				U: [[], [[ 8, 40, 32, 16], [ 9, 41, 33, 17]], [[ 8, 32], [ 9, 33], [16, 40], [17, 41]], [[ 8, 16, 32, 40], [ 9, 17, 33, 41]]],
				F: [[], [[ 4, 22, 24, 42], [ 5, 23, 25, 43]], [[ 4, 24], [ 5, 25], [22, 42], [23, 43]], [[ 4, 42, 24, 22], [ 5, 43, 25, 23]]],
				R: [[], [[ 2, 38, 26, 10], [ 3, 39, 27, 11]], [[ 2, 26], [ 3, 27], [10, 38], [11, 39]], [[ 2, 10, 26, 38], [ 3, 11, 27, 39]]],
				D: [[], [[12, 20, 36, 44], [13, 21, 37, 45]], [[12, 36], [13, 37], [20, 44], [21, 45]], [[12, 44, 36, 20], [13, 45, 37, 21]]],
				B: [[], [[ 0, 46, 28, 18], [ 1, 47, 29, 19]], [[ 0, 28], [ 1, 29], [18, 46], [19, 47]], [[ 0, 18, 28, 46], [ 1, 19, 29, 47]]],
				L: [[], [[ 6, 14, 30, 34], [ 7, 15, 31, 35]], [[ 6, 30], [ 7, 31], [14, 34], [15, 35]], [[ 6, 34, 30, 14], [ 7, 35, 31, 15]]]
			},
			internal: {
				U: [[], [[10, 42, 34, 18], [15, 47, 39, 23]], [[10, 34], [15, 39], [18, 42], [23, 47]], [[10, 18, 34, 42], [15, 23, 39, 47]]],
				F: [[], [[ 3, 21, 26, 44], [ 6, 16, 31, 41]], [[ 3, 26], [ 6, 31], [16, 41], [21, 44]], [[ 3, 44, 26, 21], [ 6, 41, 31, 16]]],
				R: [[], [[ 1, 37, 25,  9], [ 4, 32, 28, 12]], [[ 1, 25], [ 4, 28], [ 9, 37], [12, 32]], [[ 1,  9, 25, 37], [ 4, 12, 28, 32]]],
				D: [[], [[11, 19, 35, 43], [14, 22, 38, 46]], [[11, 35], [14, 38], [19, 43], [22, 46]], [[11, 43, 35, 19], [14, 46, 38, 22]]],
				B: [[], [[ 2, 40, 30, 20], [ 7, 45, 27, 17]], [[ 2, 30], [ 7, 27], [17, 45], [20, 40]], [[ 2, 20, 30, 40], [ 7, 17, 27, 45]]],
				L: [[], [[ 0,  8, 24, 36], [ 5, 13, 29, 33]], [[ 0, 24], [ 5, 29], [ 8, 36], [13, 33]], [[ 0, 36, 24,  8], [ 5, 33, 29, 13]]]
			}
		},
		centerBigCubeOrbit: {
			internalDirect: {
				U: [[], [[ 7, 23, 19, 11]], [[ 7, 19], [11, 23]], [[ 7, 11, 19, 23]]],
				F: [[], [[ 1, 10, 15, 20]], [[ 1, 15], [10, 20]], [[ 1, 20, 15, 10]]],
				R: [[], [[ 0, 18, 12,  4]], [[ 0, 12], [ 4, 18]], [[ 0,  4, 12, 18]]],
				D: [[], [[ 5,  9, 17, 21]], [[ 5, 17], [ 9, 21]], [[ 5, 21, 17,  9]]],
				B: [[], [[ 3, 22, 13,  8]], [[ 3, 13], [ 8, 22]], [[ 3,  8, 13, 22]]],
				L: [[], [[ 2,  6, 14, 16]], [[ 2, 14], [ 6, 16]], [[ 2, 16, 14,  6]]]
			},
			internalIndirect: {
				U: [[], [[ 5, 21, 17,  9]], [[ 5, 17], [ 9, 21]], [[ 5,  9, 17, 21]]],
				F: [[], [[ 3,  8, 13, 22]], [[ 3, 13], [ 8, 22]], [[ 3, 22, 13,  8]]],
				R: [[], [[ 2, 16, 14,  6]], [[ 2, 14], [ 6, 16]], [[ 2,  6, 14, 16]]],
				D: [[], [[ 7, 11, 19, 23]], [[ 7, 19], [11, 23]], [[ 7, 23, 19, 11]]],
				B: [[], [[ 1, 20, 15, 10]], [[ 1, 15], [10, 20]], [[ 1, 10, 15, 20]]],
				L: [[], [[ 0,  4, 12, 18]], [[ 0, 12], [ 4, 18]], [[ 0, 18, 12,  4]]]
			}
		}
	};
	constructor({face, sliceBegin, sliceEnd, turnCount, run}) {
		super(run);
		this.run.logger.detailedLog("Creating new CubeMove.");
		this.face = face;
		this.sliceBegin = sliceBegin;
		this.sliceEnd = sliceEnd;
		this.turnCount = turnCount;
		this.cube = this.run.blankPuzzle;
		let isBigCube = this.cube instanceof BlankCubeBig;
		if (this.sliceBegin < 1) {
			this.run.throwError("Creating move with sliceBegin < 1.");
		}
		if (this.sliceEnd > this.cube.puzzleSize) {
			this.run.throwError("Creating move with sliceEnd > cube size.");
		}
		if (this.sliceBegin > this.sliceEnd) {
			this.run.throwError("Creating move with sliceBegin > sliceEnd.");
		}
		if (this.sliceBegin === 1) { // first layer
			this.treatFirstLayer(isBigCube);
		}
		if (isBigCube && this.sliceEnd > 1) { // between first layer and middle layer
			this.treatBetweenFirstAndMiddleLayer(Math.max(1, this.sliceBegin - 1), Math.min(this.sliceEnd - 1, this.cube.maxRankWithoutMiddle));
		}
		if ((this.cube.puzzleSize === 3 && this.sliceBegin <= 2 && this.sliceEnd >= 2)
			|| (this.cube.middleSlice && this.sliceBegin <= this.cube.middleSlice && this.sliceEnd >= this.cube.middleSlice)) { // middle layer
			this.treatMiddleLayer(isBigCube);
		}
		if (isBigCube && this.sliceEnd > this.cube.maxRankWithMiddle + 1) { // between middle layer and last layer
			this.treatBetweenMiddleAndLastLayer(Math.max(1, this.cube.puzzleSize - this.sliceEnd),
				Math.min(this.cube.puzzleSize - this.sliceBegin, this.cube.maxRankWithoutMiddle));
		}
		if (this.sliceEnd === this.cube.puzzleSize) { // last layer
			this.treatLastLayer(isBigCube);
		}
	};
	treatFirstLayer = isBigCube => {
		this.addCornerElementaryCycles();
		this.addMidgeElementaryCycles(CubeMove.externalMode);
		if (isBigCube) {
			for (let firstRank = 1; firstRank <= this.cube.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank);
				for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
					if (firstRank === secondRank) {
						this.addXCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					} else {
						this.addCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					}
				}
			}
		} else if (this.cube instanceof BlankCube1x1x1) {
			this.addCenterElementaryCycles();
		}
	};
	treatBetweenFirstAndMiddleLayer = (firstRankBegin, firstRankEnd) => {
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) { // between first layer and middle layer
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank);
			for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
				if (firstRank === secondRank) {
					this.addXCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank]);
				} else if (firstRank > secondRank) {
					this.addCenterBigCubeElementaryCycles(CubeMove.internalDirectMode, [firstRank, secondRank]);
					this.addCenterBigCubeElementaryCycles(CubeMove.internalIndirectMode, [secondRank, firstRank]);
				} else {
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank]);
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [secondRank, firstRank]);
				}
			}
		}
	};
	treatMiddleLayer = isBigCube => {
		this.addCenterElementaryCycles();
		this.addMidgeElementaryCycles(CubeMove.internalMode);
		if (isBigCube) {
			for (let centerRank = 1; centerRank <= this.cube.maxRankWithoutMiddle; centerRank++) {
				this.addCenterBigCubeElementaryCycles(CubeMove.internalDirectMode, [centerRank, this.cube.middleSlice - 1]);
				this.addCenterBigCubeElementaryCycles(CubeMove.internalIndirectMode, [centerRank, this.cube.middleSlice - 1]);
			}
		}
	};
	treatBetweenMiddleAndLastLayer = (firstRankBegin, firstRankEnd) => {
		let oppositeTurnCount = CubeMoveParser.cleanTurnCount(-this.turnCount);
		let oppositeFace = CubeMoveParser.getOppositeFace(this.face);
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) {
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank, oppositeFace, oppositeTurnCount);
			for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
				if (firstRank === secondRank) {
					this.addXCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
				} else if (firstRank > secondRank) {
					this.addCenterBigCubeElementaryCycles(CubeMove.internalDirectMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
					this.addCenterBigCubeElementaryCycles(CubeMove.internalIndirectMode, [secondRank, firstRank], oppositeFace, oppositeTurnCount);
				} else {
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [firstRank, secondRank], oppositeFace, oppositeTurnCount);
					this.addCenterBigCubeElementaryCycles(CubeMove.semiExternalMode, [secondRank, firstRank], oppositeFace, oppositeTurnCount);
				}
			}
		}
	};
	treatLastLayer = isBigCube => {
		let oppositeTurnCount = CubeMoveParser.cleanTurnCount(-this.turnCount);
		let oppositeFace = CubeMoveParser.getOppositeFace(this.face);
		this.addCornerElementaryCycles(oppositeFace, oppositeTurnCount);
		this.addMidgeElementaryCycles(CubeMove.externalMode, oppositeFace, oppositeTurnCount);
		if (isBigCube) {
			for (let firstRank = 1; firstRank <= this.cube.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank, oppositeFace, oppositeTurnCount);
				for (let secondRank = 1; secondRank <= this.cube.maxRankWithMiddle; secondRank++) {
					if (firstRank === secondRank) {
						this.addXCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					} else {
						this.addCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					}
				}
			}
		}
	};
	addCornerElementaryCycles = (face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(CornerCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.externalMode][face][turnCount], CornerCubeOrbit.type);
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], CornerCubeOrbit.type);
		}
	};
	addCenterElementaryCycles = () => {
		if (this.cube.hasOrbitType(CenterCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CenterCubeOrbit.type][CubeMove.internalMode][this.face][this.turnCount], CenterCubeOrbit.type);
		}
	};
	addMidgeElementaryCycles = (midgeMode, face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(MidgeCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][midgeMode][face][turnCount], MidgeCubeOrbit.type);
			if (midgeMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], MidgeCubeOrbit.type);
			}
		}
	};
	addWingElementaryCycles = (wingMode, wingRank, face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(WingCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][wingMode][face][turnCount], WingCubeOrbit.type, wingRank);
			if (wingMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], WingCubeOrbit.type, wingRank);
			}
		}
	};
	addXCenterBigCubeElementaryCycles = (centerMode, centerRanks, face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(CenterBigCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][centerMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
		}
	};
	addCenterBigCubeElementaryCycles = (centerMode, centerRanks, face = this.face, turnCount = this.turnCount) => {
		if (this.cube.hasOrbitType(CenterBigCubeOrbit.type)) {
			if (centerMode === CubeMove.internalDirectMode || centerMode === CubeMove.internalIndirectMode) {
				this.pushCycles(CubeMove.elementaryCycles[CenterBigCubeOrbit.type][centerMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
			} else {
				this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][centerMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
			}
		}
	};
}

// Represents the information of a move sequence parser.

class MoveSequenceParser {
	constructor(run) {
		this.run = run;
		this.run.logger.generalLog("Creating new MoveSequenceParser.");
		switch(this.run.blankPuzzle.shape) {
			case Cube.shape:
				this.moveParser = new CubeMoveParser(this.run);
				this.run.logger.debugLog("Attaching CubeMoveParser to MoveSequenceParser.");
				break;
			default:
				this.run.throwError(`Cannot parse move sequence for puzzle type "${this.run.blankPuzzle.shape}."`);
		}
	};
	parseMoveSequence = moveSequenceInput => {
		this.run.logger.generalLog(`Parsing move sequence ${moveSequenceInput}.`);
		let moveSequence = new MoveSequence([], this.run);
		for (let moveToParse of typeof moveSequenceInput === "string" ? moveSequenceInput.split(" ").filter(move => move !== "") : moveSequenceInput) {
			moveSequence.appendMove(this.moveParser.parseMove(moveToParse));
		}
		return moveSequence;
	};
}

// Represents the information of a move parser, used by the move sequence parser to individually parse each move of the sequence.

class MoveParser {
	constructor(run) {
		this.run = run;
		this.run.logger.debugLog("Creating new MoveParser.");
		this.blankPuzzle = run.blankPuzzle;
	};
}

class CubeMoveParser extends MoveParser {
	static parseFace = moveString => {
		let faceListSubRegExp = "[UFRDBL]";
		return moveString.match(new RegExp(faceListSubRegExp, "i"))[0].toUpperCase();
	};
	static parseTurnCountFromSuffix = suffix => {
		let numberMatches = suffix.match(/\d+/);
		return this.cleanTurnCount((numberMatches ? parseInt(numberMatches[0]) : 1) * (/'/.test(suffix) ? -1 : 1));
	};
	static getExternalFace = middleSliceLetter => {
		return {"M": "L", "E": "D", "S": "F", "x": "R", "y": "U", "z": "F"}[middleSliceLetter];
	};
	static getOppositeFace = face => {
		return {"U": "D", "F": "B", "R": "L", "D": "U", "B": "F", "L": "R"}[face];
	};
	static cleanTurnCount = turnCount => {
		return turnCount % 4 + (turnCount < 0 ? 4 : 0);
	};
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new CubeMoveParser.");
		this.cubeSize = this.blankPuzzle.puzzleSize;
	};
	parseMove = moveString => {
		this.run.logger.detailedLog(`Parsing move ${moveString}.`);
		let faceListSubRegExp = "[UFRDBL]";
		let directionListSubRegExp = "('?\\d*|\\d+')"; // empty, ', 2, 2', '2
		if (new RegExp(`^[xyz]${directionListSubRegExp}$`).test(moveString)) { // x, y', z2, ...
			return new CubeMove({
				face: CubeMoveParser.getExternalFace(moveString[0]),
				sliceBegin: 1,
				sliceEnd: this.cubeSize,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1)),
				run: this.run
			});
		} else if (this.cubeSize === 1) {
			this.run.throwError("Applying an incorrect move on a 1x1x1 cube.");
		} else if (new RegExp(`^${faceListSubRegExp}${directionListSubRegExp}$`).test(moveString)) { // R, U', F2, ...
			return new CubeMove({
				face: moveString[0],
				sliceBegin: 1,
				sliceEnd: 1,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1)),
				run: this.run
			});
		} else if (this.cubeSize === 2) {
			this.run.throwError("Applying an incorrect move on a 2x2x2 cube.");
		} else if (new RegExp(`^${faceListSubRegExp.toLowerCase()}${directionListSubRegExp}$`).test(moveString)) { // r, u', f2
			return new CubeMove({
				face: CubeMoveParser.parseFace(moveString[0]),
				sliceBegin: this.cubeSize === 3 ? 1 : 2,
				sliceEnd: 2,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1)),
				run: this.run
			});
		} else if (new RegExp(`^\\d*[MES]${directionListSubRegExp}$`, "i").test(moveString)) { // M, E', S2
			let middleSliceCountMatch = moveString.match(/^\d*/)[0];
			let middleSliceCount = middleSliceCountMatch === "" ? 1 : parseInt(middleSliceCountMatch);
			if ((middleSliceCount + this.cubeSize) % 2) {
				this.run.throwError(`Wrong structure for CubeMove (${this.cubeSize % 2 ? "odd" : "even"} cube size and ${this.cubeSize % 2 ? "even" : "odd"}`
				+ " number of slices for middle slice move).");
			} else if (middleSliceCount < this.cubeSize && middleSliceCount > 0) {
				return new CubeMove({
					face: CubeMoveParser.getExternalFace(moveString.replace(/^\d*/, "")[0]),
					sliceBegin: (this.cubeSize - middleSliceCount) / 2 + 1,
					sliceEnd: (this.cubeSize + middleSliceCount) / 2,
					turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1)),
					run: this.run
				});
			} else {
				this.run.throwError(`Applying an inner slice move involving ${middleSliceCount} slices on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			}
		} else if (new RegExp(`^\\d*${faceListSubRegExp}w${directionListSubRegExp}$`).test(moveString)) { // Rw, Uw', 3Fw2, ...
			let numberOfSlicesString = moveString.match(new RegExp("^\\d*"))[0];
			let numberOfSlices = numberOfSlicesString !== "" ? parseInt(numberOfSlicesString) : 2;
			if (numberOfSlices <= 1) {
				this.run.throwError(`Applying a wide move with less than 2 layers (${numberOfSlices}).`);
			} else if (numberOfSlices < this.cubeSize) {
				return new CubeMove({
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: 1,
					sliceEnd: numberOfSlices,
					turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1)),
					run: this.run
				});
			} else {
				this.run.throwError(`Applying an outer slice move involving ${numberOfSlices} slices on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			}
		} else if (new RegExp(`^\\d+${faceListSubRegExp}${directionListSubRegExp}$`, "i").test(moveString)) { // 2R, 3U', 4F2
			let sliceNumber = moveString.match(/\d+/)[0];
			let turnCount = CubeMoveParser.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1));
			if (sliceNumber < 2 || sliceNumber >= this.cubeSize) {
				this.run.throwError(`Applying an inner slice move involving the slice of rank ${sliceNumber} on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			} else if (sliceNumber > (this.cubeSize + 1) / 2) {
				return new CubeMove({
					face: CubeMoveParser.getOppositeFace(CubeMoveParser.parseFace(moveString)),
					sliceBegin: this.cubeSize + 1 - sliceNumber,
					sliceEnd: this.cubeSize + 1 - sliceNumber,
					turnCount: CubeMoveParser.cleanTurnCount(-turnCount),
					run: this.run
				});
			} else {
				return new CubeMove({
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: sliceNumber,
					sliceEnd: sliceNumber,
					turnCount: turnCount,
					run: this.run
				});
			}
		} else if (new RegExp(`^\\d+-\\d+${faceListSubRegExp}w${directionListSubRegExp}`).test(moveString)) { // 2-3Rw, 3-4Uw', 4-6Fw2
			let [sliceBegin, sliceEnd] = moveString.match(/\d+/g);
			[sliceBegin, sliceEnd] = [Math.min(sliceBegin, sliceEnd), Math.max(sliceBegin, sliceEnd)];
			let turnCount = CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1));
			if (sliceBegin < 2 || sliceEnd >= this.cubeSize) {
				this.run.throwError(`Applying an inner slice move involving slices from ${sliceBegin} to ${sliceEnd} on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			} else if (sliceBegin - 1 > this.cubeSize - sliceEnd) {
				return new CubeMove({
					face: CubeMoveParser.getOppositeFace(CubeMoveParser.parseFace(moveString)),
					sliceBegin: this.cubeSize + 1 - sliceEnd,
					sliceEnd: this.cubeSize + 1 - sliceBegin,
					turnCount: CubeMoveParser.cleanTurnCount(-turnCount),
					run: this.run
				});
			} else {
				return new CubeMove({
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: sliceBegin,
					sliceEnd: sliceEnd,
					turnCount: turnCount,
					run: this.run
				});
			}
		} else {
			this.run.throwError(`Wrong structure for CubeMove : ${moveString}.`);
		}
	};
}

// Represents the state of one type of pieces.

class Orbit {
	static type = "unknown";
	constructor(run) {
		this.run = run;
		this.run.logger.debugLog("Creating new Orbit.");
		this.slotList = undefined;
		this.type = Orbit.type;
	};
	getSize = () => {
		return this.slotList?.length ?? null;
	};
	buildSlotList(slotsPerColor) {
		let slotList = [];
		for (let color of this.run.puzzle.colorScheme) {
			for (let slotIndexForColor = 0; slotIndexForColor < slotsPerColor; slotIndexForColor++) {
				slotList.push(new Slot(new Sticker(color)));
			}
		}
		return slotList;
	};
}

class CubeOrbit extends Orbit {
	constructor (run) {
		super(run);
		this.run.logger.debugLog("Creating new CubeOrbit.");
	};
}

class CenterCubeOrbit extends CubeOrbit {
	static type = "centerCubeOrbit";
	constructor(run) {
		super(run);
		this.run.logger.detailedLog("Creating new CenterCubeOrbit.");
		this.slotList = this.buildSlotList(1);
		this.type = CenterCubeOrbit.type;
	};
}

class CornerCubeOrbit extends CubeOrbit {
	static type = "cornerCubeOrbit";
	constructor(run) {
		super(run);
		this.run.logger.detailedLog("Creating new CornerCubeOrbit.");
		this.slotList = this.buildSlotList(4);
		this.type = CornerCubeOrbit.type;
	};
}

class MidgeCubeOrbit extends CubeOrbit {
	static type = "midgeCubeOrbit";
	constructor(run) {
		super(run);
		this.run.logger.detailedLog("Creating new MidgeCubeOrbit.");
		this.slotList = this.buildSlotList(4);
		this.type = MidgeCubeOrbit.type;
	};
}

class WingCubeOrbit extends CubeOrbit {
	static type = "wingCubeOrbit";
	constructor(run, rank) {
		super(run);
		this.run.logger.detailedLog(`Creating new WingCubeOrbit (rank = ${rank}).`);
		this.slotList = this.buildSlotList(8);
		this.rank = rank;
		this.type = WingCubeOrbit.type;
	};
}

class CenterBigCubeOrbit extends CubeOrbit {
	static type = "centerBigCubeOrbit";
	constructor(run, ranks) {
		super(run);
		this.run.logger.detailedLog(`Creating new CenterBigCubeOrbit (ranks = [${ranks.join(", ")}]).`);
		this.slotList = this.buildSlotList(4);
		this.ranks = ranks;
		this.type = CenterBigCubeOrbit.type;
	};
}

// Represents the information of a twisty puzzle.
// Every puzzle class inherits a "blank" puzzle class, which contains no orbit.

class TwistyPuzzle {
	constructor(run) {
		this.run = run;
		this.run.logger.debugLog("Creating new Puzzle.");
		this.fullName = this.run.puzzle.fullName;
		this.orbitList = [];
		this.orbitTypes = [];
	};
	addOrbit = orbit => {
		this.orbitList.push(orbit);
	};
	hasOrbitType = orbitType => {
		return this.orbitTypes.includes(orbitType);
	};
	static getBlankParentClass = childClass => {
		return Object.getPrototypeOf(childClass);
	};
}

class Cube extends TwistyPuzzle {
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new Cube.");
		this.shape = Cube.shape;
	};
	static shape = "cube";
}

class BlankCube1x1x1 extends Cube {
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new BlankCube1x1x1.");
		this.puzzleSize = 1;
		this.orbitTypes = [CenterCubeOrbit.type];
	};
}

class Cube1x1x1 extends BlankCube1x1x1 {
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new Cube1x1x1.");
		this.addOrbit(new CenterCubeOrbit(this.run));
	};
}

class BlankCube2x2x2 extends Cube {
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new BlankCube2x2x2.");
		this.puzzleSize = 2;
		this.orbitTypes = [CornerCubeOrbit.type];
	};
}

class Cube2x2x2 extends BlankCube2x2x2 {
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new Cube2x2x2.");
		this.addOrbit(new CornerCubeOrbit(this.run));
	};
}

class BlankCube3x3x3 extends Cube {
	constructor(run) {
		super(run);
		this.run.logger.debugLog("Creating new BlankCube3x3x3.");
		this.puzzleSize = 3;
		this.orbitTypes = [CenterCubeOrbit.type, MidgeCubeOrbit.type, CornerCubeOrbit.type];
	};
}

class Cube3x3x3 extends BlankCube3x3x3 {
	constructor(run) {
		super(run);
		this.run.logger.generalLog("Creating new Cube3x3x3.");
		this.addOrbit(new CenterCubeOrbit(this.run));
		this.addOrbit(new MidgeCubeOrbit(this.run));
		this.addOrbit(new CornerCubeOrbit(this.run));
	};
}

class BlankCubeBig extends Cube {
	constructor(run) {
		super(run);
		this.puzzleSize = this.run.puzzle.size;
		this.run.logger.debugLog(`Creating new BlankCubeBig (puzzleSize = ${this.puzzleSize}).`);
		this.orbitTypes = [CornerCubeOrbit.type, WingCubeOrbit.type, CenterBigCubeOrbit.type];
		if (this.puzzleSize % 2) { // puzzle is odd
			this.middleSlice = (this.puzzleSize + 1) / 2;
			this.maxRankWithoutMiddle = (this.puzzleSize - 3) / 2;
			this.maxRankWithMiddle = (this.puzzleSize - 1) / 2;
			this.orbitTypes.push(MidgeCubeOrbit.type);
			this.orbitTypes.push(CenterCubeOrbit.type);
		} else { // puzzle is even
			this.middleSlice = null;
			this.maxRankWithoutMiddle = this.puzzleSize / 2 - 1;
			this.maxRankWithMiddle = this.puzzleSize / 2 - 1;
		}
	};
}

class CubeBig extends BlankCubeBig {
	constructor(run) {
		super(run);
		this.run.logger.generalLog(`Creating new CubeBig (puzzleSize = ${this.puzzleSize}).`);
		this.addOrbit(new CornerCubeOrbit(this.run));
		if (this.puzzleSize % 2) { // puzzle is odd
			this.addOrbit(new MidgeCubeOrbit(this.run));
			this.addOrbit(new CenterCubeOrbit(this.run));
		}
		for (let wingRank = 1; wingRank <= this.maxRankWithoutMiddle; wingRank++) {
			this.addOrbit(new WingCubeOrbit(this.run, wingRank));
		}
		for (let centerFirstRank = 1; centerFirstRank <= this.maxRankWithoutMiddle; centerFirstRank++) {
			for (let centerSecondRank = 1; centerSecondRank <= this.maxRankWithMiddle; centerSecondRank++) {
				this.addOrbit(new CenterBigCubeOrbit(this.run, [centerFirstRank, centerSecondRank]));
			}
		}
	};
}

class Pyramid extends TwistyPuzzle {
	constructor(run) {
		super(run);
		this.shape = Pyramid.shape;
	};
	static shape = "pyramid";
}

class Dodecahedron extends TwistyPuzzle {
	constructor(run) {
		super(run);
		this.shape = Dodecahedron.shape;
	};
	static shape = "dodecahedron";
}

// Represents the information of a run (input, working, output). This is the entry point for everything related to Holo-Cube.

/*
Object structure to give to Run class :
{
	puzzle: {
		fullName: string,
		stage: string, // stage to show (OLL, PLL, CMLL, F2L, ...)
		colorScheme: array of colors
	},
	moveSequence: string or array of strings, // sequence to apply on one puzzle
	moveSequenceList: array of strings // sequences to apply, each one on a different puzzle
	drawingOptions: {
		imageHeight: number, // height of the image in px, default value is 100
		imageWidth: number, // width of the image in px, default value is 100
		imageScale: number, // scale to apply to both height and width of the image, default is 1
		imageBackgroundColor: color, // background color of the image (white, transparent, ...)
		puzzleHeight: number, // height of the puzzle in px, default value is 100
		puzzleWidth: number, // width of the puzzle in px, default value is 100
		puzzleScale: number, // scale to apply to both height and width of the puzzle, default is 1
		puzzleColor: color // color of the cube, excluding the stickers, (black, primary, stickerless, transparent, ...)
		view: string // view of the puzzle ("plan"|"isometric"|"net"), default value is "plan"
	},
	logger: {
		verbosity: int, // level of verbosity for the logs (-1 = no logs, 0 = errors only, 1 = general and warnings, 2 = advanced, 3 = debug), default value is 1
		mode: string, // how the logs will be written ("console"|"result"|"htmlTag"), default value is "console"
		htmlTagSelector: string // selector to find the HTML tag in which to write, when "htmlTag" logger mode is selected
	}
}

puzzle.fullName is mandatory
moveSequence XOR moveSequenceList is mandatory
other inputs are optional
*/

class Run {
	constructor(inputObject) {
		this.setLogger(inputObject);
		this.logger.generalLog("Creating new Run.");
		this.setPuzzle(inputObject);
		this.setMoveSequenceList(inputObject);
		this.setDrawingOptions(inputObject);
		this.setPuzzleClass();
		this.setBlankPuzzle();
		this.setMoveSequenceParser();
		this.setPuzzleDrawer();
		this.logger.generalLog("End of initialization phase.");
	};
	run = () => {
		this.logger.generalLog("Beginning of execution phase.");
		let result = {
			svgList: []
		};
		for (let moveSequence of this.moveSequenceList) {
			let puzzle = new this.puzzleClass(this);
			this.moveSequenceParser.parseMoveSequence(moveSequence).applyOnPuzzle(puzzle);
			this.logger.generalLog("Adding image to output.");
			result.svgList.push(this.puzzleDrawer.drawPuzzle(puzzle));
		}
		if (this.logger.mode === "result") {
			result.logs = this.logs;
		}
		this.logger.generalLog("End of execution phase.");
		return result;
	};
	throwError = message => {
		let errorMessage = `[ERROR] ${message}`;
		Logger.consoleLog(errorMessage); // always display errors in the console
		if (this.logger && this.logger.mode !== "console") {
			this.logger.errorLog(message);
		}
		throw errorMessage;
	};
	setLogger = inputObject => {
		let verbosity = 1; // default value
		let mode = "console"; // default value
		let htmlTag = undefined;
		if (![undefined, null].includes(inputObject.logger)) {
			if (![undefined, null].includes(inputObject.logger.verbosity)) { // check verbosity
				if (typeof inputObject.logger.verbosity !== "number") {
					this.throwError("Property verbosity must be a number.");
				} else if (![-1, 0, 1, 2, 3].includes(inputObject.logger.verbosity)) {
					this.throwError(`Property verbosity only accept values -1, 0, 1, 2 and 3 (received value = ${inputObject.logger.verbosity}).`);
				}
				verbosity = inputObject.logger.verbosity;
			}
			if (verbosity !== -1 && ![undefined, null].includes(inputObject.logger.mode)) { // check mode
				if (typeof inputObject.logger.mode !== "string") {
					this.throwError("Property mode must be a string.");
				} else if (!["console", "result", "htmlTag", "off"].includes(inputObject.logger.mode)) {
					this.throwError(`Property mode only accept values "console", "result" and "htmlTag" (received value = ${inputObject.logger.mode}).`);
				}
				mode = inputObject.logger.mode;
				if (mode === "htmlTag") { // htmlTag mode is chosen, the HTML tag is required
					if ([undefined, null].includes(inputObject.logger.htmlTagSelector)) {
						this.throwError("Property logger.htmlTagSelector is required when mode is \"htmlTag\".");
					} else if (typeof inputObject.logger.htmlTagSelector !== "string") {
						this.throwError("Property htmlTagSelector must be a string.");
					}
					htmlTag = document.querySelector(inputObject.logger.htmlTagSelector);
					if (htmlTag === null) {
						this.throwError(`No HTML tag was found with selector ${inputObject.logger.htmlTagSelector}.`);
					}
				}
			}
		}
		this.logger = new (this.getLoggerClass(verbosity))(mode, this, htmlTag);
		this.logger.detailedLog("Logger is created.");
	};
	setPuzzle = inputObject => {
		this.logger.detailedLog("Reading input : puzzle.");
		this.puzzle = new PuzzleRunInput(inputObject.puzzle, this);
	};
	setMoveSequenceList = inputObject => {
		this.logger.detailedLog("Reading input : move sequence(s).");
		let isMoveSequenceDefined = ![undefined, null].includes(inputObject.moveSequence);
		let isMoveSequenceListDefined = ![undefined, null].includes(inputObject.moveSequenceList);
		if (isMoveSequenceDefined) {
			if (isMoveSequenceListDefined) {
				this.throwError("Both properties moveSequence and moveSequenceList were provided, please set one of them to null or undefined.");
			}
			if (typeof inputObject.moveSequence !== "string") {
				this.throwError("Property moveSequence must of a string.");
			}
			this.moveSequenceList = [inputObject.moveSequence];
		} else {
			if (!isMoveSequenceListDefined) {
				this.throwError("Property moveSequence or moveSequenceList must be provided.");
			}
			if (typeof inputObject.moveSequenceList !== "object") {
				this.throwError("Property moveSequenceList must be an array of strings.");
			} else {
				for (let moveSequence of inputObject.moveSequenceList) {
					if (typeof moveSequence !== "string") {
						this.throwError("Each move sequence in property moveSequenceList must be a string.");
					}
				}
			}
			this.moveSequenceList = inputObject.moveSequenceList;
		}
	};
	setDrawingOptions = inputObject => {
		this.logger.detailedLog("Reading input : drawingOptions.");
		this.drawingOptions = new DrawingOptionsRunInput(inputObject.drawingOptions, this);
	};
	setPuzzleClass = () => {
		this.logger.debugLog("Setting puzzle class.");
		switch(this.puzzle.shape) {
			case "cube": switch(this.puzzle.fullName) {
				case "cube1x1x1": this.puzzleClass = Cube1x1x1; break;
				case "cube2x2x2": this.puzzleClass = Cube2x2x2; break;
				case "cube3x3x3": this.puzzleClass = Cube3x3x3; break;
				default: this.puzzleClass = CubeBig;
			}; break;
			default: this.throwError("Getting puzzle class for a non-cubic shaped puzzle.");
		}
	};
	setBlankPuzzle = () => { // blank puzzle is an instance of the blank parent class, which has the same structure without the orbits
		this.logger.debugLog("Creating blank puzzle.");
		this.blankPuzzle = new (TwistyPuzzle.getBlankParentClass(this.puzzleClass))(this);
	};
	setMoveSequenceParser = () => {
		this.moveSequenceParser = new MoveSequenceParser(this);
	};
	setPuzzleDrawer = () => {
		let puzzleDrawerClass = this.getPuzzleDrawerClass();
		this.puzzleDrawer = new puzzleDrawerClass(this);
		this.puzzleDrawer.createSvgSkeletton();
	};
	getPuzzleDrawerClass = () => {
		switch(this.puzzle.shape) {
			case "cube": switch(this.drawingOptions.view) {
				case "plan": return CubePlanDrawer;
				case "isometric": return CubeIsometricDrawer;
				case "net": return CubeNetDrawer;
			}
			default: this.throwError("Getting puzzle drawer class for a non-cubic shaped puzzle.");
		}
	};
	getLoggerClass = verbosity => {
		switch(verbosity) {
			case -1: return Logger;
			case 0: return ErrorLogger;
			case 1: return GeneralLogger;
			case 2: return DetailedLogger;
			case 3: return DebugLogger;
		}
	};
}

// Represents the information of a puzzle as an input of a run.

class PuzzleRunInput {
	constructor(puzzle, run) {
		this.run = run;
		this.run.logger.debugLog("Creating new PuzzleRunInput");
		if ([undefined, null].includes(puzzle)) {
			this.run.throwError("Property puzzle is required.");
		} else if (typeof puzzle !== "object") {
			this.run.throwError("Property puzzle must be an object.");
		}
		this.setPuzzleGeneral(puzzle);
		this.setStage(puzzle);
		this.setColorScheme(puzzle);
	};
	setPuzzleGeneral = puzzle => {
		if ([undefined, null].includes(puzzle.fullName)) {
			this.run.throwError("Property puzzle.fullName is required.");
		} else if (typeof puzzle.fullName !== "string") {
			this.run.throwError("Property puzzle.fullName must be a string.");
		} else if (!puzzle.fullName.startsWith("cube")) {
			this.run.throwError("Wrong value for puzzle.fullName : only cubes are supported for now.");
		} else if (!/^cube\d+x\d+x\d+$/.test(puzzle.fullName) || new Set(puzzle.fullName.substring(4).split("x")).size !== 1) {
			this.run.throwError("Unrecognized or unsupported puzzle name. Available names are of the form cubeNxNxN, where N has to be replaced with the cube size.");
		}
		this.fullName = puzzle.fullName;
		this.shape = "cube";
		this.size = parseInt(puzzle.fullName.match(/\d+$/)[0]);
		if (this.size === 0) {
			this.run.throwError(`Creating cube with no layer.`);
		} else if (this.size > 13) {
			this.run.logger.warningLog(`Creating cube with large number of layers (${this.size}).`);
		}
	};
	setStage = puzzle => {
		if (![undefined, null].includes(puzzle.stage)) {
			if (typeof puzzle.stage !== "string") {
				this.run.throwError("Property puzzle.stage must be a string.");
			} else {
				this.run.logger.warningLog("Stage option is not yet supported, current mode shows all stickers.");
				this.stage = puzzle.stage;
			}
		}
		this.stage = puzzle.stage ?? "full";
	};
	setColorScheme = puzzle => {
		this.colorScheme = [];
		if ([undefined, null].includes(puzzle.colorScheme)) {
			for (let color of this.getDefaultColorSchemeFromShape(this.shape)) {
				this.colorScheme.push(new Color(color));
			}
		} else {
			if (typeof puzzle.colorScheme !== "object") {
				this.run.throwError("Property puzzle.colorScheme must be an array of strings.");
			} else if (puzzle.colorScheme.length !== this.getColorSchemeLengthFromShape(this.shape)) {
				this.run.throwError("Property puzzle.colorScheme doesn't have the correct number of values "
					+ `(expected value = ${this.getColorSchemeLengthFromShape(puzzleShape)} because puzzle shape is ${this.puzzle.shape},`
					+ `actual = ${puzzle.colorScheme.length}).`);
			} else {
				for (let color of puzzle.colorScheme) {
					if (typeof color !== "string") {
						this.run.throwError("Each color in property puzzle.colorScheme must be a string.");
					} else if (!Color.checkFormat(color)) {
						this.run.throwError(`Invalid or unrecognized color in puzzle.colorScheme property : ${color}.`);
					}
					this.colorScheme.push(new Color(color));
				}
			}
		}
	};
	getDefaultColorSchemeFromShape = puzzleShape => {
		switch (puzzleShape) {
			case Cube.shape: return ["w", "g", "r", "y", "b", "o"]; // respectively for U, F, R, D, B, L faces
			case Pyramid.shape: return ["g", "b", "r", "y"]; // respectively for F, BR, BL, D faces
			case Dodecahedron.shape: return ["w", "g", "r", "b", "y", "pu", "gy", "lg", "o", "lb", "ly", "pi"]; // respectively for U, F, R, BR, BL, L, D, DB, DL, DFL, DFR, DR
			default: this.run.throwError(`Getting default color scheme from invalid puzzle shape ${puzzleShape}.`);
		}
	};
	getColorSchemeLengthFromShape = puzzleShape => {
		try {
			return this.getDefaultColorSchemeFromShape(puzzleShape).length;
		} catch {
			this.run.throwError(`Getting length of color scheme from invalid puzzle shape ${puzzleShape}.`);
		}
	};
}

// Represent the drawing options as an input of a run.

class DrawingOptionsRunInput {
	static defaultDrawingOptions = {
		imageHeight: 100,
		imageWidth: 100,
		imageBackgroundColor: "transparent",
		puzzleHeight: 100,
		puzzleWidth: 100,
		puzzleColor: "black",
		view: "plan"
	};
	constructor(drawingOptionsObject, run) {
		this.run = run;
		this.run.logger.debugLog("Creating new DrawingOptionsRunInput");
		if (drawingOptionsObject) {
			let heightWidthList = ["Height", "Width"];
			for (let imageOrPuzzle of ["image", "puzzle"]) {
				for (let heightOrWidth of heightWidthList) {
					let dimensionProperty = imageOrPuzzle + heightOrWidth;
					if (![undefined, null].includes(drawingOptionsObject[dimensionProperty])) {
						this.checkNumberNotZero(drawingOptionsObject[dimensionProperty], dimensionProperty);
						this[dimensionProperty] = drawingOptionsObject[dimensionProperty];
					} else {
						this.setNumericValueFromDefault(dimensionProperty);
					}
				}
				let scaleProperty = imageOrPuzzle + "Scale";
				if (![undefined, null].includes(drawingOptionsObject[scaleProperty])) {
					this.checkNumberNotZero(drawingOptionsObject[scaleProperty], scaleProperty);
					for (let heightOrWidth of heightWidthList) {
						this[imageOrPuzzle + heightOrWidth] *= drawingOptionsObject[scaleProperty];
					}
				}
			}
			if (![undefined, null].includes(drawingOptionsObject.view)) {
				if (typeof drawingOptionsObject.view !== "string") {
					this.run.throwError("Property drawingOptions.view must be a string.");
				} else if (!["plan", "isometric", "net"].includes(drawingOptionsObject.view)) {
					this.run.throwError(`Invalid value for property drawingOptions.view (current = ${drawingOptionsObject.view}, allowed = "plan"|"isometric"|"net").`);
				} else {
					this.run.logger.warningLog("View option is not yet supported, using plan view by default");
					this.view = DrawingOptionsRunInput.defaultDrawingOptions.view; // todo replace with this.view = drawingOptionsObject.view;
				}
			} else {
				this.view = DrawingOptionsRunInput.defaultDrawingOptions.view;
			}
			for (let dimension of ["Height", "Width"]) {
				if (Math.abs(this["puzzle" + dimension]) > Math.abs(this["image" + dimension])) {
					this.run.throwError(`Puzzle is larger than image (puzzle${dimension} = this["puzzle" + dimension], image${dimension} = this["image" + dimension]).`);
				}
				if (Math.abs(this["image" + dimension]) > 2000) {
					this.run.logger.warningLog(`Creating large image (image${dimension} = this["image" + dimension]).`);
				}
			}
			for (let drawingOptionsProperty of ["imageBackgroundColor", "puzzleColor"]) {
				if (drawingOptionsObject[drawingOptionsProperty]) {
					if (typeof drawingOptionsObject[drawingOptionsProperty] !== "string") {
						this.run.throwError(`Property drawingOptions.${drawingOptionsProperty} must be a string.`);
					} else if (!Color.checkFormat(drawingOptionsObject[drawingOptionsProperty])) {
						this.run.throwError(`Invalid or unrecognized color for property drawingOptions.${drawingOptionsProperty} : ${drawingOptionsObject[drawingOptionsProperty]}.`);
					}
					this[drawingOptionsProperty] = new Color(drawingOptionsObject[drawingOptionsProperty]);
				} else {
					this.setColorValueFromDefault(drawingOptionsProperty);
				}
			}
		} else {
			this.setAllValuesFromDefault();
		}
	}; // todo add debug logs when setting values with default values ?
	setAllValuesFromDefault = () => {
		for (let drawingOptionsNumericProperty of ["imageHeight", "imageWidth", "puzzleHeight", "puzzleWidth"]) {
			this.setNumericValueFromDefault(drawingOptionsNumericProperty);
		}
		for (let drawingOptionsColorProperty of ["imageBackgroundColor", "puzzleColor"]) {
			this.setColorValueFromDefault(drawingOptionsColorProperty);
		}
		this.view = DrawingOptionsRunInput.defaultDrawingOptions.view;
	};
	setNumericValueFromDefault = propertyName => {
		this[propertyName] = DrawingOptionsRunInput.defaultDrawingOptions[propertyName];
		this.run.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${this[propertyName]}.`);
	};
	setColorValueFromDefault = propertyName => {
		this[propertyName] = new Color(DrawingOptionsRunInput.defaultDrawingOptions[propertyName]);
		this.run.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${DrawingOptionsRunInput.defaultDrawingOptions[propertyName]}.`);
	};
	checkNumberNotZero = (variableValue, variableName) => {
		if (typeof variableValue !== "number") {
			this.run.throwError(`Property drawingOptions.${variableName} must be a number.`);
		} else if (variableValue === 0) {
			this.run.throwError(`Property drawingOptions.${variableName} cannot be 0.`);
		}
	};
}

// Represents a location of one colored side of a piece.

class Slot {
	constructor(sticker) {
		this.content = sticker;
	};
	getContent = () => {
		return this.content;
	};
	setContent = sticker => {
		this.content = sticker;
	};
}

// Represents the information on one colored side of one piece.

class Sticker {
	constructor(color) {
		this.color = color;
	};
}
