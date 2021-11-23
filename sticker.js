"use strict";

// Represents the information on one colored side of one piece
class Sticker {
	constructor(color) {
		this.color = color;
	};
	getColor = () => {
		return this.color;
	};
	setColor = color => {
		this.color = color;
	};
}

const colorFromFirstLetter = {
	"w" : "white",
	"g": "green",
	"r": "red",
	"y": "yellow",
	"b": "blue",
	"o": "orange"
};

const colors = {
	"white": "w",
	"green" : "g",
	"red": "r",
	"yellow": "y",
	"blue": "b",
	"orange": "o"
};
