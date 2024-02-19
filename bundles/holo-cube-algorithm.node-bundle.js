
// Defines all known colors.

class ColorCollection {
	static transparent = {r: 0, g: 0, b: 0, a: 0};
	static blank = {r: 64, g: 64, b: 64, a: 1};
	static white = {r: 255, g: 255, b: 255, a: 1};
	static black = {r: 0, g: 0, b: 0, a: 1};
	static green = {r: 0, g: 216, b: 0, a: 1};
	static red = {r: 255, g: 0, b: 0, a: 1};
	static yellow = {r: 255, g: 255, b: 0, a: 1};
	static orange = {r: 255, g: 127, b: 0, a: 1};
	static blue = {r: 0, g: 0, b: 255, a: 1};
	static grey = {r: 153, g: 153, b: 153, a: 1};
	static lightGreen = {r: 119, g: 238, b: 0, a: 1};
	static purple = {r: 136, g: 17, b: 255, a: 1};
	static lightYellow = {r: 255, g: 255, b: 187, a: 1};
	static lightBlue = {r: 136, g: 221, b: 255, a: 1};
	static brown = {r: 255, g: 136, b: 51, a: 1};
	static pink = {r: 255, g: 153, b: 255, a: 1};
}

// Represents the information of a color, including opacity.

