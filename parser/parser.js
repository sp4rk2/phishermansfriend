const config = require("../config.json");
const fs = require("fs");
const simpleParser = require('mailparser').simpleParser;

const parserInputFile = config.parserInputFile;
const parserOutputFile = config.parserOutputFile;

const parser = {};

parser.mbox = () => {
    let content = fs.readFileSync(parserInputFile, "utf8");
    let rawEmailArray = parser.seperateEmails(content);
    console.log("Loaded " + rawEmailArray.length + " raw emails from " + parserInputFile + ".");
    parser.createObjects(rawEmailArray);
};

parser.file = () => {
    let content = fs.readdirSync(parserInputFile);
    let rawEmailArray = [];
    for (let i = 0; i < content.length; i++) {
        rawEmailArray.push(fs.readFileSync(parserInputFile + content[i], "utf-8"));
    }
    parser.createObjects(rawEmailArray);
};

parser.seperateEmails = str => {
    return str.match(/(From\s.*\s\d{4})(.|[\n\r])*?(?=(From\s.*\s\d{4}|$(?![\r\n])))/g);
};

parser.stripKey = (key, value) => {
    let pattern = new RegExp(key + ": ", "gi");
    return value.replace(pattern, "");
};

parser.assignValue = data => {
    try {
        return data.value;
    } catch {
        return [];
    }
};

parser.createObjects = rawEmailArray => {
    console.log("Parsing emails.");
    parser.emailArray = [];
    for (let i = 0; i < rawEmailArray.length; i++) {
        simpleParser(rawEmailArray[i], (err, parsed) => {
            //Create Email object.
            let Email = {
                headers: {},
                content: {},
            };

            //Assign header values.
            for (let i = 0; i < parsed.headerLines.length; i++) {
                Email.headers[parsed.headerLines[i].key] = parser.stripKey(parsed.headerLines[i].key, 
                    parsed.headerLines[i].line);
            }

            //Assign content, subject, messageId, date, to, from and replyTo.
            Email.content.text = parsed.text;
            if (parsed.html !== false) {
                Email.content.html = parsed.html;
            }

            Email.subject = parsed.subject;
            Email.messageId = parsed.messageId;
            Email.date = parsed.date;

            Email.to = parser.assignValue(parsed.to);
            Email.from = parser.assignValue(parsed.from);
            Email.replyTo = parser.assignValue(parser.replyTo);

            //Push to main array.
            parser.emailArray.push(Email);

            //Check if its completed.
            if (parser.emailArray.length == rawEmailArray.length) {
                if (config.save) parser.saveDataSet();
            }
        });
    }
};

parser.saveDataSet = () => {
    console.log("Completed parsing emails.");
    console.log("Saving parsed data to " + parserOutputFile + ".");
    fs.writeFileSync(parserOutputFile, JSON.stringify(parser.emailArray, null, 4));
}

module.exports = parser;