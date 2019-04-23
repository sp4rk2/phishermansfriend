const config = require("../config.json");
const fs = require("fs");

const combiner = {};

const combinerInputFiles = config.combinerInputFiles;
const combinerOutputFile = config.combinerOutputFile;

combiner.init = () => {
    combiner.output = [];
    for (let i = 0; i < combinerInputFiles.length; i++) {
        let dataSet = combinerInputFiles[i][0];
        let content = JSON.parse(fs.readFileSync(dataSet, "utf8"));
        for (let j = 0; j < content.length; j++) {
            content[j]["type"] = combinerInputFiles[i][1];
            combiner.output.push(content[j]);
        }
    }
    combiner.output.sort(() => Math.random() - 0.5);
    combiner.save();
}

combiner.save = () => {
    console.log("Completed combining emails.");
    console.log("Saving combined data to " + combinerOutputFile + ".");
    fs.writeFileSync(combinerOutputFile, JSON.stringify(combiner.output, null, 4));
}


module.exports = combiner;