class Color {
	static knownColors = {
		transparent: ColorCollection.transparent,  t: ColorCollection.transparent,
		blank:       ColorCollection.blank,       bk: ColorCollection.blank,
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
	static checkFormat = colorString => {
		return Color.isHex6(colorString)
			|| Color.isHex8(colorString)
			|| Color.isHex3(colorString)
			|| Color.isRgb(colorString)
			|| Color.isRgba(colorString)
			|| Color.isKnownColor(colorString);
	};
	static isHex6 = colorString => {
		return /^#[0-9a-f]{6}$/i.test(colorString);
	};
	static isHex8 = colorString => {
		return /^#[0-9a-f]{8}$/i.test(colorString);
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
	static blank = new Color("blank");
	constructor(colorString) {
		if (Color.isHex6(colorString)) {
			this.r = parseInt(colorString.substr(1, 2), 16);
			this.g = parseInt(colorString.substr(3, 2), 16);
			this.b = parseInt(colorString.substr(5, 2), 16);
			this.a = 1;
		} else if (Color.isHex8(colorString)) {
			this.r = parseInt(colorString.substr(1, 2), 16);
			this.g = parseInt(colorString.substr(3, 2), 16);
			this.b = parseInt(colorString.substr(5, 2), 16);
			this.a = parseInt(colorString.substr(7, 2), 16) / 255;
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
	getRgbHex6 = () => {
		return "#"
			+ (this.r <= 15 ? "0" : "") + this.r.toString(16)
			+ (this.g <= 15 ? "0" : "") + this.g.toString(16)
			+ (this.b <= 15 ? "0" : "") + this.b.toString(16);
	};
	getRgbHex = () => {
		return "#"
			+ (this.r < 16 ? "0" : "") + this.r.toString(16)
			+ (this.g < 16 ? "0" : "") + this.g.toString(16)
			+ (this.b < 16 ? "0" : "") + this.b.toString(16)
			+ (this.a === 1 ? "" : (this.a <= 15 / 255 ? "0" : "") + (this.a * 255).toString(16));
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
	constructor(cycle, orbitType, runner, orbitRankOrRanks) {
		this.runner = runner;
		this.slotIndexList = cycle;
		this.orbitType = orbitType;
		if (Utils.isNumber(orbitRankOrRanks)) {
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
		if (orbit instanceof WingCubeOrbit && this.orbitRank !== orbit.rank) {
			this.runner.logger.debugLog(`Ignoring cycle because cyle orbit rank (${this.orbitRank}) and orbit rank (${orbit.rank}) are different.`);
			return;
		}
		if (orbit instanceof CenterBigCubeOrbit && !(this.orbitRanks[0] === orbit.ranks[0] && this.orbitRanks[1] === orbit.ranks[1])) {
			this.runner.logger.debugLog(`Ignoring cycle because cyle orbit ranks (${this.orbitRanks.join(", ")}) and orbit rank (${orbit.ranks.join(", ")}) are different.`);
			return;
		}
		this.runner.logger.debugLog(`Applying cycle of length ${this.getLength()} on orbit type ${this.orbitType}`
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

class SvgDrawer {
	static pathElementMoveTo = "moveTo";
	static pathElementLineTo = "lineTo";
	static pathElementHorizontalLineTo = "horizontalLineTo";
	static pathElementVerticalLineTo = "verticalLineTo";
	static pathElementArc = "arc";
	static pathElementClose = "close";
	constructor(document, runner) {
		this.runner = runner;
		this.runner.logger.detailedLog("Creating new SvgDrawer.");
		this.document = document;
	};
	createNode = (type, fields) => {
		let node = this.document.createElementNS("http://www.w3.org/2000/svg", type);
		for (let property in fields) {
			node.setAttributeNS(null, property, fields[property]);
		}
		return node;
	};
	createSvgRootNode = (height, width) => {
		return this.createNode("svg", {
			id: "svgRoot",
			height: height,
			width: width,
			viewBox: `${-width/2} ${-height/2} ${width} ${height}`
		});
	};
	createSquareNode = (id, horizontalPosition, verticalPosition, size, cornerRadius, fillingColor) => {
		return this.createRectNode(id, horizontalPosition, verticalPosition, size, size, cornerRadius, cornerRadius, fillingColor);
	};
	createRectNode = (id, horizontalPosition, verticalPosition, width, height, cornerRadiusX, cornerRadiusY, fillingColor) => {
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
		let svgRectTag = this.createNode("rect", rectObject);
		if (fillingColor) {
			this.fill(svgRectTag, fillingColor);
		}
		return svgRectTag;
	};
	createPathNode = (id, pathElements, fillingColor) => {
		let dElements = [];
		for (let pathElement of pathElements) {
			switch (pathElement.type) {
				case SvgDrawer.pathElementMoveTo:
					dElements.push(`M ${pathElement.x} ${pathElement.y}`); break;
				case SvgDrawer.pathElementLineTo:
					dElements.push(`L ${pathElement.x} ${pathElement.y}`); break;
				case SvgDrawer.pathElementHorizontalLineTo:
					dElements.push(`H ${pathElement.x}`); break;
				case SvgDrawer.pathElementVerticalLineTo:
					dElements.push(`V ${pathElement.y}`); break;
				case SvgDrawer.pathElementArc:
					dElements.push(`A ${pathElement.rx} ${pathElement.ry} ${pathElement.rotation ?? 0} ${pathElement.large ? 1 : 0} ${pathElement.sweep ? 1 : 0} ${pathElement.x} ${pathElement.y}`); break;
				case SvgDrawer.pathElementClose:
					dElements.push("Z"); break;
				default: this.runner.throwError(`Unknown path element type ${pathElement.type}.`);
			}
		}
		let pathTag = this.createNode("path", {id: id, d: dElements.join(" ")});
		if (fillingColor) {
			this.fill(pathTag, fillingColor);
		}
		return pathTag;
	};
	createGroupNode = properties => {
		return this.createNode("g", properties);
	};
	clone = svgNode => {
		return svgNode.cloneNode(true);
	};
	fill = (svgElement, fillingColor) => {
		svgElement.setAttribute("fill", fillingColor.getRgbHex6());
		let alpha = fillingColor.getAlpha();
		if (alpha !== 1) {
			svgElement.setAttribute(["fill-opacity"], alpha);
		}
	};
}

// Represents the information of a puzzle image drawer.

class TwistyPuzzleDrawer {
	static planView = "plan";
	static isometricView = "isometric";
	static netView = "net";
	static topDownView = "top-down";
	static views = [
		TwistyPuzzleDrawer.planView,
		TwistyPuzzleDrawer.isometricView,
		TwistyPuzzleDrawer.netView,
		TwistyPuzzleDrawer.topDown
	];
	static supportedViews = [
		TwistyPuzzleDrawer.planView,
		TwistyPuzzleDrawer.isometricView
	];
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new TwistyPuzzleDrawer.");
		this.puzzleClass = this.runner.puzzle.class;
		this.options = this.runner.drawingOptions;
		this.svgDrawer = new SvgDrawer(this.options.document, this.runner);
		for (let drawingOptionColorProperty of ["puzzleColor", "imageBackgroundColor"]) {
			if (!this.options[drawingOptionColorProperty] instanceof Color) {
				if (Utils.isUndefinedOrNull(this.options[drawingOptionColorProperty])) {
					this.runner.throwError(`Creating TwistyPuzzleDrawer with no property ${drawingOptionColorProperty}.`);
				} else {
					this.runner.throwError(`Creating TwistyPuzzleDrawer with erroneous ${drawingOptionColorProperty}.`);
				}
			}
		}
		for (let drawingOptionNumericProperty of ["puzzleHeight", "puzzleWidth", "imageHeight", "imageWidth"]) {
			if (!Utils.isNumber(this.options[drawingOptionNumericProperty])) {
				if (this.options[drawingOptionNumericProperty]) {
					this.runner.throwError(`Creating TwistyPuzzleDrawer with erroneous ${drawingOptionNumericProperty}.`);
				} else {
					this.runner.throwError(`Creating TwistyPuzzleDrawer with no property ${drawingOptionNumericProperty}.`);
				}
			}
		}
		if (Utils.isObject(this.options.document !== "object")) {
			this.runner.throwError("Creating TwistyPuzzleDrawer with erroneous document property.");
		}
	};
}

class CubeDrawer extends TwistyPuzzleDrawer {
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new CubeDrawer.");
		this.cubeSize = this.runner.puzzle.class.puzzleSize;
	};
	createSvgRootWithBackground = () => {
		let svg = this.svgDrawer.createSvgRootNode(this.options.imageHeight, this.options.imageWidth);
		let background = this.svgDrawer.createRectNode(
			"background",
			-this.options.imageWidth / 2,
			-this.options.imageHeight / 2,
			this.options.imageWidth,
			this.options.imageHeight,
			0,
			0,
			this.options.imageBackgroundColor);
		svg.appendChild(background);
		return svg;
	};
	createPuzzleGroup = () => {
		return this.svgDrawer.createGroupNode({
			id: "puzzle",
			transform: `scale(${this.options.puzzleWidth / 100}, ${this.options.puzzleHeight / 100})` // scale from (100, 100) to desired puzzle dimensions
		});
	};
}

class CubeIsometricDrawer extends CubeDrawer {
	constructor(runner) {
		super(runner);
		this.runner.logger.generalLog("Creating new CubeIsometricDrawer.");
		this.runner.logger.debugLog("Initializing dimensions.");
		// general dimensions
		this.options.faceCornerPseudoRadius = 10 / this.cubeSize;
		this.options.stickerSize = 45 / this.cubeSize;
		this.options.stickerCornerRadius = 10 / this.cubeSize;
		this.options.stickerMargin = 5 / (this.cubeSize + 1);
		// derived dimensions
		this.options.stickerOffsets = [...Array(this.cubeSize + 1).keys()].map(index => {
			let value = this.options.stickerMargin + (this.options.stickerSize + this.options.stickerMargin) * index;
			return {normal: value, projectionBig: value * Math.sqrt(3) / 2, projectionSmall: value / 2};
		});
		this.options.stickerAcuteAngleCornerRadius = this.options.stickerCornerRadius / Math.sqrt(3);
		this.options.stickerObtuseAngleCornerRadius = this.options.stickerCornerRadius * Math.sqrt(3);
		this.options.stickerSizeProjectionBig = this.options.stickerSize * Math.sqrt(3) / 2;
		this.options.stickerSizeProjectionSmall = this.options.stickerSize / 2;
		this.options.stickerCornerRadiusProjectionBig = this.options.stickerCornerRadius * Math.sqrt(3) / 2;
		this.options.stickerCornerRadiusProjectionSmall = this.options.stickerCornerRadius / 2;
	};
	createSvgSkeletton = () => {
		this.runner.logger.debugLog("Creating puzzle image skeletton");
		let svg = this.createSvgRootWithBackground();
		let puzzleGroup = this.createPuzzleGroup();
		this.runner.logger.debugLog("Creating faces skeletton.");
		let uFace = this.svgDrawer.createGroupNode({id: "face_U"});
		let fFace = this.svgDrawer.createGroupNode({id: "face_F"});
		let rFace = this.svgDrawer.createGroupNode({id: "face_R"});
		this.addFaceBackgrounds(uFace, fFace, rFace);
		if (this.puzzleClass.hasOrbitType(CenterCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating centers stickers skeletton.");
			let offset1 = this.options.stickerOffsets[(this.cubeSize - 1) / 2];
			let idBegin = `sticker_${CenterCubeOrbit.type}_`;
			uFace.appendChild(this.createSticker(`${idBegin}0`, 0, - offset1.normal, "U"));
			fFace.appendChild(this.createSticker(`${idBegin}1`, - offset1.projectionBig, offset1.projectionSmall, "F"));
			rFace.appendChild(this.createSticker(`${idBegin}2`, offset1.projectionBig, offset1.projectionSmall, "R"));
		}
		if (this.puzzleClass.hasOrbitType(CornerCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating corners stickers skeletton.");
			let offset0Big = this.options.stickerOffsets[0].projectionBig;
			let offset0Small = this.options.stickerOffsets[0].projectionSmall;
			let offset0Normal = this.options.stickerOffsets[0].normal;
			let offset2Big = this.options.stickerOffsets[this.cubeSize - 1].projectionBig;
			let offset2Small = this.options.stickerOffsets[this.cubeSize - 1].projectionSmall;
			let offset2Normal = this.options.stickerOffsets[this.cubeSize - 1].normal;
			let idBegin = `sticker_${CornerCubeOrbit.type}_`;
			uFace.appendChild(this.createSticker(`${idBegin}0`, 0, - 2 * offset2Small, "U"));
			uFace.appendChild(this.createSticker(`${idBegin}1`, offset2Big - offset0Big, - offset2Small - offset0Small, "U"));
			uFace.appendChild(this.createSticker(`${idBegin}2`, 0, - 2 * offset0Small, "U"));
			uFace.appendChild(this.createSticker(`${idBegin}3`, - offset2Big + offset0Big, - offset2Small - offset0Small, "U"));
			fFace.appendChild(this.createSticker(`${idBegin}4`, - offset2Big, - offset2Small + offset0Normal, "F"));
			fFace.appendChild(this.createSticker(`${idBegin}5`, - offset0Big, offset0Small, "F"));
			fFace.appendChild(this.createSticker(`${idBegin}6`, - offset0Big, offset2Normal - offset0Small, "F"));
			fFace.appendChild(this.createSticker(`${idBegin}7`, - offset2Big, offset2Normal - offset2Small, "F"));
			rFace.appendChild(this.createSticker(`${idBegin}8`, offset0Big, offset0Small, "R"));
			rFace.appendChild(this.createSticker(`${idBegin}9`, offset2Big, - offset2Small + offset0Normal, "R"));
			rFace.appendChild(this.createSticker(`${idBegin}10`, offset2Big, offset2Normal - offset2Small, "R"));
			rFace.appendChild(this.createSticker(`${idBegin}11`, offset0Big, offset2Normal - offset0Small, "R"));
		}
		if (this.puzzleClass.hasOrbitType(MidgeCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating midges stickers skeletton.");
			let offset0Big = this.options.stickerOffsets[0].projectionBig;
			let offset0Small = this.options.stickerOffsets[0].projectionSmall;
			let offset0Normal = this.options.stickerOffsets[0].normal;
			let offset1Big = this.options.stickerOffsets[(this.cubeSize - 1) / 2].projectionBig;
			let offset1Small = this.options.stickerOffsets[(this.cubeSize - 1) / 2].projectionSmall;
			let offset1Normal = this.options.stickerOffsets[(this.cubeSize - 1) / 2].normal;
			let offset2Big = this.options.stickerOffsets[this.cubeSize - 1].projectionBig;
			let offset2Small = this.options.stickerOffsets[this.cubeSize - 1].projectionSmall;
			let offset2Normal = this.options.stickerOffsets[this.cubeSize - 1].normal;
			let idBegin = `sticker_${MidgeCubeOrbit.type}_`;
			uFace.appendChild(this.createSticker(`${idBegin}0`, offset1Big - offset0Big, - offset2Small - offset1Small, "U"));
			uFace.appendChild(this.createSticker(`${idBegin}1`, offset1Big - offset0Big, - offset1Small - offset0Small, "U"));
			uFace.appendChild(this.createSticker(`${idBegin}2`, - offset1Big + offset0Big, - offset1Small - offset0Small, "U"));
			uFace.appendChild(this.createSticker(`${idBegin}3`, - offset1Big + offset0Big, - offset2Small - offset1Small, "U"));
			fFace.appendChild(this.createSticker(`${idBegin}4`, - offset1Big, offset0Normal - offset1Small, "F"));
			fFace.appendChild(this.createSticker(`${idBegin}5`, - offset0Big, offset1Normal - offset0Small, "F"));
			fFace.appendChild(this.createSticker(`${idBegin}6`, - offset1Big, offset2Normal - offset1Small, "F"));
			fFace.appendChild(this.createSticker(`${idBegin}7`, - offset2Big, offset1Normal - offset2Small, "F"));
			rFace.appendChild(this.createSticker(`${idBegin}8`, offset1Big, offset0Normal - offset1Small, "R"));
			rFace.appendChild(this.createSticker(`${idBegin}9`, offset2Big, offset1Normal - offset2Small, "R"));
			rFace.appendChild(this.createSticker(`${idBegin}10`, offset1Big, offset2Normal - offset1Small, "R"));
			rFace.appendChild(this.createSticker(`${idBegin}11`, offset0Big, offset1Normal - offset0Small, "R"));
		}
		if (this.puzzleClass.hasOrbitType(WingCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating wings stickers skeletton.");
			let offsets = this.options.stickerOffsets;
			let offset0Big = offsets[0].projectionBig;
			let offset0Small = offsets[0].projectionSmall;
			let offset0Normal = offsets[0].normal;
			let offset2Big = offsets[this.cubeSize - 1].projectionBig;
			let offset2Small = offsets[this.cubeSize - 1].projectionSmall;
			let offset2Normal = offsets[this.cubeSize - 1].normal;
			for (let wingRank = 1; wingRank <= this.puzzleClass.maxRankWithoutMiddle; wingRank++) {
				let wingRankComplementary = this.cubeSize - 1 - wingRank;
				let offsetWingBig = offsets[wingRank].projectionBig;
				let offsetWingSmall = offsets[wingRank].projectionSmall;
				let offsetWingNormal = offsets[wingRank].normal;
				let offsetComplementaryBig = offsets[wingRankComplementary].projectionBig;
				let offsetComplementarySmall = offsets[wingRankComplementary].projectionSmall;
				let offsetComplementaryNormal = offsets[wingRankComplementary].normal;
				let idBegin = `sticker_${WingCubeOrbit.type}_${wingRank}_`;
				uFace.appendChild(this.createSticker(`${idBegin}0`, offsetWingBig - offset0Big, - offset2Small - offsetComplementarySmall, "U"));
				uFace.appendChild(this.createSticker(`${idBegin}1`, offsetComplementaryBig - offset0Big, - offset2Small - offsetWingSmall, "U"));
				uFace.appendChild(this.createSticker(`${idBegin}2`, offsetComplementaryBig - offset0Big, - offsetComplementarySmall - offset0Small, "U"));
				uFace.appendChild(this.createSticker(`${idBegin}3`, offsetWingBig - offset0Big, - offsetWingSmall - offset0Small, "U"));
				uFace.appendChild(this.createSticker(`${idBegin}4`, - offsetWingBig + offset0Big, - offsetWingSmall - offset0Small, "U"));
				uFace.appendChild(this.createSticker(`${idBegin}5`, - offsetComplementaryBig + offset0Big, - offsetComplementarySmall - offset0Small, "U"));
				uFace.appendChild(this.createSticker(`${idBegin}6`, - offsetComplementaryBig + offset0Big, - offset2Small - offsetWingSmall, "U"));
				uFace.appendChild(this.createSticker(`${idBegin}7`, - offsetWingBig + offset0Big, - offset2Small - offsetComplementarySmall, "U"));
				fFace.appendChild(this.createSticker(`${idBegin}8`, - offsetComplementaryBig, offset0Normal - offsetComplementarySmall, "F"));
				fFace.appendChild(this.createSticker(`${idBegin}9`, - offsetWingBig, offset0Normal - offsetWingSmall, "F"));
				fFace.appendChild(this.createSticker(`${idBegin}10`, - offset0Big, offsetWingNormal - offset0Small, "F"));
				fFace.appendChild(this.createSticker(`${idBegin}11`, - offset0Big, offsetComplementaryNormal - offset0Small, "F"));
				fFace.appendChild(this.createSticker(`${idBegin}12`, - offsetWingBig, offset2Normal - offsetWingSmall, "F"));
				fFace.appendChild(this.createSticker(`${idBegin}13`, - offsetComplementaryBig, offset2Normal - offsetComplementarySmall, "F"));
				fFace.appendChild(this.createSticker(`${idBegin}14`, - offset2Big, offsetComplementaryNormal - offset2Small, "F"));
				fFace.appendChild(this.createSticker(`${idBegin}15`, - offset2Big, offsetWingNormal - offset2Small, "F"));
				rFace.appendChild(this.createSticker(`${idBegin}16`, offsetWingBig, offset0Normal - offsetWingSmall, "R"));
				rFace.appendChild(this.createSticker(`${idBegin}17`, offsetComplementaryBig, offset0Normal - offsetComplementarySmall, "R"));
				rFace.appendChild(this.createSticker(`${idBegin}18`, offset2Big, offsetWingNormal - offset2Small, "R"));
				rFace.appendChild(this.createSticker(`${idBegin}19`, offset2Big, offsetComplementaryNormal - offset2Small, "R"));
				rFace.appendChild(this.createSticker(`${idBegin}20`, offsetComplementaryBig, offset2Normal - offsetComplementarySmall, "R"));
				rFace.appendChild(this.createSticker(`${idBegin}21`, offsetWingBig, offset2Normal - offsetWingSmall, "R"));
				rFace.appendChild(this.createSticker(`${idBegin}22`, offset0Big, offsetComplementaryNormal - offset0Small, "R"));
				rFace.appendChild(this.createSticker(`${idBegin}23`, offset0Big, offsetWingNormal - offset0Small, "R"));
			}
		}
		if (this.puzzleClass.hasOrbitType(CenterBigCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating big cube centers stickers skeletton.");
			let offsets = this.options.stickerOffsets;
			for (let firstRank = 1; firstRank <= this.puzzleClass.maxRankWithoutMiddle; firstRank++) {
				let firstRankComplementary = this.cubeSize - 1 - firstRank;
				let offsetFirstWingBig = offsets[firstRank].projectionBig;
				let offsetFirstWingSmall = offsets[firstRank].projectionSmall;
				let offsetFirstWingNormal = offsets[firstRank].normal;
				let offsetFirstComplementaryBig = offsets[firstRankComplementary].projectionBig;
				let offsetFirstComplementarySmall = offsets[firstRankComplementary].projectionSmall;
				let offsetFirstComplementaryNormal = offsets[firstRankComplementary].normal;
				for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
					let secondRankComplementary = this.cubeSize - 1 - secondRank;
					let offsetSecondWingBig = offsets[secondRank].projectionBig;
					let offsetSecondWingSmall = offsets[secondRank].projectionSmall;
					let offsetSecondWingNormal = offsets[secondRank].normal;
					let offsetSecondComplementaryBig = offsets[secondRankComplementary].projectionBig;
					let offsetSecondComplementarySmall = offsets[secondRankComplementary].projectionSmall;
					let offsetSecondComplementaryNormal = offsets[secondRankComplementary].normal;
					let idBegin = `sticker_${CenterBigCubeOrbit.type}_${firstRank}_${secondRank}_`;
					let stickerIndexes = firstRank <= secondRank
						? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
						: [3, 0, 1, 2, 7, 4, 5, 6, 11, 8, 9, 10];
					uFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[0]}`, offsetSecondWingBig - offsetFirstWingBig, - offsetFirstComplementarySmall - offsetSecondComplementarySmall, "U"));
					uFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[1]}`, offsetSecondComplementaryBig - offsetFirstWingBig, - offsetSecondComplementarySmall - offsetFirstWingSmall, "U"));
					uFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[2]}`, offsetFirstWingBig - offsetSecondWingBig, - offsetFirstWingSmall - offsetSecondWingSmall, "U"));
					uFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[3]}`, - offsetFirstComplementaryBig + offsetSecondWingBig, - offsetFirstComplementarySmall - offsetSecondWingSmall, "U"));
					fFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[4]}`, - offsetSecondComplementaryBig, offsetFirstWingNormal - offsetSecondComplementarySmall, "F"));
					fFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[5]}`, - offsetFirstWingBig, offsetSecondWingNormal - offsetFirstWingSmall, "F"));
					fFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[6]}`, - offsetSecondWingBig, offsetFirstComplementaryNormal - offsetSecondWingSmall, "F"));
					fFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[7]}`, - offsetFirstComplementaryBig, offsetSecondComplementaryNormal - offsetFirstComplementarySmall, "F"));
					rFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[8]}`, offsetSecondWingBig, offsetFirstWingNormal - offsetSecondWingSmall, "R"));
					rFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[9]}`, offsetFirstComplementaryBig, offsetSecondWingNormal - offsetFirstComplementarySmall, "R"));
					rFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[10]}`, offsetSecondComplementaryBig, offsetFirstComplementaryNormal - offsetSecondComplementarySmall, "R"));
					rFace.appendChild(this.createSticker(`${idBegin}${stickerIndexes[11]}`, offsetFirstWingBig, offsetSecondComplementaryNormal - offsetFirstWingSmall, "R"));
				}
			}
		}
		puzzleGroup.appendChild(uFace);
		puzzleGroup.appendChild(fFace);
		puzzleGroup.appendChild(rFace);
		svg.appendChild(puzzleGroup);
		this.skeletton = svg;
	};
	addFaceBackgrounds = (uFace, fFace, rFace) => {
		let size = 50;
		let cornerPseudoRadius = this.options.faceCornerPseudoRadius;
		let cornerRadius = this.options.faceCornerPseudoRadius * Math.sqrt(3);
		let sizeProjectionBig = size * Math.sqrt(3) / 2;
		let sizeProjectionSmall = size / 2;
		let radiusProjectionBig = this.options.faceCornerPseudoRadius * Math.sqrt(3) / 2;
		let radiusProjectionSmall = this.options.faceCornerPseudoRadius / 2;
		let alignmentFactor = Math.sqrt(3) - 3 / 2;
		uFace.appendChild(
			this.svgDrawer.createPathNode(
				"face_U_background",
				[
					{type: SvgDrawer.pathElementMoveTo, x: 0, y: 0},
					{type: SvgDrawer.pathElementLineTo, x: - sizeProjectionBig + cornerPseudoRadius * alignmentFactor, y: - sizeProjectionSmall + cornerPseudoRadius - radiusProjectionBig},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: - sizeProjectionBig + radiusProjectionBig, y: - sizeProjectionSmall - radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: - radiusProjectionBig, y: - size + radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: radiusProjectionBig, y: - size + radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: sizeProjectionBig - radiusProjectionBig, y: - sizeProjectionSmall - radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: 0, ry: cornerRadius, x: sizeProjectionBig - cornerPseudoRadius * alignmentFactor, y: - sizeProjectionSmall + cornerPseudoRadius - radiusProjectionBig, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: 0, y: 0},
					{type: SvgDrawer.pathElementClose}
				],
				this.options.puzzleColor
			)
		);
		fFace.appendChild(
			this.svgDrawer.createPathNode(
				"face_F_background",
				[
					{type: SvgDrawer.pathElementMoveTo, x: 0, y: 0},
					{type: SvgDrawer.pathElementVerticalLineTo, y: size - cornerPseudoRadius * (2 - Math.sqrt(3))},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: - radiusProjectionBig, y: size - radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: - sizeProjectionBig + radiusProjectionBig, y: sizeProjectionSmall + radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: - sizeProjectionBig, y: sizeProjectionSmall - cornerPseudoRadius, sweep: true, large: false},
					{type: SvgDrawer.pathElementVerticalLineTo, y: - sizeProjectionSmall + cornerPseudoRadius},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: - sizeProjectionBig + cornerPseudoRadius * alignmentFactor, y: - sizeProjectionSmall + cornerPseudoRadius - radiusProjectionBig, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: 0, y: 0},
					{type: SvgDrawer.pathElementClose}
				],
				this.options.puzzleColor
			)
		);
		rFace.appendChild(
			this.svgDrawer.createPathNode(
				"face_R_background",
				[
					{type: SvgDrawer.pathElementMoveTo, x: 0, y: 0},
					{type: SvgDrawer.pathElementLineTo, x: sizeProjectionBig - cornerPseudoRadius * alignmentFactor, y: - sizeProjectionSmall + cornerPseudoRadius - radiusProjectionBig},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: sizeProjectionBig, y: - sizeProjectionSmall + cornerPseudoRadius, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: sizeProjectionBig, y: sizeProjectionSmall - cornerPseudoRadius},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: sizeProjectionBig - radiusProjectionBig, y: sizeProjectionSmall + radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: radiusProjectionBig, y: size - radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: cornerRadius, ry: cornerRadius, x: 0, y: size - cornerPseudoRadius * alignmentFactor, sweep: true, large: false},
					{type: SvgDrawer.pathElementVerticalLineTo, y: 0},
					{type: SvgDrawer.pathElementClose}
				],
				this.options.puzzleColor
			)
		);
	};
	createSticker = (id, referenceX, referenceY, face) => {
		let size = this.options.stickerSize;
		let sizeProjectionBig = this.options.stickerSizeProjectionBig;
		let sizeProjectionSmall = this.options.stickerSizeProjectionSmall;
		let cornerPseudoRadius = this.options.stickerCornerRadius;
		let radiusProjectionBig = this.options.stickerCornerRadiusProjectionBig;
		let radiusProjectionSmall = this.options.stickerCornerRadiusProjectionSmall;
		let acuteAngleCornerRadius = this.options.stickerAcuteAngleCornerRadius;
		let obtuseAngleCornerRadius = this.options.stickerObtuseAngleCornerRadius;
		switch (face) {
			case "U": return this.svgDrawer.createPathNode(
				id,
				[
					{type: SvgDrawer.pathElementMoveTo, x: referenceX - radiusProjectionBig, y: referenceY - radiusProjectionSmall},
					{type: SvgDrawer.pathElementLineTo, x: referenceX - sizeProjectionBig + radiusProjectionBig, y: referenceY - sizeProjectionSmall + radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: acuteAngleCornerRadius, ry: acuteAngleCornerRadius, x: referenceX - sizeProjectionBig + radiusProjectionBig, y: referenceY - sizeProjectionSmall - radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: referenceX - radiusProjectionBig, y: referenceY - size + radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: obtuseAngleCornerRadius, ry: obtuseAngleCornerRadius, x: referenceX + radiusProjectionBig, y: referenceY - size + radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: referenceX + sizeProjectionBig - radiusProjectionBig, y: referenceY - sizeProjectionSmall - radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: acuteAngleCornerRadius, ry: acuteAngleCornerRadius, x: referenceX + sizeProjectionBig - radiusProjectionBig, y: referenceY - sizeProjectionSmall + radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: referenceX + radiusProjectionBig, y: referenceY - radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: obtuseAngleCornerRadius, ry: obtuseAngleCornerRadius, x: referenceX - radiusProjectionBig, y: referenceY - radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementClose}
				]);
			case "F": return this.svgDrawer.createPathNode(
				id,
				[
					{type: SvgDrawer.pathElementMoveTo, x: referenceX, y: referenceY + cornerPseudoRadius},
					{type: SvgDrawer.pathElementVerticalLineTo, y: referenceY + size - cornerPseudoRadius},
					{type: SvgDrawer.pathElementArc, rx: acuteAngleCornerRadius, ry: acuteAngleCornerRadius, x: referenceX - radiusProjectionBig, y: referenceY + size - radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: referenceX - sizeProjectionBig + radiusProjectionBig, y: referenceY + sizeProjectionSmall + radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: obtuseAngleCornerRadius, ry: obtuseAngleCornerRadius, x: referenceX - sizeProjectionBig, y: referenceY + sizeProjectionSmall - cornerPseudoRadius, sweep: true, large: false},
					{type: SvgDrawer.pathElementVerticalLineTo, y: referenceY - sizeProjectionSmall + cornerPseudoRadius},
					{type: SvgDrawer.pathElementArc, rx: acuteAngleCornerRadius, ry: acuteAngleCornerRadius, x: referenceX - sizeProjectionBig + radiusProjectionBig, y: referenceY - sizeProjectionSmall + radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: referenceX - radiusProjectionBig, y: referenceY - radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: obtuseAngleCornerRadius, ry: obtuseAngleCornerRadius, x: referenceX, y: referenceY + cornerPseudoRadius, sweep: true, large: false},
					{type: SvgDrawer.pathElementClose}
				]);
			case "R": return this.svgDrawer.createPathNode(
				id,
				[
					{type: SvgDrawer.pathElementMoveTo, x: referenceX + radiusProjectionBig, y: referenceY - radiusProjectionSmall},
					{type: SvgDrawer.pathElementLineTo, x: referenceX + sizeProjectionBig - radiusProjectionBig, y: referenceY - sizeProjectionSmall + radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: acuteAngleCornerRadius, ry: acuteAngleCornerRadius, x: referenceX + sizeProjectionBig, y: referenceY - sizeProjectionSmall + cornerPseudoRadius, sweep: true, large: false},
					{type: SvgDrawer.pathElementVerticalLineTo, y: referenceY + sizeProjectionSmall - cornerPseudoRadius},
					{type: SvgDrawer.pathElementArc, rx: obtuseAngleCornerRadius, ry: obtuseAngleCornerRadius, x: referenceX + sizeProjectionBig - radiusProjectionBig, y: referenceY + sizeProjectionSmall + radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementLineTo, x: referenceX + radiusProjectionBig, y: referenceY + size - radiusProjectionSmall},
					{type: SvgDrawer.pathElementArc, rx: acuteAngleCornerRadius, ry: acuteAngleCornerRadius, x: referenceX, y: referenceY + size - cornerPseudoRadius, sweep: true, large: false},
					{type: SvgDrawer.pathElementVerticalLineTo, y: referenceY + cornerPseudoRadius},
					{type: SvgDrawer.pathElementArc, rx: obtuseAngleCornerRadius, ry: obtuseAngleCornerRadius, x: referenceX + radiusProjectionBig, y: referenceY - radiusProjectionSmall, sweep: true, large: false},
					{type: SvgDrawer.pathElementClose}
				]);
		};
	};
	drawPuzzle = puzzle => { // clone skeletton and apply colors on each displayed sticker
		this.runner.logger.generalLog("Drawing puzzle.");
		this.runner.logger.debugLog("Cloning skeletton.");
		let svg = this.svgDrawer.clone(this.skeletton);
		for (let orbit of puzzle.orbitList) {
			let orbitType = orbit.getType();
			this.runner.logger.detailedLog(`Coloring stickers of orbit type ${orbitType}`
				+ (orbitType === WingCubeOrbit.type ? ` (rank = ${orbit.rank})` : "")
				+ (orbitType === CenterBigCubeOrbit.type ? ` (ranks = [${orbit.ranks.join(", ")}])` : "")
				+ ".");
			let slotIndexList = [];
			let selectorBegin = `path#sticker_${orbitType}_`;
			switch (orbitType) {
				case CornerCubeOrbit.type: slotIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; break;
				case MidgeCubeOrbit.type: slotIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; break;
				case CenterCubeOrbit.type: slotIndexList = [0, 1, 2]; break;
				case WingCubeOrbit.type:
					slotIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
					selectorBegin += `${orbit.rank}_`;
					break;
				case CenterBigCubeOrbit.type:
					slotIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
					selectorBegin += `${orbit.ranks[0]}_${orbit.ranks[1]}_`;
					break;
				default:
					this.runner.throwError(`Unknown cube orbit type "${orbitType}"`);
			}
			for (let slotIndex of slotIndexList) {
				this.svgDrawer.fill(
					svg.querySelector(`${selectorBegin}${slotIndex}`),
					orbit.slotList[slotIndex].getContent().color
				);
			}
		}
		return svg;
	};
}

