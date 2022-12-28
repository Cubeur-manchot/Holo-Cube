const callHoloCube = () => {
    let algList = [
        "R U R' U'",
        "R2' F2 r U r' F2 R F' R",
        "M2 E2 S2"
    ];
    let run = new Run({
        puzzle: {
            fullName: "cube3x3x3"
        },
        moveSequenceList: algList
    });
	let holoCubeResult = run.run();
    let destinationTag = document.querySelector("div#holoCubeResults");
    for (let algIndex = 0; algIndex < algList.length; algIndex++) {
        // create an alg card
        let algCardTag = document.createElement("div");
        algCardTag.setAttribute("class", "algCard");
        // use the svg as an image
        algCardTag.appendChild(holoCubeResults.svgList[algIndex]);
        // create the alg tag
        let algTag = document.createElement("div");
        algTag.setAttribute("class", "alg");
        algTag.textContent = algList[algIndex];
        algCardTag.appendChild = algTag;
        destinationTag.appendChild(algCardTag);
    }
};
