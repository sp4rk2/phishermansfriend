const config = require("../config.json");
const parser = require("../parser/parser.js");
const extractor = require("../feature-extractor/feature-extractor.js");
const combiner = require("../parser/combiner.js");
const preparer = require("../parser/preparer.js");

const task = process.env.npm_config_task;
const mode = process.env.npm_config_mode;

(function controller() {
    if (task == "parse") {
        if (mode == "mbox") parser.mbox();
        if (mode == "file") parser.file();
        if (mode == "count") parser.count();
    }
    if (task == "combine") {
        combiner.init();
    }
    if (task == "prepare") {
        preparer.init();
    }
    if (task == "extract") extractor.init();
})();