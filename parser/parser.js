const config = require("../config.json");
const dataSet = "data-set/" + config.dataSet;
const fs = require("fs");
const Email = require("../parser/Email.js");

let parser = {};


parser.seperateEmails = function(str) {
    let rawEmailArray = 
        str.match(/(From\s.*\s\d{4})(.|[\n\r])*?(?=(From\s.*\s\d{4}|$(?![\r\n])))/g);
    return rawEmailArray;
}


parser.init = function() {
    let content = fs.readFileSync(dataSet, "utf8");
    let rawEmailArray = parser.seperateEmails(content);
    console.log("LOADED " + rawEmailArray.length + " RAW EMAILS");

    let emailArray = [];

    rawEmailArray.forEach(function(element) {
        emailArray.push(new Email(element));
    });

    

    // for (let i = 0; i < 100; i++) {
    //     console.log(emailArray[i]);
    // }

};





module.exports = parser;