class CubePlanDrawer extends CubeDrawer {
	constructor(runner) {
		super(runner);
		this.runner.logger.generalLog("Creating new CubePlanDrawer.");
		this.runner.logger.debugLog("Initializing dimensions.");
		this.options.adjacentFaceCornerRadius = 20 / this.cubeSize;
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
		this.runner.logger.debugLog("Creating puzzle image skeletton");
		let svg = this.createSvgRootWithBackground();
		let puzzleGroup = this.createPuzzleGroup();
		this.runner.logger.debugLog("Creating faces skeletton.");
		let scale = this.cubeSize / (this.cubeSize + 1);
		let uFace = this.svgDrawer.createGroupNode({id: "face_U", transform: `scale(${scale}, ${scale})`});
		let fFace = this.svgDrawer.createGroupNode({id: "face_F", transform: `scale(${scale}, ${scale})`});
		let rFace = this.svgDrawer.createGroupNode({id: "face_R", transform: `scale(${scale}, ${scale}) rotate(-90 0 0)`});
		let bFace = this.svgDrawer.createGroupNode({id: "face_B", transform: `scale(${scale}, ${scale}) rotate(180 0 0)`});
		let lFace = this.svgDrawer.createGroupNode({id: "face_L", transform: `scale(${scale}, ${scale}) rotate(90 0 0)`});
		uFace.appendChild(this.svgDrawer.createSquareNode("face_U_background", -50, -50, 100, 0, this.options.puzzleColor));
		fFace.appendChild(this.createAdjacentFaceBackground("F"));
		rFace.appendChild(this.createAdjacentFaceBackground("R"));
		bFace.appendChild(this.createAdjacentFaceBackground("B"));
		lFace.appendChild(this.createAdjacentFaceBackground("L"));
		if (this.puzzleClass.hasOrbitType(CenterCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating centers stickers skeletton.");
			let startingValueIndex = (this.cubeSize - 1) / 2;
			let idBegin = `sticker_${CenterCubeOrbit.type}_`;
			uFace.appendChild(this.createUFaceSticker(`${idBegin}0`, startingValueIndex, startingValueIndex));
			if (this.puzzleClass.puzzleSize === 1) {
				fFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}1`, 0));
				rFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}2`, 0));
				bFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}4`, 0));
				lFace.appendChild(this.createAdjacentFaceSticker(`${idBegin}5`, 0));
			}
		}
		if (this.puzzleClass.hasOrbitType(CornerCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating corners stickers skeletton.");
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
		if (this.puzzleClass.hasOrbitType(MidgeCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating midges stickers skeletton.");
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
		if (this.puzzleClass.hasOrbitType(WingCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating wings stickers skeletton.");
			let highIndex = this.cubeSize - 1;
			let wingMaxIndex = this.puzzleClass.maxRankWithoutMiddle;
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
		if (this.puzzleClass.hasOrbitType(CenterBigCubeOrbit.type)) {
			this.runner.logger.debugLog("Creating big cube centers stickers skeletton.");
			for (let firstRank = 1; firstRank <= this.puzzleClass.maxRankWithoutMiddle; firstRank++) {
				let firstComplementaryIndex = this.cubeSize - firstRank - 1;
				for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
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
		return this.svgDrawer.createSquareNode(
			id,
			this.options.startingValues[gridStartingX],
			this.options.startingValues[gridStartingY],
			this.options.stickerSize,
			this.options.stickerCornerRadius
		);
	};
	createAdjacentFaceBackground = faceName => {
		return this.svgDrawer.createPathNode(`face_${faceName}_background`,
			[
				{type: SvgDrawer.pathElementMoveTo, x: -50, y: 50},
				{type: SvgDrawer.pathElementVerticalLineTo, y: 50 + 50 / this.cubeSize - this.options.adjacentFaceCornerRadius / 2},
				{type: SvgDrawer.pathElementArc, x: - 50 + this.options.adjacentFaceCornerRadius, y: 50 + 50 / this.cubeSize, rx: this.options.adjacentFaceCornerRadius, ry: this.options.adjacentFaceCornerRadius / 2, sweep: false, large: false},
				{type: SvgDrawer.pathElementHorizontalLineTo, x: 50 - this.options.adjacentFaceCornerRadius},
				{type: SvgDrawer.pathElementArc, x: 50, y: 50 + 50 / this.cubeSize - this.options.adjacentFaceCornerRadius / 2, rx: this.options.adjacentFaceCornerRadius, ry: this.options.adjacentFaceCornerRadius / 2, sweep: false, large: false},
				{type: SvgDrawer.pathElementVerticalLineTo, y: 50},
				{type: SvgDrawer.pathElementClose}
			],
			this.options.puzzleColor);
	};
	createAdjacentFaceSticker = (id, gridStarting) => {
		return this.svgDrawer.createRectNode(
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
		this.runner.logger.generalLog("Drawing puzzle.");
		this.runner.logger.debugLog("Cloning skeletton.");
		let svg = this.svgDrawer.clone(this.skeletton);
		for (let orbit of puzzle.orbitList) {
			let orbitType = orbit.getType();
			this.runner.logger.detailedLog(`Coloring stickers of orbit type ${orbitType}`
				+ (orbitType === WingCubeOrbit.type ? ` (rank = ${orbit.rank})` : "")
				+ (orbitType === CenterBigCubeOrbit.type ? ` (ranks = [${orbit.ranks.join(", ")}])` : "")
				+ ".");
			let slotIndexList = [];
			let selectorBegin = `rect#sticker_${orbitType}_`;
			switch (orbitType) {
				case CornerCubeOrbit.type: slotIndexList = [0, 1, 2, 3, 4, 5, 8, 9, 16, 17, 20, 21]; break;
				case MidgeCubeOrbit.type: slotIndexList = [0, 1, 2, 3, 4, 8, 16, 20]; break;
				case CenterCubeOrbit.type: slotIndexList = this.puzzleClass.puzzleSize === 1 ? [0, 1, 2, 4, 5] : [0]; break;
				case WingCubeOrbit.type:
					slotIndexList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 16, 17, 32, 33, 40, 41];
					selectorBegin += `${orbit.rank}_`;
					break;
				case CenterBigCubeOrbit.type:
					slotIndexList = [0, 1, 2, 3];
					selectorBegin += `${orbit.ranks[0]}_${orbit.ranks[1]}_`;
					break;
				default:
					this.runner.throwError(`Unknown cube orbit type "${orbitType}"`);
			}
			for (let slotIndex of slotIndexList) {
				this.svgDrawer.fill(
					svg.querySelector(`${selectorBegin}${slotIndex}`),
					orbit.slotList[slotIndex].getContent().color
				);
			}
		}
		return svg;
	};
}

