"use strict";

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
