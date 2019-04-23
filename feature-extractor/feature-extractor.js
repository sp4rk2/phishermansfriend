const config = require("../config.json");
const featureCollection = require("./feature-collection.js");
const fs = require("fs");

const extractorInputFile = config.extractorInputFile;
const extractorOutputFileX = config.extractorOutputFileX;
const extractorOutputFileY = config.extractorOutputFileY;

const extractor = {};

extractor.init = () => {
    extractor.x = [];
    extractor.y = [];
    let content = JSON.parse(fs.readFileSync(extractorInputFile, "utf8"));
    for (let email of content) {
        let featureArray = [];
        let expectedArray = [];
        if (email.type == "HAM") expectedArray = [1, 0];
        else expectedArray = [0, 1];

        for (let feature in config.features) {
            if (config.features[feature] === true) {
                featureArray.push(featureCollection[feature](email));
                if (config.debug == true) console.log(email.messageId + " for " + feature + " returned " + result);
            }
        }
        extractor.x.push(featureArray);
        extractor.y.push(expectedArray);
    }
    if (config.debug) extractor.stats();
    extractor.save();
};

extractor.save = () => {
    console.log("Saving extracted data to " + extractorOutputFileX + ".");
    fs.writeFileSync(extractorOutputFileX, "const xData = " + JSON.stringify(extractor.x, null, 4));
    console.log("Saving expected data to " + extractorOutputFileY + ".");
    fs.writeFileSync(extractorOutputFileY, "const yData = " + JSON.stringify(extractor.y, null, 4));
}

extractor.stats = () => {
    let table = {"total": extractor.x.length};
    for (let element of extractor.x) {
        for (let feature in element) {
            if (!(feature in table)) {
                table[feature] = 0;
            } else if (element[feature] == 1) {
                table[feature] += 1;
            }
        }
    }
    console.log(table);
}

module.exports = extractor;