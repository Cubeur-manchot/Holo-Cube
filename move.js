"use strict";

// Represent the permutation induced by a move
class Move {
	constructor(cycleList) {
		this.cycles = cycleList;
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
	constructor(cycleList) {
		super();
	};
	static cleanTurnCount = turnCount => {
		return turnCount % 4 + (turnCount < 0 ? 4 : 0);
	};
	static parseTurnCountFromSuffix = suffix => {
		let numberMatches = suffix.match(/\d+/);
		return CubeMove.cleanTurnCount((numberMatches ? parseInt(numberMatches[0]) : 1) * (/'/.test(suffix) ? -1 : 1));
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
	static parseMove = (moveString, cubeSize) => {
		let faceListSubRegExp = "[UFRDBL]";
		let directionListSubRegExp = "('?\d*|\d+')"; // empty, ', 2, 2', '2
		if (new RegExp(`^[xyz]${directionListSubRegExp}$`).test(moveString)) { // x, y', z2, ...
			return {
				face: CubeMove.getExternalFace(moveString[0]),
				sliceBegin: 1,
				sliceEnd: cubeSize,
				turnCount: CubeMove.parseTurnCountFromSuffix(moveString.substring(1))
			};
		} else if (cubeSize === 1) {
			throw "Error : Applying a non-rotation move on 1x1x1 cube.";
		} else if (new RegExp(`^${faceListSubRegExp}${directionListSubRegExp}$`).test(moveString)) { // R, U', F2, ...
			return {
				face: moveString[0],
				sliceBegin: 1,
				sliceEnd: 1,
				turnCount: CubeMove.parseTurnCountFromSuffix(moveString.substring(0))
			};
		} else if (cubeSize === 2) {
			throw "Error : Applying a inner slice move or a move involving at least 2 layers on a 2x2x2 cube.";
		} else if (new RegExp(`^${faceListSubRegExp.toLowerCase()}${directionListSubRegExp}$`).test(moveString)) { // r, u', f2
			return {
				face: CubeMove.parseFace(moveString[0]),
				sliceBegin: cubeSize === 3 ? 1 : 2,
				sliceEnd: 2,
				turnCount: CubeMove.parseTurnCountFromSuffix(moveString.substring(1))
			};
		} else if (new RegExp(`/^\d*[MES]${directionListSubRegExp}`, "i").test(moveString)) { // M, E', S2
			let middleSliceCount = moveString.match(/\d+/)[0] ?? 1;
			if ((middleSliceCount + cubeSize) % 2) {
				throw `Error : Wrong structure for CubeMove (${cubeSize % 2 ? "odd" : "even"} cube size and ${cubeSize % 2 ? "even" : "odd"}`
				+ " number of slices for middle slice move).";
			} else if (middleSliceCount < cubeSize && middleSliceCount > 0) {
				return {
					face: CubeMove.getExternalFace(moveString.replace(/^\d*/, "")[0]),
					sliceBegin: (cubeSize - middleSliceCount) / 2 + 1,
					sliceEnd: (cubeSize + middleSliceCount) / 2,
					turnCount: CubeMove.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1))
				};
			} else {
				throw `Error : Applying an inner slice move involving ${middleSliceCount} slices on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			}
		} else if (new RegExp(`^$\d*${faceListSubRegExp}w${directionListSubRegExp}$`).test(moveString)) { // Rw, Uw', 3Fw2, ...
			let numberOfSlices = moveString.match(new RegExp("^\d*"))[0];
			if (numberOfSlices < cubeSize) {
				return {
					face: CubeMove.parseFace(moveString),
					sliceBegin: 1,
					sliceEnd: numberOfSlices === "" ? 2 : numberOfSlices,
					turnCount: CubeMove.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1))
				};
			} else {
				throw `Error : Applying an outer slice move involving ${numberOfSlices} slices on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			}
		} else if (new RegExp(`^\d+${faceListSubRegExp}${directionListSubRegExp}$`, "i").test(moveString)) { // 2R, 3U', 4F2
			let sliceNumber = moveString.match(/\d+/)[0];
			let turnCount = CubeMove.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1));
			if (sliceNumber < 2 || sliceNumber >= cubeSize) {
				throw `Error : Applying an inner slice move involving the slice of rank ${sliceNumber} on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			} else if (sliceNumber > (cubeSize + 1) / 2) {
				return {
					face: CubeMove.getOppositeFace(CubeMove.parseFace(moveString)),
					sliceBegin: cubeSize + 1 - sliceNumber,
					sliceEnd: cubeSize + 1 - sliceNumber,
					turnCount: turnCount
				};
			} else {
				return {
					face: CubeMove.parseFace(moveString),
					sliceBegin: sliceNumber,
					sliceEnd: sliceNumber,
					turnCount: turnCount
				};
			}
		} else if (new RegExp(`^\d+-\d+${faceListSubRegExp}w${directionListSubRegExp}`).test(moveString)) { // 2-3Rw, 3-4Uw', 4-6Fw2
			let [sliceBegin, sliceEnd] = moveString.match(/\d+/g);
			[sliceBegin, sliceEnd] = [Math.min(sliceBegin, sliceEnd), Math.max(sliceBegin, sliceEnd)];
			let turnCount = CubeMove.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1));
			if (sliceBegin < 2 || sliceEnd >= cubeSize) {
				throw `Error : Applying an inner slice move involving slices from ${sliceBegin} to ${sliceEnd} on a ${cubeSize}x${cubeSize}x${cubeSize} cube.`;
			} else if (sliceBegin - 1 > cubeSize - sliceEnd) {
				return {
					face: CubeMove.getOppositeFace(CubeMove.parseFace(moveString)),
					sliceBegin: cubeSize + 1 - sliceEnd,
					sliceEnd: cubeSize + 1 - sliceBegin,
					turnCount: CubeMove.cleanTurnCount(-turnCount)
				};
			} else {
				return {
					face: CubeMove.parseFace(moveString),
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

class CubeRotationMove {
}

class CubeOuterSliceHalfOrMoreMove {
	constructor(face, numberOfSlices, cubeSize, direction)
}

class CubeOuterSliceMoreThanHalfMove {
}