class CubeNetDrawer extends CubeDrawer {
	constructor(runner) {
		super(runner);
	};
	createSvgSkeletton = () => { // todo
	};
}

class CubeTopDownDrawer extends CubeDrawer {
	constructor(runner) {
		super(runner);
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
	static consoleLoggerMode = "console";
	static htmlTagLoggerMode = "htmlTag";
	static noneLoggerMode = "none";
	static loggerModes = [
		Logger.consoleLoggerMode,
		Logger.htmlTagLoggerMode,
		Logger.noneLoggerMode
	];
	static offVerbosityLevel = 0;
	static errorVerbosityLevel = 1;
	static generalVerbosityLevel = 2;
	static detailedVerbosityLevel = 3;
	static debugVerbosityLevel = 4;
	static verbosityLevels = [
		Logger.offVerbosityLevel,
		Logger.errorVerbosityLevel,
		Logger.generalVerbosityLevel,
		Logger.detailedVerbosityLevel,
		Logger.debugVerbosityLevel
	];
	static defaultOptions = {
		mode: Logger.consoleLoggerMode,
		verbosityLevel: Logger.generalVerbosityLevel,
		inOutput: false
	};
	static consoleLog = console.log;
	resultLog = message => {
		this.runner.logs.all += message + "\n";
		this.runner.logs.partial += message + "\n";
	};
	static noLog = () => {};
	htmlLog = message => {
		this.logHtmlTag.innerHTML += message + "<br/>";
	};
	constructor (mode, runner, inOutput, htmlTag) {
		this.runner = runner;
		this.mode = mode;
		this.inOutput = inOutput;
		let logMethod;
		switch (mode) {
			case Logger.consoleLoggerMode: logMethod = Logger.consoleLog; break;
			case Logger.htmlTagLoggerMode: this.logHtmlTag = htmlTag; logMethod = this.htmlLog; break;
			case Logger.noneLoggerMode: logMethod = Logger.noLog; break;
			default: this.runner.throwError(`Invalid log mode ${mode}.`);
			// todo probably add Google Sheet cell as a mode
		}
		if (inOutput) {
			this.log = message => {
				logMethod(message);
				this.resultLog(message);
			};
			this.runner.logs = {
				all: "",
				partial: ""
			};
		} else {
			this.log = logMethod;
		}
	};
	errorLog = () => {};
	warningLog = message => {
		this.detailedLog(`[Warning] ${message}`);
	};
	generalLog = () => {};
	detailedLog = () => {};
	debugLog = () => {};
	resetPartialLogs = () => {
		if (this.inOutput) {
			this.runner.logs.partial = "";
		}
	};
}

class ErrorLogger extends Logger { // writes only error logs
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	static buildErrorMessage = message => {
		return `[Error] ${message}`;
	};
	errorLog = message => {
		this.log(ErrorLogger.buildErrorMessage(message));
	};
}

class GeneralLogger extends ErrorLogger { // writes general informative logs
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	generalLog = this.log;
}

class DetailedLogger extends GeneralLogger { // writes detailed informative logs and warning logs
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	detailedLog = this.log;
}

class DebugLogger extends DetailedLogger { // writes all logs for debug
	constructor (mode, runner, inOutput, htmlTag) {
		super(mode, runner, inOutput, htmlTag);
	};
	debugLog = this.log;
}

// Represents the information of a move sequence.

class MoveSequence {
	constructor(moves, runner) {
		this.runner = runner;
		this.runner.logger.generalLog("Creating new MoveSequence.");
		this.moveList = moves ?? [];
	};
	appendMove = move => {
		this.moveList.push(move);
	};
	applyOnPuzzle = puzzle => {
		this.runner.logger.generalLog(`Applying move sequence of length ${this.moveList.length} on a solved puzzle.`);
		this.moveList.forEach(move => move.applyOnPuzzle(puzzle));
	};
};

// Represent the permutation induced by a move in terms of cycles.

class Move {
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Move.");
		this.cycles = [];
	};
	getCycleList = () => {
		return this.cycles;
	};
	pushCycles = (cycles, orbitType, rankOrRanks) => {
		for (let slotList of cycles) {
			this.cycles.push(new Cycle(slotList, orbitType, this.runner, rankOrRanks));
		}
	};
	applyOnPuzzle = puzzle => {
		this.runner.logger.detailedLog("Applying move on puzzle.");
		for (let cycle of this.getCycleList()) {
			for (let orbit of puzzle.orbitList) {
				if (cycle.orbitType === orbit.getType()) {
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
	constructor({face, sliceBegin, sliceEnd, turnCount, runner}) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CubeMove.");
		this.face = face;
		this.sliceBegin = sliceBegin;
		this.sliceEnd = sliceEnd;
		this.turnCount = turnCount;
		this.puzzleClass = this.runner.puzzle.class;
		let isBigCube = this.puzzleClass.puzzleSize >= 4;
		if (this.sliceBegin < 1) {
			this.runner.throwError("Creating move with sliceBegin < 1.");
		}
		if (this.sliceEnd > this.puzzleClass.puzzleSize) {
			this.runner.throwError("Creating move with sliceEnd > cube size.");
		}
		if (this.sliceBegin > this.sliceEnd) {
			this.runner.throwError("Creating move with sliceBegin > sliceEnd.");
		}
		if (this.sliceBegin === 1) { // first layer
			this.treatFirstLayer(isBigCube);
		}
		if (isBigCube && this.sliceEnd > 1) { // between first layer and middle layer
			this.treatBetweenFirstAndMiddleLayer(Math.max(1, this.sliceBegin - 1), Math.min(this.sliceEnd - 1, this.puzzleClass.maxRankWithoutMiddle));
		}
		if ((this.puzzleClass.puzzleSize === 3 && this.sliceBegin <= 2 && this.sliceEnd >= 2)
			|| (this.puzzleClass.middleSlice && this.sliceBegin <= this.puzzleClass.middleSlice && this.sliceEnd >= this.puzzleClass.middleSlice)) { // middle layer
			this.treatMiddleLayer(isBigCube);
		}
		if (isBigCube && this.sliceEnd > this.puzzleClass.maxRankWithMiddle + 1) { // between middle layer and last layer
			this.treatBetweenMiddleAndLastLayer(Math.max(1, this.puzzleClass.puzzleSize - this.sliceEnd),
				Math.min(this.puzzleClass.puzzleSize - this.sliceBegin, this.puzzleClass.maxRankWithoutMiddle));
		}
		if (this.sliceEnd === this.puzzleClass.puzzleSize) { // last layer
			this.treatLastLayer(isBigCube);
		}
	};
	treatFirstLayer = isBigCube => {
		this.addCornerElementaryCycles();
		this.addMidgeElementaryCycles(CubeMove.externalMode);
		if (isBigCube) {
			for (let firstRank = 1; firstRank <= this.puzzleClass.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank);
				for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
					if (firstRank === secondRank) {
						this.addXCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					} else {
						this.addCenterBigCubeElementaryCycles(CubeMove.externalMode, [firstRank, secondRank]);
					}
				}
			}
		} else if (this.puzzleClass.puzzleSize === 1) {
			this.addCenterElementaryCycles();
		}
	};
	treatBetweenFirstAndMiddleLayer = (firstRankBegin, firstRankEnd) => {
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) { // between first layer and middle layer
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank);
			for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
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
			for (let centerRank = 1; centerRank <= this.puzzleClass.maxRankWithoutMiddle; centerRank++) {
				this.addCenterBigCubeElementaryCycles(CubeMove.internalDirectMode, [centerRank, this.puzzleClass.middleSlice - 1]);
				this.addCenterBigCubeElementaryCycles(CubeMove.internalIndirectMode, [centerRank, this.puzzleClass.middleSlice - 1]);
			}
		}
	};
	treatBetweenMiddleAndLastLayer = (firstRankBegin, firstRankEnd) => {
		let oppositeTurnCount = CubeMoveParser.cleanTurnCount(-this.turnCount);
		let oppositeFace = CubeMoveParser.getOppositeFace(this.face);
		for (let firstRank = firstRankBegin; firstRank <= firstRankEnd; firstRank++) {
			this.addWingElementaryCycles(CubeMove.internalMode, firstRank, oppositeFace, oppositeTurnCount);
			for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
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
			for (let firstRank = 1; firstRank <= this.puzzleClass.maxRankWithoutMiddle; firstRank++) {
				this.addWingElementaryCycles(CubeMove.externalMode, firstRank, oppositeFace, oppositeTurnCount);
				for (let secondRank = 1; secondRank <= this.puzzleClass.maxRankWithMiddle; secondRank++) {
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
		if (this.puzzleClass.hasOrbitType(CornerCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.externalMode][face][turnCount], CornerCubeOrbit.type);
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], CornerCubeOrbit.type);
		}
	};
	addCenterElementaryCycles = () => {
		if (this.puzzleClass.hasOrbitType(CenterCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CenterCubeOrbit.type][CubeMove.internalMode][this.face][this.turnCount], CenterCubeOrbit.type);
		}
	};
	addMidgeElementaryCycles = (midgeMode, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(MidgeCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][midgeMode][face][turnCount], MidgeCubeOrbit.type);
			if (midgeMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[MidgeCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], MidgeCubeOrbit.type);
			}
		}
	};
	addWingElementaryCycles = (wingMode, wingRank, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(WingCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][wingMode][face][turnCount], WingCubeOrbit.type, wingRank);
			if (wingMode === CubeMove.externalMode) {
				this.pushCycles(CubeMove.elementaryCycles[WingCubeOrbit.type][CubeMove.semiExternalMode][face][turnCount], WingCubeOrbit.type, wingRank);
			}
		}
	};
	addXCenterBigCubeElementaryCycles = (centerMode, centerRanks, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(CenterBigCubeOrbit.type)) {
			this.pushCycles(CubeMove.elementaryCycles[CornerCubeOrbit.type][centerMode][face][turnCount], CenterBigCubeOrbit.type, centerRanks);
		}
	};
	addCenterBigCubeElementaryCycles = (centerMode, centerRanks, face = this.face, turnCount = this.turnCount) => {
		if (this.puzzleClass.hasOrbitType(CenterBigCubeOrbit.type)) {
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
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.generalLog("Creating new MoveSequenceParser.");
		switch(this.runner.puzzle.class.shape) {
			case Cube.shape:
				this.moveParser = new CubeMoveParser(this.runner);
				this.runner.logger.debugLog("Attaching CubeMoveParser to MoveSequenceParser.");
				break;
			default:
				this.runner.throwError(`Cannot parse move sequence for puzzle type "${this.runner.puzzleClass.shape}."`);
		}
	};
	parseMoveSequence = moveSequenceInput => {
		this.runner.logger.generalLog(`Parsing move sequence "${moveSequenceInput}".`);
		let moveSequence = new MoveSequence([], this.runner);
		for (let moveToParse of moveSequenceInput.split(" ").filter(move => move !== "")) {
			moveSequence.appendMove(this.moveParser.parseMove(moveToParse));
		}
		return moveSequence;
	};
}

