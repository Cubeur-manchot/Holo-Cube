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
	static isArray = object => {
		return !Utils.isUndefinedOrNull(object)
			&& typeof object === "object"
			&& typeof object[Symbol.iterator] === "function";
	};
	static isArrayOfStrings = object => {
		return Utils.isArray(object)
			&& !object.find(element => !Utils.isString(element));
	};
}
