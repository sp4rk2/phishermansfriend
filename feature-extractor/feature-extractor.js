const config = require("../config.json");
const featureCollection = require("./feature-collection.js");
const fs = require("fs");

const extractorInputFile = config.extractorInputFile;
const extractorOutputFileX = config.extractorOutputFileX;
const extractorOutputFileY = config.extractorOutputFileY;
const extractorOutputFileXTest = config.extractorOutputFileXTest;
const extractorOutputFileYTest = config.extractorOutputFileYTest;

const extractor = {};

extractor.init = () => {
    extractor.x = [];
    extractor.y = [];
    let content = JSON.parse(fs.readFileSync(extractorInputFile, "utf8"));
    for (let email of content) {
        let featureArray = [];
        let expectedArray = [];
        if (email.type == "HAM") expectedArray = [0];
        else expectedArray = [1];
        for (let feature in config.features) {
            if (config.features[feature] === true) {
                featureArray.push(featureCollection[feature](email));
                if (config.debug == true) console.log(email.messageId + " for " + feature + " returned " + result);
            }
        }
        extractor.x.push(featureArray);
        extractor.y.push(expectedArray);
    }
    extractor.save();
    extractor.split();
};

extractor.split = () => {
    extractor.xPhish = [];
    extractor.yPhish = [];
    extractor.xHam = [];
    extractor.yHam = [];
    for (let i = 0; i < extractor.y.length; i++) {
        if (extractor.y[i][0] === 1) {
            extractor.xPhish.push(extractor.x[i]);
            extractor.yPhish.push(extractor.y[i]);
        } else {
            extractor.xHam.push(extractor.x[i]);
            extractor.yHam.push(extractor.y[i]);
        }
    }

    extractor.featurePhish = [];
    extractor.featureHam = [];
    for (let i = 0; i < extractor.xPhish[0].length; i++) {
        extractor.featurePhish[i] = [];
        extractor.featureHam[i] = [];
        for (let j = 0; j < extractor.xPhish.length; j++) {
            extractor.featurePhish[i].push(extractor.xPhish[j][i]);
            extractor.featureHam[i].push(extractor.xHam[j][i]);
        }
    }

    extractor.featurePhishMean = [];
    extractor.featureHamMean = [];
    for (let i = 0; i < extractor.featurePhish.length; i++) {
        extractor.featurePhishMean.push(extractor.mean95(extractor.featurePhish[i]));
        extractor.featureHamMean.push(extractor.mean95(extractor.featureHam[i]));
    }

    console.log(extractor.featurePhishMean);
    console.log(extractor.featureHamMean);
}

extractor.mean95 = values => {
	let sum = 0;
	for (let i = 0; i < values.length; i++) {
		sum += values[i];
	}
	let average = sum / values.length;
	console.log("Initial average = " + average);
	console.log("Total number of points = " + values.length);
	let difsum = 0
	for (let i = 0; i < values.length; i++) {
		difsum += Math.pow((values[i] - average), 2);
	}
	let std = Math.sqrt(difsum / values.length);
	let upper_limit = average + (2 * std);
	let lower_limit = average - (2 * std);

	let values_within = [];
	for (let i = 0; i < values.length; i++) {
		if (values[i] >= lower_limit && values[i] <= upper_limit) {
			values_within.push(values[i]);
		}
	}
	console.log("Standard deviation = " + std)
	let final_sum = 0;
	for (let i = 0; i < values_within.length; i++) {
		final_sum += values_within[i];
	}
	let final_average = final_sum / values_within.length;
	console.log("Final average = " + final_average);
	console.log("Amount of data points included = " + values_within.length);
	return final_average

}

extractor.normalize = () => {
    let ranges = [];
    let featureCount = extractor.x[0].length;
    for (let feature = 0; feature < featureCount; feature++) {
        ranges.push([null, null]);
        for (let vector = 0; vector < extractor.x.length; vector++) {
            if (ranges[feature][0] == null) {
                ranges[feature][0] = extractor.x[vector][feature];
            }
            if (extractor.x[vector][feature] < ranges[feature][0]) {
                ranges[feature][0] = extractor.x[vector][feature];
            }
            if (ranges[feature][1] == null) {
                ranges[feature][1] = extractor.x[vector][feature];
            }
            if (extractor.x[vector][feature] > ranges[feature][1]) {
                ranges[feature][1] = extractor.x[vector][feature];
            }
        }
    }
    for (let feature = 0; feature < featureCount; feature++) {
        for (let vector = 0; vector < extractor.x.length; vector++) {
            extractor.x[vector][feature] = (extractor.x[vector][feature] - ranges[feature][0]) / 
                (ranges[feature][1] - ranges[feature][0]);
        }
    }
    // extractor.save();
}

extractor.save = () => {
    extractor.xTest = extractor.x.slice(0, Number(extractor.x.length * config.extractorTestPercent) / 100);
    extractor.x = extractor.x.slice(Number(extractor.x.length * config.extractorTestPercent) / 100);
    extractor.yTest = extractor.y.slice(0, Number(extractor.y.length * config.extractorTestPercent) / 100);
    extractor.y = extractor.y.slice(Number(extractor.y.length * config.extractorTestPercent) / 100);

    console.log(extractor.x.length);
    console.log(extractor.y.length);
    console.log("Saving extracted training data to " + extractorOutputFileX + ".");
    fs.writeFileSync(extractorOutputFileX, "const xData = " + JSON.stringify(extractor.x, null, 4));
    console.log("Saving expected training data to " + extractorOutputFileY + ".");
    fs.writeFileSync(extractorOutputFileY, "const yData = " + JSON.stringify(extractor.y, null, 4));
    console.log("Saving extracted testing data to " + extractorOutputFileXTest + ".");
    fs.writeFileSync(extractorOutputFileXTest, "const xTestData = " + JSON.stringify(extractor.xTest, null, 4));
    console.log("Saving expected testing data to " + extractorOutputFileYTest + ".");
    fs.writeFileSync(extractorOutputFileYTest, "const yTestData = " + JSON.stringify(extractor.yTest, null, 4));
}

module.exports = extractor;