// Represents the information of a move parser, used by the move sequence parser to individually parse each move of the sequence.

class MoveParser {
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new MoveParser.");
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
	constructor(runner) {
		super(runner);
		this.runner.logger.generalLog("Creating new CubeMoveParser.");
		this.cubeSize = this.runner.puzzle.class.puzzleSize;
	};
	parseMove = moveString => {
		this.runner.logger.detailedLog(`Parsing move "${moveString}".`);
		let faceListSubRegExp = "[UFRDBL]";
		let directionListSubRegExp = "('?\\d*|\\d+')"; // empty, ', 2, 2', '2
		if (new RegExp(`^[xyz]${directionListSubRegExp}$`).test(moveString)) { // x, y', z2, ...
			return new CubeMove({
				face: CubeMoveParser.getExternalFace(moveString[0]),
				sliceBegin: 1,
				sliceEnd: this.cubeSize,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1)),
				runner: this.runner
			});
		} else if (this.cubeSize === 1) {
			this.runner.throwError("Applying an incorrect move on a 1x1x1 cube.");
		} else if (new RegExp(`^${faceListSubRegExp}${directionListSubRegExp}$`).test(moveString)) { // R, U', F2, ...
			return new CubeMove({
				face: moveString[0],
				sliceBegin: 1,
				sliceEnd: 1,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1)),
				runner: this.runner
			});
		} else if (this.cubeSize === 2) {
			this.runner.throwError("Applying an incorrect move on a 2x2x2 cube.");
		} else if (new RegExp(`^${faceListSubRegExp.toLowerCase()}${directionListSubRegExp}$`).test(moveString)) { // r, u', f2
			return new CubeMove({
				face: CubeMoveParser.parseFace(moveString[0]),
				sliceBegin: this.cubeSize === 3 ? 1 : 2,
				sliceEnd: 2,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1)),
				runner: this.runner
			});
		} else if (new RegExp(`^\\d*[MES]${directionListSubRegExp}$`, "i").test(moveString)) { // M, E', S2
			let middleSliceCountMatch = moveString.match(/^\d*/)[0];
			let middleSliceCount = middleSliceCountMatch === "" ? 1 : parseInt(middleSliceCountMatch);
			if ((middleSliceCount + this.cubeSize) % 2) {
				this.runner.throwError(`Wrong structure for CubeMove (${this.cubeSize % 2 ? "odd" : "even"} cube size and ${this.cubeSize % 2 ? "even" : "odd"}`
				+ " number of slices for middle slice move).");
			} else if (middleSliceCount < this.cubeSize && middleSliceCount > 0) {
				return new CubeMove({
					face: CubeMoveParser.getExternalFace(moveString.replace(/^\d*/, "")[0]),
					sliceBegin: (this.cubeSize - middleSliceCount) / 2 + 1,
					sliceEnd: (this.cubeSize + middleSliceCount) / 2,
					turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1)),
					runner: this.runner
				});
			} else {
				this.runner.throwError(`Applying an inner slice move involving ${middleSliceCount} slices on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			}
		} else if (new RegExp(`^\\d*${faceListSubRegExp}w${directionListSubRegExp}$`).test(moveString)) { // Rw, Uw', 3Fw2, ...
			let numberOfSlicesString = moveString.match(new RegExp("^\\d*"))[0];
			let numberOfSlices = numberOfSlicesString !== "" ? parseInt(numberOfSlicesString) : 2;
			if (numberOfSlices <= 1) {
				this.runner.throwError(`Applying a wide move with less than 2 layers (${numberOfSlices}).`);
			} else if (numberOfSlices < this.cubeSize) {
				return new CubeMove({
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: 1,
					sliceEnd: numberOfSlices,
					turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1)),
					runner: this.runner
				});
			} else {
				this.runner.throwError(`Applying an outer slice move involving ${numberOfSlices} slices on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			}
		} else if (new RegExp(`^\\d+${faceListSubRegExp}${directionListSubRegExp}$`, "i").test(moveString)) { // 2R, 3U', 4F2
			let sliceNumber = moveString.match(/\d+/)[0];
			let turnCount = CubeMoveParser.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1));
			if (sliceNumber < 2 || sliceNumber >= this.cubeSize) {
				this.runner.throwError(`Applying an inner slice move involving the slice of rank ${sliceNumber} on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			} else if (sliceNumber > (this.cubeSize + 1) / 2) {
				return new CubeMove({
					face: CubeMoveParser.getOppositeFace(CubeMoveParser.parseFace(moveString)),
					sliceBegin: this.cubeSize + 1 - sliceNumber,
					sliceEnd: this.cubeSize + 1 - sliceNumber,
					turnCount: CubeMoveParser.cleanTurnCount(-turnCount),
					runner: this.runner
				});
			} else {
				return new CubeMove({
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: sliceNumber,
					sliceEnd: sliceNumber,
					turnCount: turnCount,
					runner: this.runner
				});
			}
		} else if (new RegExp(`^\\d+-\\d+${faceListSubRegExp}w${directionListSubRegExp}`).test(moveString)) { // 2-3Rw, 3-4Uw', 4-6Fw2
			let [sliceBegin, sliceEnd] = moveString.match(/\d+/g);
			[sliceBegin, sliceEnd] = [Math.min(sliceBegin, sliceEnd), Math.max(sliceBegin, sliceEnd)];
			let turnCount = CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1));
			if (sliceBegin < 2 || sliceEnd >= this.cubeSize) {
				this.runner.throwError(`Applying an inner slice move involving slices from ${sliceBegin} to ${sliceEnd} on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			} else if (sliceBegin - 1 > this.cubeSize - sliceEnd) {
				return new CubeMove({
					face: CubeMoveParser.getOppositeFace(CubeMoveParser.parseFace(moveString)),
					sliceBegin: this.cubeSize + 1 - sliceEnd,
					sliceEnd: this.cubeSize + 1 - sliceBegin,
					turnCount: CubeMoveParser.cleanTurnCount(-turnCount),
					runner: this.runner
				});
			} else {
				return new CubeMove({
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: sliceBegin,
					sliceEnd: sliceEnd,
					turnCount: turnCount,
					runner: this.runner
				});
			}
		} else {
			this.runner.throwError(`Wrong structure for CubeMove : ${moveString}.`);
		}
	};
}

