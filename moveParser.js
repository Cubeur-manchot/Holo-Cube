"use strict";

// Represents the information of a move sequence parser.

class MoveSequenceParser {
	constructor(run) {
		this.run = run;
		this.run.log("Creating new MoveSequenceParser.", 1);
		switch(this.run.blankPuzzle.shape) {
			case Cube.shape:
				this.moveParser = new CubeMoveParser(this.run);
				this.run.log("Attaching CubeMoveParser to MoveSequenceParser.", 3);
				break;
			default:
				this.run.throwError(`Cannot parse move sequence for puzzle type ${this.run.blankPuzzle.shape}.`);
		}
	};
	parseMoveSequence = moveSequenceInput => {
		this.run.log(`Parsing sequence ${moveSequenceInput}.`, 1);
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
		this.run.log("Creating new MoveParser.", 3);
		this.blankPuzzle = run.blankPuzzle;
	};
}

class CubeMoveParser extends MoveParser {
	constructor(run) {
		super(run);
		this.run.log("Creating new CubeMoveParser.", 1);
		this.cubeSize = this.blankPuzzle.puzzleSize;
	};
	parseMove = moveString => {
		let faceListSubRegExp = "[UFRDBL]";
		let directionListSubRegExp = "('?\\d*|\\d+')"; // empty, ', 2, 2', '2
		if (new RegExp(`^[xyz]${directionListSubRegExp}$`).test(moveString)) { // x, y', z2, ...
			return new CubeMove({
				face: this.getExternalFace(moveString[0]),
				sliceBegin: 1,
				sliceEnd: this.cubeSize,
				turnCount: this.parseTurnCountFromSuffix(moveString.substring(1)),
				run: this.run
			});
		} else if (this.cubeSize === 1) {
			this.run.throwError("Applying an incorrect move on a 1x1x1 cube.");
		} else if (new RegExp(`^${faceListSubRegExp}${directionListSubRegExp}$`).test(moveString)) { // R, U', F2, ...
			return new CubeMove({
				face: moveString[0],
				sliceBegin: 1,
				sliceEnd: 1,
				turnCount: this.parseTurnCountFromSuffix(moveString.substring(1)),
				run: this.run
			});
		} else if (this.cubeSize === 2) {
			this.run.throwError("Applying an incorrect move on a 2x2x2 cube.");
		} else if (new RegExp(`^${faceListSubRegExp.toLowerCase()}${directionListSubRegExp}$`).test(moveString)) { // r, u', f2
			return new CubeMove({
				face: this.parseFace(moveString[0]),
				sliceBegin: this.cubeSize === 3 ? 1 : 2,
				sliceEnd: 2,
				turnCount: this.parseTurnCountFromSuffix(moveString.substring(1)),
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
					face: this.getExternalFace(moveString.replace(/^\d*/, "")[0]),
					sliceBegin: (this.cubeSize - middleSliceCount) / 2 + 1,
					sliceEnd: (this.cubeSize + middleSliceCount) / 2,
					turnCount: this.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1)),
					run: this.run
				});
			} else {
				this.run.throwError(`Applying an inner slice move involving ${middleSliceCount} slices on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			}
		} else if (new RegExp(`^\\d*${faceListSubRegExp}w${directionListSubRegExp}$`).test(moveString)) { // Rw, Uw', 3Fw2, ...
			let numberOfSlices = moveString.match(new RegExp("^\\d*"))[0];
			if (numberOfSlices <= 1) {
				this.run.throwError(`Applying a wide move with less than 2 layers (${numberOfSlices}).`);
			} else if (numberOfSlices < this.cubeSize) {
				return new CubeMove({
					face: this.parseFace(moveString),
					sliceBegin: 1,
					sliceEnd: numberOfSlices === "" ? 2 : numberOfSlices,
					turnCount: this.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1)),
					run: this.run
				});
			} else {
				this.run.throwError(`Applying an outer slice move involving ${numberOfSlices} slices on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			}
		} else if (new RegExp(`^\\d+${faceListSubRegExp}${directionListSubRegExp}$`, "i").test(moveString)) { // 2R, 3U', 4F2
			let sliceNumber = moveString.match(/\d+/)[0];
			let turnCount = this.parseTurnCountFromSuffix(moveString.replace(/^\d+/, "").substring(1));
			if (sliceNumber < 2 || sliceNumber >= this.cubeSize) {
				this.run.throwError(`Applying an inner slice move involving the slice of rank ${sliceNumber} on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			} else if (sliceNumber > (this.cubeSize + 1) / 2) {
				return new CubeMove({
					face: this.getOppositeFace(this.parseFace(moveString)),
					sliceBegin: this.cubeSize + 1 - sliceNumber,
					sliceEnd: this.cubeSize + 1 - sliceNumber,
					turnCount: this.cleanTurnCount(-turnCount),
					run: this.run
				});
			} else {
				return new CubeMove({
					face: this.parseFace(moveString),
					sliceBegin: sliceNumber,
					sliceEnd: sliceNumber,
					turnCount: turnCount,
					run: this.run
				});
			}
		} else if (new RegExp(`^\\d+-\\d+${faceListSubRegExp}w${directionListSubRegExp}`).test(moveString)) { // 2-3Rw, 3-4Uw', 4-6Fw2
			let [sliceBegin, sliceEnd] = moveString.match(/\d+/g);
			[sliceBegin, sliceEnd] = [Math.min(sliceBegin, sliceEnd), Math.max(sliceBegin, sliceEnd)];
			let turnCount = this.parseTurnCountFromSuffix(moveString.substring(moveString.indexOf("w") + 1));
			if (sliceBegin < 2 || sliceEnd >= this.cubeSize) {
				this.run.throwError(`Applying an inner slice move involving slices from ${sliceBegin} to ${sliceEnd} on a ${this.cubeSize}x${this.cubeSize}x${this.cubeSize} cube.`);
			} else if (sliceBegin - 1 > this.cubeSize - sliceEnd) {
				return new CubeMove({
					face: this.getOppositeFace(this.parseFace(moveString)),
					sliceBegin: this.cubeSize + 1 - sliceEnd,
					sliceEnd: this.cubeSize + 1 - sliceBegin,
					turnCount: this.cleanTurnCount(-turnCount),
					run: this.run
				});
			} else {
				return new CubeMove({
					face: this.parseFace(moveString),
					sliceBegin: sliceBegin,
					sliceEnd: sliceEnd,
					turnCount: turnCount,
					run: this.run
				});
			}
		} else {
			this.run.throwError("Wrong structure for CubeMove.");
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
