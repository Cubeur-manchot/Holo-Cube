"use strict";

// Represent the permutation induced by a move
class Move {
	constructor() {
		this.cycles = [];
	};
	getCycleList = () => {
		return this.cycles;
	};
	applyOnPuzzle = puzzle => {
		log("Applying move on puzzle.");
		let puzzleOrbitList = puzzle.getOrbitList();
		for (let cycle of this.getCycleList()) {
			for (let orbit of puzzleOrbitList) {
				if (cycle.getOrbitType() === orbit.getType()) {
					cycle.applyOnOrbit(orbit);
				}
			}
		}
	};
}

class CubeMove extends Move {
	constructor(face, sliceBegin, sliceEnd, turnCount, cubeSize) {
		// todo check consistency
		super();
		if (cubeSize % 1 && sliceBegin <= ((cubeSize + 1) / 2) && sliceEnd >= ((cubeSize + 1) / 2)) { // innermost centers
			this.addElementaryCycles("centerCubeOrbit", face, turnCount);
		}
		if (cubeSize > 1 && sliceBegin === 1) { // corners
			this.addElementaryCycles("cornerCubeOrbit", face, turnCount);
		}
		if (cubeSize > 1 && sliceEnd === cubeSize) { // corners when rotation
			this.addElementaryCycles("cornerCubeOrbit", CubeMoveParser.getOppositeFace(face), CubeMoveParser.cleanTurnCount(-turnCount));
		}
		// todo other orbit types
	};
	addElementaryCycles = (type, face, turnCount) => {
		CubeMoveParser.getElementaryCycles(type, face, CubeMoveParser.getDirectionFromTurnCount(turnCount))
			.forEach(slotList => this.cycles.push(new Cycle(slotList, type)));
	};
}