// Represents the state of one type of pieces.

class Orbit {
	static type = "unknown";
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Orbit.");
		this.slotList = undefined;
	};
	getSize = () => {
		return this.slotList?.length ?? null;
	};
	getType = () => {
		return this.constructor.type;
	};
	clone = () => {
		this.runner.logger.debugLog(`Cloning orbit of type ${this.getType()}.`);
		let clone = Object.create(this.constructor.prototype);
		Object.assign(clone, this);
		clone.slotList = this.slotList.map(slot => slot.clone());
		return clone;
	};
	buildSlotList(slotsPerColor, colorScheme, mask) {
		let matchingOrbitMask = mask.find(orbitMask => orbitMask.orbitType === this.getType());
		let slotList = [];
		if (matchingOrbitMask) {
			for (let colorIndex in colorScheme) {
				for (let slotIndexForColor = 0; slotIndexForColor < slotsPerColor; slotIndexForColor++) {
					slotList.push(new Slot(new Sticker(
						matchingOrbitMask.stickers[colorIndex * slotsPerColor + slotIndexForColor]
							? colorScheme[colorIndex]
							: Color.blank
					)));
				}
			}
		} else {
			for (let color of colorScheme) {
				for (let slotIndexForColor = 0; slotIndexForColor < slotsPerColor; slotIndexForColor++) {
					slotList.push(new Slot(new Sticker(color)));
				}
			}
		}
		return slotList;
	};
}

class CubeOrbit extends Orbit {
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new CubeOrbit.");
	};
}

class CenterCubeOrbit extends CubeOrbit {
	static type = "centerCubeOrbit";
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CenterCubeOrbit.");
		this.slotList = this.buildSlotList(1, colorScheme, mask);
	};
}

class CornerCubeOrbit extends CubeOrbit {
	static type = "cornerCubeOrbit";
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new CornerCubeOrbit.");
		this.slotList = this.buildSlotList(4, colorScheme, mask);
	};
}

class MidgeCubeOrbit extends CubeOrbit {
	static type = "midgeCubeOrbit";
	constructor(runner, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog("Creating new MidgeCubeOrbit.");
		this.slotList = this.buildSlotList(4, colorScheme, mask);
	};
}

class WingCubeOrbit extends CubeOrbit {
	static type = "wingCubeOrbit";
	constructor(runner, rank, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog(`Creating new WingCubeOrbit (rank = ${rank}).`);
		this.rank = rank;
		this.slotList = this.buildSlotList(8, colorScheme, mask);
	};
}

class CenterBigCubeOrbit extends CubeOrbit {
	static type = "centerBigCubeOrbit";
	constructor(runner, ranks, colorScheme, mask) {
		super(runner);
		this.runner.logger.detailedLog(`Creating new CenterBigCubeOrbit (ranks = [${ranks.join(", ")}]).`);
		this.ranks = ranks;
		this.slotList = this.buildSlotList(4, colorScheme, mask);
	};
}

// Represents the information of a twisty puzzle.

class TwistyPuzzle {
	static orbitTypes = [];
	static hasOrbitType(orbitType) {
		return this.orbitTypes[orbitType];
	};
	constructor(runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new Puzzle.");
		this.orbitList = [];
	};
	addOrbits = orbitList => {
		this.orbitList = orbitList.map(orbit => orbit.clone());
	};
	hasOrbitType = orbitType => {
		return this.constructor.orbitTypes[orbitType];
	};
	getOrbitMask = orbitType => {
		return this.runner.puzzle.masks.find(orbitMask => orbitMask.orbitType === orbitType);
	};
}

class Cube extends TwistyPuzzle {
	static shape = "cube";
	static buildCustomClass = (runner, puzzleSize, colorScheme, mask) => {
		let className = `Cube${Array(3).fill(puzzleSize).join("x")}`;
		runner.logger.debugLog(`Building dynamic class ${className}.`);
		let orbitList = [];
		let orbitTypes = {};
		let pushOrbit = orbit => {
			orbitList.push(orbit);
			orbitTypes[orbit.getType()] = true;
		};
		let middleSlice = null;
		let maxRankWithMiddle = null;
		let maxRankWithoutMiddle = null;
		if (puzzleSize % 2 === 1) {
			middleSlice = (puzzleSize + 1) / 2;
			maxRankWithoutMiddle = (puzzleSize - 3) / 2;
			maxRankWithMiddle = (puzzleSize - 1) / 2;
			pushOrbit(new CenterCubeOrbit(runner, colorScheme, mask));
			if (puzzleSize >= 3) {
				pushOrbit(new MidgeCubeOrbit(runner, colorScheme, mask));
			}
		} else {
			maxRankWithoutMiddle = puzzleSize / 2 - 1;
			maxRankWithMiddle = puzzleSize / 2 - 1;
		}
		if (puzzleSize >= 2) {
			pushOrbit(new CornerCubeOrbit(runner, colorScheme, mask));
		}
		for (let wingRank = 1; wingRank <= maxRankWithoutMiddle; wingRank++) {
			pushOrbit(new WingCubeOrbit(runner, wingRank, colorScheme, mask));
		}
		for (let centerFirstRank = 1; centerFirstRank <= maxRankWithoutMiddle; centerFirstRank++) {
			for (let centerSecondRank = 1; centerSecondRank <= maxRankWithMiddle; centerSecondRank++) {
				pushOrbit(new CenterBigCubeOrbit(runner, [centerFirstRank, centerSecondRank], colorScheme, mask));
			}
		}
		return class CustomCubeClass extends Cube {
			static className = className;
			static puzzleSize = puzzleSize;
			static orbitList = orbitList;
			static orbitTypes = orbitTypes;
			static middleSlice = middleSlice;
			static maxRankWithMiddle = maxRankWithMiddle;
			static maxRankWithoutMiddle = maxRankWithoutMiddle;
			constructor(runner) {
				super(runner);
				this.runner.logger.generalLog(`Creating new ${this.constructor.className}.`);
				this.addOrbits(this.constructor.orbitList);
			};
		};
	};
	constructor(runner) {
		super(runner);
		this.runner.logger.debugLog("Creating new Cube.");
		this.shape = Cube.shape;
	};
}

class Pyramid extends TwistyPuzzle {
	constructor(runner) {
		super(runner);
		this.shape = Pyramid.shape;
	};
	static shape = "pyramid";
}

class Dodecahedron extends TwistyPuzzle {
	constructor(runner) {
		super(runner);
		this.shape = Dodecahedron.shape;
	};
	static shape = "dodecahedron";
}

// Represents the information of a runner (input, working, output). This is the entry point for everything related to Holo-Cube.

/*
Object structure to give to Runner class :
{
	puzzle: {
		fullName: string,
		colorScheme: array of colors,
		mask: {
			stage: string, // stage to show (OLL, PLL, CMLL, F2L, ...)
			custom: [
				{
					orbitType: string, // type of the orbit
					stickers: array of bools // tells for each individual sticker if it must be shown or not
				}
			]
		}
	},
	drawingOptions: {
		imageHeight: number, // height of the image in px, default value is 100
		imageWidth: number, // width of the image in px, default value is 100
		imageScale: number, // scale to apply to both height and width of the image, default is 1
		imageBackgroundColor: color, // background color of the image (white, transparent, ...)
		puzzleHeight: number, // height of the puzzle in px, default value is 100
		puzzleWidth: number, // width of the puzzle in px, default value is 100
		puzzleScale: number, // scale to apply to both height and width of the puzzle, default is 1
		puzzleColor: color, // color of the cube, excluding the stickers, (black, primary, stickerless, transparent, ...)
		view: string, // view of the puzzle ("plan"|"isometric"|"net"), default value is "plan"
		document: object // document implementation, default value is the document calling the script
	},
	logger: {
		verbosity: int, // level of verbosity for the logs (0 = no logs, 1 = errors only, 2 = general and warnings, 3 = detailed, 4 = debug), default value is 2
		mode: string, // how the logs will be written ("console"|"htmlTag"|"none"), default value is "console"
		inOutput: bool, // tells if the output must contain the logs, default value is false
		htmlTagSelector: string // selector to find the HTML tag in which to write, when "htmlTag" logger mode is selected
	}
}

puzzle.fullName is mandatory, other inputs are optional
*/

