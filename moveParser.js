"use strict";

class MoveSequenceParser {
	constructor(puzzle) {
		switch(puzzle.getPuzzleType()) {
			case "cube":
				this.moveParser = new CubeMoveParser(puzzle);
				break;
			default:
				throw `Error : Cannot parse move sequence for puzzle type ${this.puzzleType}.`;
		}
	};
	getMoveParser = () => {
		return this.moveParser;
	};
	parseMoveSequenceString = moveSequenceString => {
		return this.parseMoveSequence(moveSequenceString.split(" ").filter(move => move !== ""));
	};
	parseMoveSequence = moveSequenceListString => {
		let moveParser = this.getMoveParser();
		let moveSequence = [];
		for (let moveString of moveSequenceListString) {
			moveSequence.push(moveParser.parseMove(moveString));
		}
		return moveSequence;
	};
}

class MoveParser {
	constructor() {
	};
	parseMove = () => {
		throw "Error : The generic move parser cannot parse a sequence, you need a specific move parser.";
	};
}

class CubeMoveParser extends MoveParser {
	constructor(cube) {
		super();
		this.cube = cube;
	};
	getCube = () => {
		return this.cube;
	};
	parseMove = moveString => {
		let cube = this.getCube();
		let cubeSize = cube.getPuzzleSize();
		let faceListSubRegExp = "[UFRDBL]";
		let directionListSubRegExp = "('?\\d*|\\d+')"; // empty, ', 2, 2', '2
		if (new RegExp(`^[xyz]${directionListSubRegExp}$`).test(moveString)) { // x, y', z2, ...
			return new CubeMove({
				face: this.getExternalFace(moveString[0]),
				sliceBegin: 1,
				sliceEnd: cubeSize,
				turnCount: this.parseTurnCountFromSuffix(moveString.substring(1)),
				cubeMoveParser: this,
				cube: cube
			});
		} else if (cubeSize === 1) {
			throw "Error : Applying a non-rotation move on 1x1x1 cube.";
		} else if (new RegExp(`^${faceListSubRegExp}${directionListSubRegExp}$`).test(moveString)) { // R, U', F2, ...
			return new CubeMove({
				face: moveString[0],
				sliceBegin: 1,
				sliceEnd: 1,
				turnCount: this.parseTurnCountFromSuffix(moveString.substring(1)),
				cubeMoveParser: this,
				cube: cube
			});
		} else if (cubeSize === 2) {
			throw "Error : Applying a inner slice move or a move involving at least 2 layers on a 2x2x2 cube.";
		} else if (new RegExp(`^${faceListSubRegExp.toLowerCase()}${directionListSubRegExp}$`).test(moveString)) { // r, u', f2
			return new CubeMove({
				face: this.parseFace(moveString[0]),
				sliceBegin: cubeSize === 3 ? 1 : 2,
				sliceEnd: 2,
				turnCount: this.parseTurnCountFromSuffix(moveString.substring(1)),
				cubeMoveParser: this,
				cube: cube
			});
		} else if (new RegExp(`^\d*[MES]${directionListSubRegExp}$`, "i").test(moveString)) { // M, E', S2
			let middleSliceCount = moveString.match(/\d+/)[0] ?? 1;
			if ((middleSliceCount + cubeSize) % 2) {
				throw `Error : Wrong structure for CubeMove (${cubeSize % 2 ? "odd" : "even"} cube size and ${cubeSize % 2 ? "even" : "odd"}`
				+ " number of slices for middle slice move).";
			} else if (middleSliceCount < cubeSize && middleSliceCount > 0) {
				return new CubeMove({
					face: this.getExternalFace(moveString.replace(/^\d*/, "")[0]),
					sliceBegin: (cubeSize - middleSliceCount) / 2 + 1,
					sliceEnd: (cubeSize + middleSliceCount) / 2,
					turnCount: this.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1)),
					cubeMoveParser: this,
					cube: cube
				});
			} else {
				throw `Error : Applying an inner slice move involving ${middleSliceCount} slices on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			}
		} else if (new RegExp(`^\d*${faceListSubRegExp}w${directionListSubRegExp}$`).test(moveString)) { // Rw, Uw', 3Fw2, ...
			let numberOfSlices = moveString.match(new RegExp("^\d*"))[0];
			if (numberOfSlices < cubeSize) {
				return new CubeMove({
					face: this.parseFace(moveString),
					sliceBegin: 1,
					sliceEnd: numberOfSlices === "" ? 2 : numberOfSlices,
					turnCount: this.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1)),
					cubeMoveParser: this,
					cube: cube
				});
			} else {
				throw `Error : Applying an outer slice move involving ${numberOfSlices} slices on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			}
		} else if (new RegExp(`^\d+${faceListSubRegExp}${directionListSubRegExp}$`, "i").test(moveString)) { // 2R, 3U', 4F2
			let sliceNumber = moveString.match(/\d+/)[0];
			let turnCount = this.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1));
			if (sliceNumber < 2 || sliceNumber >= cubeSize) {
				throw `Error : Applying an inner slice move involving the slice of rank ${sliceNumber} on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			} else if (sliceNumber > (cubeSize + 1) / 2) {
				return new CubeMove({
					face: this.getOppositeFace(this.parseFace(moveString)),
					sliceBegin: cubeSize + 1 - sliceNumber,
					sliceEnd: cubeSize + 1 - sliceNumber,
					turnCount: this.cleanTurnCount(-turnCount),
					cubeMoveParser: this,
					cube: cube
				});
			} else {
				return new CubeMove({
					face: this.parseFace(moveString),
					sliceBegin: sliceNumber,
					sliceEnd: sliceNumber,
					turnCount: turnCount,
					cubeMoveParser: this,
					cube: cube
				});
			}
		} else if (new RegExp(`^\d+-\d+${faceListSubRegExp}w${directionListSubRegExp}`).test(moveString)) { // 2-3Rw, 3-4Uw', 4-6Fw2
			let [sliceBegin, sliceEnd] = moveString.match(/\d+/g);
			[sliceBegin, sliceEnd] = [Math.min(sliceBegin, sliceEnd), Math.max(sliceBegin, sliceEnd)];
			let turnCount = this.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1));
			if (sliceBegin < 2 || sliceEnd >= cubeSize) {
				throw `Error : Applying an inner slice move involving slices from ${sliceBegin} to ${sliceEnd} on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			} else if (sliceBegin - 1 > cubeSize - sliceEnd) {
				return new CubeMove({
					face: this.getOppositeFace(this.parseFace(moveString)),
					sliceBegin: cubeSize + 1 - sliceEnd,
					sliceEnd: cubeSize + 1 - sliceBegin,
					turnCount: this.cleanTurnCount(-turnCount),
					cubeMoveParser: this,
					cube: cube
				});
			} else {
				return new CubeMove({
					face: this.parseFace(moveString),
					sliceBegin: sliceBegin,
					sliceEnd: sliceEnd,
					turnCount: turnCount,
					cubeMoveParser: this,
					cube: cube
				});
			}
		} else {
			throw "Error : Wrong structure for CubeMove.";
		}
	};
	parseFace = moveString => {
		let faceListSubRegExp = "[UFRDBL]";
		return moveString.match(new RegExp(faceListSubRegExp, "i"))[0].toUpperCase();
	};
	parseTurnCountFromSuffix = suffix => {
		let numberMatches = suffix.match(/\d+/);
		return this.cleanTurnCount((numberMatches ? parseInt(numberMatches[0]) : 1) * (/'/.test(suffix) ? -1 : 1));
	};
	getExternalFace = middleSliceLetter => {
		return {"M": "L", "E": "D", "S": "F", "x": "R", "y": "U", "z": "F"}[middleSliceLetter];
	};
	getOppositeFace = face => {
		return {"U": "D", "F": "B", "R": "L", "D": "U", "B": "F", "L": "R"}[face];
	};
	cleanTurnCount = turnCount => {
		return turnCount % 4 + (turnCount < 0 ? 4 : 0);
	};
}