class CubeMoveParser extends Move {
	static cleanTurnCount = turnCount => {
		return turnCount % 4 + (turnCount < 0 ? 4 : 0);
	};
	static parseTurnCountFromSuffix = suffix => {
		let numberMatches = suffix.match(/\d+/);
		return CubeMoveParser.cleanTurnCount((numberMatches ? parseInt(numberMatches[0]) : 1) * (/'/.test(suffix) ? -1 : 1));
	};
	static parseFace = moveString => {
		let faceListSubRegExp = "[UFRDBL]";
		return moveString.match(new RegExp(faceListSubRegExp, "i"))[0].toUpperCase();
	};
	static getOppositeFace = face => {
		return {"U": "D", "F": "B", "R": "L", "D": "U", "B": "F", "L": "R"}[face];
	};
	static getExternalFace = middleSliceLetter => {
		return {"M": "L", "E": "D", "S": "F", "x": "R", "y": "U", "z": "F"}[middleSliceLetter];
	};
	static getDirectionFromTurnCount = turnCount => {
		return ["none", "clockwise", "double", "anticlockwise"][turnCount];
	};
	static getElementaryCycles = (type, face, direction) => {
		return {
			"centerCubeOrbit": {
				U: {clockwise: [[1, 5, 4, 2]], anticlockwise: [[1, 2, 4, 5]], double: [[1, 4], [2, 5]]},
				F: {clockwise: [[0, 2, 3, 5]], anticlockwise: [[0, 5, 3, 2]], double: [[0, 3], [2, 5]]},
				R: {clockwise: [[0, 4, 3, 1]], anticlockwise: [[0, 1, 3, 4]], double: [[0, 3], [1, 4]]},
				D: {clockwise: [[1, 2, 4, 5]], anticlockwise: [[1, 5, 4, 2]], double: [[1, 4], [2, 5]]},
				B: {clockwise: [[0, 5, 3, 2]], anticlockwise: [[0, 2, 3, 5]], double: [[0, 3], [2, 5]]},
				L: {clockwise: [[0, 1, 3, 4]], anticlockwise: [[0, 4, 3, 1]], double: [[0, 3], [1, 4]]}
			},
			"cornerCubeOrbit": {
				U: {clockwise: [[0, 1, 2, 3], [4, 20, 16, 8], [5, 21, 17, 9]], anticlockwise: [[0, 3, 2, 1], [4, 8, 16, 20], [5, 9, 17, 21]], double: [[0, 2], [1, 3], [4, 16], [5, 17], [8, 20], [9, 21]]},
				F: {clockwise: [[2, 11, 12, 21], [3, 8, 13, 22], [4, 5, 6, 7]], anticlockwise: [[2, 21, 12, 11], [3, 22, 13, 8], [4, 7, 6, 5]], double: [[2, 12], [3, 13], [4, 6], [5, 7], [8, 22], [11, 21]]},
				R: {clockwise: [[1, 19, 13, 5], [2, 16, 14, 6], [8, 9, 10, 11]], anticlockwise: [[1, 5, 13, 19], [2, 6, 14, 16], [8, 11, 10, 9]], double: [[1, 13], [2, 14], [5, 19], [6, 16], [8, 10], [9, 11]]},
				D: {clockwise: [[6, 22, 18, 10], [7, 11, 19, 23], [12, 13, 14, 15]], anticlockwise: [[6, 10, 18, 22], [7, 23, 19, 11], [12, 15, 14, 13]], double: [[6, 18], [7, 19], [10, 22], [11, 23], [12, 14], [13,15]]},
				B: {clockwise: [[0, 23, 14, 9], [1, 20, 15, 10], [16, 17, 18, 19]], anticlockwise: [[0, 9, 14, 23], [1, 10, 15, 20], [16, 19, 18, 17]], double: [[0, 14], [1, 15], [9, 23], [10, 20], [16, 18], [17, 19]]},
				L: {clockwise: [[0, 4, 12, 17], [3, 7, 15, 16], [20, 21, 22, 23]], anticlockwise: [[0, 17, 12, 4], [3, 16, 15, 7], [20, 23, 22, 21]], double: [[0, 12], [3, 15], [4, 17], [7, 16], [20, 22], [21, 23]]}
			}
		}[type][face][direction];
	};
	static parseMove = (moveString, cubeSize) => {
		let faceListSubRegExp = "[UFRDBL]";
		let directionListSubRegExp = "('?\\d*|\\d+')"; // empty, ', 2, 2', '2
		if (new RegExp(`^[xyz]${directionListSubRegExp}$`).test(moveString)) { // x, y', z2, ...
			return {
				face: CubeMoveParser.getExternalFace(moveString[0]),
				sliceBegin: 1,
				sliceEnd: cubeSize,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1))
			};
		} else if (cubeSize === 1) {
			throw "Error : Applying a non-rotation move on 1x1x1 cube.";
		} else if (new RegExp(`^${faceListSubRegExp}${directionListSubRegExp}$`).test(moveString)) { // R, U', F2, ...
			return {
				face: moveString[0],
				sliceBegin: 1,
				sliceEnd: 1,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1))
			};
		} else if (cubeSize === 2) {
			throw "Error : Applying a inner slice move or a move involving at least 2 layers on a 2x2x2 cube.";
		} else if (new RegExp(`^${faceListSubRegExp.toLowerCase()}${directionListSubRegExp}$`).test(moveString)) { // r, u', f2
			return {
				face: CubeMoveParser.parseFace(moveString[0]),
				sliceBegin: cubeSize === 3 ? 1 : 2,
				sliceEnd: 2,
				turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(1))
			};
		} else if (new RegExp(`^\d*[MES]${directionListSubRegExp}$`, "i").test(moveString)) { // M, E', S2
			let middleSliceCount = moveString.match(/\d+/)[0] ?? 1;
			if ((middleSliceCount + cubeSize) % 2) {
				throw `Error : Wrong structure for CubeMove (${cubeSize % 2 ? "odd" : "even"} cube size and ${cubeSize % 2 ? "even" : "odd"}`
				+ " number of slices for middle slice move).";
			} else if (middleSliceCount < cubeSize && middleSliceCount > 0) {
				return {
					face: CubeMoveParser.getExternalFace(moveString.replace(/^\d*/, "")[0]),
					sliceBegin: (cubeSize - middleSliceCount) / 2 + 1,
					sliceEnd: (cubeSize + middleSliceCount) / 2,
					turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1))
				};
			} else {
				throw `Error : Applying an inner slice move involving ${middleSliceCount} slices on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			}
		} else if (new RegExp(`^\d*${faceListSubRegExp}w${directionListSubRegExp}$`).test(moveString)) { // Rw, Uw', 3Fw2, ...
			let numberOfSlices = moveString.match(new RegExp("^\d*"))[0];
			if (numberOfSlices < cubeSize) {
				return {
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: 1,
					sliceEnd: numberOfSlices === "" ? 2 : numberOfSlices,
					turnCount: CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1))
				};
			} else {
				throw `Error : Applying an outer slice move involving ${numberOfSlices} slices on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			}
		} else if (new RegExp(`^\d+${faceListSubRegExp}${directionListSubRegExp}$`, "i").test(moveString)) { // 2R, 3U', 4F2
			let sliceNumber = moveString.match(/\d+/)[0];
			let turnCount = CubeMoveParser.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1));
			if (sliceNumber < 2 || sliceNumber >= cubeSize) {
				throw `Error : Applying an inner slice move involving the slice of rank ${sliceNumber} on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			} else if (sliceNumber > (cubeSize + 1) / 2) {
				return {
					face: CubeMoveParser.getOppositeFace(CubeMoveParser.parseFace(moveString)),
					sliceBegin: cubeSize + 1 - sliceNumber,
					sliceEnd: cubeSize + 1 - sliceNumber,
					turnCount: CubeMove.cleanTurnCount(-turnCount)
				};
			} else {
				return {
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: sliceNumber,
					sliceEnd: sliceNumber,
					turnCount: turnCount
				};
			}
		} else if (new RegExp(`^\d+-\d+${faceListSubRegExp}w${directionListSubRegExp}`).test(moveString)) { // 2-3Rw, 3-4Uw', 4-6Fw2
			let [sliceBegin, sliceEnd] = moveString.match(/\d+/g);
			[sliceBegin, sliceEnd] = [Math.min(sliceBegin, sliceEnd), Math.max(sliceBegin, sliceEnd)];
			let turnCount = CubeMoveParser.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1));
			if (sliceBegin < 2 || sliceEnd >= cubeSize) {
				throw `Error : Applying an inner slice move involving slices from ${sliceBegin} to ${sliceEnd} on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			} else if (sliceBegin - 1 > cubeSize - sliceEnd) {
				return {
					face: CubeMoveParser.getOppositeFace(CubeMoveParser.parseFace(moveString)),
					sliceBegin: cubeSize + 1 - sliceEnd,
					sliceEnd: cubeSize + 1 - sliceBegin,
					turnCount: CubeMoveParser.cleanTurnCount(-turnCount)
				};
			} else {
				return {
					face: CubeMoveParser.parseFace(moveString),
					sliceBegin: sliceBegin,
					sliceEnd: sliceEnd,
					turnCount: turnCount
				};
			}
		} else {
			throw "Error : Wrong structure for CubeMove.";
		}
	};
}