class Runner {
	static successStatus = "success";
	static failStatus = "fail";
	constructor(inputObject) {
		this.setLogger(inputObject);
		this.logger.generalLog("Creating new Runner.");
		this.setPuzzle(inputObject);
		this.setMoveSequenceParser();
		this.setDrawingOptions(inputObject);
		this.setPuzzleDrawer();
		this.logger.generalLog("End of initialization phase.");
		this.closeInitializationPhase();
	};
	run = moveSequenceInput => {
		this.logger.resetPartialLogs(); // partial logs should contain only the logs of run phase
		this.logger.generalLog("Beginning of run phase.");
		let result = {
			status: undefined,
			errors: []
		};
		if (Utils.isUndefinedOrNull(moveSequenceInput)) {
			result.status = Runner.failStatus;
			let errorMessage = "Error : run() method must be called with move sequence or move sequence list as an argument.";
			this.logger.errorLog(errorMessage);
			result.errors.push({
				scope: "general",
				message: errorMessage
			});
		} else if (Utils.isString(moveSequenceInput)) {
			this.logger.generalLog("Running for a single move sequence.");
			this.runForOneMoveSequence(result, moveSequenceInput, undefined);
		} else if (Utils.isArrayOfStrings(moveSequenceInput)) {
			this.logger.generalLog(`Running for a list of move sequences containing ${moveSequenceInput.length} element${moveSequenceInput.length > 1 ? "s" : ""}.`);
			result.results = [];
			for (let moveSequenceIndex = 0; moveSequenceIndex < moveSequenceInput.length; moveSequenceIndex++) {
				this.runForOneMoveSequence(result, moveSequenceInput[moveSequenceIndex], moveSequenceIndex);
			}
		} else {
			let errorMessage = "Error : move sequence must either be a string (single move sequence) or an array of strings (list of move sequences).";
			this.logger.errorLog(errorMessage);
			result.errors.push({
				scope: "general",
				message: errorMessage
			});
		}
		this.logger.generalLog("End of run phase.");
		if (this.logger.inOutput) {
			result.logs = {
				all: this.logs.initializationPhase + "\n" + this.logs.partial,
				initializationPhase: this.logs.initializationPhase,
				runPhase: this.logs.partial
			};
		}
		return result;
	};
	runForOneMoveSequence = (result, moveSequence, moveSequenceIndex) => {
		let isMultiple = !Utils.isUndefinedOrNull(moveSequenceIndex);
		let previousPartialLogs = this.logger.inOutput ? this.logs.partial : null;
		this.logger.resetPartialLogs();
		try {
			let puzzle = new this.puzzle.class(this);
			this.moveSequenceParser.parseMoveSequence(moveSequence).applyOnPuzzle(puzzle);
			let svg = this.puzzleDrawer.drawPuzzle(puzzle);
			if (isMultiple) { // multiple move sequences
				this.logger.generalLog(`Adding result of move sequence ${moveSequenceIndex} to output.`);
				let moveSequenceResult = {
					moveSequenceIndex: moveSequenceIndex,
					status: Runner.successStatus,
					svg: svg,
					errorMessage: null,
				};
				if (this.logger.inOutput) {
					moveSequenceResult.logs = this.logs.partial;
				}
				result.results.push(moveSequenceResult);
				if (!result.status) {
					result.status = Runner.successStatus;
				}
			} else { // single move sequences
				this.logger.generalLog("Adding result of move sequence to output.");
				result.svg = svg;
				result.status = Runner.successStatus;
			}
		} catch (errorMessage) {
			result.status = Runner.failStatus;
			let rootLevelError = {
				message: errorMessage
			};
			if (isMultiple) {
				rootLevelError.scope = `Move sequence ${moveSequenceIndex} (${moveSequence}).`;
				rootLevelError.moveSequenceIndex = moveSequenceIndex;
				let moveSequenceResult = {
					moveSequenceIndex: moveSequenceIndex,
					status: Runner.failStatus,
					svg: null,
					errorMessage: errorMessage
				};
				if (this.logger.inOutput) {
					moveSequenceResult.logs = this.logs.partial;
				}
				result.results.push(moveSequenceResult);
			} else {
				rootLevelError.scope = `Move sequence (${moveSequence}).`;
			}
			result.errors.push(rootLevelError);
		}
		if (this.logger.inOutput) {
			this.logs.partial = previousPartialLogs + "\n" + this.logs.partial;
		}
	};
	throwError = message => {
		let errorMessage = ErrorLogger.buildErrorMessage(message);
		Logger.consoleLog(errorMessage); // always display errors in the console
		if (this.logger && this.logger.mode !== Logger.consoleLoggerMode) {
			this.logger.errorLog(message);
		}
		throw errorMessage;
	};
	setLogger = inputObject => {
		// default values
		let verbosity = Logger.defaultOptions.verbosityLevel;
		let mode = Logger.defaultOptions.mode;
		let inOutput = Logger.defaultOptions.inOutput;
		let htmlTag = undefined;
		// check input and overwrite default values
		if (!Utils.isUndefinedOrNull(inputObject.logger)) {
			if (!Utils.isUndefinedOrNull(inputObject.logger.verbosity)) { // check verbosity
				if (!Utils.isNumber(inputObject.logger.verbosity)) {
					this.throwError("Property verbosity must be a number.");
				} else if (!Logger.verbosityLevels.includes(inputObject.logger.verbosity)) {
					this.throwError(`Property verbosity only accept values ${Logger.verbosityLevels.join(", ")} (received value = ${inputObject.logger.verbosity}).`);
				}
				verbosity = inputObject.logger.verbosity;
			}
			if (verbosity !== Logger.offVerbosityLevel) { // check other logger parameters
				if (!Utils.isUndefinedOrNull(inputObject.logger.mode)) { // check mode
					if (!Utils.isString(inputObject.logger.mode)) {
						this.throwError("Property mode must be a string.");
					} else if (!Logger.loggerModes.includes(inputObject.logger.mode)) {
						this.throwError(`Property mode only accept values ${Logger.loggerModes.join(", ")} (received value = ${inputObject.logger.mode}).`);
					}
					mode = inputObject.logger.mode;
					if (mode === Logger.htmlTagLoggerMode) { // check HTML tag selector if htmlTag mode is chosen
						if (Utils.isUndefinedOrNull(inputObject.logger.htmlTagSelector)) {
							this.throwError(`Property logger.htmlTagSelector is required when mode is "${Logger.htmlTagLoggerMode}".`);
						} else if (!Utils.isString(inputObject.logger.htmlTagSelector)) {
							this.throwError("Property htmlTagSelector must be a string.");
						}
						htmlTag = document.querySelector(inputObject.logger.htmlTagSelector);
						if (htmlTag === null) {
							this.throwError(`No HTML tag was found with selector ${inputObject.logger.htmlTagSelector}.`);
						}
					}
				}
				if (!Utils.isUndefinedOrNull(inputObject.logger.inOutput)) { // check if logs must appear in output
					if (!Utils.isBoolean(inputObject.logger.inOutput)) {
						this.throwError("Property inOutput must be a boolean.");
					}
					inOutput = inputObject.logger.inOutput;
				}
			}
		}
		this.logger = new (this.getLoggerClass(verbosity))(mode, this, inOutput, htmlTag);
		this.logger.detailedLog("Logger is created.");
	};
	closeInitializationPhase = () => {
		if (this.logger.inOutput) {
			this.logs.initializationPhase = this.logs.all;
		}
	};
	setPuzzle = inputObject => {
		this.logger.detailedLog("Reading input : puzzle.");
		this.puzzle = new PuzzleRunnerInput(inputObject.puzzle, this);
	};
	setDrawingOptions = inputObject => {
		this.logger.detailedLog("Reading input : drawingOptions.");
		this.drawingOptions = new DrawingOptionsRunnerInput(inputObject.drawingOptions, this);
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
		switch(this.puzzle.class.shape) {
			case "cube": switch(this.drawingOptions.view) {
				case TwistyPuzzleDrawer.planView: return CubePlanDrawer;
				case TwistyPuzzleDrawer.isometricView: return CubeIsometricDrawer;
				case TwistyPuzzleDrawer.netView: return CubeNetDrawer;
				case TwistyPuzzleDrawer.topDownView: return CubeTopDownDrawer;
			}
			default: this.throwError("Getting puzzle drawer class for a non-cubic shaped puzzle.");
		}
	};
	getLoggerClass = verbosity => {
		switch(verbosity) {
			case Logger.offVerbosityLevel: return Logger;
			case Logger.errorVerbosityLevel: return ErrorLogger;
			case Logger.generalVerbosityLevel: return GeneralLogger;
			case Logger.detailedVerbosityLevel: return DetailedLogger;
			case Logger.debugVerbosityLevel: return DebugLogger;
		}
	};
}

// Represents the information of a puzzle as an input of a runner.

class PuzzleRunnerInput {
	constructor(puzzle, runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new PuzzleRunnerInput");
		if (Utils.isUndefinedOrNull(puzzle)) {
			this.runner.throwError("Property puzzle is required.");
		} else if (!Utils.isObject(puzzle)) {
			this.runner.throwError("Property puzzle must be an object.");
		}
		let {puzzleShape, puzzleSize} = this.getPuzzleGeneral(puzzle);
		let mask = this.getMask(puzzle);
		let colorScheme = this.getColorScheme(puzzle, puzzleShape);
		this.class = this.getPuzzleClass(puzzleShape, puzzleSize, colorScheme, mask);
	};
	getPuzzleGeneral = puzzle => {
		if (Utils.isUndefinedOrNull(puzzle.fullName)) {
			this.runner.throwError("Property puzzle.fullName is required.");
		} else if (!Utils.isString(puzzle.fullName)) {
			this.runner.throwError("Property puzzle.fullName must be a string.");
		} else if (!puzzle.fullName.startsWith("cube")) {
			this.runner.throwError("Wrong value for puzzle.fullName : only cubes are supported for now.");
		} else if (!/^cube\d+x\d+x\d+$/.test(puzzle.fullName) || new Set(puzzle.fullName.substring(4).split("x")).size !== 1) {
			this.runner.throwError("Unrecognized or unsupported puzzle name. Available names are of the form cubeNxNxN, where N has to be replaced with the cube size.");
		}
		let puzzleSize = parseInt(puzzle.fullName.match(/\d+$/)[0]);
		if (puzzleSize === 0) {
			this.runner.throwError(`Creating cube with no layer.`);
		} else if (puzzleSize > 13) {
			this.runner.logger.warningLog(`Creating cube with large number of layers (${puzzleSize}).`);
		}
		return {
			puzzleShape: Cube.shape,
			puzzleSize: puzzleSize,
		}
	};
	getMask = puzzle => {
		let mask = [];
		if (!Utils.isUndefinedOrNull(puzzle.mask)) {
			// mask aliases
			if (!Utils.isUndefinedOrNull(puzzle.mask.stage)) {
				if (!Utils.isString(puzzle.mask.stage)) {
					this.runner.throwError("Property puzzle.mask.stage must be a string.");
				} else {
					mask = this.getMaskFromAlias(puzzle.mask.stage);
					if (mask === null) {
						this.runner.throwError(`Invalid or unrecognized value for puzzle.mask.stage : ${puzzle.mask.stage}.`);
					}
				}
			}
			// custom masks
			if (!Utils.isUndefinedOrNull(puzzle.mask.custom)) {
				if (!Utils.isArray(puzzle.mask.custom)) {
					this.runner.throwError("Property puzzle.mask.custom must be an array.");
				}
				for (let orbitMask of puzzle.mask.custom) {
					if (Utils.isUndefinedOrNull(orbitMask.orbitType)) {
						this.runner.throwError("Property orbitType is required to define custom masks.");
					} else if (!Utils.isString(orbitMask.orbitType)) {
						this.runner.throwError("Property orbitType under puzzle.mask.custom is required.");
					}
					let existingMatchingOrbitMask = mask.find(existingOrbitMask => existingOrbitMask.orbitType === orbitMask.orbitType);
					if (existingMatchingOrbitMask) {
						existingMatchingOrbitMask = orbitMask; // replace orbit mask
					} else {
						mask.push(orbitMask); // add orbit mask
					}
				}
			}
		}
		return mask;
	};
	getMaskFromAlias = stage => {
		switch (stage) {
			case "PLL": case "ZBLL": case "ELL": case "1LLL": case "LSE": case "LSEP": case "L4C": case "ZZLL":
				return [];
			case "OLLCP": case "COLL": case "CPEOLL":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "OLL": case "OCLL": case "VLS": case "HLS": case "OLS": case "WV": case "SV": case "MW": case "CLS": case "JTLE":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [true, true, true, true, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "ZBLS": case "EOLS": case "VHLS": case "ELS": case "EOLL":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "COLS":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [true, true, true, true, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "LLEF":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}
				];
			case "CLL":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "F2L":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, true, true, false, true, true, true,
							true, true, true, true, false, true, true, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, true, true, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "CMLL":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, false, true, false, true, true, true,
							false, true, false, true, false, true, false, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true,
							false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true]
					}, {
						orbitType: CenterCubeOrbit.type,
						stickers: [false, false, true,
							false, false, true]
					}, {
						orbitType: CenterBigCubeOrbit.type,
						stickers: [false, false, false, false, false, true, false, true, false, true, true, true,
							false, true, false, true, false, true, false, true, false, true, true, true]
					}
				];
			case "EOLR":
				return [
					{
						orbitType: MidgeCubeOrbit.type,
						stickers: [true, true, true, true, false, true, false, true, true, true, true, true,
							true, true, true, true, false, true, false, true, true, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [true, true, true, true, true, true, true, true, false, false, true, true, false, false, true, true, true, true, true, true, true, true, true, true,
							true, true, true, true, true, true, true, true, false, false, true, true, false, false, true, true, true, true, true, true, true, true, true, true]
					}
				];
			case "Cross": case "cross":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, false, false, false, true, false,
							true, true, true, true, false, false, false, true, false, false, false, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false,
							true, true, true, true, true, true, true, true, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false]
					}
				];
			case "FB":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, true, false, false, false, false,
							true, false, false, true, false, false, false, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, true, false, false, false, false,
							false, false, false, true, false, true, false, false, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, true, true, false, false, true, true, false, false, false, false, false, false, true, true, true, true, true, true]
					}
				];
			case "SB":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, true, false, true, false, true, true, true,
							false, true, false, true, false, true, false, true, false, true, true, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true,
							false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, true]
					}
				];
			case "FL":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, true, false, false, true, true,
							true, true, true, true, false, false, true, true, false, false, true, true]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, true, false, false, false, true, false,
							true, true, true, true, false, false, false, true, false, false, false, true]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false,
							true, true, true, true, true, true, true, true, false, false, false, false, true, true, false, false, false, false, false, false, true, true, false, false]
					}
				];
			case "L2C":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}, {
						orbitType: MidgeCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}, {
						orbitType: WingCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]
					}
				];
			case "L2E":
				return [
					{
						orbitType: CornerCubeOrbit.type,
						stickers: [false, false, false, false, false, false, false, false, false, false, false, false,
							false, false, false, false, false, false, false, false, false, false, false, false]
					}
				];
			default: return null; // unrecognized alias
		};
	};
	getColorScheme = (puzzle, puzzleShape) => {
		let colorScheme = [];
		let defaultColorScheme = this.getDefaultColorSchemeFromShape(puzzleShape);
		if (Utils.isUndefinedOrNull(puzzle.colorScheme)) {
			for (let color of defaultColorScheme) {
				colorScheme.push(new Color(color));
			}
			this.runner.logger.detailedLog(`Property puzzle.colorScheme was not provided, using default color scheme ["${defaultColorScheme.join('", "')}"].`);
		} else {
			if (!Utils.isArrayOfStrings(puzzle.colorScheme)) {
				this.runner.throwError("Property puzzle.colorScheme must be an array of strings.");
			} else if (puzzle.colorScheme.length !== defaultColorScheme.length) {
				this.runner.throwError("Property puzzle.colorScheme doesn't have the correct number of values "
					+ `(expected value = ${defaultColorScheme.length} because puzzle shape is ${puzzleShape}, `
					+ `actual = ${puzzle.colorScheme.length}).`);
			}
			for (let color of puzzle.colorScheme) {
				if (!Color.checkFormat(color)) {
					this.runner.throwError(`Invalid or unrecognized color in puzzle.colorScheme property : ${color}.`);
				}
				colorScheme.push(new Color(color));
			}
		}
		return colorScheme;
	};
	getDefaultColorSchemeFromShape = puzzleShape => {
		switch (puzzleShape) {
			case Cube.shape:
				return [ // respectively for U, F, R, D, B, L faces
					"white",
					"green",
					"red",
					"yellow",
					"blue",
					"orange"
				];
			case Pyramid.shape:
				return [ // respectively for F, BR, BL, D faces
					"green",
					"blue",
					"red",
					"yellow"
				];
			case Dodecahedron.shape:
				return [ // respectively for U, F, R, BR, BL, L, D, DB, DL, DFL, DFR, DR
					"white",
					"green",
					"red",
					"blue",
					"yellow",
					"purple",
					"grey",
					"lightGreen",
					"orange",
					"lightBlue",
					"lightYellow",
					"pink"
				];
			default:
				this.runner.throwError(`Getting default color scheme from invalid puzzle shape "${puzzleShape}".`);
		}
	};
	getPuzzleClass = (puzzleShape, puzzleSize, colorScheme, mask) => {
		this.runner.logger.debugLog("Getting puzzle class.");
		switch(puzzleShape) {
			case Cube.shape:
				return Cube.buildCustomClass(this.runner, puzzleSize, colorScheme, mask);
			default:
				this.runner.throwError("Getting puzzle class for a non-cubic shaped puzzle.");
		}
	};
}

