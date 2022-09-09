"use strict";

const updateHtmlTagSelectorVisibility = value => {
	document.querySelector("div#htmlTagContainer").hidden = value !== "HTML tag";
}