// Represent the drawing options as an input of a runner.

class DrawingOptionsRunnerInput {
	static defaultDrawingOptions = {
		imageHeight: 100,
		imageWidth: 100,
		imageScale: 1,
		imageBackgroundColor: "transparent",
		puzzleHeight: 100,
		puzzleWidth: 100,
		puzzleScale: 1,
		puzzleColor: "black",
		view: "plan"
	};
	constructor(drawingOptionsObject, runner) {
		this.runner = runner;
		this.runner.logger.debugLog("Creating new DrawingOptionsRunnerInput");
		if (drawingOptionsObject) {
			let heightWidthList = ["Height", "Width"];
			for (let imageOrPuzzle of ["image", "puzzle"]) {
				for (let heightOrWidth of heightWidthList) {
					let dimensionProperty = imageOrPuzzle + heightOrWidth;
					if (!Utils.isUndefinedOrNull(drawingOptionsObject[dimensionProperty])) {
						this.checkNumberNotZero(drawingOptionsObject[dimensionProperty], dimensionProperty);
						this[dimensionProperty] = drawingOptionsObject[dimensionProperty];
					} else {
						this.setNumericValueFromDefault(dimensionProperty);
					}
				}
				let scaleProperty = imageOrPuzzle + "Scale";
				if (!Utils.isUndefinedOrNull(drawingOptionsObject[scaleProperty])) {
					this.checkNumberNotZero(drawingOptionsObject[scaleProperty], scaleProperty);
					for (let heightOrWidth of heightWidthList) {
						this[imageOrPuzzle + heightOrWidth] *= drawingOptionsObject[scaleProperty];
					}
				}
			}
			if (!Utils.isUndefinedOrNull(drawingOptionsObject.view)) {
				if (!Utils.isString(drawingOptionsObject.view)) {
					this.runner.throwError("Property drawingOptions.view must be a string.");
				} else if (!TwistyPuzzleDrawer.views.includes(drawingOptionsObject.view)) {
					this.runner.throwError(`Property view only accept values "${TwistyPuzzleDrawer.views.join("\", \"")}" (received value = ${drawingOptionsObject.view}).`);
				} else if (!TwistyPuzzleDrawer.supportedViews.includes(drawingOptionsObject.view)) {
					this.runner.logger.warningLog(`Value "${drawingOptionsObject.view}" of view option is not yet supported, using default value "${DrawingOptionsRunnerInput.defaultDrawingOptions.view}".`);
					this.view = DrawingOptionsRunnerInput.defaultDrawingOptions.view;
				} else {
					this.view = drawingOptionsObject.view;
				}
			} else {
				this.view = DrawingOptionsRunnerInput.defaultDrawingOptions.view;
			}
			let dimensionIssues = [];
			for (let dimension of ["Height", "Width"]) {
				if (Math.abs(this["puzzle" + dimension]) > Math.abs(this["image" + dimension])) {
					dimensionIssues.push(`puzzle${dimension} = ${this["puzzle" + dimension]}, image${dimension} = ${this["image" + dimension]}`);
				}
				if (Math.abs(this["image" + dimension]) > 2000) {
					this.runner.logger.warningLog(`Creating large image (image${dimension} = ${this["image" + dimension]}).`);
				}
			}
			if (dimensionIssues.length) {
				this.runner.throwError(`Puzzle is larger than image (${dimensionIssues.join(", ")}).`);
			}
			for (let drawingOptionsProperty of ["imageBackgroundColor", "puzzleColor"]) {
				if (drawingOptionsObject[drawingOptionsProperty]) {
					if (!Utils.isString(drawingOptionsObject[drawingOptionsProperty])) {
						this.runner.throwError(`Property drawingOptions.${drawingOptionsProperty} must be a string.`);
					} else if (!Color.checkFormat(drawingOptionsObject[drawingOptionsProperty])) {
						this.runner.throwError(`Invalid or unrecognized color for property drawingOptions.${drawingOptionsProperty} : ${drawingOptionsObject[drawingOptionsProperty]}.`);
					}
					this[drawingOptionsProperty] = new Color(drawingOptionsObject[drawingOptionsProperty]);
				} else {
					this.setColorValueFromDefault(drawingOptionsProperty);
				}
			}
			if (!Utils.isUndefinedOrNull(drawingOptionsObject.document)) {
				if (!Utils.isObject(drawingOptionsObject.document)) {
					this.runner.throwError("Property drawingOptions.document must be an object.");
				} else {
					this.runner.logger.detailedLog("Using specified document for SVG creation.");
					this.document = drawingOptionsObject.document;
				}
			} else {
				this.setDocumentFromDefault();
			}
		} else {
			this.setAllValuesFromDefault();
		}
	};
	setAllValuesFromDefault = () => {
		for (let drawingOptionsNumericProperty of ["imageHeight", "imageWidth", "puzzleHeight", "puzzleWidth"]) {
			this.setNumericValueFromDefault(drawingOptionsNumericProperty);
		}
		for (let drawingOptionsColorProperty of ["imageBackgroundColor", "puzzleColor"]) {
			this.setColorValueFromDefault(drawingOptionsColorProperty);
		}
		this.setDocumentFromDefault();
		this.view = DrawingOptionsRunnerInput.defaultDrawingOptions.view;
	};
	setNumericValueFromDefault = propertyName => {
		this[propertyName] = DrawingOptionsRunnerInput.defaultDrawingOptions[propertyName];
		this.runner.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${this[propertyName]}.`);
	};
	setColorValueFromDefault = propertyName => {
		this[propertyName] = new Color(DrawingOptionsRunnerInput.defaultDrawingOptions[propertyName]);
		this.runner.logger.detailedLog(`Property drawingOptions.${propertyName} was not provided, using default value ${DrawingOptionsRunnerInput.defaultDrawingOptions[propertyName]}.`);
	};
	setDocumentFromDefault = () => {
		if (document) {
			this.runner.logger.detailedLog("Property drawingOptions.document was not provided, using default document for SVG creation.");
			this.document = document;
		} else {
			this.runner.throwError("No document was specified for SVG creation and none is available by default.");
		}
	};
	checkNumberNotZero = (variableValue, variableName) => {
		if (Utils.isNumber(variableValue !== "number")) {
			this.runner.throwError(`Property drawingOptions.${variableName} must be a number.`);
		} else if (variableValue === 0) {
			this.runner.throwError(`Property drawingOptions.${variableName} cannot be 0.`);
		}
	};
}

// Represents a location of one colored side of a piece.

class Slot {
	constructor(sticker) {
		this.content = sticker;
	};
	clone = () => {
		let clone = Object.create(this.constructor.prototype);
		Object.assign(clone, this);
		clone.content = this.content.clone();
		return clone;
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
	clone = () => {
		return new Sticker(this.color);
	};
}

class Utils {
	static isUndefinedOrNull = object => {
		return [undefined, null].includes(object);
	};
	static isBoolean = object => {
		return typeof object === "boolean";
	};
	static isString = object => {
		return typeof object === "string";
	};
	static isNumber = object => {
		return typeof object === "number";
	};
	static isObject = object => {
		return typeof object === "object";
	};
	static isArray = Array.isArray;
	static isArrayOfStrings = object => {
		return Utils.isArray(object)
			&& !object.find(element => !Utils.isString(element));
	};
}

export {Runner};
